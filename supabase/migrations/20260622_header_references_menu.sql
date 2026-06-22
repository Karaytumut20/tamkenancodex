-- Blog bağlantısını navbar'dan kaldır ve Referanslarımız sayfasını ekle.
update public.menu_items
set is_active = false,
    updated_at = now()
where menu_key = 'header'
  and parent_id is null
  and (url = '/blog' or lower(label) = 'blog');

do $$
declare
  reference_exists boolean;
  target_order integer;
begin
  select exists (
    select 1
    from public.menu_items
    where menu_key = 'header'
      and parent_id is null
      and url = '/referanslarimiz'
  ) into reference_exists;

  if reference_exists then
    update public.menu_items
    set label = 'Referanslarımız',
        target = '_self',
        mega_menu_key = null,
        is_active = true,
        updated_at = now()
    where menu_key = 'header'
      and parent_id is null
      and url = '/referanslarimiz';
  else
    select coalesce(
      min(sort_order) filter (where url = '/iletisim'),
      max(sort_order) + 1,
      1
    )
    into target_order
    from public.menu_items
    where menu_key = 'header' and parent_id is null;

    update public.menu_items
    set sort_order = sort_order + 1,
        updated_at = now()
    where menu_key = 'header'
      and parent_id is null
      and sort_order >= target_order;

    insert into public.menu_items (
      menu_key, parent_id, label, url, target, mega_menu_key, sort_order, is_active
    ) values (
      'header', null, 'Referanslarımız', '/referanslarimiz', '_self', null, target_order, true
    );
  end if;
end $$;

notify pgrst, 'reload schema';
