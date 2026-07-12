import { createClient } from '@supabase/supabase-js';
import { requireSupabaseAdminEnv } from '../scripts/supabase-admin-env.mjs';

const { supabaseUrl, serviceRoleKey } = requireSupabaseAdminEnv();

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function cleanUp() {
  console.log('Inspecting and cleaning dummy test data in database...\n');

  // Fetch service with id 1d8b9a95-5a4d-44d9-95db-2a6de24b4a10
  const { data: service, error: sErr } = await supabase
    .from('services')
    .select('*')
    .eq('id', '1d8b9a95-5a4d-44d9-95db-2a6de24b4a10')
    .single();

  if (service) {
    console.log('Service 1d8b9a95-5a4d-44d9-95db-2a6de24b4a10 details:');
    console.log('  title:', service.title);
    console.log('  usage_areas:', JSON.stringify(service.usage_areas, null, 2));
    console.log('  advantages:', JSON.stringify(service.advantages, null, 2));
    console.log('  process_steps:', JSON.stringify(service.process_steps, null, 2));

    // Clean usage_areas
    if (Array.isArray(service.usage_areas)) {
      const cleanedUsageAreas = service.usage_areas
        .map(item => {
          if (typeof item === 'object' && item) {
            const title = String(item.title || '').trim();
            const description = String(item.description || '').trim();
            if (title === 'cokiyi' || title === 'cok iyi' || description === 'sadadada') {
              return null;
            }
            return {
              title: title.replace('Yangın ihbar sistemleriYangın ihbar sistemleri', 'Yangın İhbar Sistemleri'),
              description: description === 'sadadada' ? '' : description,
              active: true
            };
          }
          return null;
        })
        .filter(Boolean);

      console.log('\nCleaned usage_areas:', JSON.stringify(cleanedUsageAreas, null, 2));

      const { error: updateErr } = await supabase
        .from('services')
        .update({ usage_areas: cleanedUsageAreas })
        .eq('id', service.id);

      if (updateErr) {
        console.error('Error updating service usage_areas:', updateErr.message);
      } else {
        console.log('✅ Service usage_areas cleaned successfully!');
      }
    }
  }

  // Check all services for any other dummy strings
  const { data: allServices } = await supabase.from('services').select('*');
  for (const s of allServices || []) {
    let modified = false;
    let newUsageAreas = s.usage_areas;
    let newAdvantages = s.advantages;

    if (Array.isArray(newUsageAreas)) {
      const filtered = newUsageAreas.filter((item) => {
        const str = JSON.stringify(item).toLowerCase();
        if (str.includes('cokiyi') || str.includes('sadadada') || str.includes('asdasd') || str.includes('test')) {
          modified = true;
          return false;
        }
        return true;
      });
      newUsageAreas = filtered;
    }

    if (Array.isArray(newAdvantages)) {
      const filtered = newAdvantages.filter((item) => {
        const str = JSON.stringify(item).toLowerCase();
        if (str.includes('cokiyi') || str.includes('sadadada') || str.includes('asdasd')) {
          modified = true;
          return false;
        }
        return true;
      });
      newAdvantages = filtered;
    }

    if (modified) {
      console.log(`Cleaning service [${s.title}] (${s.id})...`);
      await supabase.from('services').update({ usage_areas: newUsageAreas, advantages: newAdvantages }).eq('id', s.id);
      console.log(`✅ Cleaned service [${s.title}]`);
    }
  }

  // Check all products for any dummy strings
  const { data: allProducts } = await supabase.from('products').select('*');
  for (const p of allProducts || []) {
    let modified = false;
    let sideAttrs = p.side_attributes;
    let techAttrs = p.technical_attributes;
    let features = p.features;

    const cleanList = (list) => {
      if (!Array.isArray(list)) return list;
      return list.filter((item) => {
        const str = JSON.stringify(item).toLowerCase();
        if (str.includes('cokiyi') || str.includes('sadadada') || str.includes('asdasd')) {
          modified = true;
          return false;
        }
        return true;
      });
    };

    sideAttrs = cleanList(sideAttrs);
    techAttrs = cleanList(techAttrs);
    features = cleanList(features);

    if (modified) {
      console.log(`Cleaning product [${p.name}] (${p.id})...`);
      await supabase.from('products').update({ side_attributes: sideAttrs, technical_attributes: techAttrs, features }).eq('id', p.id);
      console.log(`✅ Cleaned product [${p.name}]`);
    }
  }
}

cleanUp().catch(console.error);
