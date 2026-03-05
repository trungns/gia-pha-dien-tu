require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Must use SERVICE_ROLE_KEY to bypass RLS when inserting data
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
  // Wait, if no service role key, we mock user login or disable RLS temporarily
);

async function run() {
    // Check if RLS is blocking us (Anon Key without auth returns Error)
    const p5 = { handle: 'P5.1_test', display_name: 'Củng Thuận', generation: 5, gender: 1, is_patrilineal: true };
    const { error, data } = await sb.from('people').upsert(p5).select();
    console.log("Upsert Test:", error || data);
}
run();
