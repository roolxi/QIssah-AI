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
        className="relative rounded-2xl overflow-hidden shadow-lg bg-[#212121] flex mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          maxWidth: "400px", /* تقليل الحجم العام أكثر على الهواتف */
          height: "auto",
          aspectRatio: "710/300"
        }}
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

        {/* التدرج الداكن فوق الصورة، مع تقليل كثافته وتمديد طوله */}
        <div className="absolute inset-0 w-2/3 bg-gradient-to-l from-[#212121] via-[#212121]/80 to-transparent" />

        {/* محتوى النص */}
        <div className="relative w-1/2 p-3 flex flex-col justify-start text-white z-10 ml-auto">
          <div className="flex justify-end mb-1">
            <FaEllipsisV className="text-lg opacity-90" />
          </div>
          <div className="mt-0">
            <h3 className="text-base font-bold uppercase mb-1">{bot.name}</h3>
            <p className="text-xs leading-tight font-semibold">{bot.description}</p>
          </div>
          <div className="flex items-center justify-between text-[9px] mt-auto">
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-300" />
              <span className="text-blue-400 font-bold">NAX_45549</span>
            </div>
            <div className="flex items-center gap-3">
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
