import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allowlist: public and static routes
  const isPublicPath =
    pathname === "/" ||
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/public") ||
    pathname === "/favicon.ico";

  // Allow direct requests for files in the `public/` folder (e.g. `/vercel.svg`, `/next.svg`)
  const isStaticFile = /\.[0-9a-z]+$/i.test(pathname);

  if (isStaticFile) return NextResponse.next();

  if (isPublicPath) return NextResponse.next();

  // Check auth cookie `user-token`
  const token = req.cookies.get("user-token")?.value;
  if (!token) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/signin";
    // preserve original path so sign-in can redirect back
    signInUrl.search = `redirect=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
