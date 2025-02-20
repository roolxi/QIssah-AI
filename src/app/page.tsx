import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function POST(req: Request) {
  try {
    // Log the secret for debugging (remove in production)
    console.log("JWT_SECRET:", SECRET_KEY);

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

    // Use SECRET_KEY directly as a string (ensure it contains only ASCII characters)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY as string,
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
