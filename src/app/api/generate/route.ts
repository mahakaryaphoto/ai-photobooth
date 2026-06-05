import { NextResponse } from "next/server";
import OpenAI from "openai";
import { toFile } from "openai/uploads";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageBase64, style } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: "Gambar tidak ditemukan" }, { status: 400 });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const file = await toFile(buffer, "photo.png", { type: "image/png" });

    // AI diinstruksikan menambahkan ornamen via prompt, 
    // tetapi fitur wajah tetap dikunci agar tidak terdistorsi (tetap mirip aslinya)
    const response = await openai.images.edit({
      model: "gpt-image-1.5", 
      image: file,
      prompt: `Terapkan gaya ${style} dengan resolusi Ultra HD yang elegan. Ubah latar belakang dan tambahkan ornamen, aksesori, atau efek riasan yang relevan dengan tema.`,
      n: 1,
      size: "1024x1024",
      input_fidelity: "high", // Diganti kembali ke high agar wajah tidak rusak/berubah bentuk
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("OpenAI tidak mengembalikan gambar.");
    }

    const imageResult = response.data[0];
    const finalImageUrl = imageResult.b64_json 
      ? `data:image/png;base64,${imageResult.b64_json}` 
      : imageResult.url;

    return NextResponse.json({ url: finalImageUrl });

  } catch (error: any) {
    console.error("OpenAI Error Detail:", error.message || error);
    return NextResponse.json({ error: error.message || "Gagal memproses gambar" }, { status: 500 });
  }
}