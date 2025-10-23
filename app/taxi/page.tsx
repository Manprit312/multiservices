"use client";

import React, { useState} from "react";
import { MapPin, Calendar, ArrowRight,X,Bike, Car, Star, Circle, Triangle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation,Truck, Menu ,Facebook,Twitter,Instagram} from "lucide-react";
export default function TaxiPage() {
  const [pickup, setPickup] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

  const [drop, setDrop] = useState("");
  const [when, setWhen] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<{ ok: boolean; message?: string; fare?: number } | null>(null);
 const services = [
    {
      name: "Bike Taxi",
      desc: "Quick and cheap rides for solo travellers.",
      icon: <Bike className="w-8 h-8 text-yellow-500" />,
    },
    {
      name: "Auto",
      desc: "Affordable rides for short distances.",
      icon: <Truck className="w-8 h-8 text-yellow-500" />,
    },
    {
      name: "Cab",
      desc: "Comfortable cabs for long routes.",
      icon: <Car className="w-8 h-8 text-yellow-500" />,
    },
  ];
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResp(null);

    if (!pickup.trim() || !drop.trim()) {
      setResp({ ok: false, message: "Please enter both pickup and drop locations." });
      return;
    }

    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/book-ride`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, drop, when }),
      });
      const data = await r.json();
      setResp(data);
    } catch (err) {
      console.error(err);
      setResp({ ok: false, message: "Something went wrong. Try again!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-900 bg-gradient-to-b from-yellow-50 to-white">
 <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2 text-yellow-500 font-bold text-xl">
          <Navigation className="w-5 h-5" />
          <Link href="/" className="hover:text-yellow-600">
            RapidoGo
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <a href="#book" className="hover:text-yellow-500">Book Ride</a>
          <a href="#services" className="hover:text-yellow-500">Services</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-full border border-gray-300"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-gray-700" />
          ) : (
            <Menu className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
          >
            <nav className="flex flex-col items-center gap-4 py-6 text-gray-700 font-medium">
              <a
                href="#book"
                className="hover:text-yellow-500"
                onClick={() => setMobileOpen(false)}
              >
                Book Ride
              </a>
              <a
                href="#services"
                className="hover:text-yellow-500"
                onClick={() => setMobileOpen(false)}
              >
                Services
              </a>
              {/* <a
                href="#earn"
                className="hover:text-yellow-500"
                onClick={() => setMobileOpen(false)}
              >
                Earn
              </a>
              <a
                href="#contact"
                className="hover:text-yellow-500"
                onClick={() => setMobileOpen(false)}
              >
                Contact
              </a> */}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
      {/* Floating icons */}
      <motion.div
        className="absolute top-20 left-10 text-yellow-400"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >
        <Star className="w-6 h-6" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-10 text-yellow-300"
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >
        <Triangle className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-1/2 text-yellow-400"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        <Circle className="w-5 h-5" />
      </motion.div>

      {/* Hero section */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1508170069958-96f0dcf7c5f1?auto=format&fit=crop&w=2000&q=80')",
            filter: "grayscale(4%)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Bharat Moves On Rapido!
            </h1>
            <p className="mt-4 text-gray-700 max-w-2xl mx-auto">
              Book quick and affordable rides — bike, auto or cab — in a tap.
            </p>
          </motion.div>

          {/* Booking form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mt-10 max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-8"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white rounded-full border px-4 py-3">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <input
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter Pickup Location"
                  className="outline-none w-full text-sm"
                />
              </div>

              <div className="flex items-center gap-3 bg-white rounded-full border px-4 py-3">
                <MapPin className="w-5 h-5 text-yellow-500" />
                <input
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                  placeholder="Enter Drop Location"
                  className="outline-none w-full text-sm"
                />
              </div>

              <div className="flex items-center gap-3 bg-white rounded-full border px-4 py-3">
                <Calendar className="w-5 h-5 text-yellow-500" />
                <input
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  type="datetime-local"
                  className="outline-none w-full text-sm"
                />
              </div>

              <div className="text-center mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-full px-12 py-4 shadow transition-all"
                >
                  {loading ? "Booking..." : "Book Ride"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {resp && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`mt-4 text-sm font-medium text-center ${
                    resp.ok
                      ? "text-green-700 bg-green-50 rounded-lg p-3"
                      : "text-red-700 bg-red-50 rounded-lg p-3"
                  }`}
                >
                  <div>{resp.message}</div>
                  {resp.ok && typeof resp.fare === "number" && (
                    <div className="mt-2 font-extrabold">Estimated fare: ₹{resp.fare}</div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.form>
        </div>

        {/* Decorative Waves */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 text-yellow-400">
            <path
              d="M0,0 C300,100 900,0 1200,80 L1200,120 L0,120 Z"
              fill="currentColor"
              opacity="0.3"
            />
          </svg>
        </div>
      </section>
        <section id="services" className="py-16 bg-white text-center">
      <h2 className="text-3xl font-extrabold mb-10">Our Services</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
        {services.map((s) => (
          <div key={s.name} className="bg-yellow-50 rounded-xl p-6 shadow hover:shadow-lg transition">
            <div className="flex justify-center mb-4">{s.icon}</div>
            <h3 className="font-bold text-lg">{s.name}</h3>
            <p className="text-sm text-gray-600 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
     <footer className="bg-yellow-400 text-black py-10 text-center mt-12">
      <h3 className="font-bold text-lg mb-4">Follow Us</h3>
      <div className="flex justify-center gap-4 mb-4">
        <Facebook />
        <Twitter />
        <Instagram />
      </div>
      <p className="text-sm">© {new Date().getFullYear()} RapidoGo. All rights reserved.</p>
    </footer>
    </div>
  );
}
