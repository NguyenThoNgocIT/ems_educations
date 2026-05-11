import { Outfit } from "next/font/google";
import "./globals.css";
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
// 1. Import component hạt vào đây
import ParticlesBackground from "@/components/common/ParticlesBackground";

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} relative bg-white dark:bg-[#020617]`}
      >
        <ThemeProvider>
          {/* 2. Đặt component hạt ở đây 
              Nó sẽ phủ toàn màn hình nhờ logic 'fixed inset-0' bên trong component 
          */}
          <ParticlesBackground />

          <SidebarProvider>
            {/* z-10 đảm bảo nội dung chính nằm trên lớp hạt */}
            <div className="relative z-10">{children}</div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
