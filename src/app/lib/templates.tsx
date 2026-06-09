"use client";

import React from "react";

/**
 * SATU SUMBER KEBENARAN UNTUK SEMUA TEMPLATE.
 * Komponen <PhotoFrame /> di file ini dipakai bersama oleh:
 *  - halaman /template  -> sebagai PREVIEW (variant pilih)
 *  - halaman /result    -> sebagai HASIL CETAK 4R
 * Sehingga preview SAMA PERSIS dengan hasil cetak (WYSIWYG).
 */

export type TemplateMeta = {
  id: string;
  name: string;
  slots: number;
  description: string;
};

export const TEMPLATES: TemplateMeta[] = [
  { id: "twin-strip-6", name: "Classic Twin Strip (2x6)", slots: 3, description: "Kertas dibagi 2 strip. (Mesin butuh 3 jepretan)." },
  { id: "wedding-elegant-3", name: "Wedding Elegance", slots: 3, description: "Desain minimalis eksklusif font klasik." },
  { id: "strip-3", name: "Cute Strip (3 Foto)", slots: 3, description: "Gaya photobooth memanjang stiker lucu." },
  { id: "dark-elegant-3", name: "Dark Romance", slots: 3, description: "Tema hitam elegan untuk momen sakral." },
  { id: "film-3", name: "Retro Film (3 Foto)", slots: 3, description: "Desain rol film kodak vintage." },
  { id: "wanted-poster-1", name: "Wanted Poster", slots: 1, description: "Gaya poster buronan Wild West lucu." },
  { id: "photocards-4", name: "Idol Photocards", slots: 4, description: "4 Foto terpisah ala photocard K-Pop." },
  { id: "grid-4", name: "Polaroid Grid", slots: 4, description: "Empat foto kotak kamera instan." },
  { id: "minimalist-grid-9", name: "Aesthetic Grid (9)", slots: 9, description: "Grid 3x3 kekinian ala Instagram. (Mesin butuh 9 jepretan)." },
  { id: "scrapbook-2", name: "Scrapbook (2 Foto)", slots: 2, description: "Dua foto tertempel rapi." },
  { id: "magazine-1", name: "Magazine Cover", slots: 1, description: "Satu foto besar ala sampul majalah." },
  { id: "polaroid-single", name: "Classic Polaroid", slots: 1, description: "Satu foto bergaya polaroid klasik." },
];

export function getTemplate(id: string): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[TEMPLATES.length - 1];
}

/**
 * Slot foto standar.
 * KUNCI PERBAIKAN POSISI: setiap slot adalah kotak ber-posisi relative,
 * dan gambar mengisi penuh secara ABSOLUTE dengan object-cover + object-center.
 * Hasilnya: foto SELALU lurus (tidak miring) dan center, apa pun rasio sumbernya.
 */
function Slot({
  src,
  className = "",
  imgClass = "",
}: {
  src?: string;
  className?: string;
  imgClass?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          crossOrigin="anonymous"
          className={`absolute inset-0 h-full w-full object-cover object-center ${imgClass}`}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300 text-[7px] font-bold uppercase tracking-wider text-slate-400">
          Foto
        </div>
      )}
    </div>
  );
}

type FrameProps = {
  /** id template */
  template: string;
  /** daftar foto (base64 / url). Kosongkan untuk mode preview placeholder. */
  photos?: string[];
  /** true = mode thumbnail kecil di daftar (teks dekoratif disembunyikan) */
  compact?: boolean;
};

/**
 * Renderer frame tunggal. Selalu mengisi 100% kontainer induknya.
 * Bungkus dengan kotak ber-rasio aspect-[2/3] (rasio kertas 4R = 4x6 inci).
 */
