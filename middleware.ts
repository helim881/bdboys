import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // ১. লগইন করা ইউজারকে /auth পেজ থেকে সরিয়ে দেওয়া
  if (token && pathname.startsWith("/auth")) {
    const dashboardUrl = "/";
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // স্ট্যাটিক ফাইল এবং ইন্টারনাল রুট বাদ দিয়ে সব রুট চেক করবে
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
