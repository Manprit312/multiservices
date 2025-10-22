"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Hotel, Car, Sparkles, Phone, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: "/" },
    { name: "Hotels", icon: <Hotel size={18} />, href: "/hotel" },
    { name: "Rides", icon: <Car size={18} />, href: "/rides" },
    { name: "Services", icon: <Sparkles size={18} />, href: "/services" },
    { name: "Contact", icon: <Phone size={18} />, href: "/contact" },
  ];

  return (
    <header className="relative z-50">
      {/* Floating Shapes */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-0 left-8 w-4 h-4 bg-sky-400/30 rounded-full blur-sm"
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-6 right-10 w-5 h-5 bg-blue-400/30 rotate-45"
      />
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute bottom-0 left-1/2 w-6 h-6 border-2 border-sky-300 rounded-full opacity-60"
      />

      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 backdrop-blur-lg bg-white/70 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between font-[Poppins]">
          {/* Logo */}
         <motion.div
  whileHover={{ scale: 1.1, rotate: -3 }}
  transition={{ type: "spring", stiffness: 300, damping: 12 }}
  className="cursor-pointer"
>
  <Link
    href="/"
    className="flex items-center gap-2 text-blue-700 font-bold text-2xl relative group"
  >
    {/* Icon with glow and rotation */}
    <motion.div
      whileHover={{ rotate: 20, scale: 1.2 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <Sparkles
        className="text-sky-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.7)] transition-all group-hover:text-sky-500"
        size={22}
      />
      {/* Animated glow ring */}
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-2 rounded-full bg-sky-300/30 blur-md"
      />
    </motion.div>

    {/* Text animation */}
    <motion.span
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 150, damping: 8 }}
      className="transition-all group-hover:text-blue-600"
    >
      Turmet
    </motion.span>
  </Link>
</motion.div>

          {/* Desktop Nav */}
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
                  className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium transition-all"
                >
                  {item.icon}
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="hidden md:inline-block bg-gradient-to-r from-blue-600 to-sky-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg"
          >
            Login
          </motion.button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-blue-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-blue-100 px-6 py-4 flex flex-col gap-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-medium"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            <button className="mt-2 bg-gradient-to-r from-blue-600 to-sky-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg">
              Login
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
