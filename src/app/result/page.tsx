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
        uploadLayoutToSupabase();

      } catch (error) {
        console.error("Gagal menghubungi server:", error);
        setPhotos(JSON.parse(savedPhotos));
        setIsProcessing(false);
        uploadLayoutToSupabase(); 
      }
    };

    processWithOpenAI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadLayoutToSupabase = () => {
    setIsUploading(true);
    setTimeout(async () => {
      const element = document.getElementById("printable-result");
      if (!element) {
        setIsUploading(false);
        return;
      }

      try {
        const blob = await toBlob(element, { 
          pixelRatio: 3,
          backgroundColor: "#ffffff"
        });

        if (!blob) throw new Error("Gagal membuat blob gambar");

        const fileName = `photobooth-${Date.now()}.png`;

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

        const { data: publicUrlData } = supabase.storage
          .from("photobooth")
          .getPublicUrl(fileName);

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
    if (template === "twin-strip-6") {
      return (
        <div className="flex w-full h-full bg-white relative">
          <div className="absolute left-1/2 top-0 bottom-0 border-l border-dashed border-gray-300 z-20"></div>
          <div className="flex-1 flex flex-col gap-2 p-3 bg-[#E8F0FE] border-r-[0.5px]">
            <div className="text-center font-black text-blue-800 text-[10px] tracking-widest mt-1">PHOTOBOOTH</div>
            {photos.slice(0, 3).map((src, i) => (
              <div key={`l-${i}`} className="flex-1 bg-white rounded-md border-4 border-white shadow-sm overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            ))}
            <div className="text-center font-semibold text-gray-500 text-[8px] mb-1">05 . 06 . 2026</div>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-3 bg-[#E8F0FE] border-l-[0.5px]">
            <div className="text-center font-black text-blue-800 text-[10px] tracking-widest mt-1">PHOTOBOOTH</div>
            {photos.slice(0, 3).map((src, i) => (
              <div key={`r-${i}`} className="flex-1 bg-white rounded-md border-4 border-white shadow-sm overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            ))}
            <div className="text-center font-semibold text-gray-500 text-[8px] mb-1">05 . 06 . 2026</div>
          </div>
        </div>
      );
    }
    else if (template === "wedding-elegant-3") {
      return (
        <div className="flex flex-col gap-3 p-6 bg-[#FAFAFA] border-[12px] border-white w-full h-full relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 border border-stone-200 m-2 pointer-events-none"></div>
          {photos.slice(0, 3).map((src, i) => (
            <div key={i} className="flex-1 bg-stone-100 border border-stone-300 p-1 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          ))}
          <div className="text-center font-serif text-stone-600 mt-2 mb-1">
            <h2 className="text-2xl italic mb-1">Elegance</h2>
            <p className="text-[7px] uppercase tracking-[0.4em] text-stone-400">The Beginning of Forever</p>
          </div>
        </div>
      );
    }
    else if (template === "dark-elegant-3") {
      return (
        <div className="flex flex-col gap-3 p-6 bg-black border-[4px] border-yellow-700 w-full h-full relative overflow-hidden">
          {photos.slice(0, 3).map((src, i) => (
            <div key={i} className="flex-1 bg-stone-900 border border-yellow-600/50 p-[2px] overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="AI" className="w-full h-full object-cover grayscale-[30%] contrast-125" crossOrigin="anonymous" />
            </div>
          ))}
          <div className="text-center font-serif text-yellow-600 mt-2 mb-1">
            <h2 className="text-2xl italic mb-1 font-light tracking-wide">Robby & Eka</h2>
            <p className="text-[7px] uppercase tracking-[0.4em] text-yellow-700/80">Endless Love • 2026</p>
          </div>
        </div>
      );
    }
    else if (template === "wanted-poster-1") {
      return (
        <div className="flex flex-col p-4 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-[#8B5A2B] w-full h-full items-center justify-center">
          <div className="w-[90%] h-[95%] bg-[#F5DEB3] p-4 shadow-2xl flex flex-col border border-[#D2B48C] relative">
            <div className="text-center font-black font-serif text-5xl text-[#5C4033] tracking-widest mt-4">WANTED</div>
            <div className="text-center font-bold text-[#5C4033] text-sm tracking-[0.3em] mb-4">DEAD OR ALIVE</div>
            <div className="flex-1 overflow-hidden border-4 border-[#5C4033] bg-gray-900 filter sepia-[0.4] contrast-125 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photos[0]} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
            <div className="text-center font-black font-serif text-4xl text-[#5C4033] mt-4">$10,000</div>
          </div>
        </div>
      );
    }
    else if (template === "minimalist-grid-9") {
      return (
        <div className="flex flex-col p-4 bg-white w-full h-full">
          <div className="grid grid-cols-3 grid-rows-3 gap-1 flex-1 bg-white">
            {photos.slice(0, 9).map((src, i) => (
              <div key={i} className="bg-gray-100 overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            ))}
          </div>
          <div className="text-center font-sans text-gray-800 text-lg tracking-[0.5em] uppercase font-light mt-4 mb-2">Moments</div>
        </div>
      );
    }
    else if (template === "photocards-4") {
      return (
        <div className="flex flex-col p-4 bg-blue-50 w-full h-full">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
            {photos.slice(0, 4).map((src, i) => (
              <div key={i} className="bg-white p-2 rounded-xl shadow-md border border-blue-100 flex flex-col relative">
                <div className="flex-1 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    else if (template === "strip-3") {
      return (
        <div className="flex flex-col gap-3 p-5 bg-[#FFB6C1] w-full h-full relative overflow-hidden">
          <div className="absolute top-2 right-2 text-3xl rotate-12 z-10">✨</div>
          <div className="absolute bottom-10 left-2 text-4xl -rotate-12 z-10">🌸</div>
          <div className="text-center font-black text-white text-2xl mb-1 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] tracking-widest z-10">CUTE SNAPS</div>
          {photos.slice(0, 3).map((src, i) => (
            <div key={i} className="flex-1 bg-white rounded-xl border-[6px] border-white shadow-inner overflow-hidden relative z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          ))}
          <div className="text-center font-bold text-white/90 text-xs mt-1 z-10">mahakaryaphoto.com</div>
        </div>
      );
    } 
    else if (template === "film-3") {
      return (
        <div className="flex flex-col gap-4 p-6 bg-black w-full h-full relative border-l-[16px] border-r-[16px] border-dashed border-gray-800">
          {photos.slice(0, 3).map((src, i) => (
            <div key={i} className="flex-1 bg-gray-900 border-2 border-gray-700 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="AI" className="w-full h-full object-cover contrast-125 saturate-50" crossOrigin="anonymous" />
            </div>
          ))}
        </div>
      );
    }
    else if (template === "grid-4") {
      return (
        <div className="flex flex-col p-6 bg-[#f4f1ea] w-full h-full">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 flex-1">
            {photos.slice(0, 4).map((src, i) => (
              <div key={i} className="bg-white p-2 pb-6 shadow-md border border-gray-200 flex flex-col rotate-[1deg] even:-rotate-[1deg] relative">
                <div className="flex-1 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    else if (template === "scrapbook-2") {
      return (
        <div className="p-4 bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] bg-yellow-50 w-full h-full flex flex-col items-center justify-center gap-8 relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-red-400 text-white font-black text-xs px-3 py-1 rotate-[-15deg] shadow-sm">NEW!</div>
          {photos.slice(0, 2).map((src, i) => (
            <div key={i} className={`w-[85%] aspect-[4/3] bg-white p-3 shadow-xl border border-gray-200 relative ${i === 0 ? "-rotate-6" : "rotate-6"}`}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-200/60 backdrop-blur-sm -rotate-3"></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
            </div>
          ))}
          <div className="absolute bottom-2 left-0 w-full text-center font-bold text-gray-500 text-sm italic">My Best Day Ever</div>
        </div>
      );
    }
    else if (template === "magazine-1") {
      return (
        <div className="p-0 bg-white w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 z-0">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photos[0]} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10"></div>
          <div className="absolute top-6 left-0 w-full text-center z-20">
            <h1 className="text-6xl font-serif text-white tracking-widest drop-shadow-lg opacity-90">STYLE</h1>
            <p className="text-white text-[8px] tracking-[0.3em] font-light uppercase">The Fashion Issue</p>
          </div>
        </div>
      );
    }
    
    // Default Fallback (Classic Polaroid Single)
    return (
      // Menghapus efek miring (rotate) dan background luar. 
      // Menggunakan padding langsung sebagai bingkai putih polaroid agar pas 100% di kertas cetak 4R.
      <div className="flex flex-col bg-white w-full h-full p-5 pb-24 relative">
        <div className="w-full h-full overflow-hidden bg-gray-900 border border-gray-200 shadow-inner">
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img src={photos[0]} alt="AI" className="w-full h-full object-cover" crossOrigin="anonymous" />
        </div>
        <div className="absolute bottom-8 w-full text-center left-0 px-4">
           <span className="font-serif text-gray-800 text-2xl italic tracking-wider font-bold">
             Aesthetic Canvas
           </span>
        </div>
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
      </main>
    );
  }

  return (
    <>
      {/* INJEKSI CSS KHUSUS MESIN PRINTER */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Memaksa ukuran kertas pas 4R (4 x 6 inci) */
          @page {
            size: 4in 6in;
            margin: 0;
          }
          body {
            background: white;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}} />

      <main className="flex min-h-screen flex-col items-center bg-teal-100 p-6 print:bg-white print:p-0 print:m-0 print:min-h-0 print:block">
        
        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-8 flex flex-col items-center print:shadow-none print:p-0 print:m-0 print:border-none print:rounded-none print:max-w-none">
          <h2 className="text-2xl font-black text-center mb-6 text-teal-600 print:hidden">
            Ta-Da! Here&apos;s Your Snaps 📸
          </h2>

          <div 
            id="printable-result"
            className="w-full aspect-[2/3] max-w-[300px] shadow-2xl rounded-sm overflow-hidden bg-white mb-8 border border-gray-200 print:absolute print:top-0 print:left-0 print:w-[4in] print:h-[6in] print:max-w-none print:border-none print:shadow-none print:m-0"
          >
            {renderTemplateLayout()}
          </div>

          <div className="w-full flex flex-col gap-3 print:hidden">
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

        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-md flex items-center gap-6 relative overflow-hidden print:hidden">
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
    </>
  );
}