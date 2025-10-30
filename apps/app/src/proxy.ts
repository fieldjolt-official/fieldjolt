import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // if user is not at /auth and does not have a session cookie, redirect to /auth
  if (!(sessionCookie || request.nextUrl.pathname.startsWith("/auth"))) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  // if user is at /auth and has a session cookie, redirect to /
  if (sessionCookie && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
