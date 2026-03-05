require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    console.log("Starting DB Cleanup...");
    
    // 1. Nullify mother_handle in F4.x and F5.x
    const fhandles = [];
    for(let i=1; i<=7; i++) fhandles.push(`F4.${i}`, `F5.${i}`);
    
    const { error: fErr } = await sb.from('families')
        .update({ mother_handle: null })
        .in('handle', fhandles);
    if(fErr) console.error("Error updating families:", fErr);

    // 2. Delete W4.x and W5.x
    const whandles = [];
    for(let i=1; i<=7; i++) whandles.push(`W4.${i}`, `W5.${i}`);
    
    const { error: pErr } = await sb.from('people')
        .delete()
        .in('handle', whandles);
    if(pErr) console.error("Error deleting wives:", pErr);
    
    // 3. Update P006 Quyên -> Duyên
    const { error: nErr } = await sb.from('people')
        .update({ display_name: 'Cụ Duyên', first_name: 'Duyên' })
        .eq('handle', 'P006');
    if(nErr) console.error("Error updating P006:", nErr);

    console.log("DB Cleanup completed successfully.");
}
run();
