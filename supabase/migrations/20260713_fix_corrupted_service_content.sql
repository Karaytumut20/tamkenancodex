-- Remove accidental test content from the Hirsiz Alarm service and restore
-- the Akilli Ev route. The ID predicates keep this migration narrowly scoped.

update public.services
set
  usage_areas = '[
    {"title":"Mağaza ve ofis alarmı","description":"","active":true},
    {"title":"Depo ve atölye güvenliği","description":"","active":true},
    {"title":"Yangın İhbar Sistemleri","description":"","active":true}
  ]'::jsonb,
  deep_dive = jsonb_set(
    deep_dive,
    '{0,text}',
    to_jsonb('Kapsam belirlenirken öncelikle korunacak alan, risk seviyesi ve günlük kullanım ritmi incelenir. Keşif sırasında toplanan verilerin doğru yorumlanması, en uygun cihaz ve yerleşimin seçilmesini sağlar.'::text)
  ),
  process_steps = jsonb_set(
    process_steps,
    '{0,title}',
    to_jsonb('Ücretsiz keşif'::text)
  )
where id = '1d8b9a95-5a4d-44d9-95db-2a6de24b4a10';

update public.services
set slug = 'akilli-ev-sistemleri'
where id = '38230e57-ee5d-4638-887f-b7e715d55b98'
  and slug = 'yangin-ihbar-sistemleri';
