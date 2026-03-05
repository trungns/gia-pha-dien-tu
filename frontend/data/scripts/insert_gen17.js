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
  console.log('=== THÊM ĐỜI 17 (12 CỤ) ===\n');

  // === BƯỚC 1: THÊM 12 NGƯỜI ĐỜI 17 ===
  console.log('1. Thêm 12 người Đời 17...');

  const gen17People = [
    // 17.1: Con P16.1 (Ngạn)
    {
      handle: 'P17.1',
      display_name: 'Cụ Lân',
      surname: 'Nguyễn',
      first_name: 'Lân',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.1'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Lân.

Gia đình:
- Cha: Cụ Ngạn (P16.1)
- Con: Cụ Du (Đời 18)`
    },

    // 17.2: Con P16.2 (Triệu)
    {
      handle: 'P17.2',
      display_name: 'Cụ Chỉnh',
      surname: 'Nguyễn',
      first_name: 'Chỉnh',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.2'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Chỉnh.

Gia đình:
- Cha: Cụ Triệu (P16.2)
- Con: Tích, Ngư, Cẩn (Đời 18)`
    },

    // 17.3: Con P16.3 (Song)
    {
      handle: 'P17.3',
      display_name: 'Cụ Mạc',
      surname: 'Nguyễn',
      first_name: 'Mạc',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.3'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Mạc.

Gia đình:
- Cha: Cụ Song (P16.3)
- Con: Tịch (Đời 18)`
    },

    // 17.4-17.6: Con P16.4 (Sỹ Đồi/Ôn - 溫)
    {
      handle: 'P17.4',
      display_name: 'Cụ Vịnh',
      surname: 'Nguyễn',
      first_name: 'Vịnh',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.4'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Vịnh.

Gia đình:
- Cha: Cụ Sỹ Đồi (Sỹ Ôn) (P16.4)`
    },

    {
      handle: 'P17.5',
      display_name: 'Cụ Lẹ',
      surname: 'Nguyễn',
      first_name: 'Lẹ',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.4'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Lẹ.

Gia đình:
- Cha: Cụ Sỹ Đồi (Sỹ Ôn) (P16.4)
- Con: Quán, Uế (Đời 18)`
    },

    {
      handle: 'P17.6',
      display_name: 'Cụ Đóng',
      surname: 'Nguyễn',
      first_name: 'Đóng',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.4'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Đóng.

Gia đình:
- Cha: Cụ Sỹ Đồi (Sỹ Ôn) (P16.4)
- Con: Giự, Thản (Đời 18)`
    },

    // 17.7, 17.9: Con P16.5 (Sỹ Chực/Thục - 淑)
    {
      handle: 'P17.7',
      display_name: 'Cụ Chức',
      surname: 'Nguyễn',
      first_name: 'Chức',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.5'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Chức.

Gia đình:
- Cha: Cụ Sỹ Chực (Sỹ Thục) (P16.5)`
    },

    // 17.8: Con P16.6 (Sỹ Bồi) - NHÁNH CHÍNH
    {
      handle: 'P17.8',
      display_name: 'Cụ Sỹ Đĩnh (仕梃) - Chế Chi',
      surname: 'Nguyễn',
      first_name: 'Sỹ Đĩnh',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.6'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Sỹ Đĩnh (仕梃).

Tên chữ: Trực Khanh (直卿)
Hiệu: Chế Chi (制之)

Thông tin sinh mất:
- Sinh: Năm 1856 (Bính Thìn – Tự Đức 9)
- Mất: 23/7 Âm lịch năm 1908
- An táng: Sứ Vườn Đồn (cạnh xóm Lửa, phía cống cụt)

Gia đình:
- Cha: Cụ Sỹ Bồi (P16.6)
- Vợ chính: Nguyễn Thị Chính (hiệu Đoan Nhất, sinh 1860, mất 29/6)
- Thứ thất: Nguyễn Thị Y (sinh 1864, mất 29/12/1950)
- Con: Sỹ Khái, Sỹ Huân, Sỹ Tuyên, Thị In, Thị Hiểu, Thị Rịu

Ghi chú: Nhánh chính dẫn đến Chi Sĩ Tuyên (đời 18)`
    },

    {
      handle: 'P17.9',
      display_name: 'Cụ Giác',
      surname: 'Nguyễn',
      first_name: 'Giác',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.5'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Giác.

Gia đình:
- Cha: Cụ Sỹ Chực (Sỹ Thục) (P16.5)
- Con: Đực, Cậy (Đời 18)`
    },

    // 17.10-17.11: Con P16.7 (Sỹ Chừng)
    {
      handle: 'P17.10',
      display_name: 'Cụ Khôi',
      surname: 'Nguyễn',
      first_name: 'Khôi',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.7'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Khôi.

Gia đình:
- Cha: Cụ Sỹ Chừng (P16.7)
- Con: Đỉnh, Lưu, Chương, Sáu (Đời 18)`
    },

    {
      handle: 'P17.11',
      display_name: 'Cụ Bão',
      surname: 'Nguyễn',
      first_name: 'Bão',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.7'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Bão.

Gia đình:
- Cha: Cụ Sỹ Chừng (P16.7)
- Con: Kiên (Đời 18)`
    },

    // 17.12: Con P16.10 (Chuyên)
    {
      handle: 'P17.12',
      display_name: 'Cụ Kiến',
      surname: 'Nguyễn',
      first_name: 'Kiến',
      generation: 17,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F16.10'],
      families: [],
      notes: `Đời thứ mười bảy: Cụ Kiến.

Gia đình:
- Cha: Cụ Chuyên (P16.10)
- Con: Mữu (Đời 18)`
    }
  ];

  for (const person of gen17People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}`);
    }
  }

  // === BƯỚC 2: THÊM VỢ CHO P17.8 (Sỹ Đĩnh) ===
  console.log('\n2. Thêm 2 vợ cho P17.8 (Sỹ Đĩnh)...');

  const wives = [
    {
      handle: 'W17.8.1',
      display_name: 'Nguyễn Thị Chính - Đoan Nhất',
      surname: 'Nguyễn',
      first_name: 'Thị Chính',
      generation: 17,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F17.8.1'],
      birth_year: 1860,
      notes: `Chính thất của Cụ Sỹ Đĩnh (P17.8).
Hiệu: Đoan Nhất
Sinh: Năm 1860
Mất: 29/6 Âm lịch`
    },
    {
      handle: 'W17.8.2',
      display_name: 'Nguyễn Thị Y',
      surname: 'Nguyễn',
      first_name: 'Thị Y',
      generation: 17,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F17.8.2'],
      birth_year: 1864,
      death_date: '1950-12-29',
      notes: `Thứ thất của Cụ Sỹ Đĩnh (P17.8).
Sinh: Năm 1864
Mất: 29/12/1950 (21/11 Canh Dần Âm lịch)
An táng: Đồng Khoai
Giỗ: 21/11 Âm lịch`
    }
  ];

  for (const wife of wives) {
    const result = await request('people', 'POST', wife);
    if (result) {
      console.log(`   ✓ ${wife.handle}: ${wife.display_name}`);
    }
  }

  // === BƯỚC 3: TẠO FAMILIES CHO ĐỜI 17 ===
  console.log('\n3. Tạo families cho Đời 17...');

  const families = [
    { handle: 'F17.1', father_handle: 'P17.1', mother_handle: null, children: [] },
    { handle: 'F17.2', father_handle: 'P17.2', mother_handle: null, children: [] },
    { handle: 'F17.3', father_handle: 'P17.3', mother_handle: null, children: [] },
    { handle: 'F17.4', father_handle: 'P17.4', mother_handle: null, children: [] },
    { handle: 'F17.5', father_handle: 'P17.5', mother_handle: null, children: [] },
    { handle: 'F17.6', father_handle: 'P17.6', mother_handle: null, children: [] },
    { handle: 'F17.7', father_handle: 'P17.7', mother_handle: null, children: [] },
    { handle: 'F17.8.1', father_handle: 'P17.8', mother_handle: 'W17.8.1', children: [] }, // Chính thất
    { handle: 'F17.8.2', father_handle: 'P17.8', mother_handle: 'W17.8.2', children: [] }, // Thứ thất
    { handle: 'F17.9', father_handle: 'P17.9', mother_handle: null, children: [] },
    { handle: 'F17.10', father_handle: 'P17.10', mother_handle: null, children: [] },
    { handle: 'F17.11', father_handle: 'P17.11', mother_handle: null, children: [] },
    { handle: 'F17.12', father_handle: 'P17.12', mother_handle: null, children: [] }
  ];

  for (const fam of families) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ ${fam.handle}`);
    }
  }

  // === BƯỚC 4: CẬP NHẬT PEOPLE VỚI FAMILIES ===
  console.log('\n4. Cập nhật Đời 17 với families...');

  for (let i = 1; i <= 12; i++) {
    if (i === 8) {
      // P17.8 có 2 vợ
      await request(`people?handle=eq.P17.8`, 'PATCH', { families: ['F17.8.1', 'F17.8.2'] });
      console.log(`   ✓ P17.8 (2 families)`);
    } else {
      await request(`people?handle=eq.P17.${i}`, 'PATCH', { families: [`F17.${i}`] });
      console.log(`   ✓ P17.${i}`);
    }
  }

  // === BƯỚC 5: CẬP NHẬT FAMILIES ĐỜI 16 VỚI CON ===
  console.log('\n5. Cập nhật families Đời 16 với children Đời 17...');

  // Cần tạo families cho các cụ Đời 16 chưa có
  const gen16FamilyUpdates = [
    { handle: 'F16.1', children: ['P17.1'] },
    { handle: 'F16.2', children: ['P17.2'] },
    { handle: 'F16.3', children: ['P17.3'] },
    { handle: 'F16.4', children: ['P17.4', 'P17.5', 'P17.6'] },
    { handle: 'F16.5', children: ['P17.7', 'P17.9'] },
    { handle: 'F16.6', children: ['P17.8'] },
    { handle: 'F16.7', children: ['P17.10', 'P17.11'] },
    { handle: 'F16.10', children: ['P17.12'] }
  ];

  for (const update of gen16FamilyUpdates) {
    // Kiểm tra xem family có tồn tại không
    const existing = await request(`families?handle=eq.${update.handle}&select=handle`);
    if (existing && existing.length > 0) {
      // Cập nhật children
      await request(`families?handle=eq.${update.handle}`, 'PATCH', { children: update.children });
      console.log(`   ✓ Cập nhật ${update.handle} children`);
    } else {
      // Tạo mới family
      const personHandle = update.handle.replace('F', 'P');
      const result = await request('families', 'POST', {
        handle: update.handle,
        father_handle: personHandle,
        mother_handle: null,
        children: update.children
      });
      if (result) {
        console.log(`   ✓ Tạo mới ${update.handle}`);
        // Cập nhật person với family
        await request(`people?handle=eq.${personHandle}`, 'PATCH', { families: [update.handle] });
      }
    }
  }

  // === KIỂM TRA KẾT QUẢ ===
  console.log('\n6. Kiểm tra kết quả...');

  const gen17 = await request('people?generation=eq.17&gender=eq.1&select=handle,display_name,parent_families&order=handle');
  console.log('\n=== ĐỜI 17 (12 CỤ) ===');
  if (gen17) {
    gen17.forEach(p => {
      console.log(`${p.handle}: ${p.display_name} (cha: ${p.parent_families?.[0] || 'N/A'})`);
    });
    console.log(`\nTổng: ${gen17.length} người`);
  }

  const wives17 = await request('people?generation=eq.17&gender=eq.0&select=handle,display_name');
  console.log('\n=== VỢ ĐỜI 17 ===');
  if (wives17 && wives17.length > 0) {
    wives17.forEach(w => console.log(`${w.handle}: ${w.display_name}`));
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 17.');
  console.log('💡 Nhánh chính: P17.8 Sỹ Đĩnh → sẽ dẫn đến Chi Sĩ Tuyên (Đời 18-20)');
}

main().catch(console.error);
