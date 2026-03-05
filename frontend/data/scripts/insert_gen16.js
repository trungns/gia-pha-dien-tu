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
  console.log('=== THÊM ĐỜI 16 ===\n');

  // === BƯỚC 1: THÊM 16 NGƯỜI ĐỜI 16 ===
  console.log('1. Thêm 16 người Đời 16...');

  const gen16People = [
    // Nhánh Sĩ Chiêu
    {
      handle: 'P16.1',
      display_name: 'Cụ Ngạn',
      surname: 'Nguyễn',
      first_name: 'Ngạn',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.1'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Ngạn.
Cha: Cụ Sĩ Chiêu (P15.1)
Con: Cụ Lân (Đời 17)`
    },
    // Nhánh Sĩ Miễu
    {
      handle: 'P16.2',
      display_name: 'Cụ Triệu',
      surname: 'Nguyễn',
      first_name: 'Triệu',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.2'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Triệu.
Cha: Cụ Sĩ Miễu (P15.2)
Con: Cụ Chỉnh (Đời 17)`
    },
    // Nhánh Sĩ Chi
    {
      handle: 'P16.3',
      display_name: 'Cụ Song',
      surname: 'Nguyễn',
      first_name: 'Song',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.3'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Song.
Cha: Cụ Sĩ Chi (P15.3)
Con: Cụ Mạc (Đời 17)`
    },
    // Nhánh Sĩ Bưu - 4 con
    {
      handle: 'P16.4',
      display_name: 'Cụ Sỹ Đồi (溫) - Kim Khê Xử sĩ',
      surname: 'Nguyễn',
      first_name: 'Sỹ Đồi',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.4'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Sỹ Đồi (溫).

Hiệu: Kim Khê Xử sĩ
An táng: Đồng Bé

Gia đình:
- Cha: Cụ Sĩ Bưu (P15.4)
- Vợ: Nguyễn Quý thị hiệu Từ Hữu (mất 1900)
- Con: Cụ Sỹ Đĩnh (Đời 17)

Ghi chú: Nhánh Sỹ Đồi là trục dẫn đến Sỹ Đĩnh → Sỹ Khái (Chi Sĩ Khải).`
    },
    {
      handle: 'P16.5',
      display_name: 'Cụ Sỹ Chực (淑)',
      surname: 'Nguyễn',
      first_name: 'Sỹ Chực',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.4'],
      families: [],
      degree: 'Đỗ Tú tài',
      notes: `Đời thứ mười sáu: Cụ Sỹ Chực (淑).

Học vị: Đỗ Tú tài
Chức vụ: Thông phán tỉnh Lạng Sơn

Gia đình:
- Cha: Cụ Sĩ Bưu (P15.4)`
    },
    {
      handle: 'P16.6',
      display_name: 'Cụ Sỹ Bồi (落) - Thúc Mỹ',
      surname: 'Nguyễn',
      first_name: 'Sỹ Bồi',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.4'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Sỹ Bồi (落).

Hiệu: Kim Khê Xử Sỹ
Tên chữ: Thúc Mỹ (識美)
Hiệu: Cúc Văn (學文)

Thông tin sinh mất:
- Sinh: Năm 1835 (Ất Mùi – Minh Mệnh thứ 16)
- Mất: Mùng 5 tháng 6 năm 1886 (Bính Tuất – Đồng Khánh thứ nhất)
- Thọ: 52 tuổi
- Mộ táng: Đồng Bé

Gia đình:
- Cha: Cụ Sĩ Bưu (P15.4)
- Vợ: Nguyễn Quý thị Phú hiệu Từ Hữu (慈有), mất 13/8
- Con: Cụ Sỹ Đĩnh (仕梃)`
    },
    {
      handle: 'P16.7',
      display_name: 'Cụ Sỹ Chừng (澄)',
      surname: 'Nguyễn',
      first_name: 'Sỹ Chừng',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.4'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Sỹ Chừng (澄).
Cha: Cụ Sĩ Bưu (P15.4)`
    },
    // Nhánh Sĩ Đoán - 3 con
    {
      handle: 'P16.8',
      display_name: 'Cụ Giám',
      surname: 'Nguyễn',
      first_name: 'Giám',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.5'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Giám.
Cha: Cụ Sĩ Đoán (P15.5)`
    },
    {
      handle: 'P16.9',
      display_name: 'Cụ Chứ',
      surname: 'Nguyễn',
      first_name: 'Chứ',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.5'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Chứ.
Cha: Cụ Sĩ Đoán (P15.5)`
    },
    {
      handle: 'P16.10',
      display_name: 'Cụ Chuyên',
      surname: 'Nguyễn',
      first_name: 'Chuyên',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.5'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Chuyên.
Cha: Cụ Sĩ Đoán (P15.5)`
    },
    // Nhánh Sĩ Trinh - 3 con
    {
      handle: 'P16.11',
      display_name: 'Cụ Binh',
      surname: 'Nguyễn',
      first_name: 'Binh',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.6'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Binh.
Cha: Cụ Sĩ Trinh (P15.6)`
    },
    {
      handle: 'P16.12',
      display_name: 'Cụ Hòe',
      surname: 'Nguyễn',
      first_name: 'Hòe',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.6'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Hòe.
Cha: Cụ Sĩ Trinh (P15.6)`
    },
    {
      handle: 'P16.13',
      display_name: 'Cụ Chăn',
      surname: 'Nguyễn',
      first_name: 'Chăn',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.6'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Chăn.
Cha: Cụ Sĩ Trinh (P15.6)`
    },
    // Nhánh Sĩ Khải - 3 con
    {
      handle: 'P16.14',
      display_name: 'Cụ Kiềm',
      surname: 'Nguyễn',
      first_name: 'Kiềm',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.7'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Kiềm.
Cha: Cụ Sĩ Khải (P15.7)`
    },
    {
      handle: 'P16.15',
      display_name: 'Cụ Hiệu',
      surname: 'Nguyễn',
      first_name: 'Hiệu',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.7'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Hiệu.
Cha: Cụ Sĩ Khải (P15.7)`
    },
    {
      handle: 'P16.16',
      display_name: 'Cụ Chực',
      surname: 'Nguyễn',
      first_name: 'Chực',
      generation: 16,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F15.7'],
      families: [],
      notes: `Đời thứ mười sáu: Cụ Chực.
Cha: Cụ Sĩ Khải (P15.7)`
    }
  ];

  for (const person of gen16People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}`);
    }
  }

  // === BƯỚC 2: THÊM VỢ CHO ĐỜI 16 ===
  console.log('\n2. Thêm vợ cho Đời 16...');

  const wives = [
    {
      handle: 'W16.4.1',
      display_name: 'Nguyễn Quý thị - Từ Hữu',
      surname: 'Nguyễn',
      first_name: 'Quý thị',
      generation: 16,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F16.4'],
      notes: `Chính thất của Cụ Sỹ Đồi (P16.4).
