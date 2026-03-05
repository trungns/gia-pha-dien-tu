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
  console.log('=== CẬP NHẬT NGÀY SINH/MẤT ĐỜI 17 ===\n');

  // Cập nhật P17.8 - Sỹ Đĩnh (có đầy đủ thông tin)
  console.log('1. Cập nhật P17.8 (Sỹ Đĩnh) với ngày sinh/mất...');

  await request('people?handle=eq.P17.8', 'PATCH', {
    birth_year: 1856,
    birth_date_lunar: '1856 Bính Thìn (Tự Đức 9)',
    death_date_lunar: '23/7 Âm lịch năm 1908',
    death_year: 1908,
    burial_location: 'Sứ Vườn Đồn (cạnh xóm Lửa, phía cống cụt)',
    notes: `Đời thứ mười bảy: Cụ Sỹ Đĩnh (仕梃).

Tên chữ: Trực Khanh (直卿)
Hiệu: Chế Chi (制之)

Thông tin sinh mất:
- Sinh: Năm 1856 (Bính Thìn – Tự Đức 9)
- Mất: 23/7 Âm lịch năm 1908
- An táng: Sứ Vườn Đồn (cạnh xóm Lửa, phía cống cụt)

Gia đình:
- Cha: Cụ Sỹ Bồi (P16.6)
- Vợ chính: Nguyễn Thị Chính (W17.8.1) - hiệu Đoan Nhất, sinh 1860, mất 29/6 Âm lịch
- Thứ thất: Nguyễn Thị Y (W17.8.2) - sinh 1864, mất 29/12/1950 (21/11 Canh Dần Âm lịch)
- Con: Sỹ Khái (P18.1), Sỹ Huân (P18.2), Sỹ Tuyên (P18.3), Thị In, Thị Hiểu, Thị Rịu

Ghi chú: Nhánh chính dẫn đến Chi Sĩ Tuyên (đời 18-20)`
  });
  console.log('   ✓ P17.8 đã cập nhật');

  // Cập nhật W17.8.1 - Nguyễn Thị Chính
  console.log('\n2. Cập nhật W17.8.1 (Nguyễn Thị Chính)...');

  await request('people?handle=eq.W17.8.1', 'PATCH', {
    birth_year: 1860,
    death_date_lunar: '29/6 Âm lịch',
    notes: `Chính thất của Cụ Sỹ Đĩnh (P17.8).

Hiệu: Đoan Nhất

Thông tin sinh mất:
- Sinh: Năm 1860
- Mất: 29/6 Âm lịch`
  });
  console.log('   ✓ W17.8.1 đã cập nhật');

  // Cập nhật W17.8.2 - Nguyễn Thị Y
  console.log('\n3. Cập nhật W17.8.2 (Nguyễn Thị Y)...');

  await request('people?handle=eq.W17.8.2', 'PATCH', {
    birth_year: 1864,
    death_date: '1950-12-29',
    death_date_lunar: '21/11 Canh Dần (Âm lịch)',
    death_year: 1950,
    burial_location: 'Đồng Khoai',
    notes: `Thứ thất của Cụ Sỹ Đĩnh (P17.8).

Thông tin sinh mất:
- Sinh: Năm 1864
- Mất: 29/12/1950 (Dương lịch) = 21/11 Canh Dần (Âm lịch)
- An táng: Đồng Khoai
- Giỗ: 21/11 Âm lịch`
  });
  console.log('   ✓ W17.8.2 đã cập nhật');

  // Kiểm tra kết quả
  console.log('\n4. Kiểm tra kết quả...');

  const p178 = await request('people?handle=eq.P17.8&select=handle,display_name,birth_year,death_year,birth_date_lunar,death_date_lunar,burial_location');
  console.log('\n=== P17.8 (Sỹ Đĩnh) ===');
  if (p178 && p178[0]) {
    const p = p178[0];
    console.log(`Sinh: ${p.birth_year} (${p.birth_date_lunar || 'N/A'})`);
    console.log(`Mất: ${p.death_year || 'N/A'} (${p.death_date_lunar || 'N/A'})`);
    console.log(`Mộ táng: ${p.burial_location || 'N/A'}`);
  }

  const wives = await request('people?handle=in.(W17.8.1,W17.8.2)&select=handle,display_name,birth_year,death_year,death_date_lunar,burial_location&order=handle');
  console.log('\n=== VỢ CỦA P17.8 ===');
  if (wives) {
    wives.forEach(w => {
      console.log(`\n${w.handle}: ${w.display_name}`);
      console.log(`  Sinh: ${w.birth_year || 'N/A'}`);
      console.log(`  Mất: ${w.death_year || 'N/A'} (${w.death_date_lunar || 'N/A'})`);
      console.log(`  Mộ táng: ${w.burial_location || 'N/A'}`);
    });
  }

  console.log('\n✅ HOÀN THÀNH! Đã cập nhật đầy đủ thông tin ngày sinh/mất Âm lịch.');
}

main().catch(console.error);
