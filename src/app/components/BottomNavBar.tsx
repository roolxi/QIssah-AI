// src/components/BottomNavBar.tsx
import React from "react";
import { FaHome, FaHeart, FaPlus, FaComment, FaUser } from "react-icons/fa";

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#4B0082] p-4 flex justify-around items-center">
      <button className="text-white text-2xl">
        <FaHome />
      </button>
      <button className="text-white text-2xl">
        <FaHeart />
      </button>
      <div className="bg-purple-500 p-3 rounded-full">
        <FaPlus className="text-white text-2xl" />
      </div>
      <button className="text-white text-2xl">
        <FaComment />
      </button>
      <button className="text-white text-2xl">
        <FaUser />
      </button>
    </nav>
  );
}