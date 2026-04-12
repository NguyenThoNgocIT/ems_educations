export interface ZoomAccount {
  email: string;
  accountId: string;
  clientId: string;
  clientSecret: string;
  status: "Đang chạy" | "Dừng";
  createdAt: string;
  creator: string;
}

export const initialZoomData: ZoomAccount[] = [
  {
    email: "minhdh.6899@gmail.com",
    accountId: "-30jlonNTHuXS28K9cW9MA",
    clientId: "xS5whvAfTUSw8ztwjsqPg",
    clientSecret: "tftHKwL7G1sUrZFzUBtkUyfnjbc1IJFU",
    status: "Dừng",
    createdAt: "28/08/2024 16:56",
    creator: "Trần Văn Hùng",
  },
];
