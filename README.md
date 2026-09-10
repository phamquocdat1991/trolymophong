# Trợ lý tạo mô phỏng giáo dục

Ứng dụng tiếng Việt dựng theo video tham chiếu: trắng–xanh ngọc, thiết lập môn/lớp, nhập chủ đề hoặc tải file, tùy chỉnh điều kiện sử dụng và cấu hình Gemini.

## Production và tự động triển khai

- Website: https://tro-ly-mo-phong.vercel.app
- Repository: https://github.com/phamquocdat1991/trolymophong
- Project Vercel: `tro-ly-mo-phong`, team `QuocDat`.
- Repository đã liên kết với Vercel; nhánh `main` theo dõi môi trường Production. Mỗi commit mới vào `main` kích hoạt build và triển khai production; bản đang chạy chỉ được thay thế khi build thành công.
- Bản v2 có nút **Tạo lại** và **Chỉnh sửa** để thêm/bớt nội dung sau khi tạo mô phỏng. Khi hủy hoặc lỗi, bản hiện tại được giữ nguyên.

## Chạy với Next.js / Vercel

Yêu cầu Node.js >= 22.13.

```bash
npm ci
npm run dev:vercel
npm run typecheck
npm run build:vercel
npm run start:vercel
```

Đưa toàn bộ source lên repository GitHub mới (không commit node_modules, .next, .env hoặc API Key). Trên Vercel chọn Add New Project → Import repository. vercel.json chọn Next.js và lệnh build tương ứng. Không cần đặt khóa dùng chung: giáo viên nhập Gemini API Key trong Cấu hình AI, bấm kiểm tra để tải model thật. GitHub lưu mã nguồn; Vercel chạy giao diện và API. GitHub Pages không chạy được API server.

## Chức năng

- 5 mô phỏng tích hợp: Ohm, khúc xạ, parabol, pH và sóng. Có thanh trượt, kết quả số, đặt lại, câu hỏi với phản hồi; Ohm/sóng có tạm dừng.
- Tìm kiếm/lọc môn; lưu bài trên thiết bị; xóa bài đã lưu; tải HTML độc lập để dùng offline; chế độ trình chiếu.
- AI đọc chủ đề/PDF/PNG/JPEG/WebP/TXT và tạo HTML tương tác. 5 tệp, tổng tối đa 3 MB để phù hợp giới hạn request serverless. Đây là điều chỉnh so với 10 MB/file trong video. File lớn cần bổ sung kho upload và Gemini Files API.
- API Key chỉ ở React memory, gửi cùng yêu cầu HTTPS tới API server và Google; không ghi vào localStorage, source hoặc log. Đóng/tải lại trang cần nhập lại. Danh sách model lấy từ Gemini models.list, không hardcode model giả.
- Kiểm tra đầu vào Zod, giới hạn nội dung/tệp, xử lý timeout/quota và dữ liệu AI không hoàn chỉnh. HTML chạy trong iframe sandbox allow-scripts với CSP chặn mạng/form/frame. Tải HTML vẫn giữ CSP chặn kết nối mạng.
- **Gemini Resilience Gateway**: Tích hợp cơ chế điều phối bậc thang (Cascading Model Fallback) và ngắt độ trễ (Latency Timeout):
  - Chuỗi tầng chất lượng cao: `gemini-3.8-flash` (25s) ➔ `gemini-3.7-flash` (20s) ➔ `gemini-3.6-flash` (20s) ➔ `gemini-3.5-flash-lite` (15s).
  - Tự động bắt đầu từ model do giáo viên chọn và tiếp nối các model dự phòng an toàn.
  - Tự động chuyển tầng ngay khi gặp HTTP 429 (Rate Limit), 503 (Server Overloaded), 504 (Deadline Exceeded) hoặc khi quá thời gian phản hồi.
  - Hỗ trợ xoay vòng API Key dự phòng (`GEMINI_API_KEYS`) khi hết quota ngày.
  - Dừng ngay đối với lỗi HTTP 400 (Bad Request / Schema) để bảo vệ tài nguyên.

## Giới hạn và kiểm thử

- Thư viện tích hợp hoạt động không cần AI. Kiến thức mô hình ghi rõ giả định trong từng bài.
- Chỉ xác minh cấu trúc đầu ra AI, chưa có bộ máy chứng minh đúng khoa học hoặc kiểm chứng mọi JavaScript do AI tạo. Giáo viên cần kiểm tra trước sử dụng.
- Chưa kiểm thử lời gọi Gemini thành công với khóa thật: phiên xây dựng không được cung cấp khóa. Không giả lập thành công AI.
- Lưu bài là localStorage, không phải tài khoản hoặc đồng bộ đám mây. Không có đăng nhập giả. Khi xóa dữ liệu trình duyệt sẽ mất bài chưa tải.
- Có kiểm tra TypeScript, production build và logic các mô phỏng. Không tuyên bố kiểm thử trình duyệt khi chưa thực hiện.
- Chế độ trình chiếu mở đầy vùng app; tải HTML mở được độc lập ngoài app.
- API tương thích Web Request/Response; có thể build runtime Sites qua npm run build. Cấu hình Vercel tách biệt qua npm run build:vercel.

## Nâng cấp đề xuất

1. Tài khoản giáo viên và kho học liệu đám mây, phân quyền chia sẻ.
2. Lớp học tham gia bằng QR và thu câu trả lời học sinh theo thời gian thực.
3. Giáo viên duyệt nội dung trước khi chia sẻ; lịch sử phiên bản và bảng kiểm kiến thức.
4. Kho tệp lớn, xử lý OCR có đánh dấu độ tin cậy, Word/DOCX.
5. Nhà cung cấp AI khác chỉ khi có endpoint và phương thức xác thực thực tế; không dựng tùy chọn Agent Platform giả như một kết nối đã hoạt động.

Tài liệu API: https://ai.google.dev/api/generate-content và https://ai.google.dev/api/models
