// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isLoginPage = nextUrl.pathname === "/admin/login";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoginPage && !isLoggedIn) {
    const url = new URL("/admin/login", nextUrl.origin);
    url.searchParams.set("from", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};