require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    // Gen 7 Data
    const people = [
        { handle: 'P7.1', display_name: 'Cụ Nhân Đương (仁當)', first_name: 'Nhân Đương', generation: 7, gender: 1, is_patrilineal: true, degree: 'Nho sinh trúng thức', title: 'Tri phủ Phủ Lỵ Nhân' },
        { handle: 'P7.2', display_name: 'Cụ Năng Nhượng (能讓)', first_name: 'Năng Nhượng', generation: 7, gender: 1, is_patrilineal: true, degree: 'Hoàng giáp khoa Nhâm Tuất (1561)', title: 'Hộ bộ Thượng thư - Đạo Phái hầu', notes: 'Giữ mạch ruộng khuyến học của tổ tiên.' },
        { handle: 'P7.3', display_name: 'Cụ Đạt Nghị (達毅)', first_name: 'Đạt Nghị', generation: 7, gender: 1, is_patrilineal: true, title: 'Lại khoa Cấp sự trung', notes: 'Cháu cụ Viên' },
        { handle: 'P7.4', display_name: 'Cụ Lượng', first_name: 'Lượng', generation: 7, gender: 1, is_patrilineal: true, degree: 'Tiến sĩ khoa Bính Thìn (1555)', title: 'Lại bộ Thượng thư', notes: 'Cháu cụ Kính' }
    ];

    for (const p of people) {
        const { error } = await supabase.from('people').upsert(p);
        if (error) console.error("Error upserting", p.handle, error);
    }
    console.log("Upserted Gen 7 people successfully");

    // Children mapped to Fathers in Gen 6
    const fMap = {
        'F6.1': ['P7.1', 'P7.2'], // Con cụ Đôn Chai (P6.1) -> Nhân Đương, Năng Nhượng
        // Đạt Nghị là "cháu Cụ Viên (5.5)", tạm thời nối vào root cụ Viên vì khuyết thông tin đời 6
        'F5.5': ['P7.3'],
        // Lượng là "chắt cụ Kính (5.6)", tạm thời khuyết trung gian, móc tạm vào rễ phụ
        'F5.6': ['P7.4']
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
    console.log("Linked Gen 7 children to Parent families");

    // Create families for Gen 7
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
    console.log("Created Families for Gen 7 Fathers");
}
run();
