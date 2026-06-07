import type { AdminRole } from "@/lib/admin/auth";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "json" | "array" | "select" | "datetime" | "checkboxes" | "custom_list" | "features_list";
export type FieldGroup = "content" | "media" | "publish" | "seo" | "settings";

export type AdminField = {
  name: string;
  label: string;
  type?: FieldType;
  group?: FieldGroup;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { label: string; value: string }[];
  optionSource?: "menuParents" | "brands";
};

export type AdminResource = {
  key: string;
  title: string;
  table: string;
  path: string;
  description: string;
  roles: AdminRole[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  searchable: string[];
  columns: { key: string; label: string }[];
  fields: AdminField[];
};

const contentRoles: AdminRole[] = ["super_admin", "editor"];
const supportRoles: AdminRole[] = ["super_admin", "support"];

const statusOptions = [
  { label: "Taslak", value: "draft" },
  { label: "Yayında", value: "published" },
];

const activeStatusOptions = [
  { label: "Aktif", value: "active" },
  { label: "Pasif", value: "passive" },
];

const targetOptions = [
  { label: "Aynı sekmede açılsın", value: "_self" },
  { label: "Yeni sekmede açılsın", value: "_blank" },
];

const menuLocationOptions = [
  { label: "Navbar", value: "header" },
  { label: "Mobil menu", value: "mobile" },
  { label: "Footer", value: "footer" },
];

const megaMenuOptions = [
  { label: "Hayır, açılır menü olmasın", value: "" },
  { label: "Evet, Alarm Sistemleri açılır menüsü olsun", value: "alarm-sistemleri" },
  { label: "Evet, Akıllı Ev açılır menüsü olsun", value: "akilli-ev-sistemleri" },
  { label: "Evet, Kamera Sistemleri açılır menüsü olsun", value: "kamera-sistemleri" },
];

const robotsIndexOptions = [
  { label: "index", value: "index" },
  { label: "noindex", value: "noindex" },
];

const robotsFollowOptions = [
  { label: "follow", value: "follow" },
  { label: "nofollow", value: "nofollow" },
];

const schemaOptions = [
  { label: "WebPage", value: "WebPage" },
  { label: "Article", value: "Article" },
  { label: "Service", value: "Service" },
  { label: "FAQPage", value: "FAQPage" },
  { label: "Product", value: "Product" },
  { label: "LocalBusiness", value: "LocalBusiness" },
];

const siteSettingOptions = [
  { label: "Site adi", value: "site.name" },
  { label: "Yasal firma adi", value: "site.legalName" },
  { label: "Site adresi", value: "site.url" },
  { label: "Site aciklamasi", value: "site.description" },
  { label: "Telefon", value: "contact.phone" },
  { label: "WhatsApp", value: "contact.whatsapp" },
  { label: "E-posta", value: "contact.email" },
  { label: "Adres", value: "contact.address" },
  { label: "Sehir", value: "contact.city" },
  { label: "Varsayilan SEO bilgileri", value: "seo.defaults" },
];

const seoFields: AdminField[] = [
  { name: "meta_title", label: "SEO title", group: "seo", helpText: "Recommended length: 50-60 characters." },
  { name: "meta_description", label: "Meta description", type: "textarea", group: "seo", helpText: "Recommended length: 140-160 characters." },
  { name: "focus_keyword", label: "Focus keyword", group: "seo", required: true },
  { name: "secondary_keywords", label: "Secondary keywords", type: "array", group: "seo", placeholder: "camera systems, alarm systems" },
  { name: "canonical_url", label: "Canonical URL", group: "seo" },
  { name: "robots_index", label: "Robots index", type: "select", group: "seo", options: robotsIndexOptions },
  { name: "robots_follow", label: "Robots follow", type: "select", group: "seo", options: robotsFollowOptions },
  { name: "og_title", label: "Open Graph title", group: "seo" },
  { name: "og_description", label: "Open Graph description", type: "textarea", group: "seo" },
  { name: "og_image_url", label: "Open Graph image URL", group: "seo" },
  { name: "twitter_title", label: "Twitter title", group: "seo" },
  { name: "twitter_description", label: "Twitter description", type: "textarea", group: "seo" },
  { name: "twitter_image_url", label: "Twitter image URL", group: "seo" },
  { name: "schema_type", label: "Schema type", type: "select", group: "seo", options: schemaOptions },
  { name: "json_ld", label: "Structured data notes", type: "json", group: "seo", placeholder: "Optional notes for structured data" },
  { name: "breadcrumb_label", label: "Breadcrumb label", group: "seo" },
  { name: "sitemap_include", label: "Include in sitemap", type: "boolean", group: "seo" },
  { name: "redirect_to", label: "Redirect target", group: "seo" },
];

const imageFields: AdminField[] = [
  { name: "image_url", label: "Ana Görsel (Resim Adresi)", group: "media", placeholder: "Örn: https://resim-adresi.com/gorsel.jpg" },
  { name: "image_alt", label: "Görsel Açıklaması (Alt Etiketi)", group: "media", required: true, placeholder: "Görseli tanımlayan 2-3 kelime" },
];

export const adminResources: Record<string, AdminResource> = {
  siteContent: {
    key: "siteContent",
    title: "Site Contents",
    table: "site_content",
    path: "/admin/site-content",
    description: "Reusable homepage sections, CTA blocks, header/footer copy and editable global content.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["section_key", "title", "subtitle", "body"],
    columns: [
      { key: "section_key", label: "Section" },
      { key: "title", label: "Title" },
      { key: "status", label: "Status" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "section_key", label: "Section key", required: true, group: "settings", placeholder: "home.hero" },
      { name: "title", label: "Title", group: "content", required: true },
      { name: "subtitle", label: "Short description", type: "textarea", group: "content" },
      { name: "body", label: "Body content", type: "textarea", group: "content" },
      { name: "primary_button_label", label: "Primary button label", group: "content" },
      { name: "primary_button_url", label: "Primary button URL", group: "content" },
      { name: "secondary_button_label", label: "Secondary button label", group: "content" },
      { name: "secondary_button_url", label: "Secondary button URL", group: "content" },
      ...imageFields,
      { name: "items", label: "Cards / repeated items JSON", type: "json", group: "content" },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      { name: "status", label: "Status", type: "select", group: "publish", options: activeStatusOptions },
    ],
  },
  pages: {
    key: "pages",
    title: "Pages",
    table: "pages",
    path: "/admin/pages",
    description: "Static corporate pages with content, media, publishing and SEO controls.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["title", "slug", "h1", "excerpt", "content"],
    columns: [
      { key: "title", label: "Page" },
      { key: "slug", label: "Slug" },
      { key: "status", label: "Status" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "title", label: "Admin title", required: true, group: "content" },
      { name: "slug", label: "Slug", required: true, group: "seo" },
      { name: "h1", label: "Page H1", required: true, group: "content" },
      { name: "excerpt", label: "Short description", type: "textarea", group: "content" },
      { name: "content", label: "Main content", type: "textarea", group: "content" },
      { name: "cta_label", label: "CTA button label", group: "content" },
      { name: "cta_url", label: "CTA button URL", group: "content" },
      ...imageFields,
      { name: "status", label: "Publish status", type: "select", group: "publish", options: statusOptions },
      { name: "published_at", label: "Publish date", type: "datetime", group: "publish" },
      ...seoFields,
    ],
  },
  services: {
    key: "services",
    title: "Services",
    table: "services",
    path: "/admin/services",
    description: "Service landing pages, benefits, use cases, FAQs and SEO fields.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["title", "slug", "hero_description", "intro_content"],
    columns: [
      { key: "title", label: "Service" },
      { key: "slug", label: "Slug" },
      { key: "is_active", label: "Active" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "title", label: "Service name", required: true, group: "content" },
      { name: "slug", label: "Slug", required: true, group: "seo" },
      { name: "eyebrow", label: "Eyebrow", group: "content" },
      { name: "hero_title", label: "Hero title / H1", group: "content", required: true },
      { name: "hero_description", label: "Hero description", type: "textarea", group: "content" },
      ...imageFields,
      { name: "card_image_url", label: "Card image URL", group: "media" },
      { name: "card_image_alt", label: "Card image alt text", group: "media" },
      { name: "intro_title", label: "Intro title", group: "content" },
      { name: "intro_content", label: "Long description", type: "textarea", group: "content" },
      { name: "advantages", label: "Benefits JSON", type: "json", group: "content" },
      { name: "usage_areas", label: "Use cases JSON", type: "json", group: "content" },
      { name: "process_steps", label: "Process steps JSON", type: "json", group: "content" },
      { name: "faqs", label: "FAQ JSON", type: "json", group: "content" },
      { name: "related_service_slugs", label: "Related service slugs", type: "array", group: "content" },
      { name: "cta_title", label: "CTA title", group: "content" },
      { name: "cta_description", label: "CTA description", type: "textarea", group: "content" },
      { name: "is_active", label: "Published", type: "boolean", group: "publish" },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      ...seoFields,
    ],
  },
  blog: {
    key: "blog",
    title: "Blog Yazıları",
    table: "blog_posts",
    path: "/admin/blog",
    description: "Blog, duyuru ve rehber yazılarını buradan yönetin.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["title", "slug", "excerpt", "content"],
    columns: [
      { key: "title", label: "Yazı Başlığı" },
      { key: "status", label: "Durum" },
      { key: "updated_at", label: "Güncelleme" },
    ],
    fields: [
      { name: "title", label: "Yazı Başlığı", required: true, group: "content", placeholder: "Örn: Kamera Sistemi Kurulumu Rehberi" },
      { name: "slug", label: "Sayfa Linki", group: "seo", helpText: "Boş bırakırsanız otomatik oluşturulur." },
      { name: "excerpt", label: "Kısa Özet", type: "textarea", group: "content", placeholder: "Yazının kısa bir özeti (2-3 cümle)", helpText: "Bu metin listeleme sayfalarında ve Google sonuçlarında görünür." },
      { name: "content", label: "Yazı İçeriği", type: "textarea", group: "content", placeholder: "Yazınızı buraya yazın..." },
      { name: "cover_image_url", label: "Kapak Görseli (URL)", group: "media", placeholder: "https://...", helpText: "Yazının başında gösterilecek resmin internet adresi." },
      { name: "cover_image_alt", label: "Görsel açıklaması", group: "media" },
      { name: "category_name", label: "Kategori", group: "content" },
      { name: "tags", label: "Etiketler", type: "array", group: "content" },
      { name: "reading_time", label: "Okuma süresi", group: "content" },
      { name: "author_name", label: "Yazar", group: "content" },
      { name: "published_at", label: "Yayın tarihi", type: "datetime", group: "publish" },
      { name: "status", label: "Durum", type: "select", group: "publish", options: statusOptions, helpText: "Taslak: sadece siz görürsünüz. Yayında: herkes görür." },
      { name: "table_of_contents", label: "İçindekiler", type: "json", group: "content" },
      { name: "faqs", label: "Sık Sorulan Sorular", type: "json", group: "content" },
      ...seoFields,
    ],
  },
  media: {
    key: "media",
    title: "Media Library",
    table: "media_assets",
    path: "/admin/media",
    description: "Images and files with required alt text, captions and optimization metadata.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["file_name", "path", "alt_text", "title_text", "caption"],
    columns: [
      { key: "file_name", label: "File" },
      { key: "alt_text", label: "Alt text" },
      { key: "webp_optimized", label: "WebP" },
      { key: "created_at", label: "Created" },
    ],
    fields: [
      { name: "bucket", label: "Bucket", required: true, group: "settings", placeholder: "site-media" },
      { name: "path", label: "Storage path", required: true, group: "settings" },
      { name: "public_url", label: "Public URL", group: "media" },
      { name: "file_name", label: "File name", required: true, group: "media" },
      { name: "file_type", label: "File type", group: "media" },
      { name: "size_bytes", label: "Size bytes", type: "number", group: "media" },
      { name: "alt_text", label: "Alt text", required: true, group: "media" },
      { name: "title_text", label: "Title text", group: "media" },
      { name: "caption", label: "Caption", group: "media" },
      { name: "description", label: "Description", type: "textarea", group: "media" },
      { name: "used_on", label: "Used on pages", type: "array", group: "media" },
      { name: "webp_optimized", label: "WebP optimized", type: "boolean", group: "media" },
      { name: "lazy_load", label: "Lazy load", type: "boolean", group: "media" },
    ],
  },
  seoSettings: {
    key: "seoSettings",
    title: "SEO Settings",
    table: "seo_settings",
    path: "/admin/seo-settings",
    description: "Standalone redirects, robots rules and global SEO overrides.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["entity_type", "path", "meta_title", "focus_keyword"],
    columns: [
      { key: "path", label: "URL" },
      { key: "entity_type", label: "Type" },
      { key: "focus_keyword", label: "Focus keyword" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "entity_type", label: "Entity type", required: true, group: "settings" },
      { name: "entity_id", label: "Entity ID", group: "settings" },
      { name: "path", label: "URL path", required: true, group: "seo" },
      ...seoFields,
    ],
  },
  leads: {
    key: "leads",
    title: "Gelen Talepler / Leads",
    table: "leads",
    path: "/admin/leads",
    description: "Siteden gelen iletişim, teklif ve sistem tasarlama talepleri.",
    roles: supportRoles,
    canCreate: false,
    canEdit: true,
    canDelete: false,
    searchable: ["full_name", "phone", "email", "city", "message"],
    columns: [
      { key: "full_name", label: "Müşteri Adı" },
      { key: "phone", label: "Telefon" },
      { key: "source", label: "Kaynak" },
      { key: "status", label: "Durum" },
      { key: "created_at", label: "Tarih" },
    ],
    fields: [
      { name: "full_name", label: "Müşteri Adı", group: "content" },
      { name: "phone", label: "Telefon Numarası", required: true, group: "content" },
      { name: "email", label: "E-posta Adresi", group: "content" },
      { name: "city", label: "Şehir", group: "content" },
      { name: "district", label: "İlçe", group: "content" },
      { name: "message", label: "Müşteri Mesajı", type: "textarea", group: "content" },
      {
        name: "source",
        label: "Talep Kaynağı",
        type: "select",
        required: true,
        group: "settings",
        options: [
          { label: "İletişim Formu", value: "contact_form" },
          { label: "Ürün Teklifi", value: "product_quote" },
          { label: "Hizmet Teklifi", value: "service_quote" },
          { label: "Sistem Tasarlayıcı", value: "system_builder" },
          { label: "WhatsApp", value: "whatsapp_click" },
          { label: "Manuel", value: "manual" },
        ],
      },
      {
        name: "status",
        label: "İşlem Durumu",
        type: "select",
        group: "publish",
        options: [
          { label: "Yeni Talep", value: "new" },
          { label: "Görüşüldü / İletişim Kuruldu", value: "contacted" },
          { label: "Teklif Gönderildi", value: "proposal_sent" },
          { label: "Kazanıldı / Tamamlandı", value: "won" },
          { label: "Kaybedildi / İptal", value: "lost" },
          { label: "Spam / Gereksiz", value: "spam" },
        ],
      },
      {
        name: "priority",
        label: "Öncelik Derecesi",
        type: "select",
        group: "settings",
        options: [
          { label: "Düşük", value: "low" },
          { label: "Normal", value: "normal" },
          { label: "Yüksek", value: "high" },
        ],
      },
      { name: "admin_note", label: "Yönetici Notu", type: "textarea", group: "content", placeholder: "Görüşme detayları veya takip notları yazın..." },
      { name: "page_url", label: "Gelen Sayfa Adresi (URL)", group: "settings" },
      { name: "kvkk_consent", label: "KVKK Onayı", type: "boolean", group: "settings" },
      { name: "metadata", label: "Sistem Tasarım Detayları (JSON)", type: "json", group: "settings" },
    ],
  },
  menuItems: {
    key: "menuItems",
    title: "Menu Management",
    table: "menu_items",
    path: "/admin/menu-items",
    description: "Header, mobile and footer navigation items with ordering and parent support.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["label", "url", "menu_key"],
    columns: [
      { key: "menu_key", label: "Menu" },
      { key: "label", label: "Label" },
      { key: "url", label: "URL" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { name: "menu_key", label: "Bu menü nerede görünsün?", type: "select", required: true, group: "settings", options: menuLocationOptions },
      { name: "parent_id", label: "Ana menü mü, alt menü mü?", type: "select", group: "settings", optionSource: "menuParents", helpText: "Ana menü olacaksa boş bırakın. Alt menü olacaksa bağlı olduğu ana menüyü seçin." },
      { name: "label", label: "Menü başlığı", required: true, group: "content", placeholder: "Örn: Ürünler" },
      { name: "url", label: "Tıklanınca gideceği sayfa", required: true, group: "content", placeholder: "/urunler" },
      { name: "target", label: "Link nasıl açılsın?", type: "select", group: "settings", options: targetOptions },
      { name: "mega_menu_key", label: "Bu ana menü açılır menü kullansın mı?", type: "select", group: "settings", options: megaMenuOptions },
      { name: "description", label: "Kısa açıklama", type: "textarea", group: "content" },
      { name: "image_url", label: "Menü görseli", group: "media" },
      { name: "image_alt", label: "Görsel açıklaması", group: "media" },
      { name: "sort_order", label: "Sıralama", type: "number", group: "settings", helpText: "Küçük sayı daha önce görünür. Örn: 1, 2, 3" },
      { name: "is_active", label: "Bu menü aktif olsun", type: "boolean", group: "publish" },
    ],
  },
  faqs: {
    key: "faqs",
    title: "FAQ Management",
    table: "faqs",
    path: "/admin/faqs",
    description: "Global and page-specific FAQ entries for content sections and schema.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["question", "answer", "page_slug"],
    columns: [
      { key: "question", label: "Question" },
      { key: "page_slug", label: "Page" },
      { key: "is_active", label: "Active" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "question", label: "Question", required: true, group: "content" },
      { name: "answer", label: "Answer", type: "textarea", required: true, group: "content" },
      { name: "page_slug", label: "Related page slug", group: "settings" },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      { name: "is_active", label: "Active", type: "boolean", group: "publish" },
    ],
  },
  testimonials: {
    key: "testimonials",
    title: "References",
    table: "testimonials",
    path: "/admin/testimonials",
    description: "Customer references and short testimonial cards.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["company_name", "person_name", "quote"],
    columns: [
      { key: "company_name", label: "Company" },
      { key: "person_name", label: "Person" },
      { key: "is_active", label: "Active" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "company_name", label: "Company name", required: true, group: "content" },
      { name: "person_name", label: "Person name", group: "content" },
      { name: "role", label: "Role", group: "content" },
      { name: "quote", label: "Quote", type: "textarea", required: true, group: "content" },
      { name: "logo_url", label: "Logo URL", group: "media" },
      { name: "logo_alt", label: "Logo alt text", group: "media" },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      { name: "is_active", label: "Active", type: "boolean", group: "publish" },
    ],
  },
  projects: {
    key: "projects",
    title: "Projects",
    table: "projects",
    path: "/admin/projects",
    description: "Reference projects, project visuals and service tags.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["title", "slug", "summary", "location"],
    columns: [
      { key: "title", label: "Project" },
      { key: "location", label: "Location" },
      { key: "status", label: "Status" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "title", label: "Project title", required: true, group: "content" },
      { name: "slug", label: "Slug", required: true, group: "seo" },
      { name: "summary", label: "Summary", type: "textarea", group: "content" },
      { name: "content", label: "Project content", type: "textarea", group: "content" },
      { name: "location", label: "Location", group: "content" },
      { name: "service_tags", label: "Service tags", type: "array", group: "content" },
      ...imageFields,
      { name: "gallery", label: "Gallery JSON", type: "json", group: "media" },
      { name: "status", label: "Status", type: "select", group: "publish", options: statusOptions },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      ...seoFields,
    ],
  },
  siteSettings: {
    key: "siteSettings",
    title: "Site Settings",
    table: "site_settings",
    path: "/admin/settings",
    description: "Logo, favicon, default SEO, contact details, analytics and robots/sitemap settings.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    searchable: ["key"],
    columns: [
      { key: "key", label: "Setting" },
      { key: "value", label: "Value" },
      { key: "updated_at", label: "Updated" },
    ],
    fields: [
      { name: "key", label: "Ayar", type: "select", required: true, group: "settings", options: siteSettingOptions },
      { name: "value", label: "Ayar degeri", type: "json", required: true, group: "settings", placeholder: "+90 532 000 00 00" },
    ],
  },
  products: {
    key: "products",
    title: "Ürünler",
    table: "products",
    path: "/admin/products",
    description: "Ürünleri ekleyin, düzenleyin ve yayın durumunu yönetin.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["title", "sku", "slug", "short_description"],
    columns: [
      { key: "title", label: "Ürün Adı" },
      { key: "is_active", label: "Durum" },
      { key: "updated_at", label: "Güncelleme" },
    ],
    fields: [
      { name: "title", label: "Ürün Adı", required: true, group: "content", placeholder: "Örn: Hikvision CCTV Kamera" },
      { name: "slug", label: "Sayfa Linki", group: "seo", helpText: "Boş bırakırsanız otomatik oluşturulur." },
      { name: "sku", label: "Ürün Kodu", group: "content" },
      { name: "categories_list", label: "Ürün Kategorileri (Birden Fazla Seçilebilir)", type: "checkboxes", group: "content", options: [
        { label: "Alarm Sistemleri", value: "Alarm Sistemleri" },
        { label: "Akıllı Ev Sistemleri", value: "Akıllı Ev Sistemleri" },
        { label: "Kamera Sistemleri", value: "Kamera Sistemleri" },
        { label: "Yangın İhbar Sistemleri", value: "Yangın İhbar Sistemleri" },
        { label: "Personel Takip PDKS", value: "Personel Takip PDKS" },
        { label: "Network Çözümleri", value: "Network Çözümleri" }
      ]},
      { name: "brand_id", label: "Marka", type: "select", group: "content", optionSource: "brands" },
      { name: "short_description", label: "Kısa Açıklama", type: "textarea", group: "content", placeholder: "Ürünün 2-3 cümlelik kısa tanımı" },
      { name: "long_description", label: "Detaylı Ürün Rehberi", type: "textarea", group: "content", placeholder: "Detaylı açıklama girmezseniz otomatik olarak varsayılan rehber metni atanacaktır." },
      ...imageFields,
      { name: "gallery", label: "Galeri Görselleri", type: "json", group: "media" },
      { name: "tags", label: "Etiketler", type: "array", group: "content" },
      { name: "features", label: "Neden Bu Ürün? — Avantaj Kartları (En fazla 4 adet)", type: "features_list", group: "content" },
      { name: "show_features", label: "Neden Bu Ürün? Bölümünü Göster", type: "boolean", group: "content" },
      { name: "specs_title", label: "Teknik Özellikler — Bölüm Başlığı", type: "text", group: "content", placeholder: "Örn: Sınıfının En İyi Donanım Standartları" },
      { name: "specs_description", label: "Teknik Özellikler — Bölüm Açıklaması", type: "textarea", group: "content", placeholder: "Bölümün altındaki açıklama yazısı..." },
      { name: "installation_steps", label: "Teknik Özellik Kartları (Detayları)", type: "features_list", group: "content" },
      { name: "show_specs", label: "Teknik Özellikler Bölümünü Göster", type: "boolean", group: "content" },
      { name: "benefits_title", label: "Akıllı Entegrasyon — Bölüm Başlığı", type: "text", group: "content", placeholder: "Örn: Akıllı Entegrasyon ve Mobil Yönetim" },
      { name: "benefits_description", label: "Akıllı Entegrasyon — Bölüm Açıklaması", type: "textarea", group: "content", placeholder: "Bölümün altındaki açıklama yazısı..." },
      { name: "show_benefits", label: "Akıllı Entegrasyon Bölümünü Göster", type: "boolean", group: "content" },
      { name: "faqs", label: "Sık Sorulan Sorular", type: "json", group: "content" },
      { name: "is_featured", label: "Öne Çıkan Ürün", type: "boolean", group: "publish" },
      { name: "is_popular", label: "Popüler Ürün", type: "boolean", group: "publish" },
      { name: "is_active", label: "Sitede Gösterilsin", type: "boolean", group: "publish" },
      { name: "sort_order", label: "Sıralama", type: "number", group: "settings" },
      ...seoFields,
    ],
  },
  serviceAreas: {
    key: "serviceAreas",
    title: "Local SEO Pages",
    table: "service_areas",
    path: "/admin/service-areas",
    description: "Local service area pages kept available for SEO operations.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["city", "district", "service_type", "title", "slug"],
    columns: [
      { key: "title", label: "Title" },
      { key: "city", label: "City" },
      { key: "service_type", label: "Service" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { name: "city", label: "City", required: true, group: "content" },
      { name: "district", label: "District", group: "content" },
      { name: "service_type", label: "Service type", required: true, group: "content" },
      { name: "title", label: "Title / H1", required: true, group: "content" },
      { name: "slug", label: "Slug", required: true, group: "seo" },
      { name: "description", label: "Description", type: "textarea", group: "content" },
      { name: "content_sections", label: "Content sections JSON", type: "json", group: "content" },
      { name: "faqs", label: "FAQ JSON", type: "json", group: "content" },
      { name: "is_active", label: "Active", type: "boolean", group: "publish" },
      ...seoFields,
    ],
  },
  builderOptions: {
    key: "builderOptions",
    title: "System Builder Options",
    table: "builder_options",
    path: "/admin/builder-options",
    description: "System builder options kept available outside the simplified main menu.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["step_key", "title", "option_label", "option_value"],
    columns: [
      { key: "step_number", label: "Step" },
      { key: "title", label: "Title" },
      { key: "option_label", label: "Option" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { name: "step_number", label: "Step", type: "number", required: true, group: "settings" },
      { name: "step_key", label: "Step key", required: true, group: "settings" },
      { name: "title", label: "Title", required: true, group: "content" },
      { name: "description", label: "Description", type: "textarea", group: "content" },
      { name: "option_label", label: "Option label", required: true, group: "content" },
      { name: "option_value", label: "Option value", required: true, group: "settings" },
      { name: "image_url", label: "Image URL", group: "media" },
      { name: "price_effect", label: "Price effect", type: "number", group: "settings" },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      { name: "is_active", label: "Active", type: "boolean", group: "publish" },
    ],
  },
  categories: {
    key: "categories",
    title: "Categories",
    table: "categories",
    path: "/admin/categories",
    description: "Technical taxonomy kept available outside the simplified main menu.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["name", "slug", "description"],
    columns: [
      { key: "name", label: "Category" },
      { key: "type", label: "Type" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { name: "name", label: "Name", required: true, group: "content" },
      { name: "slug", label: "Slug", required: true, group: "seo" },
      {
        name: "type",
        label: "Type",
        type: "select",
        required: true,
        group: "settings",
        options: [
          { label: "Product", value: "product" },
          { label: "Service", value: "service" },
          { label: "Blog", value: "blog" },
        ],
      },
      { name: "description", label: "Description", type: "textarea", group: "content" },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      { name: "is_active", label: "Active", type: "boolean", group: "publish" },
    ],
  },
  brands: {
    key: "brands",
    title: "Brands",
    table: "brands",
    path: "/admin/brands",
    description: "Brand data kept available outside the simplified main menu.",
    roles: contentRoles,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    searchable: ["name", "slug", "description"],
    columns: [
      { key: "name", label: "Brand" },
      { key: "is_featured", label: "Featured" },
      { key: "is_active", label: "Active" },
    ],
    fields: [
      { name: "name", label: "Name", required: true, group: "content" },
      { name: "slug", label: "Slug", required: true, group: "seo" },
      { name: "logo_url", label: "Logo URL", group: "media" },
      { name: "logo_alt", label: "Logo alt text", group: "media" },
      { name: "description", label: "Description", type: "textarea", group: "content" },
      { name: "sort_order", label: "Sort order", type: "number", group: "settings" },
      { name: "is_featured", label: "Featured", type: "boolean", group: "publish" },
      { name: "is_active", label: "Active", type: "boolean", group: "publish" },
    ],
  },
};

export function getResourceByKey(key: string) {
  return adminResources[key];
}

const resourceText: Record<string, { title: string; description: string }> = {
  siteContent: { title: "Site Yazıları", description: "Anasayfa ve genel site bölümlerindeki başlık, açıklama, buton ve görseller." },
  pages: { title: "Sayfalar", description: "Kurumsal, hakkımızda, iletişim ve benzeri sabit sayfaları buradan yönetin." },
  services: { title: "Hizmetler", description: "Hizmet sayfalarını, açıklamalarını, görsellerini ve SEO bilgilerini buradan düzenleyin." },
  blog: { title: "Blog Yazıları", description: "Blog, duyuru ve rehber yazılarını buradan yönetin." },
  media: { title: "Görseller", description: "Sitede kullanılacak görsellerin açıklama ve SEO bilgilerini buradan yönetin." },
  seoSettings: { title: "SEO Ayarları", description: "Özel SEO yönlendirme ve arama motoru ayarları." },
  leads: { title: "Form Talepleri", description: "Siteden gelen iletişim ve teklif talepleri." },
  menuItems: { title: "Menüler", description: "Navbar, mobil menü ve footer menülerini buradan kolayca yönetin." },
  testimonials: { title: "Referanslar", description: "Müşteri yorumları ve referans bilgileri." },
  projects: { title: "Projeler", description: "Tamamlanan işler ve proje referansları." },
  faqs: { title: "Sık Sorulan Sorular", description: "Sitede gösterilecek soru-cevap alanları." },
  siteSettings: { title: "Site Ayarları", description: "Telefon, WhatsApp, e-posta, adres ve temel site bilgileri." },
  products: { title: "Ürünler", description: "Ürünleri ekleyin, düzenleyin ve yayın durumunu yönetin." },
  serviceAreas: { title: "Bölgesel Sayfalar", description: "Şehir ve ilçe bazlı SEO sayfaları." },
  builderOptions: { title: "Sistem Tasarla", description: "Kendi sistemini tasarla sayfasındaki seçenekler." },
  categories: { title: "Kategoriler", description: "Ürün, hizmet ve blog kategorileri." },
  brands: { title: "Markalar", description: "Marka adları, logoları ve açıklamaları." },
};

const fieldText: Record<string, string> = {
  title: "Başlık",
  slug: "Sayfa linki",
  h1: "Sayfa ana başlığı",
  excerpt: "Kısa açıklama",
  content: "İçerik",
  cta_label: "Buton yazısı",
  cta_url: "Buton linki",
  image_url: "Görsel",
  image_alt: "Görsel açıklaması",
  status: "Durum",
  published_at: "Yayın tarihi",
  meta_title: "Google başlığı",
  meta_description: "Google açıklaması",
  focus_keyword: "Anahtar kelime",
  secondary_keywords: "Ek anahtar kelimeler",
  canonical_url: "Asıl sayfa linki",
  robots_index: "Google'da görünsün mü?",
  robots_follow: "Linkleri takip etsin mi?",
  og_title: "Sosyal medya başlığı",
  og_description: "Sosyal medya açıklaması",
  og_image_url: "Sosyal medya görseli",
  twitter_title: "Twitter başlığı",
  twitter_description: "Twitter açıklaması",
  twitter_image_url: "Twitter görseli",
  schema_type: "Sayfa tipi",
  json_ld: "Yapılandırılmış veri notu",
  breadcrumb_label: "Kırılım başlığı",
  sitemap_include: "Site haritasına eklensin",
  redirect_to: "Yönlendirilecek link",
  section_key: "Bölüm adı",
  subtitle: "Kısa açıklama",
  body: "Metin",
  primary_button_label: "Birinci buton yazısı",
  primary_button_url: "Birinci buton linki",
  secondary_button_label: "İkinci buton yazısı",
  secondary_button_url: "İkinci buton linki",
  items: "Liste alanı",
  sort_order: "Sıralama",
  hero_title: "Üst başlık",
  hero_description: "Üst açıklama",
  intro_title: "Giriş başlığı",
  intro_content: "Detaylı açıklama",
  advantages: "Avantajlar",
  usage_areas: "Kullanım alanları",
  process_steps: "Süreç adımları",
  faqs: "Sık sorulan sorular",
  cta_title: "Çağrı başlığı",
  cta_description: "Çağrı açıklaması",
  is_active: "Aktif",
  short_description: "Kısa açıklama",
  long_description: "Uzun açıklama",
  gallery: "Galeri görselleri",
  tags: "Etiketler",
  features: "Özellikler",
  benefits: "Faydalar",
  price: "Fiyat",
  price_note: "Fiyat notu",
  is_featured: "Öne çıkar",
  is_popular: "Popüler",
  cover_image_url: "Kapak görseli",
  cover_image_alt: "Kapak görsel açıklaması",
  category_name: "Kategori",
  reading_time: "Okuma süresi",
  author_name: "Yazar",
  question: "Soru",
  answer: "Cevap",
  page_slug: "Bağlı sayfa",
  company_name: "Firma adı",
  person_name: "Kişi adı",
  role: "Görevi",
  quote: "Yorum",
  logo_url: "Logo",
  logo_alt: "Logo açıklaması",
  summary: "Özet",
  location: "Konum",
  service_tags: "Hizmet etiketleri",
  key: "Ayar",
  value: "Ayar değeri",
};

for (const resource of Object.values(adminResources)) {
  const text = resourceText[resource.key];
  if (text) {
    resource.title = text.title;
    resource.description = text.description;
  }

  resource.columns = resource.columns.map((column) => ({
    ...column,
    label: fieldText[column.key] ?? column.label
      .replace("Active", "Aktif")
      .replace("Updated", "Güncelleme")
      .replace("Created", "Tarih")
      .replace("Status", "Durum"),
  }));

  for (const field of resource.fields) {
    field.label = fieldText[field.name] ?? field.label;

    if (field.type === "json") {
      field.label = field.label
        .replace(" JSON", "")
        .replace("Custom JSON-LD", "Structured data notes")
        .replace("Value", "Setting value");

      if (!field.helpText) {
        field.helpText =
          field.name === "faqs"
            ? "Her satira bir soru-cevap yazin. Ornek: Alarm sistemi nedir? | Hareket algilandiginda bildirim gonderen guvenlik sistemidir."
            : field.name === "value"
              ? "Bu ayarin degerini normal metin olarak yazin. Ornek: +90 532 000 00 00"
              : "Her maddeyi yeni satira yazin. Teknik JSON bilmeniz gerekmez.";
      }

      if (!field.placeholder) {
        field.placeholder =
          field.name === "faqs"
            ? "Soru | Cevap"
            : field.name === "value"
              ? "Ayar degeri"
              : "Her maddeyi yeni satira yazin";
      }
    }

    if (field.type === "array" && !field.helpText) {
      field.helpText = "Birden fazla deger icin her maddeyi yeni satira yazabilirsiniz.";
    }
  }
}
