import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/helpers/auth";

const authRoutes = ["/login", "/register", "/forgot-password"];
const protectedRoutes = ["/farmer", "/company", "/buyer"];
const commonProtectedRoutes = ["/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken");
  const userType = request.cookies.get("userType");

  // If protected route (including profile)
  if (
    [...protectedRoutes, ...commonProtectedRoutes].some((route) =>
      pathname.startsWith(route)
    )
  ) {
    if (!token?.value) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const { isValid, error } = await verifyToken(token.value);
      if (!isValid) {
        if (error === "Token is invalid or expired") {
          const response = NextResponse.redirect(
            new URL("/login", request.url)
          );
          response.cookies.delete("accessToken");
          response.cookies.delete("userType");
          return response;
        }
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // check user type for role-specific routes
      if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        if (!userType?.value) {
          const redirectResponse = NextResponse.redirect(
            new URL("/login", request.url)
          );
          redirectResponse.cookies.delete("accessToken");
          redirectResponse.cookies.delete("userType");
          return redirectResponse;
        }

        const allowedRoute = `/${userType.value}`;

        if (!pathname.startsWith(allowedRoute)) {
          return NextResponse.redirect(new URL(allowedRoute, request.url));
        }
      }
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("accessToken");
      response.cookies.delete("userType");
      return response;
    }
  }

  // Prevent authenticated users from accessing auth routes
  if (authRoutes.includes(pathname) && token) {
    try {
      if (userType?.value) {
        return NextResponse.redirect(
          new URL(`/${userType.value}`, request.url)
        );
      }
    } catch {
      // can't get user type -> redirect to signup
      return NextResponse.redirect(new URL("/signup", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all protected routes
    "/farmer/:path*",
    "/company/:path*",
    "/buyer/:path*",
    // Match profile routes
    "/profile/:path*",
    // Match auth routes
    "/login",
    "/register",
    "/forgot-password",
    // // Match verification routes
    // "/signup/:path*",
  ],
};
