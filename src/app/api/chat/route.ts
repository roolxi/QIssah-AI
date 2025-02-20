import { NextRequest, NextResponse } from "next/server";
import { getBotResponse } from "@/lib/getBotResponse";

// دالة تلخيص المحادثة
async function summarizeConversation(conversationText: string): Promise<string> {
  const summaryPrompt = `الرجاء تلخيص المحادثة التالية بشكل مختصر وواضح مع الحفاظ على السياق والحقائق الأساسية:\n\n${conversationText}\n\nالملخص:`;
  // نستخدم getBotResponse كأداة تلخيص مع شخصية Summarizer ولهجة محايدة
  const summary = await getBotResponse({ personality: "Summarizer", accent: "Neutral" }, summaryPrompt);
  return summary;
}

export async function POST(req: NextRequest) {
  try {
    const { bot, conversation } = await req.json();

    // نجمع كامل المحادثة في نص واحد
    let conversationText = conversation
      .map((msg: { sender: string; text: string }) => {
        return msg.sender === "user" ? `المستخدم: ${msg.text}` : `البوت: ${msg.text}`;
      })
      .join("\n");

    // إذا تجاوزت عدد الرسائل 20، نقوم بتلخيص المحادثة
    if (conversation.length >= 20) {
      const summary = await summarizeConversation(conversationText);
      // نأخذ آخر رسالة للمستخدم ونبني السياق الجديد مع الملخص
      const latestMessage = conversation[conversation.length - 1];
      conversationText = `ملخص المحادثة: ${summary}\n\nالمستخدم: ${latestMessage.text}`;
    }

    // استدعاء دالة getBotResponse مع السياق (سواء كان الملخص أو المحادثة كاملة)
    const reply = await getBotResponse(bot, conversationText);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/chat route:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
