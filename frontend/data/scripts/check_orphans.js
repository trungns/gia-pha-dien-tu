const SUPABASE_URL = 'https://miemdbqikmzxtekwivec.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pZW1kYnFpa216eHRla3dpdmVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjAwNDU4MSwiZXhwIjoyMDg3NTgwNTgxfQ.LAZBgsuOsGs02xmoBqcplTRWJTgxZALgMf1C3cVhD6Q';

async function check() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/people?is_patrilineal=eq.true&select=handle,display_name,generation,parent_families&order=generation,handle`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
    }
  });
  const data = await res.json();

  console.log('=== NGƯỜI KHÔNG CÓ PARENT_FAMILIES (orphans) ===\n');
  const orphans = data.filter(p => !p.parent_families || p.parent_families.length === 0);

  console.log(`Tổng: ${orphans.length} người\n`);
  orphans.forEach((p, i) => {
    console.log(`${i+1}. ${p.handle}: ${p.display_name} (Gen ${p.generation})`);
  });
}
check();
