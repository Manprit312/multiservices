"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import {
  Sparkles,
  Car,
  Hotel,
  Users,
  ArrowRight,
  Menu,
  X,
  Star,
  BrushCleaning,
} from "lucide-react";
import { motion } from "framer-motion";
import { Cloud, Circle, Triangle, Square } from "lucide-react";

const floatingIcons = { Star, Cloud, Circle, Triangle, Square };

import Image from "next/image";
import ContactSection from "@/components/ContactSection";
import UnifiedHeader from "@/components/UnifiedHeader";
interface BannerForm {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  gradientStart: string;
  gradientEnd: string;
}
interface BannerData extends BannerForm {
  _id: string;
  image: string;
  metrics?: { label: string; value: string }[];
}
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

interface Provider {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  rating?: number;
  specialties?: string[];
  city?: string;
}

export default function ServiHubHome() {
  const router = useRouter();


  const [banner, setBanner] = useState<BannerData | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [availableServices, setAvailableServices] = useState<{
    hasCleaning: boolean;
    hasHotels: boolean;
    hasRides: boolean;
    counts: { cleaning: number; hotels: number; rides: number };
  }>({ hasCleaning: false, hasHotels: false, hasRides: false, counts: { cleaning: 0, hotels: 0, rides: 0 } });
  const [loadingServices, setLoadingServices] = useState(false);

  // Get provider from URL on mount and when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const providerId = params.get("provider");
      setSelectedProvider(providerId);
    }
  }, [typeof window !== "undefined" ? window.location.search : ""]);

  // Fetch available services for selected provider
  useEffect(() => {
    async function fetchProviderServices() {
      if (!selectedProvider) {
        setAvailableServices({ hasCleaning: false, hasHotels: false, hasRides: false, counts: { cleaning: 0, hotels: 0, rides: 0 } });
        return;
      }

      setLoadingServices(true);
      try {
        const res = await fetch(`${API_BASE}/api/providers/${selectedProvider}/services/all`);
        const data = await res.json();

        if (data.success) {
          setAvailableServices({
            hasCleaning: data.counts.cleaning > 0,
            hasHotels: data.counts.hotels > 0,
            hasRides: data.counts.rides > 0,
            counts: data.counts,
          });
        }
      } catch (err) {
        console.error("Error fetching provider services:", err);
        setAvailableServices({ hasCleaning: false, hasHotels: false, hasRides: false, counts: { cleaning: 0, hotels: 0, rides: 0 } });
      } finally {
        setLoadingServices(false);
      }
    }
    fetchProviderServices();
  }, [selectedProvider]);


  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch(`${API_BASE}/api/home-banners`);
        const data = await res.json();
        if (data.success && data.banners.length > 0) {
          console.log(data.banners[0])
          setBanner(data.banners[0]);
        }
      } catch (err) {
        console.error("Error fetching banner:", err);
      } finally {
        // setLoading(false);
      }
    }
    fetchBanner();
  }, []);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const res = await fetch(`${API_BASE}/api/providers?isActive=true`);
        const data = await res.json();
        if (data.success) {
          setProviders(data.providers);
        }
      } catch (err) {
        console.error("Error fetching providers:", err);
      }
    }
    fetchProviders();
  }, []);

  const services = [
    {
      id: "cleaning",
      icon: <Sparkles className="w-10 h-10" />,
      title: "Home Cleaning",
      desc: "Professional cleaning for home & office",
      hue: "from-emerald-400 to-emerald-600",
      route: "/cleaning",
    },
    {
      id: "taxi",
      icon: <Car className="w-10 h-10" />,
      title: "Taxi Service",
      desc: "Bike, Auto & Cab — quick booking",
      hue: "from-yellow-400 to-yellow-600",
      route: "/taxi",
    },
    {
      id: "hotel",
      icon: <Hotel className="w-10 h-10" />,
      title: "Hotel Booking",
      desc: "Handpicked hotels & best rates",
      hue: "from-blue-400 to-indigo-600",
      route: "/hotel",
    },
    {
      id: "rideshare",
      icon: <Users className="w-10 h-10" />,
      title: "Ride Sharing",
      desc: "Share rides, save money & help the planet",
      hue: "from-pink-400 to-rose-600",
      route: "/rideshare",
    },
  ];

  return (
    <div
      className={`${poppins.variable} font-sans min-h-screen text-slate-900`}
      style={{ fontFamily: "var(--font-poppins), ui-sans-serif, system-ui, -apple-system" }}
    >
      {/* Global keyframes + helper styles */}
      <style jsx global>{`
        :root {
          --accent1: #ff4d98;
          --accent2: #7c3aed;
          --bg-start: #fff9fb; /* off-white pink */
          --bg-end: #fef2ff;
        }

        /* Waves translate */
        @keyframes waveMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-40%);
          }
        }

        /* Floating blobs */
        @keyframes floatUpDown {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-18px) scale(1.03);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
        }

        .wave-1 {
          animation: waveMove 18s linear infinite;
        }
        .wave-2 {
          animation: waveMove 26s linear infinite reverse;
        }
        .float-blob {
          animation: floatUpDown 6s ease-in-out infinite;
        }

        /* hero text shadow for contrast on off-white */
        .hero-heading {
          text-shadow: 0 6px 18px rgba(124, 58, 237, 0.14);
        }

        /* subtle glassy card */
        .glass-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.65));
          backdrop-filter: blur(6px);
        }
      `}</style>

      {/* Use Unified Header */}
      <UnifiedHeader />

      {/* HERO */}
      <header className="relative overflow-hidden pt-20">
        {/* Off-white gradient background */}
        {/* Floating pink-orange moving icons */}




        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, var(--bg-start) 0%, var(--bg-end) 100%)",
          }}
          aria-hidden
        />

        {/* floating blobs */}
        <div aria-hidden className="absolute -left-8 -top-10 w-72 h-72 rounded-full" style={{
          background: "linear-gradient(135deg,var(--accent1),var(--accent2))",
          filter: "blur(36px)",
          opacity: 0.22,
          transform: "rotate(12deg)",
        }}></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {(
            [
              "Star",
              "Cloud",
              "Circle",
              "Triangle",
              "Square",
              "Star",
              "Cloud",
              "Circle",
              "Triangle",
              "Square",
            ] as (keyof typeof floatingIcons)[]
          ).map((IconName, i) => {
            const Icon = floatingIcons[IconName];
            const top = Math.random() * 100;
            const left = Math.random() * 100;
            const size = Math.floor(Math.random() * 22) + 12;
            const color = Math.random() > 0.5 ? "#ff6b6b" : "#ff9f43";
            const duration = Math.random() * 6 + 6;
            const delay = Math.random() * 5;
            const rotate = Math.random() > 0.5;

            return (
              <Icon
                key={i}
                className="absolute opacity-40"
                style={{
                  top: `${top}%`,
                  left: `${left}%`,
                  color,
                  width: `${size}px`,
                  height: `${size}px`,
                  animation: `${rotate ? "float-rotate" : "float"} ${duration}s ease-in-out infinite`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}

        </div>
        <div aria-hidden className="absolute right-6 top-20 w-44 h-44 rounded-full float-blob" style={{
          background: "linear-gradient(135deg,#ff8ab8,#f0a6ff)",
          filter: "blur(24px)",
          opacity: 0.28,
        }}></div>

        <div aria-hidden className="absolute left-6 bottom-20 w-56 h-56 rounded-full float-blob" style={{
          background: "linear-gradient(135deg,#ffd166,#ff6b6b)",
          filter: "blur(26px)",
          opacity: 0.15,
          animationDelay: "0.8s"
        }}></div>

        {/* Waves (layered SVGs) */}
        <div className="absolute left-0 right-0 top-0 h-[420px] pointer-events-none">
          {/* Wave 1 - front */}
          <svg viewBox="0 0 1440 320" className="w-[240%] translate-x-0 wave-1" style={{ height: 420, overflow: "visible" }} preserveAspectRatio="xMinYMin slice" aria-hidden>
            <path fill="#ffffff77" d="M0,256L48,234.7C96,213,192,171,288,138.7C384,107,480,85,576,74.7C672,64,768,64,864,96C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>

          {/* Wave 2 - behind */}
          <svg viewBox="0 0 1440 320" className="w-[240%] translate-x-0 wave-2" style={{ height: 380, opacity: 0.85, transform: "translateY(50px)" }} preserveAspectRatio="xMinYMin slice" aria-hidden>
            <path fill="#ffffffd1" d="M0,192L48,197.3C96,203,192,213,288,213.3C384,213,480,203,576,197.3C672,192,768,192,864,181.3C960,171,1056,149,1152,144C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          </svg>
        </div>

        {/* Hero content container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20 md:pb-24 pt-8 sm:pt-12">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 text-slate-900 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm glass-card" style={{ display: "inline-flex" }}>
                <span className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold">NEW</span>
                <span className="hidden sm:inline">Promo style home</span>
                <span className="sm:hidden">Promo</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight hero-heading">
                {banner?.title}
              </h1>

              <p className="max-w-xl text-slate-700 text-sm sm:text-base">
                {banner?.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg text-sm sm:text-base">
                  {banner?.buttonText} <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <a className="text-xs sm:text-sm text-slate-700/90 hover:underline cursor-pointer text-center sm:text-left" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>See pricing</a>
              </div>

              <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 max-w-xs">

                {banner?.metrics?.map((t, i) => <div key={i} className="bg-white/90 rounded-xl p-2.5 sm:p-3 text-slate-900 text-center shadow">
                  <div className="text-xs font-medium">{t.label}</div>
                  <div className="text-base sm:text-lg font-extrabold">{t.value}</div>
                </div>)}
              </div>
            </div>

            {/* Right: phone mockup + floating elements */}
            <div className="relative flex justify-center md:justify-end mt-6 md:mt-0">
              <div className="w-full max-w-[280px] sm:max-w-[320px] md:w-[420px] lg:w-[520px] rounded-2xl sm:rounded-3xl overflow-hidden transform transition-all">
                {banner?.image ? (
                  <Image
                    src={banner.image}
                    alt="app mockup"
                    height={100}
                    width={100}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}

              </div>

              <div className="absolute -left-4 sm:-left-6 -top-6 sm:-top-8 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg float-blob">
                <Sparkles className="text-pink-600 w-4 h-4 sm:w-5 sm:h-5" />
              </div>

              <div className="absolute -right-4 sm:-right-8 bottom-6 sm:bottom-8 w-20 sm:w-24 md:w-28 h-8 sm:h-10 md:h-12 rounded-lg sm:rounded-xl bg-white/90 flex items-center justify-center shadow-lg text-xs sm:text-sm">
                <div className="text-xs">Download App</div>
              </div>
            </div>
          </div>

          {/* quick search strip */}
        
        </div>
      </header>

      {/* SERVICE TYPES SECTION - Show only available services */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        {!selectedProvider ? (
          <div className="text-center py-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl border-2 border-dashed border-pink-200">
            <Sparkles className="w-16 h-16 text-pink-400 mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold mb-3 text-gray-800">Select a Provider to Continue</h2>
            <p className="text-slate-600 max-w-2xl mx-auto mb-6">
              Choose a service provider from the dropdown in the header to access their services.
            </p>
          </div>
        ) : loadingServices ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading available services...</p>
          </div>
        ) : availableServices.hasCleaning || availableServices.hasHotels || availableServices.hasRides ? (
          <div>
            <div className="text-center mb-8 sm:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Available Services
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
                Select the type of service you need from {providers.find(p => p._id === selectedProvider)?.name || "your provider"}
              </p>
            </div>

            <div className={`grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto ${(availableServices.hasCleaning ? 1 : 0) +
                (availableServices.hasHotels ? 1 : 0) +
                (availableServices.hasRides ? 1 : 0) === 1
                ? "sm:max-w-md"
                : (availableServices.hasCleaning ? 1 : 0) + (availableServices.hasHotels ? 1 : 0) + (availableServices.hasRides ? 1 : 0) === 2
                  ? "sm:grid-cols-2"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}>
              {/* Cleaning Service Button - Only show if available */}
              {availableServices.hasCleaning && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => router.push(`/cleaning?provider=${selectedProvider}`)}
                  className="group cursor-pointer relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 text-white hover:shadow-green-500/50"
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full blur-3xl transform translate-x-4 sm:translate-x-8 -translate-y-4 sm:-translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full blur-2xl transform -translate-x-4 sm:-translate-x-6 translate-y-4 sm:translate-y-6 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-all shadow-lg">
                      <BrushCleaning className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-bold text-xl sm:text-2xl mb-2">Cleaning Services</h3>
                    <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm">Professional cleaning for your home, office, and more</p>
                    {availableServices.counts.cleaning > 0 && (
                      <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs font-semibold bg-white/20 px-2.5 sm:px-3 py-1 rounded-full">
                        {availableServices.counts.cleaning} {availableServices.counts.cleaning === 1 ? 'Service' : 'Services'} Available
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full group-hover:bg-white/40 transition-all shadow-md">
                      View Services <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Hotel Service Button - Only show if available */}
              {availableServices.hasHotels && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => router.push(`/hotel?provider=${selectedProvider}`)}
                  className="group cursor-pointer relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all bg-gradient-to-br from-blue-500 via-sky-500 to-cyan-600 text-white hover:shadow-blue-500/50"
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full blur-3xl transform translate-x-4 sm:translate-x-8 -translate-y-4 sm:-translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full blur-2xl transform -translate-x-4 sm:-translate-x-6 translate-y-4 sm:translate-y-6 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-all shadow-lg">
                      <Hotel className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-bold text-xl sm:text-2xl mb-2">Hotel Bookings</h3>
                    <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm">Find and book the perfect hotel for your stay</p>
                    {availableServices.counts.hotels > 0 && (
                      <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs font-semibold bg-white/20 px-2.5 sm:px-3 py-1 rounded-full">
                        {availableServices.counts.hotels} {availableServices.counts.hotels === 1 ? 'Hotel' : 'Hotels'} Available
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full group-hover:bg-white/40 transition-all shadow-md">
                      View Hotels <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              )}

              {/* Taxi/Ride Service Button - Only show if available */}
              {availableServices.hasRides && (
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => router.push(`/taxi?provider=${selectedProvider}`)}
                  className="group cursor-pointer relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl transform transition-all bg-gradient-to-br from-yellow-500 via-orange-500 to-amber-600 text-white hover:shadow-yellow-500/50"
                >
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full blur-3xl transform translate-x-4 sm:translate-x-8 -translate-y-4 sm:-translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-full blur-2xl transform -translate-x-4 sm:-translate-x-6 translate-y-4 sm:translate-y-6 group-hover:scale-125 transition-transform duration-500"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/30 transition-all shadow-lg">
                      <Car className="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="font-bold text-xl sm:text-2xl mb-2">Ride Services</h3>
                    <p className="text-white/90 mb-3 sm:mb-4 text-xs sm:text-sm">Book a ride - bike, auto, or cab - anywhere you need</p>
                    {availableServices.counts.rides > 0 && (
                      <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 text-xs font-semibold bg-white/20 px-2.5 sm:px-3 py-1 rounded-full">
                        {availableServices.counts.rides} {availableServices.counts.rides === 1 ? 'Route' : 'Routes'} Available
                      </div>
                    )}
                    <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-white/30 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full group-hover:bg-white/40 transition-all shadow-md">
                      Book Ride <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.article>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3 text-gray-800">No Services Available</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This provider hasn't added any services yet. Please check back later or select another provider.
            </p>
            <button
              onClick={() => {
                setSelectedProvider(null);
                window.location.href = "/";
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition"
            >
              Choose Another Provider <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-gradient-to-b from-white to-pink-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-6">Pricing Table</h2>
          <p className="text-slate-600 mb-8 max-w-2xl">Choose a plan for occasional or frequent bookings.</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow">
              <div className="text-sm font-semibold text-pink-500">Standard</div>
              <div className="text-3xl font-extrabold mt-4">$29 <span className="text-sm font-medium">/mo</span></div>
              <ul className="mt-6 text-sm space-y-2 text-slate-600">
                <li>Basic bookings</li>
                <li>Standard support</li>
                <li>Limited offer</li>
              </ul>
              <button className="mt-6 w-full rounded-full py-3 bg-white border text-pink-600 font-semibold">Purchase</button>
            </div>

            <div className="bg-pink-500 text-white rounded-3xl p-8 shadow-lg transform scale-105">
              <div className="text-sm font-semibold opacity-90">Personal</div>
              <div className="text-4xl font-extrabold mt-4">$49 <span className="text-sm font-medium">/mo</span></div>
              <ul className="mt-6 text-sm space-y-2 opacity-90">
                <li>Up to 10 bookings</li>
                <li>Priority support</li>
                <li>Discounted rates</li>
              </ul>
              <button className="mt-6 w-full rounded-full py-3 bg-white text-pink-600 font-bold shadow">Choose Personal</button>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow">
              <div className="text-sm font-semibold text-pink-500">Business</div>
              <div className="text-3xl font-extrabold mt-4">$99 <span className="text-sm font-medium">/mo</span></div>
              <ul className="mt-6 text-sm space-y-2 text-slate-600">
                <li>Unlimited bookings</li>
                <li>Dedicated account manager</li>
                <li>API access</li>
              </ul>
              <button className="mt-6 w-full rounded-full py-3 bg-white border text-pink-600 font-semibold">Purchase</button>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-2xl font-extrabold">10k+</div>
            <div className="text-sm text-slate-500 mt-2">Happy Clients</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-2xl font-extrabold">300k+</div>
            <div className="text-sm text-slate-500 mt-2">Bookings</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-2xl font-extrabold">4.9★</div>
            <div className="text-sm text-slate-500 mt-2">Avg Rating</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="text-2xl font-extrabold">24/7</div>
            <div className="text-sm text-slate-500 mt-2">Support</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-6">What clients say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ammy Doe", text: "Absolutely wonderful — I felt so happy with the service." },
              { name: "Rohit K", text: "Fast booking and polite professionals. Highly recommended." },
              { name: "Simran S", text: "Great app UX and reliable rides every time." },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600">
                    {t.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-slate-500">Verified customer</div>
                  </div>
                </div>
                <p className="mt-4 text-slate-700">“{t.text}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ContactSection />
      {/* CONTACT */}
      {/* <section id="contact" className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-3xl font-extrabold mb-4">Contact Us</h3>
            <p className="text-slate-600 mb-6">Have a question? Reach out — we respond fast.</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-pink-500" /> <span>+91 98765 43210</span></div>
              <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-pink-500" /> <span>hello@servihub.com</span></div>
              <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-pink-500" /> <span>Ludhiana, Punjab</span></div>
            </div>
          </div>

          <form className="bg-white p-6 rounded-2xl shadow space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Message sent — we will contact you soon!"); }}>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="First name" className="rounded-xl border px-4 py-3 outline-none" />
              <input placeholder="Last name" className="rounded-xl border px-4 py-3 outline-none" />
            </div>
            <input placeholder="Email" className="w-full rounded-xl border px-4 py-3 outline-none" />
            <textarea placeholder="How can we help?" className="w-full rounded-xl border px-4 py-3 outline-none h-28" />
            <div className="flex items-center justify-between">
              <button className="bg-pink-500 text-white px-6 py-3 rounded-full font-semibold">Send Message</button>
              <div className="text-sm text-slate-500">Or call us: +91 98765 43210</div>
            </div>
          </form>
        </div>
      </section> */}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl font-extrabold text-pink-400">ServiHub</div>
            <p className="text-sm text-slate-400 mt-3">One platform for all daily services.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Services</h4>
            <ul className="text-sm text-slate-300 space-y-2">
              <li
                className="cursor-pointer hover:text-pink-400 transition"
                onClick={() => router.push(selectedProvider ? `/cleaning?provider=${selectedProvider}` : "/cleaning")}
              >
                Cleaning
              </li>
              {/* <li className="cursor-pointer" onClick={() => router.push("/taxi")}>Taxi</li> */}
              <li
                className="cursor-pointer hover:text-pink-400 transition"
                onClick={() => router.push(selectedProvider ? `/hotel?provider=${selectedProvider}` : "/hotel")}
              >
                Hotel
              </li>
              {/* <li className="cursor-pointer" onClick={() => router.push("/rideshare")}>RideShare</li> */}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="text-sm text-slate-300">
              <div>hello@servihub.com</div>
              <div className="mt-2">© {new Date().getFullYear()} ServiHub. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
<style jsx>{`
  @keyframes float {
    0% { transform: translateY(0px); opacity: 0.4; }
    50% { transform: translateY(-25px); opacity: 0.7; }
    100% { transform: translateY(0px); opacity: 0.4; }
  }

  @keyframes float-rotate {
    0% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
    50% { transform: translateY(-25px) rotate(25deg); opacity: 0.8; }
    100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
  }
`}</style>