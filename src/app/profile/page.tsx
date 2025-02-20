"use client";
import React from "react";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      {/* Pass appropriate props to Header and MobileMenu */}
      <Header darkMode={true} toggleTheme={() => {}} setMenuOpen={() => {}} />
      <MobileMenu darkMode={true} menuOpen={false} setMenuOpen={() => {}} />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p>This is your profile page.</p>
      </div>
    </div>
  );
}
