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
        className="relative w-full h-60 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* خلفية الصورة ممتدة بكامل مساحة البطاقة */}
        <Image
          src={bot.image}
          alt={bot.name}
          fill
          className="object-cover"
        />

        {/* تدرج شفاف -> أسود من اليسار إلى اليمين */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black" />

        {/* محتوى النص فوق التدرج */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between text-white p-4">
          {/* السطر العلوي: أيقونة الثلاث نقاط */}
          <div className="flex justify-end">
            <FaEllipsisV className="text-2xl opacity-90" />
          </div>

          {/* الاسم والوصف في المنتصف */}
          <div>
            <h3 className="text-3xl font-bold uppercase mb-2">{bot.name}</h3>
            <p className="text-sm leading-relaxed">
              {bot.description}
            </p>
          </div>

          {/* السطر السفلي: اسم المنشئ + المشاهدات والإعجابات */}
          <div className="flex items-center justify-between text-sm mt-2">
            {/* اسم المستخدم التخييلي */}
            <div className="flex items-center gap-1">
              <FaUser className="text-gray-300" />
              <span className="text-blue-400">NAX_45549</span>
            </div>
            <div className="flex items-center gap-4">
              {/* المشاهدات */}
              <div className="flex items-center gap-1">
                <FaEye className="text-gray-300" />
                <span>35.7K</span>
              </div>
              {/* الإعجابات */}
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
