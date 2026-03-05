-- 01_insert_gen_1_2_3_4.sql
-- Xóa toàn bộ dữ liệu bảng để tạo lại từ đầu theo đúng cấu trúc gia phả mới
TRUNCATE TABLE people CASCADE;
TRUNCATE TABLE families CASCADE;

-- ==========================================
-- ĐỜI 1
-- ==========================================
INSERT INTO people (handle, display_name, gender, generation, title, notes, is_patrilineal, is_living, families) VALUES
('P1.1', 'Cụ Sỹ Hy (Cụ Sư Húc)', 1, 1, 'Phụng Thự Ngự Thượng Bỉnh triều Trần', 'Thủy tổ họ Nguyễn Kim Đôi', true, false, '{"F1.1"}'),
('P1.1_W1', 'Nguyễn Quý thị', 2, 1, NULL, 'Vợ cụ Sỹ Hy', false, false, '{"F1.1"}');

INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F1.1', 'P1.1', 'P1.1_W1', '{"P2.1"}');

-- ==========================================
-- ĐỜI 2
-- ==========================================
INSERT INTO people (handle, display_name, gender, generation, nick_name, notes, is_patrilineal, is_living, parent_families, families) VALUES
('P2.1', 'Cụ Sỹ Kỳ', 1, 2, 'Tích Đức cư sĩ', 'Không chịu làm quan với nhà Hồ.', true, false, '{"F1.1"}', '{"F2.1"}'),
('P2.1_W1', 'Nguyễn thị Quân', 2, 2, NULL, 'Con gái cụ Xứ công Cẩn', false, false, '{}', '{"F2.1"}');

INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F2.1', 'P2.1', 'P2.1_W1', '{"P3.1"}');

-- ==========================================
-- ĐỜI 3
-- ==========================================
INSERT INTO people (
    handle, display_name, gender, generation, nick_name, title, birth_year, birth_date,
    death_year, death_date, notes, is_patrilineal, is_living, parent_families, families
) VALUES
('P3.1', 'Cụ Lung', 1, 3, 'Từ mẫn', 'Triều Liệt Đại Phu – Tham Chính', 1392, 'Nhâm Thân – Quang Thái thứ 5',
    1463, '29 tháng 11 Nhâm Ngọ (dị bản: 1465)', 'Công đức & sự nghiệp:
- Thuở nhỏ mồ côi gặp loạn nhà Hồ, sống vất vả; về sau đến định cư tại xã Kim Đôi (từ cụ Lung trở đi họ Nguyễn ở Kim Đôi).
- Chuyện bãi Vọng Nguyên: khi chăn trâu thấy thầy địa lý thử huyệt (Nhũ/Đột), cụ đem mộ cha (cụ Sư Kỳ) táng vào chỗ "Nhũ" theo huyệt thật.
- Sau đó đẵn cây bồ đề, sửa sang bãi đất làm nhà ở (về sau là vị trí từ đường đại tôn).
- Cụ nghiêm trực; cùng cụ bà dạy con cháu chuyên việc nho học, chu cấp áo gạo để con chuyên tâm học hành.',
    true, false, '{"F2.1"}', '{"F3.1_W1", "F3.1_W2"}'),

('P3.1_W1', 'Bà Ngọc Đôi', 2, 3, NULL, NULL, NULL, NULL, NULL, NULL, 'Người làng Ngọc Đôi (Vợ 1)', false, false, '{}', '{"F3.1_W1"}'),
('P3.1_W2', 'Hoàng thị (húy Định)', 2, 3, 'Từ Thiện', NULL, NULL, NULL, NULL, NULL, 'Kế thất (Vợ 2)', false, false, '{}', '{"F3.1_W2"}');

INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F3.1_W1', 'P3.1', 'P3.1_W1', '{"P4.Kiep", "P4.Hoa"}'),
('F3.1_W2', 'P3.1', 'P3.1_W2', '{"P4.1", "P4.2", "P4.3", "P4.4", "P4.5", "P4.6", "P4.7", "P4.Na", "P4.Cam", "P4.At"}');

-- ==========================================
-- ĐỜI 4
-- ==========================================
-- Con vợ 1 (Bà Ngọc Đôi)
INSERT INTO people (handle, display_name, gender, generation, is_patrilineal, is_living, parent_families, families) VALUES
('P4.Kiep', 'Kiếp', 1, 4, true, false, '{"F3.1_W1"}', '{}'),
('P4.Hoa', 'Hoa', 2, 4, true, false, '{"F3.1_W1"}', '{}');

-- Con vợ 2 (Hoàng thị huy Định)
INSERT INTO people (
    handle, display_name, gender, generation, title, degree, notes, is_patrilineal, is_living, parent_families, families
) VALUES
('P4.1', 'Cụ Duyên', 1, 4, NULL, NULL, NULL, true, false, '{"F3.1_W2"}', '{"F4.1"}'),

