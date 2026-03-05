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
  console.log('=== CẬP NHẬT ĐẦY ĐỦ NGÀY SINH/MẤT TẤT CẢ CÁC ĐỜI ===\n');

  const updates = [
    // === ĐỜI 3 ===
    {
      handle: 'P3.1',
      birth_year: 1392,
      death_year: 1463,
      longevity: 71,
      notes: `Đời thứ ba: Cụ Lung.

Tên hiệu: Từ mẫn
Chức: Triều Liệt Đại Phu – Tham Chính

Thông tin sinh mất:
- Sinh: Năm 1392 (Nhâm Thân – Quang Thái thứ 5)
- Mất: 29 tháng 11 Nhâm Ngọ năm 1463 (có dị bản ghi 1465)
- Thọ: 71 tuổi (hoặc 73 tuổi)

Công đức & sự nghiệp:
- Thuở nhỏ mồ côi gặp loạn nhà Hồ, sống vất vả
- Về sau định cư tại xã Kim Đôi (từ cụ Lung trở đi họ Nguyễn ở Kim Đôi)
- Chuyện bãi Vọng Nguyên: khi chăn trâu thấy thầy địa lý thử huyệt (Nhũ/Đột), cụ đem mộ cha (cụ Sư Kỳ) táng vào chỗ "Nhũ" theo huyệt thật
- Sau đó đẵn cây bồ đề, sửa sang bãi đất làm nhà ở (về sau là vị trí từ đường đại tôn)
- Cụ nghiêm trực; cùng cụ bà dạy con cháu chuyên việc nho học, chu cấp áo gạo để con chuyên tâm học hành

Gia đình:
- Cha: Cụ Sỹ Kỳ (P2.1)
- Mẹ: Nguyễn thị Quân
- Vợ 1: (Ngọc Đôi) - sinh Kiếp, Hoa
- Vợ 2 (Kế thất): Hoàng thị (húy Định) Hiệu: Từ Thiện
- Con: 7 trai (Duyên, Nhân Chù, Nhân Bị, Nhân Bồng, Nhân Thiếp, Nhân Giữ, Nhân Đạc) + 3 gái (Na, Cam, Ất)`
    },

    // === ĐỜI 16 ===
    {
      handle: 'P16.6',
      birth_year: 1835,
      death_year: 1886,
      death_date: '1886-06-05',
      death_place: 'Đồng Bé',
      longevity: 52,
      notes: `Đời thứ mười sáu: Cụ Sỹ Bồi (落).

Hiệu: Kim Khê Xử Sỹ
Tên chữ: Thúc Mỹ (識美)
Hiệu: Cúc Văn (學文)

Thông tin sinh mất:
- Sinh: Năm 1835 (Ất Mùi – Minh Mệnh thứ 16)
- Mất: Mùng 5 tháng 6 năm 1886 (Bính Tuất – Đồng Khánh thứ nhất)
- Thọ: 52 tuổi
- Mộ táng: Đồng Bé

Gia đình:
- Cha: Cụ Sĩ Bưu (P15.4)
- Vợ: Nguyễn Quý thị Phú hiệu Từ Hữu (慈有), mất 13/8
- Con: Cụ Sỹ Đĩnh (P17.8) (仕梃)`
    },

    // === ĐỜI 17 ===
    {
      handle: 'P17.8',
      birth_year: 1856,
      death_year: 1908,
      death_place: 'Sứ Vườn Đồn (cạnh xóm Lửa, phía cống cụt)',
      longevity: 53,
      notes: `Đời thứ mười bảy: Cụ Sỹ Đĩnh (仕梃).

Tên chữ: Trực Khanh (直卿)
Hiệu: Chế Chi (制之)

Thông tin sinh mất:
- Sinh: Năm 1856 (Bính Thìn – Tự Đức 9)
- Mất: 23/7 Âm lịch năm 1908
- Thọ: 53 tuổi
- An táng: Sứ Vườn Đồn (cạnh xóm Lửa, phía cống cụt)

Gia đình:
- Cha: Cụ Sỹ Bồi (P16.6)
- Vợ chính: Nguyễn Thị Chính (W17.8.1) - hiệu Đoan Nhất, sinh 1860, mất 29/6 Âm lịch
- Thứ thất: Nguyễn Thị Y (W17.8.2) - sinh 1864, mất 29/12/1950 (21/11 Canh Dần Âm lịch)
- Con: Sỹ Khái (P18.1), Sỹ Huân (P18.2), Sỹ Tuyên (P18.3), Thị In, Thị Hiểu, Thị Rịu

Ghi chú: Nhánh chính dẫn đến Chi Sĩ Tuyên (đời 18-20)`
    },

    // === VỢ ĐỜI 16 ===
    {
      handle: 'W16.6.1',
      birth_year: null,
      death_year: null,
      notes: `Chính thất của Cụ Sỹ Bồi (P16.6).

Tên: Nguyễn Quý thị Phú
Hiệu: Từ Hữu (慈有)

Thông tin sinh mất:
- Mất: 13/8 Âm lịch`
    },

    // === VỢ ĐỜI 17 ===
    {
      handle: 'W17.8.1',
      birth_year: 1860,
      death_year: null,
      notes: `Chính thất của Cụ Sỹ Đĩnh (P17.8).

Hiệu: Đoan Nhất

Thông tin sinh mất:
- Sinh: Năm 1860
- Mất: 29/6 Âm lịch`
    },

    {
      handle: 'W17.8.2',
      birth_year: 1864,
      birth_date: '1864-01-01',
      death_year: 1950,
      death_date: '1950-12-29',
      death_place: 'Đồng Khoai',
      longevity: 86,
      notes: `Thứ thất của Cụ Sỹ Đĩnh (P17.8).

Thông tin sinh mất:
- Sinh: Năm 1864
- Mất: 29/12/1950 (Dương lịch) = 21/11 Canh Dần (Âm lịch)
- Thọ: 86 tuổi
- An táng: Đồng Khoai
- Giỗ: 21/11 Âm lịch`
    }
  ];

  console.log('1. Cập nhật thông tin ngày sinh/mất...');

  for (const update of updates) {
    const { handle, ...data } = update;
    const result = await request(`people?handle=eq.${handle}`, 'PATCH', data);
    if (result) {
      console.log(`   ✓ ${handle}: ${result[0]?.display_name || handle}`);
    }
  }

  // === KIỂM TRA KẾT QUẢ ===
  console.log('\n2. Kiểm tra kết quả...');

  const peopleWithDates = await request('people?birth_year=not.is.null&select=handle,display_name,generation,birth_year,death_year,longevity&order=generation,handle');

  console.log('\n=== NGƯỜI CÓ THÔNG TIN NGÀY SINH/MẤT ===');
  if (peopleWithDates) {
    let currentGen = 0;
    peopleWithDates.forEach(p => {
      if (p.generation !== currentGen) {
        currentGen = p.generation;
        console.log(`\n--- Đời ${currentGen} ---`);
      }
      console.log(`${p.handle}: ${p.display_name}`);
      console.log(`  Sinh: ${p.birth_year || 'N/A'} | Mất: ${p.death_year || 'N/A'} | Thọ: ${p.longevity || 'N/A'}`);
    });
    console.log(`\n✅ Tổng: ${peopleWithDates.length} người có thông tin ngày tháng`);
  }

  console.log('\n✅ HOÀN THÀNH! Đã cập nhật đầy đủ thông tin ngày sinh/mất.');
  console.log('💡 Thông tin Âm lịch chi tiết đã được ghi trong trường notes.');
}

main().catch(console.error);
