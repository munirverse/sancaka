import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "./lib/utils";

const publicApiPaths = [
  "/api/stats",
  "/api/auth/login",
  "/api/health",
  "/api/auth/register",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
  }

  return NextResponse.next();
}
