import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "./lib/utils";
import { cookies } from "next/headers";

const publicApiPaths = [
  "/api/stats",
  "/api/auth/login",
  "/api/health",
  "/api/auth/register",
  "/api/auth/logout",
];

const publicPaths = ["/", "/login", "/signup", "/logout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = await cookies();
  const isLoggedIn = sessionCookie.get("LOGGED_IN");

  // Check if the request is for an API route and not a public API path
  if (pathname.startsWith("/api") && !publicApiPaths.includes(pathname)) {
    const token = request.headers.get("Authorization");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Verify the JWT token
      await verifyAuthToken(token.replace("Bearer ", ""));
      return NextResponse.next();
    } catch (error) {
      console.error("JWT verification failed:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else if (!pathname.startsWith("/api")) {
    // Handle non-API routes
    if (pathname === "/signup") {
      if (isLoggedIn) return NextResponse.redirect("/");
      return NextResponse.next();
    }

    if (!publicPaths.includes(pathname) && !isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
