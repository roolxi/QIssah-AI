"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import BotCard from "./components/BotCard";

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
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleTheme = () => setDarkMode(!darkMode);

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

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = window.innerWidth * 0.5;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setActiveIndex(newIndex);
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } scrollbar-hide overflow-hidden`}
    >
      <Header darkMode={darkMode} toggleTheme={toggleTheme} setMenuOpen={setMenuOpen} />
      <MobileMenu darkMode={darkMode} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="px-6 py-8">
        <motion.h2
          className="text-xl md:text-2xl font-semibold mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          اختر قصتك وابدأ مغامرتك التفاعلية
        </motion.h2>

        <div className="relative">
          <div 
            ref={scrollRef} 
            className="flex space-x-6 overflow-x-auto scrollbar-hide touch-pan-x snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch", scrollBehavior: "smooth", paddingLeft: "5vw", paddingRight: "5vw", overflow: "hidden" }}
            onScroll={handleScroll}
          >
            {bots.map((bot, idx) => (
              <motion.div 
                key={idx} 
                className="min-w-[60vw] md:min-w-[45vw] snap-start relative"
                animate={{ scale: activeIndex === idx ? 1.1 : 1, boxShadow: activeIndex === idx ? "0px 4px 15px rgba(255, 255, 255, 0.2)" : "none" }}
                transition={{ duration: 0.3 }}
              >
                <BotCard bot={bot} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
