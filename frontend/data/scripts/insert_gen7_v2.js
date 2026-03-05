/**
 * Script: Insert Đời 7 (Generation 7) - VERSION 2
 *
 * Đời 7 có 4 người:
 * - P7.1: Cụ Nhân Đương (仁當) - con P6.1 (Đôn Chai)
 * - P7.2: Cụ Năng Nhượng (能讓) - con P6.1 (Đôn Chai)
 * - P7.3: Cụ Đạt Nghị (達毅) - cháu P5.5 (Viên) - chưa rõ cha → floating node
 * - P7.4: Cụ Lượng - cháu P5.6 (Kính) - chưa rõ cha → floating node
 *
 * Tất cả đều is_living = false (đã mất)
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

async function insertGen7() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║          🌳 INSERT ĐỜI 7 - GENERATION 7              ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // ============================================================
  // BƯỚC 1: Kiểm tra Đời 6 trước khi insert
  // ============================================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 1: Kiểm tra Đời 6 (cha của Đời 7)');
  console.log('═══════════════════════════════════════════════════════\n');

  const p61 = await request('people?handle=eq.P6.1&select=handle,display_name,families');
  if (p61.length === 0) {
    throw new Error('❌ P6.1 (Đôn Chai) không tồn tại! Cần có Đời 6 trước.');
  }
  console.log(`✓ P6.1: ${p61[0].display_name}`);

  // ============================================================
  // BƯỚC 2: Tạo 4 người Đời 7
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 2: Tạo 4 người Đời 7');
  console.log('═══════════════════════════════════════════════════════\n');

  const gen7People = [
    {
      handle: 'P7.1',
      display_name: 'Cụ Nhân Đương (仁當)',
      surname: 'Nguyễn',
      first_name: 'Nhân Đương',
      generation: 7,
      gender: 1,
      is_patrilineal: true,
      is_living: false, // Đã mất
      parent_families: ['F6.1'],
      families: ['F7.1'], // Có 1 con ở Đời 8
      degree: 'Đỗ Nho sinh trúng thức',
      title: 'Tri phủ Phủ Lỵ Nhân',
      notes: 'Sự nghiệp: Đỗ Nho sinh trúng thức, làm quan đến Tri phủ Phủ Lỵ Nhân.\n\nCon: 8.1 Cụ Quân'
    },
    {
      handle: 'P7.2',
      display_name: 'Cụ Năng Nhượng (能讓)',
      surname: 'Nguyễn',
      first_name: 'Năng Nhượng',
      generation: 7,
      gender: 1,
      is_patrilineal: true,
      is_living: false, // Đã mất
      parent_families: ['F6.1'],
      families: [], // Không có con hoặc chưa ghi
      degree: 'Hoàng giáp khoa Nhâm Tuất – Quang Bảo thứ 8 (1561)',
      title: 'Hộ bộ Thượng thư; Đông các Đại học sĩ; Nhập thị Kinh diên; Đặc tiến Kim tử Vinh lộc Đại phu',
      death_place: 'Sông Bạch Đằng',
      notes: `Sự nghiệp: 27 tuổi đỗ Hoàng giáp khoa Nhâm Tuất (1561) dưới triều Vua Mạc Tuyên Tông, làm quan đến Hộ bộ Thượng thư, kiêm Đông các Đại học sĩ, Nhập thị kinh diên, tước Đạo Phái hầu. Có phụng mệnh đi sứ Tàu.

Trung tiết với nhà Mạc, được phong Thượng đẳng thần.

Can gián vua & lui về ở ẩn:
Cụ thường can vua, vua không nghe nên cáo về ở nhà, được gọi là Kim Khê xử sĩ.

Giữ mạch "ruộng khuyến học" của tổ tiên:
Khi nhà Mạc mất, chúa Trịnh đòi ra, cụ quyết không ra (có đoạn chặt một ngón chân làm cớ "chân có tật"), sau đó cụ đem sổ sách các xứ sở ruộng khuyến học của cha ông để lại giao cho trưởng họ là Cụ Nhân Đương giữ, để sau con cháu ai đỗ đại khoa thì nhận ruộng ấy.

Tuẫn tiết ở sông Bạch Đằng:
Cụ xuống thuyền ra Bạch Đằng, nói rõ quyết chí "chỉ có một cái chết", rồi đánh đắm thuyền mà chết. Sy Khai chép thêm câu chuyện người nhà bếp cảm nghĩa mà chết theo.

Được thờ làm Phúc thần, được phong thần:
Sy Khai ghi sau khi mất "tiếng thiêng liêng hiển hách", dân làng thờ làm Phúc thần. Năm Cảnh Hưng 44 (1782) triều Lê có phong tặng mỹ tự.`
    },
    {
      handle: 'P7.3',
      display_name: 'Cụ Đạt Nghị (達毅)',
      surname: 'Nguyễn',
      first_name: 'Đạt Nghị',
      generation: 7,
      gender: 1,
      is_patrilineal: true,
      is_living: false, // Đã mất
      parent_families: [], // Chưa rõ cha → floating node
      families: [], // Không có con
      title: 'Lại khoa Cấp sự trung',
      notes: 'Cụ Đạt Nghị 達毅 làm quan đến Lại khoa Cấp sự trung.\n\nGhi chú: Cháu cụ Viên (P5.5 Đời 5) - chưa rõ cha là ai ở Đời 6.\nNhánh được ghi rõ: "nhánh Viên → Đạt Nghị (cháu)"'
    },
    {
      handle: 'P7.4',
      display_name: 'Cụ Lượng',
      surname: 'Nguyễn',
      first_name: 'Lượng',
      generation: 7,
      gender: 1,
      is_patrilineal: true,
      is_living: false, // Đã mất
      parent_families: [], // Chưa rõ cha → floating node
      families: [], // Không có con
      degree: 'Tiến sĩ khoa Bính Thìn – Quang Bảo thứ 2 (1555)',
      title: 'Lại bộ Thượng thư',
      notes: 'Cụ Lượng 28 tuổi đỗ Tiến sĩ khoa Bính Thìn (1555), niên hiệu Quang Bảo 2, vua Tuyên Tông nhà Mạc, làm quan đến Lại bộ Thượng thư.\n\nGhi chú: Cháu cụ Kính (P5.6 Đời 5) - "Cụ là chắt cụ Kính". Chưa rõ cha là ai ở Đời 6.\nNhánh được ghi rõ: "nhánh Kính → Lượng (cháu)"'
    }
  ];

  console.log('Đang insert 4 người Đời 7...\n');

  for (const person of gen7People) {
    console.log(`🔄 Insert ${person.handle}: ${person.display_name}`);
    try {
      await request('people', 'POST', person);
      console.log(`   ✓ Thành công: ${person.handle}`);
    } catch (error) {
      console.error(`   ❌ Lỗi khi insert ${person.handle}:`, error.message);
      throw error;
    }
  }

  // ============================================================
  // BƯỚC 3: Tạo F7.1 (gia đình của P7.1 Nhân Đương)
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 3: Tạo F7.1 (gia đình Nhân Đương)');
  console.log('═══════════════════════════════════════════════════════\n');

  const f71 = {
    handle: 'F7.1',
    father_handle: 'P7.1',
    mother_handle: null,
    children: [] // Sẽ thêm con sau khi insert Đời 8
  };

  console.log('🔄 Tạo F7.1...');
  try {
    await request('families', 'POST', f71);
    console.log('   ✓ F7.1 đã được tạo');
  } catch (error) {
    console.error('   ❌ Lỗi khi tạo F7.1:', error.message);
    throw error;
  }

  // ============================================================
  // BƯỚC 4: Update F6.1 để thêm con
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 4: Update F6.1 (thêm P7.1, P7.2)');
  console.log('═══════════════════════════════════════════════════════\n');

  const f61 = await request('families?handle=eq.F6.1&select=*');
  if (f61.length === 0) {
    throw new Error('❌ F6.1 không tồn tại!');
  }

  const f61Children = f61[0].children || [];
  const newF61Children = [...new Set([...f61Children, 'P7.1', 'P7.2'])];

  console.log('🔄 Update F6.1: thêm P7.1, P7.2 vào children...');
  try {
    await request('families?handle=eq.F6.1', 'PATCH', { children: newF61Children });
    console.log(`   ✓ F6.1 children: [${newF61Children.join(', ')}]`);
  } catch (error) {
    console.error('   ❌ Lỗi khi update F6.1:', error.message);
    throw error;
  }

  // ============================================================
  // BƯỚC 5: Verify kết quả
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📋 BƯỚC 5: Verify kết quả');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('Kiểm tra 4 người Đời 7:\n');
  for (const handle of ['P7.1', 'P7.2', 'P7.3', 'P7.4']) {
    const person = await request(`people?handle=eq.${handle}&select=*`);
    if (person.length === 0) {
      console.log(`❌ ${handle} không tồn tại!`);
    } else {
      const p = person[0];
      console.log(`✓ ${handle}: ${p.display_name}`);
      console.log(`  - Generation: ${p.generation}`);
      console.log(`  - Is living: ${p.is_living}`);
      console.log(`  - Parent families: [${p.parent_families?.join(', ') || 'EMPTY'}]`);
      console.log(`  - Families: [${p.families?.join(', ') || 'EMPTY'}]`);
    }
  }

  console.log('\nKiểm tra F6.1:\n');
  const f61Updated = await request('families?handle=eq.F6.1&select=*');
  console.log(`✓ F6.1 children: [${f61Updated[0].children?.join(', ') || 'EMPTY'}]`);

  console.log('\nKiểm tra F7.1:\n');
  const f71Check = await request('families?handle=eq.F7.1&select=*');
  if (f71Check.length > 0) {
    console.log(`✓ F7.1 đã được tạo: father=${f71Check[0].father_handle}, children=[${f71Check[0].children?.join(', ') || 'EMPTY'}]`);
  }

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log('\n\n╔═══════════════════════════════════════════════════════╗');
  console.log('║              ✅ HOÀN THÀNH INSERT ĐỜI 7              ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  console.log('📊 Tóm tắt:');
  console.log('  ✓ Đã insert 4 người Đời 7 (tất cả is_living=false)');
  console.log('  ✓ Đã tạo F7.1 (gia đình Nhân Đương)');
  console.log('  ✓ Đã update F6.1 (thêm 2 con: P7.1, P7.2)');
  console.log('\n📌 Cấu trúc:');
  console.log('  P6.1 (Đôn Chai)');
  console.log('    ├─ P7.1 (Nhân Đương) → F7.1 → [Sẽ có 1 con ở Đời 8]');
  console.log('    └─ P7.2 (Năng Nhượng) → Không có con');
  console.log('\n  P7.3 (Đạt Nghị) - Floating (cháu P5.5, chưa rõ cha)');
  console.log('  P7.4 (Lượng) - Floating (cháu P5.6, chưa rõ cha)');
  console.log('\n🎯 Bước tiếp theo: Insert Đời 8 (8.1 Cụ Quân là con của P7.1)');
  console.log('═══════════════════════════════════════════════════════\n');
}

insertGen7().catch(error => {
  console.error('\n❌ LỖI:', error.message);
  process.exit(1);
});
