"use client";

import { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Webcam from "react-webcam";
import { Camera, AlertCircle } from "lucide-react";

function CaptureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Mengambil parameter dari URL
  const style = searchParams.get("style");
  const templateId = searchParams.get("template");
  const slots = parseInt(searchParams.get("slots") || "1", 10);

  const webcamRef = useRef<Webcam>(null);
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Fungsi untuk memulai sesi foto
  const startSession = () => {
    setPhotos([]);
    setIsSessionActive(true);
    startCountdown();
  };

  // Fungsi hitung mundur 3..2..1
  const startCountdown = () => {
    setCountdown(3);
  };

  // Logika Countdown menggunakan useEffect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      takePhoto();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // Fungsi menjepret foto
  const takePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos((prev) => {
          const newPhotos = [...prev, imageSrc];
          return newPhotos;
        });
      }
    }
  }, [webcamRef]);

  // Logika penentu: Apakah lanjut jepret atau selesai?
  useEffect(() => {
    if (!isSessionActive) return;

    if (photos.length < slots && countdown === 0) {
      // Jeda 1.5 detik sebelum mulai jepret foto berikutnya
      const timer = setTimeout(() => startCountdown(), 1500);
      return () => clearTimeout(timer);
    } else if (photos.length === slots) {
      // Sesi selesai, simpan ke sessionStorage agar bisa dibaca halaman Result
      sessionStorage.setItem("capturedPhotos", JSON.stringify(photos));
      sessionStorage.setItem("selectedStyle", style || "minimalist-elegant");
      sessionStorage.setItem("selectedTemplate", templateId || "single-1");
      
      setCountdown(null);
      setIsSessionActive(false);
      
      // Berpindah ke halaman Result
      setTimeout(() => {
        router.push("/result");
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos, slots, isSessionActive]);

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-yellow-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl p-4 shadow-lg border-x-4 border-t-4 border-black mt-4 flex justify-between items-center">
        <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest">
          Capture Time!
        </h2>
        <div className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
          {photos.length} / {slots}
        </div>
      </div>

      <div className="w-full max-w-md bg-white border-x-4 border-b-4 border-black shadow-xl p-4 rounded-b-3xl relative">
        {/* Frame Kamera */}
        <div className="relative rounded-2xl overflow-hidden border-4 border-blue-400 bg-black aspect-[3/4] flex items-center justify-center">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className={`w-full h-full object-cover ${countdown !== null ? "brightness-110" : ""}`}
            mirrored={true}
          />

          {/* Overlay Hitung Mundur */}
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
              <span className="text-9xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] animate-pulse">
                {countdown}
              </span>
            </div>
          )}
          
          {/* Flash Effect Putih saat memotret */}
          {countdown === 0 && (
            <div className="absolute inset-0 bg-white z-20 animate-ping opacity-75"></div>
          )}
        </div>

        {/* Notifikasi Sebelum Mulai */}
        {!isSessionActive && photos.length === 0 && (
           <div className="mt-4 flex items-start bg-yellow-50 p-3 rounded-xl border border-yellow-200">
             <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
             <p className="text-sm text-yellow-700">
               Posisikan wajah di tengah. AI akan menerapkan gaya visual pilihanmu nanti dengan mempertahankan 100% wajah aslinya.
             </p>
           </div>
        )}

        {/* Tombol Mulai Sesi */}
        {!isSessionActive && photos.length !== slots && (
          <button
            onClick={startSession}
            className="w-full mt-6 bg-pink-500 hover:bg-pink-400 text-white font-black py-4 px-8 rounded-2xl text-xl transition-all shadow-[0_6px_0_rgb(190,24,93)] hover:shadow-[0_3px_0_rgb(190,24,93)] hover:translate-y-1"
          >
            Start Photo Session
          </button>
        )}

        {/* Pesan Selesai */}
        {photos.length === slots && (
          <div className="mt-6 text-center animate-bounce font-bold text-green-500 text-xl">
            Selesai! Memproses gambar...
          </div>
        )}
      </div>

      {/* Miniatur Hasil Foto (Thumbnail) */}
      <div className="w-full max-w-md mt-6 flex gap-2 overflow-x-auto pb-4">
        {photos.map((src, index) => (
          <div key={index} className="w-16 h-20 flex-shrink-0 rounded-lg border-2 border-black overflow-hidden bg-white shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Slot ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </main>
  );
}

export default function CapturePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-yellow-200">Menyalakan Kamera...</div>}>
      <CaptureContent />
    </Suspense>
  );
}