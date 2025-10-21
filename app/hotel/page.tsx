"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Calendar, Users, Star } from "lucide-react";

const PRIMARY = "bg-gradient-to-r from-[#0091B6] to-[#00C3D9]";

const topLocations = [
  {
    title: "Tropical Paradise Resort",
    location: "Goa, India",
    price: "$129 / night",
    img: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2109d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Oceanview Beach Hotel",
    location: "Maldives",
    price: "$299 / night",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "City Center Suites",
    location: "New York, USA",
    price: "$199 / night",
    img: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=1200&q=80",
  },
];

const testimonials = [
  {
    name: "Sophie Lee",
    text: "Amazing stay, the staff were super helpful and the pool area was dreamy.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Michael Brown",
    text: "Comfortable rooms and excellent breakfast. Highly recommend.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Ayesha Khan",
    text: "Perfect weekend getaway — everything was flawless.",
    avatar: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=200&q=80",
  },
];

const articles = [
  {
    title: "Top 10 Luxury Hotels Around the World",
    img: "https://images.unsplash.com/photo-1590077428593-2fda9d91d7ef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "How to Get the Best Travel Deals This Season",
    img: "https://images.unsplash.com/photo-1502920917128-1aa500764b43?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "5 Hidden Gem Resorts You Must Visit",
    img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function HotelPage() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);

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
    <main className="min-h-screen text-slate-900 antialiased">
      {/* HERO */}
      <section className="relative">
        <div className="relative h-[520px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2000&q=80"
            alt="Hotel Hero"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-6 text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight"
            >
              Discover Your Next <br />
              <span className="text-sky-200">Handpicked Journey</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-4 text-lg max-w-3xl mx-auto text-slate-100"
            >
              Explore top-rated hotels and curated experiences for your perfect stay.
            </motion.p>

            {/* Search Form */}
            <motion.form
              onSubmit={onSearch}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8 bg-white rounded-3xl shadow-xl flex flex-col md:flex-row gap-4 p-4 md:p-6 justify-center"
            >
              <div className="flex items-center gap-3 border rounded-full px-4 py-3 flex-1">
                <Search className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full outline-none text-sm text-black"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 border rounded-full px-4 py-3">
                <Calendar className="text-slate-400" />
                <input
                  type="date"
                  value={checkin}
                  onChange={(e) => setCheckin(e.target.value)}
                  className="outline-none text-sm text-black"
                />
              </div>
              <div className="flex items-center gap-3 border rounded-full px-4 py-3">
                <Calendar className="text-slate-400" />
                <input
                  type="date"
                  value={checkout}
                  onChange={(e) => setCheckout(e.target.value)}
                  className="outline-none text-sm text-black"
                />
              </div>
              <div className="flex items-center gap-3 border rounded-full px-4 py-3">
                <Users className="text-slate-400 " />
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="outline-none text-sm text-black"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n}>{n} Guests</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-full font-semibold"
              >
                Search
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* TOP LOCATIONS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-8">Our Top Locations</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {topLocations.map((hotel, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative h-56">
                <Image
                  src={hotel.img}
                  alt={hotel.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg">{hotel.title}</h3>
                <p className="text-sm text-slate-600">{hotel.location}</p>
                <p className="mt-2 text-sky-600 font-semibold">{hotel.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-extrabold mb-4">Get The Best Travel Experience</h2>
          <p className="text-slate-600 mb-6">
            Enjoy luxury stays and unforgettable experiences, handpicked for your comfort.
          </p>
          <ul className="space-y-3 text-slate-700">
            <li>✔ Verified partners and trusted hosts</li>
            <li>✔ Seamless booking and 24/7 support</li>
          </ul>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1578894381169-fb9b8405e2d1?auto=format&fit=crop&w=1200&q=80"
            alt="Travel Experience"
            width={600}
            height={400}
            className="object-cover"
          />
        </div>
      </section>

      {/* ARTICLES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-extrabold mb-6">Latest News & Articles</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <div className="relative h-44">
                <Image src={a.img} alt={a.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold mb-2">{a.title}</h3>
                <p className="text-sm text-slate-600">Discover amazing destinations with our travel experts.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-extrabold">Turmet</h3>
            <p className="text-slate-300 mt-3">
              Your travel companion for unforgettable journeys.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="text-slate-300 text-sm space-y-2">
              <li>About</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <div className="flex gap-2">
              <input
                placeholder="Your email"
                className="rounded-full px-4 py-2 text-slate-800"
              />
              <button className="bg-sky-600 px-4 py-2 rounded-full font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="text-center text-slate-400 mt-10 border-t border-slate-800 pt-6 text-sm">
          © {new Date().getFullYear()} Turmet — All rights reserved.
        </div>
      </footer>
    </main>
  );
}
