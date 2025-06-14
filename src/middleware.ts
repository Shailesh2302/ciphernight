import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname === "/") // Only exact root path
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow authenticated users to access verification pages
  if (token && url.pathname.startsWith("/verify")) {
    return NextResponse.next();
  }

  // If user is not authenticated and tries to access protected pages
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/", "/verify/:path*"],
};
