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
  console.log('=== CHUẨN HÓA DATABASE ===\n');

  // 1. XÓA DUPLICATE NGƯỜI Đ4 (P006-P015)
  console.log('1. Xóa duplicate Đời 4 (P006-P015)...');
  const duplicates = ['P006', 'P007', 'P008', 'P009', 'P010', 'P011', 'P012', 'P013', 'P014', 'P015'];
  for (const handle of duplicates) {
    const result = await request(`people?handle=eq.${handle}`, 'DELETE');
    console.log(`   ✓ Xóa ${handle}`);
  }

  // 2. XÓA GIA ĐÌNH KHÔNG HỢP LỆ F004
  console.log('\n2. Xóa gia đình F004 (không hợp lệ)...');
  await request('families?handle=eq.F004', 'DELETE');
  console.log('   ✓ Đã xóa F004');

  // 3. FIX P7.1 - XÓA DUPLICATE F7.1 TRONG FAMILIES
  console.log('\n3. Fix P7.1 - xóa duplicate F7.1...');
  const p71 = await request('people?handle=eq.P7.1&select=families');
  if (p71[0]) {
    const uniqueFamilies = [...new Set(p71[0].families)]; // Remove duplicates
    await request('people?handle=eq.P7.1', 'PATCH', { families: uniqueFamilies });
    console.log(`   ✓ P7.1 families: ${p71[0].families.join(', ')} → ${uniqueFamilies.join(', ')}`);
  }

  // 4. XÓA FAMILIES TRỐNG (không có con)
  console.log('\n4. Xóa families trống...');
  const emptyFamilies = ['F5.2', 'F5.4', 'F5.5', 'F5.6', 'F5.7'];
  for (const fh of emptyFamilies) {
    const family = await request(`families?handle=eq.${fh}&select=*`);
    if (family[0] && (!family[0].children || family[0].children.length === 0)) {
      // Cập nhật cha - xóa family này khỏi families array
      const fatherHandle = family[0].father_handle;
      if (fatherHandle) {
        const father = await request(`people?handle=eq.${fatherHandle}&select=families`);
        if (father[0]) {
          const updatedFamilies = father[0].families.filter(f => f !== fh);
          await request(`people?handle=eq.${fatherHandle}`, 'PATCH', { families: updatedFamilies });
          console.log(`   ✓ Cập nhật ${fatherHandle}: xóa ${fh}`);
        }
      }
      // Xóa family
      await request(`families?handle=eq.${fh}`, 'DELETE');
      console.log(`   ✓ Xóa ${fh}`);
    }
  }

  // 5. KIỂM TRA VÀ FIX F8.1
  console.log('\n5. Kiểm tra F8.1...');
  const f81 = await request('families?handle=eq.F8.1&select=*');
  if (f81.length === 0) {
    console.log('   ⚠️  F8.1 không tồn tại nhưng P8.1 đã có F8.1 trong families');
    console.log('   → Tạo F8.1 với P8.1 là cha, P9.1 là con');
    await request('families', 'POST', {
      handle: 'F8.1',
      father_handle: 'P8.1',
      mother_handle: null,
      children: ['P9.1']
    });
    console.log('   ✓ Đã tạo F8.1');
  } else {
    console.log('   ✓ F8.1 đã tồn tại:', f81[0]);
  }

  // 6. KIỂM TRA KẾT QUẢ
  console.log('\n6. Kiểm tra kết quả...');
  const allPeople = await request('people?select=handle,display_name,generation&order=generation,handle');
  const allFamilies = await request('families?select=handle,father_handle,children&order=handle');

  console.log('\n=== KẾT QUẢ SAU CHUẨN HÓA ===');
  console.log(`Tổng số người: ${allPeople.length}`);
  console.log(`Tổng số gia đình: ${allFamilies.length}`);

  // Kiểm tra duplicate
  const nameMap = {};
  allPeople.forEach(p => {
    const name = p.display_name.replace(/\s*\([^)]*\)/g, '').trim();
    if (!nameMap[name]) nameMap[name] = [];
    nameMap[name].push(p.handle);
  });

  const duplicateNames = Object.entries(nameMap).filter(([_, handles]) => handles.length > 1);
  if (duplicateNames.length === 0) {
    console.log('✅ Không còn duplicate tên');
  } else {
    console.log('⚠️  Vẫn còn duplicate:');
    duplicateNames.forEach(([name, handles]) => {
      console.log(`   - "${name}": ${handles.join(', ')}`);
    });
  }

  // Kiểm tra families hợp lệ
  console.log('\n=== FAMILIES HỢP LỆ ===');
  allFamilies.forEach(f => {
    const childrenCount = f.children ? f.children.length : 0;
    console.log(`${f.handle}: Cha=${f.father_handle}, Con=${childrenCount}`);
  });

  console.log('\n✅ HOÀN THÀNH CHUẨN HÓA!');
}

main().catch(console.error);
