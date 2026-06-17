"use client";

import { useState } from "react";
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  Shield,
  HardDrive,
  Clock,
  Loader2,
} from "lucide-react";

export default function OksidSyncPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    islenen?: number;
    atlanan?: number;
    hatalar?: string[];
    error?: string;
  } | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  async function handleSync() {
    setIsLoading(true);
    setResult(null);
    setStartTime(new Date());
    setEndTime(null);

    try {
      const res = await fetch("/api/oksid-cek");
      const data = await res.json();
      setResult(data);
      setEndTime(new Date());
    } catch (err) {
      setResult({ error: String(err) });
      setEndTime(new Date());
    } finally {
      setIsLoading(false);
    }
  }

  const duration =
    startTime && endTime
      ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
      : null;

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
          <Database className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Oksid XML Senkronizasyonu</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Oksid bayixml API&apos;sinden ürün verilerini çekip Supabase&apos;e aktarır.
          </p>
        </div>
      </div>

      {/* Açıklama Kartları */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-2 border-cyan-100 bg-cyan-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-cyan-600" />
            <h2 className="font-black text-slate-700">Güvenlik Ürünleri</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tüm alt kategorileri dahil olmak üzere Güvenlik Ürünleri ana kategorisi
            çekilir: IP/AHD Kameralar, NVR Kayıt Cihazları, Hırsız Alarm, Yangın
            Algılama, Geçiş Kontrol ve daha fazlası.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-blue-100 bg-blue-50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="h-5 w-5 text-blue-600" />
            <h2 className="font-black text-slate-700">Seçili Hard Disk Kategorileri</h2>
          </div>
          <ul className="text-sm text-slate-600 space-y-1">
            {[
              "Nas Ssd Diskler",
              "Taşınabilir Ssd Diskler",
              "Sata Diskler",
              "Güvenlik 7/24 Diskleri",
              "Nas Diskler",
              "Ssd Diskler",
            ].map((k) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                {k}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Uyarı */}
      <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-extrabold text-amber-800">Fiyat Bilgisi Kaydedilmez</p>
          <p className="text-sm text-amber-700 mt-0.5">
            Döviz cinsi, bayi fiyatı, son kullanıcı fiyatı ve kur bilgisi hiçbir
            şekilde veritabanına yazılmaz. Yalnızca ürün bilgileri, görseller ve
            teknik özellikler aktarılır.
          </p>
        </div>
      </div>

      {/* Sync Butonu */}
      <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="font-black text-slate-800 text-lg">Senkronizasyonu Başlat</h2>
            <p className="text-sm text-slate-500 mt-1">
              Oksid XML verisi çekilecek, seçili kategoriler filtrelenecek ve
              Supabase&apos;e aktarılacaktır. Bu işlem birkaç dakika sürebilir.
            </p>
          </div>
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-cyan-600 text-white font-black text-sm hover:bg-cyan-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Senkronize Ediliyor...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Şimdi Güncelle
              </>
            )}
          </button>
        </div>

        {/* Sonuç */}
        {result && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            {result.error ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-black text-red-800 text-sm">Hata Oluştu</p>
                  <p className="text-sm text-red-700 mt-1 break-all">{result.error}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-black text-emerald-800 text-sm">
                      Senkronizasyon Tamamlandı!
                    </p>
                    <p className="text-sm text-emerald-700 mt-0.5">
                      {result.islenen?.toLocaleString("tr-TR")} ürün işlendi,{" "}
                      {result.atlanan?.toLocaleString("tr-TR")} ürün atlandı.
                      {duration && ` (${duration} saniye)`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-2xl font-black text-slate-800">
                      {result.islenen?.toLocaleString("tr-TR") ?? "-"}
                    </p>
                    <p className="text-xs text-slate-500 font-bold mt-1">İşlenen</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-2xl font-black text-slate-500">
                      {result.atlanan?.toLocaleString("tr-TR") ?? "-"}
                    </p>
                    <p className="text-xs text-slate-500 font-bold mt-1">Atlanan</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="text-2xl font-black text-slate-800">
                      {duration ? `${duration}s` : "-"}
                    </p>
                    <p className="text-xs text-slate-500 font-bold mt-1">Süre</p>
                  </div>
                </div>

                {result.hatalar && result.hatalar.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                    <p className="font-black text-amber-800 text-sm mb-2">
                      {result.hatalar.length} Batch Hatası
                    </p>
                    <ul className="space-y-1">
                      {result.hatalar.slice(0, 5).map((h, i) => (
                        <li key={i} className="text-xs text-amber-700 break-all">
                          • {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {endTime && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    Son güncelleme:{" "}
                    {endTime.toLocaleString("tr-TR", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Teknik Not */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">
          Teknik Notlar
        </p>
        <ul className="text-xs text-slate-500 space-y-1.5">
          <li>
            • Kaynak: <code className="font-mono bg-white px-1 py-0.5 rounded border text-slate-700">bayixmldetay.php</code>{" "}
            (resimler Res1–Res15, özellikler Oz1/OzDeg1–Oz30/OzDeg30)
          </li>
          <li>• Mevcut kayıtlar <code className="font-mono bg-white px-1 py-0.5 rounded border text-slate-700">stok_kodu</code> üzerinden güncellenir (upsert).</li>
          <li>• Yeni ürünler için <code className="font-mono bg-white px-1 py-0.5 rounded border text-slate-700">slug</code> otomatik üretilir.</li>
          <li>• Fiyat, döviz, kur bilgisi hiçbir şekilde kaydedilmez.</li>
        </ul>
      </div>
    </div>
  );
}
