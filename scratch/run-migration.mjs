import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAdminEnv } from '../scripts/supabase-admin-env.mjs';

const { supabaseUrl, serviceRoleKey } = requireSupabaseAdminEnv();
const managementAccessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!managementAccessToken) {
  throw new Error('SUPABASE_ACCESS_TOKEN gerekli. Service role anahtarı Management API erişimi için kullanılamaz.');
}

const projectRef = 'jcyovjvpjopgerterjxq';

// Use Supabase Management API to execute SQL directly
async function execSQL(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + managementAccessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  return { status: res.status, body: text };
}

// Alternative: use supabase client with pg function trick
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: 'public' }
});

async function runMigrations() {
  console.log('Attempting to run migrations via Management API...\n');
  
  const sqls = [
    `ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'TRY'`,
    `ALTER TABLE public.service_orders ADD COLUMN IF NOT EXISTS labor_price_currency text NOT NULL DEFAULT 'TRY'`,
  ];

  for (const sql of sqls) {
    console.log('Running:', sql.substring(0, 70) + '...');
    const result = await execSQL(sql);
    console.log('Status:', result.status);
    console.log('Response:', result.body.substring(0, 200));
    console.log('---');
  }

  // Verify
  console.log('\nVerifying...');
  const { data: pd, error: pe } = await supabase.from('payments').select('id, currency').limit(1);
  console.log('payments.currency:', pe ? `❌ ${pe.message}` : '✅ EXISTS');
  
  const { data: so, error: se } = await supabase.from('service_orders').select('id, labor_price_currency').limit(1);
  console.log('service_orders.labor_price_currency:', se ? `❌ ${se.message}` : '✅ EXISTS');
}

runMigrations().catch(console.error);
