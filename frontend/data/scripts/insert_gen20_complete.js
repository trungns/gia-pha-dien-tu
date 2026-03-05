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
  if (method === 'DELETE') return res.ok;
  const data = await res.json();
  if (!res.ok) {
    console.log(`❌ ERROR:`, JSON.stringify(data, null, 2));
    return null;
  }
  return data;
}

async function main() {
  console.log('=== THÊM ĐỜI 20 ĐẦY ĐỦ (44 NGƯỜI - 10 NHÁNH) ===\n');
  console.log('⚠️  Script rất dài, có thể mất 1-2 phút...\n');

  // === BƯỚC 1: THÊM 44 NGƯỜI ĐỜI 20 ===
  console.log('1. Thêm 44 người Đời 20 (chia làm 10 nhánh)...\n');

  const gen20People = [
    // === NHÁNH 1: CHI 19.1 (NGUYỄN SĨ KHẮC) - 6 NGƯỜI ===
    {
      handle: 'P20.1',
      display_name: 'Nguyễn Sĩ Khuông',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khuông',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.1'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khắc (P19.1)\nVợ: Nghĩa'
    },
    {
      handle: 'P20.2',
      display_name: 'Nguyễn Thị Khuê',
      surname: 'Nguyễn',
      first_name: 'Thị Khuê',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.1'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khắc (P19.1)\nChồng: Soi'
    },
    {
      handle: 'P20.3',
      display_name: 'Nguyễn Thị Khang',
      surname: 'Nguyễn',
      first_name: 'Thị Khang',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.1'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khắc (P19.1)'
    },
    {
      handle: 'P20.4',
      display_name: 'Nguyễn Thị Lạng',
      surname: 'Nguyễn',
      first_name: 'Thị Lạng',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.1'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khắc (P19.1)'
    },
    {
      handle: 'P20.5',
      display_name: 'Nguyễn Thị Liêm',
      surname: 'Nguyễn',
      first_name: 'Thị Liêm',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.1'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khắc (P19.1)\nChồng: Thuận'
    },
    {
      handle: 'P20.6',
      display_name: 'Nguyễn Sĩ Khoả',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khoả',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.1'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khắc (P19.1)\nVợ: Lý'
    },

    // === NHÁNH 2: CHI 19.2 (NGUYỄN SĨ KHÂM) - 5 NGƯỜI ===
    {
      handle: 'P20.7',
      display_name: 'Nguyễn Sĩ Khiết',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khiết',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F19.2'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khâm (P19.2)'
    },
    {
      handle: 'P20.8',
      display_name: 'Nguyễn Sĩ Khung',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khung',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F19.2'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khâm (P19.2)'
    },
    {
      handle: 'P20.9',
      display_name: 'Nguyễn Sĩ Khải',
      surname: 'Nguyễn',
      first_name: 'Sĩ Khải',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F19.2'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khâm (P19.2)'
    },
    {
      handle: 'P20.10',
      display_name: 'Nguyễn Thị Hoàn',
      surname: 'Nguyễn',
      first_name: 'Thị Hoàn',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F19.2'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khâm (P19.2)\nChồng: Đoan'
    },
    {
      handle: 'P20.11',
      display_name: 'Nguyễn Thị Hoàn (2)',
      surname: 'Nguyễn',
      first_name: 'Thị Hoàn',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F19.2'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Khâm (P19.2)\nChồng: Giang\n⚠️ Trùng tên với P20.10'
    },

    // === NHÁNH 3: CHI 19.3 (NGUYỄN THỊ KHẢNG) - 5 NGƯỜI ===
    {
      handle: 'P20.12',
      display_name: 'Nguyễn Đông',
      surname: 'Nguyễn',
      first_name: 'Đông',
      generation: 20,
      gender: 1,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: 'Cha: Nguyễn Quang Đôn (chồng của P19.3 Nguyễn Thị Khảng)\nMẹ: P19.3 Nguyễn Thị Khảng'
    },
    {
      handle: 'P20.13',
      display_name: 'Nguyễn Thỏa',
      surname: 'Nguyễn',
      first_name: 'Thỏa',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: 'Cha: Nguyễn Quang Đôn (chồng của P19.3)\nMẹ: P19.3 Nguyễn Thị Khảng'
    },
    {
      handle: 'P20.14',
      display_name: 'Nguyễn Khuyến',
      surname: 'Nguyễn',
      first_name: 'Khuyến',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: 'Cha: Nguyễn Quang Đôn (chồng của P19.3)\nMẹ: P19.3 Nguyễn Thị Khảng'
    },
    {
      handle: 'P20.15',
      display_name: 'Nguyễn Nương',
      surname: 'Nguyễn',
      first_name: 'Nương',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: 'Cha: Nguyễn Quang Đôn (chồng của P19.3)\nMẹ: P19.3 Nguyễn Thị Khảng'
    },
    {
      handle: 'P20.16',
      display_name: 'Nguyễn Anh',
      surname: 'Nguyễn',
      first_name: 'Anh',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: 'Cha: Nguyễn Quang Đôn (chồng của P19.3)\nMẹ: P19.3 Nguyễn Thị Khảng'
    },

    // === NHÁNH 4: CHI 19.4 (NGUYỄN THỊ NÂU) - 1 NGƯỜI ===
    {
      handle: 'P20.17',
      display_name: 'Kim',
      surname: '',
      first_name: 'Kim',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: 'Cha: Đặng Ngọc Phách (chồng của P19.4)\nMẹ: P19.4 Nguyễn Thị Nâu'
    },

    // === NHÁNH 5: CHI 19.5 (NGUYỄN SĨ HUẤN) - 6 NGƯỜI ===
    {
      handle: 'P20.18',
      display_name: 'Nguyễn Sĩ Hưng',
      surname: 'Nguyễn',
      first_name: 'Sĩ Hưng',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.5'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Huấn (P19.5)'
    },
    {
      handle: 'P20.19',
      display_name: 'Nguyễn Sĩ Hiệu',
      surname: 'Nguyễn',
      first_name: 'Sĩ Hiệu',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F19.5'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Huấn (P19.5)\nĐã mất'
    },
    {
      handle: 'P20.20',
      display_name: 'Nguyễn Sĩ Hiến',
      surname: 'Nguyễn',
      first_name: 'Sĩ Hiến',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F19.5'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Huấn (P19.5)\nĐã mất'
    },
    {
      handle: 'P20.21',
      display_name: 'Nguyễn Sĩ Hiệu (2)',
      surname: 'Nguyễn',
      first_name: 'Sĩ Hiệu',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F19.5'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Huấn (P19.5)\nĐã mất\n⚠️ Trùng tên với P20.19'
    },
    {
      handle: 'P20.22',
      display_name: 'Nguyễn Sĩ Hàm',
      surname: 'Nguyễn',
      first_name: 'Sĩ Hàm',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.5'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Huấn (P19.5)'
    },
    {
      handle: 'P20.23',
      display_name: 'Nguyễn Thị Luyến',
      surname: 'Nguyễn',
      first_name: 'Thị Luyến',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.5'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Huấn (P19.5)\nChồng: (ở chợ Bắc Ninh)'
    },

    // === NHÁNH 6: CHI 19.10 (NGUYỄN SĨ TƯƠNG) - 3 NGƯỜI ===
    {
      handle: 'P20.24',
      display_name: 'Nguyễn Sĩ Tuấn',
      surname: 'Nguyễn',
      first_name: 'Sĩ Tuấn',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.10'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Tương (P19.10)\nVợ: Phượng'
    },
    {
      handle: 'P20.25',
      display_name: 'Nguyễn Sĩ Tuyến',
      surname: 'Nguyễn',
      first_name: 'Sĩ Tuyến',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.10'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Tương (P19.10)\nVợ: Bình'
    },
    {
      handle: 'P20.26',
      display_name: 'Nguyễn Thị Thủy',
      surname: 'Nguyễn',
      first_name: 'Thị Thủy',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.10'],
      families: [],
      notes: 'Con của Nguyễn Sĩ Tương (P19.10)\nChồng: Thông'
    },

    // === NHÁNH 7: CHI 19.11 (NGUYỄN THỊ TƯỜNG) - 3 NGƯỜI (họ Bùi) ===
    {
      handle: 'P20.27',
      display_name: 'Bùi Chiến',
      surname: 'Bùi',
      first_name: 'Chiến',
      generation: 20,
      gender: 1,
      is_patrilineal: false,
      is_living: false,
      parent_families: [],
      families: [],
      notes: 'Cha: Bùi Văn Chén (chồng của P19.11)\nMẹ: P19.11 Nguyễn Thị Tường\nGhi chú: Liệt sĩ'
    },
    {
      handle: 'P20.28',
      display_name: 'Bùi ... Kiên',
      surname: 'Bùi',
      first_name: 'Kiên',
      generation: 20,
      gender: 1,
      is_patrilineal: false,
      is_living: true,
      parent_families: [],
      families: [],
      notes: 'Cha: Bùi Văn Chén (chồng của P19.11)\nMẹ: P19.11 Nguyễn Thị Tường\nVợ: Duyên'
    },
    {
      handle: 'P20.29',
      display_name: 'Bùi ... Quyết',
      surname: 'Bùi',
      first_name: 'Quyết',
      generation: 20,
      gender: 1,
      is_patrilineal: false,
      is_living: true,
      parent_families: [],
      families: [],
      notes: 'Cha: Bùi Văn Chén (chồng của P19.11)\nMẹ: P19.11 Nguyễn Thị Tường\nVợ: Vinh'
    },

    // === NHÁNH 8: CHI 19.12 (NGUYỄN SĨ TÍNH) - NHÁNH QUAN TRỌNG - 7 NGƯỜI ===
    {
      handle: 'P20.30',
      display_name: 'Nguyễn Sĩ Thắng - Phúc Lợi',
      surname: 'Nguyễn',
      first_name: 'Sĩ Thắng',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: false,
      parent_families: ['F19.12'],
      families: [],
      birth_year: 1955,
      birth_date: '1955-01-31',
      death_year: 2022,
      death_date: '2022-07-31',
      longevity: 67,
      notes: `Con của Nguyễn Sĩ Tính (P19.12)

Hiệu: Phúc Lợi

Thông tin sinh mất:
- Sinh: 31/01/1955 (8/01 Ất Mùi Âm lịch)
- Mất: 31/7/2022 (03/7 Nhâm Dần Âm lịch)
- Thọ: 67 tuổi

Vợ: Đinh Thị Dung (W20.30.1)
- Sinh: 1953
- Mất: 24/06/2021 (15/5 Tân Sửu Âm lịch)
- Hiệu: Diệu ...`
    },
    {
      handle: 'P20.31',
      display_name: 'Nguyễn Thị Kim Thúy',
      surname: 'Nguyễn',
      first_name: 'Thị Kim Thúy',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.12'],
      families: [],
      birth_year: 1957,
      birth_date: '1957-12-27',
      notes: `Con của Nguyễn Sĩ Tính (P19.12)

Sinh: 27/12/1957 (7/11 Đinh Dậu Âm lịch)

Chồng: Lưu Quang Hòa (sinh 1955)`
    },
    {
      handle: 'P20.32',
      display_name: 'Nguyễn Thị Thu',
      surname: 'Nguyễn',
      first_name: 'Thị Thu',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: false,
      parent_families: ['F19.12'],
      families: [],
      birth_year: 1960,
      birth_date: '1960-10-07',
      death_year: 2011,
      longevity: 51,
      notes: `Con của Nguyễn Sĩ Tính (P19.12)

Sinh: 07/10/1960 (27/8 Canh Tý Âm lịch)
Mất: 19/02/2011 Âm lịch
Thọ: 51 tuổi

Chồng: Nguyễn Khoa (SN 1961 – Quê Thị Cầu)`
    },
    {
      handle: 'P20.33',
      display_name: 'Nguyễn Thị Tuyết',
      surname: 'Nguyễn',
      first_name: 'Thị Tuyết',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.12'],
      families: [],
      birth_year: 1963,
      birth_date: '1963-07-28',
      notes: `Con của Nguyễn Sĩ Tính (P19.12)

Sinh: 28/7/1963 (8/6 Quý Mão Âm lịch)

Chồng: Nguyễn Ngọc Mến
- Sinh: 1964
- Mất: 29/10 Âm lịch
- Quê: Châm Khê, Phong Khê, TP Bắc Ninh`
    },
    {
      handle: 'P20.34',
      display_name: 'Nguyễn Sĩ Thuấn',
      surname: 'Nguyễn',
      first_name: 'Sĩ Thuấn',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.12'],
      families: [],
      birth_year: 1966,
      birth_date: '1966-03-29',
      notes: `Con của Nguyễn Sĩ Tính (P19.12)

Sinh: 29/3/1966

Vợ: Phạm Thu Hương
- Sinh: 1974
- Quê: P. Quang Trung, TP Thái Nguyên`
    },
    {
      handle: 'P20.35',
      display_name: 'Nguyễn Thị Đoan Trang',
      surname: 'Nguyễn',
      first_name: 'Thị Đoan Trang',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.12'],
      families: [],
      birth_year: 1969,
      birth_date: '1969-09-15',
      notes: `Con của Nguyễn Sĩ Tính (P19.12)

Sinh: 15/9/1969 (4/8 Kỷ Dậu Âm lịch)

Chồng: Nguyễn Văn Đĩnh
- Sinh: 1967
- Quê: Thị Cầu`
    },
    {
      handle: 'P20.36',
      display_name: 'Nguyễn Sỹ Tráng',
      surname: 'Nguyễn',
      first_name: 'Sỹ Tráng',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.12'],
      families: [],
      birth_year: 1972,
      birth_date: '1972-08-01',
      notes: `Con của Nguyễn Sĩ Tính (P19.12)

Sinh: 01/8/1972 (22/6 Nhâm Tý Âm lịch)

Vợ: Đinh Thị Minh Thuận (sinh 13/10/1979)`
    },

    // === NHÁNH 9: CHI 19.13 (NGUYỄN SĨ TƯỞNG) - 7 NGƯỜI ===
    {
      handle: 'P20.37',
      display_name: 'Nguyễn Thị Thanh',
      surname: 'Nguyễn',
      first_name: 'Thị Thanh',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.13'],
      families: [],
      birth_year: 1968,
      notes: 'Con của Nguyễn Sĩ Tưởng (P19.13)\nSinh: 1968\nChồng: Kỳ'
    },
    {
      handle: 'P20.38',
      display_name: 'Nguyễn Thị Trà',
      surname: 'Nguyễn',
      first_name: 'Thị Trà',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.13'],
      families: [],
      birth_year: 1971,
      notes: 'Con của Nguyễn Sĩ Tưởng (P19.13)\nSinh: 1971\nChồng: Thành'
    },
    {
      handle: 'P20.39',
      display_name: 'Nguyễn Thị Thảo',
      surname: 'Nguyễn',
      first_name: 'Thị Thảo',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.13'],
      families: [],
      birth_year: 1974,
      notes: 'Con của Nguyễn Sĩ Tưởng (P19.13)\nSinh: 1974\nChồng: Đăng'
    },
    {
      handle: 'P20.40',
      display_name: 'Nguyễn Thị Chinh',
      surname: 'Nguyễn',
      first_name: 'Thị Chinh',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.13'],
      families: [],
      birth_year: 1977,
      notes: 'Con của Nguyễn Sĩ Tưởng (P19.13)\nSinh: 1977\nChồng: Chức'
    },
    {
      handle: 'P20.41',
      display_name: 'Nguyễn Thị Chính (Lan)',
      surname: 'Nguyễn',
      first_name: 'Thị Chính',
      nick_name: 'Lan',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.13'],
      families: [],
      birth_year: 1979,
      notes: 'Con của Nguyễn Sĩ Tưởng (P19.13)\nSinh: 1979\nChồng: Huynh (quê Hải Dương)'
    },
    {
      handle: 'P20.42',
      display_name: 'Nguyễn Sĩ Tuân',
      surname: 'Nguyễn',
      first_name: 'Sĩ Tuân',
      generation: 20,
      gender: 1,
      is_patrilineal: true,
      is_living: true,
      parent_families: ['F19.13'],
      families: [],
      birth_year: 1981,
      notes: 'Con của Nguyễn Sĩ Tưởng (P19.13)\nSinh: 1981\nVợ: Nguyệt'
    },
    {
      handle: 'P20.43',
      display_name: 'Nguyễn Thị Luyến (2)',
      surname: 'Nguyễn',
      first_name: 'Thị Luyến',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: ['F19.13'],
      families: [],
      birth_year: 1983,
      notes: 'Con của Nguyễn Sĩ Tưởng (P19.13)\nSinh: 1983\n⚠️ Trùng tên với P20.23'
    },

    // === NHÁNH 10: CHI 19.15 (NGUYỄN THỊ TÍN) - 1 NGƯỜI (họ Lê) ===
    {
      handle: 'P20.44',
      display_name: 'Lê Thị Bình',
      surname: 'Lê',
      first_name: 'Thị Bình',
      generation: 20,
      gender: 0,
      is_patrilineal: false,
      is_living: true,
      parent_families: [],
      families: [],
      notes: 'Cha: Lê ... Bích (chồng của P19.15)\nMẹ: P19.15 Nguyễn Thị Tín'
    }
  ];

  let count = 0;
  for (const person of gen20People) {
    const result = await request('people', 'POST', person);
    if (result) {
      count++;
      const type = person.gender === 0 ? '(gái)' : '(trai)';
      const status = person.is_living ? '✓' : '✝';
      console.log(`   ${count}/44 ${status} ${person.handle}: ${person.display_name} ${type}`);
    }
  }

  console.log(`\n✅ Đã thêm xong ${count}/44 người Đời 20!`);

  // === BƯỚC 2: THÊM VỢ CHO ĐỜI 20 (chỉ thêm vợ quan trọng có thông tin đầy đủ) ===
  console.log('\n2. Thêm vợ quan trọng cho Đời 20...');

  const wife = {
    handle: 'W20.30.1',
    display_name: 'Đinh Thị Dung - Diệu ...',
    surname: 'Đinh',
    first_name: 'Thị Dung',
    generation: 20,
    gender: 0,
    is_patrilineal: false,
    is_living: false,
    parent_families: [],
    families: ['F20.30'],
    birth_year: 1953,
    death_year: 2021,
    death_date: '2021-06-24',
    longevity: 68,
    notes: `Vợ của Nguyễn Sĩ Thắng (P20.30)

Hiệu: Diệu ...

Sinh: 1953
Mất: 24/06/2021 (15/5 Tân Sửu Âm lịch)
Thọ: 68 tuổi`
  };

  const wResult = await request('people', 'POST', wife);
  if (wResult) {
    console.log(`   ✓ W20.30.1: ${wife.display_name}`);
  }

  // === BƯỚC 3: CẬP NHẬT FAMILIES ĐỜI 19 VỚI CHILDREN ===
  console.log('\n3. Cập nhật families Đời 19 với children Đời 20...');

  const familyUpdates = [
    { handle: 'F19.1', children: ['P20.1', 'P20.2', 'P20.3', 'P20.4', 'P20.5', 'P20.6'] },
    { handle: 'F19.2', children: ['P20.7', 'P20.8', 'P20.9', 'P20.10', 'P20.11'] },
    { handle: 'F19.5', children: ['P20.18', 'P20.19', 'P20.20', 'P20.21', 'P20.22', 'P20.23'] },
    { handle: 'F19.10', children: ['P20.24', 'P20.25', 'P20.26'] },
    { handle: 'F19.12', children: ['P20.30', 'P20.31', 'P20.32', 'P20.33', 'P20.34', 'P20.35', 'P20.36'] },
    { handle: 'F19.13', children: ['P20.37', 'P20.38', 'P20.39', 'P20.40', 'P20.41', 'P20.42', 'P20.43'] }
  ];

  for (const update of familyUpdates) {
    const result = await request(`families?handle=eq.${update.handle}`, 'PATCH', { children: update.children });
    if (result) {
      console.log(`   ✓ ${update.handle}: ${update.children.length} con`);
    }
  }

  // === KIỂM TRA KẾT QUẢ ===
  console.log('\n4. Kiểm tra kết quả...\n');

  const gen20 = await request('people?generation=eq.20&select=handle,display_name,gender,is_living,birth_year&order=handle');

  if (gen20) {
    console.log('=== THỐNG KÊ ĐỜI 20 ===');
    const males = gen20.filter(p => p.gender === 1);
    const females = gen20.filter(p => p.gender === 0);
    const living = gen20.filter(p => p.is_living);
    const deceased = gen20.filter(p => !p.is_living);

    console.log(`Tổng: ${gen20.length} người`);
    console.log(`  - Nam: ${males.length} người`);
    console.log(`  - Nữ: ${females.length} người`);
    console.log(`  - Còn sống: ${living.length} người`);
    console.log(`  - Đã mất: ${deceased.length} người`);

    console.log('\n=== PHÂN NHÁNH ===');
    console.log('Chi 19.1 (Khắc): P20.1-6 (6 người)');
    console.log('Chi 19.2 (Khâm): P20.7-11 (5 người)');
    console.log('Chi 19.3 (Khảng): P20.12-16 (5 người - họ ngoại)');
    console.log('Chi 19.4 (Nâu): P20.17 (1 người)');
    console.log('Chi 19.5 (Huấn): P20.18-23 (6 người)');
    console.log('Chi 19.10 (Tương): P20.24-26 (3 người)');
    console.log('Chi 19.11 (Tường): P20.27-29 (3 người - họ Bùi)');
    console.log('⭐ Chi 19.12 (Tính): P20.30-36 (7 người - NHÁNH QUAN TRỌNG)');
    console.log('Chi 19.13 (Tưởng): P20.37-43 (7 người)');
    console.log('Chi 19.15 (Tín): P20.44 (1 người - họ Lê)');
  }

  console.log('\n✅ HOÀN THÀNH! Đã thêm đầy đủ Đời 20 - ĐỜI CUỐI CÙNG.');
  console.log('💡 Tổng cộng: 20 đời từ Cụ Sư Húc (thủy tổ) đến Đời 20 hiện tại');
  console.log('🎉 Gia phả điện tử đã hoàn thiện từ Đời 1 đến Đời 20!');
}

main().catch(console.error);
