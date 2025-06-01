// src/app/page.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";
import BotCard from "@/app/components/BotCard";
import BottomNavBar from "@/app/components/BottomNavBar";

export type Category = { id: string; name: string };
export type Bot = {
  id: string;
  name: string;
  description: string;
  image: string;
  likesCount: number;
  viewsCount: number;
  creator: { username: string };
  category: { id: string; name: string };
};

export default function HomePage() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/bots").then(r => r.json()).then(setBots).catch(console.error);
    fetch("/api/categories").then(r => r.json()).then(setCategories).catch(console.error);
  }, []);

  const toggleTheme = () => setDarkMode(m => !m);
  const displayed = selectedCat ? bots.filter(b => b.category.id === selectedCat) : bots;

  return (
    <div
      className="min-h-screen w-full transition-colors duration-500"
      style={{
        overflowY: "hidden",
        background: darkMode
          ? "linear-gradient(to bottom right, #5f35aa 0%, #5f35aa 50%, #212121 100%)"
          : undefined,
      }}
    >
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        onMenuToggle={() => setMenuOpen(o => !o)}
      />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="pt-16 px-4 py-8 md:px-8 md:py-10 space-y-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button
            onClick={() => setSelectedCat("")}
            className={`px-4 py-2 rounded-full ${
              selectedCat === "" ? "bg-purple-500" : "bg-white/20"
            } text-white`}
          >
            الكل
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-4 py-2 rounded-full ${
                selectedCat === c.id ? "bg-purple-500" : "bg-white/20"
              } text-white`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <motion.h2
          className="text-lg sm:text-xl md:text-2xl font-semibold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          TOP 10 BOT
        </motion.h2>

        <div className="overflow-x-auto scrollbar-hide">
          <div
            ref={scrollRef}
            className="flex gap-4 px-2 py-4"
            style={{
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
            }}
          >
            {displayed.map(bot => (
              <div
                key={bot.id}
                className="min-w-[80vw] sm:min-w-[60vw] md:min-w-[40vw] lg:min-w-[33vw] xl:min-w-[25vw]"
              >
                <BotCard bot={bot} />
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNavBar />
    </div>
  );
}
