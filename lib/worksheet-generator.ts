import type { Lesson } from './simulations';

export function generateWorksheetHTML(lesson: Lesson): string {
  const currentDate = new Date().toLocaleDateString('vi-VN');

  return `
  <div class="worksheet-printable" style="font-family:'Times New Roman',Times,serif;color:#111;line-height:1.5;padding:20px;max-width:850px;margin:0 auto;background:#fff;">
    <!-- QUỐC HIỆU TIÊU NGỮ & HEADER TRƯỜNG LỚP -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:15px;">
      <tr>
        <td style="width:50%;vertical-align:top;font-size:12pt;">
          <strong>TRƯỜNG:</strong> ....................................................<br>
          <strong>LỚP:</strong> ..................... <strong>NHÓM:</strong> ...................<br>
          <strong>HỌ VÀ TÊN HS:</strong> ........................................
        </td>
        <td style="width:50%;text-align:center;vertical-align:top;font-size:11pt;">
          <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
          <strong>Độc lập - Tự do - Hạnh phúc</strong><br>
          <div style="width:140px;border-bottom:1px solid #000;margin:4px auto 8px;"></div>
          <em>Ngày thực hiện: ${currentDate}</em>
        </td>
      </tr>
    </table>

    <!-- TIÊU ĐỀ PHIẾU HỌC TẬP -->
    <div style="text-align:center;margin:15px 0 20px;">
      <h2 style="font-size:16pt;margin:0 0 5px;text-transform:uppercase;letter-spacing:0.5px;">PHIẾU HỌC TẬP THỰC HÀNH SỐ</h2>
      <h3 style="font-size:14pt;margin:0 0 4px;color:#111;">BÀI: ${lesson.title.toUpperCase()}</h3>
      <p style="font-size:11pt;font-style:italic;margin:0;">Môn: ${lesson.subject} · ${lesson.grade} · Nền tảng Phòng thí nghiệm số MoLab</p>
    </div>

    <!-- I. MỤC TIÊU BÀI THỰC HÀNH -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:12pt;margin:0 0 4px;text-transform:uppercase;">I. MỤC TIÊU BÀI HỌC</h4>
      <ul style="margin:0;padding-left:22px;font-size:12pt;">
        <li>Quan sát và giải thích được bản chất hiện tượng: <em>${lesson.description}</em></li>
        <li>Rèn luyện kỹ năng điều chỉnh thông số, thu thập số liệu thực nghiệm và đối chiếu đồ thị thời gian thực.</li>
        <li>Phát triển năng lực tự chủ tìm tòi khoa học và giải quyết vấn đề.</li>
      </ul>
    </div>

    <!-- II. DỤNG CỤ VÀ THIẾT BỊ MÔ PHỎNG -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:12pt;margin:0 0 4px;text-transform:uppercase;">II. THIẾT BỊ VÀ ĐỐI TƯỢNG NGHIÊN CỨU</h4>
      <p style="margin:0;font-size:12pt;">- Bộ mô phỏng tương tác kỹ thuật số chuyên ngành, bảng điều khiển biến số đầu vào, hệ thống cảm biến hiển thị dữ liệu thời gian thực và đồ thị biến thiên trực quan.</p>
    </div>

    <!-- III. TIẾN TRÌNH THỰC HIỆN -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:12pt;margin:0 0 4px;text-transform:uppercase;">III. TIẾN TRÌNH THỰC NGHIỆM</h4>
      <ol style="margin:0;padding-left:22px;font-size:12pt;">
        <li><strong>Khởi động & Dự đoán:</strong> Quan sát trạng thái ban đầu của hệ thống. Dự đoán điều gì sẽ xảy ra khi bắt đầu tương tác hoặc cấp năng lượng.</li>
        <li><strong>Thực nghiệm có kiểm soát:</strong> Thay đổi lần lượt các thông số theo từng bước. Giữ cố định các yếu tố khác để đảm bảo tính khách quan của phép đo.</li>
        <li><strong>Ghi chép số liệu:</strong> Đọc các giá trị hiển thị trên bảng số liệu/đồ thị và điền đầy đủ vào Bảng 1 bên dưới.</li>
        <li><strong>Phân tích & Kết luận:</strong> Thảo luận nhóm, so sánh dự đoán ban đầu với kết quả thực nghiệm và rút ra quy luật.</li>
      </ol>
    </div>

    <!-- IV. BẢNG GHI SỐ LIỆU ĐO ĐẠC THỰC NGHIỆM -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:12pt;margin:0 0 6px;text-transform:uppercase;">IV. BẢNG GHI CHÉP SỐ LIỆU THỰC NGHIỆM (BẢNG 1)</h4>
      <table style="width:100%;border-collapse:collapse;font-size:11pt;text-align:center;">
        <thead>
          <tr style="background:#f2f2f2;">
            <th style="border:1px solid #333;padding:6px 4px;width:10%;">Lần đo</th>
            <th style="border:1px solid #333;padding:6px 4px;width:25%;">Thông số đầu vào (Biến số)</th>
            <th style="border:1px solid #333;padding:6px 4px;width:35%;">Hiện tượng quan sát được</th>
            <th style="border:1px solid #333;padding:6px 4px;width:30%;">Số liệu đo đạc (Kết quả)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border:1px solid #333;padding:14px 4px;"><strong>Lần 1</strong></td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="border:1px solid #333;padding:14px 4px;"><strong>Lần 2</strong></td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="border:1px solid #333;padding:14px 4px;"><strong>Lần 3</strong></td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
          </tr>
          <tr>
            <td style="border:1px solid #333;padding:14px 4px;"><strong>Lần 4</strong></td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
            <td style="border:1px solid #333;padding:14px 4px;">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- V. CÂU HỎI SUY LUẬN & RÚT RA QUY LUẬT -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:12pt;margin:0 0 6px;text-transform:uppercase;">V. CÂU HỎI THẢO LUẬN & RÚT RA QUY LUẬT</h4>
      <p style="font-size:12pt;margin:0 0 20px;"><strong>Câu 1:</strong> Dựa vào Bảng 1, khi đại lượng đầu vào tăng lên thì đại lượng quan sát biến đổi như thế nào? Xu hướng này có điểm giới hạn hay điểm bão hòa không?</p>
      <div style="border-bottom:1px dotted #888;height:1px;margin-bottom:14px;"></div>
      <div style="border-bottom:1px dotted #888;height:1px;margin-bottom:14px;"></div>

      <p style="font-size:12pt;margin:0 0 20px;"><strong>Câu 2:</strong> Giải thích bản chất khoa học của hiện tượng trên và viết công thức/phương trình biểu diễn mối liên hệ:</p>
      <div style="border-bottom:1px dotted #888;height:1px;margin-bottom:14px;"></div>
      <div style="border-bottom:1px dotted #888;height:1px;margin-bottom:14px;"></div>
    </div>

    <!-- VI. ĐÁNH GIÁ CỦA GIÁO VIÊN -->
    <table style="width:100%;border-collapse:collapse;margin-top:15px;">
      <tr>
        <td style="width:40%;border:1px solid #333;padding:8px;vertical-align:top;font-size:11pt;">
          <strong>ĐÁNH GIÁ TIÊU CHÍ:</strong><br>
          • Kỹ năng thực nghiệm: ...... / 4đ<br>
          • Số liệu Bảng 1: ................ / 3đ<br>
          • Câu hỏi suy luận: ............. / 3đ<br>
          <strong>TỔNG ĐIỂM: ................ / 10đ</strong>
        </td>
        <td style="width:60%;border:1px solid #333;padding:8px;vertical-align:top;font-size:11pt;">
          <strong>NHẬN XÉT CỦA THẦY / CÔ GIÁO:</strong><br>
          .....................................................................................................................<br>
          .....................................................................................................................<br>
          <div style="text-align:right;margin-top:8px;"><em>(Ký và ghi rõ họ tên)</em></div>
        </td>
      </tr>
    </table>
  </div>
  `;
}
