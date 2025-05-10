import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(_: NextRequest) {
  try {
    const sessionCookie = await cookies();

    sessionCookie.delete("LOGGED_IN");

    return NextResponse.json(
      { message: "User logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("failed to logout user", error);
    return NextResponse.json(
      { error: "failed to logout user" },
      { status: 500 }
    );
  }
}
