// src/app/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";
import BotCard from "@/app/components/BotCard";
import BottomNavBar from "@/app/components/BottomNavBar";

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
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const toggleTheme = () => setDarkMode(!darkMode);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const response = await fetch("/api/bots");
<<<<<<< HEAD
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
=======
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
>>>>>>> fc7252290c58f8c167841432336a10cded6ca165
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
<<<<<<< HEAD
        darkMode
          ? "bg-gradient-to-br from-[#5f35aa] to-[#212121]"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="px-4 py-6 md:px-8 md:py-10 space-y-6">
        <motion.h2
          className="text-lg sm:text-xl md:text-2xl font-semibold text-white"
=======
        darkMode ? "bg-gradient-to-br from-[#5f35aa] to-[#212121]" : "bg-gray-100 text-gray-900"
      } scrollbar-hide`}
      style={{ overflowY: "hidden" }}
    >
      <Header darkMode={darkMode} toggleTheme={toggleTheme}  />
      <MobileMenu  menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="px-6 py-8">
        <motion.h2
          className="text-xl md:text-2xl font-semibold mb-4 text-white"
>>>>>>> fc7252290c58f8c167841432336a10cded6ca165
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          TOP 10 BOT
        </motion.h2>
<<<<<<< HEAD

        <div className="overflow-x-auto scrollbar-hide">
          <div
            ref={scrollRef}
            className="flex gap-4 px-2 py-4"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
            }}
          >
            {bots.map((bot) => (
              <div
                key={bot.id}
                className="min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[33vw] xl:min-w-[25vw]"
              >
=======
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
              overflowX: "auto",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: "15px",
            }}
          >
            {bots.map((bot, idx) => (
              <div key={idx} className="min-w-[66vw] rounded-lg overflow-hidden">
>>>>>>> fc7252290c58f8c167841432336a10cded6ca165
                <BotCard bot={bot} />
              </div>
            ))}
          </div>
        </div>
      </main>
<<<<<<< HEAD

      <BottomNavBar />
    </div>
  );
}
=======
      <BottomNavBar />
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
>>>>>>> fc7252290c58f8c167841432336a10cded6ca165
