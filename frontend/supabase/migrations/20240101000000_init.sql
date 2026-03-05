-- ============================================================
-- 🌳 Gia Phả Điện Tử — Database Setup
-- ============================================================
-- Chạy file này trong: Supabase Dashboard → SQL Editor
-- File này tạo toàn bộ cấu trúc database + dữ liệu mẫu demo
-- ============================================================


-- ╔══════════════════════════════════════════════════════════╗
-- ║  1. CORE TABLES: people + families                      ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS people (
    handle TEXT PRIMARY KEY,
    gramps_id TEXT,
    gender INT NOT NULL DEFAULT 1,           -- 1=Nam, 2=Nữ
    display_name TEXT NOT NULL,
    surname TEXT,
    first_name TEXT,
    generation INT DEFAULT 1,
    chi INT,
    birth_year INT,
    birth_date TEXT,
    birth_place TEXT,
    death_year INT,
    death_date TEXT,
    death_place TEXT,
    is_living BOOLEAN DEFAULT true,
    is_privacy_filtered BOOLEAN DEFAULT false,
    is_patrilineal BOOLEAN DEFAULT true,     -- true=chính tộc, false=ngoại tộc
    families TEXT[] DEFAULT '{}',            -- family handles where this person is parent
    parent_families TEXT[] DEFAULT '{}',     -- family handles where this person is child
    title TEXT,                              -- Chức vụ, tước vị, thụy hiệu
    degree TEXT,                             -- Học vị (Tiến sĩ, Hoàng giáp...)
    longevity INT,                           -- Hưởng thọ
    phone TEXT,
    email TEXT,
    zalo TEXT,
    facebook TEXT,
    current_address TEXT,
    hometown TEXT,
    occupation TEXT,
    company TEXT,
    education TEXT,
    nick_name TEXT,
    notes TEXT,
    biography TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS families (
    handle TEXT PRIMARY KEY,
    father_handle TEXT,
    mother_handle TEXT,
    children TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_people_generation ON people (generation);
CREATE INDEX IF NOT EXISTS idx_people_surname ON people (surname);
CREATE INDEX IF NOT EXISTS idx_families_father ON families (father_handle);
CREATE INDEX IF NOT EXISTS idx_families_mother ON families (mother_handle);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ╔══════════════════════════════════════════════════════════╗
-- ║  2. AUTH: profiles + auto-create trigger                ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'viewer')),
    person_handle TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on signup
-- ⚠️ ĐỔI EMAIL ADMIN: thay 'your-admin@example.com' bằng email admin thật
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
BEGIN
    user_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email', '');
    IF user_email != '' THEN
        INSERT INTO profiles (id, email, role)
        VALUES (
            NEW.id,
            user_email,
            CASE WHEN user_email = 'your-admin@example.com' THEN 'admin' ELSE 'viewer' END
        )
        ON CONFLICT (email) DO UPDATE SET id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ╔══════════════════════════════════════════════════════════╗
-- ║  3. CONTRIBUTIONS (đề xuất chỉnh sửa)                  ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS contributions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_email TEXT,
    person_handle TEXT NOT NULL,
    person_name TEXT,
    field_name TEXT NOT NULL,
    field_label TEXT,
    old_value TEXT,
    new_value TEXT NOT NULL,
    note TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_person ON contributions(person_handle);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  4. COMMENTS (bình luận)                                ║
-- ╚══════════════════════════════════════════════════════════╝

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_email TEXT,
    author_name TEXT,
    person_handle TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_comments_person ON comments(person_handle);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  5. BRANCH DOCUMENTS (Biên niên sử chi phái)             ║
-- ╚══════════════════════════════════════════════════════════╝

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

-- ╔══════════════════════════════════════════════════════════╗
-- ║  6. ROW LEVEL SECURITY (RLS)                            ║
-- ╚══════════════════════════════════════════════════════════╝

