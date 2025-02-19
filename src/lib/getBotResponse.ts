import fetch from "node-fetch";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ID = "gemini-2.0-flash"; // الموديل المستخدم

export async function getBotResponse(bot: any, message: string) {
  if (!API_KEY) {
    throw new Error("❌ لم يتم العثور على مفتاح API لـ Gemini في بيئة التشغيل!");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: `الشخصية: ${bot.personality}\nاللهجة: ${bot.accent || "سعودية"}\n\nالمستخدم: ${message}\nالبوت:` },
        ],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ خطأ في استجابة Gemini API:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: any = await response.json();
    
    // استخراج الرد الصحيح من البيانات
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ لم أتمكن من معالجة الطلب!";
    
    return botReply;
  } catch (error) {
    console.error("❌ خطأ أثناء جلب رد البوت:", error);
    return "عذرًا، هناك خطأ في معالجة الطلب.";
  }
}
