const SUPABASE_URL = 'https://miemdbqikmzxtekwivec.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZW1kYnFpa216eHRla3dpdmVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAwNDU4MSwiZXhwIjoyMDg3NTgwNTgxfQ.LAZBgsuOsGs02xmoBqcplTRWJTgxZALgMf1C3cVhD6Q';

async function request(endpoint, method = 'GET', body = null) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const options = {
    method,
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) {
    console.log(`❌ ERROR:`, JSON.stringify(data, null, 2));
    return null;
  }
  return data;
}

async function main() {
  console.log('=== HOÀN THIỆN ĐỜI 14 VÀ THÊM ĐỜI 15 ===\n');

  // === BƯỚC 1: TẠO FAMILIES CHO CÁC CỤ ĐỜI 14 CÒN LẠI ===
  console.log('1. Tạo families cho Đời 14 còn lại...');

  const familiesGen14 = [
    { handle: 'F14.1', father_handle: 'P14.1', mother_handle: null, children: ['P15.1'] },
    { handle: 'F14.2', father_handle: 'P14.2', mother_handle: null, children: ['P15.2'] },
    { handle: 'F14.3', father_handle: 'P14.3', mother_handle: null, children: ['P15.3'] },
    { handle: 'F14.5', father_handle: 'P14.5', mother_handle: null, children: ['P15.6', 'P15.7'] }
  ];

  for (const fam of familiesGen14) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ ${fam.handle} (${fam.children.length} con)`);
    }
  }

  // Cập nhật P14.x với families
  console.log('\n2. Cập nhật Đời 14 với families...');
  await request('people?handle=eq.P14.1', 'PATCH', { families: ['F14.1'] });
  console.log('   ✓ P14.1');
  await request('people?handle=eq.P14.2', 'PATCH', { families: ['F14.2'] });
  console.log('   ✓ P14.2');
  await request('people?handle=eq.P14.3', 'PATCH', { families: ['F14.3'] });
  console.log('   ✓ P14.3');
  await request('people?handle=eq.P14.5', 'PATCH', { families: ['F14.5'] });
  console.log('   ✓ P14.5');

  // === BƯỚC 2: THÊM 7 NGƯỜI ĐỜI 15 ===
  console.log('\n3. Thêm 7 người Đời 15...');

  const gen15People = [
    {
      handle: 'P15.1',
      display_name: 'Cụ Sĩ Chiêu (仕昭)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Chiêu',
      generation: 15,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F14.1'],
      families: [],
      notes: `Đời thứ mười lăm: Cụ Sĩ Chiêu.

Gia đình:
- Cha: Cụ Quốc Xiêu (P14.1)
- Con: Cụ Ngạn (Đời 16)`
    },
    {
      handle: 'P15.2',
      display_name: 'Cụ Sĩ Miễu (仕繆)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Miễu',
      generation: 15,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F14.2'],
      families: [],
      notes: `Đời thứ mười lăm: Cụ Sĩ Miễu.

Gia đình:
- Cha: Cụ Đình Dung (P14.2)
- Con: Cụ Triệu (Đời 16)`
    },
    {
      handle: 'P15.3',
      display_name: 'Cụ Sĩ Chi (仕癡)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Chi',
      generation: 15,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F14.3'],
      families: [],
      notes: `Đời thứ mười lăm: Cụ Sĩ Chi.

Gia đình:
- Cha: Cụ Trọng (P14.3)
- Con: Cụ Song (Đời 16)`
    },
    {
      handle: 'P15.4',
      display_name: 'Cụ Sĩ Bưu (仕彪)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Bưu',
      generation: 15,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F14.4.2'],
      families: [],
      degree: 'Đỗ hai khoa Tú tài',
      notes: `Đời thứ mười lăm: Cụ Sĩ Bưu (仕彪).

Học vị:
- Đỗ hai khoa Tú tài

Công đức:
- Chữa đình thôn Phú Xuân
- Làm Từ đường họ Đại Tôn
- Làm nhà thờ 5 gian, nhà khách 3 gian

Gia đình:
- Cha: Cụ Thịnh (P14.4)
- Mẹ: Nguyễn Quý thị Diệu Lĩnh (W14.4.2 - Á thất)
- Vợ: Nguyễn Quý thị hiệu Diệu Bảo
- Con: Sỹ Ôn (溫), Sỹ Thục (淑), Sỹ Bổi (落), Sỹ Chừng (澄)

Thông tin mộ táng:
- Mất ngày 29 tháng 5
- Thọ hơn 70 tuổi`
    },
    {
      handle: 'P15.5',
      display_name: 'Cụ Sĩ Đoán (仕鍛)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Đoán',
      generation: 15,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F14.4.1'],
      families: [],
      degree: 'Đỗ Cử nhân khoa Tân Sửu Ân khoa',
      notes: `Đời thứ mười lăm: Cụ Sĩ Đoán (仕鍛).

Học vị:
- Đỗ Cử nhân khoa Tân Sửu Ân khoa

Sự nghiệp:
- Tri phủ Phủ Thông Hóa
- Phụng thành Đại phu

Phong tặng:
- Được làng bầu làm Hậu thần
- Ghi nhận của cộng đồng địa phương về uy tín, đức hạnh và đóng góp

Gia đình:
- Cha: Cụ Thịnh (P14.4)
- Mẹ: Phạm Quý thị Diệu Đức (W14.4.1 - Chính thất)
- Con: Giám, Chứ, Chuyên (Đời 16)

Ghi chú: Bậc cử nhân đời 15, nhánh quan trọng.`
    },
    {
      handle: 'P15.6',
      display_name: 'Cụ Sĩ Trinh (仕貞)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Trinh',
      generation: 15,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F14.5'],
      families: [],
      notes: `Đời thứ mười lăm: Cụ Sĩ Trinh.

Gia đình:
- Cha: Cụ Quý (P14.5)
- Cháu: Cụ Danh Long (P13.4)
- Con: Binh, Hòe, Chăn (Đời 16)`
    },
    {
      handle: 'P15.7',
      display_name: 'Cụ Sĩ Khải (仕啟)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khải',
      generation: 15,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F14.5'],
      families: [],
      notes: `Đời thứ mười lăm: Cụ Sĩ Khải.

Gia đình:
- Cha: Cụ Quý (P14.5)
- Cháu: Cụ Danh Long (P13.4)
- Con: Kiềm, Hiệu, Chực (Đời 16)`
    }
  ];

  for (const person of gen15People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}`);
    }
  }

  // === BƯỚC 3: THÊM VỢ CHO ĐỜI 15 ===
  console.log('\n4. Thêm vợ cho Đời 15...');

  const wife = {
    handle: 'W15.4.1',
    display_name: 'Nguyễn Quý thị - Diệu Bảo (妙保)',
    surname: 'Nguyễn',
    first_name: 'Quý thị',
    generation: 15,
    gender: 0,
    is_patrilineal: false,
    is_living: false,
    parent_families: [],
    families: ['F15.4'],
    notes: `Chính thất của Cụ Sĩ Bưu (P15.4).
Hiệu: Diệu Bảo (妙保)`
  };

  const wResult = await request('people', 'POST', wife);
  if (wResult) {
    console.log(`   ✓ W15.4.1: ${wife.display_name}`);
  }

  // === BƯỚC 4: TẠO FAMILIES CHO ĐỜI 15 (chưa thêm con vì chưa insert Đời 16) ===
  console.log('\n5. Tạo families cho Đời 15...');

  const familiesGen15 = [
    { handle: 'F15.1', father_handle: 'P15.1', mother_handle: null, children: [] },
    { handle: 'F15.2', father_handle: 'P15.2', mother_handle: null, children: [] },
    { handle: 'F15.3', father_handle: 'P15.3', mother_handle: null, children: [] },
    { handle: 'F15.4', father_handle: 'P15.4', mother_handle: 'W15.4.1', children: [] },
    { handle: 'F15.5', father_handle: 'P15.5', mother_handle: null, children: [] },
    { handle: 'F15.6', father_handle: 'P15.6', mother_handle: null, children: [] },
    { handle: 'F15.7', father_handle: 'P15.7', mother_handle: null, children: [] }
  ];

  for (const fam of familiesGen15) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ ${fam.handle}`);
    }
  }

  // Cập nhật P15.x với families
  console.log('\n6. Cập nhật Đời 15 với families...');
  for (let i = 1; i <= 7; i++) {
    await request(`people?handle=eq.P15.${i}`, 'PATCH', { families: [`F15.${i}`] });
    console.log(`   ✓ P15.${i}`);
  }

  // === KIỂM TRA KẾT QUẢ ===
  console.log('\n7. Kiểm tra kết quả...');
  const gen15 = await request('people?generation=eq.15&select=handle,display_name,parent_families,degree&order=handle');

  console.log('\n=== ĐỜI 15 ===');
  if (gen15) {
    gen15.forEach(p => {
      console.log(`${p.handle}: ${p.display_name}`);
      console.log(`  - Cha: ${p.parent_families?.length > 0 ? p.parent_families[0] : 'Chưa rõ'}`);
      console.log(`  - Học vị: ${p.degree || 'N/A'}`);
    });
    console.log(`\nTổng: ${gen15.length} người`);
  }

  const wives15 = await request('people?gender=eq.0&generation=eq.15&select=handle,display_name');
  console.log('\n=== VỢ ĐỜI 15 ===');
  if (wives15 && wives15.length > 0) {
    wives15.forEach(w => console.log(`${w.handle}: ${w.display_name}`));
  } else {
    console.log('(Chỉ có 1 vợ có thông tin: W15.4.1)');
  }

  console.log('\n💡 PHÁT HIỆN QUAN TRỌNG:');
  console.log('  - Đời 15 là đời bắt đầu xuất hiện chữ "Sĩ" làm chữ lót chính thức');
  console.log('  - Nhánh Danh Thịnh → Sĩ Bưu, Sĩ Đoán là nhánh phát mạnh');
  console.log('  - Sĩ Đoán: Cử nhân, Tri phủ, Hậu thần');
  console.log('  - Sĩ Bưu: Tú tài, có công đức lớn (chữa đình, làm từ đường)');

  console.log('\n✅ HOÀN THÀNH! Đã hoàn thiện Đời 14 và thêm Đời 15.');
}

main().catch(console.error);
