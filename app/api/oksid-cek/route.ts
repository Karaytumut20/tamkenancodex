import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import https from "https";
import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// Sabitler
// ─────────────────────────────────────────────────────────────────────────────

const OKSID_DETAY_URL =
  "https://www.oksid.com.tr/services/bayixmldetay.php?2415818c-73d2-0419-504a-d6977146312a";

// İstediğimiz Hard Disk alt kategorileri
const GECERLI_DISK_ALT_KATEGORILER = new Set([
  "Nas Ssd Diskler",
  "Taşınabilir Ssd Diskler",
  "Sata Diskler",
  "Güvenlik 7/24 Diskleri",
  "Nas Diskler",
  "Ssd Diskler",
]);

// ─────────────────────────────────────────────────────────────────────────────
// Yardımcı: Türkçe karakterleri normalize edip slug üretir
// ─────────────────────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─────────────────────────────────────────────────────────────────────────────
// Yardımcı: HTTPS URL'yi string olarak indirir
// ─────────────────────────────────────────────────────────────────────────────
async function fetchXmlText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk: string) => (data += chunk));
        res.on("end", () => resolve(data));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Filtreleme mantığı
// ─────────────────────────────────────────────────────────────────────────────
function urunEklenecekMi(anaGrup: string, altGrup: string): boolean {
  if (anaGrup === "Güvenlik Ürünleri") return true;
  if (anaGrup === "Hard Diskler" && GECERLI_DISK_ALT_KATEGORILER.has(altGrup))
    return true;
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stok satırından resim dizisi çıkart (Res1..Res15)
// ─────────────────────────────────────────────────────────────────────────────
function resimlerCikar(stok: Record<string, string>): string[] {
  const resimler: string[] = [];
  for (let i = 1; i <= 15; i++) {
    const val = stok[`Res${i}`];
    if (val && val.trim()) resimler.push(val.trim());
  }
  return resimler;
}

// ─────────────────────────────────────────────────────────────────────────────
// Stok satırından özellik JSON'u çıkart (Oz1/OzDeg1..Oz30/OzDeg30)
// ─────────────────────────────────────────────────────────────────────────────
function ozelliklerCikar(stok: Record<string, string>): Record<string, string> {
  const obj: Record<string, string> = {};
  for (let i = 1; i <= 30; i++) {
    const ad = stok[`Oz${i}`];
    const deger = stok[`OzDeg${i}`];
    if (ad && ad.trim() && deger && deger.trim()) {
      obj[ad.trim()] = deger.trim();
    }
  }
  return obj;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/oksid-cek
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  // Service Role Key ile Supabase bağlantısı (admin yetkisi gerekir)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        error:
          "NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY tanımlı değil.",
      },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  try {
    // 1. XML metnini indir
    console.log("[oksid-cek] XML indiriliyor...");
    const xmlMetin = await fetchXmlText(OKSID_DETAY_URL);

    // 2. Parse et
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      parseAttributeValue: false,
      isArray: (tagName) => tagName === "Stok",
    });
    const parsed = parser.parse(xmlMetin);

    // XML yapısı: <root><Stok ...> veya <StokListesi><Stok ...>
    const stokListesi: Record<string, string>[] =
      parsed?.root?.Stok ||
      parsed?.StokListesi?.Stok ||
      parsed?.Stok ||
      [];

    if (!Array.isArray(stokListesi) || stokListesi.length === 0) {
      return NextResponse.json(
        { error: "XML'den ürün listesi okunamadı veya boş geldi." },
        { status: 422 },
      );
    }

    console.log(`[oksid-cek] Toplam XML satırı: ${stokListesi.length}`);

    // 3. Filtrele & Supabase'e yaz
    let islenen = 0;
    let atlanan = 0;
    const hatalar: string[] = [];

    // Batch upsert için liste
    const upsertBatch: Record<string, unknown>[] = [];

    for (const stok of stokListesi) {
      const anaGrup = (stok["AnaGrup_Ad"] || "").trim();
      const altGrup = (stok["AltGrup_Ad"] || "").trim();

      if (!urunEklenecekMi(anaGrup, altGrup)) {
        atlanan++;
        continue;
      }

      const stokKodu = (stok["Kod"] || "").trim();
      const urunAdi = (stok["Ad"] || "").trim();

      if (!stokKodu || !urunAdi) {
        atlanan++;
        continue;
      }

      const slug = slugify(stokKodu + "-" + urunAdi);
      const resimler = resimlerCikar(stok);
      const ozellikler = ozelliklerCikar(stok);

      const paket = {
        stok_kodu: stokKodu,
        slug,
        urun_adi: urunAdi,
        kategori_ana: anaGrup,
        kategori_alt: altGrup,
        marka: (stok["Marka_Ismi"] || stok["Marka"] || "").trim() || null,
        stok_adet: parseInt(stok["Miktar"] || "0", 10) || 0,
        garanti_ay: parseInt(stok["Garanti"] || "0", 10) || 0,
        desi: parseFloat(stok["Desi"] || "0") || 0,
        kdv: parseInt(stok["Kdv"] || "18", 10) || 18,
        barkod: (stok["Barkod"] || "").trim() || null,
        resimler: resimler.length > 0 ? resimler : null,
        ozellikler:
          Object.keys(ozellikler).length > 0 ? ozellikler : null,
        is_active: true,
        // FİYAT / DÖVİZ BİLGİSİ YOK — kasıtlı olarak dahil edilmedi
      };

      upsertBatch.push(paket);
      islenen++;
    }

    // Batch'lere böl (Supabase tek seferde max ~500 satır önerilir)
    const BATCH_SIZE = 200;
    for (let i = 0; i < upsertBatch.length; i += BATCH_SIZE) {
      const batch = upsertBatch.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from("oksid_urunler")
        .upsert(batch as any, { onConflict: "stok_kodu" });
      if (error) {
        console.error("[oksid-cek] Batch upsert hatası:", error);
        hatalar.push(error.message);
      }
    }

    console.log(
      `[oksid-cek] Tamamlandı. İşlenen: ${islenen}, Atlanan: ${atlanan}`,
    );

    return NextResponse.json({
      success: true,
      islenen,
      atlanan,
      hatalar: hatalar.length > 0 ? hatalar : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[oksid-cek] Hata:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
