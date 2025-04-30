import { NextRequest, NextResponse } from "next/server";
import { users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredPayloadPassword =
      (body?.password || false) && (body?.currentPassword || false);

    if (!body.username && !requiredPayloadPassword) {
      return NextResponse.json(
        { error: "Username or password is required" },
        { status: 400 }
      );
    }

    const { username, password, currentPassword } = body;

    if (username) {
      const existingUser = await db.select().from(users).limit(1);

      await db
        .update(users)
        .set({ username })
        .where(eq(users.id, existingUser[0].id));

      return NextResponse.json(
        { message: "Username updated successfully" },
        { status: 200 }
      );
    }

    if (password && currentPassword) {
      const existingUser = await db.select().from(users).limit(1);

      const hashResult = bcrypt.compareSync(
        currentPassword,
        existingUser[0].password
      );

      if (!hashResult) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }

      const newPassword = bcrypt.hashSync(password, 10);

      await db
        .update(users)
        .set({ password: newPassword })
        .where(eq(users.id, existingUser[0].id));

      return NextResponse.json(
        { message: "Password updated successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while updating the user" },
      { status: 500 }
    );
  }
}
