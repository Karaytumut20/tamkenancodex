-- Create system_builder_groups table
CREATE TABLE public.system_builder_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create system_builder_items table
CREATE TABLE public.system_builder_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.system_builder_groups(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL, -- 'product' or 'oksid'
    source_id TEXT NOT NULL, -- slug
    product_name TEXT NOT NULL,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.system_builder_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_builder_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on system_builder_groups"
    ON public.system_builder_groups FOR SELECT
    TO public
    USING (is_active = true);

CREATE POLICY "Allow public read access on system_builder_items"
    ON public.system_builder_items FOR SELECT
    TO public
    USING (is_active = true);

-- Create policies for admin full access
CREATE POLICY "Allow admin full access on system_builder_groups"
    ON public.system_builder_groups FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow admin full access on system_builder_items"
    ON public.system_builder_items FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_system_builder_groups_sort_order ON public.system_builder_groups(sort_order);
CREATE INDEX idx_system_builder_items_group_id ON public.system_builder_items(group_id);
CREATE INDEX idx_system_builder_items_sort_order ON public.system_builder_items(sort_order);
