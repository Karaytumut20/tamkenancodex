INSERT INTO public.site_settings (key, value)
VALUES ('contact.whatsapp', '{"value":"905519542605"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
