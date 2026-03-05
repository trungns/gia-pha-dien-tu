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
  if (method !== 'DELETE') {
    const data = await res.json();
    if (!res.ok) {
      console.log(`❌ ERROR:`, JSON.stringify(data, null, 2));
      return null;
    }
    return data;
  }
  return res.ok;
}

async function main() {
  console.log('=== SỬA LỖI FAMILY CỦA SĨ BƯU ===\n');

  // Bước 1: Xóa 4 families riêng lẻ
  console.log('1. Xóa 4 families riêng lẻ...');
  for (let i = 1; i <= 4; i++) {
    await request(`families?handle=eq.F15.4.${i}`, 'DELETE');
    console.log(`   ✓ Xóa F15.4.${i}`);
  }

  // Bước 2: Tạo 1 family chung cho 4 anh em
  console.log('\n2. Tạo 1 family chung F15.4...');
  const result = await request('families', 'POST', {
    handle: 'F15.4',
    father_handle: 'P15.4',
    mother_handle: 'W15.4.1',
    children: ['P16.4', 'P16.5', 'P16.6', 'P16.7']
  });
  if (result) {
    console.log('   ✓ Đã tạo F15.4 với 4 con');
  }

  // Bước 3: Cập nhật P15.4
  console.log('\n3. Cập nhật P15.4...');
  await request('people?handle=eq.P15.4', 'PATCH', {
    families: ['F15.4']
  });
  console.log('   ✓ P15.4 families = ["F15.4"]');

  // Bước 4: Cập nhật 4 con
  console.log('\n4. Cập nhật 4 con với parent_families chung...');
  for (let i = 4; i <= 7; i++) {
    await request(`people?handle=eq.P16.${i}`, 'PATCH', {
      parent_families: ['F15.4']
    });
    console.log(`   ✓ P16.${i}`);
  }

  // Kiểm tra
  console.log('\n5. Kiểm tra kết quả...');
  const f154 = await request('families?handle=eq.F15.4&select=*');
  console.log('\n=== FAMILY F15.4 ===');
  if (f154 && f154[0]) {
    const f = f154[0];
    console.log(`Father: ${f.father_handle}`);
    console.log(`Mother: ${f.mother_handle}`);
    console.log(`Children: ${f.children.join(', ')}`);
  }

  console.log('\n✅ HOÀN THÀNH! Đã sửa lỗi hiển thị 4 anh em Sĩ Bưu.');
  console.log('Refresh lại tree để xem kết quả.');
}

main().catch(console.error);
