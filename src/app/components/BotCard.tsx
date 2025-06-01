// src/app/components/BotCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaLowVision, FaHeart } from "react-icons/fa";
import DropdownMenu from "./DropdownMenu";

interface BotCardProps {
  bot: {
    id: string;
    name: string;
    description: string;
    image: string;
    likesCount: number;
    viewsCount: number; // تأكد أنّ الـ API يُرجع هذا الحقل
    creator: { username: string };
  };
}

export default function BotCard({ bot }: BotCardProps) {
  return (
    <Link href={`/chat/${bot.id}`} className="block no-underline">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        /* نفس أبعاد البطاقة في الـ HTML */
        style={{ width: 600, height: 250, margin: "0 auto" }}
        className="relative flex overflow-hidden rounded-[45px] bg-white shadow-[0_15px_35px_rgba(0,0,0,0.25)] cursor-pointer"
      >
        {/* الصورة + التدرّج */}
        <div className="relative flex-1">
          <img
            src={bot.image}
            alt={bot.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#333333] via-[#333333cc] to-transparent" />
        </div>

        {/* النصوص */}
        <div className="relative flex-1 bg-[#333333] text-white font-['Roboto'] p-5">
          {/* قائمة الإجراءات */}
          <div className="absolute top-5 right-6">
            <DropdownMenu />
          </div>

          {/* اسم البوت */}
          <h1 className="text-2xl font-bold uppercase drop-shadow mb-2">
            {bot.name}
          </h1>

          {/* الوصف (يُقسَّم لأسطر) */}
          <div className="uppercase text-sm leading-[1.1] space-y-[2px]">
            {bot.description.split("\n").map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>

          {/* @username بالأسفل يسار */}
          <span className="absolute bottom-4 left-5 text-[#ffee00] text-[15px]">
            @{bot.creator.username}
          </span>

          {/* الإحصاءات بالأسفل يمين */}
          <div className="absolute bottom-4 right-5 flex items-center gap-6">
            {/* المشاهدات */}
            <div className="flex items-center gap-1 text-xs">
              <span className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center">
                <FaLowVision className="text-[#00ccff] text-[13px]" />
              </span>
              <span>{bot.viewsCount.toLocaleString()}</span>
            </div>

            {/* اللايكات */}
            <div className="flex items-center gap-1 text-xs">
              <span className="w-[22px] h-[22px] rounded-full bg-white flex items-center justify-center">
                <FaHeart className="text-[#ff3366] text-[13px]" />
              </span>
              <span>{bot.likesCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
