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

    // Memanggil endpoint edit dengan model generasi terbaru
    const response = await openai.images.edit({
      model: "gpt-image-1.5", 
      image: file,
      prompt: `Ubah latar belakang menjadi gaya ${style}, kualitas ultra HD, tata letak elegan dan minimalis modern.`,
      n: 1,
      size: "1024x1024",
      // Parameter krusial untuk mengunci fitur wajah agar tetap identik dengan aslinya
      input_fidelity: "high", 
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("OpenAI tidak mengembalikan gambar.");
    }

    const imageResult = response.data[0];
    let finalImageUrl = "";

    // Fleksibilitas membaca balasan dari OpenAI (bisa berupa Base64 atau URL)
    if (imageResult.b64_json) {
      finalImageUrl = `data:image/png;base64,${imageResult.b64_json}`;
    } else if (imageResult.url) {
      finalImageUrl = imageResult.url;
    } else {
      throw new Error("Format balasan OpenAI tidak dikenali.");
    }

    return NextResponse.json({ url: finalImageUrl });

  } catch (error: any) {
    console.error("OpenAI Error Detail:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Gagal memproses gambar" },
      { status: 500 }
    );
  }
}