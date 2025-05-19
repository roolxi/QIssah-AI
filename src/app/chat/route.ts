import { NextResponse } from "next/server";
import { getBotResponse } from "@/lib/getBotResponse";

export async function POST(request: Request) {
  try {
    const { bot, message } = await request.json();
    const reply = await getBotResponse(bot, message);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json({ error: "Failed to process the chat request" }, { status: 500 });
  }
}
