"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaEye, FaHeart, FaEllipsisV } from "react-icons/fa";

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
    <Link href={`/chat/${bot.id}`} className="no-underline">
      <motion.div
        className="relative w-full h-60 rounded-2xl overflow-hidden shadow-lg bg-black flex"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* صورة الخلفية على الجانب الأيسر */}
        <div className="w-1/2 h-full relative">
          <Image
            src={bot.image}
            alt={bot.name}
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>

        {/* التدرج الداكن فوق الصورة، مع زيادة سماكته وتغيير اللون */}
        <div className="absolute inset-0 w-3/5 bg-gradient-to-l from-[#212121] via-[#212121]/90 to-transparent" />

        {/* محتوى النص */}
        <div className="relative w-1/2 p-8 flex flex-col justify-between text-white z-10 ml-auto">
          <div className="flex justify-end">
            <FaEllipsisV className="text-2xl opacity-90" />
          </div>
          <div className="mt-2">
            <h3 className="text-4xl font-bold uppercase mb-3">{bot.name}</h3>
            <p className="text-base leading-relaxed font-semibold">{bot.description}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-300" />
              <span className="text-blue-400 font-bold">NAX_45549</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaEye className="text-gray-300" />
                <span>35.7K</span>
              </div>
              <div className="flex items-center gap-1">
                <FaHeart className="text-red-500" />
                <span>1.6K</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
