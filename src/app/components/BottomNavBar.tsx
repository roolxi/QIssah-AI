// src/components/BottomNavBar.tsx
"use client";
import React, { useState, MouseEvent } from "react";
import { FaHome, FaHeart, FaPlus, FaComment, FaUser } from "react-icons/fa";

const NAV_ITEMS = [
  { key: "home",   icon: <FaHome />,  label: "الرئيسية" },
  { key: "fav",    icon: <FaHeart />, label: "المفضلة" },
  { key: "msg",    icon: <FaComment />, label: "الرسائل" },
  { key: "acct",   icon: <FaUser />,  label: "الحساب" },
];

export default function BottomNavBar() {
  const [active, setActive] = useState<string>("home");

  function handleRipple(e: MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;
    circle.style.width  = circle.style.height = `${diameter}px`;
    circle.style.left   = `${e.clientX - el.getBoundingClientRect().left - radius}px`;
    circle.style.top    = `${e.clientY - el.getBoundingClientRect().top  - radius}px`;
    circle.className    = "ripple";
    el.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  return (
    <>
      <nav className="bottom-nav" dir="rtl">
        {NAV_ITEMS.slice(0,2).map(item => (
          <div
            key={item.key}
            className={`nav-item ${active===item.key?"active":""}`}
            onClick={e => { handleRipple(e); setActive(item.key); /* navigate */ }}
          >
            <div className="indicator" />
            <div className="icon">{item.icon}</div>
            <span className="label">{item.label}</span>
          </div>
        ))}

        <div
          className="fab-button"
          onClick={e => { handleRipple(e); /* go to create-bot */ }}
        >
          <FaPlus />
        </div>

        {NAV_ITEMS.slice(2).map(item => (
          <div
            key={item.key}
            className={`nav-item ${active===item.key?"active":""}`}
            onClick={e => { handleRipple(e); setActive(item.key); /* navigate */ }}
          >
            <div className="indicator" />
            <div className="icon">{item.icon}</div>
            <span className="label">{item.label}</span>
          </div>
        ))}
      </nav>

      {/* scoped styles via styled-jsx */}
      <style jsx>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 500px;
          height: 80px;
          background: rgba(30,30,30,0.9);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 20px;
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -5px 20px rgba(255,255,255,0.08);
          z-index: 1000;
        }
        @media (min-width: 769px) {
          .bottom-nav { display: none; }
        }
        .nav-item {
          position: relative;
          width: 60px; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .icon {
          color: #b0b0b0;
          font-size: 20px;
          transition: all 0.3s ease;
        }
        .label {
          position: absolute; bottom: 15px;
          font-size: 10px;
          color: transparent;
          transition: all 0.3s ease;
        }
        .nav-item.active .icon {
          color: #a78bfa;
          transform: translateY(-5px);
        }
        .nav-item.active .label {
          color: #a78bfa;
          bottom: 20px;
        }
        .indicator {
          position: absolute;
          top: -8px;
          width: 6px; height: 6px;
          border-radius: 50%;
          background-color: #a78bfa;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .nav-item.active .indicator {
          opacity: 1;
        }
        .fab-button {
          position: absolute;
          top: -25px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px; height: 60px;
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 25px rgba(139,92,246,0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1001;
          overflow: hidden;
        }
        .fab-button:hover {
          transform: translateX(-50%) scale(1.05);
          box-shadow: 0 10px 30px rgba(139,92,246,0.4);
        }
        .fab-button :global(svg) {
          color: white; font-size: 24px;
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          background-color: rgba(139,92,246,0.3);
          animation: ripple 0.6s linear;
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
      `}</style>
    </>
  );
}
