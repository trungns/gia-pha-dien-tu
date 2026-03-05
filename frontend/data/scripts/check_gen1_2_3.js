/**
 * Kiểm tra cấu trúc Đời 1, 2, 3 để hiểu pattern
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

async function check() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 KIỂM TRA CẤU TRÚC ĐỜI 1, 2, 3');
  console.log('═══════════════════════════════════════════════════════\n');

  // Kiểm tra P001, P002, P003
  for (let i = 1; i <= 3; i++) {
    const handle = `P00${i}`;
    const data = await fetchData(`people?handle=eq.${handle}&select=*`);

    console.log(`\n${handle} (Đời ${i}):`);
    console.log('─────────────────────────────────────────────────────');

    if (data.length === 0) {
      console.log(`❌ KHÔNG TỒN TẠI`);
    } else {
      const p = data[0];
      console.log(`✓ Tên: ${p.given_name || 'N/A'}`);
      console.log(`✓ Generation: ${p.generation}`);
      console.log(`✓ Families (làm cha): [${p.families?.join(', ') || 'EMPTY'}]`);
      console.log(`✓ Parent Families (là con): [${p.parent_families?.join(', ') || 'EMPTY'}]`);
      console.log(`✓ Birth Year: ${p.birth_year || 'N/A'}`);
      console.log(`✓ Death Year: ${p.death_year || 'N/A'}`);
    }
  }

  // Kiểm tra các gia đình
  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('👨‍👩‍👧‍👦 KIỂM TRA CÁC GIA ĐÌNH F001, F002, F003');
  console.log('═══════════════════════════════════════════════════════');

  for (let i = 1; i <= 3; i++) {
    const handle = `F00${i}`;
    const data = await fetchData(`families?handle=eq.${handle}&select=*`);

    console.log(`\n${handle}:`);
    console.log('─────────────────────────────────────────────────────');

    if (data.length === 0) {
      console.log(`❌ KHÔNG TỒN TẠI`);
    } else {
      const f = data[0];
      console.log(`✓ Father: ${f.father_handle || 'NULL'}`);
      console.log(`✓ Mother: ${f.mother_handle || 'NULL'}`);
      console.log(`✓ Children: [${f.children?.join(', ') || 'EMPTY'}]`);
    }
  }
}

check().catch(console.error);
