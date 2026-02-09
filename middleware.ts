import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // ১. লগইন করা ইউজারকে /auth পেজ থেকে সরিয়ে হোমপেজে পাঠিয়ে দেওয়া
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ২. প্রোটেক্টেড অ্যাডমিন রুট চেক করা
  if (pathname.startsWith("/admin")) {
    // যদি টোকেন না থাকে (লগইন করা নেই)
    if (!token) {
      const loginUrl = new URL("/auth", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname); // লগইনের পর ফিরে আসার জন্য
      return NextResponse.redirect(loginUrl);
    }

    // রোল চেক করা (Role-based access)
    // আপনার JWT টোকেনে 'role' প্রপার্টি আছে কিনা নিশ্চিত করুন
    const userRole = token.role as string;

    if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
      // যদি ইউজার অ্যাডমিন না হয়, তবে তাকে হোমপেজ বা আনঅথরাইজড পেজে পাঠিয়ে দিন
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // স্ট্যাটিক ফাইল বাদ দিয়ে সব রুট চেক করবে
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
