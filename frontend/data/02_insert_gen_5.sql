-- ==========================================
-- DỮ LIỆU ĐỜI THỨ 5 - DÒNG HỌ NGUYỄN KIM ĐÔI
-- Gồm các con của cụ Duyên, Nhân Chù, Nhân Bồng, Nhân Bị, Nhân Đạc, Nhân Thiếp, Nhân Giữ
-- ==========================================

-- 1. Insert People (Đời 5)
INSERT INTO people (
    handle, display_name, first_name, generation, gender,
    is_patrilineal, is_living,
    title, degree, notes, biography
) VALUES
-- 5.1 Cụ Củng Thuận
('P5.1', 'Cụ Củng Thuận (拱順)', 'Củng Thuận', 5, 1, true, false, 
'Lại bộ Tả thị lang - Thái bảo Chung Khánh bá', 'Tiến sĩ khoa Bính Thìn (1496)', 
'Ao khuyến học/ao gối ~8 sào, Chỗ Đột xứ (gần Kim Khê), cống cụt gần đình thôn Phú Xuân; giỗ 13/7 ÂL', 
'Cụ Củng Thuận (chữ Hán 拱順) là bậc hiền đạt đời thứ năm của dòng họ. Cụ 25 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), niên hiệu Hồng Đức 27, thời vua Lê Thánh Tông. Sau khi ra làm quan, cụ thăng đến chức Lại bộ Tả Thị lang, và được triều đình ghi nhận, tặng Thái bảo, phong/ghi tước Chung Khánh bá. Không chỉ nổi bật về khoa danh và quan nghiệp, cụ còn để lại công đức lớn về khuyến học cho dòng họ: cụ lập một “ao khuyến học” (còn gọi ao gối) khoảng 8 sào tại khu Chỗ Đột xứ, phía tây gần Kim Khê, ở vùng cống cụt gần đình thôn Phú Xuân.'),

-- 5.2 Cụ Quản Liêu
('P5.2', 'Cụ Quản Liêu (均僚)', 'Quản Liêu', 5, 1, true, false, 
'Lễ bộ Hữu thị lang, chưởng Hàn lâm viện sự', NULL, 
NULL, 
'Sự nghiệp: làm quan đến Lễ bộ Hữu thị lang, kiêm quản việc Hàn lâm viện (chưởng Hàn lâm viện sự'),

-- 5.3 Cụ Đạo Giền
('P5.3', 'Cụ Đạo Giền (道演)', 'Đạo Giền', 5, 1, true, false, 
'Hiến sát sứ', 'Tiến sĩ khoa Bính Thìn (1496)', 
NULL, 
'Sy Khai ghi cụ 29 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), niên hiệu Hồng Đức 27, thời vua Lê Thánh Tông, làm quan đến Hiến sát sứ.'),

-- 5.4 Cụ Dũng Nghĩa
('P5.4', 'Cụ Dũng Nghĩa', 'Dũng Nghĩa', 5, 1, true, false, 
'Công bộ Thượng thư, Giám sát Ngự sử', 'Hoàng giáp khoa Quý Sửu (1493)', 
NULL, 
'Sy Khai ghi cụ 19 tuổi đỗ Hoàng giáp khoa Quý Sửu (1493), niên hiệu Hồng Đức 24, thời vua Lê Thánh Tông; làm quan đến Công bộ Thượng thư, kiêm Giám sát Ngự sử.'),

-- 5.5 Cụ Viên
('P5.5', 'Cụ Viên (勛)', 'Viên', 5, 1, true, false, 
'Lễ bộ Thượng thư, Tặng Thái bảo', 'Bảng nhãn khoa Bính Thìn (1496)', 
'Từng được gọi là quan Tam nguyên (đỗ đầu cả Hương, Hội, Đình)', 
'Sự nghiệp quan trường: cụ 21 tuổi đỗ Bảng nhãn khoa Bính Thìn (1496), làm quan đến Lễ bộ Thượng thư, và được tặng Thái bảo. Giai thoại: đáng ra cụ được lấy Trạng nguyên, nhưng vua mơ thấy Trạng nguyên “rậm râu cưỡi hổ”; khi truyền lô vua thấy cụ Nghiêm Viên rậm râu và tuổi Dần, nên vua lấy Nghiêm Viên đỗ Trạng nguyên, còn cụ Viên nhà ta đỗ Bảng nhãn.'),

-- 5.6 Cụ Kính
('P5.6', 'Cụ Kính (敬)', 'Kính', 5, 1, true, false, 
'Binh bộ Thượng thư', 'Tiến sĩ khoa Bính Thìn (1496)', 
'Hai lần đi sứ Tàu', 
'Sự nghiệp: cụ 18 tuổi đỗ Tiến sĩ khoa Bính Thìn (1496), làm quan đến Binh bộ Thượng thư, và hai lần đi sứ Tàu. Khoa ấy cụ thực đỗ Thám hoa, nhưng vua xem quyển, châu phê “không hiểu đối sách” nên đánh xuống Tiến sĩ.'),

