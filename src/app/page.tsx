"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "./components/Header";
import MobileMenu from "./components/MobileMenu";
import BotCard from "./components/BotCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -window.innerWidth * 0.66 : window.innerWidth * 0.66, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
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
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10"
            onClick={() => scroll("left")}
          >
            <FaChevronLeft className="text-white text-xl" />
          </button>
          <div ref={scrollRef} className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {bots.map((bot, idx) => (
              <div key={idx} className="min-w-[66vw]">
                <BotCard bot={bot} />
              </div>
            ))}
          </div>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10"
            onClick={() => scroll("right")}
          >
            <FaChevronRight className="text-white text-xl" />
          </button>
        </div>
      </main>
    </div>
  );
}
