"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronLeft, ChevronRight, Palette } from "lucide-react";

// Total 18 Styles ala Coro.ai & LumaBooth
const AI_STYLES = [
  // Page 1
  { id: "kpop-idol", name: "K-Pop Idol Glow", description: "Pencahayaan panggung flawless dengan skin-tone cerah ala Korea.", previewStyle: "bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400", icon: "🎤" },
  { id: "yearbook-90s", name: "90s Yearbook", description: "Gaya foto buku tahunan Amerika 90-an dengan efek retro.", previewStyle: "bg-gradient-to-br from-blue-200 to-indigo-300", icon: "🎓" },
  { id: "anime-manga", name: "Anime Character", description: "Ilustrasi anime Jepang 2D dengan mata lebih ekspresif.", previewStyle: "bg-gradient-to-br from-orange-400 to-red-500", icon: "🌸" },
  { id: "3d-animation", name: "3D Pixar Look", description: "Render halus ala animasi 3D dengan tekstur rambut/baju imut.", previewStyle: "bg-gradient-to-br from-cyan-400 to-blue-600", icon: "🎬" },
  { id: "minimalist-elegant", name: "Minimalis Elegan", description: "Background bersih, elegan, pencahayaan studio halus.", previewStyle: "bg-gradient-to-br from-stone-100 to-stone-300", icon: "🕊️" },
  { id: "y2k-aesthetic", name: "Y2K Sparkle", description: "Gaya tahun 2000-an dengan glitter, stiker, dan warna kontras.", previewStyle: "bg-gradient-to-tr from-fuchsia-500 to-cyan-500", icon: "💿" },
  
  // Page 2
  { id: "ethereal-fairy", name: "Ethereal Fairy", description: "Tema peri hutan dengan sayap, mahkota bunga, dan cahaya magis.", previewStyle: "bg-gradient-to-tr from-emerald-200 to-teal-400", icon: "🧚" },
  { id: "cinematic-moody", name: "Cinematic Moody", description: "Warna film layar lebar dengan kontras bayangan dramatis.", previewStyle: "bg-gradient-to-br from-gray-800 via-gray-900 to-black", icon: "🎥" },
  { id: "pro-studio", name: "Corporate / Studio", description: "Foto profil profesional dengan jas/blazer dan latar abu-abu.", previewStyle: "bg-gradient-to-b from-slate-300 to-slate-500", icon: "💼" },
  { id: "retro-90s", name: "Retro 90s Camera", description: "Warna kamera disposable vintage dengan nuansa nostalgia.", previewStyle: "bg-gradient-to-br from-orange-200 to-yellow-400", icon: "🎞️" },
  { id: "cyberpunk", name: "Neon Cyberpunk", description: "Lampu neon futuristik, aksesori siber, warna kontras tinggi.", previewStyle: "bg-gradient-to-br from-purple-600 via-pink-500 to-blue-500", icon: "🌃" },
  { id: "royal-vintage", name: "Royal Vintage", description: "Latar kerajaan, gaun klasik, dan perhiasan kerajaan Eropa.", previewStyle: "bg-gradient-to-br from-amber-700 to-yellow-900", icon: "👑" },
  
  // Page 3
  { id: "watercolor-art", name: "Watercolor Art", description: "Sentuhan cat air lembut yang estetik bak lukisan kanvas.", previewStyle: "bg-gradient-to-tr from-teal-200 to-lime-200", icon: "🎨" },
  { id: "bw-classic", name: "B&W Classic", description: "Hitam putih monokromatik yang dramatis dan timeless.", previewStyle: "bg-gradient-to-br from-gray-500 to-gray-800", icon: "📸" },
  { id: "pop-art", name: "Retro Pop-Art", description: "Gaya komik pop-art Andy Warhol dengan warna berani.", previewStyle: "bg-gradient-to-br from-yellow-400 via-red-500 to-blue-500", icon: "💥" },
  { id: "gothic-dark", name: "Dark Gothic", description: "Tema gelap elegan dengan renda hitam dan makeup tajam.", previewStyle: "bg-gradient-to-br from-slate-900 to-black", icon: "🦇" },
  { id: "wedding-prewed", name: "Wedding Bliss", description: "Nuansa pre-wedding romantis dengan gaun putih dan bunga.", previewStyle: "bg-gradient-to-br from-rose-100 to-pink-200", icon: "💍" },
  { id: "soft-pastel", name: "Soft Pastel", description: "Warna-warni lembut yang ceria dan playful.", previewStyle: "bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200", icon: "🌸" },
];

export default function StyleSelectionPage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(AI_STYLES.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentStyles = AI_STYLES.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (selectedStyle) router.push(`/template?style=${selectedStyle}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-yellow-100 overflow-hidden">
      <div className="w-full max-w-md flex items-center justify-between mb-4 mt-2">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div className="bg-white px-4 py-1 rounded-full border-2 border-black font-bold flex items-center shadow-[2px_2px_0_rgb(0,0,0)]">
          <Palette className="w-4 h-4 mr-2 text-yellow-500" /> Choose Style
        </div>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-xl border-4 border-black mb-4 relative min-h-[480px] flex flex-col">
        <h2 className="text-2xl font-black text-center mb-1 text-gray-800">Pilih Gaya AI Kamu!</h2>
        <p className="text-center text-xs text-gray-500 mb-4 font-medium leading-tight px-4">
          AI akan menambahkan sedikit ornamen agar wajahmu makin menyatu dengan tema!
        </p>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {currentStyles.map((style) => (
            <div key={style.id} onClick={() => setSelectedStyle(style.id)} className={`cursor-pointer rounded-2xl border-[3px] overflow-hidden transition-all duration-200 flex flex-col ${selectedStyle === style.id ? "border-blue-500 bg-blue-50 scale-105 shadow-lg ring-4 ring-blue-200" : "border-gray-200 hover:border-gray-300 bg-white"}`}>
              <div className={`h-16 w-full flex items-center justify-center text-3xl ${style.previewStyle}`}>{style.icon}</div>
              <div className="p-2 flex-1 flex flex-col justify-start text-center">
                <h3 className="font-bold text-[13px] text-gray-800 leading-tight mb-1">{style.name}</h3>
                <p className="text-[9px] text-gray-500 leading-tight">{style.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-100">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-2 rounded-full transition-colors ${currentPage === 1 ? 'text-gray-300' : 'text-black hover:bg-gray-100'}`}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-1.5 font-bold text-xs text-gray-500">Page {currentPage} of {totalPages}</div>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`p-2 rounded-full transition-colors ${currentPage === totalPages ? 'text-gray-300' : 'text-black hover:bg-gray-100'}`}>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mt-auto pb-4">
        <button onClick={handleNext} disabled={!selectedStyle} className={`w-full flex items-center justify-center font-black py-4 px-8 rounded-2xl text-xl transition-all shadow-[0_6px_0_rgb(0,0,0)] ${selectedStyle ? "bg-green-400 text-black hover:translate-y-1 hover:shadow-[0_3px_0_rgb(0,0,0)]" : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"}`}>
          Next Step <ArrowRight className="ml-2 w-6 h-6" />
        </button>
      </div>
    </main>
  );
}