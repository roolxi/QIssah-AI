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

type Message = { sender: "user" | "bot"; text: string };

export type Bot = {
  id: string;
  name: string;
  description: string;
  image?: string;
  personality: string;
  accent?: string;
};

export default function ChatBotIdPage() {
  /* ────────── حالة الصفحة ────────── */
  const { botId } = useParams() as { botId: string };
  const [bot, setBot] = useState<Bot | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* واجهة المستخدم */
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  /* بيانات المستخدم (لإرسالها إلى الـ API) */
  const [userProfile, setUserProfile] = useState({ botName: "", bio: "" });

  /* ────────── جلب بيانات البوت ────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/bots/${botId}`);
        if (!res.ok) throw new Error("فشل جلب بيانات البوت");
        setBot(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [botId]);

  /* ────────── جلب بيانات المستخدم ────────── */
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
      } catch {/* تجاهل */ }
    })();
  }, []);

  /* ────────── إرسال رسالة ────────── */
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMsg: Message = { sender: "user", text: newMessage };
    setMessages(prev => [...prev, userMsg]);
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
      if (!res.ok) throw new Error("فشل استجابة البوت");
      const { reply } = await res.json();
      setMessages(prev => [...prev, { sender: "bot", text: reply }]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* ────────── تمرير تلقائي لآخر رسالة ────────── */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  /* ────────── شاشات التحميل والأخطاء ────────── */
  if (loading) return <p className="text-center mt-10">جاري تحميل البوت…</p>;
  if (error)   return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!bot)    return <p className="text-center mt-10 text-gray-400">البوت غير موجود.</p>;

  /* ────────── واجهة المحادثة ────────── */
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#5e2ea3] to-black text-white overflow-hidden">
      {/* رأس الصفحة مع قائمة الموبايل */}
      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(d => !d)}
        onMenuToggle={() => setMenuOpen(o => !o)}
      />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* محتوى المحادثة */}
      <div className="pt-16 flex-1 flex flex-col relative">
        {/* عنوان البوت ووصفه */}
        <div className="px-6 pb-4">
          <h1 className="text-2xl font-bold">{bot.name}</h1>
          <p className="text-sm text-gray-300">{bot.description}</p>
        </div>

        {/* الرسائل */}
        <div ref={chatRef} className="flex-1 overflow-y-auto px-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 max-w-2xl mx-auto ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "bot" && (
                <img
                  src={bot.image || "/default-bot-avatar.png"}
                  alt={bot.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
              )}

              <div
                className={`rounded-2xl px-4 py-3 text-sm break-words ${
                  msg.sender === "user" ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <p className="font-bold text-xs mb-1 text-gray-200">
                  {msg.sender === "bot" ? bot.name : "YOU"}
                </p>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    em: ({ children, ...props }) => (
                      <em {...props} style={{ color: "#00eaff" }} className="italic">
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
                  alt="You"
                  className="w-10 h-10 rounded-xl object-cover"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* شريط الإدخال */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-4">
          <div className="max-w-2xl mx-auto flex items-center bg-[#512d91] rounded-full px-4 py-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="اكتب رسالتك..."
              className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 w-10 h-10 rounded-full bg-purple-700 hover:bg-purple-800 flex items-center justify-center"
              title="إرسال"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
