// src/app/components/BotCard.tsx
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
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
        className="relative rounded-2xl overflow-hidden shadow-lg bg-[#212121] flex cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{ aspectRatio: "640/300", margin: "0 auto" }}
      >
        {/* صورة البوت */}
        <div className="w-[45%] h-full relative">
          {/* جرّب هذا بدل <Image> للتأكد */}
             <img
               src={bot.image}
               alt={bot.name}
               className="w-full h-full object-cover"
             />

        </div>

        {/* تدرّج داكن */}
        <div className="absolute inset-0 w-2/3 bg-gradient-to-l from-[#212121] via-[#212121]/80 to-transparent" />

        {/* المحتوى */}
        <div className="relative w-[55%] p-4 flex flex-col justify-between text-white z-10 ml-auto">
          <div>
            <h3 className="text-sm font-bold uppercase mb-1">{bot.name}</h3>
            <p className="text-[10px] leading-tight font-semibold line-clamp-3">
              {bot.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-[10px] mt-auto">
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-300 text-[12px]" />
              <span className="text-blue-400 font-bold text-[10px]">
                {bot.creator.username}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FaHeart
                className={`text-[12px] ${bot.likesCount > 0 ? "text-red-500" : "text-gray-300"}`}
              />
              <span className="font-bold text-[10px]">{bot.likesCount}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
