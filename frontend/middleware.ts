import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Lấy token và role từ Cookie
  const token = request.cookies.get("user-token")?.value;
  const role = request.cookies.get("user-role")?.value;
  const { pathname } = request.nextUrl;

  // 2. Nếu chưa đăng nhập mà cố vào /dashboard/... -> Đá về trang chủ
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. Nếu ĐÃ đăng nhập mà cố vào trang Login (/) -> Đẩy vào đúng dashboard của role đó
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  // 4. CHỐNG VÀO NHẦM ROLE: Ví dụ giáo viên cố vào /dashboard/admin
  if (token && role && pathname.startsWith("/dashboard")) {
    const rootFolder = pathname.split("/")[2]; // Lấy chữ 'admin' hoặc 'teacher' trong /dashboard/admin

    // Nếu role trong cookie không khớp với folder đang vào -> Đẩy về đúng chỗ
    if (rootFolder && rootFolder !== role) {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  return NextResponse.next();
}

// Chỉ chạy Middleware cho các đường dẫn Dashboard
export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
