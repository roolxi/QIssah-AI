import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // استخراج الكوكي من الهيدر
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = tokenMatch[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    const userId = (decoded as any).id;
    if (!userId) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });
    }

    // قراءة بيانات التحديث من جسم الطلب
    const { email, botName, bio, password } = await req.json();

    // بناء كائن التحديث
    const updateData: { email?: string; username?: string; bio?: string; password?: string } = {};
    if (email) updateData.email = email;
    if (botName) updateData.username = botName;
    if (bio) updateData.bio = bio;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } finally {
    await prisma.$disconnect();
  }
}
