"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, BrushCleaning, Leaf, Sparkles, Phone, Menu, X } from "lucide-react";
import Link from "next/link";

export default function CleaningHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: "/" },
    { name: "Cleaning", icon: <BrushCleaning size={18} />, href: "/cleaning" },
    { name: "Packages", icon: <Leaf size={18} />, href: "/cleaning/packages" },
    { name: "Contact", icon: <Phone size={18} />,  href:"#booking" },
  ];

  return (
    <header className="relative z-50">
      {/* Floating Animated Shapes */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-2 left-10 w-5 h-5 bg-emerald-400/30 rounded-full blur-sm"
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute top-6 right-16 w-6 h-6 bg-green-300/40 rounded-full"
      />
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 w-6 h-6 border-2 border-green-400 rounded-full opacity-50"
      />

      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 backdrop-blur-lg bg-white/70 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between font-[Poppins]">
          {/* 🌿 Logo with motion & cursor animation */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: -2 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="cursor-pointer"
          >
            <Link
              href="/cleaning"
              className="flex items-center gap-2 text-emerald-700 font-bold text-2xl relative group"
            >
              {/* Icon + Glow Animation */}
              <motion.div
                whileHover={{ rotate: 25, scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <Sparkles
                  className="text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.7)] transition-all group-hover:text-emerald-500"
                  size={22}
                />
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -inset-2 rounded-full bg-emerald-300/30 blur-md"
                />
              </motion.div>

              {/* Animated Text */}
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 150, damping: 8 }}
                className="transition-all group-hover:text-green-600"
              >
                Qleenify
              </motion.span>
            </Link>
          </motion.div>

          {/* 🧭 Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-slate-700 hover:text-green-600 font-medium transition-all"
                >
                  {item.icon}
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* 💚 CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="hidden md:inline-block bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg"
          >
            Book Now
          </motion.button>

          {/* 📱 Mobile Menu Toggle */}
          <button
            className="md:hidden text-green-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 📱 Mobile Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-green-100 px-6 py-4 flex flex-col gap-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-slate-700 hover:text-green-600 font-medium"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <button className="mt-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg">
              Book Now
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
