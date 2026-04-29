export interface Parent {
  id: string;
  name: string;
  username: string | null;
  phone: string | null;
  dob: string;
  gender: "Nam" | "Nữ" | null;
}

export const parentData: Parent[] = [
  {
    id: "PH260130-1",
    name: "Huỳnh Bảo Huyền",
    username: null,
    phone: "0349911063",
    dob: "02/02/2026",
    gender: null,
  },
  {
    id: "PH250926-1",
    name: "Thanh Hằng",
    username: null,
    phone: null,
    dob: "02/02/2026",
    gender: "Nữ",
  },
  {
    id: "PH240920-22",
    name: "Huong Tran",
    username: "huong.tran",
    phone: "0349911063",
    dob: "02/02/2026",
    gender: "Nữ",
  },
  {
    id: "PH240920-15",
    name: "Huỳnh Bảo Huyền",
    username: null,
    phone: "0349911063",
    dob: "02/02/2026",
    gender: "Nam",
  },
];