-- People & Families: public read, authenticated write, admin delete
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read people" ON people FOR SELECT USING (true);
CREATE POLICY "anyone can read families" ON families FOR SELECT USING (true);
CREATE POLICY "authenticated can update people" ON people
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can insert people" ON people
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin can delete people" ON people
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "authenticated can update families" ON families
    FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "authenticated can insert families" ON families
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "admin can delete families" ON families
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Profiles: public read, update own or admin
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users or admin can update profile" ON profiles
    FOR UPDATE USING (auth.uid() = id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Contributions: public read, user insert own, admin update
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read contributions" ON contributions FOR SELECT USING (true);
CREATE POLICY "users can insert contributions" ON contributions FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "admin can update contributions" ON contributions
    FOR UPDATE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Comments: public read, user insert own, owner/admin delete
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "owner or admin can delete comments" ON comments
    FOR DELETE USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Branch Documents: public read, update own or admin
ALTER TABLE branch_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read branch_documents" ON branch_documents FOR SELECT USING (true);
CREATE POLICY "owner or admin can insert branch_documents" ON branch_documents 
    FOR INSERT WITH CHECK (
        auth.uid() = owner_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
CREATE POLICY "owner or admin can update branch_documents" ON branch_documents
    FOR UPDATE USING (
        auth.uid() = owner_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
CREATE POLICY "admin can delete branch_documents" ON branch_documents
    FOR DELETE USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Constraints
ALTER TABLE comments ADD CONSTRAINT comments_content_length CHECK (char_length(content) BETWEEN 1 AND 2000);
ALTER TABLE contributions ADD CONSTRAINT contributions_value_length CHECK (char_length(new_value) <= 5000);


-- ╔══════════════════════════════════════════════════════════╗
-- ║  7. DỮ LIỆU MẪU DEMO (xóa phần này nếu dùng dữ liệu thật)║
-- ╚══════════════════════════════════════════════════════════╝

-- Dòng họ mẫu: GIA PHẢ HỌ NGUYỄN KIM ĐÔI — Đời 1 đến Đời 5
-- (Theo Công đức liệt tổ)

-- People
INSERT INTO people (handle, display_name, gender, generation, birth_year, death_year, longevity, is_living, is_patrilineal, title, degree, nick_name, notes, families, parent_families) VALUES
-- Đời 1
('P001', 'Nguyễn Sư Húc', 1, 1, NULL, NULL, NULL, false, true, 'Cận thị Thượng bỉnh', NULL, NULL, 'Làm quan ở triều nhà Trần (1225–1413)', '{"F001"}', '{}'),
('P001_W', 'Nguyễn Thị (vợ cụ Sư Húc)', 2, 1, NULL, NULL, NULL, false, false, NULL, NULL, NULL, 'Người họ Nguyễn (không ghi tên)', '{"F001"}', '{}'),
-- Đời 2
('P002', 'Nguyễn Sư Kỳ', 1, 2, NULL, NULL, NULL, false, true, NULL, NULL, 'Tích Đức cư sĩ', 'Không chịu làm quan với nhà Hồ', '{"F002"}', '{"F001"}'),
('P002_W', 'Nguyễn Thị Quân', 2, 2, NULL, NULL, NULL, false, false, NULL, NULL, NULL, 'Con gái ông Xử công Cẩn', '{"F002"}', '{}'),
-- Đời 3
('P003', 'Nguyễn Lung', 1, 3, 1392, 1463, 71, false, true, 'Triều Liệt Đại Phu Tham Chính', NULL, 'Từ Mẫn', NULL, '{"F003","F004"}', '{"F002"}'),
('P003_W1', 'Người làng Ngọc Đôi (không tên)', 2, 3, NULL, NULL, NULL, false, false, NULL, NULL, NULL, 'Vợ 1 cụ Lung', '{"F003"}', '{}'),
('P003_W2', 'Hoàng Thị Hay', 2, 3, NULL, NULL, NULL, false, false, NULL, NULL, NULL, 'Vợ 2 (kế thất), làng Dược Sơn, Thượng Nhỡn/Chí Linh', '{"F004"}', '{}'),
-- Đời 4
('P004', 'Nguyễn Kiếp', 1, 4, NULL, NULL, NULL, false, true, 'Xã Chánh', NULL, NULL, NULL, '{}', '{"F003"}'),
('P005', 'Nguyễn Thị Hoa', 2, 4, NULL, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '{}', '{"F003"}'),
('P006', 'Nguyễn Quyên', 1, 4, NULL, NULL, NULL, false, true, NULL, NULL, 'Kim Khê Xử Sĩ', NULL, '{}', '{"F004"}'),
('P007', 'Nguyễn Nhân Chù', 1, 4, NULL, NULL, NULL, false, true, 'Hiến sát sứ Hải Dương', NULL, NULL, NULL, '{}', '{"F004"}'),
('P008', 'Nguyễn Nhân Bị', 1, 4, NULL, NULL, NULL, false, true, 'Binh bộ Thượng thư', 'Tiến sĩ 1481', NULL, NULL, '{}', '{"F004"}'),
('P009', 'Nguyễn Nhân Bồng', 1, 4, NULL, NULL, NULL, false, true, 'Lễ bộ Tả thị lang', 'Tiến sĩ 1469', NULL, NULL, '{}', '{"F004"}'),
('P010', 'Nguyễn Nhân Thiếp', 1, 4, NULL, NULL, NULL, false, true, 'Lại bộ Thượng thư', 'Tiến sĩ 1466', NULL, NULL, '{}', '{"F004"}'),
('P011', 'Nguyễn Nhân Giữ', 1, 4, NULL, NULL, NULL, false, true, 'Thanh hình Hiến sát sứ', 'Tiến sĩ 1472', NULL, NULL, '{}', '{"F004"}'),
('P012', 'Nguyễn Nhân Đạc', 1, 4, NULL, NULL, NULL, false, true, NULL, 'Tiến sĩ 1475', NULL, 'Đăng khoa lục ghi là Dịch', '{}', '{"F004"}'),
('P013', 'Nguyễn Thị Na', 2, 4, NULL, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '{}', '{"F004"}'),
('P014', 'Nguyễn Thị Cam', 2, 4, NULL, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '{}', '{"F004"}'),
('P015', 'Nguyễn Thị Ất', 2, 4, NULL, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '{}', '{"F004"}')
ON CONFLICT (handle) DO NOTHING;

-- Families
INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F001', 'P001', 'P001_W', '{"P002"}'),
('F002', 'P002', 'P002_W', '{"P003"}'),
('F003', 'P003', 'P003_W1', '{"P004","P005"}'),
('F004', 'P003', 'P003_W2', '{"P006","P007","P008","P009","P010","P011","P012","P013","P014","P015"}')
ON CONFLICT (handle) DO NOTHING;

-- Branch Documents
INSERT INTO branch_documents (id, branch_name, content_md, order_index) VALUES
('b1111111-1111-1111-1111-111111111111', 'Đại Tôn', $MD$# Gia Phả Đại Tôn Họ Nguyễn Kim Đôi

Tài liệu này lưu trữ các thông tin tiểu sử chi tiết của dòng họ Nguyễn Kim Đôi. Các phần tử có mã `{#Handle}` sẽ được hệ thống trích xuất tự động vào hồ sơ cá nhân trên ứng dụng.

## Đời 1

### Nguyễn Sư Húc {#P001}
Cụ tự là Cận thị Thượng bỉnh, làm quan ở triều nhà Trần (1225–1413). Cụ là người mở đầu cho dòng họ Nguyễn Kim Đôi.

## Đời 2

### Nguyễn Sư Kỳ {#P002}
Tích Đức cư sĩ. Không chịu làm quan với nhà Hồ. Cụ giữ tiết tháo trong sạch, răn dạy con cháu chăm chỉ học hành.

## Đời 3

### Nguyễn Lung {#P003}
Tên chữ là Từ Mẫn, làm quan Triều Liệt Đại Phu Tham Chính. Sinh năm Nhâm Thân (1392), mất năm Quý Mùi (1463), hưởng thọ 71 tuổi. 
Hành trang đức độ của cụ ảnh hưởng rất lớn đến truyền thống khoa bảng của dòng họ sau này.

## Đời 4

### Nguyễn Quyên {#P006}
Được phong Kim Khê Xử Sĩ.

### Nguyễn Nhân Chù {#P007}
Làm quan đến chức Hiến sát sứ Hải Dương.

### Nguyễn Nhân Bị {#P008}
Đỗ Tiến sĩ khoa Tân Sửu niên hiệu Hồng Đức thứ 12 (1481) vua Thánh Tôn nhà Lê. 
Cụ làm quan đến Binh bộ Thượng thư. Tài năng và đạo đức của cụ được triều đình trọng dụng, người đương thời rất nể phục.

### Nguyễn Nhân Bồng {#P009}
Đỗ Tiến sĩ khoa Kỷ Sửu niên hiệu Quang Thuận thứ 10 (1469) làm quan đến Lễ bộ Tả thị lang.

### Nguyễn Nhân Thiếp {#P010}
Đỗ Tiến sĩ khoa Bính Tuất niên hiệu Quang Thuận thứ 7 (1466) làm quan đến Lại bộ Thượng thư.

### Nguyễn Nhân Giữ {#P011}
Đỗ Tiến sĩ khoa Nhâm Thìn niên hiệu Hồng Đức thứ 3 (1472) làm quan Thanh hình Hiến sát sứ.

### Nguyễn Nhân Đạc {#P012}
(Đăng khoa lục ghi là cụ Dịch).
Đỗ Tiến sĩ khoa Ất Mùi niên hiệu Hồng Đức thứ 6 (1475).

## Đời 5

### Nguyễn Quản Liêu {#P016}
Làm quan Lễ bộ Hữu thị lang.

### Nguyễn Bá Lân {#P017}
Đỗ Tiến sĩ khoa Canh Tuất niên hiệu Hồng Đức thứ 21 (1490).

### Nguyễn Dũng Nghĩa {#P018}
Đỗ Hoàng giáp khoa Quý Sửu niên hiệu Hồng Đức thứ 24 (1493).

### Nguyễn Đạo Giền {#P019}
Đỗ Tiến sĩ khoa Bính Thìn niên hiệu Hồng Đức thứ 27 (1496).

### Nguyễn Kính {#P020}
Đỗ Tiến sĩ khoa Bính Thìn niên hiệu Hồng Đức thứ 27 (1496), làm quan đến Thượng thư.

### Nguyễn Lý Quang {#P021}
Đỗ Hoàng giáp khoa Đinh Mão niên hiệu Đoan Khánh thứ 3 (1507).

### Nguyễn Củng Thuận {#P022}
Đỗ Tiến sĩ khoa Bính Thìn niên hiệu Hồng Đức thứ 27 (1496), làm quan đến Lại bộ Tả thị lang.

### Nguyễn Viên {#P023}
Đỗ Bảng Nhãn khoa Bính Thìn niên hiệu Hồng Đức thứ 27 (1496), làm quan Lễ bộ Thượng thư.

### Nguyễn Hoành Khoản {#P024}
Đỗ Tiến sĩ khoa Canh Tuất niên hiệu Hồng Đức thứ 21 (1490).$MD$, 1)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
SELECT '✅ Database setup complete! Demo data loaded.' AS status;
-- ============================================================
