const API_KEY = process.env.GEMINI_API_KEY;
const MODEL_ID = "gemini-2.0-flash"; // النموذج المستخدم

interface Bot {
  personality: string;
  accent?: string;
}

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

export async function getBotResponse(bot: Bot, message: string) {
  if (!API_KEY) {
    throw new Error("❌ لم يتم العثور على مفتاح API لـ Gemini!");
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${API_KEY}`;

  // موجه جديد بأسلوب دوربلاي مختصر ومنظم
  const prompt = `اسلوب: دوربلاي، مختصر ومنظم بسطر لكل فكرة.
الشخصية: ${bot.personality}
اللهجة: ${bot.accent || "سعودية"}
المستخدم: ${message}
البوت:`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API Error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data: GeminiResponse = await response.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ لم أتمكن من معالجة الطلب!";
    return botReply;
  } catch (error) {
    console.error("❌ Error in getBotResponse:", error);
    return "عذرًا، حدث خطأ أثناء معالجة الطلب.";
  }
}
