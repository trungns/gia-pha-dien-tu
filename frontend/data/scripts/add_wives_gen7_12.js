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
  console.log('=== THÊM VỢ CHO ĐỜI 7-12 ===\n');

  const wives = [
    // === ĐỜI 7: P7.1 - Cụ Nhân Đương ===
    {
      handle: 'W7.1.1',
      display_name: 'Nguyễn Quý Thị - Trinh Biểu (貞表)',
      surname: 'Nguyễn',
      first_name: 'Quý Thị',
      generation: 7,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F7.1'],
      notes: `Chính thất của Cụ Nhân Đương (P7.1).
Thụy: Trinh Biểu (貞表)
Mất: Mùng 3 tháng Giêng
An táng: Hợp táng với mộ cụ ông`
    },

    // === ĐỜI 8: P8.1 - Cụ Bỉnh Quân ===
    {
      handle: 'W8.1.1',
      display_name: 'Thụy Nhân Hiếu (仁孝)',
      surname: '',
      first_name: 'Nhân Hiếu',
      generation: 8,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F8.1'],
      notes: `Chính thất của Cụ Bỉnh Quân (P8.1).
Thụy: Nhân Hiếu (仁孝)
Mất: 21 tháng Chạp
An táng: Xứ Vọng-Nguyên ngoài mộ tổ`
    },

    // === ĐỜI 9: P9.1 - Cụ Nhân Hiệp/Bô ===
    {
      handle: 'W9.1.1',
      display_name: 'Phạm Quý thị - Trinh Huyền (貞玄)',
      surname: 'Phạm',
      first_name: 'Quý thị',
      generation: 9,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F9.1'],
      notes: `Chính thất của Cụ Nhân Hiệp/Bô (P9.1).
Thụy: Trinh Huyền (貞玄)
Quan hệ: Cháu gái cụ Châu Khê Hầu
Mất: Mùng 10 tháng Chạp
An táng: Xứ Đồng Dầu, làng Quỳnh đôi`
    },

    // === ĐỜI 10: P10.1 - Cụ Đức Bao ===
    {
      handle: 'W10.1.1',
      display_name: 'Nguyễn Quý thị - Nhị - Trinh Minh (貞明)',
      surname: 'Nguyễn',
      first_name: 'Quý thị',
      generation: 10,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F10.1'],
      notes: `Chính thất của Cụ Đức Bao (P10.1).
Húy: Nhị
Hiệu: Trinh Minh (貞明)
Mất: Mùng 1 tháng 7
An táng: Xứ Đồng Guột đằng trước làng Quán Tướng`
    },

    // === ĐỜI 11: P11.1 - Cụ Quốc Quang/Anh ===
    {
      handle: 'W11.1.1',
      display_name: 'Hoàng Quý thị - Hoan (歡) - Diệu Thuần (妙純)',
      surname: 'Hoàng',
      first_name: 'Quý thị',
      generation: 11,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F11.1'],
      notes: `Chính thất của Cụ Quốc Quang/Anh (P11.1).
Húy: Hoan (歡)
Hiệu: Diệu Thuần (妙純)
Cha: Cụ Trung Thành Hầu ở xã Thổ Hoàng, Huyện Thiên Thi
Mất: Mùng 6 tháng 7
An táng: Hợp táng với mộ cụ ông tại xứ Đồng-Guột`
    },

    // === ĐỜI 12: P12.6 - Cụ Quốc Hạo ===
    {
      handle: 'W12.6.1',
      display_name: 'Nguyễn Quý thị - Trinh Liệt',
      surname: 'Nguyễn',
      first_name: 'Quý thị',
      generation: 12,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: ['F12.6'],
      notes: `Chính thất của Cụ Quốc Hạo (P12.6).
Hiệu: Trinh Liệt
Mất: Mùng 8 tháng 3
An táng: Đồng bãi bông Côi`
    }
  ];

  console.log('1. Thêm vợ cho các đời 7-12...');
  for (const wife of wives) {
    const result = await request('people', 'POST', wife);
    if (result) {
      console.log(`   ✓ ${wife.handle}: ${wife.display_name} (Đời ${wife.generation})`);
    }
  }

  // Cập nhật families với mother_handle
  console.log('\n2. Cập nhật families với mother_handle...');

  const familyUpdates = [
    { handle: 'F7.1', mother_handle: 'W7.1.1' },
    { handle: 'F8.1', mother_handle: 'W8.1.1' },
    { handle: 'F9.1', mother_handle: 'W9.1.1' },
    { handle: 'F10.1', mother_handle: 'W10.1.1' },
    { handle: 'F11.1', mother_handle: 'W11.1.1' },
    // F12.6 đã tách thành nhiều families, cập nhật F12.6.1 (nếu tồn tại)
  ];

  for (const update of familyUpdates) {
    const result = await request(`families?handle=eq.${update.handle}`, 'PATCH', {
      mother_handle: update.mother_handle
    });
    if (result) {
      console.log(`   ✓ Cập nhật ${update.handle}`);
    }
  }

  // Kiểm tra và cập nhật F12.6.1 nếu tồn tại (từ script trước)
  const f1261 = await request('families?handle=eq.F12.6.1&select=handle');
  if (f1261 && f1261.length > 0) {
    await request('families?handle=eq.F12.6.1', 'PATCH', {
      mother_handle: 'W12.6.1'
    });
    console.log('   ✓ Cập nhật F12.6.1 (chính thất)');
  } else {
    // Nếu chưa tách, cập nhật F12.6 cũ
    const f126 = await request('families?handle=eq.F12.6&select=handle');
    if (f126 && f126.length > 0) {
      await request('families?handle=eq.F12.6', 'PATCH', {
        mother_handle: 'W12.6.1'
      });
      console.log('   ✓ Cập nhật F12.6');
    }
  }

  // Kiểm tra kết quả
  console.log('\n3. Kiểm tra kết quả...');
  const allWives = await request('people?gender=eq.0&generation=gte.7&generation=lte.14&select=handle,display_name,generation&order=generation,handle');
  console.log('\n=== VỢ ĐÃ THÊM (ĐỜI 7-14) ===');
  if (allWives) {
    let currentGen = 0;
    allWives.forEach(w => {
      if (w.generation !== currentGen) {
        currentGen = w.generation;
        console.log(`\nĐời ${currentGen}:`);
      }
      console.log(`  ${w.handle}: ${w.display_name}`);
    });
    console.log(`\nTổng: ${allWives.length} người`);
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm vợ cho Đời 7-12.');
}

main().catch(console.error);
