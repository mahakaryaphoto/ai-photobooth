import Link from "next/link";
import { Sparkles, Camera } from "lucide-react";

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pink-200 p-6 relative overflow-hidden">
      {/* Background Pattern Sederhana */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      
      {/* Container Utama */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8 bg-white/40 p-10 rounded-3xl backdrop-blur-sm border-4 border-white shadow-xl max-w-md w-full">
        
        {/* Dekorasi Ikon */}
        <div className="flex space-x-4">
          <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
          <Camera className="w-12 h-12 text-blue-500" />
        </div>

        {/* Judul */}
        <div>
          <h1 className="text-5xl font-black text-pink-600 drop-shadow-md tracking-wide">
            Welcome!
          </h1>
          <p className="text-xl text-gray-800 mt-4 font-bold">
            AI Magic Photobooth ✨
          </p>
        </div>

        {/* Instruksi */}
        <p className="text-sm font-semibold text-gray-700 bg-white/60 py-2 px-4 rounded-full">
          Tap Button to Start
        </p>

        {/* Tombol Start */}
        <Link href="/style" className="w-full">
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-2xl text-2xl transition-transform active:scale-95 shadow-[0_8px_0_rgb(67,56,202)] hover:shadow-[0_4px_0_rgb(67,56,202)] hover:translate-y-1">
            Start Now
          </button>
        </Link>
      </div>
    </main>
  );
}