Hiệu: Từ Hữu
Mất: Năm 1900`
    },
    {
      handle: 'W16.6.1',
      display_name: 'Nguyễn Quý thị Phú - Từ Hữu (慈有)',
      surname: 'Nguyễn',
      first_name: 'Quý thị',
      generation: 16,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F16.6'],
      notes: `Chính thất của Cụ Sỹ Bồi (P16.6).
Húy: Phú
Hiệu: Từ Hữu (慈有)
Mất: 13 tháng 8 Âm lịch`
    }
  ];

  for (const wife of wives) {
    const result = await request('people', 'POST', wife);
    if (result) {
      console.log(`   ✓ ${wife.handle}: ${wife.display_name}`);
    }
  }

  // === BƯỚC 3: CẬP NHẬT F15.4 - CHIA THÀNH 4 FAMILIES ===
  console.log('\n3. Cập nhật F15.4 (Sĩ Bưu có 4 con)...');

  // Xóa F15.4 cũ
  await request('families?handle=eq.F15.4', 'DELETE');
  console.log('   - Đã xóa F15.4 cũ');

  // Tạo 4 families mới
  const f154_families = [
    { handle: 'F15.4.1', father_handle: 'P15.4', mother_handle: 'W15.4.1', children: ['P16.4'] },
    { handle: 'F15.4.2', father_handle: 'P15.4', mother_handle: 'W15.4.1', children: ['P16.5'] },
    { handle: 'F15.4.3', father_handle: 'P15.4', mother_handle: 'W15.4.1', children: ['P16.6'] },
    { handle: 'F15.4.4', father_handle: 'P15.4', mother_handle: 'W15.4.1', children: ['P16.7'] }
  ];

  for (const fam of f154_families) {
    await request('families', 'POST', fam);
    console.log(`   ✓ Tạo ${fam.handle}`);
  }

  // Cập nhật P15.4
  await request('people?handle=eq.P15.4', 'PATCH', {
    families: ['F15.4.1', 'F15.4.2', 'F15.4.3', 'F15.4.4']
  });
  console.log('   ✓ Cập nhật P15.4 families');

  // Cập nhật parent_families cho 4 con
  for (let i = 4; i <= 7; i++) {
    await request(`people?handle=eq.P16.${i}`, 'PATCH', {
      parent_families: [`F15.4.${i-3}`]
    });
  }

  // === BƯỚC 4: TẠO FAMILIES CHO CÁC CỤ ĐỜI 16 CÒN LẠI ===
  console.log('\n4. Tạo families cho Đời 16 (chưa có con)...');

  const families16 = [
    { handle: 'F16.4', father_handle: 'P16.4', mother_handle: 'W16.4.1', children: [] },
    { handle: 'F16.6', father_handle: 'P16.6', mother_handle: 'W16.6.1', children: [] }
  ];

  for (const fam of families16) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ ${fam.handle}`);
    }
  }

  // Cập nhật P16.4, P16.6
  await request('people?handle=eq.P16.4', 'PATCH', { families: ['F16.4'] });
  await request('people?handle=eq.P16.6', 'PATCH', { families: ['F16.6'] });

  // === KIỂM TRA KẾT QUẢ ===
  console.log('\n5. Kiểm tra kết quả...');
  const gen16 = await request('people?generation=eq.16&gender=eq.1&select=handle,display_name,degree&order=handle');

  console.log('\n=== ĐỜI 16 - 16 NGƯỜI ===');
  if (gen16) {
    let count = 0;
    gen16.forEach(p => {
      count++;
      console.log(`${p.handle}: ${p.display_name} ${p.degree ? '(' + p.degree + ')' : ''}`);
    });
    console.log(`\nTổng: ${count} người`);
  }

  console.log('\n💡 ĐẶC ĐIỂM ĐỜI 16:');
  console.log('  - Đời chuyển hẳn sang thời cận đại (thế kỷ XIX)');
  console.log('  - Nhánh Sỹ Bưu có người nổi bật: Sỹ Đồi (Kim Khê xử sĩ)');
  console.log('  - Bắt đầu có dữ liệu ngày tháng sinh mất rõ ràng');
  console.log('  - Sỹ Chực: Tú tài, Thông phán tỉnh Lạng Sơn');

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 16.');
}

main().catch(console.error);
