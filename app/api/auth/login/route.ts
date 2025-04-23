import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { createAuthToken } from "@/lib/utils";

const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = loginUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashResult = bcrypt.compareSync(password, existingUser[0].password);

    if (!hashResult) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const user = {
      ...existingUser[0],
      password: undefined, // Exclude password from the response
      createdAt: undefined, // Exclude createdAt from the response
      updatedAt: undefined, // Exclude updatedAt from the response
      id: undefined, // Exclude id from the response
    };

    const token = await createAuthToken(user);

    return NextResponse.json(
      {
        message: "User logged in successfully",
        data: { user, token },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("failed to login user", error);
    return NextResponse.json(
      { error: "failed to login user" },
      { status: 500 }
    );
  }
}
