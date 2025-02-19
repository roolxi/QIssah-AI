import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
  botId: string;
}

// ✅ Correcting the type for `context` parameter
export async function GET(
  request: Request, 
  context: { params: Params } // ✅ This is the correct way to define params
) {
  const { botId } = context.params;

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
    console.error("Error fetching bot by ID:", error);
    return NextResponse.json(
      { error: "Failed to fetch bot" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
