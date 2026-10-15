# SelfLearn AI - Hệ Thống Hỗ Trợ Đánh Giá Năng Lực Tự Học Của Sinh Viên Trong Môi Trường Có AI

Ứng dụng web phục vụ đề tài nghiên cứu khoa học giáo dục đại học:  
**“XÂY DỰNG HỆ THỐNG HỖ TRỢ ĐÁNH GIÁ NĂNG LỰC TỰ HỌC CỦA SINH VIÊN TRONG MÔI TRƯỜNG CÓ AI HỖ TRỢ”**

---

## 1. Mục Tiêu & Cơ Sở Lý Thuyết

Hệ thống được thiết kế và phát triển dựa trên việc tổng hợp có chọn lọc từ:
- **Lý thuyết Học tập Tự điều chỉnh (Self-Regulated Learning - SRL)** của Barry Zimmerman và Paul Pintrich.
- **Mô hình Học tập Tự định hướng (Self-Directed Learning - SDL)** của Malcolm Knowles.
- **Chu trình siêu nhận thức:** Lập kế hoạch (Forethought) → Thực thi & Giám sát (Performance) → Tự phản tư (Self-Reflection) → Thích ứng & Điều chỉnh (Adjustment).
- **Khung Năng lực AI trong Giáo dục (AI Competency Framework):** Kỹ năng đặt câu lệnh (Prompting), đối chiếu và kiểm chứng chéo nguồn tài liệu (Cross-verification), phòng chống ảo giác AI (Hallucination awareness), liêm chính học thuật và bảo vệ dữ liệu cá nhân.

*Lưu ý khoa học:* Bộ tiêu chí là đề xuất nghiên cứu ban đầu nhằm mục đích thử nghiệm và thu thập dữ liệu định lượng/định tính; chưa cấu hình là chuẩn mực tâm trắc học cố định nếu chưa qua kiểm định Cronbach’s Alpha và phân tích nhân tố khám phá (EFA).

---

## 2. Khung 6 Lĩnh Vực & 26 Tiêu Chí Đánh Giá

1. **Lập kế hoạch và xác định mục tiêu (KH - 4 tiêu chí):** KH-01 (Mục tiêu SMART), KH-02 (Phân rã nhiệm vụ), KH-03 (Phân bổ thời gian), KH-04 (Xác định tài nguyên & công cụ).
2. **Chủ động và tự giác học tập (CD - 4 tiêu chí):** CD-01 (Tìm kiếm mở rộng), CD-02 (Duy trì kiên định), CD-03 (Đa dạng hóa nguồn học liệu), CD-04 (Tự nỗ lực trước khi hỏi).
3. **Giám sát và điều chỉnh quá trình học (GS - 4 tiêu chí):** GS-01 (Tự kiểm tra mức hiểu), GS-02 (Nhận diện lỗ hổng), GS-03 (Linh hoạt đổi phương pháp), GS-04 (Ứng dụng phản hồi).
4. **Tư duy phản biện và đánh giá kết quả (PB - 4 tiêu chí):** PB-01 (Đối chiếu tối thiểu 2 nguồn), PB-02 (Đánh giá tính logic), PB-03 (Nhận biết sai lệch / ngụy biện), PB-04 (Diễn giải bằng ngôn ngữ bản thân).
5. **Năng lực sử dụng AI trong học tập (AI - 6 tiêu chí):** AI-01 (Phân định nhiệm vụ phù hợp), AI-02 (Soạn prompt có cấu trúc), AI-03 (Kiểm chứng sự thật & trích dẫn AI), AI-04 (Nhận diện thiên lệch và giới hạn), AI-05 (Minh bạch & liêm chính), AI-06 (Làm chủ tri thức & không phụ thuộc máy móc).
6. **Phản tư và cải tiến liên tục (PT - 4 tiêu chí):** PT-01 (Tự đánh giá kết quả sau chặng), PT-02 (Nhận diện nguyên nhân thành công/hạn chế), PT-03 (Đúc rút nhật ký kinh nghiệm), PT-04 (Điều chỉnh chiến lược tiếp theo).

