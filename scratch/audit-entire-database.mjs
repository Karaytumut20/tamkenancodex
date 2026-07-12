import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAdminEnv } from '../scripts/supabase-admin-env.mjs';

const { supabaseUrl, serviceRoleKey } = requireSupabaseAdminEnv();

const supabase = createClient(supabaseUrl, serviceRoleKey);

const suspiciousKeywords = [
  'asdasd', 'sdsd', 'sadadada', 'lorem', 'ipsum',
  'cokiyi', 'cok iyi', 'qwerty', '123123', 'xxx', 'dummy'
];

async function auditDatabaseTextOnly() {
  console.log('🔍 Filtering Real Test Content in Database...\n');

  const tables = [
    'services',
    'products',
    'oksid_urunler',
    'categories',
    'system_builder_groups',
    'system_builder_items',
    'site_settings',
    'menu_items',
    'mega_menu_sections',
    'mega_menu_items',
    'references',
    'blog_posts',
    'pages',
    'faqs',
    'testimonials',
    'service_areas'
  ];

  let totalIssues = 0;

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error || !data) continue;

    for (const row of data) {
      for (const [key, value] of Object.entries(row)) {
        if (!value) continue;
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        if (valStr.startsWith('data:image')) continue; // skip base64

        const lowerVal = valStr.toLowerCase();

        for (const kw of suspiciousKeywords) {
          if (lowerVal.includes(kw)) {
            console.log(`❌ DISCOVERED ACCIDENTAL/TEST TEXT: [Table: ${table}] ID/Key: ${row.id || row.key}`);
            console.log(`   Field: [${key}] Match: "${kw}"`);
            console.log(`   Value: ${valStr.slice(0, 200)}\n`);
            totalIssues++;
          }
        }
      }
    }
  }

  if (totalIssues === 0) {
    console.log('🎉 PERFECT! Zero test/dummy keywords found across all tables in Supabase!');
  } else {
    console.log(`⚠️ Total suspicious items found: ${totalIssues}`);
  }
}

auditDatabaseTextOnly().catch(console.error);
