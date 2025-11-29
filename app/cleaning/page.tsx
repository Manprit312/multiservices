"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { DEFAULT_IMAGES } from "@/lib/cloudinary";
import {
  Phone,
  ArrowRight,
  Sparkles,
  BrushCleaning,
  Clock,
} from "lucide-react";
interface CleaningBanner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
}

interface CleaningService {
  _id: string;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  images?: string[];
  category?: string;
  provider?: {
    _id: string;
    name: string;
    logo?: string;
  };
}


import UnifiedHeader from "@/components/UnifiedHeader";

const PRIMARY_GREEN = "#2f9b57";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function CleaningPageContent() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState<CleaningBanner | null>(null);
  const [services, setServices] = useState<CleaningService[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const url = `${API_BASE}/api/cleaning`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setServices(data.cleanings || []);
        } else {
          setServices([]);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch services:", err);
        }
        setServices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);
  // Fetch banner on mount
  useEffect(() => {
    async function fetchBanner() {
      try {
        const res = await fetch(`${API_BASE}/api/cleaning-banners`);
        const data = await res.json();
        if (data.success && data.banners.length > 0) {
          setBanner(data.banners[0]);
        } else {
          setBanner(null);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch banner:", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBanner();
  }, []);



  return (
    <>
      <UnifiedHeader />
      <main className="text-gray-900 mt-28 ">
        <style>{`:root { --qleen-green: ${PRIMARY_GREEN}; }`}</style>

        {/* 🧼 HERO SECTION */}
        <div className="bg-white relative overflow-hidden mb-18">
          {/* Floating Animated Sparkles */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-12 left-10 text-emerald-400 opacity-60"
          >
            <Sparkles size={28} />
          </motion.div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block rounded-full px-4 py-1 text-sm font-semibold text-emerald-900 bg-emerald-100">
                  Professional • Trusted • Eco-friendly
                </span>

                <h1 className="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
                  {loading ? (
                    <span>Loading Banner...</span>
                  ) : banner ? (
                    <>
                      {banner.title}{" "}
                      <span style={{ color: "var(--qleen-green)" }}>
                        {banner.subtitle}
                      </span>
                    </>
                  ) : (
                    <>
                      Reliable Cleaning Services —{" "}
                      <span style={{ color: "var(--qleen-green)" }}>
                        Spotless Results
                      </span>
                    </>
                  )}
                </h1>

                <p className="mt-6 text-lg text-gray-700 max-w-xl">
                  {banner
                    ? "Book our trusted cleaning experts for spotless spaces — fast, affordable, and eco-friendly."
                    : "Book a professional team for deep home cleaning, kitchen & bathroom sanitation, and commercial cleaning."}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    className="inline-flex items-center gap-2 bg-[var(--qleen-green)] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                    href="#booking"
                  >
                    Book Now
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <a
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-200 hover:shadow-sm transition"
                    href="#services"
                  >
                    View Services
                  </a>
                </div>
              </div>

              {/* Banner Image */}
              <div className="relative order-first lg:order-last">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={banner?.image || DEFAULT_IMAGES.cleaningHero}
                    width={1200}
                    height={800}
                    alt="Cleaning hero banner"
                    className="object-cover w-full h-80 md:h-[420px]"
                  />
                </div>

                {/* Small Stats */}
                <div className="absolute -bottom-6 left-6 grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-500">Happy Customers</div>
                    <div className="text-xl font-bold">10k+</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-500">Verified Pros</div>
                    <div className="text-xl font-bold">500+</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <div className="text-sm text-gray-500">Avg Rating</div>
                    <div className="text-xl font-bold">4.9 ★</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SERVICES GRID */}
        <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center sm:text-left">
            Our Cleaning Services
          </h2>

          {loading ? (
            <div className="text-center text-gray-500 py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-2xl">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Services Available</h3>
              <p className="text-gray-600 mb-6">Check back later for available cleaning services.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <motion.article
                  key={service._id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4 }}
                  onClick={() => router.push(`/cleaning/${service._id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  {/* Service Image */}
                  <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100">
                    {service.images && service.images.length > 0 ? (
                      <Image
                        src={service.images[0]}
                        alt={service.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BrushCleaning className="w-20 h-20 text-green-500" />
                      </div>
                    )}
                    {service.category && (
                      <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {service.category}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{service.name}</h3>
                    {service.provider && (
                      <p className="text-sm text-gray-500 mb-2">{service.provider.name}</p>
                    )}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {service.description || "Professional cleaning service"}
                    </p>
                    {service.duration && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <Clock className="w-3 h-3" />
                        <span>{service.duration}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-2xl font-bold text-green-600">₹{service.price}</div>
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <div className="rounded-3xl bg-[var(--qleen-green)]/10 p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-extrabold" style={{ color: "var(--qleen-green)" }}>Want a Cleaner Home?</h3>
              <p className="text-gray-700 mt-2">Get notified about new discounts, packages and seasonal offers.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input className="rounded-full px-5 py-3 border w-full md:w-auto outline-none" placeholder="Your email address" />
              <button className="bg-[var(--qleen-green)] text-white px-6 py-3 rounded-full font-semibold">Subscribe</button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-extrabold" style={{ color: "var(--qleen-green)" }}>ServiHub</div>
              <p className="text-sm text-gray-600 mt-3">Your trusted cleaning & home services partner.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Home Deep Cleaning</li>
                <li>Sofa & Carpet</li>
                <li>Kitchen & Bathroom</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Contact</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="mt-3 text-sm text-gray-600">hello@servihub.com</div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 py-6">
            © {new Date().getFullYear()} ServiHub. All rights reserved.
          </div>
        </footer>
      </main>
    </>
  );
}

export default function CleaningPage() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <CleaningPageContent />
    </Suspense>
  );
}
