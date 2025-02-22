// components/BottomNavBar.tsx
import React from "react";
import { FaHome, FaHeart, FaPlus, FaComment, FaUser } from "react-icons/fa";
import "./BottomNavBar.css"; // استيراد ملف CSS إذا لزم الأمر

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#4B0082] p-4 flex justify-around items-center">
      <button><FaHome className="text-white text-2xl" /></button>
      <button><FaHeart className="text-white text-2xl" /></button>
      <div className="bg-purple-500 p-3 rounded-full">
        <FaPlus className="text-white text-2xl" />
      </div>
      <button><FaComment className="text-white text-2xl" /></button>
      <button><FaUser className="text-white text-2xl" /></button>
    </nav>
  );
}