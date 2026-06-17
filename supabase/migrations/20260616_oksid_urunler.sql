-- ============================================================
-- Oksid Bayi XML Entegrasyonu — oksid_urunler tablosu
-- Fiyat / döviz bilgisi KESİNLİKLE bu tabloya yazılmaz.
-- ============================================================

-- UUID extension (genellikle zaten aktif olur)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ana tablo
CREATE TABLE IF NOT EXISTS oksid_urunler (
  id              uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  stok_kodu       text UNIQUE NOT NULL,
  slug            text UNIQUE NOT NULL,
  urun_adi        text,
  kategori_ana    text,  -- AnaGrup_Ad
  kategori_alt    text,  -- AltGrup_Ad
  marka           text,
  stok_adet       integer DEFAULT 0,
  garanti_ay      integer DEFAULT 0,
  desi            numeric DEFAULT 0,
  kdv             integer DEFAULT 18,
  barkod          text,
  resimler        text[],  -- Res1..Res15 — en fazla 15 resim
  ozellikler      jsonb,   -- {OzAd: OzDeger, ...} — en fazla 30 özellik
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT timezone('utc', now()),
  updated_at      timestamptz DEFAULT timezone('utc', now())
);

-- Indexler
CREATE INDEX IF NOT EXISTS idx_oksid_urunler_kategori_ana ON oksid_urunler (kategori_ana);
CREATE INDEX IF NOT EXISTS idx_oksid_urunler_kategori_alt ON oksid_urunler (kategori_alt);
CREATE INDEX IF NOT EXISTS idx_oksid_urunler_marka        ON oksid_urunler (marka);
CREATE INDEX IF NOT EXISTS idx_oksid_urunler_is_active    ON oksid_urunler (is_active);
CREATE INDEX IF NOT EXISTS idx_oksid_urunler_slug         ON oksid_urunler (slug);

-- updated_at otomatik güncelleme trigger fonksiyonu
CREATE OR REPLACE FUNCTION set_oksid_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trg_oksid_urunler_updated_at ON oksid_urunler;
CREATE TRIGGER trg_oksid_urunler_updated_at
  BEFORE UPDATE ON oksid_urunler
  FOR EACH ROW EXECUTE FUNCTION set_oksid_updated_at();

-- Row Level Security (anon read, service_role full access)
ALTER TABLE oksid_urunler ENABLE ROW LEVEL SECURITY;

CREATE POLICY "oksid_urunler_public_read" ON oksid_urunler
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "oksid_urunler_service_all" ON oksid_urunler
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
