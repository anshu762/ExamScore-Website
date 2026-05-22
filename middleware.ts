import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard"];
const authPaths = ["/auth/signin", "/auth/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("next-auth.session-token")?.value
    ?? request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuth = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !sessionToken) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuth && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
