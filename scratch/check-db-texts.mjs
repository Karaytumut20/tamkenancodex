import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcyovjvpjopgerterjxq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeW92anZwam9wZ2VydGVyanhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyMzE0NywiZXhwIjoyMDk1OTk5MTQ3fQ.5E8MSMtE7JV1KOalQWjai1e5mAMqdHd2ppP4Yppghws';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function findCokIyi() {
  console.log('Searching for "iyi" or "çok" in database...\n');

  const tables = ['products', 'services', 'system_builder_groups', 'system_builder_items', 'oksid_urunler'];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.log(`Error checking ${table}:`, error.message);
      continue;
    }
    for (const row of data || []) {
      const jsonStr = JSON.stringify(row);
      if (jsonStr.toLowerCase().includes('iyi') || jsonStr.toLowerCase().includes('çok') || jsonStr.toLowerCase().includes('test')) {
        console.log(`Found in [${table}] (ID: ${row.id}):`);
        // print matched field
        for (const [key, val] of Object.entries(row)) {
          const valStr = JSON.stringify(val);
          if (valStr.toLowerCase().includes('iyi') || valStr.toLowerCase().includes('çok')) {
            console.log(`  - Field [${key}]:`, valStr);
          }
        }
      }
    }
  }
}

findCokIyi().catch(console.error);
