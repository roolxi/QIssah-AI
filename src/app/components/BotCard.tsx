"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image"; // ✅ Import Next.js Image

export default function BotCard({
  bot,
  darkMode
}: {
  bot: {
    id: string; // Ensure bot object has 'id' property
    name: string;
    description: string;
    image: string;
  };
  darkMode: boolean;
}) {
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
      {/* ✅ Use Next.js Image for optimization */}
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
        <Link href={`/chat/${bot.id}`} className="w-full">
          <button
            className={`w-full py-2 rounded-lg font-medium transition-all ${
              darkMode
                ? "bg-red-700 hover:bg-red-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            ابدأ الرحلة ➔
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
