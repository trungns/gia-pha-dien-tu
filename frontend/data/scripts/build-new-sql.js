const fs = require('fs');

const daiTonMD = fs.readFileSync('dai_ton.md', 'utf8');
const siTuyenMD = fs.readFileSync('si_tuyen_new.md', 'utf8');
const siKhaiMD = fs.readFileSync('si_khai.md', 'utf8');

const sql = `
-- 1. TẠO BẢNG BRANCH DOCUMENTS (Biên niên sử chi phái)
CREATE TABLE IF NOT EXISTS branch_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_name TEXT NOT NULL,
    content_md TEXT NOT NULL,
    order_index INT DEFAULT 0,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    last_edited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    last_edited_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CẤU HÌNH ROW LEVEL SECURITY (RLS)
ALTER TABLE branch_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "everyone_can_read_branch_documents" ON branch_documents;
    DROP POLICY IF EXISTS "admin_can_insert_branch_documents" ON branch_documents;
    DROP POLICY IF EXISTS "admin_can_update_branch_documents" ON branch_documents;
    DROP POLICY IF EXISTS "admin_can_delete_branch_documents" ON branch_documents;
EXCEPTION WHEN undefined_object THEN
    null;
END $$;

CREATE POLICY "everyone_can_read_branch_documents" 
    ON branch_documents FOR SELECT USING (true);

CREATE POLICY "admin_can_insert_branch_documents" 
    ON branch_documents FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "admin_can_update_branch_documents" 
    ON branch_documents FOR UPDATE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "admin_can_delete_branch_documents" 
    ON branch_documents FOR DELETE USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Xóa dữ liệu cũ nếu đã tồn tại mẫu tĩnh để cập nhật lại nội dung chuẩn
DELETE FROM branch_documents WHERE id IN (
    'b1111111-1111-1111-1111-111111111111',
    'c2222222-2222-2222-2222-222222222222',
    'd3333333-3333-3333-3333-333333333333'
);

-- 3. CHÈN DỮ LIỆU MẪU (TỪ 3 FILE DOCX GỐC)
INSERT INTO branch_documents (id, branch_name, content_md, order_index) VALUES
('b1111111-1111-1111-1111-111111111111', 'Đại Tôn', $MD$${daiTonMD}$MD$, 1),
('c2222222-2222-2222-2222-222222222222', 'Chi Sĩ Tuyển', $MD$${siTuyenMD}$MD$, 2),
('d3333333-3333-3333-3333-333333333333', 'Chi Sĩ Khái', $MD$${siKhaiMD}$MD$, 3)
ON CONFLICT (id) DO NOTHING;
`;

fs.writeFileSync('branch_documents_combined.sql', sql, 'utf8');
console.log('branch_documents_combined.sql updated successfully.');
