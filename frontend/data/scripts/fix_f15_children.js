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
  console.log('=== SỬA CHILDREN CHO FAMILIES ĐỜI 15 ===\n');

  const updates = [
    { handle: 'F15.1', children: ['P16.1'] },
    { handle: 'F15.2', children: ['P16.2'] },
    { handle: 'F15.3', children: ['P16.3'] },
    { handle: 'F15.5', children: ['P16.8', 'P16.9', 'P16.10'] },
    { handle: 'F15.6', children: ['P16.11', 'P16.12', 'P16.13'] },
    { handle: 'F15.7', children: ['P16.14', 'P16.15', 'P16.16'] }
  ];

  for (const update of updates) {
    const result = await request(`families?handle=eq.${update.handle}`, 'PATCH', {
      children: update.children
    });
    if (result) {
      console.log(`✓ ${update.handle}: ${update.children.length} con - ${update.children.join(', ')}`);
    }
  }

  console.log('\n=== KIỂM TRA KẾT QUẢ ===\n');

  for (const update of updates) {
    const result = await request(`families?handle=eq.${update.handle}&select=handle,father_handle,children`);
    if (result && result[0]) {
      const f = result[0];
      console.log(`${f.handle}: father=${f.father_handle}, children=${JSON.stringify(f.children)}`);
    }
  }

  console.log('\n✅ HOÀN THÀNH! Đã sửa tất cả families Đời 15.');
  console.log('💡 Refresh lại trang /book để xem Đời 1 chỉ còn 1 người (Cụ Sư Húc)');
}

main().catch(console.error);
