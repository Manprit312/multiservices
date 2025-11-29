"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Poppins } from "next/font/google";
import {
  Sparkles,
  Car,
  Hotel,
  Users,
  ArrowRight,
  Star,
  BrushCleaning,
  MapPin,
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

function ServiHubHomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [banner, setBanner] = useState<BannerData | null>(null);
  const [selectedServiceType, setSelectedServiceType] = useState<"cleaning" | "hotels" | "cabs">("cleaning");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [services, setServices] = useState<Array<{
    _id: string;
    name: string;
    description?: string;
    price: number;
    location?: string;
    rating?: number;
    images?: string[];
    provider?: {
      _id: string;
      name: string;
      logo?: string;
    };
    pickup?: string;
    drop?: string;
    category?: string;
    amenities?: string[];
    duration?: string;
    capacity?: number;
    vehicleType?: string;
    distance?: number;
    fare?: number;
    [key: string]: unknown;
  }>>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [serviceCounts, setServiceCounts] = useState({ cleaning: 0, hotels: 0, rides: 0 });

  // Get search query and service type from URL
  useEffect(() => {
    const search = searchParams?.get("search");
    if (search) {
      setSearchQuery(decodeURIComponent(search));
      // Scroll to services section when search is present
      setTimeout(() => {
        const element = document.getElementById("services");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    } else {
      setSearchQuery("");
    }
    
    // Get service type from URL to activate the correct tab
    const serviceType = searchParams?.get("service");
    if (serviceType === "cleaning" || serviceType === "hotels" || serviceType === "cabs") {
      setSelectedServiceType(serviceType);
    }
  }, [searchParams]);


  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch(`${API_BASE}/api/home-banners`);
        const data = await res.json();
        if (data.success && data.banners.length > 0) {
          // Banner data loaded
          setBanner(data.banners[0]);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching banner:", err);
        }
      } finally {
        // setLoading(false);
      }
    }
    fetchBanner();
  }, []);

  // Fetch service counts on mount
  useEffect(() => {
    async function fetchServiceCounts() {
      try {
        const [cleaningRes, hotelsRes, ridesRes] = await Promise.all([
          fetch(`${API_BASE}/api/cleaning`),
          fetch(`${API_BASE}/api/hotels`),
          fetch(`${API_BASE}/api/book-ride`),
        ]);
        
        const cleaningData = await cleaningRes.json();
        const hotelsData = await hotelsRes.json();
        const ridesData = await ridesRes.json();

        setServiceCounts({
          cleaning: cleaningData.success ? (cleaningData.cleanings?.length || 0) : 0,
          hotels: hotelsData.success ? (hotelsData.hotels?.length || 0) : 0,
          rides: ridesData.success ? (ridesData.rides?.length || 0) : 0,
        });
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching service counts:", err);
        }
      }
    }
    fetchServiceCounts();
  }, []);

  // Fetch services based on selected tab and search query
  useEffect(() => {
    async function fetchServices() {
      setLoadingServices(true);
      try {
        let url = "";
        if (selectedServiceType === "cleaning") {
          url = `${API_BASE}/api/cleaning`;
        } else if (selectedServiceType === "hotels") {
          url = `${API_BASE}/api/hotels`;
        } else if (selectedServiceType === "cabs") {
          url = `${API_BASE}/api/book-ride`;
        }

        const res = await fetch(url);
        const data = await res.json();

        if (data.success) {
          let fetchedServices = [];
          if (selectedServiceType === "cleaning") {
            fetchedServices = data.cleanings || [];
          } else if (selectedServiceType === "hotels") {
            fetchedServices = data.hotels || [];
          } else if (selectedServiceType === "cabs") {
            fetchedServices = data.rides || [];
          }

          // Filter by search query
          if (searchQuery.trim()) {
            fetchedServices = fetchedServices.filter((service: {
              _id: string;
              name: string;
              description?: string;
              location?: string;
              pickup?: string;
              drop?: string;
              provider?: { name: string };
              [key: string]: unknown;
            }) => {
              const searchLower = searchQuery.toLowerCase();
              const name = typeof service.name === 'string' ? service.name : '';
              const description = typeof service.description === 'string' ? service.description : '';
              const location = typeof service.location === 'string' ? service.location : '';
              const pickup = typeof service.pickup === 'string' ? service.pickup : '';
              const drop = typeof service.drop === 'string' ? service.drop : '';
              const providerName = typeof service.provider?.name === 'string' ? service.provider.name : '';
              return (
                name.toLowerCase().includes(searchLower) ||
                description.toLowerCase().includes(searchLower) ||
                location.toLowerCase().includes(searchLower) ||
                pickup.toLowerCase().includes(searchLower) ||
                drop.toLowerCase().includes(searchLower) ||
                providerName.toLowerCase().includes(searchLower)
              );
            });
          }

          setServices(fetchedServices);
        } else {
          setServices([]);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error fetching services:", err);
        }
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    }
    fetchServices();
  }, [selectedServiceType, searchQuery]);

  // Service configuration removed - now dynamically generated from provider services

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

      {/* SERVICE TYPES SECTION - Zomato-style tabs */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 sm:mb-3 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Explore Services
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-2">
            Choose from cleaning, hotels, or cab services
          </p>
        </div>

        {/* Service Type Tabs - Tab Style with Border Bottom */}
        <div className="flex justify-center mb-8 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-0 w-full max-w-4xl min-w-full sm:min-w-0">
            <button
              onClick={() => setSelectedServiceType("cleaning")}
              className={`flex-1 min-w-[100px] px-2 sm:px-4 py-3 sm:py-4 font-semibold text-xs sm:text-sm md:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 border-b-2 ${
                selectedServiceType === "cleaning"
                  ? "border-green-500 text-green-600 bg-green-50/50"
                  : "border-transparent text-gray-600 hover:text-green-600 hover:border-green-200"
              }`}
            >
              <BrushCleaning size={16} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Cleaning</span>
              {serviceCounts.cleaning > 0 && (
                <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                  selectedServiceType === "cleaning" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {serviceCounts.cleaning}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedServiceType("hotels")}
              className={`flex-1 min-w-[100px] px-2 sm:px-4 py-3 sm:py-4 font-semibold text-xs sm:text-sm md:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 border-b-2 ${
                selectedServiceType === "hotels"
                  ? "border-blue-500 text-blue-600 bg-blue-50/50"
                  : "border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-200"
              }`}
            >
              <Hotel size={16} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Hotels</span>
              {serviceCounts.hotels > 0 && (
                <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                  selectedServiceType === "hotels" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {serviceCounts.hotels}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedServiceType("cabs")}
              className={`flex-1 min-w-[100px] px-2 sm:px-4 py-3 sm:py-4 font-semibold text-xs sm:text-sm md:text-base transition-all flex items-center justify-center gap-1 sm:gap-2 border-b-2 ${
                selectedServiceType === "cabs"
                  ? "border-yellow-500 text-yellow-600 bg-yellow-50/50"
                  : "border-transparent text-gray-600 hover:text-yellow-600 hover:border-yellow-200"
              }`}
            >
              <Car size={16} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">Cabs</span>
              {serviceCounts.rides > 0 && (
                <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
                  selectedServiceType === "cabs" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                }`}>
                  {serviceCounts.rides}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Services Grid */}
        {loadingServices ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                onClick={() => {
                  if (selectedServiceType === "cleaning") {
                    router.push(`/cleaning/${service._id}`);
                  } else if (selectedServiceType === "hotels") {
                    router.push(`/hotel/${service._id}`);
                  } else if (selectedServiceType === "cabs") {
                    router.push(`/taxi/${service._id}`);
                  }
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer border border-gray-200 group"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Service Image - Left Side */}
                  <div className="relative w-full sm:w-64 h-64 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                    {service.images && service.images.length > 0 ? (
                      <>
                      <Image
                        src={service.images[0]}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                   
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                         </>
                    ) : selectedServiceType === "cleaning" ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                        <BrushCleaning className="w-20 h-20 text-green-500" />
                      </div>
                    ) : selectedServiceType === "hotels" ? (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-sky-100">
                        <Hotel className="w-20 h-20 text-blue-500" />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-100">
                        <Car className="w-20 h-20 text-yellow-500" />
                      </div>
                    )}
                    {service.provider?.logo && (
                      <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-white p-1 shadow-lg border-2 border-white">
                        <Image
                          src={service.provider.logo}
                          alt={service.provider.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                    {/* Promoted Badge */}
                    {index < 3 && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        Popular
                      </div>
                    )}
                  </div>

                  {/* Service Info - Right Side */}
                  <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-xl sm:text-2xl mb-2 text-gray-900 group-hover:text-pink-600 transition-colors">
                            {selectedServiceType === "cabs" 
                              ? (service.name || `${service.pickup || "Pickup"} → ${service.drop || "Drop"}`)
                              : service.name}
                          </h3>
                          {service.provider && (
                            <p className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                              <span className="font-medium">{service.provider.name}</span>
                            </p>
                          )}
                        </div>
                        {service.rating && (
                          <div className="flex items-center gap-1 bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:ml-4">
                            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 fill-green-600" />
                            <span className="text-xs sm:text-sm font-bold text-green-700">{service.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      {/* Categories/Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedServiceType === "cleaning" && service.category && (
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                            {service.category}
                          </span>
                        )}
                        {selectedServiceType === "hotels" && service.amenities && service.amenities.slice(0, 4).map((amenity: string, idx: number) => (
                          <span key={idx} className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            {amenity}
                          </span>
                        ))}
                        {service.location && (
                          <span className="text-xs text-gray-500 flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                            <MapPin className="w-3 h-3" />
                            {service.location}
                          </span>
                        )}
                        {selectedServiceType === "cleaning" && service.duration && (
                          <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                            ⏱️ {service.duration}
                          </span>
                        )}
                        {selectedServiceType === "hotels" && service.capacity && (
                          <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                            👥 {service.capacity} guests
                          </span>
                        )}
                        {selectedServiceType === "cabs" && service.vehicleType && (
                          <span className="text-xs font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                            {service.vehicleType.toUpperCase()}
                          </span>
                        )}
                        {selectedServiceType === "cabs" && service.distance && (
                          <span className="text-xs text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                            📍 {service.distance} km
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {service.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      {selectedServiceType === "cabs" && service.pickup && service.drop && (
                        <div className="text-sm text-gray-600 mb-4 space-y-2">
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="font-medium">Pickup:</span> {service.pickup}
                          </p>
                          <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="font-medium">Drop:</span> {service.drop}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-3xl font-bold text-pink-600">
                          {selectedServiceType === "hotels" ? (
                            <>₹{service.price}<span className="text-sm font-normal text-gray-500">/night</span></>
                          ) : selectedServiceType === "cabs" ? (
                            <>₹{service.fare || service.price}</>
                          ) : (
                            <>₹{service.price}</>
                          )}
                        </div>
                        {selectedServiceType === "hotels" && (
                          <p className="text-xs text-gray-500 mt-1">Per night</p>
                        )}
                        {selectedServiceType === "cabs" && (
                          <p className="text-xs text-gray-500 mt-1">Per ride</p>
                        )}
                      </div>
                      <button className="px-3 sm:px-6 py-1.5 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 group-hover:scale-105 text-xs sm:text-sm md:text-base">
                        <span className="hidden sm:inline">View Details</span>
                        <span className="sm:hidden">View</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3 text-gray-800">No Services Found</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery
                ? `No ${selectedServiceType} services match your search "${searchQuery}". Try a different search term.`
                : `No ${selectedServiceType} services available at the moment. Please check back later.`}
            </p>
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
                onClick={() => router.push("/cleaning")}
              >
                Cleaning
              </li>
              <li
                className="cursor-pointer hover:text-pink-400 transition"
                onClick={() => router.push("/hotel")}
              >
                Hotel
              </li>
              <li
                className="cursor-pointer hover:text-pink-400 transition"
                onClick={() => router.push("/taxi")}
              >
                Cabs
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

export default function ServiHubHome() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div></div>}>
      <ServiHubHomeContent />
    </Suspense>
  );
}