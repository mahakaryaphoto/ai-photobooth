"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TEMPLATES, FramePreview, getTemplate } from "../lib/templates";

function TemplateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const style = searchParams.get("style");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(TEMPLATES.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTemplates = TEMPLATES.slice(startIndex, startIndex + itemsPerPage);

  const selected = selectedId ? getTemplate(selectedId) : null;

  const handleNext = () => {
    if (selected && style) {
      router.push(`/capture?style=${style}&template=${selected.id}&slots=${selected.slots}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-blue-100 p-6">
      <div className="mb-4 mt-2 flex w-full max-w-md items-center justify-between">
        <button onClick={() => router.back()} className="rounded-full bg-white p-2 shadow-md">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center rounded-full border-2 border-black bg-white px-4 py-1 font-bold shadow-[2px_2px_0_rgb(0,0,0)]">
          <Layout className="mr-2 h-4 w-4 text-blue-500" /> Choose Layout
        </div>
        <div className="w-10" />
      </div>

      <div className="mb-4 flex w-full max-w-md flex-col rounded-3xl border-4 border-black bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-center text-2xl font-black text-gray-800">Pilih Frame Cetak</h2>

        {/* ===== PREVIEW BESAR & JELAS (hasil = cetakan) ===== */}
        <div className="mb-5 flex flex-col items-center">
          <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-2xl">
            {selected ? (
              <FramePreview template={selected.id} width={150} />
            ) : (
              <div
                style={{ width: 150, height: 225 }}
                className="flex items-center justify-center bg-gray-50 px-3 text-center text-xs font-bold text-gray-400"
              >
                Pilih template di bawah untuk melihat preview
              </div>
            )}
          </div>
          {selected && (
            <p className="mt-2 text-center text-sm font-bold text-blue-600">{selected.name}</p>
          )}
        </div>

        {/* ===== DAFTAR TEMPLATE (thumbnail = frame asli versi mini) ===== */}
        <div className="grid flex-1 grid-cols-1 gap-3">
          {currentTemplates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelectedId(tpl.id)}
              className={`flex cursor-pointer items-center gap-4 rounded-2xl border-4 p-3 transition-all duration-200 ${
                selectedId === tpl.id
                  ? "scale-[1.02] border-blue-500 bg-blue-50 shadow-lg"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                <FramePreview template={tpl.id} compact width={54} />
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold leading-tight text-gray-800">{tpl.name}</h3>
                <p className="mt-1 text-[11px] leading-tight text-gray-600">{tpl.description}</p>
                <span className="mt-2 inline-block rounded-full bg-black px-2 py-1 text-[10px] font-bold text-white shadow-sm">
                  Butuh {tpl.slots} Jepretan
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t-2 border-gray-100 pt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`rounded-full p-2 ${currentPage === 1 ? "text-gray-300" : "text-blue-500 hover:bg-blue-50"}`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex gap-1.5 text-xs font-bold text-gray-500">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`rounded-full p-2 ${currentPage === totalPages ? "text-gray-300" : "text-blue-500 hover:bg-blue-50"}`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="mt-auto w-full max-w-md pb-4">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`flex w-full items-center justify-center rounded-2xl px-8 py-4 text-xl font-black shadow-[0_6px_0_rgb(0,0,0)] ${
            selected
              ? "bg-pink-400 text-black hover:translate-y-1 hover:shadow-[0_3px_0_rgb(0,0,0)]"
              : "cursor-not-allowed bg-gray-300 text-gray-500 shadow-none"
          }`}
        >
          To Camera <ArrowRight className="ml-2 h-6 w-6" />
        </button>
      </div>
    </main>
  );
}

export default function TemplateSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-blue-100 font-bold">Loading...</div>
      }
    >
      <TemplateContent />
    </Suspense>
  );
}
