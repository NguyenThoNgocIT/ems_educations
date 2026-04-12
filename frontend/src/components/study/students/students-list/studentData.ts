export const STUDY_STATUS = {
  ACTIVE: {
    label: "Đang học",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  RESERVED: {
    label: "Bảo lưu",
    color: "bg-orange-50 text-orange-600 border-orange-100",
  },
  DROPPED: {
    label: "Nghỉ học",
    color: "bg-slate-50 text-slate-600 border-slate-100",
  },
};

export const ACCOUNT_STATUS = {
  OPEN: { label: "Hoạt động", color: "bg-green-500" },
  LOCKED: { label: "Khóa", color: "bg-red-500" },
};

export const studentsData = [
  {
    id: "HV250704-156",
    name: "Scarlett Lee Y5",
    phone: "-",
    email: "-",
    sessions: "0 / 0",
    class: "-",
    upsell: null,
    studyStatus: "ACTIVE",
    accountStatus: "OPEN",
  },
  {
    id: "HV251009-1",
    name: "Nguyễn Hữu Phước",
    phone: "0398980384",
    email: "abc@gmail.com",
    sessions: "1 / 1",
    class: "Test vio",
    upsell: "Không thể upsell",
    studyStatus: "ACTIVE",
    accountStatus: "OPEN",
  },
  {
    id: "HV260109-1",
    name: "Võ Đoàn",
    phone: "0945334535",
    email: "-",
    sessions: "1 / 2",
    class: "EBU 1G",
    upsell: null,
    studyStatus: "RESERVED",
    accountStatus: "LOCKED",
  },
];
