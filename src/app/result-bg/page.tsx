"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { Printer, RefreshCcw, Download, Sparkles } from "lucide-react";
import { toBlob } from "html-to-image";
import { createClient } from "@supabase/supabase-js";
import { getBackground } from "../lib/backgrounds";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Ambil gambar dari /public dan ubah ke base64 (untuk dikirim ke AI)
async function urlToBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function ResultBackgroundPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [qrUrl, setQrUrl] = useState("https://mahakaryaphoto.com");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const savedPhotos = sessionStorage.getItem("capturedPhotos");
    const savedBg = sessionStorage.getItem("selectedBackground") || "studio-gray";

    const run = async () => {
      if (!savedPhotos) {
        setIsProcessing(false);
        return;
      }
      const rawPhotos: string[] = JSON.parse(savedPhotos);
      const subject = rawPhotos[0];
      const bg = getBackground(savedBg);

      try {
        // Kirim gambar background terpilih (bila ada) sebagai acuan komposit
        const backgroundBase64 = bg?.image ? await urlToBase64(bg.image) : null;

        const response = await fetch("/api/background", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: subject,
            backgroundBase64,
            scene: bg?.prompt,
          }),
        });

        const data = await response.json();
        if (data.url) {
          setPhoto(data.url);
        } else {
          setErrorMsg(data.error || "Gagal memproses gambar.");
          setPhoto(subject); // fallback tampilkan foto asli
        }
      } catch (err) {
        console.error("Gagal menghubungi server:", err);
        setErrorMsg("Gagal menghubungi server. Menampilkan foto asli.");
        setPhoto(subject);
      } finally {
        setIsProcessing(false);
        setTimeout(uploadToSupabase, 1500);
      }
    };

    run();
  }, []);

  const uploadToSupabase = async () => {
    setIsUploading(true);
    const element = document.getElementById("printable-result");
    if (!element) {
      setIsUploading(false);
      return;
    }
    try {
      const blob = await toBlob(element, { pixelRatio: 3, backgroundColor: "#ffffff" });
      if (!blob) throw new Error("Gagal membuat blob gambar");

      const fileName = `photobooth-bg-${Date.now()}.png`;
      const { error } = await supabase.storage
        .from("photobooth")
        .upload(fileName, blob, { contentType: "image/png", cacheControl: "3600" });

      if (error) {
        console.error("Error upload Supabase:", error);
        setIsUploading(false);
        return;
      }
      const { data } = supabase.storage.from("photobooth").getPublicUrl(fileName);
      setQrUrl(data.publicUrl);
    } catch (err) {
      console.error("Gagal render & upload:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePrint = () => window.print();

  const handleRetake = () => {
    sessionStorage.removeItem("capturedPhotos");
    router.push("/background");
  };

  if (isProcessing) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-teal-100 p-6">
        <Sparkles className="mb-6 h-16 w-16 animate-spin text-emerald-500" />
        <h2 className="animate-pulse text-center text-3xl font-black text-emerald-600">
          Mengganti Background...
        </h2>
        <p className="mt-2 text-center text-sm font-semibold text-gray-600">
          Hapus latar • Ganti latar • Koreksi warna & cahaya
        </p>
      </main>
    );
  }

  return (
    <>
      {/* CSS cetak ukuran 40 x 60 cm (rasio 2:3) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: 40cm 60cm; margin: 0; }
          html, body {
            margin: 0 !important; padding: 0 !important; background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * { visibility: hidden !important; }
          #print-area, #print-area * { visibility: visible !important; }
          #print-area {
            position: fixed !important; top: 0 !important; left: 0 !important;
            width: 40cm !important; height: 60cm !important;
            margin: 0 !important; padding: 0 !important;
            border: none !important; box-shadow: none !important; border-radius: 0 !important;
            overflow: hidden !important;
          }
          #print-area img {
            width: 100% !important; height: 100% !important; object-fit: cover !important;
          }
        }
      `,
        }}
      />

      <main className="flex min-h-screen flex-col items-center bg-teal-100 p-6">
        <div className="mb-8 flex w-full max-w-md flex-col items-center rounded-3xl bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] print:hidden">
          <h2 className="mb-2 text-center text-2xl font-black text-emerald-600">
            Background Baru Siap! 🎉
          </h2>
          {errorMsg && (
            <p className="mb-4 rounded-xl bg-yellow-50 px-4 py-2 text-center text-xs font-semibold text-yellow-700">
              {errorMsg}
            </p>
          )}

          {/* Preview 2:3 tanpa frame */}
          <div className="mb-8 w-full max-w-[300px] overflow-hidden rounded-sm border border-gray-200 bg-white shadow-2xl">
            <div id="printable-result" className="relative aspect-[2/3] w-full bg-gray-900">
              {photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt="Hasil"
                  crossOrigin="anonymous"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              )}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3">
            <button
              onClick={handlePrint}
              className="flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-8 py-4 text-lg font-black text-black shadow-[0_6px_0_rgb(5,150,105)] transition-transform hover:translate-y-1 hover:bg-emerald-300 hover:shadow-[0_3px_0_rgb(5,150,105)] active:scale-95"
            >
              <Printer className="mr-2 h-6 w-6" />
              Cetak (40 × 60 cm)
            </button>
            <button
              onClick={handleRetake}
              className="flex w-full items-center justify-center rounded-2xl bg-orange-500 px-8 py-4 text-lg font-bold text-white shadow-[0_6px_0_rgb(194,65,12)] transition-transform hover:translate-y-1 hover:bg-orange-400 hover:shadow-[0_3px_0_rgb(194,65,12)] active:scale-95"
            >
              <RefreshCcw className="mr-2 h-5 w-5" />
              Ulangi
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

      {/* Area khusus cetak: hanya foto, ukuran 40x60 cm */}
      <div id="print-area" className="hidden print:block">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="Hasil" crossOrigin="anonymous" className="h-full w-full object-cover object-center" />
        )}
      </div>
    </>
  );
}
