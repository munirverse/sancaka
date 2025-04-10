import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { instances } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Create a Zod schema for validation
const createInstanceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  interval: z
    .string()
    .min(1, "Interval is required")
    .transform((val) => parseInt(val)),
});

// GET /api/instances
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const limit = query.get("limit") || "10";
  const page = query.get("page") || "1";
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const listInstances = await db
    .select()
    .from(instances)
    .limit(parseInt(limit))
    .offset(offset);

  return NextResponse.json(listInstances);
}

// POST /api/instances
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body using Zod
    const validationResult = createInstanceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, url, interval } = validationResult.data;

    // Create new instance with default values
    const newInstance = {
      name,
      url,
      status: "offline" as const,
      interval,
      responseTime: "0ms", // Note: using snake_case for DB column
      uptime: "0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database using Drizzle
    const [inserted] = await db
      .insert(instances)
      .values(newInstance)
      .returning();

    // Transform the response to match your API format
    const response = {
      ...inserted,
      responseTime: inserted.responseTime, // Convert back to camelCase for API
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Failed to create instance:", error);
    return NextResponse.json(
      { error: "Failed to create instance" },
      { status: 500 }
    );
  }
}
