"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout, ArrowRight, ChevronLeft } from "lucide-react";

// Daftar pilihan template 4R
const TEMPLATES = [
  {
    id: "strip-3",
    name: "Classic Strip (3 Foto)",
    slots: 3,
    description: "Gaya photobooth klasik memanjang.",
    layoutVisual: (
      <div className="flex flex-col gap-1 h-24 w-12 bg-gray-200 p-1 border-2 border-gray-400">
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-white"></div>
      </div>
    ),
  },
  {
    id: "grid-4",
    name: "Grid 2x2 (4 Foto)",
    slots: 4,
    description: "Empat foto kotak dalam satu frame.",
    layoutVisual: (
      <div className="grid grid-cols-2 grid-rows-2 gap-1 h-20 w-16 bg-gray-200 p-1 border-2 border-gray-400">
        <div className="bg-white"></div>
        <div className="bg-white"></div>
        <div className="bg-white"></div>
        <div className="bg-white"></div>
      </div>
    ),
  },
  {
    id: "single-1",
    name: "Full Frame (1 Foto)",
    slots: 1,
    description: "Satu foto besar memenuhi ukuran 4R.",
    layoutVisual: (
      <div className="h-20 w-16 bg-gray-200 p-1 border-2 border-gray-400">
        <div className="w-full h-full bg-white"></div>
      </div>
    ),
  },
];

// Komponen utama dipisahkan agar bisa dibungkus Suspense (wajib di Next.js App Router jika pakai useSearchParams)
function TemplateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const style = searchParams.get("style"); // Mengambil data style dari URL
  
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string, slots: number} | null>(null);

  const handleNext = () => {
    if (selectedTemplate && style) {
      // Mengirim style, id template, dan jumlah slot ke halaman kamera
      router.push(`/capture?style=${style}&template=${selectedTemplate.id}&slots=${selectedTemplate.slots}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-blue-100">
      {/* Header Navigasi */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-4">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="bg-white px-4 py-1 rounded-full border-2 border-black font-bold flex items-center shadow-[2px_2px_0_rgb(0,0,0)]">
          <Layout className="w-4 h-4 mr-2 text-blue-500" />
          Choose Layout
        </div>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border-4 border-white mb-8">
        <h2 className="text-2xl font-black text-center mb-6 text-gray-800">
          Pilih Frame 4R
        </h2>

        {/* Grid Pilihan Template */}
        <div className="grid grid-cols-1 gap-4">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate({ id: tpl.id, slots: tpl.slots })}
              className={`cursor-pointer p-4 rounded-2xl border-4 flex items-center gap-4 transition-all duration-200 ${
                selectedTemplate?.id === tpl.id
                  ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
                  : "border-gray-100 bg-gray-50 hover:bg-gray-100 hover:scale-[1.02]"
              }`}
            >
              {/* Visualisasi Layout */}
              <div className="flex-shrink-0 flex items-center justify-center w-20">
                {tpl.layoutVisual}
              </div>
              
              <div>
                <h3 className="font-bold text-lg text-gray-800">{tpl.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{tpl.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Lanjut */}
      <div className="w-full max-w-md mt-auto pb-4">
        <button
          onClick={handleNext}
          disabled={!selectedTemplate}
          className={`w-full flex items-center justify-center font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-200 shadow-[0_8px_0_rgb(0,0,0)] ${
            selectedTemplate
              ? "bg-pink-400 hover:bg-pink-300 text-black hover:translate-y-1 hover:shadow-[0_4px_0_rgb(0,0,0)]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
          }`}
        >
          To Camera
          <ArrowRight className="ml-2 w-6 h-6" />
        </button>
      </div>
    </main>
  );
}

export default function TemplateSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-blue-100">Loading...</div>}>
      <TemplateContent />
    </Suspense>
  );
}