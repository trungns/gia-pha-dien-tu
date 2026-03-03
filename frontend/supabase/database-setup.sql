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
('P007', 'Nguyễn Nhân Chù', 1, 4, NULL, NULL, NULL, false, true, 'Hiến sát sứ Hải Dương', NULL, NULL, NULL, '{"F007"}', '{"F004"}'),
('P008', 'Nguyễn Nhân Bị', 1, 4, NULL, NULL, NULL, false, true, 'Binh bộ Thượng thư', 'Tiến sĩ 1481', NULL, NULL, '{"F008"}', '{"F004"}'),
('P009', 'Nguyễn Nhân Bồng', 1, 4, NULL, NULL, NULL, false, true, 'Lễ bộ Tả thị lang', 'Tiến sĩ 1469', NULL, NULL, '{"F009"}', '{"F004"}'),
('P010', 'Nguyễn Nhân Thiếp', 1, 4, NULL, NULL, NULL, false, true, 'Lại bộ Thượng thư', 'Tiến sĩ 1466', NULL, NULL, '{"F010"}', '{"F004"}'),
('P011', 'Nguyễn Nhân Giữ', 1, 4, NULL, NULL, NULL, false, true, 'Thanh hình Hiến sát sứ', 'Tiến sĩ 1472', NULL, NULL, '{}', '{"F004"}'),
('P012', 'Nguyễn Nhân Đạc', 1, 4, NULL, NULL, NULL, false, true, NULL, 'Tiến sĩ 1475', NULL, 'Đăng khoa lục ghi là Dịch', '{"F012"}', '{"F004"}'),
('P013', 'Nguyễn Thị Na', 2, 4, NULL, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '{}', '{"F004"}'),
('P014', 'Nguyễn Thị Cam', 2, 4, NULL, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '{}', '{"F004"}'),
('P015', 'Nguyễn Thị Ất', 2, 4, NULL, NULL, NULL, false, true, NULL, NULL, NULL, NULL, '{}', '{"F004"}'),
-- Đời 5
('P016', 'Nguyễn Quản Liêu', 1, 5, NULL, NULL, NULL, false, true, 'Lễ bộ Hữu thị lang', NULL, NULL, NULL, '{}', '{"F007"}'),
('P017', 'Nguyễn Bá Lân', 1, 5, NULL, NULL, NULL, false, true, NULL, 'Tiến sĩ 1490', NULL, NULL, '{}', '{"F007"}'),
('P018', 'Nguyễn Dũng Nghĩa', 1, 5, NULL, NULL, NULL, false, true, NULL, 'Hoàng giáp 1493', NULL, NULL, '{}', '{"F008"}'),
('P019', 'Nguyễn Đạo Giền', 1, 5, NULL, NULL, NULL, false, true, NULL, 'Tiến sĩ 1496', NULL, NULL, '{}', '{"F009"}'),
('P020', 'Nguyễn Kính', 1, 5, NULL, NULL, NULL, false, true, NULL, 'Tiến sĩ 1496', NULL, NULL, '{}', '{"F010"}'),
('P021', 'Nguyễn Lý Quang', 1, 5, NULL, NULL, NULL, false, true, NULL, 'Hoàng giáp 1507', NULL, NULL, '{}', '{"F012"}'),
('P022', 'Nguyễn Củng Thuận', 1, 5, NULL, NULL, NULL, false, true, 'Lại bộ Tả thị lang', 'Tiến sĩ 1496', NULL, 'Cha: Đời 4 - Nhân hệ', '{}', '{"F004"}'),
('P023', 'Nguyễn Viên', 1, 5, NULL, NULL, NULL, false, true, 'Lễ bộ Thượng thư', 'Bảng Nhãn 1496', NULL, NULL, '{}', '{"F004"}'),
('P024', 'Nguyễn Hoành Khoản', 1, 5, NULL, NULL, NULL, false, true, NULL, 'Tiến sĩ 1490', NULL, NULL, '{}', '{"F004"}')
ON CONFLICT (handle) DO NOTHING;

-- Families
INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F001', 'P001', 'P001_W', '{"P002"}'),
('F002', 'P002', 'P002_W', '{"P003"}'),
('F003', 'P003', 'P003_W1', '{"P004","P005"}'),
('F004', 'P003', 'P003_W2', '{"P006","P007","P008","P009","P010","P011","P012","P013","P014","P015","P022","P023","P024"}'),
('F007', 'P007', NULL, '{"P016","P017"}'),
('F008', 'P008', NULL, '{"P018"}'),
('F009', 'P009', NULL, '{"P019"}'),
('F010', 'P010', NULL, '{"P020"}'),
('F012', 'P012', NULL, '{"P021"}')
ON CONFLICT (handle) DO NOTHING;

-- Branch Documents
INSERT INTO branch_documents (id, branch_name, content_md, order_index) VALUES
('b1111111-1111-1111-1111-111111111111', 'Đại Tôn', \\$GIA PHẢ HỌ NGUYỄN KIM ĐÔI  
(ĐẠI TÔNG HỢP BIÊN)

# PHẦN I & II: NGUỒN GỐC VÀ THẾ HỆ ĐẠI TÔN (ĐỜI 1–15)

BÀI NÓI ĐẦU

Nhà có gia phả cũng như nước có lịch sử để kỷ niệm công đức của tổ tôn đời trước và tỏ bảo nguồn gốc cho con cháu đời sau . Họ Nguyễn nhà ta là một vọng tộc trong tỉnh Bắc Ninh , tổ tôn ta từ trần triều lấy võ công phong tước đến Lê triều về sau lấy văn chương hiển đạt . Song hán văn trong khi thời thượng , quốc văn cũng đã thấy dùng : xem như thơ nôm bài biểu dương Bát cảnh v. v. của Cụ Nhân Bồng nhà ta ( khi cụ đang làm Bảo Dân Phó Nguyên Súy ) Vua Thánh Tôn nhà Lê đã ban khen . Vậy biết quốc văn cũng cần dùng cho sau . Bây giờ quốc văn theo thời biến đổi , chữ Hán ít dùng , phần nhiều theo về quốc ngữ , gia phả nhà ta xưa nay vẫn theo hán tự ghi chép ; nếu không đem dịch ra quốc ngữ sợ con cháu sau này không hiểu , nào khoa nào hoạn , ai trước ai sau , bao ngày kỵ lạp , bao phái tôn thân , tổ mũi cháu tai , tờ mờ thế thứ , bòng bong đống mối , ngơ ngẩn âm phần , nên phải nghĩ tổ tiên ta ngày xưa khoa danh sự nghiệp vẻ vang trong lịch sử tới nay gần tám thế kỷ , con cháu có tại mắt cũng là nhờ phúc ấm của tổ tiên . Vậy phải theo thời văn dịch ra quốc - ngữ cho con cháu sau ghi nhớ công đức tổ tiên và hiểu rõ ngành ngọn gốc rễ . Nay tự ,

+4

PHẦN THỨ NHẤT: CÔNG ĐỨC LIỆT TỔ

Họ Nguyễn ta tương truyền là người ở huyện Kim Thành thuộc tỉnh Hải Dương không nói ở tổng xã nào . Từ cụ Lung mới đến xã Kim Đôi từ đó vẫn là vọng tộc . Ông nội cụ húy là Sư Húc làm quan Cận thị Thượng bỉnh ở triều nhà Trần ( 1225 - 1413 ) . Bà là người họ Nguyễn . Cha húy là Sư Kỳ không chịu làm quan với nhà Hồ , hiệu là Tích Đức cư sỹ . Mẹ là Nguyễn thị Quân ( con gái ông Xử công Cẩn ) . Cụ Lung sinh năm nhâm thân niên hiệu Quang Thái thứ 5 vua Thuận Tôn nhà Trần ( 1392 ) , còn bé đã mồ côi gặp loạn nhà Hồ , vất vả đói rách còn có một mình . Nhân khi chăn trâu ở xứ Vọng Nguyên ( bãi tổ ở cống tây bây giờ ) , trông thấy hai người thầy Tầu xem đất cùng đứng chỗ ấy chỉ trỏ nói truyện , một người đứng ở chỗ Nhũ , một người đứng ở chỗ Đột , người bảo chỗ này kết , người bảo chỗ kia kết , mới bẻ hai cành lá cắm vào hai chỗ ấy hẹn nhau đến mai lại đến xem ; hễ thấy cành nào tươi là huyệt thật , cành nào khô là huyệt giả . Hai người cùng chỉ trỏ nói chuyện rằng : " Kiểu đất này lấy núi Tam thai làm án , có nước cửu khúc nghịch triều , bên hữu có sông nhớn bọc ; thủy như kết một huyệt , đằng sau hợp muôn ngọn nước , huyệt quái hình kỳ đó thực là quí địa .

+4

Chỗ này có âm phần ; chỗ khác hẳn có dương - trạch nên qua xem , mới cùng nhau dắt tay đi đến làng Kim Đôi chỗ bãi bỏ không có cây bồ đề to , cành lá rườm rà thực nên yêu thích , lại chỉ trỏ nói chuyện mấy nhau rằng đất này Thư hùng Giao độ , khí mạch kiêm thu , núi văn bút đóng đằng trước , nước thôi quan quánh bên tả , nếu đẵn cây này làm nhà ở , hướng vào núi Thị cầu , hai đất ấy đều ở cạnh đường nhưng hình lạ lắm nên người thường không biết ) ) . Hai thầy địa lý cùng khen mãi mới đi . Cụ tổ ta ( cụ Lung ) rình xem biết cả , sáng mai cụ lại ra chỗ ấy chờ cho đến chiều thấy cành cắm ở bên nhũ thì tươi mà ở bên đột thì khô , mới đem mộ cụ Sư Kỳ táng ở chỗ nhũ ấy ; xong rồi cụ lấy cụ bà người làng Ngọc đôi sinh được một con giai tên là Kiếp , một gái tên là Hoa . Cụ bà mất sớm . Cụ lại làm bạn mấy cụ bà húy là Hoàng thị Hay người làng Dược sơn huyện Thượng Nhỡn ( nay đổi là Chí Linh ) làm kế thất . Tiên tổ họ Hoàng đều làm quan to ở triều nhà Trần ; như cụ Tiều Cẩm làm Chưởng vệ tướng quân ở thượng phẩm . Cụ bà húy là Định làm Hoàng Bảo thư ; em gái cụ ông húy Lang cũng làm đến chức Hoàng Bảo thư ( bà cụ trên này tức là cụ bốn đời cụ họ Hoàng nhà ta ) đến cụ ba đời húy Nhai làm Quan Thần vệ đại tướng quân quản thần vũ quân tước thượng phẩm . Ông ngoại bà cụ tổ tam đại họ Hoàng là người họ Trần bấy giờ là Hoàng Lộc đại tướng quân quản tả thần dực quân tử kim vân phù tước thượng liêu ban .

+4

Bà cụ ngoại húy là Ngọc là con gái quan Chương Lị nhân thiên kiên tướng quân phong Hầu họ Lê ; anh cụ họ Lê tên là Nham làm quan Giám Sát Hải Quân tước cùng ban . Cụ Hoàng phụng Thế làm quan tả kim ngô đại tướng quân quản tả thần dực quân kiêm Thái Nguyên Quan Sát sứ từ Hổ Phù tước hai ban thượng liêu ; một là Bính , hai là Đán ; Bính chức Thần vệ tướng quân ( Bính : Giám hậu tuyển long dực quân ; Đán : Giám tiền tuyển long dực quân ) . Tổ cô năm người đều là mệnh phụ ( các bà lớn ) . Ông thân sinh cụ húy là Bảo làm chức Chánh đội trưởng chưa được sắc bổ thụ gặp loạn . Cụ Hoàng kế thất ta sinh ở triều Hồ , từ nhỏ đến khi nhỡn vẫn theo cụ ông ( sinh ra cụ ) ở trong chốn quân ngũ . Đến khi cụ Đội ( sinh ra cụ ) thôi làm việc quan , về nhà nghỉ . Cụ bà nhà ta một hôm đi chăn trâu ở dưới thành Cổ Phao con trâu húc thành lở chật một chum vàng . Thấy thế cụ chạy về gọi cụ Đội ( sinh ra cụ ) ra lấy mang về nhà cất đi .

+4

Đến sau có một hôm ra chơi chỗ bắt được vàng , thấy mấy người ngồi trên bãi cỏ kêu khóc rất thảm thiết Những người ấy mặc quần áo ra dáng người Yên Đài ( tàu ) Cụ Đội mới đến gần mà hỏi , thì những người ấy chùi nước mắt mà nói rằng : " khi loạn nhà Hồ , chúng tôi có một chum vàng dấu ở đây ; nay đường xá xa xôi lại đây định lấy vàng ấy , chỗ dấu vẫn đây mà vàng thì mất , không lấy gì mà về được , thế có khổ không " Cụ Đội nghe nói trong lòng lành cảm động mới nói chuyện đầu đuôi hôm con gái mình bắt được vàng rồi mời những người ấy về nhà mình thì nhà cụ chỉ có ba gian nhà gianh giột nát . Chủ khách cùng ngồi ở đất nói chuyện rồi đem tất cả vàng đã bắt được ra giả hết cả . Những người khách ấy thấy nhà cụ nghèo khổ quá xin biếu lại một nửa số vàng ấy . Cụ trả lời rằng : (( trước là của không có chủ nhận , nên phải mang về cất đi , nay đã có các ông nhận , nếu tôi lấy thì không phải )) nhất định không chịu nhận . Người Khách cảm ơn mà nói rằng : (( Cụ có đức độ to như thế con cháu sau này chắc hẳn giàu sang )) rồi từ biệt về bên Tàu . Sau 5 năm nữa , người Khách ấy nghĩ báo lại ơn cụ mới đem thầy địa lý ở bên Tàu sang thì cụ ông cụ bà ( sinh ra cụ ) đều tạ thế cả rồi .

+4

Chỉ còn một gái mồ côi ( là cụ ta ) tình cảnh buồn rầu lắm . Những người Khách lấy làm thương tiếc mà khóc mãi rồi ở lại đó ít ngày . Người Khách ấy và ông địa lý đi tìm đất khắp cả núi sông địa phương ấy , tìm được đất rồi , về bảo cụ nhà ta rằng : (( chúng tôi thấy cụ ông ngày xưa có lòng nhân đức lắm , xưa nay ít có , vậy chúng tôi muốn báo ơn lại không biết làm thế nào được , bây giờ chúng tôi nhờ thầy tìm được 2 ngôi cát địa . 1 % phát nhất đại đế vương 2 % một ngôi phát kế thế công khanh , bằng lòng ngôi nào để chúng tôi xin rước cụ ông cụ bà đi táng )) . Cụ bà nhà ta mới trả lời rằng : (( tôi là phận con gái mồ côi sao dám mong đến đế vương )) . Những người Khách ấy nghe nói như vậy , mới đem di hài phụ mẫu cụ bà ta táng ở thành Cổ Phao có viết để lại cái kiểu đất ấy rằng : (( tả dĩ Sùng Nghiêm tự chỉ sơn vi long Long dẫn Bạch Nhạn sa quá tiền tác án . Hữu dĩ Cổ Phao thành chỉ sơn vị hổ dẫn Lục Đầu giang vạn thủy đáo đường , Bạch Nhạn sinh mao phương tận anh hào )) : bên tả lấy núi chùa Sùng Nghiêm làm tay long đem bãi Bạch Nhạn đến trước mặt làm án , bên hữu lấy thành Cổ Phao làm tay hổ đem suôn nước sông Lục Đầu đến trước mặt . Bao giờ bãi Bạch Nhạn mọc cỏ mới hết người giỏi )) .

