"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import BotCard from "./components/BotCard";

// تعريف نوع Bot
export type Bot = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export default function HomePage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  // تبديل الوضع الداكن والفاتح
  const toggleTheme = () => setDarkMode(!darkMode);

  // عند الضغط على "ابدأ الرحلة"
  const handleStartStory = (bot: Bot) => {
    setSelectedBot(bot);
    setShowModal(true);
  };

  // جلب بيانات البوتات من /api/bots
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch("/api/bots");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBots(data);
      } catch (error) {
        console.error("Error fetching bots:", error);
      }
    };
    fetchBots();
  }, []);

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        setMenuOpen={setMenuOpen}
      />
      <MobileMenu
        darkMode={darkMode}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <main className="px-6 py-8">
        <motion.h2
          className="text-xl md:text-2xl font-semibold mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          اختر قصتك وابدأ مغامرتك التفاعلية
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bots.map((bot, idx) => (
            <BotCard
              key={idx}
              bot={bot}
              darkMode={darkMode}
              handleStartStory={handleStartStory}
            />
          ))}
        </div>
      </main>

      {/* نافذة منبثقة عند اختيار بوت */}
      {showModal && selectedBot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-md text-center">
            <h3 className="text-lg font-bold mb-3">مغامرة جديدة!</h3>
            <p>
              {`لقد اخترت البوت "${selectedBot.name}". تستطيع الآن بدء قصتك التفاعلية.`}
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
