export interface Expertise {
  id: string;
  name: string;
  createdAt: string;
  creator: string;
}

export const expertiseData: Expertise[] = [
  {
    id: "Marketing1",
    name: "Marketing",
    createdAt: "19/12/2025 18:22",
    creator: "Võ Phương Duy",
  },
  {
    id: "NV6",
    name: "Ngữ Văn 6",
    createdAt: "27/11/2025 14:17",
    creator: "Admin",
  },
  {
    id: "ENG",
    name: "Tiếng Anh Sơ Cấp",
    createdAt: "27/01/2026 11:25",
    creator: "Hoàng Anh Hùng",
  },
  {
    id: "Phan Văn Gọi",
    name: "Toán",
    createdAt: "06/12/2025 15:11",
    creator: "Admin",
  },
  {
    id: "VCT",
    name: "Võ cổ truyền",
    createdAt: "25/10/2025 08:45",
    creator: "Admin",
  },
  {
    id: "VVN",
    name: "Vovinam - Việt Võ Đạo",
    createdAt: "04/07/2025 12:53",
    creator: "Admin",
  },
];
