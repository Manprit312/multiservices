"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Calendar, Users } from "lucide-react";
import Header from "@/components/HotelHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ✅ Hotel type
interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  price: number;
  images?: string[];
}

export default function HotelPage() {
  const router = useRouter();

  // ✅ Search form state (now used)
  const [location, setLocation] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);

  // ✅ Properly typed
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch hotels from API
  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch(`${API_BASE}/api/hotels`);
        const data: { success: boolean; hotels: Hotel[] } = await res.json();
        if (data.success) setHotels(data.hotels);
      } catch (err) {
        console.error("Failed to fetch hotels", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  // ✅ Use this on the form
  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({
      location: location || "",
      checkin: checkin || "",
      checkout: checkout || "",
      guests: String(guests),
    }).toString();
    router.push(`/hotel/search?${q}`);
  }

  return (
    <>
      <Header />
      <main className="min-h-screen text-slate-900 antialiased bg-gradient-to-b from-blue-50 to-sky-100 relative overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-sky-100">
          {/* Background */}
          <div className="relative h-[800px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80"
              alt="Hotel Hero"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-sky-800/20 backdrop-blur-[1px]" />
          </div>

          {/* HERO CONTENT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-xl"
            >
              Discover Your Next <br />
              <span className="text-sky-300">Handpicked Journey</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mt-4 text-lg text-slate-100 max-w-2xl mx-auto"
            >
              Explore top-rated hotels and curated experiences for your perfect stay.
            </motion.p>

            {/* ✅ Attach onSearch here */}
            <motion.form
              onSubmit={onSearch}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 bg-white/50 backdrop-blur-md border border-blue/80 rounded-full shadow-2xl flex flex-col md:flex-row gap-4 p-4 md:p-6 justify-center z-30"
            >
              {/* Location */}
              <div className="flex items-center gap-3 border rounded-full px-4 py-3 flex-1 bg-white/90">
                <Search className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Where to?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none text-sm text-black font-medium bg-transparent"
                />
              </div>

              {/* Check-in */}
              <div className="flex items-center gap-3 border rounded-full px-4 py-3 bg-white/90">
                <Calendar className="text-slate-400" />
                <input
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="outline-none text-sm text-black font-medium bg-transparent"
                />
              </div>

              {/* Check-out */}
              <div className="flex items-center gap-3 border rounded-full px-4 py-3 bg-white/90">
                <Calendar className="text-slate-400" />
                <input
                  type="date"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className="outline-none text-sm text-black font-medium bg-transparent"
                />
              </div>

              {/* Guests */}
              <div className="flex items-center gap-3 border rounded-full px-4 py-3 bg-white/90">
                <Users className="text-slate-400" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="outline-none text-sm text-black font-medium bg-transparent"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} Guests
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-sky-600 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105"
              >
                Search
              </button>
            </motion.form>
          </div>
        </section>

        {/* HOTEL LIST */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-extrabold mb-8 text-slate-800">Our Top Locations</h2>

          {loading ? (
            <p className="text-center text-slate-500">Loading hotels...</p>
          ) : hotels.length === 0 ? (
            <p className="text-center text-slate-500">No hotels found.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {hotels.map((hotel, i) => (
                <motion.div
                  key={hotel._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition relative cursor-pointer group"
                >
                  <Link href={`/hotel/${hotel._id}`} className="block w-full h-full">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={hotel.images?.[0] || "/default-hotel.jpg"}
                        alt={hotel.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-slate-800 group-hover:text-sky-600 transition">
                        {hotel.name}
                      </h3>
                      <p className="text-sm text-slate-600">{hotel.location}</p>
                      <p className="text-sm text-slate-600">
                        {hotel.description?.substring(0, 100) + "..."}
                      </p>
                      <p className="mt-2 text-sky-600 font-semibold">
                        ${hotel.price} / night
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
