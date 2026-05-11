export interface ApprovalItem {
  id: string;
  requester: string;
  amount: number; // Dạng số để tính toán
  time: string;
  note: string;
  status: "Chờ duyệt" | "Đã duyệt" | "Không duyệt";
}

export const approvalData: ApprovalItem[] = [
  {
    id: "B250617-1",
    requester: "Nguyễn Minh Trang",
    amount: 176767,
    time: "17:07 17/06/2025",
    note: "",
    status: "Đã duyệt",
  },
  {
    id: "B240912-7",
    requester: "Nguyễn Minh Trang",
    amount: 12000000,
    time: "14:04 12/09/2024",
    note: "",
    status: "Đã duyệt",
  },
  {
    id: "B2408290044",
    requester: "Võ Minh Nam",
    amount: 15000000,
    time: "11:09 29/08/2024",
    note: "Sai thông tin",
    status: "Không duyệt",
  },
  {
    id: "B2408290045",
    requester: "Võ Minh Nam",
    amount: 15000,
    time: "11:08 29/08/2024",
    note: "",
    status: "Đã duyệt",
  },
  {
    id: "B2408280013",
    requester: "Võ Minh Nam",
    amount: 7000000,
    time: "17:06 28/08/2024",
    note: "Chưa nộp học phí",
    status: "Không duyệt",
  },
  {
    id: "B2408280004",
    requester: "Võ Minh Nam",
    amount: 5000000,
    time: "11:52 28/08/2024",
    note: "",
    status: "Đã duyệt",
  },
];
