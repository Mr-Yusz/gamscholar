import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth =
    pathname.startsWith("/dashboard") ||
    (pathname.startsWith("/scholarships/") && pathname.endsWith("/apply"));

  if (!needsAuth) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Only students can apply
  if (pathname.startsWith("/scholarships/") && pathname.endsWith("/apply")) {
    if (token.role !== "STUDENT") {
      const url = req.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/scholarships/:path*/apply"],
};
