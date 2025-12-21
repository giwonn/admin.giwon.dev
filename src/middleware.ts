import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isLoggedIn = !!token;
  const isOnLoginPage = request.nextUrl.pathname === "/login";

  // 로그인 페이지는 누구나 접근 가능
  if (isOnLoginPage) {
    if (isLoggedIn) {
      // 이미 로그인된 상태면 홈으로
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 그 외 페이지는 로그인 필요
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
