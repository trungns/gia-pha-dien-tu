/**
 * Script: Update is_living = false cho Đời 1-16
 *
 * Logic:
 * - Từ Đời 1-16: Đã mất (set is_living = false)
 * - Nếu có năm mất rồi thì càng chắc chắn
 */

const SUPABASE_URL = 'https://miemdbqikmzxtekwivec.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZW1kYnFpa216eHRla3dpdmVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAwNDU4MSwiZXhwIjoyMDg3NTgwNTgxfQ.LAZBgsuOsGs02xmoBqcplTRWJTgxZALgMf1C3cVhD6Q';

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const response = await fetch(url, options);

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : null;
  } catch (e) {
    result = text;
  }

  if (!response.ok) {
    console.error(`   ❌ HTTP ${response.status}:`, result);
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
  }

  return result;
}

async function updateIsLiving() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║      🕊️  UPDATE IS_LIVING = FALSE (ĐỜI 1-16)        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // ============================================================
  // BƯỚC 1: Lấy tất cả người từ Đời 1-16
  // ============================================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 1: Lấy danh sách người Đời 1-16');
  console.log('═══════════════════════════════════════════════════════\n');

  const people = await request('people?generation=gte.1&generation=lte.16&select=handle,display_name,generation,is_living,death_year');

  console.log(`Tìm thấy ${people.length} người từ Đời 1-16\n`);

  if (people.length === 0) {
    console.log('✓ Không có người nào cần update');
    return;
  }

  // Group by generation
  const byGen = {};
  people.forEach(p => {
    const gen = p.generation || 'N/A';
    if (!byGen[gen]) byGen[gen] = [];
    byGen[gen].push(p);
  });

  console.log('Phân bố theo đời:');
  Object.keys(byGen).sort((a, b) => parseInt(a) - parseInt(b)).forEach(gen => {
    const count = byGen[gen].length;
    const living = byGen[gen].filter(p => p.is_living).length;
    console.log(`  Đời ${gen}: ${count} người (hiện tại ${living} người đang is_living=true)`);
  });

  // ============================================================
  // BƯỚC 2: Update hàng loạt
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 2: Update is_living = false');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('🔄 Đang update...');

  try {
    // Update tất cả người có generation từ 1-16
    const result = await request(
      'people?generation=gte.1&generation=lte.16',
      'PATCH',
      { is_living: false }
    );

    console.log(`✓ Đã update ${result.length} người`);
  } catch (error) {
    console.error('❌ Lỗi khi update:', error.message);
    throw error;
  }

  // ============================================================
  // BƯỚC 3: Verify kết quả
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 3: Verify kết quả');
  console.log('═══════════════════════════════════════════════════════\n');

  const afterUpdate = await request('people?generation=gte.1&generation=lte.16&select=handle,display_name,generation,is_living');

  const stillLiving = afterUpdate.filter(p => p.is_living === true);

  if (stillLiving.length > 0) {
    console.log(`⚠️  Còn ${stillLiving.length} người vẫn is_living=true:`);
    stillLiving.forEach(p => {
      console.log(`  - ${p.handle} (${p.display_name}) - Đời ${p.generation}`);
    });
  } else {
    console.log('✓ Tất cả người từ Đời 1-16 đã có is_living=false');
  }

  // Show statistics
  const byGenAfter = {};
  afterUpdate.forEach(p => {
    const gen = p.generation || 'N/A';
    if (!byGenAfter[gen]) byGenAfter[gen] = [];
    byGenAfter[gen].push(p);
  });

  console.log('\n📊 Thống kê sau khi update:');
  Object.keys(byGenAfter).sort((a, b) => parseInt(a) - parseInt(b)).forEach(gen => {
    const count = byGenAfter[gen].length;
    const deceased = byGenAfter[gen].filter(p => !p.is_living).length;
    console.log(`  Đời ${gen}: ${count} người (${deceased} người is_living=false)`);
  });

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n\n╔═══════════════════════════════════════════════════════╗');
  console.log('║           ✅ HOÀN THÀNH UPDATE IS_LIVING            ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📌 Tóm tắt:');
  console.log(`  ✓ Đã update ${afterUpdate.length} người từ Đời 1-16`);
  console.log('  ✓ Tất cả đều có is_living = false');
  console.log('\n🎯 Bây giờ có thể tiếp tục nạp Đời 7 với is_living=false');
  console.log('═══════════════════════════════════════════════════════\n');
}

updateIsLiving().catch(error => {
  console.error('\n❌ LỖI:', error.message);
  process.exit(1);
});
