import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAdminEnv } from '../scripts/supabase-admin-env.mjs';

const { supabaseUrl, serviceRoleKey } = requireSupabaseAdminEnv();

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function fixBlogImage() {
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', '43683b26-0d00-42ec-8cfc-3da92925dd7b').single();
  if (post) {
    console.log('Blog post found:', post.title);
    console.log('Current cover_image_url:', post.cover_image_url);
    
    // Update cover_image_url if contains 'deneme'
    if (post.cover_image_url.includes('deneme')) {
      const cleanUrl = '/images/services/kamera-sistemi.jpg';
      await supabase.from('blog_posts').update({ cover_image_url: cleanUrl }).eq('id', post.id);
      console.log('✅ Updated blog post cover_image_url to:', cleanUrl);
    }
  }
}

fixBlogImage().catch(console.error);
