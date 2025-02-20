import { NextRequest, NextResponse } from "next/server";
import { getBotResponse } from "@/lib/getBotResponse";

export async function POST(req: NextRequest) {
  try {
    const { bot, conversation } = await req.json();
    // نجمع كامل المحادثة في نص واحد
    let conversationText = conversation
      .map((msg: { sender: string; text: string }) =>
        msg.sender === "user" ? `المستخدم: ${msg.text}` : `البوت: ${msg.text}`
      )
      .join("\n");

    // إذا تجاوزت عدد الرسائل 20، نقوم بالتلخيص
    if (conversation.length >= 20) {
      const summary = await getBotResponse({ personality: "Summarizer", accent: "Neutral" }, conversationText);
      const latestMessage = conversation[conversation.length - 1];
      conversationText = `ملخص: ${summary}\n\nالمستخدم: ${latestMessage.text}`;
    }

    const reply = await getBotResponse(bot, conversationText);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
