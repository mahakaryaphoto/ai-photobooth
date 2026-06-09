"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Printer, RefreshCcw, Download, Sparkles } from "lucide-react";
import { toBlob } from "html-to-image";
import { createClient } from "@supabase/supabase-js";
import { PhotoFrame } from "../lib/templates";

// Inisialisasi Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ResultPage() {
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [, setStyle] = useState("minimalist-elegant");
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
      if (!savedPhotos) {
        setIsProcessing(false);
        return;
      }
      const rawPhotos = JSON.parse(savedPhotos);

      try {
        const processedPhotos: string[] = [];

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
          backgroundColor: "#ffffff",
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

  if (isProcessing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-blue-100 p-6">
        <Sparkles className="mb-6 h-16 w-16 animate-spin text-yellow-500" />
        <h2 className="animate-pulse text-center text-3xl font-black text-blue-600">
          Applying AI Magic...
        </h2>
      </main>
    );
  }

  return (
    <>
      {/* CSS KHUSUS MESIN PRINTER 4R (4 x 6 inci) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page {
            size: 4in 6in;
            margin: 0;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Sembunyikan SEMUA, lalu tampilkan hanya area cetak.
             Cara ini paling andal lintas-browser. */
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 4in !important;
            height: 6in !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            border-radius: 0 !important;
            overflow: hidden !important;
          }
        }
      `,
        }}
      />

      <main className="flex min-h-screen flex-col items-center bg-teal-100 p-6">
        <div className="mb-8 flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] print:hidden">
          <h2 className="mb-6 text-center text-2xl font-black text-teal-600">
            Ta-Da! Here&apos;s Your Snaps 📸
          </h2>

          {/* Preview di layar: rasio 2:3 = kertas 4R */}
          <div className="mb-8 w-full max-w-[300px] overflow-hidden rounded-sm border border-gray-200 bg-white shadow-2xl">
            <div id="printable-result" className="aspect-[2/3] w-full bg-white">
              <PhotoFrame template={template} photos={photos} />
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <button
              onClick={handlePrint}
              className="flex w-full items-center justify-center rounded-2xl bg-yellow-400 px-8 py-4 text-lg font-black text-black shadow-[0_6px_0_rgb(202,138,4)] transition-transform hover:translate-y-1 hover:bg-yellow-300 hover:shadow-[0_3px_0_rgb(202,138,4)] active:scale-95"
            >
              <Printer className="mr-2 h-6 w-6" />
              Print This Result (4R)
            </button>

            <button
              onClick={handleRetake}
              className="flex w-full items-center justify-center rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-[0_6px_0_rgb(194,65,12)] transition-transform hover:translate-y-1 hover:bg-orange-400 hover:shadow-[0_3px_0_rgb(194,65,12)] active:scale-95"
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Retake One More Time
            </button>
          </div>
        </div>

        <div className="relative flex w-full max-w-md items-center gap-6 overflow-hidden rounded-3xl bg-white p-6 shadow-md print:hidden">
          {isUploading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <RefreshCcw className="mb-2 h-8 w-8 animate-spin text-teal-500" />
              <span className="text-sm font-bold text-gray-700">Menyiapkan Link Download...</span>
            </div>
          )}

          <div className="relative z-0 rounded-xl border-2 border-gray-100 bg-white p-2 shadow-inner">
            <QRCodeSVG value={qrUrl} size={90} />
          </div>
          <div className="relative z-0">
            <h3 className="flex items-center text-lg font-black text-gray-800">
              <Download className="mr-2 h-5 w-5 text-teal-500" />
              Download Digital
            </h3>
            <p className="mt-1 text-sm text-gray-600">Scan QR Code ini untuk menyimpan hasil fotomu.</p>
          </div>
        </div>
      </main>

      {/* AREA KHUSUS CETAK: hanya muncul saat print, ukuran persis 4R */}
      <div id="print-area" className="hidden print:block">
        <PhotoFrame template={template} photos={photos} />
      </div>
    </>
  );
}
