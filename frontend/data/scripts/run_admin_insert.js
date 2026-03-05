require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
    const { data: p4 } = await sb.from('people').select('*').in('handle', ['P006','P007','P008','P009','P010']);
    console.log("FOUND P4 count:", p4 ? p4.length : 0);
    if(p4 && p4.length === 0) {
        console.log("RESTORING P4 PEOPLE...");
        const p4Data = [
            {handle:'P006', display_name:'Cụ Duyên', gender:1, generation:4, is_patrilineal:true, title:'Kim Khê Xử Sĩ', parent_families: ['F004']},
            {handle:'P007', display_name:'Cụ Nhân Chù', gender:1, generation:4, is_patrilineal:true, title:'Hiến sát sứ Hải Dương', parent_families: ['F004']},
            {handle:'P008', display_name:'Cụ Nhân Bị', gender:1, generation:4, is_patrilineal:true, title:'Binh bộ Thượng thư', degree: 'Tiến sĩ 1481', parent_families: ['F004']},
            {handle:'P009', display_name:'Cụ Nhân Bồng', gender:1, generation:4, is_patrilineal:true, title:'Lễ bộ Tả thị lang', degree: 'Tiến sĩ 1469', parent_families: ['F004']},
            {handle:'P010', display_name:'Cụ Nhân Thiếp', gender:1, generation:4, is_patrilineal:true, title:'Lại bộ Thượng thư', degree: 'Tiến sĩ 1466', parent_families: ['F004']},
            {handle:'P011', display_name:'Cụ Nhân Giữ', gender:1, generation:4, is_patrilineal:true, title:'Thanh hình Hiến sát sứ', degree: 'Tiến sĩ 1472', parent_families: ['F004']},
            {handle:'P012', display_name:'Cụ Nhân Đạc', gender:1, generation:4, is_patrilineal:true, title:'', degree: 'Tiến sĩ 1475', parent_families: ['F004']},
            {handle:'P013', display_name:'Cụ Nguyễn Thị Na', gender:2, generation:4, is_patrilineal:true, parent_families: ['F004']},
            {handle:'P014', display_name:'Cụ Nguyễn Thị Cam', gender:2, generation:4, is_patrilineal:true, parent_families: ['F004']},
            {handle:'P015', display_name:'Cụ Nguyễn Thị Ất', gender:2, generation:4, is_patrilineal:true, parent_families: ['F004']}
        ];
        for(let f of p4Data) await sb.from('people').upsert(f);
        await sb.from('families').upsert({
            handle: 'F004', father_handle: 'P003', mother_handle: 'P003_W2', children: p4Data.map(c => c.handle)
        });
        console.log("RESTORED P4!");
    } else {
        console.log("P4 EXISTS ALREADY.");
    }
}
run();
