"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaEye, FaHeart } from "react-icons/fa";

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
        className="w-full max-w-4xl h-48 flex overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow bg-gray-800 cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* الجزء الأيسر: صورة البوت */}
        <div className="relative w-2/5 h-full">
          <Image
            src={bot.image}
            alt={bot.name}
            fill
            className="object-cover"
          />
        </div>

        {/* الجزء الأيمن: معلومات البوت */}
        <div className="w-3/5 h-full p-4 flex flex-col justify-between text-white">
          {/* اسم البوت الكبير + الوصف */}
          <div>
            <h3 className="text-2xl font-bold mb-2 uppercase">{bot.name}</h3>
            <p className="text-sm leading-relaxed mb-3 opacity-90">
              {bot.description}
            </p>
          </div>

          {/* معلومات المنشئ (اسم تخيلي) + المشاهدات والإعجابات */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-400" />
              <span className="text-blue-400 text-sm">NAX_45549</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <FaEye className="text-gray-400" />
                <span className="text-sm">35.7K</span>
              </div>
              <div className="flex items-center gap-1">
                <FaHeart className="text-red-500" />
                <span className="text-sm">1.6K</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
