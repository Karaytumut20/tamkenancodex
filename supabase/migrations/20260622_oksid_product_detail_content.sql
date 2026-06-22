  alter table public.oksid_urunler
    add column if not exists short_description text,
    add column if not exists long_description text,
    add column if not exists features jsonb not null default '[]'::jsonb,
    add column if not exists show_features boolean not null default true,
    add column if not exists specs_title text,
    add column if not exists specs_description text,
    add column if not exists show_specs boolean not null default true,
    add column if not exists benefits_title text,
    add column if not exists benefits_description text,
    add column if not exists show_benefits boolean not null default true,
    add column if not exists faqs jsonb not null default '[]'::jsonb;
