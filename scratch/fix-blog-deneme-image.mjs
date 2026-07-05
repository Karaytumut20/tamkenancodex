import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jcyovjvpjopgerterjxq.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjeW92anZwam9wZ2VydGVyanhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQyMzE0NywiZXhwIjoyMDk1OTk5MTQ3fQ.5E8MSMtE7JV1KOalQWjai1e5mAMqdHd2ppP4Yppghws';

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
