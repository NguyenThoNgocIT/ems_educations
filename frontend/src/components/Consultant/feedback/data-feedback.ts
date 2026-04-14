// data-feedback.ts

// 1. Chỉ số tổng quát hiển thị trên các thẻ
export const FEEDBACK_STATS = {
  total: 45, // Tổng số lượng phản hồi
  positive: 28, // Phản hồi tích cực
  negative: 5, // Phản hồi tiêu cực
  unanswered: 12, // Phản hồi chưa trả lời
};

// 2. Dữ liệu cho biểu đồ cột (Bar Chart)
export const FEEDBACK_CHART_DATA = [
  { name: "Tích cực", count: 28 },
  { name: "Tiêu cực", count: 5 },
  { name: "Bình thường", count: 12 },
  { name: "Chưa trả lời", count: 12 },
];

// 3. Danh sách phản hồi chi tiết để hiển thị trong bảng
export const FEEDBACK_LIST = [
  {
    stt: 1,
    name: "Nguyễn Văn An",
    content: "Khóa học rất bổ ích, giảng viên nhiệt tình hỗ trợ.",
    status: "Tích cực",
    date: "05/02/2026",
  },
  {
    stt: 2,
    name: "Trần Thị Bình",
    content: "Cần cải thiện tốc độ phản hồi của tư vấn viên vào buổi tối.",
    status: "Tiêu cực",
    date: "06/02/2026",
  },
  {
    stt: 3,
    name: "Lê Hải Đăng",
    content: "Tôi muốn hỏi thêm về lịch khai giảng lớp IELTS chuyên sâu.",
    status: "Chưa trả lời",
    date: "07/02/2026",
  },
  {
    stt: 4,
    name: "Phạm Minh Tú",
    content: "Tài liệu học tập rất đầy đủ và dễ hiểu.",
    status: "Bình thường",
    date: "07/02/2026",
  },
  {
    stt: 5,
    name: "Hoàng Ngọc Ánh",
    content: "Cảm ơn trung tâm đã hỗ trợ tôi bảo lưu khóa học kịp thời.",
    status: "Tích cực",
    date: "07/02/2026",
  },
];
