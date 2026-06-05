"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ChevronLeft } from "lucide-react";

// Daftar pilihan style AI
const AI_STYLES = [
  {
    id: "minimalist-elegant",
    name: "Minimalis Elegan",
    description: "Background bersih, modern, pencahayaan studio halus.",
    bgColor: "bg-stone-100",
    borderColor: "border-stone-400",
  },
  {
    id: "retro-90s",
    name: "Retro 90s",
    description: "Warna vintage dengan nuansa nostalgia tahun 90-an.",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-400",
  },
  {
    id: "cyberpunk",
    name: "Neon Cyberpunk",
    description: "Lampu neon futuristik dengan warna kontras tinggi.",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-500",
  },
  {
    id: "soft-pastel",
    name: "Soft Pastel",
    description: "Warna-warni lembut yang ceria dan playful.",
    bgColor: "bg-pink-100",
    borderColor: "border-pink-400",
  },
];

export default function StyleSelectionPage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleNext = () => {
    if (selectedStyle) {
      // Mengirim style yang dipilih ke halaman template melalui URL query
      router.push(`/template?style=${selectedStyle}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-yellow-100">
      {/* Header Navigasi */}
      <div className="w-full max-w-md flex items-center justify-between mb-8 mt-4">
        <button 
          onClick={() => router.back()}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="bg-white px-4 py-1 rounded-full border-2 border-black font-bold flex items-center shadow-[2px_2px_0_rgb(0,0,0)]">
          <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
          Choose Style
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border-4 border-white mb-8">
        <h2 className="text-2xl font-black text-center mb-6 text-gray-800">
          Pilih Gaya AI Kamu!
        </h2>

        {/* Grid Pilihan Style */}
        <div className="grid grid-cols-1 gap-4">
          {AI_STYLES.map((style) => (
            <div
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`cursor-pointer p-4 rounded-2xl border-4 transition-all duration-200 ${
                style.bgColor
              } ${
                selectedStyle === style.id
                  ? `${style.borderColor} scale-105 shadow-lg`
                  : "border-transparent hover:scale-[1.02]"
              }`}
            >
              <h3 className="font-bold text-lg text-gray-800">{style.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{style.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Lanjut */}
      <div className="w-full max-w-md mt-auto pb-4">
        <button
          onClick={handleNext}
          disabled={!selectedStyle}
          className={`w-full flex items-center justify-center font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-200 shadow-[0_8px_0_rgb(0,0,0)] ${
            selectedStyle
              ? "bg-green-400 hover:bg-green-300 text-black hover:translate-y-1 hover:shadow-[0_4px_0_rgb(0,0,0)]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
          }`}
        >
          Next Step
          <ArrowRight className="ml-2 w-6 h-6" />
        </button>
      </div>
    </main>
  );
}