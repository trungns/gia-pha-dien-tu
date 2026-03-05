require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    // 1. DELETE GENERATION 6 AND ABOVE
    console.log("Deleting Gen 6+...");
    const { data: gen6plus } = await sb.from('people').select('handle').gte('generation', 6);
    if (gen6plus && gen6plus.length > 0) {
        const handles = gen6plus.map(p => p.handle);
        await sb.from('people').delete().in('handle', handles);
        await sb.from('families').delete().in('father_handle', handles);
        await sb.from('families').delete().in('mother_handle', handles);
        console.log(`Deleted ${handles.length} people.`);
    }

    // 2. We also clean up family children arrays for any family that references deleted children.
    // Instead, let's just create fresh families for Gen 5.

    // 3. UPSERT GEN 5 WITH FULL DATA
    console.log("Upserting Gen 5 with full data...");
    
    // Mothers (Wives of Gen 5) -> Generation 5, gender 2
    const wives = [];
    for(let i=1; i<=7; i++) {
        wives.push({
            handle: `W5.${i}`,
            display_name: `Cụ Bà (Vợ cụ 5.${i})`,
            gender: 2,
            generation: 5,
            is_patrilineal: false,
            notes: 'Chưa thấy ghi trong phả'
        });
    }

    // Fathers (Gen 5)
    // NOTE: using original handles: P5.1, P5.2, ...
    const fathers = [
        {
            handle: 'P5.1', display_name: 'Cụ Củng Thuận (拱順)', first_name: 'Củng Thuận', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Lại bộ Tả thị lang, Thái bảo Chung Khánh bá', degree: 'Tiến sĩ khoa Bính Thìn (1496)',
            notes: 'Cụ Củng Thuận là bậc hiền đạt đời thứ 5. Cụ 25 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), niên hiệu Hồng Đức 27, làm quan đến chức Lại bộ Tả Thị lang, và được triều đình ghi nhận, tặng Thái bảo, phong tước Chung Khánh bá. Cụ lập "ao khuyến học" 8 sào tại khu Chỗ Đột xứ để khuyến khích hậu duệ chăm học.'
        },
        {
            handle: 'P5.2', display_name: 'Cụ Quản Liêu (均僚)', first_name: 'Quản Liêu', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Lễ bộ Hữu thị lang, chưởng Hàn lâm viện sự',
            notes: 'Làm quan đến Lễ bộ Hữu thị lang, kiêm quản việc Hàn lâm viện (chưởng Hàn lâm viện sự).'
        },
        {
            handle: 'P5.3', display_name: 'Cụ Đạo Giền (道演)', first_name: 'Đạo Giền', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Hiến sát sứ', degree: 'Tiến sĩ khoa Bính Thìn (1496)',
            notes: 'Sy Khai ghi cụ 29 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), niên hiệu Hồng Đức 27, thời vua Lê Thánh Tông, làm quan đến Hiến sát sứ.'
        },
        {
            handle: 'P5.4', display_name: 'Cụ Dũng Nghĩa', first_name: 'Dũng Nghĩa', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Công bộ Thượng thư, Giám sát Ngự sử', degree: 'Hoàng giáp khoa Quý Sửu (1493)',
            notes: 'Cụ 19 tuổi đỗ Hoàng giáp khoa Quý Sửu (1493), niên hiệu Hồng Đức 24, thời vua Lê Thánh Tông; làm quan đến Công bộ Thượng thư, kiêm Giám sát Ngự sử.'
        },
        {
            handle: 'P5.5', display_name: 'Cụ Viên (勛)', first_name: 'Viên', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Lễ bộ Thượng thư, Thái bảo', degree: 'Bảng nhãn khoa Bính Thìn (1496)',
            notes: 'Cụ 21 tuổi đỗ Bảng nhãn khoa Bính Thìn (1496), làm quan đến Lễ bộ Thượng thư, tặng Thái bảo. Đỗ đầu cả thi Hương, Hội, Đình (quan Tam nguyên). Giai thoại: đáng ra đỗ Trạng nguyên, nhưng vua mơ trạng nguyên rậm râu cưỡi hổ nên lấy người tuổi Dần.'
        },
        {
            handle: 'P5.6', display_name: 'Cụ Kính (敬)', first_name: 'Kính', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Binh bộ Thượng thư', degree: 'Tiến sĩ khoa Bính Thìn (1496)',
            notes: 'Cụ 18 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), làm quan đến Binh bộ Thượng thư, hai lần đi sứ Tàu. Khoa ấy thực đỗ Thám hoa nhưng vua xem quyển, châu phê "không hiểu đối sách" nên đánh xuống Tiến sĩ.'
        },
        {
            handle: 'P5.7', display_name: 'Cụ Bá Tuấn (伯俊)', first_name: 'Bá Tuấn', generation: 5, gender: 1, is_patrilineal: true,
            title: 'Hiến sát sứ Thái Nguyên', degree: 'Tiến sĩ khoa Canh Tuất (1490)',
            notes: 'Cụ 22 tuổi đỗ Tiến sĩ khoa Canh Tuất (1490), làm quan đến Hiến sát sứ Thái Nguyên.'
        }
    ];

    // Upsert Wives & Fathers
    for(const p of [...wives, ...fathers]) {
        const { error } = await sb.from('people').upsert(p);
        if(error) console.log("Error upserting", p.handle, error);
    }
    console.log("Upserted Gen 5 People!");

    // Upsert Families for Gen 5 (where Gen 5 form couples to have Gen 6 eventually)
    for(let i=1; i<=7; i++) {
        const fh = `F5.${i}`;
        const father = `P5.${i}`;
        const mother = `W5.${i}`;
        
        await sb.from('families').upsert({
            handle: fh,
            father_handle: father,
            mother_handle: mother,
            children: [] // Children empty until we do Gen 6
        });

        // Link family to spouses
        for (const spouseHandle of [father, mother]) {
            const { data } = await sb.from('people').select('families').eq('handle', spouseHandle).single();
            if(data) {
                const fams = new Set(data.families || []);
                fams.add(fh);
                await sb.from('people').update({ families: Array.from(fams) }).eq('handle', spouseHandle);
            }
        }
    }
    console.log("Upserted Families for Gen 5!");
}
run();
