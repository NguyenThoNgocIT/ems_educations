// data-student.ts

// 1. Dữ liệu các thẻ chỉ số phân tách theo từng tháng (Dùng cho Date Picker)
export const STUDENT_STATS_BY_MONTH: Record<number, any> = {
  1: {
    totalInMonth: 110,
    reserved: 8,
    newRegistration: 35,
    potentialUpsell: 15,
    continuedRegistration: 65,
    dropped: 1,
  },
  2: {
    totalInMonth: 125, // Số liệu khớp với thiết kế tháng 2
    reserved: 12,
    newRegistration: 45,
    potentialUpsell: 28,
    continuedRegistration: 80,
    dropped: 5,
  },
  3: {
    totalInMonth: 140,
    reserved: 10,
    newRegistration: 50,
    potentialUpsell: 30,
    continuedRegistration: 90,
    dropped: 2,
  },
  // Bạn có thể thêm tiếp dữ liệu từ tháng 4 đến 12 tương tự...
};

// 2. Dữ liệu cho biểu đồ đường (Line Chart) so sánh Ký mới và Ký tiếp theo năm
export const STUDENT_YEARLY_CHART = [
  { month: "Tháng 1", new: 40, continued: 65 },
  { month: "Tháng 2", new: 30, continued: 75 },
  { month: "Tháng 3", new: 45, continued: 80 },
  { month: "Tháng 4", new: 50, continued: 70 },
  { month: "Tháng 5", new: 35, continued: 85 },
  { month: "Tháng 6", new: 55, continued: 90 },
  { month: "Tháng 7", new: 60, continued: 95 },
  { month: "Tháng 8", new: 48, continued: 88 },
  { month: "Tháng 9", new: 52, continued: 82 },
  { month: "Tháng 10", new: 45, continued: 78 },
  { month: "Tháng 11", new: 38, continued: 70 },
  { month: "Tháng 12", new: 42, continued: 75 },
];

// 3. Danh sách học viên có tiềm năng Upsell
// Để hiển thị trạng thái "Trống" như trong ảnh {B7E7D554}, bạn có thể để mảng này rỗng []
export const UPSELL_STUDENTS = [
  {
    id: "HD001",
    name: "Nguyễn Văn A",
    phone: "0901234567",
    course: "IELTS 5.5",
    endDate: "20/03/2026",
    suggestCourse: "IELTS 6.5",
  },
  {
    id: "HD002",
    name: "Trần Thị B",
    phone: "0908887776",
    course: "TOEIC 500",
    endDate: "15/04/2026",
    suggestCourse: "TOEIC 750",
  },
];

// 4. Các hằng số bổ trợ cho giao diện lịch
export const CALENDAR_MONTHS = [
  "Thg 01",
  "Thg 02",
  "Thg 03",
  "Thg 04",
  "Thg 05",
  "Thg 06",
  "Thg 07",
  "Thg 08",
  "Thg 09",
  "Thg 10",
  "Thg 11",
  "Thg 12",
];
