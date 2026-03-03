/**
 * Liệt kê TẤT CẢ người trong database
 */

const SUPABASE_URL = 'https://miemdbqikmzxtekwivec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZW1kYnFpa216eHRla3dpdmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDQ1ODEsImV4cCI6MjA4NzU4MDU4MX0.VPmwz_PytzABux50MYFwIG55Vl-E4Cj8S2O5HLuDJek';

async function fetchData(endpoint) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

async function list() {
  // Lấy tất cả người, sắp xếp theo generation và handle
  const people = await fetchData('people?select=handle,display_name,generation,families,parent_families,is_patrilineal&order=generation.asc,handle.asc');

  console.log('═══════════════════════════════════════════════════════');
  console.log(`📊 TẤT CẢ NGƯỜI TRONG DATABASE (${people?.length || 0} người)`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (!Array.isArray(people)) {
    console.log('❌ Lỗi: Không lấy được data người:', people);
    return;
  }

  // Group by generation
  const byGen = {};
  people.forEach(p => {
    const gen = p.generation || 'N/A';
    if (!byGen[gen]) byGen[gen] = [];
    byGen[gen].push(p);
  });

  Object.keys(byGen).sort().forEach(gen => {
    console.log(`\n🌳 ĐỜI ${gen}:`);
    console.log('─────────────────────────────────────────────────────');

    byGen[gen].forEach(p => {
      const patrilineal = p.is_patrilineal ? '👨' : '👰';
      const name = p.display_name || 'N/A';
      const families = p.families?.length ? `Families:[${p.families.join(',')}]` : 'No families';
      const parentFamilies = p.parent_families?.length ? `Parent:[${p.parent_families.join(',')}]` : 'No parent';

      console.log(`${patrilineal} ${p.handle}: ${name} | ${families} | ${parentFamilies}`);
    });
  });

  // Lấy tất cả families
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('👨‍👩‍👧‍👦 TẤT CẢ GIA ĐÌNH TRONG DATABASE');
  console.log('═══════════════════════════════════════════════════════\n');

  const families = await fetchData('families?select=handle,father_handle,mother_handle,children&order=handle.asc');

  families.forEach(f => {
    const childCount = f.children?.length || 0;
    console.log(`${f.handle}: ${f.father_handle || 'NoFather'} + ${f.mother_handle || 'NoMother'} → ${childCount} con`);
    if (childCount > 0) {
      console.log(`   Children: [${f.children.join(', ')}]`);
    }
  });
}

list().catch(console.error);
