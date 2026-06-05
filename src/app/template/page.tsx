"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const TEMPLATES = [
  // Page 1
  { id: "twin-strip-6", name: "Classic Twin Strip (2x6)", slots: 3, description: "Kertas dibagi 2 strip. (Mesin butuh 3 jepretan).", layoutVisual: <div className="flex gap-1 h-16 w-12 bg-white p-1 border-2 border-gray-300"><div className="flex-1 flex flex-col gap-1 bg-gray-100"><div className="flex-1 bg-white border border-gray-200"></div><div className="flex-1 bg-white border border-gray-200"></div></div><div className="flex-1 flex flex-col gap-1 bg-gray-100"><div className="flex-1 bg-white border border-gray-200"></div><div className="flex-1 bg-white border border-gray-200"></div></div></div> },
  { id: "wedding-elegant-3", name: "Wedding Elegance", slots: 3, description: "Desain minimalis eksklusif font klasik.", layoutVisual: <div className="flex flex-col gap-1 h-16 w-12 bg-stone-50 p-1 border-2 border-stone-300 items-center"><div className="w-full h-4 bg-white border border-stone-200"></div><div className="w-full h-4 bg-white border border-stone-200"></div><div className="w-4 h-1 bg-stone-300 mt-1"></div></div> },
  { id: "strip-3", name: "Cute Strip (3 Foto)", slots: 3, description: "Gaya photobooth memanjang stiker lucu.", layoutVisual: <div className="flex flex-col gap-1 h-16 w-10 bg-pink-200 p-1 border-2 border-pink-400 relative"><div className="flex-1 bg-white"></div><div className="flex-1 bg-white"></div><div className="flex-1 bg-white"></div></div> },
  { id: "dark-elegant-3", name: "Dark Romance", slots: 3, description: "Tema hitam elegan untuk momen sakral.", layoutVisual: <div className="flex flex-col gap-1 h-16 w-12 bg-black p-1 border-2 border-gray-800 items-center"><div className="w-full h-4 bg-gray-800"></div><div className="w-full h-4 bg-gray-800"></div><div className="w-4 h-1 bg-yellow-600 mt-1"></div></div> },

  // Page 2
  { id: "film-3", name: "Retro Film (3 Foto)", slots: 3, description: "Desain rol film kodak vintage.", layoutVisual: <div className="flex flex-col gap-1 h-16 w-10 bg-black p-1 border-l-2 border-r-2 border-dashed border-gray-500"><div className="flex-1 bg-gray-200"></div><div className="flex-1 bg-gray-200"></div></div> },
  { id: "wanted-poster-1", name: "Wanted Poster", slots: 1, description: "Gaya poster buronan Wild West lucu.", layoutVisual: <div className="h-16 w-12 bg-yellow-700 p-1 relative"><div className="w-full h-full bg-yellow-100 border border-yellow-800 flex flex-col items-center"><div className="text-[4px] mt-1 font-black">WANTED</div><div className="w-8 h-8 bg-gray-300 mt-1"></div></div></div> },
  { id: "photocards-4", name: "Idol Photocards", slots: 4, description: "4 Foto terpisah ala photocard K-Pop.", layoutVisual: <div className="grid grid-cols-2 grid-rows-2 gap-1 h-16 w-16 bg-blue-100 p-1 border-2 border-blue-200"><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div><div className="bg-white rounded-sm"></div></div> },
  { id: "grid-4", name: "Polaroid Grid", slots: 4, description: "Empat foto kotak kamera instan.", layoutVisual: <div className="grid grid-cols-2 grid-rows-2 gap-1 h-16 w-16 bg-yellow-50 p-1 border-2 border-gray-300"><div className="bg-white border border-gray-200"></div><div className="bg-white border border-gray-200"></div><div className="bg-white border border-gray-200"></div><div className="bg-white border border-gray-200"></div></div> },

  // Page 3
  { id: "minimalist-grid-9", name: "Aesthetic Grid (9)", slots: 9, description: "Grid 3x3 kekinian ala Instagram. (Mesin butuh 9 jepretan).", layoutVisual: <div className="grid grid-cols-3 grid-rows-3 gap-[2px] h-16 w-16 bg-white p-1 border-2 border-gray-300"><div className="bg-gray-200"></div><div className="bg-gray-200"></div><div className="bg-gray-200"></div><div className="bg-gray-200"></div><div className="bg-gray-200"></div><div className="bg-gray-200"></div></div> },
  { id: "scrapbook-2", name: "Scrapbook (2 Foto)", slots: 2, description: "Dua foto tertempel miring dengan selotip.", layoutVisual: <div className="h-16 w-16 bg-orange-100 p-1 border-2 border-orange-300 relative flex flex-col items-center justify-center gap-1"><div className="w-8 h-5 bg-white rotate-6 border border-gray-300"></div><div className="w-8 h-5 bg-white -rotate-6 border border-gray-300"></div></div> },
  { id: "magazine-1", name: "Magazine Cover", slots: 1, description: "Satu foto besar ala sampul majalah.", layoutVisual: <div className="h-16 w-12 bg-white p-1 border-2 border-gray-400 relative"><div className="w-full h-full bg-gray-200 mt-1"></div></div> },
  { id: "polaroid-single", name: "Classic Polaroid", slots: 1, description: "Satu foto bergaya polaroid klasik.", layoutVisual: <div className="h-16 w-12 bg-white p-1 pb-3 border-2 border-gray-300"><div className="w-full h-full bg-gray-200"></div></div> },
];

function TemplateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const style = searchParams.get("style");
  
  const [selectedTemplate, setSelectedTemplate] = useState<{id: string, slots: number} | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(TEMPLATES.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = TEMPLATES.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (selectedTemplate && style) {
      router.push(`/capture?style=${style}&template=${selectedTemplate.id}&slots=${selectedTemplate.slots}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-blue-100 overflow-hidden">
      <div className="w-full max-w-md flex items-center justify-between mb-4 mt-2">
        <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-md"><ChevronLeft className="w-6 h-6 text-gray-700" /></button>
        <div className="bg-white px-4 py-1 rounded-full border-2 border-black font-bold flex items-center shadow-[2px_2px_0_rgb(0,0,0)]">
          <Layout className="w-4 h-4 mr-2 text-blue-500" /> Choose Layout
        </div>
        <div className="w-10"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-5 shadow-xl border-4 border-black mb-4 min-h-[480px] flex flex-col">
        <h2 className="text-2xl font-black text-center mb-6 text-gray-800">Pilih Frame Cetak</h2>
        
        <div className="grid grid-cols-1 gap-3 flex-1">
          {currentTemplates.map((tpl) => (
            <div key={tpl.id} onClick={() => setSelectedTemplate({ id: tpl.id, slots: tpl.slots })} className={`cursor-pointer p-3 rounded-2xl border-4 flex items-center gap-4 transition-all duration-200 ${selectedTemplate?.id === tpl.id ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-lg" : "border-gray-100 bg-white"}`}>
              <div className="flex-shrink-0 flex items-center justify-center w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">{tpl.layoutVisual}</div>
              <div className="flex-1">
                <h3 className="font-bold text-[15px] text-gray-800 leading-tight">{tpl.name}</h3>
                <p className="text-[11px] text-gray-600 mt-1 leading-tight">{tpl.description}</p>
                <span className="inline-block mt-2 text-[10px] bg-black text-white px-2 py-1 rounded-full font-bold shadow-sm">Butuh {tpl.slots} Jepretan</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-gray-100">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}><ChevronLeft className="w-6 h-6" /></button>
          <div className="flex gap-1.5 font-bold text-xs text-gray-500">Page {currentPage} of {totalPages}</div>
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`p-2 rounded-full ${currentPage === totalPages ? 'text-gray-300' : 'text-blue-500 hover:bg-blue-50'}`}><ChevronRight className="w-6 h-6" /></button>
        </div>
      </div>

      <div className="w-full max-w-md mt-auto pb-4">
        <button onClick={handleNext} disabled={!selectedTemplate} className={`w-full flex items-center justify-center font-black py-4 px-8 rounded-2xl text-xl shadow-[0_6px_0_rgb(0,0,0)] ${selectedTemplate ? "bg-pink-400 text-black hover:translate-y-1 hover:shadow-[0_3px_0_rgb(0,0,0)]" : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"}`}>
          To Camera <ArrowRight className="ml-2 w-6 h-6" />
        </button>
      </div>
    </main>
  );
}

// BAGIAN KRUSIAL YANG TERTINGGAL: Wajib ada export default agar Next.js bisa merender halamannya!
export default function TemplateSelectionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-blue-100 font-bold">Loading...</div>}>
      <TemplateContent />
    </Suspense>
  );
}