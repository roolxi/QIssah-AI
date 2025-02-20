"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

export type Bot = {
  id: string;
  name: string;
  description: string;
  image?: string;
  personality: string;
  accent?: string;
};

export default function ChatBotIdPage() {
  const { botId } = useParams() as { botId: string };
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // نخزن كامل المحادثة هنا
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBot = async () => {
      try {
        const response = await fetch(`/api/bots/${botId}`);
        if (!response.ok) throw new Error("Failed to fetch bot");
        const data = await response.json();
        setBot(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchBot();
  }, [botId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg = { sender: "user" as const, text: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot: { personality: bot?.personality, accent: bot?.accent, name: bot?.name },
          conversation: [...messages, userMsg],
        }),
      });
      if (!response.ok) throw new Error("Failed to get response from bot");
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading bot details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!bot) return <p className="text-center mt-10 text-gray-400">Bot not found.</p>;

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} setMenuOpen={setMenuOpen} />
      <MobileMenu darkMode={darkMode} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{bot.name}</h1>
        <p className="mb-6">{bot.description}</p>

        {/* صندوق المحادثة مع عرض الرسائل من الأسفل للأعلى */}
        <div
          className={`rounded-lg p-4 mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-200"} h-[400px] overflow-y-auto flex flex-col-reverse gap-3`}
        >
          {messages
            .slice(0)
            .reverse()
            .map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-[70%] px-3 py-2 rounded text-sm shadow ${
                  message.sender === "user"
                    ? "bg-blue-600 text-white self-end ml-auto"
                    : "bg-gray-700 text-white self-start mr-auto"
                }`}
                style={{ whiteSpace: "pre-wrap" }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={
                    message.sender === "bot"
                      ? {
                          em: ({ ...props }) => <em style={{ color: "lightblue" }} {...props} />,
                        }
                      : {}
                  }
                >
                  {message.text}
                </ReactMarkdown>
              </motion.div>
            ))}
        </div>

        {/* صندوق الإدخال */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className={`flex-grow px-3 py-2 rounded border focus:outline-none ${
              darkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="flex items-center justify-center p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <FaPaperPlane className="text-white" size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
