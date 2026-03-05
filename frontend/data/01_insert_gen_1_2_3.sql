-- 01_insert_gen_1_2_3.sql
-- Xóa toàn bộ dữ liệu bảng để tạo lại từ đầu theo file docx mới nhất (Đời 1-2-3)
TRUNCATE TABLE people CASCADE;
TRUNCATE TABLE families CASCADE;

-- ĐỜI 1
INSERT INTO people (handle, display_name, gender, generation, title, notes, is_patrilineal, is_living, families) VALUES
('P1.1', 'Cụ Sỹ Hy (Sư Húc)', 1, 1, 'Phụng Thự Ngự Thượng Bỉnh triều Trần', 'Thủy tổ họ Nguyễn Kim Đôi', true, false, '{"F1.1"}'),
('P1.1_W1', 'Nguyễn Quý Thị', 2, 1, NULL, NULL, false, false, '{"F1.1"}');

INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F1.1', 'P1.1', 'P1.1_W1', '{"P2.1"}');

-- ĐỜI 2
INSERT INTO people (handle, display_name, gender, generation, nick_name, notes, is_patrilineal, is_living, parent_families, families) VALUES
('P2.1', 'Cụ Sỹ Kỳ', 1, 2, 'Tích Đức cư sĩ', 'Không chịu làm quan với nhà Hồ', true, false, '{"F1.1"}', '{"F2.1"}'),
('P2.1_W1', 'Nguyễn Thị Quân', 2, 2, NULL, 'Con gái cụ Xứ công Cẩn', false, false, '{}', '{"F2.1"}');

INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F2.1', 'P2.1', 'P2.1_W1', '{"P3.1"}');

-- ĐỜI 3
INSERT INTO people (handle, display_name, gender, generation, nick_name, title, birth_year, birth_date, death_year, death_date, notes, is_patrilineal, is_living, parent_families, families) VALUES
('P3.1', 'Cụ Lung', 1, 3, 'Từ mẫn', 'Triều Liệt Đại Phu – Tham Chính', 1392, 'Nhâm Thân – Quang Thái thứ 5', 1463, '29 tháng 11 Nhâm Ngọ', 'Công đức & sự nghiệp:
- Thuở nhỏ mồ côi gặp loạn nhà Hồ, sống vất vả; về sau đến định cư tại xã Kim Đôi (từ cụ Lung trở đi họ Nguyễn ở Kim Đôi).
- Chuyện bãi Vọng Nguyên: khi chăn trâu thấy thầy địa lý thử huyệt (Nhũ/Đột), cụ đem mộ cha (cụ Sư Kỳ) táng vào chỗ "Nhũ" theo huyệt thật.
- Sau đó đẵn cây bồ đề, sửa sang bãi đất làm nhà ở (về sau là vị trí từ đường đại tôn).
- Cụ nghiêm trực; cùng cụ bà dạy con cháu chuyên việc nho học, chu cấp áo gạo để con chuyên tâm học hành', true, false, '{"F2.1"}', '{"F3.1_W1", "F3.1_W2"}'),
('P3.1_W1', 'Bà Ngọc Đôi', 2, 3, NULL, NULL, NULL, NULL, NULL, NULL, 'Người làng Ngọc Đôi', false, false, '{}', '{"F3.1_W1"}'),
('P3.1_W2', 'Hoàng Thị Định', 2, 3, 'Từ Thiện', NULL, NULL, NULL, NULL, NULL, NULL, false, false, '{}', '{"F3.1_W2"}');

INSERT INTO families (handle, father_handle, mother_handle, children) VALUES
('F3.1_W1', 'P3.1', 'P3.1_W1', '{"P4.Kiep", "P4.Hoa"}'),
('F3.1_W2', 'P3.1', 'P3.1_W2', '{"P4.1", "P4.2", "P4.3", "P4.4", "P4.5", "P4.6", "P4.7", "P4.Na", "P4.Cam", "P4.At"}');

-- ĐỜI 4 (Chỉ chèn placeholder để nối cây gia phả một cách đầy đủ cho Đời 3)
INSERT INTO people (handle, display_name, gender, generation, is_patrilineal, is_living, parent_families) VALUES
('P4.Kiep', 'Kiếp', 1, 4, true, false, '{"F3.1_W1"}'),
('P4.Hoa', 'Hoa', 2, 4, true, false, '{"F3.1_W1"}'),
('P4.1', 'Cụ Duyên', 1, 4, true, false, '{"F3.1_W2"}'),
('P4.2', 'Cụ Nhân Chù', 1, 4, true, false, '{"F3.1_W2"}'),
('P4.3', 'Cụ Nhân Bị', 1, 4, true, false, '{"F3.1_W2"}'),
('P4.4', 'Cụ Nhân Bồng', 1, 4, true, false, '{"F3.1_W2"}'),
('P4.5', 'Cụ Nhân Thiếp', 1, 4, true, false, '{"F3.1_W2"}'),
('P4.6', 'Cụ Nhân Giữ', 1, 4, true, false, '{"F3.1_W2"}'),
('P4.7', 'Cụ Nhân Đạc', 1, 4, true, false, '{"F3.1_W2"}'),
('P4.Na', 'Na', 2, 4, true, false, '{"F3.1_W2"}'),
('P4.Cam', 'Cam', 2, 4, true, false, '{"F3.1_W2"}'),
('P4.At', 'Ất', 2, 4, true, false, '{"F3.1_W2"}');

SELECT '✅ Đã chèn xong Đời 1, 2, 3 và chuẩn bị kết nối Đời 4' AS status;
