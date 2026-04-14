export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  roles: "Giáo viên" | "Học sinh" | "Tất cả";
}

export const initialFAQData: FAQItem[] = [
  {
    id: 1,
    question:
      "Trung tâm có hỗ trợ gì cho giáo viên trong việc phát triển chuyên môn không?",
    answer: "Có, trung tâm tổ chức workshop hàng tháng.",
    roles: "Giáo viên",
  },
  {
    id: 2,
    question: "Lịch làm việc và lịch dạy của tôi sẽ như thế nào?",
    answer: "Lịch dạy được gửi qua ứng dụng vào mỗi tối Chủ nhật.",
    roles: "Giáo viên",
  },
  {
    id: 3,
    question: "Trung tâm sử dụng giáo trình nào?",
    answer: "Giáo trình chuẩn Cambridge và Oxford.",
    roles: "Giáo viên",
  },
  {
    id: 4,
    question: "Trung tâm có triết lý giảng dạy cụ thể nào không?",
    answer: "Lấy người học làm trung tâm.",
    roles: "Giáo viên",
  },
  {
    id: 5,
    question: "Trung tâm có cung cấp tài liệu hỗ trợ trực tuyến không?",
    answer: "Có hệ thống LMS riêng cho học viên.",
    roles: "Học sinh",
  },
  {
    id: 6,
    question: "Học phí như thế nào và có gói ưu đãi gì không?",
    answer: "Vui lòng xem mục Gói học phí để biết chi tiết.",
    roles: "Học sinh",
  },
  {
    id: 7,
    question: "Ai sẽ là người trực tiếp giảng dạy?",
    answer: "Đội ngũ giáo viên bản ngữ và Việt Nam đạt chuẩn IELTS 7.5+.",
    roles: "Học sinh",
  },
  {
    id: 8,
    question: "Tôi có thể thay đổi lịch học sau khi đã đăng ký không?",
    answer: "Được phép bảo lưu hoặc đổi ca 1 lần mỗi khóa.",
    roles: "Học sinh",
  },
];
