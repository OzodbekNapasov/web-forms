import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Admin Routes
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  const sessionCookie = request.cookies.get("sb-access-token")?.value || request.cookies.get("edusurvey_admin_session")?.value;

  if (isAdminRoute && !sessionCookie) {
    // Redirect unauthenticated user to login
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoginRoute && sessionCookie) {
    // Redirect authenticated admin to admin dashboard
    const dashboardUrl = new URL("/admin", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
