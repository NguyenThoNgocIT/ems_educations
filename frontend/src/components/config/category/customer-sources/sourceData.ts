export interface CustomerSource {
  name: string;
  editor: string;
  updatedAt: string;
}

export const initialSourceData: CustomerSource[] = [
  { name: "ContactForm", editor: "Hoàng Anh Hùng", updatedAt: "2025-11-17" },
  {
    name: "Cuộc thi Chiến binh mùa hè",
    editor: "Admin",
    updatedAt: "2024-08-30",
  },
  { name: "Facebook ADS", editor: "Admin", updatedAt: "2024-08-28" },
  { name: "Fanpage", editor: "Admin", updatedAt: "2024-08-28" },
  { name: "Seeding", editor: "Admin", updatedAt: "2024-08-30" },
  { name: "Tổng đài", editor: "Admin", updatedAt: "2024-08-28" },
  { name: "Tự tìm đến", editor: "Admin", updatedAt: "2024-08-28" },
  { name: "Website", editor: "Admin", updatedAt: "2024-08-30" },
  { name: "Zalo", editor: "Admin", updatedAt: "2024-08-28" },
];
