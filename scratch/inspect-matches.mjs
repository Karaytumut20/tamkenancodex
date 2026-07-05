import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcyovjvpjopgerterjxq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeW92anZwam9wZ2VydGVyanhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyMzE0NywiZXhwIjoyMDk1OTk5MTQ3fQ.5E8MSMtE7JV1KOalQWjai1e5mAMqdHd2ppP4Yppghws';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function inspectMatches() {
  const ids = [
    { table: 'products', id: '80f8aa49-4671-4a95-a015-53bfcc5b2965' },
    { table: 'products', id: 'a50142c7-2179-43d8-9879-00bcde0d126e' },
    { table: 'services', id: '1481a563-99a8-47fc-8c87-ebab04a84f7a' },
    { table: 'services', id: 'f9f7e7d0-511e-480b-89af-d429ad0e4317' },
  ];

  for (const item of ids) {
    const { data } = await supabase.from(item.table).select('*').eq('id', item.id).single();
    if (!data) continue;
    console.log(`\n=== Table: ${item.table} | Name/Title: ${data.name || data.title} ===`);
    for (const [k, v] of Object.entries(data)) {
      const s = JSON.stringify(v);
      if (s && (s.toLowerCase().includes('iyi') || s.toLowerCase().includes('çok'))) {
        console.log(`  Field [${k}]:`, s);
      }
    }
  }
}

inspectMatches().catch(console.error);
