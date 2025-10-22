"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  CheckCircle,
  Phone,
  ArrowRight,
  Sparkles,
  Star,
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
}
import CleaningHeader from "@/components/CleaningHeader";
import CleaningCostCalculator from "@/components/Calculator";

const PRIMARY_GREEN = "#2f9b57";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CleaningPage() {
  const [form, setForm] = useState({
    service: "home-deep",
    date: "",
    location: "",
    hours: 2,
  });

 
  const [loading, setLoading] = useState(true);
const [banner, setBanner] = useState<CleaningBanner | null>(null);
const [services, setServices] = useState<CleaningService[]>([]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${API_BASE}/api/cleaning`);
        const data = await res.json();
        if (data.success) {
          setServices(data.cleanings);
        } else {
          setServices([]);
        }
      } catch (err) {
        console.error("Failed to fetch services:", err);
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
        console.error("Failed to fetch banner:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBanner();
  }, []);

  const prices: Record<string, number> = {
    "home-deep": 999,
    kitchen: 499,
    bathroom: 399,
    carpet: 799,
    office: 1499,
  };

  const computedPrice =
    (prices[form.service] || 999) * Math.max(1, Math.min(8, form.hours));


  return (
    <>
      <CleaningHeader />
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
                    src={
                      banner?.image ||
                      "https://images.unsplash.com/photo-1581574209861-8b8a1f52e7c0?auto=format&fit=crop&w=1600&q=80"
                    }
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

        {/* FEATURE + CALCULATOR ROW */}
        <section id="booking" className="max-w-7xl mx-auto px-6 lg:px-8 -mt-6 mb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left column: 3 feature tiles stacked like the screenshot */}
            <div className="space-y-6">
              {[
                {
                  id: 1,
                  title: "Cost Calculator Plugin Included",
                  desc: "Instant price estimates, customizable packages, clear breakdown.",
                  color: "bg-green-600/10 border-green-200",
                },
                {
                  id: 2,
                  title: "Price Table Options",
                  desc: "Flexible pricing tables for different services and durations.",
                  color: "bg-green-600/10 border-green-200",
                },
                {
                  id: 3,
                  title: "Showcase Your Services",
                  desc: "Beautiful service cards, galleries, and booking CTAs.",
                  color: "bg-green-600/10 border-green-200",
                },
              ].map((f) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: f.id * 0.08 }}
                  className={`rounded-2xl p-6 border-l-8 ${f.color} shadow-sm relative overflow-hidden`}
                  style={{ borderLeftColor: "var(--qleen-green)" }}
                >
                  <div className="absolute top-4 right-6 text-7xl font-black text-gray-100/40 select-none">{f.id.toString().padStart(2, "0")}</div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 rounded-md bg-[var(--qleen-green)]/10 text-[var(--qleen-green)]">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg">{f.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{f.desc}</p>
                      <div className="mt-4">
                        <a className="inline-flex items-center gap-2 text-[var(--qleen-green)] font-semibold" href="#calculator">
                          Learn More
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Middle column: cost calculator / booking box (prominent) */}
            <div className="lg:col-span-1">
              <motion.div
                id="calculator"
                initial={{ scale: 0.98, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35 }}
                className="bg-white rounded-3xl shadow-2xl p-8 "
              >
                <h3 className="text-2xl font-extrabold mb-4">Get Instant Quote</h3>
                <p className="text-sm text-gray-600 mb-6">Choose service, date, and location to see the estimated price.</p>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Service</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="mt-2 w-full rounded-full border px-4 py-3 outline-none"
                    >
                      <option value="home-deep">Home Deep Cleaning</option>
                      <option value="kitchen">Kitchen Cleaning</option>
                      <option value="bathroom">Bathroom Cleaning</option>
                      <option value="carpet">Sofa & Carpet</option>
                      <option value="office">Office Cleaning</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <div className="mt-2 flex items-center gap-2">
                      <Calendar className="text-gray-400" />
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full rounded-full border px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-2 flex items-center gap-2">
                      <MapPin className="text-gray-400" />
                      <input
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="City / Locality"
                        className="w-full rounded-full border px-4 py-3 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Hours / Team</label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={form.hours}
                      onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })}
                      className="mt-2 w-full rounded-full border px-4 py-3 outline-none"
                    />
                  </div>

                  <div className="pt-2 border-t mt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-500">Estimated Price</div>
                        <div className="text-2xl font-extrabold" style={{ color: "var(--qleen-green)" }}>
                          ₹{computedPrice.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <button
                          className="inline-flex items-center gap-2 bg-[var(--qleen-green)] text-white px-6 py-3 rounded-full font-semibold shadow"
                          onClick={() => alert(`Booked ${form.service} on ${form.date} at ${form.location}`)}
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="text-[var(--qleen-green)]" />
                    <span>Verified Professionals</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="text-yellow-400" />
                    <span>Trustpilot rating: 4.9</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right column: service showcase / grid preview */}
            <div className="space-y-6">
              <div className="rounded-2xl p-6 bg-white shadow">
                <h4 className="font-bold text-lg mb-2">Featured Packages</h4>
                <p className="text-sm text-gray-600">Quick, value-packed packages designed for busy homes.</p>

                <div className="mt-6 grid gap-4">
                  {services.map((t) =>
                    <div className="flex items-center justify-between bg-emerald-50 rounded-xl p-4"  key={t._id}>
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-sm text-gray-600">{t.duration} hours</div>
                      </div>
                      <div className="text-[var(--qleen-green)] font-bold">{t.price}</div>
                    </div>
                  )
                  }
                </div>
              </div>

              <div className="rounded-2xl p-6 bg-white shadow">
                <h4 className="font-bold text-lg mb-3">Why our customers love us</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Background-checked staff</li>
                  <li>✓ Eco-friendly supplies</li>
                  <li>✓ On-time service</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="max-w-7xl mx-auto px-6 lg:px-8 pb-20">
          <h2 className="text-3xl font-extrabold mb-6 text-gray-900">Our Services</h2>

          {loading ? (
            <div className="text-center text-gray-500 py-10">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-center text-gray-500 py-10">No cleaning services available.</div>
          ) : (
            <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
              {services.map((service, i) => (
                <motion.article
                  key={service._id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-all"
                >
                  {/* Service Image */}
                  <div className="relative h-48">
                    <Image
                      src={service.images?.[0] || "/default-service.jpg"}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {service.description || "No description provided."}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-[var(--qleen-green)] font-bold">
                        From ₹{service.price}
                      </div>
                      <a
                        href="#calculator"
                        className="text-[var(--qleen-green)] font-semibold hover:underline"
                      >
                        Get Quote
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* INNER PAGES / PREVIEWS — showcase grid like the theme */}
        <CleaningCostCalculator />

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
