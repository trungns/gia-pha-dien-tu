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
  console.log('=== THÊM ĐỜI 8 ===\n');

  // Bước 1: Tạo gia đình F7.1 cho Cụ Nhân Đương (chỉ có Bỉnh Quân là con)
  console.log('1. Tạo gia đình F7.1 cho Cụ Nhân Đương...');
  const family71 = {
    handle: 'F7.1',
    father_handle: 'P7.1',
    mother_handle: null,
    children: ['P8.1']
  };

  const f71Result = await request('families', 'POST', family71);
  console.log('   ✓ Đã tạo F7.1:', f71Result);

  // Bước 2: Cập nhật P7.1 thêm gia đình F7.1
  console.log('\n2. Cập nhật P7.1 thêm families...');
  const p71 = await request('people?handle=eq.P7.1&select=families');
  const currentFamilies = p71[0]?.families || [];
  const updatedFamilies = [...currentFamilies, 'F7.1'];

  await request('people?handle=eq.P7.1', 'PATCH', { families: updatedFamilies });
  console.log('   ✓ Đã cập nhật P7.1 families:', updatedFamilies);

  // Bước 3: Thêm 2 người Đời 8
  console.log('\n3. Thêm 2 người Đời 8...');

  const gen8People = [
    {
      handle: 'P8.1',
      display_name: 'Cụ Bỉnh Quân (秉均)',
      surname: 'Nguyễn',
      first_name: 'Bỉnh Quân',
      generation: 8,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F7.1'],
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      notes: `Đời thứ tám: Cụ Bỉnh Quân đỗ Nho sinh trúng thức.

Con của Cụ Nhân Đương (P7.1).

Theo phả hệ chi Sĩ Tuyên: Nhân Đương (Đ7) → Bỉnh Quân (Đ8) → Tô/Nhân Hiệp (Đ9) → Đức Bảo (Đ10).`
    },
    {
      handle: 'P8.2',
      display_name: 'Cụ Nhân Liêm',
      surname: 'Nguyễn',
      first_name: 'Nhân Liêm',
      generation: 8,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: [], // Floating node - chưa rõ cha
      families: [],
      degree: 'Đỗ Nho sinh trúng thức',
      position: 'Tri phủ Phủ Thường Tín',
      notes: `Đời thứ tám: Cụ Nhân Liêm đỗ Nho sinh trúng thức, làm quan đến tước Thứ phủ Thuần Tín (Tri phủ Phủ Thường Tín).

⚠️ Chưa rõ cha là ai ở Đời 7 - cần cập nhật sau.`
    }
  ];

  for (const person of gen8People) {
    const result = await request('people', 'POST', person);
    console.log(`   ✓ Đã thêm ${person.handle}: ${person.display_name}`);
  }

  // Bước 4: Kiểm tra kết quả
  console.log('\n4. Kiểm tra Đời 8...');
  const gen8 = await request('people?generation=eq.8&select=*');
  console.log('\n=== ĐỜI 8 ===');
  gen8.forEach(p => {
    console.log(`${p.handle}: ${p.display_name}`);
    console.log(`  - Cha: ${p.parent_families.length > 0 ? p.parent_families : 'Chưa rõ (floating node)'}`);
    console.log(`  - Học vị: ${p.degree || 'N/A'}`);
    console.log(`  - Chức vụ: ${p.position || 'N/A'}`);
  });
  console.log(`\nTổng: ${gen8.length} người`);

  console.log('\n✅ HOÀN THÀNH! Đã thêm Đời 8 vào database.');
  console.log('📊 Tổng số người trong database: Đời 1-8');
}

main().catch(console.error);
