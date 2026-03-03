/**
 * Script: Sửa lỗi trùng lặp Đời 4 và liên kết F4.x đúng
 *
 * Vấn đề:
 * - P006-P015 (Đời 4 cũ) trùng với P4.1-P4.7 (Đời 4 mới)
 * - F004 trỏ đến P003 (không tồn tại) → floating tree
 * - F4.1-F4.7 đang trỏ đến P006-P015 thay vì P4.1-P4.7
 *
 * Giải pháp:
 * 1. Cập nhật F4.1-F4.7: father_handle từ P006-P015 → P4.1-P4.7
 * 2. Xóa P006-P015
 * 3. Xóa F004
 */

const SUPABASE_URL = 'https://miemdbqikmzxtekwivec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZW1kYnFpa216eHRla3dpdmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDQ1ODEsImV4cCI6MjA4NzU4MDU4MX0.VPmwz_PytzABux50MYFwIG55Vl-E4Cj8S2O5HLuDJek';

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }

  return response.json();
}

async function fix() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔧 SỬA LỖI TRÙNG LẶP ĐỜI 4 VÀ LIÊN KẾT F4.x');
  console.log('═══════════════════════════════════════════════════════\n');

  // Mapping: P006-P015 → P4.1-P4.7
  const mapping = {
    'P006': 'P4.1',  // Cụ Duyên
    'P007': 'P4.2',  // Cụ Nhân Chù
    'P009': 'P4.3',  // Cụ Nhân Bị (chú ý: P008 và P009 đổi chỗ trong data!)
    'P008': 'P4.4',  // Cụ Nhân Bồng
    'P012': 'P4.5',  // Cụ Nhân Thiếp
    'P010': 'P4.6',  // Cụ Nhân Giữ
    'P011': 'P4.7',  // Cụ Nhân Đạc
  };

  // Mapping family: F4.x → father_handle mới
  const familyMapping = {
    'F4.1': 'P4.1',
    'F4.2': 'P4.2',
    'F4.3': 'P4.3',
    'F4.4': 'P4.4',
    'F4.5': 'P4.5',
    'F4.6': 'P4.6',
    'F4.7': 'P4.7',
  };

  console.log('📋 BƯỚC 1: Cập nhật F4.1-F4.7 với father_handle mới');
  console.log('─────────────────────────────────────────────────────');

  for (const [familyHandle, newFather] of Object.entries(familyMapping)) {
    try {
      console.log(`\n🔄 Cập nhật ${familyHandle}: father_handle → ${newFather}`);

      const result = await request(
        `families?handle=eq.${familyHandle}`,
        'PATCH',
        { father_handle: newFather }
      );

      console.log(`✓ ${familyHandle} đã cập nhật thành công`);
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật ${familyHandle}:`, error.message);
    }
  }

  console.log('\n\n📋 BƯỚC 2: Xóa P006-P015 (data trùng lặp cũ)');
  console.log('─────────────────────────────────────────────────────');

  const oldHandles = ['P006', 'P007', 'P008', 'P009', 'P010', 'P011', 'P012', 'P013', 'P014', 'P015'];

  for (const handle of oldHandles) {
    try {
      console.log(`\n🗑️  Xóa ${handle}...`);

      await request(
        `people?handle=eq.${handle}`,
        'DELETE'
      );

      console.log(`✓ ${handle} đã xóa`);
    } catch (error) {
      console.error(`❌ Lỗi khi xóa ${handle}:`, error.message);
    }
  }

  console.log('\n\n📋 BƯỚC 3: Xóa F004 (family lỗi)');
  console.log('─────────────────────────────────────────────────────');

  try {
    console.log(`\n🗑️  Xóa F004...`);

    await request(
      'families?handle=eq.F004',
      'DELETE'
    );

    console.log(`✓ F004 đã xóa`);
  } catch (error) {
    console.error(`❌ Lỗi khi xóa F004:`, error.message);
  }

  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('✅ HOÀN THÀNH! Kiểm tra lại database...');
  console.log('═══════════════════════════════════════════════════════\n');

  // Verify
  console.log('📊 KIỂM TRA LẠI CẤU TRÚC:');
  console.log('─────────────────────────────────────────────────────\n');

  // Check F4.x
  for (const familyHandle of Object.keys(familyMapping)) {
    const family = await request(`families?handle=eq.${familyHandle}&select=*`);
    if (family.length > 0) {
      const f = family[0];
      console.log(`✓ ${familyHandle}: father=${f.father_handle}, children=[${f.children?.join(', ') || ''}]`);
    }
  }

  // Check if P006-P015 gone
  console.log('\n\nKiểm tra P006-P015 đã bị xóa:');
  const remaining = await request(`people?handle=in.(P006,P007,P008,P009,P010,P011,P012,P013,P014,P015)&select=handle`);
  if (remaining.length === 0) {
    console.log('✓ Tất cả P006-P015 đã được xóa');
  } else {
    console.log(`⚠️  Còn ${remaining.length} người chưa xóa:`, remaining.map(p => p.handle));
  }

  // Check if F004 gone
  console.log('\nKiểm tra F004 đã bị xóa:');
  const f004 = await request('families?handle=eq.F004&select=handle');
  if (f004.length === 0) {
    console.log('✓ F004 đã được xóa');
  } else {
    console.log('⚠️  F004 vẫn còn tồn tại!');
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🎉 CÂY GIA PHẢ BÂY GIỜ NÊN LIỀN MẠCH TỪ ĐỜI 1-5!');
  console.log('═══════════════════════════════════════════════════════\n');
}

fix().catch(console.error);
