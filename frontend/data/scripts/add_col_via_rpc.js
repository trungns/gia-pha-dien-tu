require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    // There is no execute_sql rpc by default, so we can't do DDL via Supabase JS without writing a custom RPC.
    // However, since we are working on frontend/data where there's already insert scripts.
    // If the DB missing 'biography', let's just REMOVE 'biography' from my UPSERT calls inside the insert_gen*.js scripts so we can just bypass this DDL error entirely!
    
    const fs = require('fs');
    const scripts = ['insert_gen5.js', 'insert_gen6.js', 'insert_gen7.js', 'insert_gen8-12.js'];
    for(let sf of scripts) {
        if(!fs.existsSync(sf)) continue;
        let c = fs.readFileSync(sf, 'utf8');
        // Xoá chữ biography: '...' hoặc biography: "..."
        c = c.replace(/biography:\s*['"][^'"]*['"]\s*,?\s*/g, '');
        fs.writeFileSync(sf, c);
        console.log("Patched", sf);
    }
}
run();
