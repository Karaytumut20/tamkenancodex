import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAdminEnv } from '../scripts/supabase-admin-env.mjs';

const { supabaseUrl, serviceRoleKey } = requireSupabaseAdminEnv();

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
