require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    // Gen 8 to 12 Data
    let people = [];
    
    // Gen 8
    people.push({ handle: 'P8.1', display_name: 'Cụ Quân (秉均)', first_name: 'Quân', generation: 8, gender: 1, is_patrilineal: true, title: 'Nho sinh trúng thức', });
    
    // Gen 9
    people.push({ handle: 'P9.1', display_name: 'Cụ Tô (Bô)', first_name: 'Tô', generation: 9, gender: 1, is_patrilineal: true, title: 'Tri huyện Thượng Nhỡn - Trực Trai', });
    
    // Gen 10
    people.push({ handle: 'P10.1', display_name: 'Cụ Bao (Chất Trực)', first_name: 'Bao', generation: 10, gender: 1, is_patrilineal: true, title: 'Tri huyện Phú Lương', });
    
    // Gen 11
    people.push({ handle: 'P11.1', display_name: 'Cụ Đức Phương (德芳)', first_name: 'Đức Phương', generation: 11, gender: 1, is_patrilineal: true, title: 'Nho sinh trúng thức' });
    people.push({ handle: 'P11.2', display_name: 'Cụ Quốc Quang (sau đổi là Anh - 瑛)', first_name: 'Quốc Quang', generation: 11, gender: 1, is_patrilineal: true, degree: 'Tiến sĩ khoa Canh Thìn (1700)', title: 'Đại lý tự khanh - Tu thận Doãn - Tham chính sứ Nghệ An', notes: 'Nhánh đại khoa, phát triển cực thịnh.' });
    
    // Gen 12 (Con cụ Quốc Quang 11.2)
    people.push({ handle: 'P12.1', display_name: 'Cụ Quốc Thiệp', first_name: 'Quốc Thiệp', generation: 12, gender: 1, is_patrilineal: true, title: 'Tri huyện Quế Dương', degree: 'Nho sinh trúng thức' });
    people.push({ handle: 'P12.2', display_name: 'Cụ Quốc Tuân', first_name: 'Quốc Tuân', generation: 12, gender: 1, is_patrilineal: true, title: 'Tri huyện Chí Linh - Tước Kim Xuyên Bá', degree: 'Nho sinh trúng thức' });
    people.push({ handle: 'P12.3', display_name: 'Cụ Thiếu Thực (孝直)', first_name: 'Thiếu Thực', generation: 12, gender: 1, is_patrilineal: true, title: 'Nho sinh trúng thức' });
    people.push({ handle: 'P12.4', display_name: 'Cụ Quốc Diệu (國雅)', first_name: 'Quốc Diệu', generation: 12, gender: 1, is_patrilineal: true, title: 'Tri huyện Đông An', degree: 'Nho sinh trúng thức' });
    people.push({ handle: 'P12.5', display_name: 'Cụ Quốc Dương', first_name: 'Quốc Dương', generation: 12, gender: 1, is_patrilineal: true, title: 'Lâm cục Nho sinh' });
    people.push({ handle: 'P12.6', display_name: 'Cụ Quốc Hạo', first_name: 'Quốc Hạo', generation: 12, gender: 1, is_patrilineal: true, title: 'Tri huyện Hữu Lũng', degree: 'Nho sinh trúng thức', });

    for (const p of people) {
        const { error } = await supabase.from('people').upsert(p);
        if (error) console.error("Error upserting", p.handle, error);
    }
    console.log("Upserted Gen 8-12 people successfully");

    // Families map
    const fMap = {
        'F7.1': ['P8.1'], // Cụ Thân Đương (7.1) -> Quân
        'F8.1': ['P9.1'], // Cụ Quân (8.1) -> Cụ Bô / Tô
        'F9.1': ['P10.1'],// Cụ Tô (9.1) -> Cụ Bao
        'F10.1': ['P11.1', 'P11.2'], // Cụ Bao (10.1) -> Đức Phương, Quốc Quang
        'F11.2': ['P12.1', 'P12.2', 'P12.3', 'P12.4', 'P12.5', 'P12.6'] // Con cụ Quốc Quang
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
    console.log("Linked Gen 8-12 children to Parent families");

    // Families Creation
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
    console.log("Created Families for Gen 8-12 Fathers");
}
run();