+4

Đến khi cụ bà ta khôn nhỡn về làm bạn với cụ ông nhà ta ( tức là cụ Lung ) mới đẵn cây bồ đề sửa sang bãi đất để làm nhà ở ( tức là chỗ Từ Đường đại tôn bây giờ ) mà là ngôi dương trạch của thầy Khách đã xem trước , rồi sau sinh được 7 con giai là Quyên Chù Đồng Di Thiếp Giữ Đạc ( xem ở Đăng khoa lục là Dịch và 4 con gái là Na Não Cam Ất ... Cụ Lung là người nghiêm trực mà minh . Cụ bà là người thông mẫn mà từ , dạy dỗ con cái chỉ chăm nghiệp nho , con muốn làm ruộng thời cụ bảo là việc thô không nên làm ; con muốn làm thợ thì cụ bảo là nghề mọn không nên làm . Các con đều đến học cụ Nghè ở làng Đáp cầu tên húy là Trần bá Linh làm quan Thẩm hình viện , hiệu là Kính Giang tiên sinh . Các con đi học áo chưa rách đã may sẵn , gạo chưa hết đã mang tới , sợ con đói rét mà không học được . Các con đều cảm nhời nghĩa huấn của cụ mà cố chí học đều nổi tiếng cả . Cụ Lung hưởng thọ 71 tuổi mất ngày 29 tháng một năm nhâm ngọ niên hiệu Quang Thuận thứ ba về đời vua Thánh Tôn nhà Lê ( 1463 ) tên hiệu là Từ Mẫn tặng tước là Triều Liệt Đại Phu Tham Chính , mộ táng ở bên tả mộ cụ Kỳ ở bãi Vọng Nguyên . Cụ bà hưởng thọ 81 tuổi mất ngày mùng 5 tháng 8 năm giáp thìn niên hiệu Hồng Đức mộ táng ở bên tả mộ cụ ông , đều có mộ chí bằng đá .

+4

PHẦN THỨ HAI: SỰ - NGHIỆP CỦA LIỆT - TỔ

Đời thứ nhất Cụ Sư Húc làm quan Phụng Thự . Ngự . Thượng . bỉnh ở triều nhà Trần .

Đời thứ hai Cụ Sư . Kỳ hiệu Tích . Đức cư . sĩ không chịu làm quan với nhà Hồ .

+1

Đời thứ ba Cụ Lung tặng Triều . Liệt Đại Phu Tham . Chính .

Đời thứ tư Cụ Kiếp làm Xã . Chánh ( nay là Lý . trưởng ) Cụ Quyên hiệu Kim . khê Xử Sĩ Cụ đứng đắn , chăm học , làm thơ giỏi lắm . Cụ Nhân . Chù làm quan đến Hiến . Sát . Sứ Hải Dương Quan viên Thụ . Cụ Nhân . Bồng 19 tuổi đỗ tiến . sỹ khoa kỷ . sửu niên hiệu Quang Thuận thứ 10 ( 1469 ) vua thánh tôn nhà Lê . Cụ làm quan đến Lễ . bộ tả . thị . lang kiêm Hàn . lâm .viện thị thư , bảo . dân phó . nguyên . súy . Cụ làm thơ quốc văn hay ; vua thường cùng xướng họa thơ với cụ , vua yêu lắm , cho tên là Trọng - Tác ., sau lại cho là Sùng . Sác như những bài thơ sau này :

+4

Thơ Ngũ . canh Chập tối giời vừa mọc đẩu tinh . Ban hôm trống một mới dong canh . Đầu nhà khói tỏa lồng sương bạc . Sườn núi chim về lẩn lá xanh . Tuần điếm kìa ai dong mõ cá Dâng hương nọ kẻ nện chầy kình Nhà Nam nhà Bắc đều no mắt . Năn nỉ ca công khúc thái . bình .

+4

Thơ Tiêu . Tương Dạ . Vũ . Giọt tiếng vẳng cao lại thấp Rung cành ngọc nhặt lởi thưa Đêm hay nghe khách nằm chẳng nhấp Lai láng lòng thơ hứng có thừa Gốm giai kiển kìa mọc cháu Xanh xanh biếc biếc lạ hơn xưa . Vua chữa lại rằng : (( Nghìn hàng xanh biếc lạ hơn xưa .

+2

Thơ Tiêu . Tương Bát . cảnh Trải khắp tràng ân ngự thú quê Canh điền tạc tỉnh vốn như lề Cơm chiêm muối trắng hàng lưu loát Áo vải quần sồng mặc vũ . vẽ Sớm đón ngư ông chào cá bán Tối xem đồng mục hồi trâu về Năm canh ngủ tới ban giời mọc Tối dậy vươn vai sướng sướng ghê .

+1

Một buổi , Vua ngự . giá ra Cửa Nam . Những con gái hầu xe hát rằng : " Ở đây mến cảnh mến thày , Lòng tuy rằng bụt , chưa khuây sự đời " Vua nhân lấy câu ấy ra đầu bài . Cụ làm thơ rằng : " Chầy kình một tiếng tan niềm tục , Hồn bướm ba canh lẫn sự đời Bể khổ nghìn tầm mong tát cạn Lòng yêu muôn trượng dễ khơi vơi " Vua chữa rằng : " Chầy kình khác tiếng tan niềm tục Hồn bướm mơ tiên lẫn sự đời . " Bấy giờ có người tiên . nữ hiện ra bẻ rằng : (( có thiếu ý , thiếu cảnh ý )) lại chữa rằng : " Gió thông đưa kệ tan niềm tục Hồn bướm mơ tiên lẫn sự đời . " Bấy giờ có quan . trạng là ông Lương thế . Vinh đổi rằng : " Chầy kình khác tốc tan niềm tục Hồn bướm lìa phen lẫn sự đời . " Tiên nữ tự nhiên biến mất . Cụ Nhân . Bồng ta lại làm bài văn . tế có câu rằng : " Kiến tương sinh thành chi đại đức thuộc khoáng bất vong , truy tư chung ái chi chí tình tựu mộc vị dĩ " nghĩa là sinh thành đội đức ấm êm , chút tình ân ái con đem sau này . Khi bấy giờ vua tôi gặp . gỡ cá nước duyên ưa , cụ cùng mấy cụ Thân . Nhân trung nức tiếng . Cụ lại kiêm chức Thịnh . Giảng . Quan . Con cháu anh em nối gót nhau hiển đạt đỏ rực cả triều . đình Cụ lại làm bài thơ tự thuật rằng : Hoàng thượng tùng hưng thập nhị niên Thiện tướng hậu phúc tự ngô gia Thành tiền trúng tuyển nhân thiên thiếu Hoàng bảng thư danh ngã độc đa Chư phụ tỷ niên đồng chiết quế Quần nhi kim nhật hội khan hoa Mông ân nhược thử tướng hà báo Trung hiếu sơ tâm thỉ phỉ tha .

+4

Cụ Nhân . Bị 34 tuổi đỗ tiến . sỹ khoa tân . sửu niên hiệu Hồng đức thứ 12 vua thánh . tôn nhà Lê ( 1481 ) làm quan đến Binh bộ thượng . thư dự Tạo . Đàn . Cụ có đi sứ Tàu ( ở đăng khoa lục có chép 19 tuổi cụ đã đỗ tiến . sỹ sau lại từ , đến năm 34 tuổi mới đỗ lại . Cụ Nhân . Thiếp 15 tuổi đỗ tiến . sỹ khoa bính tuất niên hiệu Quang . thuận thứ 7 ( 1466 ) sau , đến năm Quang . thuận thứ 8 ( 1467 ) cụ lại đỗ khoa Hoành . từ đời vua Lê . thánh . tôn làm quan đến Lại . bộ thượng thư . Cụ khi ít tuổi thông minh dĩnh ngộ khác thường , những Kinh , Sử xem một lượt nhớ hết chữ nhớn chữ nhỏ không sót chữ nào . Khi ấy vua muốn thi hay chữ với nước tầu , vua thường bắt các quan triều chính thần đọc Kinh thi , Hình thư cho cụ làm thịnh giảng quan . Cụ Nhân . Giữ 17 tuổi đỗ tiến . sỹ khoa nhâm thìn niên hiệu Hồng đức thứ 3 ( 1472 ) vua thánh tôn nhà Lê làm quan đến Thanh hình Hiến . Sát sứ . Cụ Nhân . Đạc ( ở trong Đăng khoa lục thấy chép là Dịch ) 18 tuổi đỗ tiến sỹ khoa ất . mùi niên hiệu Hồng Đức thứ 6 ( 1475 ) làm quan Hàn lâm viện hiệu thảo . Phụ chép: Cụ Kiếp có ông con rể chồng bà thị Thận là ông Nguyễn . tất . Thông đỗ tiến sỹ khoa tân sửu niên hiệu Hồng đức thứ 12 ( 1481 ) vua thánh tôn nhà Lê là người cùng làng làm quan tri huyện huyện Lập Thạch .

+4

Đời thứ năm Cụ Củng . Chuẩn 25 tuổi đỗ tiến sỹ khoa bính thìn niên hiệu Hồng . đức thứ 27 ( 1496 ) vua thánh tôn nhà Lê , làm quan đến Lại . bộ tả thị . lang tặng Thái bảo Chung . khánh . Bá Quan viên Thụ Cụ có cái ao 8 sào ở Chú đột xứ tây cận Kim . khê ( gọi là ao gối ) ở Cống cụt gần đình thôn Phú Xuân nay đạc thành 2 thửa : số 1479 ( 3 sào 9 thước ) và số 1480 ( 3 sào 10 th ) cộng thành 7 sào 14 th đã thành ruộng cấy lúa chiêm được rồi để thưởng con cháu ai kế nghiệp Đại . khoa được nhận làm ao khuyến học ấy ( chưa có ai kế nghiệp trưởng nhà thờ vẫn làm ruộng ấy và làm giỗ cụ ngày 13 tháng 7 ) Cụ Quản Liêu làm quan đến Lễ . bộ Hữu . thị . lang chưởng Hàn Lâm viện . sự . Cụ Đạo . Giền 29 tuổi đỗ tiến . sỹ , khoa bính thìn niên hiệu Hồng đức thứ 27 ( 1496 ) vua thánh tôn nhà Lê làm quan đến Hiến . Sát . Sứ Cụ Dũng . Nghĩa 19 tuổi đỗ Hoàng Giáp khoa quý sửu niên hiệu Hồng đức thứ 24 ( 14 93 ) vua thánh tôn nhà Lê làm quan đến Công bộ thượng thư Giám sát ngự sử . Cụ Viên 21 tuổi đỗ Bảng Nhỡn khoa bính thìn niên hiệu Hồng đức thứ 27 ( 1496 ) vua thánh tôn nhà Lê , làm quan đến Lễ . bộ thượng thư tặng Thái . Bảo ; khoa ấy nhẽ cụ đỗ Trạng Nguyễn từ thi Hương , Hội , Đình đều đỗ đầu cả , thời ấy gọi cụ là Quan Tam Nguyên . Vì vua ngủ mơ thấy Trạng Nguyên rậm râu cưỡi hổ , khi truyền lô vua thấy ông Bảng nhỡn là cụ Nghiêm . Viên người xã Bồng . Lai huyện Quế . dương rậm râu lại tuổi dần , nên vua lấy cụ Nghiêm . Viên đỗ trạng - Nguyên mà lấy cụ nhà ta đỗ Bảng - Nhãn . Cụ Kính 18 tuổi đỗ tiến sỹ khoa bính thìn niên hiệu Hồng đức thứ 27 ( 1496 ) làm quan đến Hình bộ thượng thư , hai lần đi sứ Tàu . Khoa ấy cụ đỗ Thám hoa , vua xem quyển châu phê rằng (( Không không đối sách )) đánh xuống tiến sỹ . Cụ Bá Tuấn 22 tuổi đỗ tiến sỹ khoa canh tuất niên hiệu Hồng đức thứ 21 ( 1490 ) vua thánh tông nhà Lê , làm quan Hiến sát sứ . Cụ Vân Sơn làm quan đến Lại bộ cấp sự trung . Cụ Hoành Khoản 20 tuổi đỗ tiến sỹ khoa canh tuất niên hiệu Hồng đức thứ 21 ( 1490 ) làm quan đến Hiến sát sứ Thái Nguyên ( Lê thánh tông ) Cụ Lý Quang 20 tuổi đỗ Hoàng Giáp khoa mậu thìn niên hiệu Đoan Khánh thứ 4 ( 1508 ) vua Uy Mục đế nhà Lê gặp loạn bị hại .

+4

Đời thứ sáu Cụ Đôn Chai đỗ Nho sinh trúng thức . Cụ Thuần Chai làm quan tri chiêu văn quán tú lâm cục . Cả 2 cụ có để lại một khu ruộng ở bãi ái xứ động cận công quai võng , tây cận Di ái điền ( nay biến là Thần tử điền , bắc cận đại giang nay gần ruộng thần tử ) năm cận đại lộ để thượng công của ái kế khoa thì nhận làm ruộng khuyến học ấy ( nay đặc thành 33 thửa công được 2 Mẫu 6 sào 2 th ) chưa có ai khoa thì cả họ cho làm ruộng ấy để làm giỗ hai cụ vào ngày 23 tháng giêng và 15 tháng một ta . Cụ Nhân Gia làm quan đến Lại bộ tả thị lang tặng thái Bảo , lại giang bá gia tặng thượng đẳng thần . Cụ ở làng có nhiều công đức nên dân truy từ làm Phúc Thần . Ngày 26 tháng 7 niên hiệu Cảnh Hưng thứ 43 ( 1782 ) vua Hiển tông nhà Lê bao phong lại giang tộc khanh , diện hữu , thuần hựu , dương uy bố vũ trạch dân đại vương gia tặng Cao phong chực tiết , vỹ vọng phương danh , quang ý , dực bảo trung hưng , trác vỹ thượng đẳng thần là bộ ca đến nay ( 1943 ) . Cụ để cho dân một khu đất ở bãi ái xứ , đông cận đi ái điền , tây cận định vũ nam cận đại lộ , bắc cận đại giang , làm cương tế điền ( đoạn trên để thôn trưởng cấy lượt lấy gạo tế cơm mới , đoạn dưới để trưởng cai cấy lấy gạo nếp làm lễ hạ điền ( nay đặc là ruộng thần tử điền ) Cụ Bá Tân 24 tuổi đỗ tiến sỹ khoa canh tuất niên hiệu Hồng đức thứ 21 ( 1490 ) làm quan đến thái Nguyên sứ tham chính .

+4

Đời thứ bảy Cụ Nhân Đường đỗ Nho sinh trúng thức làm quan đến tri phủ Lý Nhân . Cụ có khu đất 8 giữa xóm ngoài , đông cận văn vinh tây cận Phạm Quyến , nam cận bản tộc chữ , bắc cận Danh kiếp chỉ , dựng cái miếu 3 gian để họ hàng năm kính tế tiền tổ . Cụ Năng Nhượng 27 tuổi đỗ Hoàng Giáp khoa nhâm tuất niên hiệu Quang Bảo thứ 8 ( 1561 ) , vua tuyên tôn nhà Mạc , làm quan đến Hộ bộ thượng thư kiêm Đông các đại học sĩ nhập thị kinh diên , đặc tiến kim tử , vinh lộc đại phu , đạo phái hầu , trụ quốc . Cụ có phụng mạng đi sứ Tàu . Thời bấy giờ cụ có can vua vua không nghe , cụ cáo về nhà nghỉ gọi là Kim Khê ẩn sỹ . Đến khi nhà Mạc mất , chúa Trịnh , Thành tổ Chiết Vương , đối cụ ra ; cụ mấy chặt ngón chân , cáo là chân có tật không chịu ra , bách đối mãi , cụ mới đem số sách các xứ xở ruộng khuyến học của ông cha để lại , giao cho trưởng tộc là cụ Nhân Đường nhận giữ , để sau con cháu ai đỗ được đại khoa thì nhận ruộng ấy . Bây giờ , cụ xuống thuyền đi đến sông Bạch đằng , cụ bảo những người theo cụ ở trong thuyền rằng (( Ai có cha mẹ không anh em cho về , cũng người nhớ vợ con cho về , nay ta đối với vua Mạc chỉ có một cái chết mà thôi )) . Cụ nói thế thì những người ở trong thuyền ai cũng thuận theo cả , duy có người nhà bếp vì vợ y gần đến kỳ sinh chưa hiểu là trai gái thế nào , xin với cụ về thăm rồi sau lại xin đi theo . Cụ đánh đắm thuyền mà chết , người bếp ấy về đến nhà thấy vợ đẻ con trai lại đi đến theo cụ thì thuyền đã đắm rồi , cũng đâm đầu xuống sông mà chết theo . Cụ trung với vua mà cảm đến người ta như thế . Cụ mất xong rồi , tiếng thiêng liêng hiển hách người làng thờ làm Phúc Thần . Ngày 26 tháng 7 niên hiệu Cảnh Hưng thứ 43 ( 1782 ) vua Hiển Tông nhà Lê , nhớ lại các những người trung nghĩa phong cụ là Đạo phái , Cao du , Nghĩa Liệt , Linh sáng , Thứ lữu tập - khách - diệc - vân - đại vương chuẩn hứa bản xã phụng tự . Gia tặng : Đỉnh Trung thứ nghĩa Tráng Tiết Phương Du , quang ý , dực bảo trung hưng , trác vỹ thượng đẳng thần . --- Cụ có khu đất để làm đình 3 gian 2 chái , gian giữa để phụng tự , và để ruộng tế điền : một khu ở Ai xứ ; đông cận Cổ điền , tây cận đại giang tả điền , nam cận đại lộ , bắc cận đại giang ; đoạn trên để bản thôn trưởng cảy lần lượt lấy gạo tẻ tế cơm mới và đoạn dưới để cai đám cầy lấy gạo nếp làm lễ hạ điền . Cụ Lương 28 tuổi đỗ tiến sỹ khoa bính thìn niên hiệu Quang Bảo thứ 2 ( 1555 ) vua Tuyên tôn nhà Mạc làm quan đến Lại bộ thượng thư . Cụ Đạt Nghị làm quan đến Lại khoa cấp sự trung .

+4

Đời thứ tám Cụ Bình Quân đỗ Nho sinh trúng thức . Cụ Nhân Liêm đỗ Nho sinh trúng thức làm quan đến tước Thứ phủ Thuần Tín .

Đời thứ chín Cụ Tô tên chữ là Nhân Hiệp đỗ Nho sinh trung thức làm quan đến tri huyện huyện Lương Tài Cụ Lỗ Chai đỗ Nho sinh trúng thức Cụ Tuy Chai đỗ Nho sinh trúng thức Cụ Thuần Hậu đỗ Nho sinh trúng thức Cụ Hoành Chát đỗ Nho sinh trúng thức

+2

Đời thứ mười Cụ Đức Bảo tên chữ là Đạt đạo đỗ Nho sinh trúng thức làm quan đến tri huyện huyện Phú Lương . Cụ có ruộng huệ điền cúng dân 3 mẫu 6 sào ở tác 1 . Ở xứ Nội quai vòng . 1 Mẫu 3 sào 2 . Ở xứ Hổ 1 -- 5 - 3 . Vũng Đông 0 -- 8 - Đến ngày 28 tháng 2 niên hiệu Cảnh Hưng thứ 33 vua Hiển tôn nhà Lê ( 1772 ) dân nhớ công đức cụ bầu làm Hậu thần thờ tại đình 4 mùa kinh tiết để tỏ sự nhớ ơn cụ ( Có văn bia ở Từ đường ) Cụ Trang Hòa đỗ Nho sinh trúng thức Cụ Khả Lượng đỗ Nho sinh trúng thức làm quan đến tri huyện huyện Lục Ngạn . Cụ Đức Minh đỗ Nho sinh trúng thức làm quan đến tri huyện huyện Vũ Công .

+3

Đời thứ mười một Cụ Đức Phượng đỗ Nho sinh trúng thức Cụ Quốc Quang sau đổi là Anh 25 tuổi đỗ tiến sỹ khoa canh thìn niên hiệu Chính Hòa thứ 21 ( 1700 ) vua Hy Tông nhà Lê , làm quan đến Đại Lý Tự khanh , Thu thận . đoàn , khâm hình sứ Nghệ An . Cụ đứng văn chỉ Hàng huyện huyện Võ Giàng Cụ có ba con gái thủy là cụ Ý ( ) sinh ra ông Phạm Nguyên Đạt đỗ tiến sỹ làm quan đến lục bộ thượng làng Kim văn bá , Phạm Quỹ ( tiến sỹ ) , Phạm đình Thân ( Cao sỹ ) Phạm Thận ( tri huyện Đông An ) v . v . Cụ có cúng vào dân 4 mẫu ruộng tốt và số tiền 200 quan . Lại những bà con gái cụ như bà Nguyễn thị Lầm cúng thêm vào dân 1 mẫu 2 sào ruộng tốt và tiền 10 quan công là tiền 210 quan , ruộng tốt 5 Mẫu 2 sào là Ở Đồng Đại 2 Mẫu 0 Sào 1 thước Ở Gỗ đó 0 -- 4 -- 7 - 0 -- 5 -- 0 Ở Chung Nha 0 -- 2 -- 0 Ở Đồng Khoai 0 -- 9 -- 9 0 -- 1 -- 13 - Ở Đồng Quốt 0 -- 1 -- 1 0 -- 0 -- 12 - 0 -- 0 -- 4 Ở tả Lai 0 -- 7 -- 0 Công cộng tát 5 Mẫu 2 sao 0 thước chia làm 4 phần để 4 giáp cầy cấy lần lượt lấy gạo nếp tiền dắt lãi đều để cúng vào việc tế tự . Đến ngày mồng 9 tháng 5 niên hiệu Cảnh Hưng thứ 25 ( 1764 ) làng bầu cụ làm Khánh thần thờ tại đình 4 mùa kinh biếu ( Có thờ tại Từ đường ) . Cụ Chắc thất cụ là Đoàn quý thị hiệu diệu Thung có 3 sào ruộng ở Đồng Dứa cúng họ để lần lượt cầy cấy làm giỗ tại Từ đường . Cụ Hậu trạch đỗ Nho sinh trúng thức .

+4

Đời thứ mười hai Cụ Quốc Thiếp đỗ Nho sinh trúng thức làm quan đến tri huyện huyện Quế Dương Cụ Quốc Tuân đỗ Nho sinh trúng thức , làm quan đến tri huyện huyện Chi linh được phong tước Kim Xuyên Bá . Cụ Quốc Diệu đỗ Nho sinh trúng thức làm quan đến tri huyện huyện Đông An . Cụ Quốc Đường Tú lâm cục nho sinh Cụ Quốc Hào đỗ Nho sinh trúng thức làm quan đến tri huyện huyện Hữu Lũng . Cụ Hiển Chức đỗ Nho sinh trúng thức . Cụ Nghiêm Trai đỗ Nho sinh trúng thức .

+4

Đời thứ mười ba Cụ Phương Chất làm quan Tả Luân Phường tả du đức , Kim linh bá , Gia hạnh đại phu . Cụ cúng làng 120 quan tiền và 2 cây gỗ thiết đình dài 12 thước để chữa đình ; ngày 10 tháng giêng niên hiệu Quang Trung thứ 5 ( 1792 ) làng bầu cụ làm Hậu thần thờ tại đình , xuân thu kính biếu ( tháng 1 và tháng 9 mỗi lần 1 cỗ biếu tại từ đường ) . Cụ Quốc Chức đỗ Nho sinh trúng thức Cụ Danh Long đỗ Nho sinh trúng thức làm quan đến tri huyện huyện Thủy Đường . Cụ Thái Vũ đỗ Hương cống làm quan đến tri Phủ phủ Thiên Quan . Cụ Minh Đạo đỗ Nho sinh Huấn Đạo

+4

Đời thứ mười bốn Cụ Quốc Kiều tú lâm cục nho sinh . Cụ Oanh Chính đỗ Hương cống , thôn Phú Xuân bầu cụ làm Hậu Thần thờ tại hành hậu đình thôn ấy , xuân thu kính biếu mỗi lần 1 cỗ thờ tại từ đường ông Sỹ Quan .

+2

Đời thứ mười lăm Cụ Sỹ Điểu đỗ hai khoa tú tài Cụ hay làm việc công ích như : cụ dựng chùa đình cho thôn Phú Xuân ( Nhân dịp này cụ làm hậu cho cụ Bồng ) ; dựng làm 3 gian từ đường thường trực hạ họ họ Đại Tôn ( là nhà thờ ông Bá Tăng phụng tự ) Cụ làm 5 gian nhà thờ và 3 gian nhà khách bằng gỗ lim lợp ngói để thờ tri cụ huyện Thủy Đường trở xuống ( nay là từ đường ông Sỹ Quán phụng tự ) Cụ Sỹ Đoán đỗ cử nhân khoa Tân sửu ăn khoa làm quan đến Thông Phán tỉnh Hưng Yên . Đại phu , dân bầu cụ làm hậu thần .

+3

Đời thứ mười sáu Cụ Sỹ Thục đỗ tú tài làm quan đến Thông phán tỉnh Lạng Sơn . Cụ Sỹ Bội sinh năm Ất Mùi niên hiệu Minh Mệnh thứ 16 ( 1835 ) vua thánh tông nhà Nguyễn . Cụ tính điềm tĩnh , hòa nhã , không thi cử nào thì ở nhà dạy học ; học trò cũ ở các làng : Thị cầu , Đáp cầu , Ngọc Đôi và làng nhà ; có nhiều người thành tài . Thời hiệu là Kim khê tiên sỹ . Đến giờ chiều ngày mồng 5 tháng 6 năm Đinh tuất niên hiệu Đồng Khánh năm đầu ( 1886 ) cụ mất . Cụ Kim Khê tiên sỹ tên huý là Bội tên chữ là Phúc Mỹ tên hiệu là Học Văn sinh năm Ất mùi hiệu Minh Mệnh thứ 16 ( 1835 ) vua thánh tôn nhà Nguyễn , mất ngày mồng 5 tháng 6 năm Đinh Tuất hiệu Đồng Khánh thứ nhất ( 1886 ) hưởng thọ 52 tuổi , yên táng ở Đồng Bể .

+4

Đời thứ mười bảy Cụ Sỹ Lệ đỗ Cử nhân khoa mậu tý niên hiệu Đồng Khánh thứ 3 ( 1888 ) vua cảnh tôn nhà Nguyễn , làm quan đến Giáo thọ tỉnh Ninh Bình thắng thụ Hàn lâm viện tích . Đến khoa ất mão niên hiệu Duy tân thứ 9 ( 1915 ) thì bãi bỏ khoa cử Hán học , vì thế không thi cử Hán nữa ( Nghi tính bài thi Hương ngày 23 tháng chạp dương lịch năm 1918 ( Mậu Ngọ , Khải Định thứ 3 ) Xem phả nhà ta từ triều nhà Trần ( 1225 - 1400 ) tấy võ công phong tước , đến triều nhà Lê về sau lấy văn chương hiển đạt : từ cụ Khắc Khiếp đỗ tiến sỹ khoa bính tuất niên hiệu Quang Thuận thứ 7 ( 1466 ) vua thánh tông nhà Lê đến cụ Sỹ Lệ đỗ cử nhân khoa mậu tý niên hiệu Đồng khánh thứ ba ( 1888 ) vua cảnh tôn nhà Nguyễn 1888 - 1466 là được 422 năm nối đời hiển đạt , khoa có đến Bảng nhỡn , hoan có đến phong Thượng thư : quả đúng với lời lưu bút của các thầy địa lý để lại ngôi đất ở Vong Nguyệt ( Ngọc Đôi ) và Thao Sơn ( Phả lại ) . Cụ Sỹ Đỉnh tên chữ là Trực Thanh sinh năm bính thìn niên hiệu Tự đức thứ 9 ( 1856 ) vua Đức Tôn nhà Nguyễn . Cụ 18 tuổi học đã có tiếng hay chữ và đã lên ngồi dạy học ở Thị cầu , nhưng đường khoa cử của cụ không được hạnh thông , suốt đời cụ , khoa trường nào cũng trúng nhị trường , vì cụ sinh ra cụ , chỉ có một mình cụ ; cụ vẫn còn phải đảm nhiệm cả việc nhà , cụ đã có khi buôn bán gạo với người trong Khoa . Đến năm Quý mão niên hiệu Thành thái thứ 15 ( 1903 ) cụ đến tuổi lên thôn trưởng bản ăn lo việc làng ; tháng sáu năm ấy cụ chính thất mất ; việc nhà càng thêm mang bách ; kể đến năm Giáp thìn ( 1904 ) cụ lại phải vào cai đám nữa . Tâm đình mũi niên hiệu Thành Thái thứ 19 ( 1907 ) Nhà nước cải lương việc học , lập các trường tổng học , hàng tổng bầu cụ làm tổng - sư trường tổng Đào Chân nhà thứ nhất ; cuối năm ấy ( 1907 ) cụ đến tuổi lên lão 53 , cụ xin từ chức tổng sư luôn thể , tính cụ trung trực không thích trong vòng cương tỏa . Đầu năm mậu thân ( 1908 ) cụ lên nhà cụ Tú thất ở Thị cầu ở lại dạy học , biết tiếng cụ các hạ sỹ quan đóng Doanh bầu nhiều người đến học . Được đến tháng 5 cụ bị mệt nặng về nhà ( Kim Đôi ) dưỡng bệnh ; đến 8 giờ sáng ngày 23 tháng 7 niên hiệu Duy tân thứ 2 ( 1908 ) cụ mất . Cụ Tú tài trúng nhị trường , tên hiệu Đỉnh tên chữ là Trực Thanh tên hiệu là Chế Chi , sinh năm Bính thìn hiệu Tự đức thứ 9 ( 1856 ) vua Đức tôn nhà Nguyễn , mất ngày 23 tháng 7 năm Mậu thân hiệu Duy tân thứ 2 ( 1908 ) hưởng thọ 53 tuổi , yên táng ở xứ vườn Bôn ( gần ổ Cống cụt ) .

+4

Đời thứ mười tám

PHẦN THỨ BA: THẾ - HỆ HỌ NGUYỄN

Đời thứ nhất . - Cụ Côn thi ái thường tỉnh , tên huý Sỹ Mục Cụ là Thuỷ tổ họ Nguyễn Kim Đôi nhà ta . Chính thất Nguyễn quý thị sinh ra ông Trực Hy Đời thứ hai . - Cụ Tích , đức cực sỹ tên huý là Sỹ Hy yên táng ở xứ Vọng Nguyện \[ bản tổ gây công tây bấy giờ \] mà lại là ngôi đất phát tích họ nhà ta , năm 1904 , đào và xây cống ấy có tồn hại cho ngôi đất của họ nhà \] . Chính thất Nguyễn quý thị tên huý là Quân con gái cụ Xứ công Cẩn sinh ra cụ Lung Đời thứ ba . - cụ Chiêu Liệt Đại Phu Tham Chính tên huý là Lung tên hiệu là Trúc Thân sinh năm nhâm thân niên hiệu Quang Thái thứ 5 ( 1392 ) vua Thuận Tôn nhà Trần mất ngày 29 tháng 11 năm nhâm ngọ niên hiệu Quang Thuận thứ 3 ( 1465 ) vua Thánh tôn nhà Lê hưởng thọ 71 tuổi . Yên táng ở xứ Vọng Nguyện bên tả mộ cụ tỷ Chính thất Nguyễn quý thị tên huý là Thụy Đời thứ tư . - Cụ Hoành quý thị tên huý là Thụy tên hiệu là Từ Thiện mất ngày 5 tháng 8 Hồng Đức , hưởng thọ 81 tuổi yên táng bên tả mộ cụ ông .

+4

Danh sách Thế - thứ (Quy ước: sắc-q, huyền-f, hỏi-r, ngã-x, nặng-j):

Đời 1: Cụ thủy tổ Huý Sỹ Hy f

Đời 2: Lung

Đời 3: Lung

Đời 4: Quyên , Chù f , Bổng f , Bi j , Thiếp q , Quế q , Đặc j , Chuộng x , Liêu f , Giên w , Nghĩa x , Viên , Kính q , Quán f , Sơn , Khoản x , Quang , Đông f - Chai , Gia

Đời 5: Bảng , Nghia w , Viên , Minh q , Quang , Sơn , Khoản x , Quang

Đời 16: Ngạn , Triều q , Song , Ôn , Thục j , Bội j , Chứng q

Đời 17: Đỉnh q , Giang , Thụy q , Luyện j , Dinh , Hoạt j , Chân , Giama , Miêng , Hiếu j , Thúy j , Bao z , Khiêm q , Cần f , Chân f , Bình , Chuyện f , Chân f , Hoanh f , Bạch , Quyền f , Du , Hoef , Chân , Kiêm z , Thúy j , Thiếp j , Lân , Bích q , Thúy j , Quang , Hòa f , Giao , Chân z , Chinh z , Mai j , Vinh j , Lệ j , Đông q , Chúc q , Dinh w , Giác q , Hồi , Bao z , Khiêm f , Thấu , Triển f , Cương q , Quyết q , Sử z , Quật , Ba j , Giáp q , Lâu f , Thành f , Bạch , Quyền f

Đời 18: Du , Bích q , Ngọ , Bích j , Quang , Uý , Chân z , Thuần f , Huân f , Tuyên f , Quý f , Tập j , Dinh z , Lâu , Hướng , Văn , Huân f , Thuần q , Kha , Thuận w , Pha , Phu , Quyết q , Giữ , Cẩn f , Đinh z , Chinh f , Lanh , Chiềng j , Quyền f

Đời 19: Năng , Ngai j , Phục q , Nga , Chúc q , Đan f , Giai , Viên , Xìa , Xang , Huyền q , Cương w , Đường f , Bình f , Đang , Khắc q , Nhâm , Hoàng , Bình q , Cương j , Cẩn , Thưởng f , Trung , Lang , Phổ

Đời 20: Lanh f , Chiềng j , Quyền f , Phố , Khuông

# PHẦN III: CÁC CHI PHÁI (TỪ ĐỜI 16 TRỞ XUỐNG)

Phần thứ nhất: Bài nói đầu

Nhà có gia phả cũng như nước có lịch sử, để kỷ niệm công đức của tổ tôn đời trước và tỏ bảo nguồn gốc cho con cháu đời sau. Họ Nguyễn nhà ta cũng là một vọng tộc trong tỉnh Bắc Ninh, tổ tiên ta từ triều nhà Trần lấy võ công phong tước, đến triều nhà Lê về sau lấy văn chương hiển đạt. Song hán văn trong khi thời thượng, quốc văn cũng đã thấy dùng, xem như cụ Nhân Bồng nhà ta (khi ấy cụ đang làm Bảo dân Phó nguyên súy) làm thơ nôm, như bài biểu dương Bát cảnh v.v. Vua Thánh Tôn nhà Lê đã ban khen. Vậy biết quốc văn cũng cần dùng cho sau.

+4

Bây giờ quốc văn theo thời biến đổi, chữ hán ít dùng, phần nhiều theo về quốc ngữ, gia phả nhà ta xưa nay vẫn theo hán tự ghi chép; nếu không đem dịch ra quốc ngữ, sợ con cháu sau này không hiểu, nào khoa nào hoạn, ai trước ai sau, bao ngày kỵ lạp, bao phái tôn thân, tổ mũi cháu tai, tờ mờ thế thứ, bòng bong đống mối, ngơ ngẩn âm phần, nên phải nghĩ tổ tiên ta ngày xưa khoa danh sự nghiệp vẻ vang trong lịch sử tới nay gần tám thế kỷ, con cháu có tại mắt cũng là nhờ phúc ấm của tổ tiên. Vậy phải theo thời văn mà dịch ra quốc ngữ cho con cháu sau ghi nhớ công đức tổ tiên và hiểu rõ ngành ngọn gốc rễ. Nay tự.

+4

Phả này chia làm 4 phần:

Phần thứ nhất nói về công đức của liệt tổ.

Phần thứ hai nói về sự nghiệp của liệt tổ.

Phần thứ ba nói về thế hệ, thế thứ.

Phần thứ tư chép những bài văn bia mộ chí v.v.:

+1

(1) Bài văn mộ chí cụ Lung.

+1

(2) Bài văn mộ chí cụ Thiếp.

(3) Bài văn bia chứa cầu.

(4) Chép những câu đối mừng khi ông Sĩ Huân được thưởng phẩm hàm và ông Sĩ Khải khi mới làm Chánh tổng.

(5) Đạo từ việc thuế.

+1

(6) Sắc thưởng hàm bá hộ.

+1

(7) Đạo từ việc đê Ngũ huyện Khê.

Công Đức Liệt Tổ

Họ Nguyễn nhà ta tương truyền vốn ở huyện Kim Thành, Hải Dương, không nói ở tổng xã nào. Từ cụ Lung mới đến ở xã Kim Đôi, từ đó vẫn là vọng tộc. Ông nội húy là Sư Húc làm quan Cận thị thượng bỉnh ở triều nhà Trần (1225-1413). Bà nội là người họ Nguyễn. Cha húy là Sư Kỳ không chịu làm quan với nhà Hồ, hiệu là Tích đức cư sỹ. Mẹ là Nguyễn thị Quân (Con gái ông Xử công Cẩn).

+4

Cụ Lung sinh năm Nhâm thân niên hiệu Quang Thái thứ năm, vua Thuận Tôn nhà Trần (1392), còn bé đã mồ côi gặp loạn nhà Hồ, vất vả đói rách còn có một mình. Nhân khi chăn trâu ở xứ Vọng nguyên (bãi tổ ở gần cống tây bây giờ) trông thấy hai người thầy xem đất cùng đứng chỗ ấy, chỉ trỏ nói chuyện, một người đứng ở chỗ Nhũ, một người đứng ở chỗ Đột, người bảo chỗ này kết, người bảo chỗ kia kết, mới bẻ hai cành lá cắm vào hai chỗ ấy, hẹn nhau đến mai lại đến xem; hễ thấy cành nào tươi là huyệt thật, cành nào khô là huyệt giả.

+2

Hai người cùng chỉ trỏ nói chuyện rằng: "Kiểu đất này lấy núi Tam Thai làm án, có nước cửu khúc nghịch triều, bên hữu có sông nhớn bọc, bên tả có bút thạch. Diệu thủy như kết một huyệt, đằng sau hợp muôn ngọn nước, huyệt quái hình kỳ, đó thực là quí địa. Chỗ này có âm phần, chỗ khác hẳn có dương trạch, nên qua xem". Mới cùng nhau dắt tay đi đến làng Kim Đôi chỗ bãi bỏ không có cây bồ đề to cành lá rườm rà thực nên yêu thích, lại chỉ trỏ nói chuyện mày nhau rằng: "Đất này Thư Hùng Giao Độ, khí mạch kiêm thu, núi Văn Bút đóng đằng trước, nước thôi quan quanh bên tả, nếu đẵn cây này làm nhà ở, hướng vào núi Thị Cầu, hai đất ấy đều ở cạnh đường nhưng hình lạ lắm, nên người thường không biết".

+4

Hai thầy địa lý cùng khen mãi mới đi. Cụ tổ ta (cụ Lung) rình xem biết cả, sáng mai cụ lại ra đấy, chờ cho đến chiều, thấy cành cắm ở bên Nhũ thì tươi, mà ở bên Đột thì khô, mới đem mộ cụ Sư Kỳ táng ở chỗ Nhũ ấy, xong rồi.

+1

Cụ làm bạn với cụ bà người làng Ngọc Đôi, sinh được một con giai tên là Kiếp, một gái tên là Hoa. Cụ bà mất sớm. Cụ lại làm bạn mấy cụ bà húy là Hoàng thị Hay người làng Dược Sơn huyện Thượng Nhỡn (nay đổi là Chí Linh) làm kế thất. Tiên tổ họ Hoàng đều làm quan to ở triều nhà Trần như cụ Tiều Cẩm là chưởng vệ tướng quân thượng phẩm. Cụ bà húy Định làm Hoàng bảo thư, em gái cụ ông húy Lang cũng làm đến chức Hoàng bảo thư (ba cụ trên này tức là cụ bốn đời cụ họ Hoàng nhà ta), đến cụ ba đời húy Nhai làm quan thần vệ đại tướng quân quản thần vũ quân, tước thượng phẩm

Ông ngoại bà cụ tổ tam đại họ Hoàng là người họ Trần, bấy giờ là Hoàng Lộc đại tướng quân quản tả thần dực quân, tử kim vân phù tước thượng liêu ban. Bà cụ ngoại húy là Ngọc, là con gái quan Chương lị nhân thiên kiên tướng quân phong hầu, họ Lê. Anh cụ họ Lê tên là Nham, làm quan Tả kim ngô đại tướng quân quản tả thần dực quân kiêm Thái Nguyên quan sát sứ, Hổ phù tước hai ban thượng liêu. Một là Bính, hai là Đán. Bính là chức Thần vệ tướng quân; Bính là Giám hậu tuyển long dực quân; Đán là Giám tiền tuyển long dực quân. Tổ cô năm người đều là mệnh phụ (các bà lớn).

+4

Ông thân sinh cụ húy Bảo làm chức Chánh đội trưởng chưa được sắc bổ thụ, gặp loạn. Cụ Hoàng kế thất ta sinh ở triều nhà Hồ, từ nhỏ đến khi nhỡn vẫn theo cụ ông (sinh ra cụ) ở trong chốn quân ngũ. Đến khi cụ Đội thôi không làm việc quan, về nhà nghỉ.

+4

Cụ bà nhà ta một hôm đi chăn trâu ở dưới thành Cổ Phao, trâu húc thành lở chật ra một chum vàng, thấy thế cụ chạy về gọi cụ Đội ra lấy mang về nhà cất đi. Đến sau có một hôm ra chơi chỗ bắt được vàng, thấy mấy người ngồi trên bãi cỏ kêu khóc rất thảm thiết. Những người ấy mặc quần áo dáng người Yên Đài (tức là ở Tàu). Cụ Đội mới đến gần mà hỏi, thì những người ấy chùi nước mắt mà nói rằng: “Khi loạn nhà Hồ, chúng tôi có một chum vàng giấu ở đây, nay đường xá xa xôi lại đây định lấy vàng ấy, chỗ giấu vẫn đây mà vàng thì mất, không lấy gì mà về được, thế có khổ không?”.

+4

Cụ Đội nghe nói trong lòng lành cảm động, mới nói chuyện đầu đuôi hôm con gái mình bắt được vàng rồi mời những người ấy về nhà mình. Thì nhà cụ Đội chỉ có ba gian nhà gianh dột nát. Chủ khách cùng ngồi ở đất nói chuyện, rồi đem tất cả số vàng đã bắt được ra trả hết cả. Những người khách ấy thấy nhà cụ nghèo khó quá, xin biếu lại một nửa số vàng ấy. Cụ trả lời rằng: “Trước là của không có chủ nhận; nên tôi phải mang về cất đi, nay đã trả các ông nhận; nếu tôi lấy thì không phải nghĩa”, nhất định không chịu nhận. Những người khách cảm ơn mà nói rằng: “Cụ có đức độ to như thế con cháu sau này chắc hẳn giàu sang” rồi từ biệt về bên Tàu.

+3

Sau năm năm nữa, người khách ấy nghĩ báo lại ơn cụ mới mang thầy địa lý ở bên Tàu sang thì cụ Đội ông cụ Đội bà đều tạ thế cả rồi, chỉ còn một gái mồ côi (là cụ bà ta) tình cảnh buồn rầu lắm. Những người khách lấy làm thương tiếc mà khóc mãi; rồi ở lại đó ít ngày, người khách ấy và ông thầy địa lý đi tìm đất khắp cả núi sông địa phương ấy. Tìm được đất rồi, về bảo cụ nhà ta rằng: “Chúng tôi thấy cụ ông ngày xưa có lòng nhân đức lắm, xưa nay ít có, vậy chúng tôi muốn báo ơn lại, không biết làm thế nào được, bây giờ chúng tôi nhờ thầy tìm được hai ngôi cát địa. Một là phát nhất đại đế vương. Hai là một ngôi phát kế thế công khanh, bằng lòng ngôi nào để chúng tôi xin rước cụ ông cụ bà đi táng".

+4

Cụ bà nhà ta mới trả lời rằng: "Tôi là con gái mồ côi sao dám mong đến Đế vương”. Những người khách ấy nghe nói như vậy, mới đem di hài phụ mẫu cụ táng hợp táng dưới thành Cổ Phao, có viết để lại cái kiểu đất ấy rằng: "Tả dĩ Sùng Nghiêm tự trĩ sơn vi long, Long dẫn Bạch Nhạn sa quá tiền tác án. Hữu dĩ Cổ Phao thành chi hổ, hổ dẫn Lục Đầu giang vạn thủy đáo đường. Bạch Nhạn sinh mao sản tận anh hào”. Bên tả lấy núi chùa Sùng Nghiêm làm tay long đưa bãi Bạch Nhạn đến trước mặt làm án. Bên hữu lấy núi thành Cổ Phao làm tay hổ, đem muôn nước sông Lục Đầu đến trước mặt. Bao giờ bãi Bạch Nhạn mọc cỏ mới hết người đỗ (chữ Hán).

+4

Đến khi cụ bà ta khôn nhỡn về làm bạn với cụ ông nhà ta (tức là cụ Lung) mới đẵn cây bồ đề sửa sang bãi đất để làm nhà ở (tức là chỗ từ đường đại tôn bây giờ), mà là ngôi dương trạch của thầy khách đã xem trước. Rồi sau sinh được bảy con giai là: Quyên, Chù, Bị, Bồng, Thiệp, Giữ, Đạc (thấy trong đăng khoa Lục là Dịch) và ba con gái là: Na, Cam, Ất. Cụ Lung là người nghiêm trực và minh. Cụ bà là người thông mẫn và từ, dạy dỗ con cái chỉ chăm việc nho, con muốn làm ruộng thời cụ bảo là việc thô không nên làm, con muốn làm thợ thì cụ bảo là nghề mọn không nên làm. Các con đều đến học cụ Nghè ở làng Đáp Cầu tên húy là Trần Bá Linh làm quan đến Thẩm hình viện, hiệu là Kính Giang tiên sinh. Các con đi học áo chưa rách đã may sẵn. Gạo chưa hết đã mang tới sợ con đói rét mà không học được. Các con đều cảm nhời nghĩa huấn của cụ mà cố chí học đều nổi tiếng cả.

+4

Cụ Lung hưởng thọ 71 tuổi mất ngày 29 tháng mười một năm Nhâm Ngọ niên hiệu Quang Thuận thứ ba về đời vua Thánh Tôn nhà Lê (1463) tên hiệu là Từ mẫn, tặng tước Triều liệt Đại phu Tham Chính, mộ táng ở bên tả mộ cụ Kỳ ở bãi Vọng Nguyên. Cụ bà hưởng thọ 81 tuổi mất ngày mùng 5 tháng 8 năm Giáp Thìn niên hiệu Hồng Đức mộ táng ở bên tả mộ cụ ông, đều có mộ chí bằng đá

Phần thứ hai

SỰ NGHIỆP CỦA LIỆT TỔ

Đời thứ nhất Cụ Sư Húc 師旭 làm quan Cận thị thượng bỉnh ở triều nhà Trần.

Đời thứ hai Cụ Sư Kỳ 師琦 hiệu Tích đức cư sĩ. Không chịu làm quan với nhà Hồ.

Đời thứ ba Cụ Lung tặng Triều liệt đại phu Tham Chính.

Đời thứ tư Cụ Kiếp làm Xã chánh (nay là Lý trưởng). Cụ Quyên hiệu Kim Khê Xử Sĩ. Cụ đứng đắn chăm học làm thơ giỏi lắm. Cụ Nhân Chù 厨 làm quan đến Hiến sát sứ Hải Dương, quan viên thụ. Cụ Nhân Bị 被 34 tuổi đỗ tiến sĩ khoa Tân Sửu niên hiệu Hồng Đức thứ 12 Vua Thánh Tôn nhà Lê (1481) làm quan đến Binh bộ thượng thư dự Tạo đàn. Cụ có đi sứ Tàu. (Ở đăng khoa lục chép năm cụ 19 tuổi đã đỗ tiến sĩ cùng với khoa cụ Thiếp đó, sau lại từ, đến năm 34 tuổi cụ lại đỗ lại). Cụ Nhân Bồng 19 tuổi đỗ tiến sĩ khoa Kỷ Sửu niên hiệu Quang Thuận thứ 10 (1469) vua Thánh Tôn nhà Lê làm quan đến Lễ bộ tả thị lang kiêm Hàn lâm viện Thị thư, Bảo dân Phó nguyên súy. Cụ làm thơ quốc văn hay, vua thường cùng xướng họa thơ với cụ, vua yêu lắm cho tên là Trọng Tác, sau lại cho là Sùng Sác như những bài thơ sau này.

Thơ Ngũ canh. Chập tối giời vừa mọc đẩu tinh. Ban hôm trống một mới dong canh. Đầu nhà khói tỏa lồng sương bạc. Sườn núi chim về lẩn lá xanh. Tuần điếm kìa ai dong mõ cá. Dâng hương nọ kẻ nện chày kình. Nhà Nam nhà Bắc đều no mắt. Năn nỉ ca công khúc thái bình.

Thơ Dạ vũ. Giọt tiếng vang cao lại thấp. Rung cành ngọc nhặt thời thưa. Đêm hay nghe khách nằm chẳng nhắp. Lai láng lòng thơ hứng có thừa. Gốc giai kiển kìa mọc chồi. Xanh xanh biếc biếc lạ hơn xưa. (Vua chữa lại rằng: Nghìn hàng xanh biếc lạ hơn xưa).

Thơ Vịnh Bát cảnh. Trải khắp non sông ngự thú quê. Canh điền tạc tỉnh vốn như lề. Cơm chiêm muối trắng hàng lưu loát. Áo vải quần sồng mặc lề bề. Sớm đón ngư ông chào cá bán. Tối xem đồng mục hồi trâu về. Năm canh ngủ tới vừng giời mọc. Tỉnh dậy vươn vai sướng sướng ghê.

Một buổi, Vua ngự giá ra Cửa Nam. Những con gái hầu xe hát rằng: "Ở đây mến cảnh mến thầy. Lòng tuy dâng bụt, chưa khuây sự đời" Vua nhân lấy câu ấy ra đầu bài. Cụ làm thơ rằng: Chày kình một tiếng tan niềm tục. Hồn bướm ba canh lẫn sự đời. Bể khổ nghìn tầm mong tát cạn. Lòng yêu muôn trượng dễ khơi vơi.

Vua chữa rằng: Chày kình gõ tiếng tan niềm tục. Hồn bướm mơ tiên lẫn sự đời.

Bấy giờ có người tiên nữ hiện ra chê rằng: thiếu ý thiếu cảnh, lại chữa rằng: Gió thông đưa kệ tan niềm tục. Hồn bướm mơ tiên lẫn sự đời.

Bấy giờ có quan Trạng là ông Lương Thế Vinh đổi rằng: Chày kình thức giấc tan niềm tục. Hồn bướm lìa phen lẫn sự đời.

Cụ Nhân Bồng tả tiên nữ tự nhiên biến mất. Lại làm bài văn tế có câu rằng: "Kiến tương sinh thành chi đại đức thốc khoáng bất vong, truy tư chung ái chi chí tình, tựu mộc vị dĩ" nghĩa là: sinh thành đại đức ấm êm, chút tình ân ái con đem sau này. Khi bấy giờ vua tôi gặp gỡ cá nước duyên ưa, cụ cùng với cụ Thân Nhân Trung nức tiếng. Cụ lại kiêm chức Thị giảng quan. Con cháu anh em nối gót nhau hiển đạt đỏ rực cả triều đình. Cụ lại làm bài thơ tự thuật rằng: Hoàng thượng sùng hưng thập nhị niên. Thiện tướng hậu phúc tự ngô gia. Thành tiền trúng tuyển nhân thiên thiểu. Hoàng bảng thư danh ngã độc đa. Chư phụ tị niên đồng chiết quế. Quần nhi kim nhật đồng khan hoa. Mông ân nhược thử tương hà báo. Đan hiếu sơ tâm thệ phỉ tha.

Cụ Nhân Thiếp 浹 15 tuổi đỗ tiến sĩ khoa Bính tuất niên hiệu Quang Thuận thứ 7 (1466) năm Quang Thuận thứ 8 (1467) cụ lại đỗ khoa Hoành từ, vua Thánh Tôn nhà Lê. Làm quan đến Lại bộ thượng thư. Cụ khi còn nhỏ thông minh dĩnh ngộ khác thường, những Kinh, Sử xem qua một lượt nhớ hết chữ nhớn chữ nhỏ không sót chữ nào. Khi bấy giờ, vua muốn thi hay chữ với nước Tàu, thường bắt các quan triều thần đọc Kinh Thi, Hình thư cho cụ làm Thị giảng quan. Cụ Nhân Giữ 餘 17 tuổi đỗ tiến sĩ khoa Nhâm thìn niên hiệu Hồng Đức thứ 3 (1472) vua Thánh Tôn nhà Lê làm quan đến Thanh hình Hiến sát sứ. Cụ Nhân Đạc 18 tuổi đỗ tiến sĩ khoa Ất mùi niên hiệu Hồng Đức thứ 6 (1475) làm quan đến Hàn lâm viện hiệu thảo. (Ở Đăng khoa lục chép là Dịch 驛). Phụ chép: Cụ Nguyễn Tất Thông 阮必聰 đỗ Tiến sĩ khoa Tân Sửu niên hiệu Hồng Đức thứ 12 (1481) làm quan tri huyện huyện Lập Thạch là con rể cụ Kiếp (là chồng bà thị Thận).

Đời thứ năm Cụ Củng Thuận 拱順 25 tuổi đỗ tiến sĩ khoa Bính thìn niên hiệu Hồng Đức thứ 27 (1496) vua Thánh Tôn nhà Lê, làm quan đến Lại bộ tả thị lang, tặng Thái bảo Chung khánh bá quan viên thụ. Cụ có cái ao 8 sào ở Chỗ đột xứ, tây cận Kim khê (gọi là ao gối) ở cống cụt gần đình thôn Phú Xuân, nay đạc thành hai thửa số 1479 - 3 sào 9 thước. Số 1480 - 3 sào 10 thước cộng thành 7 sào 14 thước (đã thành ruộng cấy lúa chiêm được rồi) để thưởng con cháu ai kế nghiệp đại khoa được nhận làm ao khuyến học. (Chưa có ai kế nghiệp tạm giao trưởng nhà thờ làm ao ấy và làm giỗ cụ ngày 13 tháng 7). Cụ Quản Liêu 均僚 làm quan đến Lễ bộ Hữu thị lang chưởng Hàn lâm viện sự. Cụ là con cụ Nhân Chù. Cụ Đạo Giền 道演 29 tuổi đỗ tiến sĩ khoa Bính thìn niên hiệu Hồng Đức thứ 27 (1496) vua Thánh Tôn nhà Lê làm quan đến Hiến sát sứ. Cụ là con cụ Nhân Bồng. Cụ Dũng Nghĩa 19 tuổi đỗ Hoàng giáp khoa Quý Sửu niên hiệu Hồng Đức thứ 24 (1493) vua Thánh Tôn nhà Lê làm quan đến Công bộ thượng thư Giám sát ngự sử. Cụ là con cụ Nhân Bị. Cụ Viên 勛 21 tuổi đỗ Bảng nhãn khoa Bính thìn niên hiệu Hồng Đức thứ 27 (1496) vua Thánh Tôn nhà Lê làm quan đến Lễ bộ thượng thư tặng Thái bảo. Khoa ấy nhẽ ra cụ đỗ Trạng nguyên từ thi Hương, Hội, Đình đều đỗ đầu cả, thời ấy gọi cụ là quan Tam nguyên. Vì vua mơ thấy Trạng nguyên rậm râu cưỡi hổ, khi truyền lô vua thấy ông Bảng nhãn là cụ Nghiêm Viên người xã Bồng Lai huyện Quế Dương rậm râu lại tuổi Dần, nên vua lấy cụ Nghiêm Viên đỗ Trạng nguyên mà lấy cụ Viên nhà ta đỗ Bảng nhãn. Thực ra cụ Nghiêm Viên thượng công chúa... Cụ Thân Thiếp Cụ Kính 敬 18 tuổi đỗ tiến sĩ khoa Bính thìn niên hiệu Hồng Đức thứ 27 (1496) vua Thánh Tôn nhà Lê làm quan đến Binh bộ thượng thư, hai lần đi sứ Tàu. Khoa ấy cụ đỗ Thám hoa, vua xem quyển châu phê rằng "không hiểu đối sách" đánh xuống Tiến sĩ. Cụ là con cụ Thân Thiếp. Cụ Bá Tuấn 伯俊 22 tuổi đỗ tiến sĩ khoa Canh tuất niên hiệu Hồng Đức thứ 21 (1490) làm quan đến Hiến sát sứ Thái Nguyên vào đời vua Thánh Tôn nhà Lê. Cụ là con trưởng cụ Thân Dư. Cụ Lý Quang 光 20 tuổi đỗ Hoàng giáp khoa Mậu thìn niên hiệu Đoan Khánh thứ 4 (1507) vua Uy Mục Đế nhà Lê. Gặp loạn bị hại. Cụ là con thứ hai cụ Đạc. Cụ Vân Sơn làm quan đến Lại bộ cấp sự trung. Cụ là con thứ hai cụ Dư. Cụ Hoành Khoản 宏款 20 tuổi đỗ tiến sĩ khoa Canh tuất niên hiệu Hồng Đức thứ 21 (1490) vua Thánh Tôn nhà Lê làm quan đến Hiến sát sứ Thái Nguyên. Cụ là con trưởng cụ Đạt.

Đời thứ sáu Cụ Đôn Chai 鈍齋 đỗ Nho sinh trúng thức. Cụ Thuần Chai 純齋 làm quan Lại chiêu văn quán tự lâm cục. (Hai cụ có để lại một khu ruộng ở Bãi Ải xứ, đông cận cống quai vòng, tây cận Gi ái điền (nay gọi là thần từ điền) bắc cận Đại giang nay gần ruộng Thần từ, nam cận đại lộ, để thưởng con cháu ai kế khoa nhận làm ruộng khuyến học; nay đạc thành 33 thửa cộng được 2 mẫu 6 sào 2 thước. Chưa có ai kế khoa thì cả họ cho làm ruộng ấy, để làm giỗ hai cụ vào ngày 23 tháng Giêng và 15 tháng Mười một). Cụ Thân Gia 仁家 làm quan đến Lại bộ tả thị lang, tặng Thái bảo Lại giang bá gia tặng Thượng đẳng thần. Cụ ở làng có nhiều công đức nên dân tòng tự làm Phúc thần. Ngày 26 tháng bẩy niên hiệu Cảnh Hưng thứ 44 (1782) vua Hiển Tôn nhà Lê, bao phong Lại giang đốc khánh, diên hưu thuần hưu, dương uy bố vũ, trạch dân đại vương. Gia tặng Cao phong chức tiết, vĩ vọng phương danh, quang ý dực bảo trung hưng Trác vĩ thượng đẳng thần. (Kể cả đến năm 1943). Cụ để lại cho dân một khu đất ở bãi Bãi Ải xứ, Đông cận Gi ái điền. Tây cận Đình vũ. Nam cận Đại lộ. Bắc cận Đại giang làm ruộng tế điền, đoạn trên để thôn trưởng cấy lượt lấy gạo tẻ cơm mới; đoạn dưới để Đương cai cấy lấy gạo nếp làm lễ hạ điền. (nay đạc là ruộng thần từ điền). Cụ là con thứ hai cụ Củng Thuận. Cụ Bá Lân 伯麟 24 tuổi đỗ tiến sĩ khoa Canh tuất niên hiệu Hồng Đức thứ 21 (1490) làm quan đến Thái Nguyên sứ tham thính. (Con thứ hai cụ Chù).

Đời thứ bẩy Cụ Thân Đương 仁當 đỗ Nho sinh trúng thức làm quan đến tri phủ Phủ Lỵ Nhân. Cụ có khu đất ở giữa xóm ngoài, Đông cận Văn Vịnh, Tây cận Phạm Duyên, Nam cận bản tộc chí, Bắc cận danh kiếp chi dựng cái miếu ba gian để họ hàng năm kính tế tiên tổ. Cụ Năng Nhượng 能讓 27 tuổi đỗ Hoàng giáp khoa Nhâm tuất niên hiệu Quang Bảo thứ 8 (1561) vua Tuyên Tôn nhà Mạc, làm quan đến Hộ bộ thượng thư kiêm Đông các đại học sỹ, Nhập thị kinh diên, đặc tiến kim tử vinh lộc đại phu, Đạo phái hầu trụ quốc. Cụ có phụng mạng đi sứ Tàu. Thời bấy giờ cụ thường có can vua, vua không nghe cụ cáo về ở nhà gọi là Kim Khê xử sỹ. Đến khi nhà Mạc mất, chúa Trịnh Thành Tổ Triết vương đòi cụ ra, cụ chặt một ngón chân cáo là chân có tật không chịu ra, bách đòi mãi cụ mới đem sổ sách các xứ sở ruộng khuyến học của cha ông để lại giao cho trưởng họ là cụ Thân Đương nhận giữ, để sau con cháu ai đỗ được đại khoa thì nhận ruộng ấy. Bấy giờ cụ xuống thuyền đi đến sông Bạch Đằng, cụ bảo những người theo cụ ở trong thuyền rằng: "Ai có cha mẹ không anh em cho về, cùng người nhớ vợ con cho về, nay ta đối với vua Mạc chỉ có một cái chết mà thôi". Cụ nói thế người ở trong thuyền ai cũng thuận theo cả. Duy có người nhà bếp vì vợ y gần đến kỳ sinh chưa hiểu là giai gái thế nào xin cụ về thăm rồi sau lại xin đi theo. Cụ đánh đắm thuyền mà chết, người bếp ấy về đến nhà thấy vợ đẻ con giai lại đi theo cụ thì thuyền đã đắm rồi, cũng đâm đầu xuống sông mà chết theo. Cụ trung với vua mà cảm đến người ta như thế. Cụ mất xong rồi tiếng thiêng liêng hiển hách. Người làng thờ làm Phúc thần. Ngày 26 tháng bẩy niên hiệu Cảnh Hưng thứ 44 (1782) vua Hiển Tôn nhà Lê, nhà vua lục những người trung nghĩa, phong cụ là Đạo phái tát du, nghĩa liệt linh sảng Phù hưu tập khánh dực vận đại vương. Gia tặng: Đỉnh trung tráng tiết phương du, quang ý dực bảo trung hưng, trác vĩ thượng đẳng thần. Cụ có khu đất để làm đình 3 gian 2 trái gian giữa để phụng tự và để ruộng tế điền một khu ở Ải xứ Đông cận Cổ điền, Tây cận Lại giang bá điền, Nam cận Đại lộ, Bắc cận Đại giang, đoạn trên để bản Thôn trưởng cấy lượt lấy gạo tẻ cơm mới, đoạn dưới để Lại đám cấy lấy gạo nếp làm lễ thưởng điền. Cụ Lượng 28 tuổi đỗ tiến sĩ khoa Bính thìn niên hiệu Quang Bảo thứ 2 (1555) vua Tuyên Tôn nhà Mạc làm quan đến Lại bộ thượng thư. Cụ là chắt cụ Kính. Cụ Đạt Nghị 達毅 làm quan đến Lại khoa cấp sự trung.

Đời thứ tám Cụ Bỉnh Quân 秉均 đỗ Nho sinh trúng thức. Cụ Nhân Liêm đỗ Nho sinh trúng thức làm quan đến tri phủ Phủ Thường Tín.

Đời thứ chín Cụ Bô 蘇 tên chữ là Nhân Hiệp 仁洽 đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Thượng Nhơn. Cụ Lộ Chai 齋 đỗ Nho sinh trúng thức. Cụ Tuý Chai đỗ Nho sinh trúng thức. Cụ Thuần Khê 純溪 đỗ Nho sinh trúng thức. Cụ Hoành Chai đỗ Nho sinh trúng thức.

Đời thứ mười Cụ Đức Bao 德褒 tên chữ là Đạt Đạo 達道 đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Phú Lương. Cụ có ruộng điền cúng làng 3 mẫu 6 sào 7 tấc: Ở xứ quai vòng 1 mẫu 3 sào; Ở Ao khếnh 1 mẫu 5 sào 7 tấc; Ở vùng Đông 8 sào. Đến ngày 28 tháng hai niên hiệu Cảnh Hưng thứ 33 vua Hiển Tôn nhà Lê (1772) làng nhớ công đức cụ bầu làm Hậu thần thờ tại đình bốn mùa kính biếu để tỏ sự nhớ ơn cụ (4 cỗ biếu ở Từ Đường). Cụ Trang Hoà 莊和 đỗ Nho sinh trúng thức. Cụ Nhã Lượng 雅量 đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Lục Ngạn. Cụ Đức Minh 德明 đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Tư Nông

Đời thứ mười một Cụ Đức Phương 德芳 đỗ Nho sinh trúng thức. Cụ Quốc Quang 國光 sau đổi là Anh 瑛 25 tuổi đỗ tiến sĩ khoa Canh thìn niên hiệu Chính Hòa thứ 21 (1700) vua Hy Tôn nhà Lê làm quan đến Đại lý tự khanh, Tu thận doãn Tham chính sứ Nghệ An. Cụ dựng lên văn chỉ hàng huyện huyện Võ Giàng. Cụ có bà con gái tên thụy là Từ Ý sinh ra ông Phạm Nguyễn Đạt đỗ tiến sĩ làm quan đến Tả thị lang Kim vân bá. Ông Phạm Dư đỗ tiến sĩ làm quan đến Bình chương sự. Ông Phạm đình Phan đỗ tạo sĩ. Ông Phạm Chân tri huyện Đông An vân vân. Cụ có cúng vào làng bốn mẫu ruộng tốt và số tiền hai trăm quan. Lại những bà con gái cụ như bà Nguyễn thị Cẩm cúng thêm vào làng một mẫu 2 sào ruộng tốt và tiền mười quan nữa, cộng là tiền hai trăm mười quan. Ruộng tốt năm mẫu hai sào là: Ở Đồng Lài 2 mẫu 0 sào 1 thước. Ở Bờ Dứa 0 mẫu 9 sào 7 thước. Ở Thùng Nhà 0 mẫu 2 sào 6 thước. Ở Đồng Khoai 1 mẫu 1 sào 7 thước. Ở Đồng Guột 0 mẫu 2 sào 1 thước. Ở La Lai 0 mẫu 7 sào 0 thước. Tiền 210 quan, ruộng tốt 5 mẫu 2 sào đều chia làm 4 phần để 4 giáp cấy cày luân lượt lấy gạo nếp. Tiền đặt lãi đều để cung vào việc tế tự. Đến ngày mùng 9 tháng 5 niên hiệu Cảnh Hưng thứ 25 (1764) làng bầu làm Khánh thần thờ tại đình bốn mùa kính biếu (4 cỗ thờ tại Từ Đường). Cụ Thất cụ là Đoàn quý thị hiệu Diệu Phụng có ba sào ruộng ở Đồng Giữa cúng họ để cấy cày luân lượt làm giỗ tại Từ Đường. Cụ Hữu Trạch 厚澤 đỗ Nho sinh trúng thức.

Đời thứ mười hai Cụ Quốc Thiệp đỗ Nho sinh trúng thức, làm quan đến tri huyện Huyện Quế Dương. Cụ Quốc Tuân đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Chí Linh được phong tước Kim xuyên Bá. Cụ Thiếu Thực 孝直 đỗ Nho sinh trúng thức. Cụ Quốc Diệu 國雅 đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Đông An. Cụ Quốc Dương 國腸 bủ lâm cục nho sinh. Cụ Quốc Hạo 國脾 đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Hữu Lũng. Cụ Nghiêm Trai 嚴齋 đỗ Nho sinh trúng thức. Cụ Lâm cục Nho sinh

Đời thứ mười ba Cụ Thượng Chất 尚質 làm quan đến tả xuân phường, tả dụ đức, Kim lĩnh bá, Gia hạnh đại phu. Cụ cúng làng 120 quan tiền và 2 cây gỗ thiết đĩnh dài 12 thước để chữa đình. Ngày 10 tháng Giêng niên hiệu Quang Trung thứ 5 (1792) làng bầu cụ làm Tuyên thần thờ tại đình, xuân thu kính biếu (tháng Giêng và tháng chín mỗi lần một cỗ biếu tại Từ Đường). Cụ Quốc Thực đỗ Nho sinh trúng thức. Cụ Danh Long 隆 đỗ Nho sinh trúng thức làm quan đến tri huyện Huyện Thủy Đường. Cụ Thái Vũ 泰宇 đỗ Hương cống làm quan đến tri phủ Phủ Thiên quan. Cụ Minh Đạo 明道 làm quan Nho học huấn đạo.

Đời thứ mười bốn Cụ Quốc Xiêu 超 Cụ Danh Chinh 盛 đỗ Hương Cống. Thôn Phú Xuân bầu cụ làm hậu thần thờ tại hành hậu đình thôn ấy, xuân thu kính biếu mỗi lần một cỗ thờ tại Từ Đường ông Sĩ Quán.

Đời thứ mười lăm Cụ Sĩ Bưu 仕彪 đỗ hai khoa Tú tài. Cụ hay làm việc công ích như: cụ đứng chữa đình cho thôn Phú Xuân, nhân dịp này cụ làm hậu cho cụ Cống, cụ đứng làm ba gian Từ Đường thượng thực hạ hư họ Đại Tôn (là nhà thờ ông Bá Năng ở phụng tự) vân vân. Cụ làm 5 gian nhà thờ và ba gian nhà khách bằng gỗ lim lợp ngói để thờ từ cụ Huyện Thủy Đường trở xuống (là từ đường ông Sĩ Quán ở phụng tự). Cụ Sĩ Đoán 仕鍛 đỗ Cử nhân khoa Tân Sửu Ân khoa làm quan đến Tri phủ Phủ Thông Hóa Phụng thành Đại phu. Làng bầu cụ làm hậu thần.

Đời thứ mười sáu Cụ Sỹ Chực 仕淑 đỗ Tú tài làm quan đến thông phán tỉnh Lạng Sơn.

Đời thứ mười bẩy Cụ Sỹ Lê 仕棣 đỗ Cử nhân khoa Mậu Tý niên hiệu Đồng Khánh thứ 3 (1888) vua Cảnh Tôn nhà Nguyễn, làm quan đến Hậu bổ tỉnh Ninh Bình thăng thụ hàn lâm điển tịch. Đến khoa Ất Mão niên hiệu Duy Tân thứ 9 (1915) thì Hương xong thì Nhà nước thôi không thi chữ hán nữa. Nghị định bãi thi Hương ngày 23 tháng 12 năm 1918 niên hiệu Khải Định thứ 3 (Mậu Ngọ).

TỔNG KẾT: Xem phả nhà ta từ triều nhà Trần (1225-1400) lấy võ công phong tước; đến triều nhà Lê về sau lấy văn chương hiển đạt: từ cụ Nhân Thiếp đỗ tiến sĩ khoa Bính Tuất niên hiệu Quang Thuận thứ 7 (1466) vua Thánh Tôn nhà Lê đến cụ Sỹ Lê đỗ Cử nhân khoa Mậu Tý niên hiệu Đồng Khánh thứ 3 (1888) vua Cảnh Tôn nhà Nguyễn (1888-1466) là được 422 năm nối đời hiển đạt, khoa có đến Bảng nhãn, hoạn có đến Phong hầu, quả đúng với lời lưu bút của các thầy Địa lý để hai ngôi đất: ở Vọng Nguyên Ngọc Đôi và Phao Sơn Phả Lại. Báo Tri tân tạp chí khảo cứu về Nho học và khoa cử nước Nam ta số báo 58 xuất bản ngày 11 tháng 8 năm 1942 có phẩm bình khoa cử của họ Nguyễn nhà ta rằng: "trong khoảng ba mươi năm một họ chín tiến sĩ thật là một nhà thi thư thịnh vượng xưa nay ít có vậy". Ngày 26-12 Đinh mùi (Chiêu thống nguyên niên 1785), làng Kim Đôi bị triệt hạ cả. Cụ Huyện Đông Yên, Cụ Phạm Nguyễn Đạt họp dân dẫn quân chống quân Tây Sơn được 19 ngày thì bị thua

Đoạn thứ hai

CHÉP THÊM TỪ ĐỜI THỨ MƯỜI SÁU TRỞ XUỐNG

Cụ Sỹ Đồi 仕涪 sinh năm Ất - mùi niên hiệu Minh - mệnh thứ 16 (1835) vua Thánh - Tôn nhà Nguyễn. Cụ tính điềm tĩnh hòa nhã, không đi thi khoa nào chỉ ở nhà dạy học, học trò ở các làng Thị cầu, Đáp - cầu, Ngọc đôi và làng nhà có nhiều người thành tựu. Thời hiệu Kim - Khê xử sĩ. Đến một giờ chiều ngày mùng năm tháng sáu năm Bính tuất niên hiệu Đồng Khánh thứ nhất (1886) cụ mất.

Đời thứ mười bẩy Cụ Sỹ Đỉnh 仕梃 tên chữ là Trực - Khanh 直 sinh năm Bính thìn niên hiệu Tự Đức thứ 9 (1856) vua Dực - Tôn nhà Nguyễn. Cụ 18 tuổi học đã có tiếng hay chữ và đã lên ngồi dạy học ở Thị cầu, nhưng đường khoa cử của cụ không được hanh thản. Suốt đời cụ khoa Hương nào cũng vào đến đệ tam trường, vì cụ sinh ra cụ chỉ có một mình cụ, cụ vẫn còn đảm nhiệm cả việc nhà, cụ đã có khi buôn bán gạo với người trung hoa.

Đến năm Quý mão niên hiệu Thành thái thứ 15 (1903), cụ đến tuổi lên thôn trưởng bận ăn lo việc làng, tháng sáu năm ấy cụ Chính - thất mất việc nhà càng thêm mang bách, kế đến năm Giáp thìn (1904) cụ phải vào cai đám nữa.

Năm Đinh mùi niên hiệu Thành thái thứ 19 (1907) nhà nước cải lương việc học, lập các trường tổng học hàng Tổng, bầu cụ làm Tổng sư trường tổng Đạo chân nhà lần thứ nhất, cuối năm ấy cụ đến tuổi lên lão 53 tuổi, cụ xin từ chức Tổng sư luôn thể, tính cụ trung trực không thích trong vòng cương tỏa. Đầu năm Mậu thân (1908) cụ lên nhà Thị - cầu ở, lại dạy học, biết tiếng cụ các hạ sĩ quan đóng ở Doanh cầu nhiều người đến học. Được đến tháng năm cụ bị mệt nặng về nhà dưỡng bệnh, đến tám giờ sáng ngày hai mươi ba tháng bẩy niên hiệu Duy tân thứ 2 (1908) cụ mất.

Đời thứ mười tám Sĩ Khái 仕 tên chữ là Tường - Quang 祥光 sinh năm Tân - mão niên hiệu Thành - thái thứ 3 (1891) Triều nhà Nguyễn, sáu năm sau (6) tuổi vỡ lòng học chữ Hán, đến tháng sáu năm Quý mão (1903) thôi học vì u tôi mất, thầy tôi thì đến lượt lên thôn trưởng ở làng, lại phải cai đám nay việc dân mai việc quan, nào lại phải lo tiền ứng tạm cho làng nữa, thành phải bỏ cả việc nhà, ngồi ăn núi lở, gia đình kém sút dần đi.

Năm tôi mười lăm tuổi (1905) phải bắt đầu lưu lạc lên ở Đáp cầu trước nhất, cuối năm 1906 tôi lên tỉnh Bắc - giang vào học làm thợ sắt ở nhà máy xe lửa. Đầu năm 1908 Chính - phủ đem nhà máy ấy vào Trường thi ở tỉnh Nghệ An (Vinh) tôi theo nhà máy vào Vinh, từ đây tôi ngày đi làm tối đi học chữ quốc ngữ và chữ Pháp. Trong khoảng từ năm 1908 đến năm 1916, khi tôi làm ở nhà máy Trường - thi lúc làm ở nhà máy Cưa hay nhà máy Diêm ở Bến thủy.

Năm 1916 tôi không làm ở Vinh nữa đi Xiêm - khoáng (Xieng kuong Laos) làm nhưng không chịu thủy thổ lại về. Năm 1917 đi Hải - phòng làm với các nhà máy đóng và chữa các thứ tầu - thủy. Năm 1918 tôi về làm nhà máy - cưa tại tỉnh lỵ Nam Định, tháng tám năm 1920 tôi về làm ở nhà máy giấy Đáp - cầu (Bồ - mê). Đến đây tôi lại về gây dựng lại cơ nghiệp ở quê nhà, tậu nhà đất, mua ruộng và chuộc lại cái đất của nhà ở khi xưa.

Năm 1922 tôi lại tậu cái đất nhà hiện ở, nhưng nhà cửa đã làm lại nhiều lần, cuối năm 1922 tôi lại đi Hà nội làm với các xưởng bán và chữa các thứ xe ô-tô. Năm 1925 đi Cao Bằng làm với công ty vận tải bằng xe ô-tô từ Tĩnh - túc (Cao Bằng) đến Na - châm (Lạng Sơn). Trong thời kỳ bay nhẩy vừa kể trên này, không ngoài sự được cao lương hơn hay được chỗ để sưu tầm tài liệu về nghệ thuật cho tiến bộ. Thời kỳ này là kết quả sự cố gắng học hành, nghiên cứu và sưu tầm tài liệu của cả ba anh em.

Tháng tám năm 1926 tôi xin thôi không làm ở Cao bằng nữa về. Ông Huân thôi không làm ở nhà máy tơ Nam - định về, ông Duyên cũng xin thôi ở nhà máy - giấy Đáp cầu. Ba anh em cùng mở một xưởng chữa và cho thuê xe ô tô ở Thị - cầu. Sau khuếch trương xưởng ấy ra Thanh Lơn gần huyện lỵ Võ Giàng lại sắm thêm xe ca chở hành khách và buôn bán các đồ phụ tùng xe ô-tô. Năm 1933 lại mở thêm một xưởng chi nhánh nữa ở Việt - Trì, tôi lên coi xưởng ấy, đến tháng mười năm 1934, tôi mệt về nghỉ ở quê nhà.

Đến thời kỳ này thực lòng tôi không hề tưởng đến bao giờ, vì vẫn chuyên chú về đường thực nghiệp. Nhân cuối năm 1934 tôi mệt về nghỉ ở quê nhà, thì ở làng Hội - Đồng tộc biểu mãn khóa. Làng có sức bầu Hội đồng khác thay, làng tin yêu mới ép làm chức Chánh - hương hội, thực nghĩ tình quá nể mà trong làng cũng ít công việc có thể vân vi được cả việc nhà, vì xưởng ở gần huyện lỵ. Nhưng việc đời không thể lưỡng toàn.

Đầu năm 1935 Hội đồng mới nhận việc thì làng lại khuyết luôn chức Lý trưởng, chưa có ai ra ứng cử, thì việc đê và việc thuế đã đến, vì tình cảnh bó buộc đành phải tạm ở nhà để gánh vác việc làng. Tháng hai năm 1936 tuy bầu được chức Lý - trưởng rồi nhưng nhiệm vụ còn nhiều việc lan man không thể rút được, vì chưa mãn khóa sáu năm đành nhất định ở nhà để lo lắng việc công.

Tháng năm năm 1936 đổi luật nước và hàng tổng tin yêu thăng bổ lên làm chức Chánh tổng, Tổng Đạo - chân nhưng vẫn kiêm chức Chánh - hội ở làng. Năm 1938 Chính phủ đổi ngạch thuế điền mà thời hạn thì gấp. Tôi được bao - tử "Biết tuân nghị mới, thừa hành trọn phận sự, tỏ ra là người mẫn cán", đến năm 1940 tôi được Sắc thưởng hàm Cửu - phẩm bá hộ, tháng Giêng năm 1941 tôi lại được Bao - tử về việc làm đê Ngũ - huyện Khê.

Từ khi tôi bước chân vào đường chính trị bao giờ cũng lấy thanh - cần làm tiêu chuẩn và cải lương hương chính các việc công ích làm mục đích, nên Đoàn - thể tin yêu mà dân làng cũng tin cậy, như: Văn - hội huyện Võ - Giàng trước đã tham dự ban trùng tu văn - chỉ sau lại được hội bầu vào Ban trị sự liền mấy khóa. Ở làng trước đã xây dựng lại: Tam - quan, Điếm - canh, Miếu Đức bà và sửa chữa đình nghè, dựng trường học, tục lệ vì hoàn cảnh, chỉ tỉnh giảm được những tục lệ xa xỉ phiền nhiễu và vứt bỏ những mục nát, vẫn chưa đạt đích.

Sau cuộc Tổng khởi nghĩa ngày mười - chín tháng tám năm 1945 (Ất dậu) dân làng tin cậy bầu làm Chủ tịch Ủy - ban - nhân - dân theo đà tiến hóa, bãi bỏ hết sạch cả tục lệ cũ bó buộc đến nỗi có người hết cả cơ nghiệp vì đến nợ miệng. Đem bốn Giáp hợp lại một mối. Tổ chức lại tất cả lập Hương - ước mới thích hợp trình độ tiến hóa hiện thời. Tập trung tất cả các thứ ruộng công của dân bốn Giáp lại rồi đem chia đều cho anh em đinh - giai từ 18 tuổi đến 50 tuổi mỗi người lĩnh canh một phần. Khi trước ai mạnh - cánh thì được cấy nhiều, không được công bình. Cốt yếu là giải phóng sự áp bức và dỡ bỏ những món nợ miệng để nâng cao đời sống của dân làng cho được ung dung tự - do hơn khi trước. Ngày hai mươi nhăm tháng Giêng năm 1946 chính phủ biến chuyển sang làm Chủ tịch Ủy Ban Hành Chính.

Ngày 11 tháng 4 năm 1946 tôi được giấy khen của Thượng - cấp khen thưởng là: "Đã tận tâm với chức vụ, sốt sắng cải tổ trong xã, các phương diện như: chính trị, kinh tế, văn hóa xã hội vân, vân, tỏ ra là một người có công tâm trong cuộc kiến thiết Quốc - gia trong lúc này". Ngày 30 tháng 4 năm 1946 mãn khóa, làm bàn giao công việc cho Ủy Ban Hành Chính liên hiệp xã Kim - Quỳnh - Ngọc (hợp 3 xã làm một U.B.H.C. này là đầu tiên).

Sau khi làm bàn giao công việc cho Ủy Ban Hành Chính, kiểm điểm lại công việc trong hơn bốn mươi năm, lăn lóc với cuộc đời gió bụi thấy tuổi đã già sức yếu, mặc dầu sự nài ép không dám tham gia các việc có hạn định, lòng vẫn còn ân hận. Mấy hôm thì Ủy Ban Hành - Chính liên xã Kim Quỳnh Ngọc làm lễ khai mạc. Huyện Bộ Việt Minh Võ giàng về vận động đi hoạt động thoát ly. Nói: "Huyện đã nhận xét kỹ càng, thấy cụ gốc rễ là Công nhân đã từng gian khổ, có tinh thần cách mạng lại có uy tín với nhân dân. Đã thấy rõ trong khi cụ làm Chủ tịch ủy ban hành chính xã Kim đôi, có thành tích như U.B.H.C. Huyện Võ giàng đã khen ngợi mà vận động cụ ra làm Phó chủ tịch U.B.H.C. Huyện cụ không chịu nhận, đáng tiếc! Nay Huyện Bộ Việt Minh lại đề nghị cụ lên Huyện làm công tác Dân vận với Huyện nhà. Mong cụ đồng ý với Huyện".

Tôi vốn từ 16 tuổi tới nay quen đi làm với các xí nghiệp, nhận thấy, nếu làm việc không chu đáo thì không làm còn hơn, mà bây giờ đã có tuổi chỉ sợ không làm trọn nhiệm vụ. Huyện nói: "Căn cứ vào tinh thần Cách mạng của cụ, cụ cứ lên huyện, khi khỏe mạnh thì góp phần vào cuộc kiến thiết Tổ quốc, khi nào mỏi mệt thì nghỉ, làm cách mạng không có hạn định nào cả. Cứ cố gắng! đi hoạt động cách mạng cũng có lúc hứng thú lắm ạ!". Thấy Huyện nói hợp với ý nguyện của mình lại nhớ câu: "Tỉnh ếch, hồi thơi" của cổ nhân, nhận lời Huyện, thu xếp việc nhà để đi hoạt động thế mà thấm thoắt đến nay, đã mười mấy năm trời với cuộc đời sóng gió, chóng thật. Ngựa hồ qua cửa sổ! nhân đêm không ngủ được, hồi tưởng cuộc đời dĩ vãng tạm sơ kết như sau:

Còn nhớ buổi sáng ngày 18-7-1946 lên Huyện, tối Huyện mời đi dự thính cuộc họp Huyện ủy mở rộng (sau được tổ chức vào Đảng Cộng Sản Đông - Dương mới rõ). Trong cuộc họp huyện ủy mở rộng, các ông ấy dụng ý tuyên truyền mình khi giải lao hết ông này đến ông nọ tán dương thành tích công tác vừa qua của mình, thấy cũng vui vui, sau Huyện phân công đi tổ chức và củng cố đoàn thể Nông dân ở các xã trong huyện. Trước khi ra đi huyện nhắc lời dạy của Hồ Chủ tịch "làm cách mạng phải thận trọng, khiêm tốn nhẫn nại, thắng không kiêu bại không nản, quyết chí sẽ thành công". Rất để tâm thực hiện những lời dạy ấy, đến xã nào làm cũng được việc, Huyện cũng nhận thấy phấn khởi. Được ít lần Huyện cử làm đại diện của Huyện hợp với phái đoàn Tỉnh đi dự cuộc triển lãm ở Nhã Nam để về kết hợp với việc củng cố giới Nông Dân và nói chuyện với nhân dân trong huyện.

Năm 1947 được tổ chức vào Đảng Cộng Sản Đông Dương, được Đảng giáo dục bồi dưỡng, cũng hết lòng phục vụ Đảng Chính phủ, và phục vụ nhân dân, cố gắng công tác. Cứ phụ trách Nông vận trước Huyện ủy Võ giàng vẫn ở Ban chấp hành mặt trận Việt Minh Huyện. Năm 1948, khi đại hội bầu Ban chấp hành Huyện Võ giàng, được tuyên dương thành tích trước đại hội tặng giấy khen thưởng: "Có tinh thần trách nhiệm, làm trọn nhiệm vụ". Nông dân toàn huyện bầu làm Bí thư Ban chấp hành Nông dân huyện và đứng trong Ban chấp hành mặt trận Việt Minh huyện.

Sang tháng Giêng năm 1949 Huyện ủy điều động sang đoàn thể Phụ lão. Phụ lão toàn huyện bầu làm Bí thư Ban chấp hành Phụ lão huyện, lên Tỉnh lại trúng cử vào Ban chấp hành Phụ lão Tỉnh chịu trách nhiệm trước Huyện ủy Võ giàng làm Bí thư Đảng đoàn Phụ lão huyện. Vẫn ở cơ sở bám sát địa phương làm thuế nông nghiệp là Chi ủy viên phụ trách thôn Lim đôi thi hành mọi chủ trương chống địch có kết quả, Thị ủy Bắc ninh tặng giấy khen thưởng năm 1953.

Đến 1-1-1951 Tỉnh ủy điều động về thị xã Bắc ninh làm cán bộ mặt trận Ban chấp hành mặt trận Liên Việt trực tiếp làm Phó chủ tịch Ủy ban Liên Việt thị xã Bắc ninh. Đến 22-7-1952 Tỉnh ủy điều động về Chi bộ Lim - Chân để củng cố tình thế rất gay vì có mấy tên phản: Nhược là Bí thư, Đội ra hàng địch, Kiều thì địch quây càn luôn luôn, hầm bí mật bị lộ cả, mà có ngày phải ở hầm tới 14 hay 15 giờ. Có hôm bị ngạt, vì tuổi già ốm yếu và đau mắt, tháng Giêng 1954 Thị ủy và Chi Bộ cho ra Ty y tế tỉnh Bắc ninh (đóng tạm ở Nhã Nam Thái nguyên để dưỡng bệnh). Đến tháng 7-1954 về Chi ủy phân công phụ trách Phụ lão và tham gia giúp đỡ Trưởng thôn Kim đôi mọi việc.

Đến cải cách ruộng đất bị kích oan lên địa chủ, tài sản bị tịch thu, sự ức khổ cực không bút nào tả xiết, qua cơn dông tố to thêm biết thói đời đen bạc, thay đổi câu đối của cổ nhân là đúng "Nhân tình lịch tận thu phong hậu. Thế lộ kinh qua thục đạo bình". Đến ngày 15-9-1956 bắt đầu sửa sai, được xuống thành phần công nhân như cũ được trả lại Đảng tịch. Chi Bộ phân công phụ trách Mặt trận tổ quốc Việt Nam tại xã Kim Quỳnh. Được tặng thưởng kỷ niệm kháng chiến tại quyết định số 310/TCCB ngày 13-2-1958 của Ủy ban hành chính tỉnh Bắc ninh. Kèm Huy hiệu kháng chiến tại quyết định số 90 ngày 24-3-1958 của Bộ nội vụ nước Việt Nam dân chủ cộng hòa. Ngày 9-9-1958 được Ty Giáo dục Bắc ninh khen thưởng về thành tích xây dựng duy trì phong trào diệt dốt do quyết định khen thưởng số 10 ngày 4-8-1958.

Ngày 1-11-1958 lại trúng cử vào Ủy ban Mặt trận Tổ quốc Việt Nam huyện Võ giàng.

Kinh nghiệm:

Ưu điểm: Không bị kỷ luật bao giờ cả, lại được khen thưởng 8 lần (Võ giàng 2 lần, Thị xã 1 lần, Tỉnh Bắc ninh 1 lần, Ty giáo dục Bắc ninh 1 lần, Xã 1 lần). Mười mấy năm công tác cách mạng có kinh nghiệm, vết dầu loang làm nhỏ ăn chắc, thí dụ: khi làm việc gì, trước làm...

Khuyết điểm: Bản tính trung trực nhưng không biết chiều thời, tìm ít người để giáo dục cho tiến bộ (và đồng thời cũng tìm những người lừng chừng để tuyên truyền giáo dục rồi tổ chức, do những người giác ngộ đó đẩy mạnh phong trào). Từ khi mới đi hoạt động vẫn làm kế hoạch ấy, thấy rất kết quả, nhưng thực vẫn không dám nói ra, vẫn cho mình không có khả năng làm to. Sau mấy năm gần đây cũng cho kế hoạch ấy là đúng. Có nhiều thiệt thòi cho bản thân cũng như đường tiến bộ

Đời thứ bẩy Cụ Lỵ Nhân Phủ tri Phủ húy Đương hiệu Ngu-Khê 愚溪 mất ngày mùng... tháng Mười an táng ở cái Gò tròn xứ Đồng Chạch làng Quỳnh - đôi. Chính thất Nguyễn Quý Thị thụy Trinh Biểu 貞表 mất ngày mùng ba tháng Giêng hợp táng với mộ cụ ông. Sinh ra: Con giai: Ông Bỉnh Quân 秉均.

Đời thứ tám Cụ Nho sinh trúng thức húy Quân thụy Quế Khai 桂開 mất ngày mười bẩy tháng Bẩy an táng ở gốc bên hữu cây Mộc thẳng thuộc địa phận xã Xuân - Lội (nay là Xuân hòa, Xuân bình, Đông côi và Ngư - Đại) trông về xã Đất - Phí. Chính thất thụy Nhân Hiếu 仁孝 mất ngày hai mươi mốt tháng Chạp an táng ở xứ Vọng-Nguyên ngoài mộ tổ. Sinh ra: Con giai: Ông Bô tên chữ là Nhân-Hiệp 仁洽.

Đời thứ chín Cụ Thượng Nhỡn Huyện Tri Huyện húy Bô tên chữ là Nhân Hiệp thụy Trực Chai 直齋 mất ngày hai mươi tám tháng Chín an táng ở mái thị cầu gần mộ tổ Thất Thượng. Chính thất Phạm quý thị thụy Trinh Huyền 貞玄 là cháu gái cụ Châu Khê Hầu mất ngày mùng mười tháng chạp an táng ở xứ Đồng Dầu làng Quỳnh đôi. Sinh ra: Con giai: Ông Đức Bao 德褒.

Đời thứ mười Cụ Phú Lương Huyện Tri Huyện húy Bao thụy Đạt-Đạo 達道 hiệu Chất-Trực 質直 mất ngày mùng sáu tháng Ba an táng ở đằng trước mộ tổ xứ Vọng-Nguyên. Chính thất Nguyễn quý thị húy Nhị hiệu Trinh Minh 貞明 mất ngày mùng một tháng Bẩy an táng ở xứ Đồng Guột đằng trước làng Quán Tướng. Sinh ra: Con giai: Ông Đức Phương 德芳, Quốc Quang 國光 sau đổi là Anh 瑛.

Đời thứ mười một Cụ Canh thìn khoa tiến Sĩ, Đại-Lý-Tự-Khanh, Tu thận Doãn Tham-Chính húy Quang sau đổi là Anh thụy Đạt quốc hiệu Kính Thái 鏡泰 mất ngày mùng sáu tháng Sáu, thọ 76 tuổi an táng ở xứ Đồng - Guột trông vào núi Tam-thai. Chính thất Hoàng Quý thị húy Hoan 歡 hiệu Diệu Thuần 妙純 (Cụ là con gái cụ Trung Thành Hầu ở xã Thổ Hoàng, Huyện Thiên thi) mất ngày mùng sáu tháng Bẩy hợp táng với mộ cụ ông. Sinh ra: Con giai: Ông Quốc Thiệp, Quốc Diệu 國雅, Quốc Tuân 國俊, Quốc Dương 國腸, Quốc Hạo 國脾. Con gái: Bà thị Toán 漢 hiệu... gả cho ông Phạm Chuẩn 范淮 Hồng Lô tự thừa miên trạch bá sinh ra ông Phạm-Nguyễn Đạt 范阮達; Bà Thị - Cẩm. (Các cụ tổ từ đời thứ mười một trở lên thờ ở Từ Đường đại tôn. Ông Bá Năng phụng tự).

Đời thứ mười hai Cụ Hữu-Lũng huyện tri huyện húy Hạo tên chữ là Thường Giáo thụy Thực Thái 實泰 mất ngày hai mươi bẩy tháng chạp an táng ở bãi Đồng Guột. Chính thất Nguyễn quý thị hiệu Trinh Liệt mất ngày mùng tám tháng Ba an táng ở đồng bãi bông Côi. Sinh ra: Con giai: Ông Quốc Thực 宴, Quốc Bá 三, Danh Long 隆. (Các cụ tổ thứ mười hai thờ ở Từ-Đường Văn Ngại phụng tự).

Đời thứ mười ba Cụ Thủy - Đường huyện tri huyện húy Long tên chữ là Chính Hòa 正和 mất ngày mùng mười tháng năm an táng ở xứ Đồng Nôm (cạnh xóm Rừng) làng Ngọc - đôi. Chính thất Nguyễn quý thị thụy Trinh Thành 貞誠 (cụ người làng Bất Phí) mất ngày mùng chín tháng Chạp an táng ở chân hình - nhân (khu dưới). Á-Thất Nguyễn-quý thị thụy Trinh-Thành 貞清 (cụ là em ruột cụ chính thất) mất ngày hai mươi chín tháng hai an táng ở đồng bãi bông Côi. Thứ thất Lã Quý thị hiệu Diệu Bảo 妙保 cụ người làng Bảo Sơn Bắc Giang. Thứ thất Dương Quý thị hiệu Diệu Hòa 妙和 cụ người làng Hoa Thức mất ngày hai mươi sáu tháng Ba. Sinh ra: Con giai: Ông Danh Chinh 盛 (Chính thất sinh ra), Ông Danh Quý 貴, Danh Đăng (thứ thất sinh ra).

Đời thứ mười bốn Cụ Cống-Sinh húy Chinh tên chữ là Năng Mẫn 能敏 mất ngày mười chín tháng Ba an táng ở bãi Hình nhân (khu trên). Chính thất Phạm-quý thị hiệu Diệu Đức 妙德 (cụ là con cụ Huyện Đông Yên) mất ngày mười bốn tháng năm an táng ở Đồng Giữa. Á Thất Nguyễn-Quý thị hiệu Diệu Lĩnh. Sinh ra: Con giai: Ông Sỹ Bưu 仕彪, Sỹ Đoán 仕鍛 (Chính thất sinh ra). Con gái: Bà Bá quết Cân sinh ra Chi ông bá Tứ, ông Chánh Diềm v.v. Bà Đỗ Khính vô tử hoàn tôn. Bà Bố Cả sinh ra Chi cụ Tuần - Đốc. Bà Bố hai sinh ra chi cụ Ấn-Đạt ở Nội - Duệ, Tiên - Du.

Đời thứ mười lăm Cụ Tú tài húy Bưu tên chữ là Bỉnh Khiêm 炳謙, thọ hơn 70 tuổi mất ngày hai mươi chín tháng Năm an táng ở Gò Thóc cận Đồng Guột. Chính thất Nguyễn quý thị hiệu Diệu Bảo (cụ người làng Ngọc Đôi) mất ngày hai mươi tháng tám an táng ở Đồng Lòng Bé. Thứ thất Nguyễn-Quý thị (cụ người làng Đa-mai Bắc Giang) mất ngày tháng an táng ở Phường hầu. Sinh ra: Con giai: Ông Sỹ-Đồi 温, Sỹ Chực 淑 (Cụ Chính-thất sinh ra), Ông Sỹ Chực 澂, Sỹ Bồi 涪 (Thứ-thất sinh ra). Con gái: Bà Sư (bán thế xuất gia lên đến sư bà) Chính-thất sinh ra. Bà Lầu Kiếm (lấy chồng ở Hà Nội) Thứ thất sinh ra. (Các cụ tổ từ đời thứ mười ba đến đời thứ mười lăm thờ ở Từ Đường Sỹ Phô phụng tự).

Đời thứ mười sáu Cụ Kim Khê Xử-Sỹ húy Đồi tên chữ là Thúc Mỹ 識美 hiệu Cúc-Viên 菊文 sinh năm Ất-mùi niên hiệu Minh-mệnh thứ 16 (1835) vua Thánh Tôn nhà Nguyễn mất ngày mùng năm tháng Sáu năm Bính tuất niên hiệu Đồng Khánh thứ nhất (1886) thọ 52 tuổi an táng ở Đồng Bé. Chính thất Nguyễn quý thị húy Thứ 富 hiệu Từ Hữu 慈有 cụ người làng Thị cầu mất ngày mười ba tháng tám năm Canh tý niên hiệu Thành-thái thứ mười hai (1900) an táng ở Phường hầu Đồng Guột. Sinh ra: Ông Sỹ-Đỉnh 仕様.

Đời thứ mười bẩy Cụ Khoa Hương Trúng Nhị-trường húy Đỉnh tên chữ là Trực-Khanh 直 hiệu Thế-Chỉ 制之 sinh năm Bính thìn niên hiệu Tự Đức thứ 9 (1856) vua Dực Tôn nhà Nguyễn, mất ngày hai mươi ba tháng Bẩy năm Mậu-thân, niên hiệu Duy-tân thứ hai (1908) thọ 53 tuổi an táng ở xứ Vườn đồn (cạnh xóm Lựa về phía Cống cụt). Chính thất Nguyễn Quý thị húy Chính 正 hiệu Đoan-Nhất 端一 sinh năm Canh-thân niên hiệu Tự Đức thứ 13 (1860) (cụ là chị cụ Hàn Mai ở làng Khắc bảo, tổng Sơn Nam) mất ngày hai mươi chín tháng Sáu năm Quý-mão niên hiệu Thành-thái thứ mười lăm (1903) thọ 44 tuổi an táng ở Phường hầu Đồng Guột. Á-Thất Nguyễn-Quý thị húy Y hiệu Diệu Chỉ 妙詩 Sinh năm Giáp tý niên hiệu Tự-đức thứ 17 (1864) (cụ người làng Thị-cầu) mất ngày hai mươi mốt năm Nhâm-dần (1950) an táng ở Đồng Khoai cạnh Bãi Ơn phía bên đồng (giỗ 21 tháng 11). Sinh ra: Con giai: Sỹ Khái 仕, Huân 仕煇, Duyên 仕煊 (Á-Thất sinh ra). Con gái: Chị An (Chính thất sinh ra), Chị Hiểu, Chị Giệu (Á-Thất sinh ra). Chị An gả cho ông Lê hữu Tài ở làng Thể giao hộ thứ bẩy Hà Nội sinh ra Giần. Chị Hiểu gả cho con giai trưởng cụ Hàn Phụng thành Đại Phu Nguyễn-Thuyên ở Thị cầu là Nguyễn-Hữu Lục sinh ra Nguyễn Chí, Nguyễn Vinh, Nguyễn Trường.

Đời thứ mười tám Ông Ủy viên Ủy ban Mặt trận tổ quốc Việt Nam Huyện Võ giàng húy Khái tên chữ là Tường Quang 祥光 hiệu Thuần Nghị 純毅 sinh năm Tân Mão niên hiệu Thành thái thứ ba (1891) từ trần hồi 12 giờ ngày 25 tháng 8 năm Kỷ hợi (1959) thọ 69 tuổi, an táng ở Đồng Guột. Chính thất Trần Quý thị húy Thơm hiệu Diệu Phúc 妙馥 sinh năm Đinh-hợi niên hiệu Đồng khánh thứ hai (1887) (là con cụ Trần viết Trung ở thôn Thúc Lộc, xã Hà Lạn, tổng Kiên trung Huyện Hải hậu Nam-định) mất 4 giờ chiều ngày mười một tháng Năm năm Tân Mão 1951 thọ 64 tuổi an táng ở Đồng Lợi. Sinh ra: Con giai: Sỹ Khắc 仕克, Sỹ Khâm 仕欽. Con gái: Chị Khảng 氏慷, Chị Thiên 氏遣. Chị Khảng gả cho Nguyễn-quang-Đôn là con giai thứ hai ông chánh-hương hội Nguyễn văn Liệt người trong cùng làng Kim Đôi sinh ra Nguyễn-Thị Lan. Chị Khiển gả cho Đặng ngọc-Thạch là con trưởng ông Lý trưởng Đặng ngọc-Toản người ở làng Xuân-hội, Tiên-Du.

Đời thứ mười chín Ông Nguyễn Sỹ Khắc sinh năm Nhâm tuất (1922). Chính thất Nguyễn quý húy Lược hiệu diệu Dược sinh năm Tân Dậu (1921), từ trần hồi 17h ngày 16-1.... Sinh ra: Con giai: Sỹ Tường, Sỹ Khoa. Con gái: Chị Khang (Lương/Lạng), Chị Liêm. (Gả cho Nguyễn văn Tử, Đức Hình, Quân Lương...).

Đời thứ hai mươi và hai mươi mốt (Phần này được viết thêm, bổ sung tên các cháu chắt các thế hệ sau)

Ông Nguyễn Sỹ Thường sinh năm Đinh Tỵ (1941), vợ là Lê thị Nghĩa sinh năm Kỷ Sửu (1941). Sinh ra: Nguyễn Khoa (1974), Nguyễn thị Nga (1976), Nguyễn thị....

Ông Nguyễn Sỹ Khiêm (1925).

Ông Nguyễn Sỹ Khoa sinh năm Ất Mùi (1955), vợ Nguyễn thị Ly sinh năm Canh Tý (1960). Sinh ra: Sỹ Khánh (Giáp Tý 1985), Nguyễn Thùy Dung (Canh Thìn 1979), Nguyễn Khánh Ly (Nhâm Tuất 1982).

Ông Nguyễn Sỹ Khiết, Ông Nguyễn Sỹ Khung, Ông Nguyễn Sỹ Chúng...

(Trang cuối sổ có ghi thêm dòng): Dòng tộc Nguyễn Sỹ đến nay (năm 2000) đã qua 21 đời (700 năm). Thôn Phú Đôi - xã Kiến Quốc - huyện Kiến Thụy - Hp Hải phòng. Xây năm 1852 - Trùng tu tôn tạo lại năm 2000\\$, 1)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
SELECT '✅ Database setup complete! Demo data loaded.' AS status;
-- ============================================================
