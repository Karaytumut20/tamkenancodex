create table if not exists public.references (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  logo_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.references enable row level security;

create policy "public reads active references" on public.references
  for select to public using (is_active = true);

create policy "content admins manage references" on public.references
  for all to authenticated using (true) with check (true);

create index if not exists references_active_sort_idx on public.references(is_active, sort_order);
