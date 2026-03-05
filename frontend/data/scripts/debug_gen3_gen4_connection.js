/**
 * Script: Kiểm tra kết nối Đời 3 (P003 - Cụ Lung) và Đời 4 (P006-P015)
 *
 * Mục đích:
 * - Kiểm tra record F004 (gia đình của Cụ Lung)
 * - Kiểm tra P003 (Cụ Lung - Đời 3)
 * - Kiểm tra P006-P015 (các con của Cụ Lung - Đời 4)
 * - Phát hiện nguyên nhân đứt rễ
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

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function checkConnection() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔍 KIỂM TRA KẾT NỐI ĐỜI 3 (P003) - ĐỜI 4 (P006-P015)');
  console.log('═══════════════════════════════════════════════════════\n');

  // 1. Kiểm tra F004 (Gia đình của Cụ Lung)
  console.log('📋 1. KIỂM TRA F004 (Gia đình Cụ Lung)');
  console.log('─────────────────────────────────────────────────────');
  const f004 = await fetchData('families?handle=eq.F004&select=*');
  console.log('F004 Data:', JSON.stringify(f004, null, 2));

  if (f004.length === 0) {
    console.log('⚠️  CẢNH BÁO: Không tìm thấy F004!');
  } else {
    const family = f004[0];
    console.log(`✓ Father: ${family.father_handle || 'NULL'}`);
    console.log(`✓ Mother: ${family.mother_handle || 'NULL'}`);
    console.log(`✓ Children: [${family.children?.join(', ') || 'EMPTY'}]`);
    console.log(`✓ Số con: ${family.children?.length || 0}`);
  }

  // 2. Kiểm tra P003 (Cụ Lung - Đời 3)
  console.log('\n👨 2. KIỂM TRA P003 (Cụ Lung - Đời 3)');
  console.log('─────────────────────────────────────────────────────');
  const p003 = await fetchData('people?handle=eq.P003&select=*');
  console.log('P003 Data:', JSON.stringify(p003, null, 2));

  if (p003.length === 0) {
    console.log('⚠️  CẢNH BÁO: Không tìm thấy P003!');
  } else {
    const person = p003[0];
    console.log(`✓ Tên: ${person.given_name || 'N/A'}`);
    console.log(`✓ Families (làm cha): [${person.families?.join(', ') || 'EMPTY'}]`);
    console.log(`✓ Parent Families (là con): [${person.parent_families?.join(', ') || 'EMPTY'}]`);
    console.log(`✓ Generation: ${person.generation || 'N/A'}`);

    if (!person.families || !person.families.includes('F004')) {
      console.log('❌ LỖI: P003 không có F004 trong mảng families!');
    }
  }

  // 3. Kiểm tra P006-P015 (Các con của Cụ Lung - Đời 4)
  console.log('\n👶 3. KIỂM TRA P006-P015 (Đời 4 - Các con Cụ Lung)');
  console.log('─────────────────────────────────────────────────────');
  const gen4Handles = ['P006', 'P007', 'P008', 'P009', 'P010', 'P011', 'P012', 'P013', 'P014', 'P015'];

  for (const handle of gen4Handles) {
    const person = await fetchData(`people?handle=eq.${handle}&select=*`);

    if (person.length === 0) {
      console.log(`⚠️  ${handle}: KHÔNG TÌM THẤY`);
      continue;
    }

    const p = person[0];
    const hasF004 = p.parent_families?.includes('F004');
    const status = hasF004 ? '✓' : '❌';

    console.log(`${status} ${handle} (${p.given_name || 'N/A'}): parent_families = [${p.parent_families?.join(', ') || 'EMPTY'}]`);

    if (!hasF004) {
      console.log(`   └─ ❌ THIẾU F004 trong parent_families!`);
    }
  }

  // 4. Tóm tắt vấn đề
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 TÓM TẮT VẤN ĐỀ');
  console.log('═══════════════════════════════════════════════════════');

  if (f004.length > 0) {
    const family = f004[0];
    const hasChildren = family.children && family.children.length > 0;
    const hasFather = family.father_handle === 'P003';

    console.log(`F004 có father_handle = P003? ${hasFather ? '✓ CÓ' : '❌ KHÔNG'}`);
    console.log(`F004 có children? ${hasChildren ? '✓ CÓ (' + family.children.length + ' con)' : '❌ KHÔNG (mảng rỗng)'}`);
  }

  if (p003.length > 0) {
    const person = p003[0];
    const hasF004 = person.families?.includes('F004');
    console.log(`P003 có F004 trong families? ${hasF004 ? '✓ CÓ' : '❌ KHÔNG'}`);
  }

  console.log('\n💡 KHUYẾN NGHỊ:');
  console.log('Nếu có bất kỳ dấu ❌ nào ở trên, cần chạy script fix để:');
  console.log('1. Đảm bảo F004.father_handle = "P003"');
  console.log('2. Đảm bảo F004.children = ["P006", "P007", ..., "P015"]');
  console.log('3. Đảm bảo P003.families = ["F004"]');
  console.log('4. Đảm bảo P006-P015 đều có parent_families = ["F004"]');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Chạy script
checkConnection().catch(console.error);
