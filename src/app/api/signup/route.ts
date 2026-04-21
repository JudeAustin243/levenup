import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least 1 uppercase letter and 1 number" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: { name, email, passwordHash, role: "parent" },
    });

    return NextResponse.json({ message: "Account created successfully" });
  } catch (err) {
    console.error("Signup error:", err);

    const message = err instanceof Error ? err.message : "Something went wrong";
    const lower = message.toLowerCase();
    const dbConnectionError =
      lower.includes("sasl") ||
      lower.includes("connect") ||
      lower.includes("database") ||
      lower.includes("econnrefused");

    return NextResponse.json(
      {
        error: dbConnectionError
          ? "We couldn't connect to the database. Please check your database settings and try again."
          : message,
      },
      { status: dbConnectionError ? 503 : 500 }
    );
  }
}
