import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { instances } from "@/lib/db/schema";
import { desc, count, like } from "drizzle-orm";
import { publish } from "@/lib/pubsub/check-instance";

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
  const search = query.get("q") || "";

  const instancesQuery = db.select().from(instances);

  if (search) {
    instancesQuery.where(like(instances.name, `%${search}%`));
  }

  const listInstances = await instancesQuery
    .limit(parseInt(limit))
    .offset(offset)
    .orderBy(desc(instances.updatedAt));

  const totalInstances = await db.select({ count: count() }).from(instances);

  const total = totalInstances[0].count;

  const totalPages = Math.ceil(total / parseInt(limit));

  const response = {
    message: "Instances fetched successfully",
    data: {
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages,
      },
      list: listInstances,
    },
  };

  return NextResponse.json(response);
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

    let status: "online" | "offline" = "offline";

    const instanceStartTime = performance.now();

    try {
      const instanceResponse = await fetch(url);

      if (instanceResponse.ok && instanceResponse.status === 200) {
        status = "online";
      }
    } catch (error) {
      status = "offline";
    }

    // Create new instance with default values
    const newInstance = {
      name,
      url,
      status,
      interval,
      responseTime: `${Math.round(performance.now() - instanceStartTime)}ms`,
      uptime: status === "online" ? "100" : "0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert into database using Drizzle
    const [inserted] = await db
      .insert(instances)
      .values(newInstance)
      .returning();

    // publish the instance to the queue
    publish({
      instanceId: inserted.id.toString(),
      name: inserted.name,
      url: inserted.url,
      interval: inserted.interval,
    });

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
