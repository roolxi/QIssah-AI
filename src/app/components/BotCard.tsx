// src/app/components/BotCard.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaEye, FaHeart } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu";

interface BotCardProps {
  bot: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
}

export default function BotCard({ bot }: BotCardProps) {
  return (
    <Link href={`/chat/${bot.id}`} className="block no-underline">
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg bg-[#212121] flex"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          aspectRatio: "640/300",  // هنا يضمن نفس الارتفاع لكل الكروت
          margin: "0 auto",
        }}
      >
        {/* صورة البوت */}
        <div className="w-[45%] h-full relative">
          <Image
            src={bot.image}
            alt={bot.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* تدرج خلفي داكن */}
        <div className="absolute inset-0 w-2/3 bg-gradient-to-l from-[#212121] via-[#212121]/80 to-transparent" />

        {/* المحتوى */}
        <div className="relative w-[55%] p-4 flex flex-col justify-between text-white z-10 ml-auto">
          <div className="flex justify-end">
            <DropdownMenu />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase mb-2">{bot.name}</h3>
            <p className="text-[10px] leading-tight font-semibold">
              {bot.description}
            </p>
          </div>
          <div className="flex items-center justify-between text-[10px] mt-auto">
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-300 text-[12px]" />
              <span className="text-blue-400 font-bold text-[10px]">NAX_45549</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaEye className="text-gray-300 text-[12px]" />
                <span className="font-bold text-[10px]">35.7K</span>
              </div>
              <div className="flex items-center gap-1">
                <FaHeart className="text-red-500 text-[12px]" />
                <span className="font-bold text-[10px]">1.6K</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
