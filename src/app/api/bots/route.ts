import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import crypto from "crypto";

const prisma = new PrismaClient();

function generateApiKey() {
  return crypto.randomBytes(20).toString("hex");
}

export async function GET() {
  try {
    const bots = await prisma.bot.findMany();
    return NextResponse.json(bots);
  } catch (error) {
    console.error("Error fetching bots:", error);
    return NextResponse.json({ error: "Failed to fetch bots" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, image, personality, accent, isPublic, creatorId } = await request.json();
    const apiKey = generateApiKey();
    const newBot = await prisma.bot.create({
      data: {
        name,
        description,
        image,
        personality,
        accent, 
        isPublic: isPublic !== undefined ? isPublic : true,
        creatorId,
        apiKey,
      },
    });
    return NextResponse.json(newBot, { status: 201 });
  } catch (error) {
    console.error("Error creating bot:", error);
    return NextResponse.json({ error: "Failed to create bot" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
