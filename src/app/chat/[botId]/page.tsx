// src/app/chat/[botId]/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";
import BottomNavBar from "@/app/components/BottomNavBar";
import DropdownMenu from "@/app/components/DropdownMenu";
import { FaPaperPlane } from "react-icons/fa";

type Message = { sender: "user" | "bot"; text: string };

export type Bot = {
  id: string;
  name: string;
  description: string;
  image?: string;
  personality?: string;
  accent?: string;
};

export default function ChatBotIdPage() {
  const { botId } = useParams() as { botId: string };
  const [bot, setBot] = useState<Bot | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  // Fetch bot
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/bots/${botId}`);
        if (!res.ok) throw new Error("Failed to load bot");
        setBot(await res.json());
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [botId]);

  // Autoscroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const userMsg: Message = { sender: "user", text: newMessage };
    setMessages((m) => [...m, userMsg]);
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
          },
          conversation: [...messages, userMsg],
        }),
      });
      if (!res.ok) throw new Error("Bot failed");
      const { reply } = await res.json();
      setMessages((m) => [...m, { sender: "bot", text: reply }]);
    } catch {
      // ignore
    }
  };

  const toggleMenu = () => setMenuOpen((o) => !o);

  if (loading) return <p className="loading">Loading…</p>;
  if (error)   return <p className="loading error">{error}</p>;
  if (!bot)    return <p className="loading">Bot not found.</p>;

  return (
    <div className="chat-page-root">
      {/* Header */}
      <Header
        darkMode={darkMode}
        toggleTheme={() => setDarkMode((d) => !d)}
        onMenuToggle={toggleMenu}
      />

      {/* Mobile Menu */}
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {/* Main chat area */}
      <main className="main-chat-area">
        {/* Bot info/topbar */}
        <div className="chat-topbar">
          <div className="bot-info">
            <img
              className="bot-avatar"
              src={bot.image || "/default-bot-avatar.png"}
              alt={bot.name}
            />
            <div>
              <div className="bot-name">{bot.name}</div>
              <div className="bot-desc">{bot.description}</div>
            </div>
          </div>
          <DropdownMenu />
        </div>

        {/* Chat messages */}
        <div className="chat-box" ref={chatRef}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`message ${msg.sender}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={msg.sender === "bot" ? bot.image || "/default-bot-avatar.png" : "/default-user-avatar.png"}
                alt={msg.sender}
                className="msg-avatar"
              />
              <div className="text">
                <div className="name">{msg.sender === "bot" ? bot.name : "YOU"}</div>
                <div className="content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input bar */}
        <div className="input-bar">
          <input
            type="text"
            placeholder="اكتب رسالتك..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} title="إرسال">
            <FaPaperPlane />
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Styles */}
      <style jsx>{`
        .chat-page-root {
          min-height: 100vh;
          background: linear-gradient(to bottom, #5e2ea3, #000);
          color: white;
          padding-top: 70px;
        }
        .main-chat-area {
          max-width: 700px;
          margin: 0 auto;
          padding-bottom: 120px;
          display: flex;
          flex-direction: column;
          min-height: 80vh;
        }
        .chat-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 0 10px 0;
        }
        .bot-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .bot-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          object-fit: cover;
          background: #fff;
        }
        .bot-name {
          font-size: 1.2rem;
          font-weight: bold;
        }
        .bot-desc {
          font-size: 0.95rem;
          color: #e0e0e0;
        }
        .chat-box {
          flex: 1;
          overflow-y: auto;
          padding: 0 4px;
          margin-bottom: 90px; /* Ensure space for input bar */
          display: flex;
          flex-direction: column;
          /* align-items: stretch; */ /* align-self will handle individual items */
        }
        .message {
          display: flex;
          align-items: flex-start;
          border-radius: 18px; /* Adjusted for a slightly boxier feel */
          padding: 12px 18px; /* Adjusted padding */
          margin: 12px 0; /* Reduced vertical margin */
          max-width: 75%;    /* Constrain width more */
          width: fit-content; /* Critical for small boxes */
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Added shadow */
          animation: fadeIn 0.3s ease-out;
          /* min-width: 180px; */ /* Removed to allow truly small messages */
        }
        .message.user {
          align-self: flex-end; /* Ensures message box is on the right */
          background: linear-gradient(135deg, #8B5CF6, #6D28D9); /* Vibrant purple gradient */
          color: white;
          flex-direction: row-reverse; /* Avatar on the right of text */
        }
        .message.bot {
          align-self: flex-start; /* Ensures message box is on the left */
          background: #37304F; /* Darker, solid complementary color */
          color: white;
        }
        .msg-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          margin-right: 12px; /* Default for bot */
          object-fit: cover;
          background: #fff; /* Placeholder background for avatar image */
          flex-shrink: 0; /* Prevent avatar from shrinking */
        }
        .message.user .msg-avatar {
          margin-right: 0;
          margin-left: 12px; /* Avatar margin for user messages */
        }
        .text {
          display: flex;
          flex-direction: column;
        }
        .name {
          font-weight: bold;
          font-size: 15px;
          margin-bottom: 4px;
        }
        .content {
          font-size: 14px;
          line-height: 1.6;
          word-break: break-word;
        }
        .input-bar {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          z-index: 20;
        }
        .input-bar input {
          flex: 1;
          padding: 18px 25px;
          border: none;
          border-radius: 9999px;
          background: #512d91;
          font-size: 16px;
          color: white;
          outline: none;
        }
        .input-bar button {
          margin-left: 10px;
          width: 55px;
          height: 55px;
          background: #512d91;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 0 8px rgba(0,0,0,0.3);
          transition: background 0.3s;
        }
        .input-bar button:hover { background: #6b34cc; }
        .input-bar button :global(svg) { color: white; font-size: 28px; }
        .loading {
          margin: auto;
          font-size: 1.2rem;
        }
        .error { color: #ff6b6b;}
        @media (max-width: 768px) {
          .main-chat-area { 
            padding-left: 10px; /* Add some padding for smaller screens */
            padding-right: 10px; /* Add some padding for smaller screens */
            padding-bottom: 140px; 
          }
          .chat-topbar { flex-direction: column; align-items: flex-start; gap: 10px; }
          .chat-box { margin-bottom: 120px; }
          .message {
            max-width: 85%; /* Allow slightly wider messages on mobile */
          }
        }
      `}</style>
    </div>
  );
}