-- 5.7 Cụ Bá Tuấn
('P5.7', 'Cụ Bá Tuấn (伯俊)', 'Bá Tuấn', 5, 1, true, false, 
'Hiến sát sứ Thái Nguyên', 'Tiến sĩ khoa Canh Tuất (1490)', 
NULL, 
'Sy Khai ghi cụ 22 tuổi đỗ Tiến sĩ khoa Canh Tuất (1490), làm quan đến Hiến sát sứ Thái Nguyên.')
ON CONFLICT (handle) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    first_name = EXCLUDED.first_name,
    generation = EXCLUDED.generation,
    title = EXCLUDED.title,
    degree = EXCLUDED.degree,
    notes = EXCLUDED.notes,
    biography = EXCLUDED.biography;

-- 2. Cập nhật Families cho Đời 4 để link Đời 5 làm con cái
-- Cụ Duyên (4.1) -> 5.1 Củng Thuận
UPDATE families SET children = array_append(children, 'P5.1') WHERE handle = 'F4.1' AND NOT ('P5.1' = ANY(children));
UPDATE people SET parent_families = array_append(parent_families, 'F4.1') WHERE handle = 'P5.1' AND NOT ('F4.1' = ANY(parent_families));

-- Cụ Nhân Chù (4.2) -> 5.2 Quản Liêu
UPDATE families SET children = array_append(children, 'P5.2') WHERE handle = 'F4.2' AND NOT ('P5.2' = ANY(children));
UPDATE people SET parent_families = array_append(parent_families, 'F4.2') WHERE handle = 'P5.2' AND NOT ('F4.2' = ANY(parent_families));

-- Cụ Nhân Bồng (4.4) -> 5.3 Đạo Giền
UPDATE families SET children = array_append(children, 'P5.3') WHERE handle = 'F4.4' AND NOT ('P5.3' = ANY(children));
UPDATE people SET parent_families = array_append(parent_families, 'F4.4') WHERE handle = 'P5.3' AND NOT ('F4.4' = ANY(parent_families));

-- Cụ Nhân Bị (4.3) -> 5.4 Dũng Nghĩa
UPDATE families SET children = array_append(children, 'P5.4') WHERE handle = 'F4.3' AND NOT ('P5.4' = ANY(children));
UPDATE people SET parent_families = array_append(parent_families, 'F4.3') WHERE handle = 'P5.4' AND NOT ('F4.3' = ANY(parent_families));

-- Cụ Nhân Đạc (4.7) -> 5.5 Viên
UPDATE families SET children = array_append(children, 'P5.5') WHERE handle = 'F4.7' AND NOT ('P5.5' = ANY(children));
UPDATE people SET parent_families = array_append(parent_families, 'F4.5') WHERE handle = 'P5.5' AND NOT ('F4.7' = ANY(parent_families));
-- Lưu ý: Parent families của cụ Viên map với F4.7 (Nhân Đạc)

-- Cụ Nhân Thiếp (4.5) -> 5.6 Kính
UPDATE families SET children = array_append(children, 'P5.6') WHERE handle = 'F4.5' AND NOT ('P5.6' = ANY(children));
UPDATE people SET parent_families = array_append(parent_families, 'F4.5') WHERE handle = 'P5.6' AND NOT ('F4.5' = ANY(parent_families));

-- Cụ Thân Dư / Nhân Giữ (4.6) -> 5.7 Bá Tuấn
UPDATE families SET children = array_append(children, 'P5.7') WHERE handle = 'F4.6' AND NOT ('P5.7' = ANY(children));
UPDATE people SET parent_families = array_append(parent_families, 'F4.6') WHERE handle = 'P5.7' AND NOT ('F4.6' = ANY(parent_families));

-- 3. Tạo Gia đình mới (Families đời 5) cho các cụ Đời 5 làm cha để link với Đời 6 sau này
INSERT INTO families (handle, father_handle, children) VALUES
('F5.1', 'P5.1', '{}'), -- Gia đình Củng Thuận
('F5.2', 'P5.2', '{}'), -- Gia đình Quản Liêu
('F5.3', 'P5.3', '{}'), -- Gia đình Đạo Giền
('F5.4', 'P5.4', '{}'), -- Gia đình Dũng Nghĩa
('F5.5', 'P5.5', '{}'), -- Gia đình Viên
('F5.6', 'P5.6', '{}'), -- Gia đình Kính
('F5.7', 'P5.7', '{}')  -- Gia đình Bá Tuấn
ON CONFLICT (handle) DO NOTHING;

-- Link Families vào People (Đời 5 có families)
UPDATE people SET families = array_append(families, 'F5.1') WHERE handle = 'P5.1' AND NOT ('F5.1' = ANY(families));
UPDATE people SET families = array_append(families, 'F5.2') WHERE handle = 'P5.2' AND NOT ('F5.2' = ANY(families));
UPDATE people SET families = array_append(families, 'F5.3') WHERE handle = 'P5.3' AND NOT ('F5.3' = ANY(families));
UPDATE people SET families = array_append(families, 'F5.4') WHERE handle = 'P5.4' AND NOT ('F5.4' = ANY(families));
UPDATE people SET families = array_append(families, 'F5.5') WHERE handle = 'P5.5' AND NOT ('F5.5' = ANY(families));
UPDATE people SET families = array_append(families, 'F5.6') WHERE handle = 'P5.6' AND NOT ('F5.6' = ANY(families));
UPDATE people SET families = array_append(families, 'F5.7') WHERE handle = 'P5.7' AND NOT ('F5.7' = ANY(families));

