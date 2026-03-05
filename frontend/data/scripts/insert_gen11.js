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
  console.log('=== THÊM ĐỜI 11 ===\n');

  // Bước 1: Tạo gia đình F10.1 cho P10.1 (Cụ Đức Bao)
  console.log('1. Tạo gia đình F10.1 cho P10.1...');
  const result = await request('families', 'POST', {
    handle: 'F10.1',
    father_handle: 'P10.1',
    mother_handle: null,
    children: ['P11.1']
  });
  if (result) console.log('   ✓ Đã tạo F10.1');

  // Bước 2: Cập nhật P10.1 thêm families
  console.log('\n2. Cập nhật P10.1 thêm families...');
  await request('people?handle=eq.P10.1', 'PATCH', { families: ['F10.1'] });
  console.log('   ✓ Đã cập nhật P10.1');

  // Bước 3: Thêm 3 người Đời 11
  console.log('\n3. Thêm 3 người Đời 11...');

  const gen11People = [
    {
      handle: 'P11.1',
      display_name: 'Cụ Quốc Quang (Anh)',
      surname: 'Nguyễn',
      first_name: 'Quốc Quang',
      generation: 11,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F10.1'],
      families: [],
      degree: 'Đỗ Tiến sỹ',
      notes: `Đời thứ mười một: Cụ Quốc Quang, sau đổi là Anh.

Sự nghiệp:
- 25 tuổi đỗ Tiến sỹ khoa Canh Thìn, niên hiệu Chính Hòa thứ 21 (1700), vua Lê Hy Tông
- Làm quan đến Đại Lý Tự khanh
- Thu thận đoàn, khâm hình sứ Nghệ An
- Đứng văn chỉ hàng huyện huyện Võ Giàng

Phong tặng:
- Ngày mồng 9 tháng 5, niên hiệu Cảnh Hưng thứ 25 (1764), làng bầu cụ làm Khánh thần, thờ tại đình 4 mùa kinh biếu

Cúng dân:
- 5 mẫu 2 sào ruộng tốt + 210 quan tiền để tế tự

Gia đình:
- Ba con gái (Cụ Ý sinh ra ông Phạm Nguyên Đạt - Tiến sỹ)
- Vợ chính: Đoàn Quý thị (hiệu Diệu Thung) - cúng 3 sào ruộng ở Đồng Dứa

Con của Cụ Đức Bao (P10.1).`
    },
    {
      handle: 'P11.2',
      display_name: 'Cụ Đức Phượng',
      surname: 'Nguyễn',
      first_name: 'Đức Phượng',
      generation: 11,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: [],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười một: Cụ Đức Phượng.

Đỗ Nho sinh trúng thức.

⚠️ Chưa rõ cha là ai ở Đời 10 - floating node.`
    },
    {
      handle: 'P11.3',
      display_name: 'Cụ Hữu Trạch',
      surname: 'Nguyễn',
      first_name: 'Hữu Trạch',
      generation: 11,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: [],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ mười một: Cụ Hữu Trạch (hoặc Hậu Trạch).

Đỗ Nho sinh trúng thức.

⚠️ Chưa rõ cha là ai ở Đời 10 - floating node.`
    }
  ];

  for (const person of gen11People) {
    const result = await request('people', 'POST', person);
    if (result) {
      console.log(`   ✓ ${person.handle}: ${person.display_name}`);
    }
  }

  // Bước 4: Kiểm tra kết quả
  console.log('\n4. Kiểm tra Đời 11...');
  const gen11 = await request('people?generation=eq.11&select=handle,display_name,parent_families,degree');
  console.log('\n=== ĐỜI 11 ===');
  if (gen11) {
    gen11.forEach(p => {
      console.log(`${p.handle}: ${p.display_name}`);
      console.log(`  - Cha: ${p.parent_families?.length > 0 ? p.parent_families[0] : 'Chưa rõ (floating node)'}`);
      console.log(`  - Học vị: ${p.degree || 'N/A'}`);
    });
    console.log(`\nTổng: ${gen11.length} người`);
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 11.');
}

main().catch(console.error);
