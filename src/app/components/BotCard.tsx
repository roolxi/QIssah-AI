'use client';
import { useState, useEffect, useTransition } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaHeart } from 'react-icons/fa';
import DropdownMenu from './DropdownMenu';

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
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(bot.likesCount);
  const [pending, start] = useTransition();

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/bots/${bot.id}/like`, { method: 'GET' });
      if (res.ok) {
        const { liked } = await res.json();
        setLiked(liked);
      }
    })();
  }, [bot.id]);

  const toggleLike = () =>
    start(async () => {
      const method = liked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/bots/${bot.id}/like`, { method });
      if (res.ok) {
        setLiked(!liked);
        setLikes((l) => l + (liked ? -1 : 1));
      }
    });

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden shadow-lg bg-[#212121] flex"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{ aspectRatio: '640/300', margin: '0 auto' }}
    >
      {/* صورة البوت */}
      <Link href={`/chat/${bot.id}`} className="w-[45%] h-full relative">
        <Image src={bot.image} alt={bot.name} fill style={{ objectFit: 'cover' }} />
      </Link>

      {/* تدرّج داكن */}
      <div className="absolute inset-0 w-2/3 bg-gradient-to-l from-[#212121] via-[#212121]/80 to-transparent" />

      {/* المحتوى */}
      <div className="relative w-[55%] p-4 flex flex-col justify-between text-white z-10 ml-auto">
        <div className="flex justify-end">
          <DropdownMenu />
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase mb-1">{bot.name}</h3>
          <p className="text-[10px] leading-tight font-semibold line-clamp-3">
            {bot.description}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] mt-auto">
          <div className="flex items-center gap-1">
            <FaUser className="text-gray-300 text-[12px]" />
            <span className="text-blue-400 font-bold">{bot.creator.username}</span>
          </div>

          {/* زر الإعجاب + العدد */}
          <button
            onClick={toggleLike}
            disabled={pending}
            className="flex items-center gap-1 disabled:opacity-60"
          >
            <FaHeart
              className={`text-[12px] ${liked ? 'text-red-500' : 'text-gray-300'}`}
            />
            <span className="font-bold text-[10px]">{likes}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
