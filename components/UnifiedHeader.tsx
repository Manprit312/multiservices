"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BrushCleaning, Hotel, Car, Sparkles, Phone, Menu, X, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Color themes for different service types
const colorThemes = {
  default: {
    primary: "pink",
    primaryColor: "text-pink-600",
    primaryBg: "bg-pink-500",
    primaryHover: "hover:text-pink-600",
    gradient: "from-pink-500 to-purple-600",
    border: "border-pink-100",
    icon: "text-pink-400",
    glow: "rgba(236,72,153,0.7)",
  },
  cleaning: {
    primary: "green",
    primaryColor: "text-green-600",
    primaryBg: "bg-green-500",
    primaryHover: "hover:text-green-600",
    gradient: "from-green-600 to-emerald-500",
    border: "border-green-100",
    icon: "text-emerald-400",
    glow: "rgba(16,185,129,0.7)",
  },
  hotel: {
    primary: "blue",
    primaryColor: "text-blue-600",
    primaryBg: "bg-blue-500",
    primaryHover: "hover:text-blue-600",
    gradient: "from-blue-600 to-sky-500",
    border: "border-blue-100",
    icon: "text-sky-400",
    glow: "rgba(56,189,248,0.7)",
  },
  ride: {
    primary: "yellow",
    primaryColor: "text-yellow-600",
    primaryBg: "bg-yellow-500",
    primaryHover: "hover:text-yellow-600",
    gradient: "from-yellow-500 to-orange-500",
    border: "border-yellow-100",
    icon: "text-yellow-400",
    glow: "rgba(234,179,8,0.7)",
  },
};

interface Provider {
  _id: string;
  name: string;
  logo?: string;
}

function UnifiedHeaderContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to home page with search query
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      // Scroll to services section after navigation
      setTimeout(() => {
        const element = document.getElementById("services");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  // Determine theme based on current path
  const getTheme = () => {
    if (pathname?.includes("/cleaning")) return colorThemes.cleaning;
    if (pathname?.includes("/hotel")) return colorThemes.hotel;
    if (pathname?.includes("/taxi") || pathname?.includes("/ride")) return colorThemes.ride;
    return colorThemes.default;
  };

  const theme = getTheme();

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: "/", scrollTo: null, serviceType: null },
    { name: "Cleaning", icon: <BrushCleaning size={18} />, href: "/", scrollTo: "services", serviceType: "cleaning" },
    { name: "Hotels", icon: <Hotel size={18} />, href: "/", scrollTo: "services", serviceType: "hotels" },
    { name: "Rides", icon: <Car size={18} />, href: "/", scrollTo: "services", serviceType: "cabs" },
    { name: "Contact", icon: <Phone size={18} />, href: "#contactus", scrollTo: null, serviceType: null },
  ];

  const handleNavClick = (href: string, scrollTo: string | null, serviceType: string | null, e: React.MouseEvent) => {
    e.preventDefault();
    if (scrollTo) {
      // Navigate to home and scroll to services section
      if (href === "/") {
        // Set service type in URL to activate the correct tab
        const url = serviceType ? `/?service=${serviceType}` : "/";
        router.push(url);
        setTimeout(() => {
          const element = document.getElementById(scrollTo);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      router.push(href);
    }
  };

  return (
    <header className="relative z-50">
      {/* Floating Animated Shapes */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className={`absolute top-2 left-10 w-5 h-5 ${theme.icon}/30 rounded-full blur-sm`}
      />
      <motion.div
        animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className={`absolute top-6 right-16 w-6 h-6 ${theme.icon}/40 rounded-full`}
      />
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity }}
        className={`absolute bottom-0 left-1/2 w-6 h-6 border-2 ${theme.icon} rounded-full opacity-50`}
      />

      {/* Navbar */}
      <div className="w-full fixed top-0 left-0 backdrop-blur-lg bg-white/70 shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between font-[Poppins]">
          {/* Logo - Updates based on selected provider */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: -2 }}
            transition={{ type: "spring", stiffness: 250, damping: 15 }}
            className="cursor-pointer flex-shrink-0"
          >
            <Link
              href="/"
              className={`flex items-center gap-1.5 sm:gap-2 ${theme.primaryColor} font-bold text-lg sm:text-xl md:text-2xl relative group`}
            >
              {/* Logo Icon */}
              <motion.div
                whileHover={{ rotate: 25, scale: 1.15 }}
                transition={{ duration: 0.4 }}
                className="relative"
              >
                <Sparkles
                  className={`${theme.icon} drop-shadow-[0_0_6px_${theme.glow}] transition-all group-hover:${theme.primaryColor}`}
                  size={18}
                  style={{ width: 'clamp(18px, 4vw, 22px)', height: 'clamp(18px, 4vw, 22px)' }}
                />
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`absolute -inset-2 rounded-full ${theme.icon}/30 blur-md`}
                />
              </motion.div>

              {/* Logo Text */}
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 150, damping: 8 }}
                className={`transition-all group-hover:${theme.primaryColor} hidden xs:inline-block truncate max-w-[120px] sm:max-w-none`}
              >
                ServiHub
              </motion.span>
            </Link>
          </motion.div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className={`w-full px-4 py-2 pl-10 rounded-lg border ${theme.border} bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-${theme.primary}-300`}
              />
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.icon} w-4 h-4`} />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(item.href, item.scrollTo, item.serviceType, e)}
                  className={`flex items-center gap-1.5 sm:gap-2 text-slate-700 ${theme.primaryHover} font-medium text-sm xl:text-base transition-all cursor-pointer`}
                >
                  <span className="hidden xl:inline">{item.icon}</span>
                  {item.name}
                </a>
              </motion.div>
            ))}
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className={`hidden lg:inline-block bg-gradient-to-r ${theme.gradient} text-white px-4 xl:px-5 py-1.5 xl:py-2 rounded-full font-semibold text-sm xl:text-base shadow-md hover:shadow-lg`}
          >
            Get Started
          </motion.button>

          {/* Mobile: Search + Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2 flex-1">
            <form onSubmit={handleSearch} className="flex-1 relative max-w-[200px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`w-full px-3 py-1.5 pl-8 rounded-lg border ${theme.border} bg-white text-gray-700 text-xs focus:outline-none focus:ring-1 focus:ring-${theme.primary}-300`}
              />
              <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.icon} w-3 h-3`} />
            </form>
            <button
              className={theme.primaryColor}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`lg:hidden bg-white/95 backdrop-blur-md border-t ${theme.border} px-4 sm:px-6 py-4 flex flex-col gap-3 max-h-[calc(100vh-80px)] overflow-y-auto`}
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services..."
                  className={`w-full px-4 py-2 pl-10 rounded-lg border ${theme.border} bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-${theme.primary}-300`}
                />
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.icon} w-4 h-4`} />
              </div>
            </form>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  setIsOpen(false);
                  handleNavClick(item.href, item.scrollTo, item.serviceType, e);
                }}
                className={`flex items-center gap-2 text-slate-700 ${theme.primaryHover} font-medium py-2 text-sm sm:text-base cursor-pointer`}
              >
                {item.icon}
                {item.name}
              </a>
            ))}
            <button className={`mt-2 bg-gradient-to-r ${theme.gradient} text-white px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg text-sm sm:text-base`}>
              Get Started
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default function UnifiedHeader() {
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <UnifiedHeaderContent />
    </Suspense>
  );
}

