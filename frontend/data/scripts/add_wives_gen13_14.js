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
  console.log('=== THÊM VỢ CHO ĐỜI 13-14 ===\n');

  // === ĐỜI 13: CỤ DANH LONG (P13.4) ===
  console.log('1. Thêm vợ cho P13.4 (Cụ Danh Long)...');

  const wivesP13_4 = [
    {
      handle: 'W13.4.1',
      display_name: 'Nguyễn Quý thị - Trinh Thành (貞誠)',
      surname: 'Nguyễn',
      first_name: 'Quý thị',
      generation: 13,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F13.4.1'],
      notes: `Chính thất của Cụ Danh Long (P13.4).
Thụy: Trinh Thành (貞誠)
Quê: Làng Bất Phí
Mất: 9 tháng Chạp
An táng: Chân hình-nhân (khu dưới)
Sinh con: Danh Thịnh (P14.4)`
    },
    {
      handle: 'W13.4.2',
      display_name: 'Nguyễn Quý thị - Trinh Thanh (貞清)',
      surname: 'Nguyễn',
      first_name: 'Quý thị',
      generation: 13,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F13.4.2'],
      notes: `Á thất của Cụ Danh Long (P13.4).
Thụy: Trinh Thanh (貞清)
Quan hệ: Em ruột của chính thất
Mất: 29 tháng 2
An táng: Đồng bãi bông Côi`
    },
    {
      handle: 'W13.4.3',
      display_name: 'Lã Quý thị - Diệu Bảo (妙保)',
      surname: 'Lã',
      first_name: 'Quý thị',
      generation: 13,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F13.4.3'],
      notes: `Thứ thất của Cụ Danh Long (P13.4).
Hiệu: Diệu Bảo (妙保)
Quê: Làng Bảo Sơn, Bắc Giang
Sinh con: Danh Đăng`
    },
    {
      handle: 'W13.4.4',
      display_name: 'Dương Quý thị - Diệu Hòa (妙和)',
      surname: 'Dương',
      first_name: 'Quý thị',
      generation: 13,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: `Thứ thất của Cụ Danh Long (P13.4).
Hiệu: Diệu Hòa (妙和)
Quê: Làng Hoa Thức
Mất: 26 tháng 3`
    }
  ];

  for (const wife of wivesP13_4) {
    const result = await request('people', 'POST', wife);
    if (result) {
      console.log(`   ✓ ${wife.handle}: ${wife.display_name}`);
    }
  }

  // === ĐỜI 14: CỤ THỊNH (P14.4) ===
  console.log('\n2. Thêm vợ cho P14.4 (Cụ Thịnh)...');

  const wivesP14_4 = [
    {
      handle: 'W14.4.1',
      display_name: 'Phạm Quý thị - Diệu Đức (妙德)',
      surname: 'Phạm',
      first_name: 'Quý thị',
      generation: 14,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F14.4.1'],
      notes: `Chính thất của Cụ Thịnh (P14.4).
Hiệu: Diệu Đức (妙德)
Cha: Cụ Huyện Đông Yên
Mất: 14 tháng 5
An táng: Đồng Giữa
Sinh con: Sĩ Đoán (P15.5)`
    },
    {
      handle: 'W14.4.2',
      display_name: 'Nguyễn Quý thị - Diệu Lĩnh (妙領)',
      surname: 'Nguyễn',
      first_name: 'Quý thị',
      generation: 14,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F14.4.2'],
      notes: `Á thất của Cụ Thịnh (P14.4).
Hiệu: Diệu Lĩnh (妙領)
Sinh con: Sĩ Bưu (P15.4)`
    }
  ];

  for (const wife of wivesP14_4) {
    const result = await request('people', 'POST', wife);
    if (result) {
      console.log(`   ✓ ${wife.handle}: ${wife.display_name}`);
    }
  }

  // Bước 3: Cập nhật/Tạo lại families với mother_handle
  console.log('\n3. Cập nhật families với mother_handle...');

  // Xóa F13.4 cũ vì cần tách thành nhiều families
  console.log('   - Xóa F13.4 cũ...');
  await request('families?handle=eq.F13.4', 'DELETE');

  // Tạo lại families cho P13.4 với từng vợ
  const familiesP13_4 = [
    {
      handle: 'F13.4.1',
      father_handle: 'P13.4',
      mother_handle: 'W13.4.1',
      children: ['P14.4'] // Danh Thịnh
    },
    {
      handle: 'F13.4.2',
      father_handle: 'P13.4',
      mother_handle: 'W13.4.2',
      children: [] // Á thất không có con ghi rõ
    },
    {
      handle: 'F13.4.3',
      father_handle: 'P13.4',
      mother_handle: 'W13.4.3',
      children: [] // Danh Đăng - sẽ thêm sau
    },
    {
      handle: 'F13.4.4',
      father_handle: 'P13.4',
      mother_handle: null, // Trọng, Quý chưa rõ mẹ
      children: ['P14.3', 'P14.5']
    }
  ];

  for (const fam of familiesP13_4) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ Tạo ${fam.handle}`);
    }
  }

  // Cập nhật P13.4 với families mới
  await request('people?handle=eq.P13.4', 'PATCH', {
    families: ['F13.4.1', 'F13.4.2', 'F13.4.3', 'F13.4.4']
  });
  console.log('   ✓ Cập nhật P13.4 families');

  // Xóa F14.4 cũ
  console.log('   - Xóa F14.4 cũ...');
  await request('families?handle=eq.F14.4', 'DELETE');

  // Tạo families cho P14.4 với từng vợ (chưa có con vì chưa insert Gen 15)
  const familiesP14_4 = [
    {
      handle: 'F14.4.1',
      father_handle: 'P14.4',
      mother_handle: 'W14.4.1',
      children: [] // Sẽ thêm P15.5 sau
    },
    {
      handle: 'F14.4.2',
      father_handle: 'P14.4',
      mother_handle: 'W14.4.2',
      children: [] // Sẽ thêm P15.4 sau
    }
  ];

  for (const fam of familiesP14_4) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ Tạo ${fam.handle}`);
    }
  }

  // Cập nhật P14.4 với families mới
  await request('people?handle=eq.P14.4', 'PATCH', {
    families: ['F14.4.1', 'F14.4.2']
  });
  console.log('   ✓ Cập nhật P14.4 families');

  // Kiểm tra kết quả
  console.log('\n4. Kiểm tra kết quả...');
  const wives = await request('people?gender=eq.0&generation=gte.13&select=handle,display_name,generation&order=handle');
  console.log('\n=== VỢ ĐÃ THÊM ===');
  if (wives) {
    wives.forEach(w => {
      console.log(`${w.handle}: ${w.display_name} (Đời ${w.generation})`);
    });
    console.log(`\nTổng: ${wives.length} người`);
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm vợ cho Đời 13-14.');
}

main().catch(console.error);
