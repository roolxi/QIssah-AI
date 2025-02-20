"use client";
import React from "react";
import Header from "@/app/components/Header";
import MobileMenu from "@/app/components/MobileMenu";

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Header darkMode={true} toggleTheme={() => {}} setMenuOpen={() => {}} />
      <MobileMenu darkMode={true} menuOpen={false} setMenuOpen={() => {}} />
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p>Customize your experience here.</p>
      </div>
    </div>
  );
}
