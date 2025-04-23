import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

const createUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = createUserSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    // Check if the user already exists
    const existingUser = await db.select().from(users).limit(1).execute();

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const newUser = {
      username,
      password: bcrypt.hashSync(password, 10), // In a real application, you should hash the password before storing it
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new user into the database
    const [inserted] = (await db.insert(users).values(newUser).returning()).map(
      (item) => ({ ...item, password: undefined })
    ); // Exclude password from the response

    return NextResponse.json(
      { message: "User registered successfully", data: inserted },
      { status: 201 }
    );
  } catch (error) {
    console.error("failed to register user", error);
    return NextResponse.json(
      { error: "failed to register user" },
      { status: 500 }
    );
  }
}
