"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BrushCleaning, Leaf, Sparkles, Phone, Menu, X } from "lucide-react";
import Link from "next/link";

function CleaningHeaderContent() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const providerId = searchParams?.get("provider");

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: "/" },
    { name: "Cleaning", icon: <BrushCleaning size={18} />, href: providerId ? `/cleaning?provider=${providerId}` : "/cleaning" },
    { name: "Packages", icon: <Leaf size={18} />, href: providerId ? `/cleaning/packages?provider=${providerId}` : "/cleaning/packages" },
    { name: "Contact", icon: <Phone size={18} />,  href:"#booking" },
  ];

  return (
    <header className="relative z-[9999]" style={{ position: 'relative', zIndex: 9999 }}>
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
      <div 
        className="w-full fixed top-0 left-0 right-0 bg-white shadow-lg border-b-2 border-green-200" 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          backgroundColor: '#ffffff', 
          zIndex: 9999,
          width: '100%',
          minHeight: '64px',
          paddingBottom: '12px'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 sm:py-4 lg:py-5 flex items-center justify-between font-[Poppins]">
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
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-2 text-slate-700 hover:text-green-600 font-medium transition-all px-4 py-2 rounded-xl border-2 border-green-100 bg-white hover:bg-green-50 hover:border-green-300 shadow-sm hover:shadow-md"
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

        {/* 📱 Mobile Dropdown Menu - Slides from right */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.4
              }}
              className="md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/98 backdrop-blur-lg shadow-2xl z-50 flex flex-col border-l border-green-100"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-green-100">
                <h2 className="text-green-700 font-bold text-xl">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                {/* Menu Items */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05, type: "spring", stiffness: 200 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-slate-700 hover:text-green-600 font-medium py-3.5 px-4 rounded-xl border-2 border-green-100 bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <span className="text-emerald-400">{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Book Now
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </header>
  );
}

export default function CleaningHeader() {
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <CleaningHeaderContent />
    </Suspense>
  );
}
