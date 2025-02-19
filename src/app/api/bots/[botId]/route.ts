import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { botId: string } }
) {
  const { botId } = params;

  try {
    const bot = await prisma.bot.findUnique({
      where: {
        id: botId,
      },
    });

    if (!bot) {
      return new NextResponse(JSON.stringify({ error: "Bot not found" }), { status: 404 });
    }

    return new NextResponse(JSON.stringify(bot));
  } catch (error) {
    console.error("Error fetching bot by ID:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to fetch bot" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
