import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateNotificationSchema = z.object({
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

// DELETE /api/notifications/:id
export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = (await params) || { id: null };

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    } else if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [existingNotification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, parseInt(id)))
      .limit(1);

    if (!existingNotification) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    // Delete the instance
    await db.delete(notifications).where(eq(notifications.id, parseInt(id)));

    return NextResponse.json({ message: "Instance deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete instance" },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = (await params) || { id: null };

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    } else if (isNaN(parseInt(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    const parsedBody = updateNotificationSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.errors },
        { status: 400 }
      );
    }

    const [existingNotification] = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, parseInt(id)))
      .limit(1);

    if (!existingNotification) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    // Update the instance
    await db
      .update(notifications)
      .set(parsedBody.data)
      .where(eq(notifications.id, parseInt(id)));

    return NextResponse.json({ message: "Instance updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update instance" },
      { status: 500 }
    );
  }
}
