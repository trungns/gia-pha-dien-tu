/**
 * Check P7.1 data
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

async function check() {
  console.log('Checking P7.1 data...\n');

  const p71 = await fetchData('people?handle=eq.P7.1&select=*');

  if (p71.length === 0) {
    console.log('❌ P7.1 không tồn tại!');
    return;
  }

  const person = p71[0];
  console.log('P7.1 Data:');
  console.log('  Handle:', person.handle);
  console.log('  Display name:', person.display_name);
  console.log('  Generation:', person.generation);
  console.log('  Is living:', person.is_living);
  console.log('  Families:', person.families);
  console.log('  Parent families:', person.parent_families);
  console.log('  Notes length:', person.notes?.length || 0, 'characters');
  console.log('  Notes preview:', person.notes?.substring(0, 200) || 'N/A');
}

check().catch(console.error);
