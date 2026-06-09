import { NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ubah data URL / base64 menjadi File yang siap dikirim ke OpenAI
async function base64ToFile(dataUrl: string, name: string) {
  const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");
  return toFile(buffer, name, { type: "image/png" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, backgroundBase64, scene } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "Foto subjek tidak ditemukan" }, { status: 400 });
    }

    const subjectFile = await base64ToFile(imageBase64, "subject.png");

    // Bila ada gambar background yang dipilih, ikutkan sebagai acuan komposit.
    const images = [subjectFile];
    if (backgroundBase64) {
      const bgFile = await base64ToFile(backgroundBase64, "background.png");
      images.push(bgFile);
    }

    const sceneText = backgroundBase64
      ? "the new background provided as the second reference image"
      : scene || "a clean neutral studio backdrop";

    // Satu instruksi AI mencakup 3 langkah: hapus latar -> ganti latar -> koreksi warna & cahaya.
    const prompt = [
      `Completely remove the original background of the person in the first image.`,
      `Place the same person onto a new background: ${sceneText}.`,
      `Create a realistic composite: match the subject's white balance, exposure, and color grading to the new background; correct lighting so the direction and color temperature look consistent and natural.`,
      `Keep the person's identity, face shape, and features 100% unchanged and undistorted.`,
      `Output a sharp, photographic, vertical portrait (2:3 aspect ratio) suitable for large-format printing.`,
    ].join(" ");

    const response = await openai.images.edit({
      model: "gpt-image-1.5",
      image: images.length === 1 ? images[0] : images,
      prompt,
      n: 1,
      size: "1024x1536", // rasio 2:3 portrait
      input_fidelity: "high", // jaga wajah agar tidak berubah
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("OpenAI tidak mengembalikan gambar.");
    }

    const imageResult = response.data[0];
    const finalImageUrl = imageResult.b64_json
      ? `data:image/png;base64,${imageResult.b64_json}`
      : imageResult.url;

    return NextResponse.json({ url: finalImageUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memproses gambar";
    console.error("Background API Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
