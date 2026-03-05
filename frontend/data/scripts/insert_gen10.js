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
  return await res.json();
}

async function main() {
  console.log('=== THÊM ĐỜI 10 ===\n');

  // Bước 1: Tạo gia đình F9.1 cho P9.1 (Cụ Nhân Hiệp/Bô)
  console.log('1. Tạo gia đình F9.1 cho P9.1...');
  const family91 = {
    handle: 'F9.1',
    father_handle: 'P9.1',
    mother_handle: null,
    children: ['P10.1']
  };

  await request('families', 'POST', family91);
  console.log('   ✓ Đã tạo F9.1');

  // Bước 2: Cập nhật P9.1 thêm families
  console.log('\n2. Cập nhật P9.1 thêm families...');
  await request('people?handle=eq.P9.1', 'PATCH', { families: ['F9.1'] });
  console.log('   ✓ Đã cập nhật P9.1');

  // Bước 3: Thêm 4 người Đời 10
  console.log('\n3. Thêm 4 người Đời 10...');

  const gen10People = [
    {
      handle: 'P10.1',
      display_name: 'Cụ Đức Bao (德褒)',
      surname: 'Nguyễn',
      first_name: 'Đức Bao',
      generation: 10,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F9.1'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      position: 'Tri huyện Phú Lương',
      title: 'Hậu thần',
      notes: `Đời thứ mười: Cụ Đức Bao, tên chữ Đạt Đạo (達道).

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Làm quan đến Tri huyện Phú Lương
- Cụ có ruộng huệ điền cúng dân:
  • Tổng: 3 mẫu 6 sào 7 tấc
  • Quai Vòng: 1 mẫu 3 sào
  • Ao Khếnh: 1 mẫu 5 sào 7 tấc
  • Vùng Đông: 8 sào

Phong tặng: Năm Cảnh Hưng thứ 33 (1772), vua Lê Hiển Tông, dân nhớ công đức cụ bầu làm Hậu thần, phụng thờ tại đình 4 mùa kinh tiết để tỏ sự nhớ ơn cụ (Có văn bia ở Từ đường).

Con của Cụ Nhân Hiệp (P9.1).`
    },
    {
      handle: 'P10.2',
      display_name: 'Cụ Trang Hoà (莊和)',
      surname: 'Nguyễn',
      first_name: 'Trang Hoà',
      generation: 10,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: [],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười: Cụ Trang Hoà (莊和).

Đỗ Nho sinh trúng thức.

⚠️ Chưa rõ cha là ai ở Đời 9 - cần cập nhật sau.`
    },
    {
      handle: 'P10.3',
      display_name: 'Cụ Nhã Lượng (雅量)',
      surname: 'Nguyễn',
      first_name: 'Nhã Lượng',
      generation: 10,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: [],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      position: 'Tri huyện Lục Ngạn',
      notes: `Đời thứ mười: Cụ Nhã Lượng (雅量).

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Làm quan đến Tri huyện Lục Ngạn

⚠️ Chưa rõ cha là ai ở Đời 9 - cần cập nhật sau.`
    },
    {
      handle: 'P10.4',
      display_name: 'Cụ Đức Minh (德明)',
      surname: 'Nguyễn',
      first_name: 'Đức Minh',
      generation: 10,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: [],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      position: 'Tri huyện Tư Nông',
      notes: `Đời thứ mười: Cụ Đức Minh (德明).

Sự nghiệp:
- Đỗ Nho sinh trúng thức
- Làm quan đến Tri huyện Tư Nông

⚠️ Chưa rõ cha là ai ở Đời 9 - cần cập nhật sau.`
    }
  ];

  for (const person of gen10People) {
    await request('people', 'POST', person);
    console.log(`   ✓ ${person.handle}: ${person.display_name}`);
  }

  // Bước 4: Kiểm tra kết quả
  console.log('\n4. Kiểm tra Đời 10...');
  const gen10 = await request('people?generation=eq.10&select=*');
  console.log('\n=== ĐỜI 10 ===');
  gen10.forEach(p => {
    console.log(`${p.handle}: ${p.display_name}`);
    console.log(`  - Cha: ${p.parent_families.length > 0 ? p.parent_families[0] : 'Chưa rõ (floating node)'}`);
    console.log(`  - Học vị: ${p.degree || 'N/A'}`);
    console.log(`  - Chức vụ: ${p.position || 'N/A'}`);
  });
  console.log(`\nTổng: ${gen10.length} người`);

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 10.');
}

main().catch(console.error);
