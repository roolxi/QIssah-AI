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
        className="bg-[#212121] rounded-2xl overflow-hidden shadow-lg flex flex-col md:flex-row"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* صورة البوت */}
        <div className="w-full h-48 md:w-1/2 md:h-auto relative">
          <Image
            src={bot.image}
            alt={bot.name}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* المحتوى */}
        <div className="w-full md:w-1/2 p-4 flex flex-col justify-between text-white">
          <div className="flex justify-end">
            <DropdownMenu />
          </div>
          <div className="mt-2">
            <h3 className="text-base font-bold uppercase">{bot.name}</h3>
            <p className="text-sm leading-tight mt-1">{bot.description}</p>
          </div>
          <div className="flex items-center justify-between text-sm mt-4">
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-300" />
              <span className="text-blue-400 font-bold">NAX_45549</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaEye className="text-gray-300" />
                <span className="font-bold">35.7K</span>
              </div>
              <div className="flex items-center gap-1">
                <FaHeart className="text-red-500" />
                <span className="font-bold">1.6K</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
