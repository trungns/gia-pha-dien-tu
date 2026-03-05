require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const p5 = { handle: 'P5.1', display_name: 'Cụ Củng Thuận (拱順)', first_name: 'Củng Thuận', generation: 5, gender: 1, is_patrilineal: true };
    const { error } = await sb.from('people').upsert(p5);
    console.log("Upsert 1 node test error:", error);
}
run();
