import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "./lib/jwt";

const protectedRoutes = ["/dashboard", "/simulado", "/simulados", "/resultado"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const isAdminRoute = pathname.startsWith("/admin");
  const isStudentRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isAdminRoute && !isStudentRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const payload = await verifyAuthToken(token);

    if (isAdminRoute && payload.tipo !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(AUTH_COOKIE);
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/simulado/:path*", "/simulados/:path*", "/resultado/:path*", "/admin/:path*"],
};
