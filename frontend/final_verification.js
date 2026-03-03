/**
 * FINAL VERIFICATION: Kiểm tra toàn bộ cấu trúc Đời 1-5
 *
 * Mục đích: Đảm bảo cây gia phả liền mạch từ Đời 1 xuống Đời 5
 */

const SUPABASE_URL = 'https://miemdbqikmzxtekwivec.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZW1kYnFpa216eHRla3dpdmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMDQ1ODEsImV4cCI6MjA4NzU4MDU4MX0.VPmwz_PytzABux50MYFwIG55Vl-E4Cj8S2O5HLuDJek';

async function fetchData(endpoint) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}

async function verify() {
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║     🔍 KIỂM TRA TỔNG THỂ CÂY GIA PHẢ ĐỜI 1-5        ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  let hasError = false;
  const errors = [];
  const warnings = [];

  // ============================================================
  // ĐỜI 1: Cụ Sỹ Hy (P1.1)
  // ============================================================
  console.log('═══════════════════════════════════════════════════════');
  console.log('🌱 ĐỜI 1: Tổ Tiên');
  console.log('═══════════════════════════════════════════════════════\n');

  const p11 = await fetchData('people?handle=eq.P1.1&select=*');
  if (p11.length === 0) {
    errors.push('❌ P1.1 (Cụ Sỹ Hy) không tồn tại!');
    hasError = true;
  } else {
    const person = p11[0];
    console.log(`✓ P1.1: ${person.display_name}`);
    console.log(`  - Generation: ${person.generation}`);
    console.log(`  - Families: [${person.families?.join(', ') || 'EMPTY'}]`);
    console.log(`  - Parent families: [${person.parent_families?.join(', ') || 'NONE'}]`);

    if (!person.families || !person.families.includes('F1.1')) {
      errors.push('❌ P1.1 không có F1.1 trong families!');
      hasError = true;
    }
  }

  const f11 = await fetchData('families?handle=eq.F1.1&select=*');
  if (f11.length === 0) {
    errors.push('❌ F1.1 không tồn tại!');
    hasError = true;
  } else {
    const family = f11[0];
    console.log(`\n✓ F1.1: ${family.father_handle} + ${family.mother_handle}`);
    console.log(`  - Children: [${family.children?.join(', ') || 'EMPTY'}]`);

    if (family.father_handle !== 'P1.1') {
      errors.push('❌ F1.1 father_handle không phải P1.1!');
      hasError = true;
    }
    if (!family.children || !family.children.includes('P2.1')) {
      errors.push('❌ F1.1 không có P2.1 trong children!');
      hasError = true;
    }
  }

  // ============================================================
  // ĐỜI 2: Cụ Sỹ Kỳ (P2.1)
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🌿 ĐỜI 2: Con của Cụ Sỹ Hy');
  console.log('═══════════════════════════════════════════════════════\n');

  const p21 = await fetchData('people?handle=eq.P2.1&select=*');
  if (p21.length === 0) {
    errors.push('❌ P2.1 (Cụ Sỹ Kỳ) không tồn tại!');
    hasError = true;
  } else {
    const person = p21[0];
    console.log(`✓ P2.1: ${person.display_name}`);
    console.log(`  - Generation: ${person.generation}`);
    console.log(`  - Families: [${person.families?.join(', ') || 'EMPTY'}]`);
    console.log(`  - Parent families: [${person.parent_families?.join(', ') || 'EMPTY'}]`);

    if (!person.parent_families || !person.parent_families.includes('F1.1')) {
      errors.push('❌ P2.1 không có F1.1 trong parent_families!');
      hasError = true;
    }
    if (!person.families || !person.families.includes('F2.1')) {
      errors.push('❌ P2.1 không có F2.1 trong families!');
      hasError = true;
    }
  }

  const f21 = await fetchData('families?handle=eq.F2.1&select=*');
  if (f21.length === 0) {
    errors.push('❌ F2.1 không tồn tại!');
    hasError = true;
  } else {
    const family = f21[0];
    console.log(`\n✓ F2.1: ${family.father_handle} + ${family.mother_handle}`);
    console.log(`  - Children: [${family.children?.join(', ') || 'EMPTY'}]`);

    if (family.father_handle !== 'P2.1') {
      errors.push('❌ F2.1 father_handle không phải P2.1!');
      hasError = true;
    }
    if (!family.children || !family.children.includes('P3.1')) {
      errors.push('❌ F2.1 không có P3.1 trong children!');
      hasError = true;
    }
  }

  // ============================================================
  // ĐỜI 3: Cụ Lung (P3.1)
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🌳 ĐỜI 3: Cụ Lung (Đa thê - 2 vợ)');
  console.log('═══════════════════════════════════════════════════════\n');

  const p31 = await fetchData('people?handle=eq.P3.1&select=*');
  if (p31.length === 0) {
    errors.push('❌ P3.1 (Cụ Lung) không tồn tại!');
    hasError = true;
  } else {
    const person = p31[0];
    console.log(`✓ P3.1: ${person.display_name}`);
    console.log(`  - Generation: ${person.generation}`);
    console.log(`  - Families: [${person.families?.join(', ') || 'EMPTY'}]`);
    console.log(`  - Parent families: [${person.parent_families?.join(', ') || 'EMPTY'}]`);

    if (!person.parent_families || !person.parent_families.includes('F2.1')) {
      errors.push('❌ P3.1 không có F2.1 trong parent_families!');
      hasError = true;
    }
    if (!person.families || !person.families.includes('F3.1_W1') || !person.families.includes('F3.1_W2')) {
      errors.push('❌ P3.1 thiếu F3.1_W1 hoặc F3.1_W2 trong families!');
      hasError = true;
    }
  }

  // Check F3.1_W1
  const f31w1 = await fetchData('families?handle=eq.F3.1_W1&select=*');
  if (f31w1.length === 0) {
    errors.push('❌ F3.1_W1 không tồn tại!');
    hasError = true;
  } else {
    const family = f31w1[0];
    console.log(`\n✓ F3.1_W1: ${family.father_handle} + ${family.mother_handle}`);
    console.log(`  - Children: [${family.children?.join(', ') || 'EMPTY'}]`);

    if (family.father_handle !== 'P3.1') {
      errors.push('❌ F3.1_W1 father_handle không phải P3.1!');
      hasError = true;
    }
  }

  // Check F3.1_W2 (QUAN TRỌNG - đây là nhánh chính xuống Đời 4-5)
  const f31w2 = await fetchData('families?handle=eq.F3.1_W2&select=*');
  if (f31w2.length === 0) {
    errors.push('❌ F3.1_W2 không tồn tại!');
    hasError = true;
  } else {
    const family = f31w2[0];
    console.log(`\n✓ F3.1_W2: ${family.father_handle} + ${family.mother_handle} (NHÁNH CHÍNH)`);
    console.log(`  - Children: [${family.children?.join(', ') || 'EMPTY'}]`);

    if (family.father_handle !== 'P3.1') {
      errors.push('❌ F3.1_W2 father_handle không phải P3.1!');
      hasError = true;
    }

    // Check xem có đủ 10 con không
    const expectedChildren = ['P4.1', 'P4.2', 'P4.3', 'P4.4', 'P4.5', 'P4.6', 'P4.7', 'P4.Na', 'P4.Cam', 'P4.At'];
    const missingChildren = expectedChildren.filter(c => !family.children?.includes(c));

    if (missingChildren.length > 0) {
      errors.push(`❌ F3.1_W2 thiếu children: ${missingChildren.join(', ')}`);
      hasError = true;
    }
  }

  // ============================================================
  // ĐỜI 4: 7 con trai có con + 3 con gái không có con
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🌲 ĐỜI 4: Con của Cụ Lung');
  console.log('═══════════════════════════════════════════════════════\n');

  const gen4WithChildren = ['P4.1', 'P4.2', 'P4.3', 'P4.4', 'P4.5', 'P4.6', 'P4.7'];
  const gen4WithoutChildren = ['P4.Na', 'P4.Cam', 'P4.At', 'P4.Kiep', 'P4.Hoa'];

  console.log('7 con trai có con (sẽ sinh ra Đời 5):');
  for (const handle of gen4WithChildren) {
    const person = await fetchData(`people?handle=eq.${handle}&select=*`);
    if (person.length === 0) {
      errors.push(`❌ ${handle} không tồn tại!`);
      hasError = true;
      continue;
    }

    const p = person[0];
    const familyHandle = `F${handle.substring(1)}`;

    console.log(`  ✓ ${handle}: ${p.display_name}`);
    console.log(`    - Parent families: [${p.parent_families?.join(', ') || 'EMPTY'}]`);
    console.log(`    - Families: [${p.families?.join(', ') || 'EMPTY'}]`);

    if (!p.parent_families || !p.parent_families.includes('F3.1_W2')) {
      errors.push(`❌ ${handle} không có F3.1_W2 trong parent_families!`);
      hasError = true;
    }

    if (!p.families || !p.families.includes(familyHandle)) {
      errors.push(`❌ ${handle} không có ${familyHandle} trong families!`);
      hasError = true;
    }
  }

  console.log('\n5 con không có con cái:');
  for (const handle of gen4WithoutChildren) {
    const person = await fetchData(`people?handle=eq.${handle}&select=*`);
    if (person.length === 0) {
      warnings.push(`⚠️  ${handle} không tồn tại (có thể đã bị xóa nếu không cần)`);
      continue;
    }

    const p = person[0];
    console.log(`  ✓ ${handle}: ${p.display_name}`);
  }

  // ============================================================
  // ĐỜI 5: 7 người (từ 7 gia đình Đời 4)
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🌴 ĐỜI 5: Cháu của Cụ Lung');
  console.log('═══════════════════════════════════════════════════════\n');

  const gen5Mapping = {
    'P5.1': { parent: 'P4.1', family: 'F4.1', name: 'Cụ Củng Thuận' },
    'P5.2': { parent: 'P4.2', family: 'F4.2', name: 'Cụ Quản Liêu' },
    'P5.3': { parent: 'P4.3', family: 'F4.3', name: 'Cụ Đạo Giền' },
    'P5.4': { parent: 'P4.4', family: 'F4.4', name: 'Cụ Dũng Nghĩa' },
    'P5.5': { parent: 'P4.5', family: 'F4.5', name: 'Cụ Viên' },
    'P5.6': { parent: 'P4.6', family: 'F4.6', name: 'Cụ Kính' },
    'P5.7': { parent: 'P4.7', family: 'F4.7', name: 'Cụ Bá Tuấn' },
  };

  for (const [handle, info] of Object.entries(gen5Mapping)) {
    const person = await fetchData(`people?handle=eq.${handle}&select=*`);
    if (person.length === 0) {
      errors.push(`❌ ${handle} (${info.name}) không tồn tại!`);
      hasError = true;
      continue;
    }

    const p = person[0];
    console.log(`  ✓ ${handle}: ${p.display_name}`);
    console.log(`    - Parent families: [${p.parent_families?.join(', ') || 'EMPTY'}]`);
    console.log(`    - Expected parent: ${info.family}`);

    if (!p.parent_families || !p.parent_families.includes(info.family)) {
      errors.push(`❌ ${handle} không có ${info.family} trong parent_families!`);
      hasError = true;
    }

    // Verify family F4.x
    const family = await fetchData(`families?handle=eq.${info.family}&select=*`);
    if (family.length === 0) {
      errors.push(`❌ ${info.family} không tồn tại!`);
      hasError = true;
    } else {
      const f = family[0];
      if (f.father_handle !== info.parent) {
        errors.push(`❌ ${info.family} father_handle không phải ${info.parent}, mà là ${f.father_handle}!`);
        hasError = true;
      }
      if (!f.children || !f.children.includes(handle)) {
        errors.push(`❌ ${info.family} không có ${handle} trong children!`);
        hasError = true;
      }
    }
  }

  // ============================================================
  // CHECK XEM CÒN DATA CŨ TRÙNG LẶP KHÔNG
  // ============================================================
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🗑️  KIỂM TRA DỮ LIỆU CŨ TRÙNG LẶP');
  console.log('═══════════════════════════════════════════════════════\n');

  const oldHandles = ['P006', 'P007', 'P008', 'P009', 'P010', 'P011', 'P012', 'P013', 'P014', 'P015'];
  const remaining = await fetchData(`people?handle=in.(${oldHandles.join(',')})&select=handle`);

  if (remaining.length > 0) {
    errors.push(`❌ VẪN CÒN ${remaining.length} người cũ chưa xóa: ${remaining.map(p => p.handle).join(', ')}`);
    hasError = true;
  } else {
    console.log('✓ P006-P015 đã được xóa (không còn trùng lặp)');
  }

  const f004 = await fetchData('families?handle=eq.F004&select=handle');
  if (f004.length > 0) {
    errors.push('❌ F004 vẫn còn tồn tại (cần xóa)!');
    hasError = true;
  } else {
    console.log('✓ F004 đã được xóa (không còn family lỗi)');
  }

  const p003 = await fetchData('people?handle=eq.P003&select=handle');
  if (p003.length > 0) {
    errors.push('❌ P003 vẫn còn tồn tại (cần xóa hoặc đổi tên thành P3.1)!');
    hasError = true;
  } else {
    console.log('✓ P003 không tồn tại (đã dùng P3.1 thay thế)');
  }

  // ============================================================
  // FINAL SUMMARY
  // ============================================================
  console.log('\n\n╔═══════════════════════════════════════════════════════╗');
  console.log('║                   📊 TÓM TẮT KẾT QUẢ                  ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ ✅ ✅ HOÀN HẢO! CÂY GIA PHẢ LIỀN MẠCH TỪ ĐỜI 1-5! ✅ ✅ ✅\n');
    console.log('Cấu trúc:');
    console.log('  Đời 1: P1.1 (Cụ Sỹ Hy)');
    console.log('    └─ F1.1');
    console.log('       └─ Đời 2: P2.1 (Cụ Sỹ Kỳ)');
    console.log('          └─ F2.1');
    console.log('             └─ Đời 3: P3.1 (Cụ Lung)');
    console.log('                ├─ F3.1_W1 → 2 con (P4.Kiep, P4.Hoa)');
    console.log('                └─ F3.1_W2 → 10 con');
    console.log('                   ├─ P4.1 → F4.1 → Đời 5: P5.1');
    console.log('                   ├─ P4.2 → F4.2 → Đời 5: P5.2');
    console.log('                   ├─ P4.3 → F4.3 → Đời 5: P5.3');
    console.log('                   ├─ P4.4 → F4.4 → Đời 5: P5.4');
    console.log('                   ├─ P4.5 → F4.5 → Đời 5: P5.5');
    console.log('                   ├─ P4.6 → F4.6 → Đời 5: P5.6');
    console.log('                   ├─ P4.7 → F4.7 → Đời 5: P5.7');
    console.log('                   └─ 3 con gái: Na, Cam, Ất\n');
    console.log('🎉 BẠN CÓ THỂ MỞ UI ĐỂ XEM CÂY GIA PHẢ!');
    console.log('   cd frontend && npm run dev');
  } else {
    if (errors.length > 0) {
      console.log('❌ CÓ LỖI CẦN SỬA:\n');
      errors.forEach(err => console.log(`  ${err}`));
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  CẢNH BÁO:\n');
      warnings.forEach(warn => console.log(`  ${warn}`));
    }
  }

  console.log('\n═══════════════════════════════════════════════════════\n');
}

verify().catch(console.error);
