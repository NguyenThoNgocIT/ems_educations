import Sidebar from "@/components/study/calendar/home-office/Sidebar";

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-black">
      {/* 1. Sidebar nằm cố định bên trái */}
      <Sidebar />

      {/* 2. Vùng nội dung chính bên phải */}
      <main className="flex-1 overflow-x-hidden p-6">
        <div className="mx-auto max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
