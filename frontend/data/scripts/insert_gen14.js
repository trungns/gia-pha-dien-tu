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
  console.log('=== THÊM ĐỜI 14 ===\n');

  // Bước 1: Tạo các gia đình cho Đời 13
  console.log('1. Tạo các gia đình cho người Đời 13...');

  const families = [
    {
      handle: 'F13.1',
      father_handle: 'P13.1',
      mother_handle: null,
      children: ['P14.1']
    },
    {
      handle: 'F13.2',
      father_handle: 'P13.2',
      mother_handle: null,
      children: ['P14.2']
    },
    {
      handle: 'F13.4',
      father_handle: 'P13.4',
      mother_handle: null,
      children: ['P14.3', 'P14.4', 'P14.5']
    }
  ];

  for (const fam of families) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ Đã tạo ${fam.handle} (${fam.children.length} con)`);
    }
  }

  // Bước 2: Cập nhật P13.x thêm families
  console.log('\n2. Cập nhật người Đời 13 thêm families...');
  await request('people?handle=eq.P13.1', 'PATCH', { families: ['F13.1'] });
  console.log('   ✓ P13.1');
  await request('people?handle=eq.P13.2', 'PATCH', { families: ['F13.2'] });
  console.log('   ✓ P13.2');
  await request('people?handle=eq.P13.4', 'PATCH', { families: ['F13.4'] });
  console.log('   ✓ P13.4');

  // Bước 3: Thêm 5 người Đời 14
  console.log('\n3. Thêm 5 người Đời 14...');

  const gen14People = [
    {
      handle: 'P14.1',
      display_name: 'Cụ Quốc Xiêu (國休)',
      surname: 'Nguyễn',
      first_name: 'Quốc Xiêu',
      generation: 14,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F13.1'],
      families: [],
      notes: `Đời thứ mười bốn: Cụ Quốc Xiêu.

Gia đình:
- Cha: Cụ Thượng Chất (P13.1)
- Cháu: Cụ Quốc Thiệp (P12.1)
- Con: Cụ Sĩ Chiêu (Đời 15)`
    },
    {
      handle: 'P14.2',
      display_name: 'Cụ Đình Dung (庭庸)',
      surname: 'Nguyễn',
      first_name: 'Đình Dung',
      generation: 14,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F13.2'],
      families: [],
      notes: `Đời thứ mười bốn: Cụ Đình Dung.

Gia đình:
- Cha: Cụ Quốc Thực (P13.2)
- Cháu: Cụ Quốc Hạo (P12.6)
- Con: Cụ Sĩ Chi (Đời 15)`
    },
    {
      handle: 'P14.3',
      display_name: 'Cụ Trọng (重)',
      surname: 'Nguyễn',
      first_name: 'Trọng',
      generation: 14,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F13.4'],
      families: [],
      notes: `Đời thứ mười bốn: Cụ Trọng.

Gia đình:
- Cha: Cụ Danh Long (P13.4)
- Cháu: Cụ Quốc Hạo (P12.6)
- Con: Cụ Sĩ Chi (Đời 15)

Ghi chú: Nhánh Danh Long bắt đầu tách thành nhiều con (Trọng – Thịnh – Quý).`
    },
    {
      handle: 'P14.4',
      display_name: 'Cụ Thịnh (盛) - Năng Mẫn (能敏)',
      surname: 'Nguyễn',
      first_name: 'Thịnh',
      generation: 14,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F13.4'],
      families: [],
      degree: 'Đỗ Hương cống',
      notes: `Đời thứ mười bốn: Cụ Thịnh (盛), tên chữ Năng Mẫn (能敏).

Sự nghiệp:
- Đỗ Hương cống
- Được phong Hậu thần, thờ tại hành hậu đình thôn Phú Xuân

Gia đình:
- Cha: Cụ Danh Long (P13.4)
- Cháu: Cụ Quốc Hạo (P12.6)
- Vợ chính: Phạm Quý thị hiệu Diệu Đức 妙德 (con cụ Huyện Đông Yên), mất 14/5, an táng Đồng Giữa
- Á thất: Nguyễn Quý thị hiệu Diệu Lĩnh
- Con: Sĩ Đoán (vợ chính sinh), Sĩ Bưu (á thất sinh)

Thông tin mộ táng:
- Mất ngày 19 tháng 3
- Xuân thu kính biếu mỗi lần một cỗ thờ tại Từ Đường ông Sĩ Quán`
    },
    {
      handle: 'P14.5',
      display_name: 'Cụ Quý (貴)',
      surname: 'Nguyễn',
      first_name: 'Quý',
      generation: 14,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F13.4'],
      families: [],
      notes: `Đời thứ mười bốn: Cụ Quý.

Gia đình:
- Cha: Cụ Danh Long (P13.4)
- Cháu: Cụ Quốc Hạo (P12.6)
- Con: Sĩ Trinh, Sĩ Khải (Đời 15)

Ghi chú: Một trong 3 nhánh con của Danh Long (Trọng – Thịnh – Quý).`
    }
  ];

  for (const person of gen14People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}`);
    }
  }

  // Bước 4: Kiểm tra kết quả
  console.log('\n4. Kiểm tra Đời 14...');
  const gen14 = await request('people?generation=eq.14&select=handle,display_name,parent_families,degree&order=handle');
  console.log('\n=== ĐỜI 14 ===');
  if (gen14) {
    gen14.forEach(p => {
      console.log(`${p.handle}: ${p.display_name}`);
      console.log(`  - Cha: ${p.parent_families?.length > 0 ? p.parent_families[0] : 'Chưa rõ'}`);
      console.log(`  - Học vị: ${p.degree || 'N/A'}`);
    });
    console.log(`\nTổng: ${gen14.length} người`);
    console.log('\n📊 Phân nhánh Đời 14:');
    console.log('  - Nhánh Thượng Chất (P13.1) → Quốc Xiêu');
    console.log('  - Nhánh Quốc Thực (P13.2) → Đình Dung');
    console.log('  - Nhánh Danh Long (P13.4) → Trọng, Thịnh (Hương cống), Quý');
    console.log('\n💡 Từ đời 14 trở đi chuyển sang tên "Danh – Đình – Trọng – Thịnh – Quý"');
    console.log('   Đời 15 sẽ là đời "Sỹ"');
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 14.');
}

main().catch(console.error);
