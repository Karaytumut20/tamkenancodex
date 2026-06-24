import { createInterface } from 'readline';
import pg from 'pg';

const { Client } = pg;

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log('=== Supabase Database Migration Tool ===');
  console.log('This tool will apply the currency migration to your Supabase database');
  console.log('and refresh the PostgREST schema cache to fix the cache error.\n');

  const password = await question('Enter your Supabase Database Password: ');
  rl.close();

  if (!password) {
    console.error('Password cannot be empty.');
    process.exit(1);
  }

  // Connection string using connection pooler or direct connection
  const connectionString = `postgresql://postgres.jcyovjvpjopgerterjxq:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

  console.log('\nConnecting to database...');
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully!');

    console.log('\nApplying migrations...');

    // 1. Add payments.currency column
    await client.query(`
      ALTER TABLE public.payments 
      ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'TRY';
    `);
    console.log('• Added/verified payments.currency column');

    // 2. Add payments.currency constraint
    try {
      await client.query(`
        ALTER TABLE public.payments 
        ADD CONSTRAINT payments_currency_check CHECK (currency IN ('TRY', 'USD'));
      `);
      console.log('• Added payments_currency_check constraint');
    } catch (err) {
      if (err.code === '42710') {
        console.log('• payments_currency_check constraint already exists (skipped)');
      } else {
        throw err;
      }
    }

    // 3. Add service_orders.labor_price_currency column
    await client.query(`
      ALTER TABLE public.service_orders
      ADD COLUMN IF NOT EXISTS labor_price_currency text NOT NULL DEFAULT 'TRY';
    `);
    console.log('• Added/verified service_orders.labor_price_currency column');

    // 4. Add service_orders.labor_price_currency constraint
    try {
      await client.query(`
        ALTER TABLE public.service_orders
        ADD CONSTRAINT service_orders_currency_check CHECK (labor_price_currency IN ('TRY', 'USD'));
      `);
      console.log('• Added service_orders_currency_check constraint');
    } catch (err) {
      if (err.code === '42710') {
        console.log('• service_orders_currency_check constraint already exists (skipped)');
      } else {
        throw err;
      }
    }

    // 5. Reload PostgREST schema cache
    console.log('\nReloading PostgREST schema cache...');
    await client.query(`NOTIFY pgrst, 'reload schema';`);
    console.log('✅ PostgREST schema cache reloaded successfully!');

    console.log('\n🎉 Migration completed successfully! The schema cache error is resolved.');
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
