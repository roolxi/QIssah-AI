import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Get the raw secret from the environment
const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Sanitize the secret by removing non-ASCII characters
const SECRET_KEY = rawSecret.replace(/[^\x00-\x7F]/g, "");
console.log("Sanitized JWT_SECRET:", SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT using a Buffer of the sanitized secret
    const token = jwt.sign(
      { id: user.id, email: user.email },
      Buffer.from(SECRET_KEY, "utf-8"),
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({ message: "Login successful", user });
    response.headers.append(
      "Set-Cookie",
      `token=${token}; Path=/; Max-Age=604800; Secure; SameSite=None; Domain=qissah-ai.vercel.app`
    );
    response.headers.append(
      "Set-Cookie",
      `username=${user.username}; Path=/; Max-Age=604800; Secure; SameSite=None; Domain=qissah-ai.vercel.app`
    );

    return response;
  } catch (error) {
    console.error("Error processing login:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