**Thang đo:** Likert 5 mức (1: Hoàn toàn không đúng -> 5: Hoàn toàn đúng) + Tùy chọn **"Chưa đủ thông tin để trả lời (N/A)"** (được loại bỏ khỏi phép tính trung bình, không gán điểm 0 hoặc 1).

---

## 3. Quy Tắc Tính Điểm & Xử Lý Dữ Liệu

- **Điểm Lĩnh vực ($S_{domain}$):** Trung bình cộng số học của các câu trả lời hợp lệ thuộc lĩnh vực đó.
- **Điểm Tổng hợp ($S_{composite}$):** Trung bình cộng các lĩnh vực đạt điều kiện với trọng số mặc định bằng nhau (~16.67% mỗi lĩnh vực) hoặc trọng số tùy biến có $\sum w_i = 100\%$.
- **Ngưỡng hoàn thành hợp lệ:** $\ge 70\%$ câu hỏi. Nếu $< 70\%$, hệ thống ghi nhận trạng thái **"Chưa đủ dữ liệu để kết luận"**.
- **Công thức quy đổi tuyến tính 0–100:**
  $$\text{LinearScore}_{100} = \frac{\bar{X} - 1}{4} \times 100$$
  *(Chú thích: Đây là phép biến đổi hiển thị trực quan, không phải xác suất năng lực thực tế).*
- **Phân nhóm tham chiếu nghiên cứu:**
  - $\ge 4.2$ (80–100): Tự chủ cao & Sử dụng AI chiến lược.
  - $3.4 - 4.19$ (60–79): Khá vững vàng & Đang hoàn thiện.
  - $2.6 - 3.39$ (40–59): Đang phát triển / Cần hỗ trợ định hướng.
  - $< 2.6$ (< 40): Cần hỗ trợ và can thiệp phương pháp.

---

## 4. Tài Khoản Thử Nghiệm Theo Phân Quyền (Demo Accounts)

Hệ thống tích hợp bộ chuyển vai trò nhanh (Role Switcher) trên thanh Menu:

| Vai trò | Họ tên | Email | Ghi chú quyền hạn |
| :--- | :--- | :--- | :--- |
| **Sinh viên** | Nguyễn Văn An | `an.nguyen@student.edu.vn` | Tự đánh giá, xem kết quả, quản lý minh chứng, lập kế hoạch SRL, xem lịch sử |
| **Nhà nghiên cứu / Giảng viên** | TS. Lê Hoàng Nam | `nam.le@research.edu.vn` | Xem dữ liệu gộp, Mean/SD, phân bố điểm, minh chứng được chia sẻ, xuất CSV, xuất Báo cáo Thử nghiệm |
| **Quản trị viên** | Quản trị viên Hệ thống | `admin@selflearn.ai` | Quản lý người dùng, chỉnh sửa bộ tiêu chí, trọng số, xem Audit Logs, xóa dữ liệu theo yêu cầu |

---

## 5. Quyền Riêng Tư & Đạo Đức Nghiên Cứu

1. **Cam kết đồng ý:** Hiển thị bản thỏa thuận tham gia tự nguyện trước khi đánh giá.
2. **Giả danh hóa (Pseudonymization):** Dữ liệu xuất sang CSV hoặc gửi giảng viên được mã hóa định danh ($P-001, P-002, \dots$) để bảo vệ sinh viên.
3. **Quyền rút lui & xóa dữ liệu (Right to Erasure):** Người học có thể yêu cầu xóa sạch toàn bộ điểm số và minh chứng khỏi hệ thống bất kỳ lúc nào.
4. **Minh chứng riêng tư:** Cho phép phân loại minh chứng là "Riêng tư" (chỉ sinh viên xem) hoặc "Chia sẻ nghiên cứu".

---

## 6. Chạy và Kiểm Thử Ứng Dụng

```bash
# 1. Cài đặt dependencies (nếu cần)
npm install

# 2. Chạy unit tests kiểm định thuật toán tính điểm
node --test src/utils/scoring.test.ts

# 3. Chạy môi trường phát triển (Dev Server Port 3000)
npm run dev

# 4. Kiểm tra build hoàn thiện
npm run build
```
