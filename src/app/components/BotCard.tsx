"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface BotCardProps {
  bot: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
  darkMode: boolean;
  handleStartStory: (bot: {
    id: string;
    name: string;
    description: string;
    image: string;
  }) => void;
}

export default function BotCard({ bot, darkMode, handleStartStory }: BotCardProps) {
  return (
    <motion.div
      className={`rounded-xl shadow-lg hover:shadow-2xl transition-shadow overflow-hidden ${
        darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
      }`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Image 
        src={bot.image} 
        alt={bot.name} 
        width={500} 
        height={160} 
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-3 text-red-500">{bot.name}</h3>
        <p className="text-sm leading-relaxed mb-4 opacity-90">{bot.description}</p>
        <button
          onClick={() => handleStartStory(bot)}
          className={`w-full py-2 rounded-lg font-medium transition-all ${
            darkMode
              ? "bg-red-700 hover:bg-red-600 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          ابدأ الرحلة ➔
        </button>
      </div>
    </motion.div>
  );
}
