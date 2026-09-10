// Shared by the form and API so long descriptions use the same limits.
export const TEXT_LIMITS = Object.freeze({topic: 30000, details: 10000, revision: 30000});
export function textLimitError(field, value) {
  const labels = {topic: 'Chủ đề chi tiết', details: 'Thông số điều chỉnh', revision: 'Yêu cầu chỉnh sửa'};
  if (typeof value !== 'string') return `${labels[field]} phải là văn bản.`;
  return value.length > TEXT_LIMITS[field]
    ? `${labels[field]} vượt giới hạn ${TEXT_LIMITS[field].toLocaleString('vi-VN')} ký tự. Hãy rút gọn hoặc chuyển phần nội dung dài sang file TXT.`
    : '';
}
