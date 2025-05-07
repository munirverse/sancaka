import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { instances, instanceStatusHistory } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import { z } from "zod";
import { flushQueue, publish } from "@/lib/pubsub/check-instance";

const updateInstanceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  interval: z
    .string()
    .min(1, "Interval is required")
    .transform((val) => parseInt(val)),
  notificationId: z.string().optional(),
});

// DELETE /api/instances/:id
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

    const [existingInstance] = await db
      .select()
      .from(instances)
      .where(eq(instances.id, parseInt(id)))
      .limit(1);

    if (!existingInstance) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    // Delete the instance
    await db.delete(instances).where(eq(instances.id, parseInt(id)));

    // Flush the queue for the instance
    await flushQueue(id);

    return NextResponse.json({ message: "Instance deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete instance" },
      { status: 500 }
    );
  }
}

// PUT /api/instances/:id
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

    const [existingInstance] = await db
      .select()
      .from(instances)
      .where(eq(instances.id, parseInt(id)))
      .limit(1);

    if (!existingInstance) {
      return NextResponse.json(
        { error: "Instance not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const validationResult = updateInstanceSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, url, interval, notificationId } = validationResult.data;

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

    await db.insert(instanceStatusHistory).values({
      instanceId: parseInt(id),
      online: status === "online",
    });

    const [{ count: onlineHistoryCount }] = await db
      .select({ count: count() })
      .from(instanceStatusHistory)
      .where(
        and(
          eq(instanceStatusHistory.instanceId, parseInt(id)),
          eq(instanceStatusHistory.online, true)
        )
      );

    const [{ count: totalHistoryCount }] = await db
      .select({ count: count() })
      .from(instanceStatusHistory)
      .where(eq(instanceStatusHistory.instanceId, parseInt(id)));

    const updateInstance = {
      name,
      url,
      interval,
      status,
      notificationId: parseInt(notificationId || "") || null,
      responseTime: `${Math.round(performance.now() - instanceStartTime)}ms`,
      uptime: ((onlineHistoryCount / totalHistoryCount) * 100).toFixed(2),
      updatedAt: new Date(),
    };

    await db
      .update(instances)
      .set(updateInstance)
      .where(eq(instances.id, parseInt(id)));

    // Flush the queue for the instance
    await flushQueue(id);
    // re-publish the instance to the queue
    publish({ instanceId: id, interval: updateInstance.interval });

    const response = {
      ...updateInstance,
      id,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update instance" },
      { status: 500 }
    );
  }
}
