import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./types/common";

const DASHBOARDS: Record<UserRole, string> = {
  USER: "/user/dashboard",
  AUTHOR: "/author/dashboard",
  ADMIN: "/admin/dashboard",
  EDITOR: "/editor/dashboard",
};

// প্রোটেক্টেড রুটগুলো ছোট হাতের অক্ষরে ম্যাপ করা (URL-এর সাথে মিলানোর জন্য)
const PROTECTED_PREFIXES = Object.keys(DASHBOARDS).map((role) =>
  role.toLowerCase(),
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // token.role যদি বড় হাতের থাকে (ADMIN), তবে তাকে string হিসেবে নিয়ে রাখা
  const userRole = token?.role as UserRole;

  // ১. লগইন করা ইউজারকে /auth পেজ থেকে সরিয়ে দেওয়া
  if (token && pathname.startsWith("/auth")) {
    const dashboardUrl = DASHBOARDS[userRole] || "/";
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // ২. প্রোটেক্টড রুট চেক করা (যেমন: /admin/..., /user/...)
  const matchedPrefix = PROTECTED_PREFIXES.find((prefix) =>
    pathname.startsWith(`/${prefix}`),
  );

  if (matchedPrefix) {
    // লগইন করা না থাকলে /auth পেজে পাঠানো
    if (!token) {
      const signInUrl = new URL("/auth", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // ৩. রোল ভিত্তিক এক্সেস কন্ট্রোল (Case-insensitive check)
    // ইউজারের রোল যদি 'ADMIN' হয় আর সে যদি '/admin' রুটে থাকে তবে ঢুকতে দাও
    if (matchedPrefix !== userRole.toLowerCase()) {
      const fallbackUrl = DASHBOARDS[userRole] || "/";
      return NextResponse.redirect(new URL(fallbackUrl, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // স্ট্যাটিক ফাইল এবং ইন্টারনাল রুট বাদ দিয়ে সব রুট চেক করবে
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
