import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { count, ilike, desc } from "drizzle-orm";

const createNotificationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["telegram", "slack"]),
  details: z.union([
    z
      .object({
        chatId: z.string().min(1, "Chat ID is required"),
        botToken: z.string().min(1, "Bot Token is required"),
      })
      .refine((data) => data.chatId && data.botToken, {
        message: "Both chatId and botToken are required for Telegram",
      }),
    z.object({
      webhookUrl: z.string().url("Webhook URL must be a valid URL"),
      channelName: z.string().optional(),
    }),
  ]),
});

// GET /api/notifications
export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams;
    const limit = query.get("limit") || "10";
    const page = query.get("page") || "1";
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const search = query.get("q") || "";

    const notificationsQuery = db.select().from(notifications);

    if (search) {
      notificationsQuery.where(ilike(notifications.name, `%${search}%`));
    }

    const listNotifications = await notificationsQuery
      .limit(parseInt(limit))
      .offset(offset)
      .orderBy(desc(notifications.updatedAt));

    const totalNotifications = await db
      .select({ count: count() })
      .from(notifications);

    const total = totalNotifications[0].count;
    const totalPages = Math.ceil(total / parseInt(limit));

    const response = {
      message: "Notifications fetched successfully",
      data: {
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
        },
        list: listNotifications,
      },
    };

    return NextResponse.json(response);
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
    const body = await request.json();

    const validationResult = createNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { name, type, details } = validationResult.data;

    const newNotification = {
      name,
      type,
      details: JSON.stringify(details),
    };

    const [inserted] = await db
      .insert(notifications)
      .values(newNotification)
      .returning();

    const response = {
      message: "Notification added successfully",
      data: inserted,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Failed to add notification:", error);
    return NextResponse.json(
      { error: "Failed to add notification" },
      { status: 500 }
    );
  }
}