('P4.2', 'Cụ Nhân Chù', 1, 4, 'Hiến sát sứ Hải Dương', NULL, NULL, true, false, '{"F3.1_W2"}', '{"F4.2"}'),

('P4.3', 'Cụ Nhân Bị', 1, 4, 'Binh bộ Thượng thư', 'Tiến sĩ khoa Tân Sửu - Hồng Đức 12 (1481)',
'Công đức & sự nghiệp:
- 34 tuổi đỗ Tiến sĩ khoa Tân Sửu (1481), niên hiệu Hồng Đức thứ 12, vua Thánh Tôn nhà Lê.
- Làm quan đến Binh bộ Thượng thư, dự Tạo đàn. Có đi sứ Tàu.
- Ở Đăng khoa lục chép năm cụ 19 tuổi đã đỗ tiến sĩ cùng với khoa cụ Thiếp đó, sau lại từ, đến năm 34 tuổi cụ lại đỗ lại.',
true, false, '{"F3.1_W2"}', '{"F4.3"}'),

('P4.4', 'Cụ Nhân Bồng', 1, 4, 'Lễ bộ Tả thị lang, Hàn lâm viện Thị thư, Bảo dân Phó nguyên súy', 'Tiến sĩ khoa Kỷ Sửu - Quang Thuận 10 (1469)',
'Được vua Lê Thánh Tông ban tên Trọng Tác (sau đổi Sùng Sác). Đỗ đạt sớm: 19 tuổi đỗ Tiến sĩ.
Công đức & sự nghiệp: Được vua trọng dụng đặc biệt, thường xướng họa thơ. Giỏi thơ quốc văn (thơ Nôm), có các bài vịnh cảnh được truyền tụng, làm rạng danh dòng họ về học thuật.',
true, false, '{"F3.1_W2"}', '{"F4.4"}'),

('P4.5', 'Cụ Nhân Thiếp', 1, 4, 'Lại bộ Thượng thư', 'Tiến sĩ khoa Bính Tuất - Quang Thuận 7 (1466); đỗ Hoành từ năm 1467',
'Đỗ Tiến sĩ lúc 15 tuổi. Từng được giao làm Thị giảng quan chỉ dạy kinh điển.
Công đức & sự nghiệp: Thông minh dĩnh ngộ, xem Kinh/Sử qua một lượt nhớ hết.',
true, false, '{"F3.1_W2"}', '{"F4.5"}'),

('P4.6', 'Cụ Nhân Giữ', 1, 4, 'Hiến sát sứ (Thanh hình Hiến sát sứ)', 'Tiến sĩ khoa Nhâm Thìn - Hồng Đức 3 (1472)',
'17 tuổi đỗ Tiến sĩ khoa Nhâm Thìn, vua Lê Thánh Tông.',
true, false, '{"F3.1_W2"}', '{"F4.6"}'),

('P4.7', 'Cụ Nhân Đạc', 1, 4, 'Hàn lâm viện Hiệu thảo', 'Tiến sĩ khoa Ất Mùi - Hồng Đức 6 (1475)',
'18 tuổi đỗ Tiến sĩ khoa Ất Mùi, vua Lê Thánh Tông.',
true, false, '{"F3.1_W2"}', '{"F4.7"}');

-- Con gái cụ Lung (vợ 2)
INSERT INTO people (handle, display_name, gender, generation, is_patrilineal, is_living, parent_families, families) VALUES
('P4.Na', 'Na', 2, 4, true, false, '{"F3.1_W2"}', '{}'),
('P4.Cam', 'Cam', 2, 4, true, false, '{"F3.1_W2"}', '{}'),
('P4.At', 'Ất', 2, 4, true, false, '{"F3.1_W2"}', '{}');

-- Families placeholder cho đời 4 để chuẩn bị móc đời 5
INSERT INTO families (handle, father_handle, children) VALUES
('F4.1', 'P4.1', '{"P5.1"}'),  -- Con là: Củng Thuận
('F4.2', 'P4.2', '{"P5.2"}'),  -- Con là: Quản Liêu
('F4.3', 'P4.3', '{"P5.4"}'),  -- Con là: Dũng Nghĩa
('F4.4', 'P4.4', '{"P5.3"}'),  -- Con là: Đạo Giền
('F4.5', 'P4.5', '{"P5.6"}'),  -- Con là: Kính
('F4.6', 'P4.6', '{"P5.7"}'),  -- Con là: Bá Tuấn
('F4.7', 'P4.7', '{"P5.5"}');  -- Con là: Viên

SELECT '✅ Đã chèn xong Đời 1, 2, 3 và Đời 4 (Nhóm đại khoa đầu tiên cực khủng)!' AS status;