export function PhotoFrame({ template, photos = [], compact = false }: FrameProps) {
  const p = (i: number): string | undefined => photos[i];

  // ---- TWIN STRIP (2x6) : dua strip identik, 3 foto per strip ----
  if (template === "twin-strip-6") {
    const Strip = (prefix: string) => (
      <div className="flex flex-1 flex-col gap-2 bg-[#E8F0FE] p-3">
        {!compact && (
          <div className="mt-1 text-center text-[9px] font-black tracking-widest text-blue-800">
            PHOTOBOOTH
          </div>
        )}
        {[0, 1, 2].map((i) => (
          <Slot key={`${prefix}-${i}`} src={p(i)} className="flex-1 rounded-md border-4 border-white shadow-sm" />
        ))}
        {!compact && (
          <div className="mb-1 text-center text-[8px] font-semibold text-gray-500">05 . 06 . 2026</div>
        )}
      </div>
    );
    return (
      <div className="relative flex h-full w-full bg-white">
        <div className="absolute left-1/2 top-0 bottom-0 z-20 border-l border-dashed border-gray-300" />
        {Strip("l")}
        {Strip("r")}
      </div>
    );
  }

  // ---- WEDDING ELEGANCE ----
  if (template === "wedding-elegant-3") {
    return (
      <div className="relative flex h-full w-full flex-col gap-3 border-[12px] border-white bg-[#FAFAFA] p-6">
        <div className="pointer-events-none absolute inset-0 m-2 border border-stone-200" />
        {[0, 1, 2].map((i) => (
          <Slot key={i} src={p(i)} className="flex-1 border border-stone-300 bg-stone-100" />
        ))}
        {!compact && (
          <div className="mt-2 mb-1 text-center font-serif text-stone-600">
            <h2 className="mb-1 text-2xl italic">Elegance</h2>
            <p className="text-[7px] uppercase tracking-[0.4em] text-stone-400">The Beginning of Forever</p>
          </div>
        )}
      </div>
    );
  }

  // ---- DARK ROMANCE ----
  if (template === "dark-elegant-3") {
    return (
      <div className="relative flex h-full w-full flex-col gap-3 border-[4px] border-yellow-700 bg-black p-6">
        {[0, 1, 2].map((i) => (
          <Slot
            key={i}
            src={p(i)}
            className="flex-1 border border-yellow-600/50 bg-stone-900"
            imgClass="grayscale-[30%] contrast-125"
          />
        ))}
        {!compact && (
          <div className="mt-2 mb-1 text-center font-serif text-yellow-600">
            <h2 className="mb-1 text-2xl font-light italic tracking-wide">Robby &amp; Eka</h2>
            <p className="text-[7px] uppercase tracking-[0.4em] text-yellow-700/80">Endless Love • 2026</p>
          </div>
        )}
      </div>
    );
  }

  // ---- RETRO FILM ----
  if (template === "film-3") {
    return (
      <div className="relative flex h-full w-full flex-col gap-4 border-l-[16px] border-r-[16px] border-dashed border-gray-800 bg-black p-6">
        {[0, 1, 2].map((i) => (
          <Slot
            key={i}
            src={p(i)}
            className="flex-1 border-2 border-gray-700 bg-gray-900"
            imgClass="contrast-125 saturate-50"
          />
        ))}
      </div>
    );
  }

  // ---- WANTED POSTER (1 foto) ----
  if (template === "wanted-poster-1") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#8B5A2B] p-4">
        <div className="relative flex h-[95%] w-[90%] flex-col border border-[#D2B48C] bg-[#F5DEB3] p-4 shadow-2xl">
          {!compact && (
            <>
              <div className="mt-4 text-center font-serif text-5xl font-black tracking-widest text-[#5C4033]">WANTED</div>
              <div className="mb-4 text-center text-sm font-bold tracking-[0.3em] text-[#5C4033]">DEAD OR ALIVE</div>
            </>
          )}
          <Slot src={p(0)} className="flex-1 border-4 border-[#5C4033] bg-gray-900" imgClass="sepia-[0.4] contrast-125" />
          {!compact && (
            <div className="mt-4 text-center font-serif text-4xl font-black text-[#5C4033]">$10,000</div>
          )}
        </div>
      </div>
    );
  }

  // ---- IDOL PHOTOCARDS (grid 2x2) ----
  if (template === "photocards-4") {
    return (
      <div className="flex h-full w-full flex-col bg-blue-50 p-4">
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col rounded-xl border border-blue-100 bg-white p-2 shadow-md">
              <Slot src={p(i)} className="flex-1 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- POLAROID GRID 2x2 (DILURUSKAN — tanpa rotate) ----
  if (template === "grid-4") {
    return (
      <div className="flex h-full w-full flex-col bg-[#f4f1ea] p-6">
        <div className="grid flex-1 grid-cols-2 grid-rows-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col border border-gray-200 bg-white p-2 pb-5 shadow-md">
              <Slot src={p(i)} className="flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- AESTHETIC GRID 3x3 (9 foto) ----
  if (template === "minimalist-grid-9") {
    return (
      <div className="flex h-full w-full flex-col bg-white p-4">
        <div className="grid flex-1 grid-cols-3 grid-rows-3 gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <Slot key={i} src={p(i)} className="bg-gray-100" />
          ))}
        </div>
        {!compact && (
          <div className="mt-4 mb-2 text-center text-lg font-light uppercase tracking-[0.5em] text-gray-800">
            Moments
          </div>
        )}
      </div>
    );
  }

  // ---- SCRAPBOOK (2 foto — DILURUSKAN & CENTER) ----
  if (template === "scrapbook-2") {
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 bg-yellow-50 p-5">
        {!compact && (
          <div className="absolute left-4 top-4 z-10 bg-red-400 px-3 py-1 text-xs font-black text-white shadow-sm">
            NEW!
          </div>
        )}
        {[0, 1].map((i) => (
          <div key={i} className="relative w-[85%] border border-gray-200 bg-white p-3 shadow-xl">
            <Slot src={p(i)} className="aspect-[4/3] w-full" />
          </div>
        ))}
        {!compact && (
          <div className="absolute bottom-2 left-0 w-full text-center text-sm font-bold italic text-gray-500">
            My Best Day Ever
          </div>
        )}
      </div>
    );
  }

  // ---- MAGAZINE COVER (1 foto fullbleed) ----
  if (template === "magazine-1") {
    return (
      <div className="relative h-full w-full overflow-hidden bg-white">
        <Slot src={p(0)} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        {!compact && (
          <div className="absolute top-6 left-0 z-20 w-full text-center">
            <h1 className="font-serif text-6xl tracking-widest text-white opacity-90 drop-shadow-lg">STYLE</h1>
            <p className="text-[8px] font-light uppercase tracking-[0.3em] text-white">The Fashion Issue</p>
          </div>
        )}
      </div>
    );
  }

  // ---- CUTE STRIP (3 foto) ----
  if (template === "strip-3") {
    return (
      <div className="relative flex h-full w-full flex-col gap-3 overflow-hidden bg-[#FFB6C1] p-5">
        {!compact && (
          <>
            <div className="absolute right-2 top-2 z-10 rotate-12 text-3xl">✨</div>
            <div className="absolute bottom-10 left-2 z-10 -rotate-12 text-4xl">🌸</div>
            <div className="z-10 mb-1 text-center text-2xl font-black tracking-widest text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
              CUTE SNAPS
            </div>
          </>
        )}
        {[0, 1, 2].map((i) => (
          <Slot key={i} src={p(i)} className="z-0 flex-1 rounded-xl border-[6px] border-white shadow-inner" />
        ))}
        {!compact && (
          <div className="z-10 mt-1 text-center text-xs font-bold text-white/90">mahakaryaphoto.com</div>
        )}
      </div>
    );
  }

  // ---- DEFAULT: CLASSIC POLAROID (1 foto) ----
  return (
    <div className="relative flex h-full w-full flex-col bg-white p-5 pb-24">
      <Slot src={p(0)} className="h-full w-full border border-gray-200 bg-gray-900 shadow-inner" />
      {!compact && (
        <div className="absolute bottom-8 left-0 w-full px-4 text-center">
          <span className="font-serif text-2xl font-bold italic tracking-wider text-gray-800">
            Aesthetic Canvas
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Ukuran "asli" desain frame (rasio 2:3 = kertas 4R).
 * Semua padding/border/teks di PhotoFrame dirancang untuk ukuran ini.
 */
export const FRAME_BASE_WIDTH = 300;
export const FRAME_BASE_HEIGHT = 450;

/**
 * Versi frame yang AMAN untuk preview/thumbnail berapa pun ukurannya.
 * Frame tetap dirender pada ukuran aslinya (300x450) lalu DIPERKECIL
 * dengan transform: scale(), sehingga proporsi padding & slot SELALU benar
 * (tidak gepeng/berantakan seperti saat memaksa frame ke kotak kecil).
 *
 * Pakai ini di daftar template & kotak preview. Untuk hasil cetak ukuran
 * penuh (4R) cukup pakai <PhotoFrame> langsung.
 */
export function FramePreview({
  template,
  photos = [],
  compact = false,
  width = FRAME_BASE_WIDTH,
}: FrameProps & { width?: number }) {
  const scale = width / FRAME_BASE_WIDTH;
  const height = width * (FRAME_BASE_HEIGHT / FRAME_BASE_WIDTH);

  return (
    <div className="relative overflow-hidden bg-white" style={{ width, height }}>
      <div
        style={{
          width: FRAME_BASE_WIDTH,
          height: FRAME_BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <PhotoFrame template={template} photos={photos} compact={compact} />
      </div>
    </div>
  );
}
