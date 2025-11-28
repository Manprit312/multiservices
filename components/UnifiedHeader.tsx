"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BrushCleaning, Hotel, Car, Sparkles, Phone, Menu, X } from "lucide-react";
import Link from "next/link";

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
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedProviderData, setSelectedProviderData] = useState<Provider | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const providerId = searchParams?.get("provider");

  // Fetch providers on mount
  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/providers?isActive=true`);
        const data = await res.json();
        if (data.success) {
          setProviders(data.providers);
          // If providerId in URL, set it
          if (providerId) {
            const provider = data.providers.find((p: Provider) => p._id === providerId);
            if (provider) {
              setSelectedProvider(providerId);
              setSelectedProviderData(provider);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    }
    fetchProviders();
  }, [providerId]);

  // Update selected provider when changed
  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = providers.find((p) => p._id === providerId);
    setSelectedProviderData(provider || null);
    // Update URL with provider
    const currentPath = pathname || "/";
    window.location.href = `${currentPath}?provider=${providerId}`;
  };

  // Determine theme based on current path
  const getTheme = () => {
    if (pathname?.includes("/cleaning")) return colorThemes.cleaning;
    if (pathname?.includes("/hotel")) return colorThemes.hotel;
    if (pathname?.includes("/taxi") || pathname?.includes("/ride")) return colorThemes.ride;
    return colorThemes.default;
  };

  const theme = getTheme();

  // Build navigation items with provider context
  const buildHref = (path: string) => {
    return selectedProvider ? `${path}?provider=${selectedProvider}` : path;
  };

  const navItems = [
    { name: "Home", icon: <Home size={18} />, href: buildHref("/") },
    { name: "Cleaning", icon: <BrushCleaning size={18} />, href: buildHref("/cleaning") },
    { name: "Hotels", icon: <Hotel size={18} />, href: buildHref("/hotel") },
    { name: "Rides", icon: <Car size={18} />, href: buildHref("/taxi") },
    { name: "Contact", icon: <Phone size={18} />, href: "#contactus" },
  ];

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
              href={buildHref("/")}
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

          {/* Provider Dropdown - Desktop */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <select
              value={selectedProvider || ""}
              onChange={(e) => handleProviderChange(e.target.value)}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border ${theme.border} bg-white ${theme.primaryColor} font-medium text-sm focus:outline-none focus:ring-2 focus:ring-${theme.primary}-300 cursor-pointer max-w-[200px]`}
            >
              <option value="">Select Provider</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name}
                </option>
              ))}
            </select>
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
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 sm:gap-2 text-slate-700 ${theme.primaryHover} font-medium text-sm xl:text-base transition-all`}
                >
                  <span className="hidden xl:inline">{item.icon}</span>
                  {item.name}
                </Link>
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

          {/* Mobile: Provider Dropdown + Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <select
              value={selectedProvider || ""}
              onChange={(e) => handleProviderChange(e.target.value)}
              className={`px-2 py-1.5 rounded-lg border ${theme.border} bg-white ${theme.primaryColor} text-xs sm:text-sm font-medium focus:outline-none max-w-[100px] sm:max-w-[140px]`}
            >
              <option value="">Provider</option>
              {providers.map((provider) => (
                <option key={provider._id} value={provider._id}>
                  {provider.name.length > 15 ? provider.name.substring(0, 15) + '...' : provider.name}
                </option>
              ))}
            </select>
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
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 text-slate-700 ${theme.primaryHover} font-medium py-2 text-sm sm:text-base`}
              >
                {item.icon}
                {item.name}
              </Link>
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

