import { createServerClient } from '@supabase/ssr';

const supabase = createServerClient('https://jcyovjvpjopgerterjxq.supabase.co', 'dummy-key', {
  cookies: {
    getAll: () => [],
    setAll: () => {},
  },
});

console.log('auth keys:', Object.keys(supabase.auth));
console.log('getClaims type:', typeof supabase.auth.getClaims);
console.log('getUser type:', typeof supabase.auth.getUser);
