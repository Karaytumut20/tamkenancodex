# PrimeSec Supabase Setup

## Environment

The local project reads Supabase configuration from `.env.local`.

Required variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Do not commit `.env.local`. It is ignored by `.gitignore`.

## Apply Database Schema

Open the Supabase project SQL Editor and run:

```text
supabase/migrations/20260602231500_initial_admin_cms.sql
```

Then run the seed SQL:

```text
supabase/seed/seed.sql
```

If the REST API returns `Could not find the table ... in the schema cache` immediately after running SQL, wait briefly or refresh the API schema cache from Supabase dashboard settings.

## Create First Admin

1. Create a user in Supabase Auth.
2. Copy the created user's `auth.users.id`.
3. Run:

```sql
insert into public.admin_profiles (id, full_name, role, is_active)
values ('AUTH_USER_ID', 'PrimeSec Admin', 'super_admin', true);
```

## Test Pages

- `/admin/login`
- `/admin`
- `/admin/leads`
- `/admin/products`
- `/admin/services`
- `/admin/blog`
- `/admin/categories`
- `/admin/brands`
- `/admin/service-areas`
- `/admin/builder-options`
- `/admin/users`
