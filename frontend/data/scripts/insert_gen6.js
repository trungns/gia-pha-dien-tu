require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    // Gen 6 Data
    const people = [
        { handle: 'P6.1', display_name: 'Cụ Đôn Chai (鈍齋)', first_name: 'Đôn Chai', generation: 6, gender: 1, is_patrilineal: true, degree: 'Nho sinh trúng thức', notes: 'Ruộng này để thưởng con cháu ai kế khoa nhận. Về sau đạc thành 33 thửa.' },
        { handle: 'P6.2', display_name: 'Cụ Thân Gia (仁家)', first_name: 'Thân Gia', generation: 6, gender: 1, is_patrilineal: true, title: 'Lại bộ Tả thị lang - Thái bảo - Lại Giang bá', },
        { handle: 'P6.3', display_name: 'Cụ Tấn', first_name: 'Tấn', generation: 6, gender: 1, is_patrilineal: true, }
    ];

    for (const p of people) {
        const { error } = await supabase.from('people').upsert(p);
        if (error) console.error("Error upserting", p.handle, error);
    }
    console.log("Upserted Gen 6 people successfully");

    // Children mapped to Fathers in Gen 5
    const fMap = {
        'F5.1': ['P6.1', 'P6.2'], // Con cụ Củng Thuận (P5.1) -> Đôn Chai, Thân Gia
        'F5.3': ['P6.3']          // Con cụ Đạo Giền (P5.3) -> Tấn
    };

    for (const [fHandle, children] of Object.entries(fMap)) {
        const { data: famData } = await supabase.from('families').select('children').eq('handle', fHandle).single();
        if (famData) {
            const ch = new Set(famData.children || []);
            children.forEach(c => ch.add(c));
            await supabase.from('families').update({ children: Array.from(ch) }).eq('handle', fHandle);
        }

        for (const child of children) {
            const { data: pData } = await supabase.from('people').select('parent_families').eq('handle', child).single();
            if (pData) {
                const pF = new Set(pData.parent_families || []);
                pF.add(fHandle);
                await supabase.from('people').update({ parent_families: Array.from(pF) }).eq('handle', child);
            }
        }
    }
    console.log("Linked Gen 6 children to Gen 5 Parent families");

    // Create families for Gen 6
    for (const p of people) {
        let fHandle = p.handle.replace('P', 'F');
        await supabase.from('families').upsert({ handle: fHandle, father_handle: p.handle, children: [] });
        
        const { data: pData } = await supabase.from('people').select('families').eq('handle', p.handle).single();
        if (pData) {
            const fms = new Set(pData.families || []);
            fms.add(fHandle);
            await supabase.from('people').update({ families: Array.from(fms) }).eq('handle', p.handle);
        }
    }
    console.log("Created Families for Gen 6 Fathers");
}
run();
