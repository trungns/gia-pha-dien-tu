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
  console.log('=== THÊM ĐỜI 13 ===\n');

  // Bước 1: Tạo các gia đình cho Đời 12
  console.log('1. Tạo các gia đình cho người Đời 12...');

  const families = [
    {
      handle: 'F12.1',
      father_handle: 'P12.1',
      mother_handle: null,
      children: ['P13.1']
    },
    {
      handle: 'F12.4',
      father_handle: 'P12.4',
      mother_handle: null,
      children: ['P13.5']
    },
    {
      handle: 'F12.5',
      father_handle: 'P12.5',
      mother_handle: null,
      children: ['P13.6']
    },
    {
      handle: 'F12.6',
      father_handle: 'P12.6',
      mother_handle: null,
      children: ['P13.2', 'P13.3', 'P13.4']
    }
  ];

  for (const fam of families) {
    const result = await request('families', 'POST', fam);
    if (result) {
      console.log(`   ✓ Đã tạo ${fam.handle} (${fam.children.length} con)`);
    }
  }

  // Bước 2: Cập nhật P12.x thêm families
  console.log('\n2. Cập nhật người Đời 12 thêm families...');
  await request('people?handle=eq.P12.1', 'PATCH', { families: ['F12.1'] });
  console.log('   ✓ P12.1');
  await request('people?handle=eq.P12.4', 'PATCH', { families: ['F12.4'] });
  console.log('   ✓ P12.4');
  await request('people?handle=eq.P12.5', 'PATCH', { families: ['F12.5'] });
  console.log('   ✓ P12.5');
  await request('people?handle=eq.P12.6', 'PATCH', { families: ['F12.6'] });
  console.log('   ✓ P12.6');

  // Bước 3: Thêm 6 người Đời 13
  console.log('\n3. Thêm 6 người Đời 13...');

  const gen13People = [
    {
      handle: 'P13.1',
      display_name: 'Cụ Thượng Chất (尚質)',
      surname: 'Nguyễn',
      first_name: 'Thượng Chất',
      generation: 13,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F12.1'],
      families: [],
      notes: `Đời thứ mười ba: Cụ Thượng Chất.

Sự nghiệp:
- Tả xuân phường Tả dụ đức
- Tước: Kim Lĩnh bá
- Gia hạnh Đại phu

Công đức:
- Cúng làng 120 quan tiền và 2 cây gỗ thiết đĩnh dài 12 thước để chữa đình
- Được phong Tuyên thần (1792 – Quang Trung thứ 5)

Gia đình:
- Cha: Cụ Quốc Thiệp (P12.1)

Ghi chú: Nhánh quan trọng vì cụ được phong thần và có công đức với đình làng.`
    },
    {
      handle: 'P13.2',
      display_name: 'Cụ Quốc Thực (國實)',
      surname: 'Nguyễn',
      first_name: 'Quốc Thực',
      generation: 13,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F12.6'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười ba: Cụ Quốc Thực.

Sự nghiệp:
- Đỗ Nho sinh trúng thức

Gia đình:
- Cha: Cụ Quốc Hạo (P12.6)
- Con: Cụ Đình Dung (Đời 14)`
    },
    {
      handle: 'P13.3',
      display_name: 'Cụ Quốc Bá (國霸)',
      surname: 'Nguyễn',
      first_name: 'Quốc Bá',
      generation: 13,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F12.6'],
      families: [],
      notes: `Đời thứ mười ba: Cụ Quốc Bá.

Gia đình:
- Cha: Cụ Quốc Hạo (P12.6)

⚠️ Chưa có thông tin chi tiết về sự nghiệp và hậu duệ.`
    },
    {
      handle: 'P13.4',
      display_name: 'Cụ Danh Long (名龍)',
      surname: 'Nguyễn',
      first_name: 'Danh Long',
      generation: 13,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F12.6'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười ba: Cụ Danh Long.

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Tri huyện Huyện Thủy Đường

Gia đình:
- Cha: Cụ Quốc Hạo (P12.6)
- Con: Cụ Trọng, Cụ Thịnh, Cụ Quý (Đời 14)

Ghi chú: Trụ nhánh quan trọng của Đời 13. Từ cụ, sang Đời 14 tách thành 3 nhánh con (Trọng – Thịnh – Quý), là đường nhánh phát triển mạnh về sau.`
    },
    {
      handle: 'P13.5',
      display_name: 'Cụ Thái Vũ (泰武)',
      surname: 'Nguyễn',
      first_name: 'Thái Vũ',
      generation: 13,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F12.4'],
      families: [],
      degree: 'Đỗ Hương cống',
      notes: `Đời thứ mười ba: Cụ Thái Vũ.

Sự nghiệp:
- Đỗ Hương cống
- Tri phủ Phủ Thiên Quan

Gia đình:
- Cha: Cụ Quốc Diệu (P12.4)

Ghi chú: Bậc khoa mục Đời 13 của chi này, dấu mốc cho thấy nhánh Quốc Diệu duy trì nền nếp học hành và quan nghiệp.`
    },
    {
      handle: 'P13.6',
      display_name: 'Cụ Minh Đạo (明道)',
      surname: 'Nguyễn',
      first_name: 'Minh Đạo',
      generation: 13,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F12.5'],
      families: [],
      notes: `Đời thứ mười ba: Cụ Minh Đạo.

Sự nghiệp:
- Nho học Huấn đạo (người giữ việc dạy học, chấn chỉnh nề nếp khoa cử và giáo hóa địa phương)

Gia đình:
- Cha: Cụ Quốc Dương (P12.5)

Ghi chú: Nhánh giáo dục, đóng góp cho việc duy trì nền nếp học hành tại địa phương.`
    }
  ];

  for (const person of gen13People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}`);
    }
  }

  // Bước 4: Kiểm tra kết quả
  console.log('\n4. Kiểm tra Đời 13...');
  const gen13 = await request('people?generation=eq.13&select=handle,display_name,parent_families,degree&order=handle');
  console.log('\n=== ĐỜI 13 ===');
  if (gen13) {
    gen13.forEach(p => {
      console.log(`${p.handle}: ${p.display_name}`);
      console.log(`  - Cha: ${p.parent_families?.length > 0 ? p.parent_families[0] : 'Chưa rõ'}`);
      console.log(`  - Học vị: ${p.degree || 'N/A'}`);
    });
    console.log(`\nTổng: ${gen13.length} người`);
    console.log('\n📊 Phân nhánh Đời 13:');
    console.log('  - Nhánh Thiệp → Thượng Chất (phong thần)');
    console.log('  - Nhánh Hạo → Quốc Thực, Quốc Bá, Danh Long (phát triển mạnh)');
    console.log('  - Nhánh Diệu → Thái Vũ (học hành)');
    console.log('  - Nhánh Dương → Minh Đạo (giáo dục)');
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 13.');
}

main().catch(console.error);
