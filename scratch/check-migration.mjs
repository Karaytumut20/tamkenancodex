import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcyovjvpjopgerterjxq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeW92anZwam9wZ2VydGVyanhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyMzE0NywiZXhwIjoyMDk1OTk5MTQ3fQ.5E8MSMtE7JV1KOalQWjai1e5mAMqdHd2ppP4Yppghws';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  console.log('Checking DB column status...\n');

  // Test payments.currency
  const { data: pd, error: pe } = await supabase
    .from('payments')
    .select('id, currency')
    .limit(1);
  
  if (pe) {
    if (pe.message.includes('currency') || pe.code === '42703') {
      console.log('❌ payments.currency column MISSING - needs migration');
    } else {
      console.log('⚠️  payments query error (may not be currency):', pe.message);
    }
  } else {
    console.log('✅ payments.currency column EXISTS');
  }

  // Test service_orders.labor_price_currency
  const { data: so, error: se } = await supabase
    .from('service_orders')
    .select('id, labor_price_currency')
    .limit(1);
  
  if (se) {
    if (se.message.includes('labor_price_currency') || se.code === '42703') {
      console.log('❌ service_orders.labor_price_currency column MISSING - needs migration');
    } else {
      console.log('⚠️  service_orders query error:', se.message);
    }
  } else {
    console.log('✅ service_orders.labor_price_currency column EXISTS');
  }
}

runMigration().catch(console.error);
