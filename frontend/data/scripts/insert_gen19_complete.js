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
  console.log('=== THÊM ĐỜI 19 ĐẦY ĐỦ (15 NGƯỜI - 3 NHÁNH) ===\n');

  // === BƯỚC 1: THÊM 15 NGƯỜI ĐỜI 19 ===
  console.log('1. Thêm 15 người Đời 19...');

  const gen19People = [
    // === NHÁNH 1: CHI 18.1 (NGUYỄN SĨ KHÁI) - 4 NGƯỜI ===
    {
      handle: 'P19.1',
      display_name: 'Nguyễn Sĩ Khắc',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khắc',
      generation: 19,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F18.1'],
      families: [],
      birth_year: 1922,
      birth_date: '1922-01-01',
      death_year: 2012,
      death_date: '2012-07-10',
      longevity: 90,
      notes: `Đời thứ mười chín: Nguyễn Sĩ Khắc.

Thông tin sinh mất:
- Sinh: Năm 1922 (Nhâm Tuất)
- Mất: 10/7/2012 (22/5 Nhâm Thìn Âm lịch)
- Thọ: 90 tuổi

Gia đình:
- Cha: Nguyễn Sĩ Khái (P18.1)
- Mẹ: Trần Thị Thơm (W18.1.1)
- Vợ: Nguyễn Thị Lược (W19.1.1) - sinh 1921 (Tân Dậu)
- Con: 6 người (20.1-20.6)`
    },

    {
      handle: 'P19.2',
      display_name: 'Nguyễn Sĩ Khâm',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khâm',
      generation: 19,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F18.1'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Sĩ Khâm.

Thông tin sinh mất:
- Mất: 9/8 Âm lịch

Gia đình:
- Cha: Nguyễn Sĩ Khái (P18.1)
- Mẹ: Trần Thị Thơm (W18.1.1)
- Vợ: Do (W19.2.1)
- Con: 20.7 Khiết, 20.8 Khung`
    },

    {
      handle: 'P19.3',
      display_name: 'Nguyễn Thị Khảng',
      surname: 'Nguyễn',
      first_name: 'Thị Khảng',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.1'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Thị Khảng (con gái).

Thông tin sinh mất:
- Mất: 19/9 Âm lịch

Gia đình:
- Cha: Nguyễn Sĩ Khái (P18.1)
- Mẹ: Trần Thị Thơm (W18.1.1)
- Chồng: Nguyễn Quang Đôn`
    },

    {
      handle: 'P19.4',
      display_name: 'Nguyễn Thị Nâu (Lịch)',
      surname: 'Nguyễn',
      first_name: 'Thị Nâu',
      nick_name: 'Lịch',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.1'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Thị Nâu (Lịch) (con gái).

Gia đình:
- Cha: Nguyễn Sĩ Khái (P18.1)
- Mẹ: Trần Thị Thơm (W18.1.1)
- Chồng: Đặng Ngọc Phách (ở Xuân Hội)
- Con: Kim`
    },

    // === NHÁNH 2: CHI 18.2 (NGUYỄN SĨ HUÂN) - 5 NGƯỜI ===
    {
      handle: 'P19.5',
      display_name: 'Nguyễn Sĩ Huấn',
      surname: 'Nguyễn',
      first_name: 'Sĩ Huấn',
      generation: 19,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F18.2'],
      families: [],
      death_year: 1995,
      death_date: '1995-12-26',
      notes: `Đời thứ mười chín: Nguyễn Sĩ Huấn.

Thông tin sinh mất:
- Mất: 17h ngày 26/12/1995 (05/11 Ất Hợi Âm lịch)

Gia đình:
- Cha: Nguyễn Sĩ Huân (P18.2)
- Mẹ: Nguyễn Thị Ngân (W18.2.1)
- Vợ: Lựu (W19.5.1)
- Con: 6 người (20.18-20.23)`
    },

    {
      handle: 'P19.6',
      display_name: 'Nguyễn Thị Phương',
      surname: 'Nguyễn',
      first_name: 'Thị Phương',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.2'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Thị Phương (con gái).

Gia đình:
- Cha: Nguyễn Sĩ Huân (P18.2)
- Mẹ: Nguyễn Thị Ngân (W18.2.1)`
    },

    {
      handle: 'P19.7',
      display_name: 'Nguyễn Thị Thuận',
      surname: 'Nguyễn',
      first_name: 'Thị Thuận',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.2'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Thị Thuận (con gái).

Gia đình:
- Cha: Nguyễn Sĩ Huân (P18.2)
- Mẹ: Nguyễn Thị Ngân (W18.2.1)`
    },

    {
      handle: 'P19.8',
      display_name: 'Nguyễn Thị Thàng',
      surname: 'Nguyễn',
      first_name: 'Thị Thàng',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.2'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Thị Thàng (con gái).

Gia đình:
- Cha: Nguyễn Sĩ Huân (P18.2)
- Mẹ: Nguyễn Thị Ngân (W18.2.1)`
    },

    {
      handle: 'P19.9',
      display_name: 'Nguyễn Thị Hiện',
      surname: 'Nguyễn',
      first_name: 'Thị Hiện',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.2'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Thị Hiện (con gái).

Gia đình:
- Cha: Nguyễn Sĩ Huân (P18.2)
- Mẹ: Nguyễn Thị Ngân (W18.2.1)`
    },

    // === NHÁNH 3: CHI 18.3 (NGUYỄN SĨ TUYÊN) - CHI LỚN - 6 NGƯỜI ===
    {
      handle: 'P19.10',
      display_name: 'Nguyễn Sĩ Tương',
      surname: 'Nguyễn',
      first_name: 'Sĩ Tương',
      generation: 19,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F18.3.1'],
      families: [],
      birth_year: 1923,
      birth_date: '1923-07-14',
      death_year: 1961,
      death_date: '1961-07-04',
      longevity: 38,
      notes: `Đời thứ mười chín: Nguyễn Sĩ Tương (CHI LỚN).

Thông tin sinh mất:
- Sinh: 14/7/1923
- Mất: 04/7/1961 (22/5 Tân Sửu Âm lịch)
- Thọ: 38 tuổi

Gia đình:
- Cha: Nguyễn Sĩ Tuyên (P18.3)
- Mẹ: Hoàng Thị Chuyện (W18.3.1) - chính thất
- Vợ: Lê Thị Bí (W19.10.1) - sinh 1924, mất 0h02' ngày 16/9/2007 (16/8 Đinh Hợi)
- Con: 3 người (20.24-20.26)`
    },

    {
      handle: 'P19.11',
      display_name: 'Nguyễn Thị Tường',
      surname: 'Nguyễn',
      first_name: 'Thị Tường',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.3.1'],
      families: [],
      birth_year: 1925,
      birth_date: '1925-09-12',
      death_year: 1980,
      death_date: '1980-06-04',
      longevity: 55,
      notes: `Đời thứ mười chín: Nguyễn Thị Tường (con gái).

Thông tin sinh mất:
- Sinh: 12/9/1925
- Mất: 04/6/1980 (22/4 Canh Thân Âm lịch)
- Thọ: 55 tuổi

Gia đình:
- Cha: Nguyễn Sĩ Tuyên (P18.3)
- Mẹ: Hoàng Thị Chuyện (W18.3.1) - chính thất
- Chồng: Bùi Văn Chén (ở Đại Phúc)`
    },

    {
      handle: 'P19.12',
      display_name: 'Nguyễn Sĩ Tính',
      surname: 'Nguyễn',
      first_name: 'Sĩ Tính',
      generation: 19,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F18.3.1'],
      families: [],
      birth_year: 1931,
      birth_date: '1931-09-20',
      death_year: 2022,
      death_date: '2022-02-04',
      longevity: 91,
      notes: `Đời thứ mười chín: Nguyễn Sĩ Tính.

Thông tin sinh mất:
- Sinh: 20/9/1931 (9/8 Tân Mùi Âm lịch)
- Mất: 04/02/2022 (04/01 Nhâm Dần Âm lịch)
- Thọ: 91 tuổi

Gia đình:
- Cha: Nguyễn Sĩ Tuyên (P18.3)
- Mẹ: Hoàng Thị Chuyện (W18.3.1) - chính thất
- Vợ: Đỗ Thị Tý (W19.12.1) - sinh 15/6/1933 (23/5 Quý Dậu)
- Con: 7 người (20.30-20.36)`
    },

    {
      handle: 'P19.13',
      display_name: 'Nguyễn Sĩ Tưởng',
      surname: 'Nguyễn',
      first_name: 'Sĩ Tưởng',
      generation: 19,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F18.3.2'],
      families: [],
      birth_year: 1938,
      birth_date: '1938-04-02',
      notes: `Đời thứ mười chín: Nguyễn Sĩ Tưởng.

Thông tin sinh mất:
- Sinh: 02/4/1938
- Còn sống

Gia đình:
- Cha: Nguyễn Sĩ Tuyên (P18.3)
- Mẹ: Nguyễn Thị Quỵnh (W18.3.2) - thứ thất
- Vợ: Nguyễn Thị Nức (W19.13.1)
- Con: 7 người (20.37-20.43)`
    },

    {
      handle: 'P19.14',
      display_name: 'Nguyễn Thị Tân',
      surname: 'Nguyễn',
      first_name: 'Thị Tân',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.3.2'],
      families: [],
      notes: `Đời thứ mười chín: Nguyễn Thị Tân (con gái).

Ghi chú: Mất lúc nhỏ

Gia đình:
- Cha: Nguyễn Sĩ Tuyên (P18.3)
- Mẹ: Nguyễn Thị Quỵnh (W18.3.2) - thứ thất`
    },

    {
      handle: 'P19.15',
      display_name: 'Nguyễn Thị Tín',
      surname: 'Nguyễn',
      first_name: 'Thị Tín',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F18.3.2'],
      families: [],
      birth_year: 1951,
      birth_date: '1951-02-16',
      death_year: 2005,
      death_date: '2005-03-05',
      longevity: 54,
      notes: `Đời thứ mười chín: Nguyễn Thị Tín (con gái).

Thông tin sinh mất:
- Sinh: 16/02/1951
- Mất: 1h15' ngày 05/3/2005 (25/01 Giáp Thân Âm lịch)
- Thọ: 54 tuổi

Gia đình:
- Cha: Nguyễn Sĩ Tuyên (P18.3)
- Mẹ: Nguyễn Thị Quỵnh (W18.3.2) - thứ thất
- Chồng: Lê ... Bích
- Con: Lê Thị Bình`
    }
  ];

  for (const person of gen19People) {
    const result = await request('people', 'POST', person);
    if (result) {
      const type = person.gender === 0 ? '(gái)' : '(trai)';
      console.log(`   ✓ ${person.handle}: ${person.display_name} ${type}`);
    }
  }

  // === BƯỚC 2: THÊM VỢ CHO ĐỜI 19 ===
  console.log('\n2. Thêm vợ cho Đời 19...');

  const wives = [
    {
      handle: 'W19.1.1',
      display_name: 'Nguyễn Thị Lược',
      surname: 'Nguyễn',
      first_name: 'Thị Lược',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F19.1'],
      birth_year: 1921,
      notes: `Vợ của Nguyễn Sĩ Khắc (P19.1).

Thông tin sinh mất:
- Sinh: Năm 1921 (Tân Dậu)
- Mất: 16/1 (17h)`
    },

    {
      handle: 'W19.2.1',
      display_name: 'Do',
      surname: '',
      first_name: 'Do',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F19.2'],
      notes: `Vợ của Nguyễn Sĩ Khâm (P19.2).`
    },

    {
      handle: 'W19.5.1',
      display_name: 'Lựu',
      surname: '',
      first_name: 'Lựu',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F19.5'],
      notes: `Vợ của Nguyễn Sĩ Huấn (P19.5).`
    },

    {
      handle: 'W19.10.1',
      display_name: 'Lê Thị Bí',
      surname: 'Lê',
      first_name: 'Thị Bí',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F19.10'],
      birth_year: 1924,
      death_year: 2007,
      death_date: '2007-09-16',
      longevity: 83,
      notes: `Vợ của Nguyễn Sĩ Tương (P19.10).

Thông tin sinh mất:
- Sinh: Năm 1924
- Mất: 0h02' ngày 16/9/2007 (16/8 Đinh Hợi Âm lịch)
- Thọ: 83 tuổi`
    },

    {
      handle: 'W19.12.1',
      display_name: 'Đỗ Thị Tý',
      surname: 'Đỗ',
      first_name: 'Thị Tý',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: [],
      families: ['F19.12'],
      birth_year: 1933,
      birth_date: '1933-06-15',
      notes: `Vợ của Nguyễn Sĩ Tính (P19.12).

Thông tin sinh:
- Sinh: 15/6/1933 (23/5 Quý Dậu Âm lịch)
- Còn sống (93 tuổi tính đến 2026)`
    },

    {
      handle: 'W19.13.1',
      display_name: 'Nguyễn Thị Nức',
      surname: 'Nguyễn',
      first_name: 'Thị Nức',
      generation: 19,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: [],
      families: ['F19.13'],
      notes: `Vợ của Nguyễn Sĩ Tưởng (P19.13).`
    }
  ];

  for (const wife of wives) {
    const result = await request('people', 'POST', wife);
    if (result) {
      console.log(`   ✓ ${wife.handle}: ${wife.display_name}`);
    }
  }

  // === BƯỚC 3: TẠO FAMILIES CHO ĐỜI 19 ===
  console.log('\n3. Tạo families cho Đời 19...');

  const families = [
    { handle: 'F19.1', father_handle: 'P19.1', mother_handle: 'W19.1.1', children: [] },
    { handle: 'F19.2', father_handle: 'P19.2', mother_handle: 'W19.2.1', children: [] },
    { handle: 'F19.5', father_handle: 'P19.5', mother_handle: 'W19.5.1', children: [] },
    { handle: 'F19.10', father_handle: 'P19.10', mother_handle: 'W19.10.1', children: [] },
    { handle: 'F19.12', father_handle: 'P19.12', mother_handle: 'W19.12.1', children: [] },
    { handle: 'F19.13', father_handle: 'P19.13', mother_handle: 'W19.13.1', children: [] }
  ];

  for (const fam of families) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ ${fam.handle}`);
    }
  }

  // === BƯỚC 4: CẬP NHẬT PEOPLE VỚI FAMILIES ===
  console.log('\n4. Cập nhật Đời 19 với families...');

  const peopleWithFamilies = [
    { handle: 'P19.1', families: ['F19.1'] },
    { handle: 'P19.2', families: ['F19.2'] },
    { handle: 'P19.5', families: ['F19.5'] },
    { handle: 'P19.10', families: ['F19.10'] },
    { handle: 'P19.12', families: ['F19.12'] },
    { handle: 'P19.13', families: ['F19.13'] }
  ];

  for (const p of peopleWithFamilies) {
    await request(`people?handle=eq.${p.handle}`, 'PATCH', { families: p.families });
    console.log(`   ✓ ${p.handle}`);
  }

  // === BƯỚC 5: CẬP NHẬT FAMILIES ĐỜI 18 VỚI CON ===
  console.log('\n5. Cập nhật families Đời 18 với children Đời 19...');

  const familyUpdates = [
    { handle: 'F18.1', children: ['P19.1', 'P19.2', 'P19.3', 'P19.4'] },
    { handle: 'F18.2', children: ['P19.5', 'P19.6', 'P19.7', 'P19.8', 'P19.9'] },
    { handle: 'F18.3.1', children: ['P19.10', 'P19.11', 'P19.12'] }, // Chính thất
    { handle: 'F18.3.2', children: ['P19.13', 'P19.14', 'P19.15'] }  // Thứ thất
  ];

  for (const update of familyUpdates) {
    await request(`families?handle=eq.${update.handle}`, 'PATCH', { children: update.children });
    console.log(`   ✓ ${update.handle}: ${update.children.length} con`);
  }

  // === KIỂM TRA KẾT QUẢ ===
  console.log('\n6. Kiểm tra kết quả...');

  const gen19 = await request('people?generation=eq.19&is_patrilineal=eq.true&select=handle,display_name,gender,birth_year,death_year,is_living&order=handle');
  console.log('\n=== ĐỜI 19 (15 NGƯỜI - 3 NHÁNH) ===');
  if (gen19) {
    let count = 0;
    gen19.forEach(p => {
      count++;
      const status = p.is_living ? '(còn sống)' : `[${p.birth_year || '?'}-${p.death_year || '?'}]`;
      console.log(`${p.handle}: ${p.display_name} ${status}`);
    });

    // Count girls
    const girls = await request('people?generation=eq.19&gender=eq.0&is_patrilineal=eq.false&select=handle');
    const totalGirls = girls ? girls.length : 0;

    console.log(`\nTổng: ${count} trai + ${totalGirls} gái = ${count + totalGirls} người`);
  }

  const wives19 = await request('people?generation=eq.19&gender=eq.0&is_patrilineal=eq.false&families=not.is.null&select=handle,display_name,is_living&order=handle');
  console.log('\n=== VỢ ĐỜI 19 ===');
  if (wives19 && wives19.length > 0) {
    wives19.forEach(w => {
      const status = w.is_living ? '(còn sống)' : '';
      console.log(`${w.handle}: ${w.display_name} ${status}`);
    });
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm đầy đủ Đời 19.');
  console.log('💡 Nhánh chính: Chi Sĩ Tuyên (P18.3) → 6 người (P19.10-19.15)');
  console.log('   - 3 con của chính thất (P19.10, 19.11, 19.12)');
  console.log('   - 3 con của thứ thất (P19.13, 19.14, 19.15)');
}

main().catch(console.error);
