/**
 * Script: Insert Đời 6 (Generation 6) - VERSION 2
 *
 * Đời 6 có 3 người với thông tin rõ ràng:
 * - P6.1: Cụ Đôn Chai (鈍齋) - con P5.1 (Củng Thuận)
 * - P6.2: Cụ Thân Gia (仁家) - con P5.1 (Củng Thuận)
 * - P6.3: Cụ Tấn - con P5.3 (Đạo Giền)
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

async function insertGen6() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║          🌳 INSERT ĐỜI 6 - GENERATION 6              ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // ============================================================
  // BƯỚC 1: Kiểm tra Đời 5 trước khi insert
  // ============================================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 1: Kiểm tra Đời 5 (cha của Đời 6)');
  console.log('═══════════════════════════════════════════════════════\n');

  const gen5Checks = ['P5.1', 'P5.3'];

  for (const handle of gen5Checks) {
    const person = await request(`people?handle=eq.${handle}&select=handle,display_name,families`);
    if (person.length === 0) {
      throw new Error(`❌ ${handle} không tồn tại! Cần có Đời 5 trước khi insert Đời 6.`);
    }
    console.log(`✓ ${handle}: ${person[0].display_name}`);
  }

  // ============================================================
  // BƯỚC 2: Tạo 3 người Đời 6
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 2: Tạo 3 người Đời 6');
  console.log('═══════════════════════════════════════════════════════\n');

  const gen6People = [
    {
      handle: 'P6.1',
      display_name: 'Cụ Đôn Chai (鈍齋)',
      surname: 'Nguyễn',
      first_name: 'Đôn Chai',
      generation: 6,
      gender: 1,
      is_patrilineal: true,
      parent_families: ['F5.1'],
      families: ['F6.1'], // Sẽ có 2 con ở Đời 7
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Sự nghiệp: Đời thứ sáu Cụ Đôn Chai 鈍齋 đỗ Nho sinh trúng thức.

Công đức nổi bật (ruộng khuyến học – điền sản chung với Cụ Thuần Chai 純齋):
Hai cụ (Đôn Chai và Thuần Chai) để lại một khu ruộng ở Bãi Ải xứ làm ruộng khuyến học, mô tả ranh giới:
- Đông cận cống Quai Vòng
- Tây cận Gi Ái điền (nay gọi là Thần Từ điền)
- Bắc cận Đại Giang
- Nam cận Đại Lộ

Ruộng này "để thưởng con cháu ai kế khoa nhận làm ruộng khuyến học"; về sau đạc thành 33 thửa, tổng 2 mẫu 6 sào 2 thước.

Nếu chưa có ai kế khoa, thì cả họ được canh tác ruộng ấy, lấy nguồn để làm giỗ hai cụ vào ngày 23 tháng Giêng và 15 tháng Mười một (ÂL).`
    },
    {
      handle: 'P6.2',
      display_name: 'Cụ Thân Gia (仁家)',
      surname: 'Nguyễn',
      first_name: 'Thân Gia',
      generation: 6,
      gender: 1,
      is_patrilineal: true,
      parent_families: ['F5.1'],
      families: [], // Không có con
      title: 'Lại bộ Tả thị lang, Tặng Thái bảo, Tước Lại Giang bá, Thượng đẳng thần',
      notes: `Sự nghiệp:
Cụ làm quan đến Lại bộ Tả thị lang, được tặng Thái bảo, tước Lại Giang bá, và gia tặng Thượng đẳng thần.

Công đức (điểm nổi bật nhất):
- Có nhiều công đức với dân làng, nên dân tôn làm Phúc thần (được thờ phụng trong làng)
- Ngày 26 tháng 7, niên hiệu Cảnh Hưng 44 (1782), vua Lê Hiển Tông ban phong hiệu

Ruộng tế điền:
Cụ để lại cho dân một khu đất/ruộng tại Bãi Ải xứ làm ruộng tế điền, có ranh giới:
- Đông cận Gi Ái điền
- Tây cận Đình vũ
- Nam cận Đại lộ
- Bắc cận Đại giang

Quy định cách dùng:
- Đoạn trên: giao thôn trưởng cấy luân lượt lấy gạo tẻ/cơm mới
- Đoạn dưới: giao đương cai cấy lấy gạo nếp làm lễ hạ điền

Ghi chú: Được dân làng tôn làm Phúc thần. Có để lại ruộng tế điền tại Bãi Ải xứ.`
    },
    {
      handle: 'P6.3',
      display_name: 'Cụ Tấn',
      surname: 'Nguyễn',
      first_name: 'Tấn',
      generation: 6,
      gender: 1,
      is_patrilineal: true,
      parent_families: ['F5.3'],
      families: [], // Không có con hoặc chưa ghi
      notes: 'Thông tin chi tiết chưa được ghi trong phả.'
    }
  ];

  console.log('Đang insert 3 người Đời 6...\n');

  for (const person of gen6People) {
    console.log(`🔄 Insert ${person.handle}: ${person.display_name}`);
    try {
      const result = await request('people', 'POST', person);
      console.log(`   ✓ Thành công: ${person.handle}`);
    } catch (error) {
      console.error(`   ❌ Lỗi khi insert ${person.handle}:`, error.message);
      throw error;
    }
  }

  // ============================================================
  // BƯỚC 3: Tạo F6.1 (gia đình của P6.1 Đôn Chai)
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 3: Tạo F6.1 (gia đình Đôn Chai)');
  console.log('═══════════════════════════════════════════════════════\n');

  const f61 = {
    handle: 'F6.1',
    father_handle: 'P6.1',
    mother_handle: null,
    children: [] // Sẽ thêm con sau khi insert Đời 7
  };

  console.log('🔄 Tạo F6.1...');
  try {
    await request('families', 'POST', f61);
    console.log('   ✓ F6.1 đã được tạo');
  } catch (error) {
    console.error('   ❌ Lỗi khi tạo F6.1:', error.message);
    throw error;
  }

  // ============================================================
  // BƯỚC 4: Update F5.1 và F5.3 để thêm con
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 4: Update families Đời 5');
  console.log('═══════════════════════════════════════════════════════\n');

  // Update F5.1: thêm P6.1, P6.2 vào children
  console.log('🔄 Update F5.1: thêm P6.1, P6.2 vào children...');
  const f51 = await request('families?handle=eq.F5.1&select=*');
  if (f51.length === 0) {
    throw new Error('❌ F5.1 không tồn tại!');
  }

  const f51Children = f51[0].children || [];
  const newF51Children = [...new Set([...f51Children, 'P6.1', 'P6.2'])]; // Use Set to avoid duplicates

  try {
    await request('families?handle=eq.F5.1', 'PATCH', { children: newF51Children });
    console.log(`   ✓ F5.1 children: [${newF51Children.join(', ')}]`);
  } catch (error) {
    console.error('   ❌ Lỗi khi update F5.1:', error.message);
    throw error;
  }

  // Update F5.3: thêm P6.3 vào children
  console.log('\n🔄 Update F5.3: thêm P6.3 vào children...');
  const f53 = await request('families?handle=eq.F5.3&select=*');
  if (f53.length === 0) {
    throw new Error('❌ F5.3 không tồn tại!');
  }

  const f53Children = f53[0].children || [];
  const newF53Children = [...new Set([...f53Children, 'P6.3'])]; // Use Set to avoid duplicates

  try {
    await request('families?handle=eq.F5.3', 'PATCH', { children: newF53Children });
    console.log(`   ✓ F5.3 children: [${newF53Children.join(', ')}]`);
  } catch (error) {
    console.error('   ❌ Lỗi khi update F5.3:', error.message);
    throw error;
  }

  // ============================================================
  // BƯỚC 5: Verify kết quả
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 5: Verify kết quả');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('Kiểm tra 3 người Đời 6:\n');
  for (const handle of ['P6.1', 'P6.2', 'P6.3']) {
    const person = await request(`people?handle=eq.${handle}&select=*`);
    if (person.length === 0) {
      console.log(`❌ ${handle} không tồn tại!`);
    } else {
      const p = person[0];
      console.log(`✓ ${handle}: ${p.display_name}`);
      console.log(`  - Generation: ${p.generation}`);
      console.log(`  - Parent families: [${p.parent_families?.join(', ') || 'EMPTY'}]`);
      console.log(`  - Families: [${p.families?.join(', ') || 'EMPTY'}]`);
    }
  }

  console.log('\nKiểm tra F5.1 và F5.3:\n');
  const f51Updated = await request('families?handle=eq.F5.1&select=*');
  console.log(`✓ F5.1 children: [${f51Updated[0].children?.join(', ') || 'EMPTY'}]`);

  const f53Updated = await request('families?handle=eq.F5.3&select=*');
  console.log(`✓ F5.3 children: [${f53Updated[0].children?.join(', ') || 'EMPTY'}]`);

  console.log('\nKiểm tra F6.1:\n');
  const f61Check = await request('families?handle=eq.F6.1&select=*');
  if (f61Check.length > 0) {
    console.log(`✓ F6.1 đã được tạo: father=${f61Check[0].father_handle}, children=[${f61Check[0].children?.join(', ') || 'EMPTY'}]`);
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n\n╔═══════════════════════════════════════════════════════╗');
  console.log('║              ✅ HOÀN THÀNH INSERT ĐỜI 6              ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📊 Tóm tắt:');
  console.log('  ✓ Đã insert 3 người Đời 6');
  console.log('  ✓ Đã tạo F6.1 (gia đình Đôn Chai)');
  console.log('  ✓ Đã update F5.1 (thêm 2 con: P6.1, P6.2)');
  console.log('  ✓ Đã update F5.3 (thêm 1 con: P6.3)');
  console.log('\n📌 Cấu trúc:');
  console.log('  P5.1 (Củng Thuận)');
  console.log('    ├─ P6.1 (Đôn Chai) → F6.1 → [Sẽ có 2 con ở Đời 7]');
  console.log('    └─ P6.2 (Thân Gia) → Không có con');
  console.log('\n  P5.3 (Đạo Giền)');
  console.log('    └─ P6.3 (Tấn) → Không có con');
  console.log('\n🎯 Bước tiếp theo: Insert Đời 7 (7.1, 7.2 là con của P6.1)');
  console.log('═══════════════════════════════════════════════════════\n');
}

insertGen6().catch(error => {
  console.error('\n❌ LỖI:', error.message);
  process.exit(1);
});
