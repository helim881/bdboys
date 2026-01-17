import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// Map your Prisma Enums to the URL paths
const ROLE_PATHS: Record<string, string> = {
  USER: "/user",
  ADMIN: "/admin",
  SUPER_ADMIN: "/admin", // Super admin uses admin routes
  AUTHOR: "/author",
  EDITOR: "/editor",
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // 1. Define all root folders that require protection
  const protectedPaths = ["/user", "/admin", "/author", "/editor"];
  const isProtectedArea = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  // 2. If NOT logged in and trying to access ANY protected route
  if (isProtectedArea && !token) {
    const signInUrl = new URL("/auth", req.url);

    return NextResponse.redirect(signInUrl);
  }

  // 3. If LOGGED IN
  if (token) {
    const userRole = (token.role as string).toUpperCase();
    const allowedPath = ROLE_PATHS[userRole];

    // Redirect away from auth pages if already logged in
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(`${allowedPath}/dashboard`, req.url),
      );
    }

    // ROLE ENFORCEMENT:
    // If user is in a protected area that doesn't belong to their role
    // Example: Role is 'USER', but pathname starts with '/admin'
    if (isProtectedArea && !pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(
        new URL(`${allowedPath}/dashboard`, req.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
