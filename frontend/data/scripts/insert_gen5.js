require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const people = [
        { handle: 'P5.1', display_name: 'Cụ Củng Thuận (拱順)', first_name: 'Củng Thuận', generation: 5, gender: 1, is_patrilineal: true, title: 'Lại bộ Tả thị lang - Thái bảo Chung Khánh bá', degree: 'Tiến sĩ khoa Bính Thìn (1496)', notes: 'Ao khuyến học/ao gối ~8 sào, Chỗ Đột xứ (gần Kim Khê), cống cụt gần đình thôn Phú Xuân; giỗ 13/7 ÂL', },
        { handle: 'P5.2', display_name: 'Cụ Quản Liêu (均僚)', first_name: 'Quản Liêu', generation: 5, gender: 1, is_patrilineal: true, title: 'Lễ bộ Hữu thị lang, chưởng Hàn lâm viện sự', },
        { handle: 'P5.3', display_name: 'Cụ Đạo Giền (道演)', first_name: 'Đạo Giền', generation: 5, gender: 1, is_patrilineal: true, title: 'Hiến sát sứ', degree: 'Tiến sĩ khoa Bính Thìn (1496)', },
        { handle: 'P5.4', display_name: 'Cụ Dũng Nghĩa', first_name: 'Dũng Nghĩa', generation: 5, gender: 1, is_patrilineal: true, title: 'Công bộ Thượng thư, Giám sát Ngự sử', degree: 'Hoàng giáp khoa Quý Sửu (1493)', },
        { handle: 'P5.5', display_name: 'Cụ Viên (勛)', first_name: 'Viên', generation: 5, gender: 1, is_patrilineal: true, title: 'Lễ bộ Thượng thư, Tặng Thái bảo', degree: 'Bảng nhãn khoa Bính Thìn (1496)', notes: 'Từng được gọi là quan Tam nguyên (đỗ đầu cả Hương, Hội, Đình)', },
        { handle: 'P5.6', display_name: 'Cụ Kính (敬)', first_name: 'Kính', generation: 5, gender: 1, is_patrilineal: true, title: 'Binh bộ Thượng thư', degree: 'Tiến sĩ khoa Bính Thìn (1496)', notes: 'Hai lần đi sứ Tàu', },
        { handle: 'P5.7', display_name: 'Cụ Bá Tuấn (伯俊)', first_name: 'Bá Tuấn', generation: 5, gender: 1, is_patrilineal: true, title: 'Hiến sát sứ Thái Nguyên', degree: 'Tiến sĩ khoa Canh Tuất (1490)', }
    ];

    for (const p of people) {
        const { error } = await supabase.from('people').upsert(p);
        if (error) console.error("Error upserting", p.handle, error);
    }
    
    console.log("Upserted 7 people successfully");

    // Add 5.1-5.7 to their parent families
    const fMap = {
        'F4.1': 'P5.1',
        'F4.2': 'P5.2',
        'F4.4': 'P5.3',
        'F4.3': 'P5.4',
        'F4.7': 'P5.5',
        'F4.5': 'P5.6',
        'F4.6': 'P5.7'
    };

    for (const [fHandle, child] of Object.entries(fMap)) {
        const { data: famData } = await supabase.from('families').select('children').eq('handle', fHandle).single();
        if (famData) {
            const ch = new Set(famData.children || []);
            ch.add(child);
            await supabase.from('families').update({ children: Array.from(ch) }).eq('handle', fHandle);
        }

        const { data: pData } = await supabase.from('people').select('parent_families').eq('handle', child).single();
        if (pData) {
            const pF = new Set(pData.parent_families || []);
            pF.add(fHandle);
            await supabase.from('people').update({ parent_families: Array.from(pF) }).eq('handle', child);
        }
    }
    console.log("Linked Gen 5 children to Gen 4 Parent families");

    // Create families for Gen 5
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
    console.log("Created Families for Gen 5 Fathers");
}
run();
