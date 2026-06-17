-- ============================================================
-- SERVICES TABLE ADDITIONS: FEATURED PRODUCTS & DEEP DIVE
-- ============================================================

-- 1. Add deep_dive column to services table
ALTER TABLE public.services 
  ADD COLUMN IF NOT EXISTS deep_dive jsonb NOT NULL DEFAULT '[]'::jsonb;

-- 2. Seed default deep dive blocks for Alarm Sistemleri (with the specific custom texts)
UPDATE public.services
SET deep_dive = '[
  {
    "title": "Hizmet kapsamı nasıl belirlenir?",
    "text": "Kapsam belirlenirken öncelikle korunacak alan, risk seviyesi ve günlük kullanım ritmi incelenir. Alarm Sistemlerissasdadasdadasda için 7/24 algılama ve caydırıcılıkdasda, mobil uygulama ile uzaktan kontrolsdasd, mekana göre sensör planıasdas, kablolu ve kablosuz seçeneklerdasdasd gibi avantajların gerçekten çalışması, keşif sırasında toplanan verilerin doğru yorumlanmasına bağlıdır. PrimeSec ekibi bu aşamada cihaz sayısını, bağlantı şeklini, kullanıcı yetkilerini ve servis ihtiyaçlarını netleştirir."
  },
  {
    "title": "Kurulum sonrası kullanım deneyimi",
    "text": "İyi bir güvenlik sistemi yalnızca kurulduğu gün değil, her gün kolay kullanılmalıdır. Bu nedenle mobil uygulama ayarları, bildirim tercihleri, kayıt erişimi, kullanıcı rolleri ve temel bakım noktaları teslim sırasında anlatılır. Böylece sistem teknik olarak güçlü olduğu kadar kullanıcı açısından da anlaşılır kalır."
  },
  {
    "title": "Neden PrimeSec yaklaşımı?",
    "text": "PrimeSec Teknoloji ürünleri tek tek satmak yerine, birbirini tamamlayan bir çözüm mimarisi kurmaya odaklanır. Alarm, kamera, akıllı ev, yangın ihbar, PDKS, kapı geçiş ve network çözümleri gerektiğinde aynı plan içinde değerlendirilir. Bu yaklaşım hem maliyet kontrolü sağlar hem de sistemin ileride genişletilmesini kolaylaştırır."
  }
]'::jsonb
WHERE slug = 'alarm-sistemlerisssss';

-- 3. Seed default deep dive blocks for other existing services if their deep_dive is empty
UPDATE public.services
SET deep_dive = '[
  {
    "title": "Hizmet kapsamı nasıl belirlenir?",
    "text": "Kapsam belirlenirken öncelikle korunacak alan, risk seviyesi ve günlük kullanım ritmi incelenir. Keşif sırasında toplanan verilerin doğru yorumlanması, en uygun cihaz ve yerleşimin seçilmesini sağlar."
  },
  {
    "title": "Kurulum sonrası kullanım deneyimi",
    "text": "Güvenlik sisteminizin kurulumu sonrası mobil uygulama üzerinden kolay erişim, bildirim ayarları ve temel bakım esasları size detaylıca aktarılır."
  },
  {
    "title": "Neden PrimeSec yaklaşımı?",
    "text": "PrimeSec Teknoloji olarak tekil ürün satışı yerine, tüm güvenlik ve otomasyon katmanlarını birbiriyle uyumlu çalışacak şekilde planlıyoruz."
  }
]'::jsonb
WHERE slug != 'alarm-sistemlerisssss' AND (deep_dive IS NULL OR jsonb_array_length(deep_dive) = 0);
