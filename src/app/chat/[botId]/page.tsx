// src/app/chat/[botId]/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
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

  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [userProfile, setUserProfile] = useState({ botName: "", bio: "" });

  // Fetch bot data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/bots/${botId}`);
        if (!res.ok) throw new Error("Failed to fetch bot");
        setBot(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [botId]);

  // Fetch user profile
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserProfile({
            botName: data.botName || "",
            bio: data.bio || "",
          });
        }
      } catch {}
    })();
  }, []);

  // Send message handler
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const userMsg = { sender: "user" as const, text: newMessage };
    setMessages((prev) => [...prev, userMsg]);
    setNewMessage("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot: {
            personality: bot?.personality,
            accent: bot?.accent,
            name: bot?.name,
            userName: userProfile.botName,
            bio: userProfile.bio,
          },
          conversation: [...messages, userMsg],
        }),
      });
      if (!res.ok) throw new Error("Bot response failed");
      const { reply } = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch {}
  };

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading)
    return (
      <p className="text-center mt-10 text-lg">Loading bot details...</p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error: {error}</p>
    );
  if (!bot)
    return (
      <p className="text-center mt-10 text-gray-400">Bot not found.</p>
    );

  return (
    <div
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#4A2C6B] to-[#7B4EAD] text-white"
      style={{ overflowY: "hidden" }}
    >
      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode((m) => !m)}
        onMenuToggle={() => setMenuOpen((o) => !o)}
      />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="pt-16 flex-1 flex flex-col">
        {/* Back Button */}
        <div className="p-4">
          <button
            onClick={() => history.back()}
            className="text-white text-lg"
          >
            &lt; back
          </button>
        </div>

        {/* Chat Header */}
        <div className="mb-4 hidden md:block px-6">
          <h1 className="text-2xl font-bold">{bot.name}</h1>
          <p className="text-sm">{bot.description}</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4" ref={chatRef}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-2 mb-4 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <img
                  src={bot.image || "/default-bot-avatar.png"}
                  alt="bot avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div
                className={`p-3 rounded-lg max-w-xs break-words ${
                  msg.sender === "user"
                    ? "bg-[#3C3C3C] self-end"
                    : "bg-[#8E6FB0] self-start"
                }`}
              >
                <p className="font-bold text-sm">
                  {msg.sender === "bot" ? bot.name : "YOU"}
                </p>
                {/* هنا الفتحة: أي نص مائل يصير لونه سيان */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    em: ({ children, ...props }) => (
                      <em
                        {...props}
                        style={{ color: "cyan" }}
                        className="italic"
                      >
                        {children}
                      </em>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              {msg.sender === "user" && (
                <img
                  src="/default-user-avatar.png"
                  alt="user avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white/10 backdrop-blur-sm mx-4 mb-4 rounded-lg flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded bg-transparent placeholder-white focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 transition"
          >
            <FaPaperPlane className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
