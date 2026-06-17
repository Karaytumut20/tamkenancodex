-- ============================================================
-- SERVICES TABLE UPDATE: ADVANTAGES WITH CUSTOM DESCRIPTIONS
-- ============================================================

-- 1. Update Alarm Sistemleri advantages with default descriptions
UPDATE public.services
SET advantages = '[
  {
    "title": "7/24 Kesintisiz Alarm Takibi",
    "description": "Alarm sinyallerinin AHM merkezimizce kesintisiz izlenmesi ve acil durumlarda emniyet güçlerine anında haber verilmesi."
  },
  {
    "title": "Mobil Uygulama ile Uzaktan Kontrol",
    "description": "Akıllı telefon uygulamanız üzerinden sistemi dilediğiniz yerden kurun, devre dışı bırakın ve anlık bildirimler alın."
  },
  {
    "title": "Mekana Göre Sensör Planı",
    "description": "Kör nokta bırakmayan, evcil hayvan dostu hareket dedektörleri ve manyetik kontaklarla alanınıza özel yerleşim."
  },
  {
    "title": "Kablolu ve Kablosuz Seçenekler",
    "description": "Dekorasyonunuza zarar vermeyen şık kablosuz dedektörler ya da kurumsal yapılar için yüksek mesafeli kablolu altyapı çözümleri."
  }
]'::jsonb
WHERE slug = 'alarm-sistemlerisssss';

-- 2. Update other services if their advantages are still simple text arrays
-- Note: This is an example update. In the admin panel, you can now change any service advantages directly.
UPDATE public.services
SET advantages = '[
  {
    "title": "7/24 İzleme ve Kayıt",
    "description": "Yüksek çözünürlüklü kameralarla sürekli kayıt altyapısı ve kesintisiz canlı izleme imkanı."
  },
  {
    "title": "Yüksek Çözünürlük",
    "description": "IP ve analog HD teknolojisiyle yüz ve plaka tanımlamaya uygun net video çıktıları."
  },
  {
    "title": "Akıllı Analiz Çözümleri",
    "description": "Sınır ihlali, kayıp nesne ve kişi sayma gibi akıllı yapay zeka analiz özellikleri."
  },
  {
    "title": "Mobil ve Web Erişim",
    "description": "Gelişmiş mobil uygulamalar ve web arayüzleri ile canlı ve geçmiş kayıtlara kolay erişim."
  }
]'::jsonb
WHERE slug = 'kamera-sistemleri';
