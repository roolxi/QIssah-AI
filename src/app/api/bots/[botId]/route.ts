import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ✅ Using `context` instead of `{ params }` to avoid Next.js errors
export async function GET(
  request: Request,
  context: { params: { botId: string } } // ✅ Corrected type for params
) {
  const botId = context.params?.botId;

  if (!botId) {
    return NextResponse.json({ error: "Bot ID is required" }, { status: 400 });
  }

  try {
    const bot = await prisma.bot.findUnique({
      where: {
        id: botId,
      },
    });

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    return NextResponse.json(bot);
  } catch (error) {
    console.error("❌ Error fetching bot by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch bot" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
