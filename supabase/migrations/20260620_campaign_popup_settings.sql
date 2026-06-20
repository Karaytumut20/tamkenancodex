-- Seeding default campaign pop-up configurations into site_settings table
INSERT INTO public.site_settings (key, value) VALUES
  ('popup.active', '{"value": "false"}'::jsonb),
  ('popup.title', '{"value": "Özel Fırsat Kampanyası"}'::jsonb),
  ('popup.content', '{"value": "Kısa bir süreliğine ev ve iş yeri güvenlik paketlerimizde ücretsiz keşif ve kurulum avantajını kaçırmayın!"}'::jsonb),
  ('popup.image_url', '{"value": "/images/primesec-hero-cctv-v2.png"}'::jsonb),
  ('popup.button_label', '{"value": "Hemen Teklif Al"}'::jsonb),
  ('popup.button_url', '{"value": "/iletisim"}'::jsonb),
  ('popup.cooldown', '{"value": "10"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
