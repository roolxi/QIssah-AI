// src/app/chat/[botId]/page.tsx
"use client";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { FaPaperPlane, FaBars, FaEllipsisV, FaShareAlt, FaComment, FaHome, FaPlusCircle, FaRobot, FaHeart, FaStar, FaUser } from "react-icons/fa";

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
    <div className="container">
      {/* Sidebar */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="menu-section">
          <div className="home-header">
            <FaBars className="menu-icon" onClick={toggleMenu} />
            <div>Qissah.AI</div>
          </div>
          <div className="menu-item"><FaHome /> Home</div>
          <div className="menu-item"><FaComment /> Chats</div>
          <div className="menu-separator" />
          <div className="menu-item"><FaPlusCircle /> Create Chatbot</div>
          <div className="menu-item"><FaRobot /> My Chatbots</div>
          <div className="menu-item"><FaHeart /> Favorites</div>
          <div className="menu-item"><FaStar /> Top 10 Bots</div>
          <div className="menu-separator" />
        </div>
        <div className="sign-in">Sign In</div>
      </aside>

      {/* Main chat area */}
      <main className="main">
        <header className="topbar">
          <div className="logo"><span>QISS</span>AH.AI</div>
          <div className="icons">
            <div className="icon-btn" title="Share"><FaShareAlt /></div>
            <FaEllipsisV className="options-icon" />
            <img className="profile" src={bot.image || "/default-bot-avatar.png"} alt="Bot" />
          </div>
        </header>

        <div className="chat-box" ref={chatRef}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className="message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={msg.sender === "bot" ? bot.image || "/default-bot-avatar.png" : "/default-user-avatar.png"}
                alt={msg.sender}
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

      {/* Scoped CSS */}
      <style jsx>{`
        /* container */
        .container {
          display: flex;
          height: 100vh;
          background: linear-gradient(to bottom, #5e2ea3, #000);
          color: white;
          overflow: hidden;
        }

        /* loading */
        .loading {
          margin: auto;
          font-size: 1.2rem;
        }
        .error { color: #ff6b6b;}

        /* sidebar */
        .sidebar {
          width: 180px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(0,0,0,0.15));
          padding: 20px 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.3s ease;
        }
        .sidebar.open { transform: translateX(0); }
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); position: absolute; z-index: 100; }
        }
        .menu-section { display: flex; flex-direction: column; gap: 12px; }
        .home-header { display: flex; align-items: center; font-size:17px; font-weight:bold; margin-bottom:25px; }
        .menu-icon { font-size:20px; margin-right:8px; cursor: pointer; }
        .menu-item { display:flex; align-items:center; gap:10px; font-size:13.5px; padding:6px 8px; cursor:pointer; transition: background 0.3s;}
        .menu-item:hover { background: rgba(255,255,255,0.1); }
        .menu-separator { height:1px; background:rgba(255,255,255,0.2); margin:10px 0;}
        .sign-in { background:white; color:#222; font-weight:bold; padding:8px; text-align:center; cursor:pointer; transition: background 0.3s; font-size:13px;}
        .sign-in:hover { background:#eee; }

        /* main */
        .main { flex:1; display:flex; flex-direction:column; position:relative; }

        /* topbar */
        .topbar { display:flex; justify-content:space-between; align-items:center; padding:15px 30px; }
        .logo { font-size:28px; font-weight:bold; }
        .logo span { color:#00d2ff; }
        .icons { display:flex; align-items:center; gap:15px; }
        .icon-btn { background:rgba(255,255,255,0.1); border-radius:50%; padding:8px; cursor:pointer; transition: background 0.3s; }
        .icon-btn:hover { background:rgba(255,255,255,0.3); }
        .options-icon { font-size:24px; cursor:pointer; }
        .profile { width:35px; height:35px; border-radius:50%; object-fit:cover; }

        /* chat box */
        .chat-box {
          flex:1;
          padding:0 20px;
          overflow-y:auto;
          margin-bottom:100px;
          display:flex;
          flex-direction:column;
          align-items:center;
        }

        .message {
          display:flex;
          align-items:center;
          background:rgba(255,255,255,0.15);
          border-radius:25px;
          padding:15px;
          margin:20px 0;
          max-width:600px;
          width:100%;
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px);} to { opacity:1; transform:translateY(0);} }

        .message img {
          width:60px; height:60px; border-radius:15px; margin-right:15px; object-fit:cover;
        }
        .text { display:flex; flex-direction:column; }
        .name { font-weight:bold; font-size:16px; margin-bottom:5px; }
        .content { font-size:14px; line-height:1.6; }

        /* input bar */
        .input-bar {
          position:absolute;
          bottom:30px;
          left:50%;
          transform:translateX(-50%);
          width:100%; max-width:600px;
          display:flex; align-items:center;
        }
        .input-bar input {
          flex:1;
          padding:18px 25px;
          border:none;
          border-radius:9999px;
          background:#512d91;
          font-size:16px;
          color:white;
          outline:none;
        }
        .input-bar button {
          margin-left:10px;
          width:55px; height:55px;
          background:#512d91;
          border:none;
          border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer;
          box-shadow:0 0 8px rgba(0,0,0,0.3);
          transition:background 0.3s;
        }
        .input-bar button:hover { background:#6b34cc; }
        .input-bar button :global(svg) { color:white; font-size:28px; }

        /* responsive */
        @media (max-width: 768px) {
          .sidebar { display: none; }
          .message { max-width:90%; }
          .chat-box { padding:0 10px; }
        }
      `}</style>
    </div>
  );
}
