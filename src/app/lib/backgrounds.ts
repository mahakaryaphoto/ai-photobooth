// Daftar pilihan background untuk fitur "Ganti Background".
//
// Gambar diambil dari /public/backgrounds/bg-1.jpg s/d bg-25.jpg
//
// Cara menambah / mengganti:
// - Taruh file gambar (rasio 2:3, mis. 1024x1536) di /public/backgrounds/
// - Edit array BACKGROUNDS di bawah (id, name, image).
// - "prompt" hanya panduan cadangan; saat gambar dipilih, gambar itu sendiri
//   yang dikirim ke AI sebagai acuan latar.

export type BackgroundOption = {
  id: string;
  name: string;
  description: string;
  /** path gambar penuh di /public, atau null kalau hanya berbasis prompt */
  image: string | null;
  /** path thumbnail kecil, fallback ke image bila null */
  thumb: string | null;
  /** kelas gradient Tailwind sebagai fallback visual */
  thumbClass: string;
  /** deskripsi scene untuk memandu AI saat compositing */
  prompt: string;
};

export const BACKGROUNDS: BackgroundOption[] = [
  {
    id: "bg-1",
    name: "Background 1",
    description: "",
    image: "/backgrounds/bg-1.jpeg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-2",
    name: "Background 2",
    description: "",
    image: "/backgrounds/bg-2.jpeg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-3",
    name: "Background 3",
    description: "",
    image: "/backgrounds/bg-3.jpeg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-4",
    name: "Background 4",
    description: "",
    image: "/backgrounds/bg-4.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-5",
    name: "Background 5",
    description: "",
    image: "/backgrounds/bg-5.jpeg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-6",
    name: "Background 6",
    description: "",
    image: "/backgrounds/bg-6.jpeg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-7",
    name: "Background 7",
    description: "",
    image: "/backgrounds/bg-7.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-8",
    name: "Background 8",
    description: "",
    image: "/backgrounds/bg-8.jpeg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-9",
    name: "Background 9",
    description: "",
    image: "/backgrounds/bg-9.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-10",
    name: "Background 10",
    description: "",
    image: "/backgrounds/bg-10.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-11",
    name: "Background 11",
    description: "",
    image: "/backgrounds/bg-11.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-12",
    name: "Background 12",
    description: "",
    image: "/backgrounds/bg-12.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-13",
    name: "Background 13",
    description: "",
    image: "/backgrounds/bg-13.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-14",
    name: "Background 14",
    description: "",
    image: "/backgrounds/bg-14.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-15",
    name: "Background 15",
    description: "",
    image: "/backgrounds/bg-15.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-16",
    name: "Background 16",
    description: "",
    image: "/backgrounds/bg-16.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-17",
    name: "Background 17",
    description: "",
    image: "/backgrounds/bg-17.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-18",
    name: "Background 18",
    description: "",
    image: "/backgrounds/bg-18.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-19",
    name: "Background 19",
    description: "",
    image: "/backgrounds/bg-19.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-20",
    name: "Background 20",
    description: "",
    image: "/backgrounds/bg-20.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-21",
    name: "Background 21",
    description: "",
    image: "/backgrounds/bg-21.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-22",
    name: "Background 22",
    description: "",
    image: "/backgrounds/bg-22.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-23",
    name: "Background 23",
    description: "",
    image: "/backgrounds/bg-23.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-24",
    name: "Background 24",
    description: "",
    image: "/backgrounds/bg-24.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
  {
    id: "bg-25",
    name: "Background 25",
    description: "",
    image: "/backgrounds/bg-25.jpg",
    thumb: null,
    thumbClass: "bg-gradient-to-br from-slate-200 to-slate-400",
    prompt: "use the provided reference image as the new background",
  },
];

export function getBackground(id: string): BackgroundOption | undefined {
  return BACKGROUNDS.find((b) => b.id === id);
}
