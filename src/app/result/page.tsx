"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Printer, RefreshCcw, Download, Sparkles } from "lucide-react";
import { toBlob } from "html-to-image";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ResultPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [style, setStyle] = useState("minimalist-elegant");
  const [template, setTemplate] = useState("strip-3");
  const [isProcessing, setIsProcessing] = useState(true);
  
  // URL default saat masih proses upload
  const [qrUrl, setQrUrl] = useState("https://mahakaryaphoto.com"); 
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const savedPhotos = sessionStorage.getItem("capturedPhotos");
    const savedStyle = sessionStorage.getItem("selectedStyle");
    const savedTemplate = sessionStorage.getItem("selectedTemplate");

    if (savedStyle) setStyle(savedStyle);
    if (savedTemplate) setTemplate(savedTemplate);

    const processWithOpenAI = async () => {
      if (!savedPhotos) return;
      const rawPhotos = JSON.parse(savedPhotos);
      
      try {
        const processedPhotos = [];

        for (const photo of rawPhotos) {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageBase64: photo, style: savedStyle }),
          });

          const data = await response.json();
          
          if (data.url) {
            processedPhotos.push(data.url);
          } else {
            processedPhotos.push(photo);
          }
        }

        setPhotos(processedPhotos);
        setIsProcessing(false);
        
        // Memulai proses potret frame & upload ke Supabase setelah AI selesai
        uploadLayoutToSupabase();

      } catch (error) {
        console.error("Gagal menghubungi server:", error);
        setPhotos(JSON.parse(savedPhotos));
        setIsProcessing(false);
        uploadLayoutToSupabase(); // Tetap upload versi fallback jika AI gagal
      }
    };

    processWithOpenAI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadLayoutToSupabase = () => {
    setIsUploading(true);
    // Jeda 1.5 detik untuk memastikan gambar dari URL sudah ter-render sempurna
    setTimeout(async () => {
      const element = document.getElementById("printable-result");
      if (!element) {
        setIsUploading(false);
        return;
      }

      try {
        // Menggunakan library modern html-to-image yang support CSS terbaru
        // pixelRatio: 3 digunakan agar hasil gambar memiliki resolusi HD yang jernih
        const blob = await toBlob(element, { 
          pixelRatio: 3,
          backgroundColor: '#ffffff' // Pastikan background putih bersih
        });

        if (!blob) {
          throw new Error("Gagal membuat blob gambar");
        }

        const fileName = `photobooth-${Date.now()}.png`;

        // Upload ke Supabase bucket 'photobooth'
        const { error } = await supabase.storage
          .from("photobooth")
          .upload(fileName, blob, {
            contentType: "image/png",
            cacheControl: "3600",
          });

        if (error) {
          console.error("Error upload Supabase:", error);
          setIsUploading(false);
          return;
        }

        // Dapatkan URL Publik dari Supabase
        const { data: publicUrlData } = supabase.storage
          .from("photobooth")
          .getPublicUrl(fileName);

        // Masukkan URL asli ke dalam QR Code
        setQrUrl(publicUrlData.publicUrl);
        setIsUploading(false);

      } catch (err) {
        console.error("Gagal merender dan upload gambar:", err);
        setIsUploading(false);
      }
    }, 1500);
  };
  
  const handlePrint = () => {
    window.print();
  };

  const handleRetake = () => {
    sessionStorage.removeItem("capturedPhotos");
    router.push("/");
  };

  const renderTemplateLayout = () => {
    if (template === "strip-3") {
      return (
        <div className="flex flex-col gap-2 p-4 bg-[#FFB6C1] w-full h-full">
          <div className="text-center font-black text-white text-xl mb-2 drop-shadow-md">
            Cute Snaps
          </div>
          {photos.slice(0, 3).map((src, i) => (
            <div key={i} className="flex-1 bg-white rounded-xl border-4 border-white overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="AI Processed" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          ))}
          <div className="text-center font-bold text-white text-sm mt-2">mahakaryaphoto.com</div>
        </div>
      );
    } 
    else if (template === "grid-4") {
      return (
        <div className="flex flex-col p-4 bg-[#87CEFA] w-full h-full">
          <div className="grid grid-cols-2 grid-rows-2 gap-2 flex-1">
            {photos.slice(0, 4).map((src, i) => (
              <div key={i} className="bg-white rounded-xl border-4 border-white overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="AI Processed" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            ))}
          </div>
          <div className="text-center font-black text-white text-2xl mt-4">Memories!</div>
        </div>
      );
    }
    return (
      <div className="p-4 bg-white border-[12px] border-[#FFE4B5] w-full h-full flex flex-col">
        <div className="flex-1 overflow-hidden rounded-lg relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[0]} alt="AI Processed" className="w-full h-full object-cover" crossOrigin="anonymous" />
        </div>
        <div className="text-center font-bold text-gray-800 text-xl pt-4">Best Moment</div>
      </div>
    );
  };

  if (isProcessing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-6">
        <Sparkles className="w-16 h-16 text-yellow-500 animate-spin mb-6" />
        <h2 className="text-3xl font-black text-blue-600 animate-pulse text-center">
          Applying AI Magic...
        </h2>
        <p className="mt-4 text-gray-700 text-center font-medium max-w-sm">
          Mempertahankan 100% detail wajah asli sembari menyempurnakan resolusi ke Ultra HD dan menerapkan gaya visual pilihanmu...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-teal-100 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-black text-center mb-6 text-teal-600">
          Ta-Da! Here&apos;s Your Snaps 📸
        </h2>

        <div 
          id="printable-result"
          className="w-full aspect-[2/3] max-w-[300px] shadow-2xl rounded-sm overflow-hidden bg-white mb-8 border border-gray-200"
        >
          {renderTemplateLayout()}
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-black font-black py-4 px-8 rounded-2xl text-lg transition-transform active:scale-95 shadow-[0_6px_0_rgb(202,138,4)] hover:shadow-[0_3px_0_rgb(202,138,4)] hover:translate-y-1"
          >
            <Printer className="mr-2 w-6 h-6" />
            Print This Result (4R)
          </button>

          <button
            onClick={handleRetake}
            className="w-full flex items-center justify-center bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-transform active:scale-95 shadow-[0_6px_0_rgb(194,65,12)] hover:shadow-[0_3px_0_rgb(194,65,12)] hover:translate-y-1"
          >
            <RefreshCcw className="mr-2 w-5 h-5" />
            Retake One More Time
          </button>
        </div>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-md flex items-center gap-6 relative overflow-hidden">
        {/* Indikator Loading khusus untuk proses Upload Supabase */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <RefreshCcw className="w-8 h-8 text-teal-500 animate-spin mb-2" />
            <span className="text-sm font-bold text-gray-700">Menyiapkan Link Download...</span>
          </div>
        )}
        
        <div className="bg-white p-2 rounded-xl shadow-inner border-2 border-gray-100 relative z-0">
          <QRCodeSVG value={qrUrl} size={90} />
        </div>
        <div className="relative z-0">
          <h3 className="font-black text-gray-800 text-lg flex items-center">
            <Download className="w-5 h-5 mr-2 text-teal-500" />
            Download Digital
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Scan QR Code ini untuk menyimpan hasil fotomu.
          </p>
        </div>
      </div>
    </main>
  );
}