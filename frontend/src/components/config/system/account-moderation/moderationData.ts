export interface DeviceModeration {
  id: string;
  email: string;
  studentId: string;
  studentName: string;
  deviceName: string;
  os: string;
  browser: string;
  hasAccess: boolean;
}

export const initialModerationData: DeviceModeration[] = [
  {
    id: "DEV-001",
    email: "vietviet@gmail.com",
    studentId: "HV240916-1",
    studentName: "Bùi Đức Việt",
    deviceName: "iPhone 15 Pro Max",
    os: "iOS 17.2",
    browser: "Safari Mobile",
    hasAccess: true,
  },
  {
    id: "DEV-002",
    email: "vietviet@gmail.com",
    studentId: "HV240916-1",
    studentName: "Bùi Đức Việt",
    deviceName: "Dell XPS 13",
    os: "Windows 11",
    browser: "Chrome 120",
    hasAccess: true,
  },
  {
    id: "DEV-003",
    email: "sonminh@gmail.com",
    studentId: "HV240828-002",
    studentName: "Trần Minh Sơn",
    deviceName: "Macbook Air M2",
    os: "macOS Sonoma",
    browser: "Edge",
    hasAccess: false,
  },
];
