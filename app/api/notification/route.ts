import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// GET /api/notifications
export async function GET(request: NextRequest) {
  try {
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// POST /api/notifications
export async function POST(request: NextRequest) {
  try {
  } catch (error) {
    console.error("Failed to add notification:", error);
    return NextResponse.json(
      { error: "Failed to add notification" },
      { status: 500 }
    );
  }
}
