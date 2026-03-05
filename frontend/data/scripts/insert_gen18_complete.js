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
  if (method === 'DELETE') return res.ok;
  const data = await res.json();
  if (!res.ok) {
    console.log(`❌ ERROR:`, JSON.stringify(data, null, 2));
    return null;
  }
  return data;
}

async function main() {
  console.log('=== THÊM ĐỜI 18 ĐẦY ĐỦ (6 NGƯỜI) ===\n');

  // === BƯỚC 1: THÊM 6 NGƯỜI ĐỜI 18 ===
  console.log('1. Thêm 6 người Đời 18 (3 trai + 3 gái)...');

  const gen18People = [
    // 18.1: Nguyễn Sĩ Khái
    {
      handle: 'P18.1',
      display_name: 'Nguyễn Sĩ Khái',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khái',
      generation: 18,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F17.8.2'],
      families: [],
      birth_year: 1891,
      death_year: 1959,
      death_date: '1959-08-25',
      longevity: 68,
      notes: `Đời thứ mười tám: Nguyễn Sĩ Khái.

Thông tin sinh mất:
- Sinh: Năm 1891 (Tân Mão)
- Mất: 25/8/1959 (Kỷ Hợi)
- Thọ: 68 tuổi

Gia đình:
- Cha: Cụ Sỹ Đĩnh (P17.8)
- Mẹ: Nguyễn Thị Y (W17.8.2)
- Vợ: Trần Thị Thơm (W18.1.1) - hiệu Diệu Phúc, sinh 1887 (Đinh Hợi), mất 1951 (Tân Mão)
- Con: Khắc (19.1), Khâm (19.2), Khảng (19.3), Nâu (19.4)`
    },

    // 18.2: Nguyễn Sĩ Huân
    {
      handle: 'P18.2',
      display_name: 'Nguyễn Sĩ Huân',
      surname: 'Nguyễn',
      first_name: 'Sĩ Huân',
      generation: 18,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F17.8.1'],
      families: [],
      birth_year: null,
      death_year: null,
      notes: `Đời thứ mười tám: Nguyễn Sĩ Huân.

Thông tin sinh mất:
- Sinh: Chưa rõ
- Mất: 12/3 Bính Dần (21h35')

Gia đình:
- Cha: Cụ Sỹ Đĩnh (P17.8)
- Mẹ: Nguyễn Thị Chính (W17.8.1) - chính thất
- Vợ: Nguyễn Thị Ngân (W18.2.1)
- Con: Huấn (19.5), Phương (19.6), Thuận (19.7), Thàng (19.8), Hiện (19.9)`
    },

    // 18.3: Nguyễn Sĩ Tuyên - NHÁNH CHÍNH
    {
      handle: 'P18.3',
      display_name: 'Nguyễn Sĩ Tuyên',
      surname: 'Nguyễn',
      first_name: 'Sĩ Tuyên',
      generation: 18,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F17.8.2'],
      families: [],
      birth_year: 1895,
      death_year: 1961,
      longevity: 66,
      notes: `Đời thứ mười tám: Nguyễn Sĩ Tuyên (CHI LỚN - NHÁNH CHÍNH).

Thông tin sinh mất:
- Sinh: Năm 1895
- Mất: 28/8 Tân Sửu (1961)
- Thọ: 66 tuổi

Gia đình:
- Cha: Cụ Sỹ Đĩnh (P17.8)
- Mẹ: Nguyễn Thị Y (W17.8.2) - thứ thất
- Vợ 1: Hoàng Thị Chuyện (W18.3.1) - hiệu Diệu Khánh, sinh 1891, mất 17/12/1935 (22/11)
- Vợ 2: Nguyễn Thị Quỵnh (W18.3.2) - mất 7/5 Âm lịch
- Con: Tương (19.10), Tường (19.11), Tính (19.12), Tưởng (19.13), Tân (19.14), Tín (19.15)

Ghi chú: Đây là nhánh chính dẫn đến các đời 19-20 hiện tại`
    },

    // 18.4: Nguyễn Thị In (con gái)
    {
      handle: 'P18.4',
      display_name: 'Nguyễn Thị In',
      surname: 'Nguyễn',
      first_name: 'Thị In',
      generation: 18,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F17.8.1'],
      families: [],
      notes: `Đời thứ mười tám: Nguyễn Thị In (con gái).

Gia đình:
- Cha: Cụ Sỹ Đĩnh (P17.8)
- Mẹ: Nguyễn Thị Chính (W17.8.1) - chính thất
- Chồng: Lê Văn Mai`
    },

    // 18.5: Nguyễn Thị Hiểu (con gái)
    {
      handle: 'P18.5',
      display_name: 'Nguyễn Thị Hiểu',
      surname: 'Nguyễn',
      first_name: 'Thị Hiểu',
      generation: 18,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F17.8.1'],
      families: [],
      notes: `Đời thứ mười tám: Nguyễn Thị Hiểu (con gái).

Gia đình:
- Cha: Cụ Sỹ Đĩnh (P17.8)
- Mẹ: Nguyễn Thị Chính (W17.8.1) - chính thất
- Chồng: Nguyễn Hữu`
    },

    // 18.6: Nguyễn Thị Rịu (con gái)
    {
      handle: 'P18.6',
      display_name: 'Nguyễn Thị Rịu',
      surname: 'Nguyễn',
      first_name: 'Thị Rịu',
      generation: 18,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F17.8.2'],
      families: [],
      birth_year: 1903,
      death_year: 1967,
      death_date: '1967-04-14',
      longevity: 64,
      notes: `Đời thứ mười tám: Nguyễn Thị Rịu (con gái).

Thông tin sinh mất:
- Sinh: Năm 1903
- Mất: 14/4/1967 (05/3 Đinh Mùi)
- Thọ: 64 tuổi

Gia đình:
- Cha: Cụ Sỹ Đĩnh (P17.8)
- Mẹ: Nguyễn Thị Y (W17.8.2) - thứ thất

Ghi chú: Tàn tật, không lấy chồng`
    }
  ];

  for (const person of gen18People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}${person.gender === 0 ? ' (con gái)' : ''}`);
    }
  }

  // === BƯỚC 2: THÊM VỢ CHO ĐỜI 18 ===
  console.log('\n2. Thêm vợ cho Đời 18...');

  const wives = [
    // Vợ P18.1 (Sĩ Khái)
    {
      handle: 'W18.1.1',
      display_name: 'Trần Thị Thơm - Diệu Phúc',
      surname: 'Trần',
      first_name: 'Thị Thơm',
      generation: 18,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F18.1'],
      birth_year: 1887,
      death_year: 1951,
      longevity: 64,
      notes: `Vợ của Nguyễn Sĩ Khái (P18.1).

Hiệu: Diệu Phúc

Thông tin sinh mất:
- Sinh: Năm 1887 (Đinh Hợi)
- Mất: Năm 1951 (Tân Mão)
- Thọ: 64 tuổi`
    },

    // Vợ P18.2 (Sĩ Huân)
    {
      handle: 'W18.2.1',
      display_name: 'Nguyễn Thị Ngân',
      surname: 'Nguyễn',
      first_name: 'Thị Ngân',
      generation: 18,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F18.2'],
      notes: `Vợ của Nguyễn Sĩ Huân (P18.2).`
    },

    // Vợ 1 P18.3 (Sĩ Tuyên) - Chính thất
    {
      handle: 'W18.3.1',
      display_name: 'Hoàng Thị Chuyện - Diệu Khánh',
      surname: 'Hoàng',
      first_name: 'Thị Chuyện',
      generation: 18,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F18.3.1'],
      birth_year: 1891,
      death_year: 1935,
      death_date: '1935-12-17',
      longevity: 44,
      notes: `Chính thất của Nguyễn Sĩ Tuyên (P18.3).

Hiệu: Diệu Khánh

Thông tin sinh mất:
- Sinh: Năm 1891
- Mất: 17/12/1935 (22/11 Âm lịch)
- Thọ: 44 tuổi

Con: Tương (19.10), Tường (19.11), Tính (19.12), Tưởng (19.13), Tân (19.14), Tín (19.15)`
    },

    // Vợ 2 P18.3 (Sĩ Tuyên) - Thứ thất
    {
      handle: 'W18.3.2',
      display_name: 'Nguyễn Thị Quỵnh',
      surname: 'Nguyễn',
      first_name: 'Thị Quỵnh',
      generation: 18,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F18.3.2'],
      notes: `Thứ thất của Nguyễn Sĩ Tuyên (P18.3).

Thông tin sinh mất:
- Mất: 7/5 Âm lịch`
    }
  ];

  for (const wife of wives) {
    const result = await request('people', 'POST', wife);
    if (result) {
      console.log(`   ✓ ${wife.handle}: ${wife.display_name}`);
    }
  }

  // === BƯỚC 3: TẠO FAMILIES CHO ĐỜI 18 ===
  console.log('\n3. Tạo families cho Đời 18...');

  const families = [
    { handle: 'F18.1', father_handle: 'P18.1', mother_handle: 'W18.1.1', children: [] },
    { handle: 'F18.2', father_handle: 'P18.2', mother_handle: 'W18.2.1', children: [] },
    { handle: 'F18.3.1', father_handle: 'P18.3', mother_handle: 'W18.3.1', children: [] }, // Chính thất
    { handle: 'F18.3.2', father_handle: 'P18.3', mother_handle: 'W18.3.2', children: [] }  // Thứ thất
  ];

  for (const fam of families) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ ${fam.handle}`);
    }
  }

  // === BƯỚC 4: CẬP NHẬT PEOPLE VỚI FAMILIES ===
  console.log('\n4. Cập nhật Đời 18 với families...');

  await request('people?handle=eq.P18.1', 'PATCH', { families: ['F18.1'] });
  console.log('   ✓ P18.1');

  await request('people?handle=eq.P18.2', 'PATCH', { families: ['F18.2'] });
  console.log('   ✓ P18.2');

  await request('people?handle=eq.P18.3', 'PATCH', { families: ['F18.3.1', 'F18.3.2'] });
  console.log('   ✓ P18.3 (2 families)');

  // === BƯỚC 5: CẬP NHẬT FAMILIES ĐỜI 17 VỚI CON ===
  console.log('\n5. Cập nhật families Đời 17 với children Đời 18...');

  // F17.8.1 (chính thất) có con: P18.2 (Huân), P18.4 (In), P18.5 (Hiểu)
  await request('families?handle=eq.F17.8.1', 'PATCH', {
    children: ['P18.2', 'P18.4', 'P18.5']
  });
  console.log('   ✓ F17.8.1 (chính thất): 3 con');

  // F17.8.2 (thứ thất) có con: P18.1 (Khái), P18.3 (Tuyên), P18.6 (Rịu)
  await request('families?handle=eq.F17.8.2', 'PATCH', {
    children: ['P18.1', 'P18.3', 'P18.6']
  });
  console.log('   ✓ F17.8.2 (thứ thất): 3 con');

  // === KIỂM TRA KẾT QUẢ ===
  console.log('\n6. Kiểm tra kết quả...');

  const gen18 = await request('people?generation=eq.18&select=handle,display_name,gender,parent_families,birth_year,death_year&order=handle');
  console.log('\n=== ĐỜI 18 (6 NGƯỜI) ===');
  if (gen18) {
    gen18.forEach(p => {
      const type = p.gender === 1 ? '(trai)' : '(gái)';
      const dates = p.birth_year ? `${p.birth_year}-${p.death_year || '?'}` : 'N/A';
      console.log(`${p.handle}: ${p.display_name} ${type} [${dates}]`);
      console.log(`  Mẹ: ${p.parent_families?.[0] || 'N/A'}`);
    });
    console.log(`\nTổng: ${gen18.length} người`);
  }

  const wives18 = await request('people?generation=eq.18&gender=eq.0&is_patrilineal=eq.false&select=handle,display_name,birth_year,death_year&order=handle');
  console.log('\n=== VỢ ĐỜI 18 ===');
  if (wives18 && wives18.length > 0) {
    wives18.forEach(w => {
      const dates = w.birth_year ? `${w.birth_year}-${w.death_year || '?'}` : 'N/A';
      console.log(`${w.handle}: ${w.display_name} [${dates}]`);
    });
  }

  const f17check = await request('families?handle=in.(F17.8.1,F17.8.2)&select=handle,mother_handle,children');
  console.log('\n=== FAMILIES ĐỜI 17 (CẬP NHẬT) ===');
  if (f17check) {
    f17check.forEach(f => {
      console.log(`${f.handle} (mẹ: ${f.mother_handle}): ${f.children.length} con`);
      console.log(`  Children: ${f.children.join(', ')}`);
    });
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm đầy đủ Đời 18.');
  console.log('💡 Nhánh chính: P18.3 Sỹ Tuyên (1895-1961) → dẫn đến Đời 19-20');
}

main().catch(console.error);
