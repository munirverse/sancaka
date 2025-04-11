import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { instances } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateInstanceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
  interval: z
    .string()
    .min(1, "Interval is required")
    .transform((val) => parseInt(val)),
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

    await db.delete(instances).where(eq(instances.id, parseInt(id)));

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

    const { name, url, interval } = validationResult.data;

    const updateInstance = { name, url, interval, updatedAt: new Date() };

    await db
      .update(instances)
      .set(updateInstance)
      .where(eq(instances.id, parseInt(id)));

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
