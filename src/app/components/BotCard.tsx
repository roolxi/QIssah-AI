// src/app/components/BotCard.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaUser, FaHeart } from "react-icons/fa";

interface BotCardProps {
  bot: {
    id: string;
    name: string;
    description: string;
    image: string;
    likesCount: number;
    creator: { username: string };
  };
}

export default function BotCard({ bot }: BotCardProps) {
  return (
    <Link href={`/chat/${bot.id}`} className="block no-underline">
      <motion.div
        className="relative flex rounded-2xl overflow-hidden bg-[#212121] shadow-lg cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ aspectRatio: "640/300", margin: "0 auto" }}
      >
        {/* القسم الأيسر (الصورة + التدرّج) */}
        <div className="relative w-[45%] h-full shrink-0">
          {/* الصورة */}
          <img
            src={bot.image}
            alt={bot.name}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* التدرّج */}
          <div className="absolute inset-0 w-2/3 pointer-events-none bg-gradient-to-l from-[#212121] via-[#212121]/80 to-transparent" />
        </div>

        {/* المحتوى النصي */}
        <div className="relative flex flex-col justify-between w-[55%] p-4 text-white z-10">
          <div>
            <h3 className="text-sm font-bold uppercase mb-1">{bot.name}</h3>
            <p className="text-[10px] leading-tight font-semibold line-clamp-3">
              {bot.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-300 text-[12px]" />
              <span className="text-blue-400 font-bold">
                {bot.creator.username}
              </span>
            </div>

            <div className="flex items-center gap-1 pr-1">
              <FaHeart
                className={`text-[12px] ${
                  bot.likesCount > 0 ? "text-red-500" : "text-gray-300"
                }`}
              />
              <span className="font-bold">{bot.likesCount}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
