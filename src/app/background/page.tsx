"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight, ImageIcon } from "lucide-react";
import { BACKGROUNDS } from "../lib/backgrounds";

export default function BackgroundSelectionPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(BACKGROUNDS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBackgrounds = BACKGROUNDS.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (selectedId) {
      router.push(`/capture?mode=bg&background=${selectedId}&slots=1`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-teal-100 p-6">
      <div className="mb-4 mt-2 flex w-full max-w-md items-center justify-between">
        <button onClick={() => router.back()} className="rounded-full bg-white p-2 shadow-md hover:bg-gray-50">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center rounded-full border-2 border-black bg-white px-4 py-1 font-bold shadow-[2px_2px_0_rgb(0,0,0)]">
          <ImageIcon className="mr-2 h-4 w-4 text-teal-500" /> Pilih Background
        </div>
        <div className="w-10" />
      </div>

      <div className="mb-4 flex w-full max-w-md flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-xl">
        <h2 className="mb-1 text-center text-2xl font-black text-gray-800">Pilih Latar Belakang</h2>
        <p className="mb-4 px-4 text-center text-xs font-medium leading-tight text-gray-500">
          Latar asli akan dihapus & diganti, lalu warna dan pencahayaan disesuaikan otomatis.
        </p>

        <div className="grid min-h-[360px] grid-cols-2 gap-3 content-start">
          {currentBackgrounds.map((bg) => (
            <div
              key={bg.id}
              onClick={() => setSelectedId(bg.id)}
              className={`flex cursor-pointer flex-col overflow-hidden rounded-2xl border-[3px] transition-all duration-200 ${
                selectedId === bg.id
                  ? "scale-[1.03] border-teal-500 shadow-lg ring-4 ring-teal-200"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="relative aspect-[2/3] w-full bg-gray-100">
                {bg.thumb || bg.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={(bg.thumb || bg.image) as string}
                    alt={bg.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className={`absolute inset-0 ${bg.thumbClass}`} />
                )}
              </div>
              <div className="bg-white p-2 text-center">
                <h3 className="text-[13px] font-bold leading-tight text-gray-800">{bg.name}</h3>
                {bg.description && (
                  <p className="mt-0.5 text-[9px] leading-tight text-gray-500">{bg.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t-2 border-gray-100 pt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`rounded-full p-2 ${currentPage === 1 ? "text-gray-300" : "text-teal-600 hover:bg-teal-50"}`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex gap-1.5 text-xs font-bold text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`rounded-full p-2 ${currentPage === totalPages ? "text-gray-300" : "text-teal-600 hover:bg-teal-50"}`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="mt-auto w-full max-w-md pb-4">
        <button
          onClick={handleNext}
          disabled={!selectedId}
          className={`flex w-full items-center justify-center rounded-2xl px-8 py-4 text-xl font-black shadow-[0_6px_0_rgb(0,0,0)] ${
            selectedId
              ? "bg-emerald-400 text-black hover:translate-y-1 hover:shadow-[0_3px_0_rgb(0,0,0)]"
              : "cursor-not-allowed bg-gray-300 text-gray-500 shadow-none"
          }`}
        >
          To Camera <ArrowRight className="ml-2 h-6 w-6" />
        </button>
      </div>
    </main>
  );
}
