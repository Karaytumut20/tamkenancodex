import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jcyovjvpjopgerterjxq.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeW92anZwam9wZ2VydGVyanhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyMzE0NywiZXhwIjoyMDk1OTk5MTQ3fQ.5E8MSMtE7JV1KOalQWjai1e5mAMqdHd2ppP4Yppghws';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function testAll() {
  console.log('Testing DB queries...\n');

  const tests = [
    { name: 'references table', query: supabase.from('references').select('*').limit(1) },
    { name: 'products columns (side_attributes, technical_attributes, warranty_months)', query: supabase.from('products').select('side_attributes, technical_attributes, warranty_months').limit(1) },
    { name: 'oksid_urunler columns (side_attributes, technical_attributes, custom_attributes, short_description)', query: supabase.from('oksid_urunler').select('side_attributes, technical_attributes, custom_attributes, short_description').limit(1) },
    { name: 'menu_items table', query: supabase.from('menu_items').select('*').limit(1) },
    { name: 'payments table', query: supabase.from('payments').select('id, currency').limit(1) },
    { name: 'service_orders table', query: supabase.from('service_orders').select('id, labor_price_currency').limit(1) },
  ];

  for (const t of tests) {
    const res = await t.query;
    if (res.error) {
      console.error(`❌ ${t.name}: FAILED ->`, res.error.message, `(Code: ${res.error.code})`);
    } else {
      console.log(`✅ ${t.name}: SUCCESS`);
    }
  }
}

testAll().catch(console.error);
