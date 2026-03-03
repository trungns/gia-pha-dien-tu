/**
 * Script: Sửa lỗi với Service Role Key (full quyền)
 */

const SUPABASE_URL = 'https://miemdbqikmzxtekwivec.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZW1kYnFpa216eHRla3dpdmVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAwNDU4MSwiZXhwIjoyMDg3NTgwNTgxfQ.LAZBgsuOsGs02xmoBqcplTRWJTgxZALgMf1C3cVhD6Q';

async function request(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  console.log(`   ${method} ${url}`);

  const response = await fetch(url, options);

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : null;
  } catch (e) {
    result = text;
  }

  if (!response.ok) {
    console.error(`   ❌ HTTP ${response.status}:`, result);
    throw new Error(`HTTP ${response.status}: ${JSON.stringify(result)}`);
  }

  console.log(`   ✓ Success:`, result);
  return result;
}

async function fix() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔧 SỬA LỖI VỚI SERVICE ROLE KEY');
  console.log('═══════════════════════════════════════════════════════\n');

  // Step 1: Update F4.1-F4.7
  console.log('📋 BƯỚC 1: Cập nhật F4.1-F4.7');
  console.log('─────────────────────────────────────────────────────\n');

  const familyMapping = {
    'F4.1': 'P4.1',
    'F4.2': 'P4.2',
    'F4.3': 'P4.3',
    'F4.4': 'P4.4',
    'F4.5': 'P4.5',
    'F4.6': 'P4.6',
    'F4.7': 'P4.7',
  };

  for (const [familyHandle, newFather] of Object.entries(familyMapping)) {
    console.log(`\n🔄 ${familyHandle} → father_handle = ${newFather}`);
    try {
      await request(
        `families?handle=eq.${familyHandle}`,
        'PATCH',
        { father_handle: newFather }
      );
    } catch (error) {
      console.error(`❌ Lỗi:`, error.message);
    }
  }

  // Step 2: Delete P006-P015
  console.log('\n\n📋 BƯỚC 2: Xóa P006-P015');
  console.log('─────────────────────────────────────────────────────\n');

  const oldHandles = ['P006', 'P007', 'P008', 'P009', 'P010', 'P011', 'P012', 'P013', 'P014', 'P015'];

  for (const handle of oldHandles) {
    console.log(`\n🗑️  Xóa ${handle}`);
    try {
      await request(`people?handle=eq.${handle}`, 'DELETE');
    } catch (error) {
      console.error(`❌ Lỗi:`, error.message);
    }
  }

  // Step 3: Delete F004
  console.log('\n\n📋 BƯỚC 3: Xóa F004');
  console.log('─────────────────────────────────────────────────────\n');

  console.log(`\n🗑️  Xóa F004`);
  try {
    await request('families?handle=eq.F004', 'DELETE');
  } catch (error) {
    console.error(`❌ Lỗi:`, error.message);
  }

  console.log('\n\n═══════════════════════════════════════════════════════');
  console.log('✅ HOÀN THÀNH!');
  console.log('═══════════════════════════════════════════════════════\n');
}

fix().catch(console.error);
