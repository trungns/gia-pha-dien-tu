require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    // 1. DELETE ANY LEFTOVER GEN 5, 6+
    console.log("Cleaning up Gen 5+...");
    const { data: gen5plus } = await sb.from('people').select('handle').gte('generation', 5);
    if (gen5plus && gen5plus.length > 0) {
        const handles = gen5plus.map(p => p.handle);
        await sb.from('people').delete().in('handle', handles);
        await sb.from('families').delete().in('father_handle', handles);
        await sb.from('families').delete().in('mother_handle', handles);
        console.log(`Deleted ${handles.length} people and their families.`);
    }

    // Also delete any existing Gen 4 families we created before
    const { data: fams } = await sb.from('families').select('handle, father_handle').in('father_handle', ['P006','P007','P008','P009','P010','P011','P012']);
    if (fams && fams.length > 0) {
        const fhandles = fams.map(f => f.handle);
        await sb.from('families').delete().in('handle', fhandles);
    }
    // Delete any 'Khuyết danh' wives from Gen 4
    await sb.from('people').delete().like('handle', 'W4.%');

    // MAPPING FATHERS (Gen 4) TO SONS (Gen 5)
    // 5.1 Củng Thuận -> P006 (Quyên alias Duyên)
    // 5.2 Quản Liêu -> P007 (Nhân Chù)
    // 5.3 Đạo Giền -> P009 (Nhân Bồng)
    // 5.4 Dũng Nghĩa -> P008 (Nhân Bị)
    // 5.5 Viên -> P012 (Nhân Đạc)
    // 5.6 Kính -> P010 (Nhân Thiếp)
    // 5.7 Bá Tuấn -> P011 (Nhân Giữ alias Thân Dư)
    
    const gen4_fathers = [
        { g5_idx: 1, g4_handle: 'P006' },
        { g5_idx: 2, g4_handle: 'P007' },
        { g5_idx: 3, g4_handle: 'P009' },
        { g5_idx: 4, g4_handle: 'P008' },
        { g5_idx: 5, g4_handle: 'P012' },
        { g5_idx: 6, g4_handle: 'P010' },
        { g5_idx: 7, g4_handle: 'P011' }
    ];

    // CREATE WIVES FOR GEN 4 AND FAMILIES FOR GEN 4
    for(const item of gen4_fathers) {
        const wifeHandle = `W4.${item.g5_idx}`;
        const famHandle = `F4.${item.g5_idx}`;
        const childHandle = `P5.${item.g5_idx}`; // Gen 5 son

        // Insert Wife 4
        await sb.from('people').upsert({
            handle: wifeHandle, display_name: `Cụ Bà (Vợ cụ ${item.g4_handle})`, gender: 2, generation: 4, is_patrilineal: false, notes: 'Chưa rõ họ tên'
        });

        // Insert Family 4
        await sb.from('families').upsert({
            handle: famHandle, father_handle: item.g4_handle, mother_handle: wifeHandle, children: [childHandle]
        });

        // Update Gen 4 Father to have this family
        const { data: p4 } = await sb.from('people').select('families').eq('handle', item.g4_handle).single();
        if(p4) {
            const fms = new Set(p4.families || []);
            fms.add(famHandle);
            await sb.from('people').update({ families: Array.from(fms) }).eq('handle', item.g4_handle);
        }

        // Update Gen 4 Mother to have this family
        await sb.from('people').update({ families: [famHandle] }).eq('handle', wifeHandle);
    }
    console.log("Created Gen 4 Wives and Families linked to Gen 5 sons.");

    // CREATE GEN 5 PEOPLE
    const fathers = [
        {
            handle: 'P5.1', display_name: 'Cụ Củng Thuận (拱順)', first_name: 'Củng Thuận', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Lại bộ Tả thị lang, Thái bảo Chung Khánh bá', degree: 'Tiến sĩ khoa Bính Thìn (1496)',
            notes: 'Cụ 25 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), làm quan chức Lại bộ Tả Thị lang, phong Thái bảo Chung Khánh bá. Lập "ao khuyến học" 8 sào vực Chỗ Đột xứ. (Là con cụ Duyên - P006).',
            parent_families: ['F4.1']
        },
        {
            handle: 'P5.2', display_name: 'Cụ Quản Liêu (均僚)', first_name: 'Quản Liêu', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Lễ bộ Hữu thị lang, chưởng Hàn lâm viện sự',
            notes: 'Làm quan đến Lễ bộ Hữu thị lang, kiêm quản việc Hàn lâm viện (chưởng Hàn lâm viện sự). (Con cụ Nhân Chù).',
            parent_families: ['F4.2']
        },
        {
            handle: 'P5.3', display_name: 'Cụ Đạo Giền (道演)', first_name: 'Đạo Giền', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Hiến sát sứ', degree: 'Tiến sĩ khoa Bính Thìn (1496)',
            notes: 'Cụ 29 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), làm quan đến Hiến sát sứ. (Con cụ Nhân Bồng).',
            parent_families: ['F4.3']
        },
        {
            handle: 'P5.4', display_name: 'Cụ Dũng Nghĩa', first_name: 'Dũng Nghĩa', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Công bộ Thượng thư, Giám sát Ngự sử', degree: 'Hoàng giáp khoa Quý Sửu (1493)',
            notes: 'Cụ 19 tuổi đỗ Hoàng giáp khoa Quý Sửu (1493), làm quan đến Công bộ Thượng thư, kiêm Giám sát Ngự sử. (Con cụ Nhân Bị).',
            parent_families: ['F4.4']
        },
        {
            handle: 'P5.5', display_name: 'Cụ Viên (勛)', first_name: 'Viên', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Lễ bộ Thượng thư, Thái bảo', degree: 'Bảng nhãn khoa Bính Thìn (1496)',
            notes: 'Cụ 21 tuổi đỗ Bảng nhãn khoa Bính Thìn (1496), làm quan Lễ bộ Thượng thư, Thái bảo. Đỗ đầu Hương, Hội, Đình (Tam nguyên). Suýt đỗ Trạng nguyên. (Con cụ Nhân Đạc).',
            parent_families: ['F4.5']
        },
        {
            handle: 'P5.6', display_name: 'Cụ Kính (敬)', first_name: 'Kính', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Binh bộ Thượng thư', degree: 'Tiến sĩ khoa Bính Thìn (1496)',
            notes: 'Cụ 18 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), quan Binh bộ Thượng thư. Đi sứ Tàu. Thực đỗ Thám hoa nhưng bị hạ ngạch. (Con cụ Nhân Thiếp).',
            parent_families: ['F4.6']
        },
        {
            handle: 'P5.7', display_name: 'Cụ Bá Tuấn (伯俊)', first_name: 'Bá Tuấn', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Hiến sát sứ Thái Nguyên', degree: 'Tiến sĩ khoa Canh Tuất (1490)',
            notes: 'Cụ 22 tuổi đỗ Tiến sĩ khoa Canh Tuất (1490), làm quan đến Hiến sát sứ Thái Nguyên. (Con cụ Thân Dư - Nhân Giữ).',
            parent_families: ['F4.7']
        }
    ];

    for(const f of fathers) {
        const { error } = await sb.from('people').upsert(f);
        if(error) console.error("Error Gen 5:", f.handle, error);
    }
    console.log("Gen 5 inserted.");

    // CREATE WIVES FOR GEN 5 AND FAMILIES FOR GEN 5
    for(let i=1; i<=7; i++) {
        const fh = `F5.${i}`;
        const wifeHandle = `W5.${i}`;
        const fatherHandle = `P5.${i}`;

        // Insert Gen 5 Wife
        await sb.from('people').upsert({
            handle: wifeHandle, display_name: `Cụ Bà (Vợ cụ 5.${i})`, gender: 2, generation: 5, is_patrilineal: false, notes: 'Chưa thấy ghi trong phả'
        });

        // Insert Gen 5 Family (children empty for now)
        await sb.from('families').upsert({
            handle: fh, father_handle: fatherHandle, mother_handle: wifeHandle, children: []
        });

        // Link to father
        const { data: p5 } = await sb.from('people').select('families').eq('handle', fatherHandle).single();
        if(p5) {
            const fms = new Set(p5.families || []);
            fms.add(fh);
            await sb.from('people').update({ families: Array.from(fms) }).eq('handle', fatherHandle);
        }

        // Link to mother
        await sb.from('people').update({ families: [fh] }).eq('handle', wifeHandle);
    }
    console.log("Gen 5 Wives and Families inserted.");
}
run();
