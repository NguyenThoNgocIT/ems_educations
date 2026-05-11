export interface NotificationEntry {
  id: number;
  sendDate: string;
  title: string;
  sender: string;
  status: "sent" | "draft";
}

const notificationsData: NotificationEntry[] = [
  {
    id: 1,
    sendDate: "16:39 28/08/2024",
    title: "THÔNG BÁO ĐẾN TOÀN BỘ THÀNH VIÊN TRUNG TÂM ANH NGỮ MONA",
    sender: "Admin",
    status: "sent",
  },
];

export default notificationsData;
