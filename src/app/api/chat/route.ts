import { NextRequest, NextResponse } from "next/server";
import { getBotResponse } from "@/lib/getBotResponse";

export async function POST(req: NextRequest) {
  try {
    // قراءة البيانات من جسم الطلب
    const { bot, conversation } = await req.json();

    // دمج كامل المحادثة في نص واحد مع تحديد من المرسل
    let conversationText = conversation
      .map((msg: { sender: string; text: string }) =>
        msg.sender === "user" ? `المستخدم: ${msg.text}` : `البوت: ${msg.text}`
      )
      .join("\n");

    // إذا كانت المحادثة تحتوي على 20 رسالة أو أكثر، نقوم بتلخيصها
    if (conversation.length >= 20) {
      const summary = await getBotResponse({ personality: "Summarizer", accent: "Neutral" }, conversationText);
      const latestMessage = conversation[conversation.length - 1];
      conversationText = `ملخص: ${summary}\n\nالمستخدم: ${latestMessage.text}`;
    }

    // استدعاء getBotResponse مع البيانات المُجمعة من المحادثة
    const reply = await getBotResponse(bot, conversationText);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
