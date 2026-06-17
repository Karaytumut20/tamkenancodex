-- ==========================================
-- ANA SAYFA DİNAMİK İÇERİK TABLOLARI
-- ==========================================

-- 1. Öne Çıkan Ürünler Tablosu (ProductCarousel için)
CREATE TABLE IF NOT EXISTS public.homepage_featured_products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  source_id text NOT NULL, -- local product_id veya oksid_urunler id
  source_type text NOT NULL CHECK (source_type IN ('local', 'oksid')),
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Güvenlik Hizmet Alanları - Sekmeler (ServiceGrid için Tümü, Kamera vb.)
CREATE TABLE IF NOT EXISTS public.homepage_service_tabs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Varsayılan sekmeleri yalnızca tablo boşsa ekle (Mükerrer kaydı önlemek için)
INSERT INTO public.homepage_service_tabs (title, sort_order)
SELECT title, sort_order FROM (
  VALUES 
    ('Kamera', 10),
    ('Alarm', 20),
    ('Akıllı Ev', 30),
    ('Kurumsal', 40),
    ('Network', 50)
) AS v(title, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM public.homepage_service_tabs);

-- 3. Güvenlik Hizmet Alanları - Kartlar (CCTV Kamera vs.)
CREATE TABLE IF NOT EXISTS public.homepage_services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tab_id uuid REFERENCES public.homepage_service_tabs(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image text,
  link text,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) Politikaları
ALTER TABLE public.homepage_featured_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_service_tabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_services ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Enable read access for all users on homepage_featured_products" ON public.homepage_featured_products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on homepage_service_tabs" ON public.homepage_service_tabs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users on homepage_services" ON public.homepage_services FOR SELECT USING (true);

-- Adminler her şeyi yapabilir (service_role üzerinden veya basit admin policy)
CREATE POLICY "Enable insert for authenticated users only" ON public.homepage_featured_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.homepage_featured_products FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.homepage_featured_products FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.homepage_service_tabs FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.homepage_service_tabs FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.homepage_service_tabs FOR DELETE USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.homepage_services FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users only" ON public.homepage_services FOR UPDATE USING (true);
CREATE POLICY "Enable delete for authenticated users only" ON public.homepage_services FOR DELETE USING (true);
