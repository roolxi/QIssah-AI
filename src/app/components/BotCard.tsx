"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaEye, FaHeart } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu"; // New component

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
    <Link href={`/chat/${bot.id}`} className="no-underline min-w-[340px]">
      <motion.div
        className="relative rounded-2xl overflow-hidden shadow-lg bg-[#212121] flex"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          aspectRatio: "640/300",
          margin: "0 auto",
        }}
      >
        {/* Background Image */}
        <div className="w-[45%] h-full relative">
          <Image
            src={bot.image}
            alt={bot.name}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 w-2/3 bg-gradient-to-l from-[#212121] via-[#212121]/80 to-transparent" />

        {/* Text Content */}
        <div className="relative w-[55%] p-2 flex flex-col justify-start text-white z-10 ml-auto">
          <div className="flex justify-end mb-1">
            <DropdownMenu />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase mb-1">{bot.name}</h3>
            <p className="text-[10px] leading-tight font-semibold">{bot.description}</p>
          </div>
          <div className="flex items-center justify-between text-[9px] mt-auto">
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-300" />
              <span className="text-blue-400 font-bold">NAX_45549</span>
            </div>
            <div className="flex items-center gap-2 text-center">
              <div className="flex flex-col items-center">
                <FaEye className="text-gray-300 text-[12px]" />
                <span className="text-[10px] font-bold">35.7K</span>
              </div>
              <div className="flex flex-col items-center">
                <FaHeart className="text-red-500 text-[12px]" />
                <span className="text-[10px] font-bold">1.6K</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}