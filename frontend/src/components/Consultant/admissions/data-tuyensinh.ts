// data-tuyensinh.ts

// 1. Chỉ số tổng quát (Thống kê tư vấn leads)
export const ADMISSION_STATS = {
  totalLeads: 156,
  successLeads: 42,
  failedLeads: 28,
  uncontactedLeads: 86,
};

// 2. Thời gian phản hồi (Biểu đồ đường đầu tiên)
export const RESPONSE_TIME_DATA = [
  { time: "0", count: 5 },
  { time: "15p", count: 25 },
  { time: "30p", count: 40 },
  { time: "1h", count: 30 },
  { time: "2h", count: 20 },
  { time: "6h", count: 15 },
  { time: "12h", count: 8 },
  { time: "18h", count: 5 },
  { time: "24h", count: 3 },
  { time: "36h", count: 2 },
  { time: "48h", count: 1 },
  { time: "> 48h", count: 2 },
];

// 3. Thời gian chuyển đổi trạng thái (Biểu đồ đường thứ hai)
// Giả lập từ "Mới" sang "Đã liên hệ"
export const CONVERSION_TIME_DATA = [
  { time: "0", count: 2 },
  { time: "15p", count: 12 },
  { time: "30p", count: 35 },
  { time: "1h", count: 45 },
  { time: "2h", count: 28 },
  { time: "6h", count: 18 },
  { time: "12h", count: 10 },
  { time: "18h", count: 4 },
  { time: "24h", count: 2 },
  { time: "36h", count: 0 },
  { time: "48h", count: 0 },
  { time: "> 48h", count: 0 },
];

// 4. Thống kê nguồn Leads (Biểu đồ tròn/danh sách nguồn)
export const SOURCE_STATS = [
  { name: "Facebook ADS", value: 58, color: "#ef4444" },
  { name: "Fanpage", value: 32, color: "#3b82f6" },
  { name: "Zalo", value: 24, color: "#f59e0b" },
  { name: "Tổng đài", value: 12, color: "#10b981" },
  { name: "Contact form", value: 8, color: "#facc15" },
  { name: "Tự tìm đến", value: 15, color: "#ec4899" },
  { name: "Website", value: 7, color: "#0ea5e9" },
  { name: "Seeding", value: 5, color: "#8b5cf6" },
];

// 5. Các tùy chọn trạng thái cho Dropdown
export const STATUS_OPTIONS = [
  "Mới",
  "Đã liên hệ",
  "Đã hẹn kiểm tra",
  "Đã kiểm tra",
  "Đăng ký học",
];

// 6. Thống kê trạng thái Leads (Danh sách cột bên trái)
export const LEAD_STATUS_COUNTS = [
  { label: "Mới", val: 86 },
  { label: "Đã liên hệ", val: 45 },
  { label: "Đã hẹn kiểm tra", val: 12 },
  { label: "Đã kiểm tra", val: 8 },
  { label: "Đăng ký học", val: 5 },
];
