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
  console.log('=== THÊM ĐỜI 12 ===\n');

  // Bước 1: Tạo gia đình F11.1 cho P11.1 (Cụ Quốc Quang)
  console.log('1. Tạo gia đình F11.1 cho P11.1...');
  const result = await request('families', 'POST', {
    handle: 'F11.1',
    father_handle: 'P11.1',
    mother_handle: null,
    children: ['P12.1', 'P12.2', 'P12.3', 'P12.4', 'P12.5', 'P12.6']
  });
  if (result) console.log('   ✓ Đã tạo F11.1');

  // Bước 2: Cập nhật P11.1 thêm families
  console.log('\n2. Cập nhật P11.1 thêm families...');
  await request('people?handle=eq.P11.1', 'PATCH', { families: ['F11.1'] });
  console.log('   ✓ Đã cập nhật P11.1');

  // Bước 3: Thêm 6 người Đời 12
  console.log('\n3. Thêm 6 người Đời 12...');

  const gen12People = [
    {
      handle: 'P12.1',
      display_name: 'Cụ Quốc Thiệp (國攝)',
      surname: 'Nguyễn',
      first_name: 'Quốc Thiệp',
      generation: 12,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F11.1'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười hai: Cụ Quốc Thiệp.

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Tri huyện Huyện Quế Dương

Gia đình:
- Cha: Cụ Quốc Quang (P11.1)
- Mẹ: Hoàng Quý thị
- Con: Cụ Thượng Chất (Đời 13)

Ghi chú: Nhánh quan trọng vì có con là Thượng Chất được phong thần.`
    },
    {
      handle: 'P12.2',
      display_name: 'Cụ Quốc Tuân (國遵)',
      surname: 'Nguyễn',
      first_name: 'Quốc Tuân',
      generation: 12,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F11.1'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười hai: Cụ Quốc Tuân.

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Tri huyện Huyện Chí Linh
- Tước: Kim Xuyên Bá

Gia đình:
- Cha: Cụ Quốc Quang (P11.1)
- Mẹ: Hoàng Quý thị`
    },
    {
      handle: 'P12.3',
      display_name: 'Cụ Thiếu Thực (孝直)',
      surname: 'Nguyễn',
      first_name: 'Thiếu Thực',
      generation: 12,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F11.1'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười hai: Cụ Thiếu Thực (孝直).

Sự nghiệp:
- Đỗ Nho sinh trúng thức

Gia đình:
- Cha: Cụ Quốc Quang (P11.1)
- Mẹ: Hoàng Quý thị

Ghi chú: Chi mờ nhất, có khả năng thất lạc tài liệu.`
    },
    {
      handle: 'P12.4',
      display_name: 'Cụ Quốc Diệu (國雅)',
      surname: 'Nguyễn',
      first_name: 'Quốc Diệu',
      generation: 12,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F11.1'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười hai: Cụ Quốc Diệu (國雅).

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Tri huyện Huyện Đông An

Gia đình:
- Cha: Cụ Quốc Quang (P11.1)
- Mẹ: Hoàng Quý thị
- Con: Cụ Thái Vũ (Đời 13)`
    },
    {
      handle: 'P12.5',
      display_name: 'Cụ Quốc Dương (國楊)',
      surname: 'Nguyễn',
      first_name: 'Quốc Dương',
      generation: 12,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F11.1'],
      families: [],
      notes: `Đời thứ mười hai: Cụ Quốc Dương.

Sự nghiệp:
- Lâm cục Nho sinh

Gia đình:
- Cha: Cụ Quốc Quang (P11.1)
- Mẹ: Hoàng Quý thị
- Con: Cụ Minh Đạo (Đời 13)`
    },
    {
      handle: 'P12.6',
      display_name: 'Cụ Quốc Hạo (國豪)',
      surname: 'Nguyễn',
      first_name: 'Quốc Hạo',
      generation: 12,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F11.1'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười hai: Cụ Quốc Hạo (國豪).

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Tri huyện Huyện Hữu Lũng

Gia đình:
- Cha: Cụ Quốc Quang (P11.1)
- Mẹ: Hoàng Quý thị
- Vợ: Nguyễn Quý thị – hiệu Trinh Liệt (Mất ngày 8 tháng 3, An táng tại bãi bông Côi)
- Con: Cụ Quốc Thực, Cụ Quốc Bá, Cụ Danh Long (Đời 13)

Thông tin mộ táng:
- Mất ngày 27 tháng Chạp
- An táng tại Bãi Đồng Guột

Ghi chú: Nhánh phát triển mạnh nhất, có thông tin mộ táng rõ ràng → khả năng là nhánh chính còn duy trì từ đường.`
    }
  ];

  for (const person of gen12People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}`);
    }
  }

  // Bước 4: Kiểm tra kết quả
  console.log('\n4. Kiểm tra Đời 12...');
  const gen12 = await request('people?generation=eq.12&select=handle,display_name,parent_families,degree');
  console.log('\n=== ĐỜI 12 ===');
  if (gen12) {
    gen12.forEach(p => {
      console.log(`${p.handle}: ${p.display_name}`);
      console.log(`  - Cha: ${p.parent_families?.length > 0 ? p.parent_families[0] : 'Chưa rõ'}`);;
      console.log(`  - Học vị: ${p.degree || 'N/A'}`);
    });
    console.log(`\nTổng: ${gen12.length} người`);
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 12 (6 con của Cụ Quốc Quang).');
}

main().catch(console.error);
