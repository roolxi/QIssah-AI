"use client";
import React, { useState, useEffect, useRef } from "react";
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

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } scrollbar-hide`}
      style={{ overflow: "hidden" }}
    >
      <Header darkMode={darkMode} toggleTheme={toggleTheme} setMenuOpen={setMenuOpen} />
      <MobileMenu darkMode={darkMode} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="px-6 py-16"> {/* زيادة المساحة العلوية والسفلية */}
        <h2 className="text-xl md:text-2xl font-semibold mb-8">
          اختر قصتك وابدأ مغامرتك التفاعلية
        </h2>

        <div className="relative pb-6"> {/* إضافة هامش سفلي لضمان وضوح البطاقة بالكامل */}
          <div 
            ref={scrollRef} 
            className="flex space-x-4 overflow-x-auto scrollbar-hide touch-pan-x pb-4"
            style={{
              WebkitOverflowScrolling: "touch", 
              scrollBehavior: "smooth", 
              paddingLeft: "0px", 
              paddingRight: "0px", 
              overflowX: "auto", /* السماح بالسحب بدون ظهور الشريط */
              scrollbarWidth: "none", /* إخفاء شريط التمرير */
              msOverflowStyle: "none"
            }}
          >
            {bots.map((bot, idx) => (
              <div key={idx} className="min-w-[50vw] md:min-w-[33vw]">
                <BotCard bot={bot} />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CSS إضافي لإخفاء شريط التمرير */}
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
