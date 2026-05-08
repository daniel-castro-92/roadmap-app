import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "roadmap_session";
const LOGIN_PATH = "/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow login page and its API route
  if (pathname === LOGIN_PATH || pathname === "/api/login") {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const secret = process.env.APP_PASSWORD;

  if (!secret || session !== secret) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
