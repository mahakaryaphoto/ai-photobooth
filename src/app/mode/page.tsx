"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ImageIcon, ChevronLeft, ArrowRight } from "lucide-react";

export default function ModeSelectionPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center bg-pink-200 p-6">
      <div className="mb-4 mt-2 flex w-full max-w-md items-center justify-between">
        <button onClick={() => router.back()} className="rounded-full bg-white p-2 shadow-md hover:bg-gray-50">
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>
        <div className="flex items-center rounded-full border-2 border-black bg-white px-4 py-1 font-bold shadow-[2px_2px_0_rgb(0,0,0)]">
          Pilih Mode
        </div>
        <div className="w-10" />
      </div>

      <div className="flex w-full max-w-md flex-1 flex-col justify-center gap-5 pb-6">
        <h2 className="mb-1 text-center text-2xl font-black text-pink-700">Mau pakai mode apa?</h2>

        {/* MODE 1: FULL AI (fitur lama) */}
        <Link href="/style" className="group">
          <div className="flex items-center gap-4 rounded-3xl border-4 border-black bg-white p-5 shadow-[0_6px_0_rgb(0,0,0)] transition-transform group-hover:translate-y-1 group-hover:shadow-[0_3px_0_rgb(0,0,0)]">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-400 to-indigo-500">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-gray-800">Full AI Style</h3>
              <p className="mt-1 text-xs leading-tight text-gray-600">
                Ubah gaya, latar, ornamen & riasan otomatis. Bisa pakai frame cetak (4R).
              </p>
            </div>
            <ArrowRight className="h-6 w-6 flex-shrink-0 text-gray-400" />
          </div>
        </Link>

        {/* MODE 2: GANTI BACKGROUND (fitur baru) */}
        <Link href="/background" className="group">
          <div className="flex items-center gap-4 rounded-3xl border-4 border-black bg-white p-5 shadow-[0_6px_0_rgb(0,0,0)] transition-transform group-hover:translate-y-1 group-hover:shadow-[0_3px_0_rgb(0,0,0)]">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600">
              <ImageIcon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-gray-800">Ganti Background</h3>
              <p className="mt-1 text-xs leading-tight text-gray-600">
                Hapus & ganti latar sesuai pilihan, koreksi warna + pencahayaan. 1 foto, tanpa frame, siap cetak 40×60 cm.
              </p>
            </div>
            <ArrowRight className="h-6 w-6 flex-shrink-0 text-gray-400" />
          </div>
        </Link>
      </div>
    </main>
  );
}
