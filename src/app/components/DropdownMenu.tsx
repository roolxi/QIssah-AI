"use client";
import { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";

export default function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="text-white">
        <FaEllipsisV size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[#212121] text-white rounded-lg shadow-lg z-10">
          <ul className="py-2">
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-600">Share</button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-600">Report</button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-600">Details</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}