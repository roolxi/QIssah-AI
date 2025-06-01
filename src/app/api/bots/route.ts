// src/app/api/bots/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPayload } from "@/lib/getPayload";

export async function GET() {
  // رجّع جميع البوتات مع منشئها وتصنيفها وعدد اللايكات
  const bots = await prisma.bot.findMany({
    include: {
      creator: { select: { username: true } },
      category: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(bots);
}

export async function POST(req: NextRequest) {
  try {
    // تأكد إن المستخدم مسجّل وجلب الـ userId من التوكن
    const { id: userId } = await getPayload(req);
    // اقرأ بيانات النموذج
    const {
      name,
      description,
      image,
      personality,
      accent,
      categoryId,
      isPublic,
    } = await req.json();

    // أنشئ البوت
    const bot = await prisma.bot.create({
      data: {
        name,
        description,
        image: image || null,
        personality: personality || "",
        accent: accent || null,
        categoryId: categoryId || null,
        isPublic,
        creatorId: userId,
      },
    });

    // أرسل الـ id للصفحة عشان تحوّل عليه
    return NextResponse.json({ id: bot.id });
  } catch (e: any) {
    console.error("Error creating bot:", e);
    return NextResponse.json(
      { error: e.message || "Failed to create bot" },
      { status: 400 }
    );
  }
}
