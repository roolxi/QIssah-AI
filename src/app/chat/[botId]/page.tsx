"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { FaPaperPlane, FaBars, FaEllipsisV } from "react-icons/fa";
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

  // State for messages and input
  const [messages, setMessages] = useState<
    { sender: "user" | "bot"; text: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  // Theme and menu state
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  // User profile data
  const [userProfile, setUserProfile] = useState({ botName: "", bio: "" });

  // Fetch bot data
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

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserProfile({
            botName: data.botName || "",
            bio: data.bio || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  // Handle sending a message
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
      if (!response.ok) throw new Error("Failed to get response from bot");
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  if (loading) return <p className="text-center mt-10 text-lg">Loading bot details...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error: {error}</p>;
  if (!bot) return <p className="text-center mt-10 text-gray-400">Bot not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4A2C6B] to-[#7B4EAD] text-white flex flex-col">
      {/* Header */}
      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
        
      />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Chat Header (Back Button) */}
      <div className="p-4">
        <button
          onClick={() => window.history.back()}
          className="text-white text-lg"
        >
          {"< back"}
        </button>
      </div>

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Bot Name and Description (Optional, can be hidden on mobile) */}
        <div className="mb-4 hidden md:block">
          <h1 className="text-2xl font-bold mb-2">{bot.name}</h1>
          <p className="text-sm">{bot.description}</p>
        </div>

        {/* Chat Area in a Fixed Container */}
        <div className="max-w-4xl mx-auto px-4 flex-1 flex flex-col">
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            style={{ maxHeight: "calc(100vh - 300px)" }} // Container with fixed height
          >
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-2 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <img
                    src={bot.image || "/default-bot-avatar.png"}
                    alt={`${bot.name} Avatar`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div
                  className={`p-3 rounded-lg shadow ${
                    message.sender === "user"
                      ? "bg-[#3C3C3C] text-white self-end mr-12"
                      : "bg-[#8E6FB0] text-white self-start ml-12"
                  }`}
                >
                  <p className="font-bold text-sm">
                    {message.sender === "bot" ? bot.name : "YOU"}
                  </p>
                  <p className="text-sm">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={
                        message.sender === "bot"
                          ? {
                              em: ({ ...props }) => (
                                <em style={{ color: "lightblue" }} {...props} />
                              ),
                            }
                          : {}
                      }
                    >
                      {message.text}
                    </ReactMarkdown>
                  </p>
                </div>
                {message.sender === "user" && (
                  <img
                    src="/default-user-avatar.png"
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input Area with Fading Shadow on All Sides */}
        <div className="p-4 flex items-center gap-2 bg-gradient-to-br from-[#4A2C6B] to-[#7B4EAD]">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg bg-[#7B4EAD] text-white placeholder-white border-none focus:outline-none"
            style={{
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 10px rgba(0, 0, 0, 0.2), 0px 0px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
          <button
            onClick={handleSendMessage}
            className="p-2 bg-[#7B4EAD] rounded-full border-none hover:bg-[#6A3EAD] transition-colors"
          >
            <FaPaperPlane className="text-white" size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}