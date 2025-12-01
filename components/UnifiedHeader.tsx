"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, BrushCleaning, Hotel, Car, Sparkles, Phone, Menu, X, Search, User, Building2, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

// Color themes for different service types - All green
const colorThemes = {
  default: {
    primary: "green",
    primaryColor: "text-green-600",
    primaryBg: "bg-green-500",
    primaryHover: "hover:text-green-600",
    gradient: "from-green-600 to-emerald-500",
    border: "border-green-100",
    icon: "text-emerald-400",
    glow: "rgba(16,185,129,0.7)",
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
    primary: "green",
    primaryColor: "text-green-600",
    primaryBg: "bg-green-500",
    primaryHover: "hover:text-green-600",
    gradient: "from-green-600 to-emerald-500",
    border: "border-green-100",
    icon: "text-emerald-400",
    glow: "rgba(16,185,129,0.7)",
  },
  ride: {
    primary: "green",
    primaryColor: "text-green-600",
    primaryBg: "bg-green-500",
    primaryHover: "hover:text-green-600",
    gradient: "from-green-600 to-emerald-500",
    border: "border-green-100",
    icon: "text-emerald-400",
    glow: "rgba(16,185,129,0.7)",
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, userRole, logout } = useAuth();

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
    <header className="relative z-[9999]" style={{ position: 'relative', zIndex: 9999 }}>
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
    
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 lg:py-5 flex items-center justify-between font-[Poppins]">
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
          <nav className="hidden lg:flex items-center gap-3 xl:gap-4">
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
                  className={`flex items-center gap-1.5 sm:gap-2 text-slate-700 ${theme.primaryHover} font-medium text-sm xl:text-base transition-all cursor-pointer px-4 py-2 rounded-xl border-2 border-green-100 bg-white hover:bg-green-50 hover:border-green-300 shadow-sm hover:shadow-md`}
                >
                  <span className="hidden xl:inline">{item.icon}</span>
                  {item.name}
                </a>
              </motion.div>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          {user ? (
            <div className="hidden lg:flex items-center gap-3 relative">
              {/* Register as Provider Button (if not admin) */}
              {userRole !== "admin" && userRole !== "superadmin" && (
                <Link
                  href="/register-provider"
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                >
                  <Building2 className="w-4 h-4" />
                  Become Provider
                </Link>
              )}
              
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="w-8 h-8 rounded-full border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 hidden xl:block">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                    >
                      <div className="p-2">
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-700">My Profile</span>
                        </Link>
                        {userRole === "admin" && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Building2 className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-700">Admin Dashboard</span>
                          </Link>
                        )}
                        {userRole === "superadmin" && (
                          <Link
                            href="/superadmin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <Building2 className="w-4 h-4 text-purple-600" />
                            <span className="text-sm text-gray-700">Superadmin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={async () => {
                            await logout();
                            setUserMenuOpen(false);
                            router.push("/");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-600">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-3 px-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-green-600 font-medium text-sm xl:text-base transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`bg-gradient-to-r ${theme.gradient} text-white px-4 xl:px-5 py-1.5 xl:py-2 rounded-full font-semibold text-sm xl:text-base shadow-md hover:shadow-lg transition-all`}
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile: Search + Menu Toggle */}
          <div className="lg:hidden flex justify-between gap-2 flex-1">
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

        {/* Mobile Dropdown Menu - Slides from right */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
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
              className={`lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white/98 backdrop-blur-lg shadow-2xl z-50 flex flex-col border-l ${theme.border}`}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-green-100">
                <h2 className="text-green-700 font-bold text-xl">Menu</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`${theme.primaryColor} p-2 rounded-full hover:bg-green-50 transition-colors`}
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Menu Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                {/* Mobile Search */}
                <motion.form 
                  onSubmit={handleSearch}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-4"
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for services..."
                      className={`w-full px-4 py-2.5 pl-10 rounded-xl border-2 ${theme.border} bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 transition-all`}
                    />
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.icon} w-4 h-4`} />
                  </div>
                </motion.form>

                {/* Menu Items */}
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        setIsOpen(false);
                        handleNavClick(item.href, item.scrollTo, item.serviceType, e);
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05, type: "spring", stiffness: 200 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 text-slate-700 ${theme.primaryHover} font-medium py-3.5 px-4 text-sm sm:text-base cursor-pointer rounded-xl border-2 border-green-100 bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md`}
                    >
                      <span className={`${theme.icon}`}>{item.icon}</span>
                      <span>{item.name}</span>
                    </motion.a>
                  ))}
                </div>

                {/* Auth Section */}
                {user ? (
                  <div className="mt-6 space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>
                    {userRole !== "admin" && userRole !== "superadmin" && (
                      <Link
                        href="/register-provider"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 ml-2 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                      >
                        <Building2 className="w-5 h-5" />
                        <span>Become Provider</span>
                      </Link>
                    )}
                    {(userRole === "admin" || userRole === "superadmin") && (
                      <Link
                        href={userRole === "superadmin" ? "/superadmin" : "/admin"}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                      >
                        <Building2 className="w-5 h-5" />
                        <span>{userRole === "superadmin" ? "Superadmin" : "Admin"} Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await logout();
                        setIsOpen(false);
                        router.push("/");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center px-5 py-3.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className={`block w-full text-center bg-gradient-to-r ${theme.gradient} text-white px-5 py-3.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200`}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
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

