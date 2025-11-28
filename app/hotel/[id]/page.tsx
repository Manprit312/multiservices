"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Users,
  Star,
  Utensils,
  Wifi,
  ParkingCircle,
  Sparkles,
  Waves,
  BedDouble,
  ArrowLeft,
  Calendar,
} from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";
interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  price: number;
  rating?: number;
  capacity?: number;
  outsideFoodAllowed?: boolean;
  amenities?: string[];
  images?: string[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function HotelSingleContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams?.get("provider");
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch(`${API_BASE}/api/hotels/${id}`);
        const data = await res.json();
        if (data.success) setHotel(data.hotel);
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotel();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Loading hotel details...
      </div>
    );

  if (!hotel)
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Hotel not found
      </div>
    );

  const handleBookNow = () => {
    const url = providerId
      ? `/hotel/${id}/book?provider=${providerId}`
      : `/hotel/${id}/book`;
    router.push(url);
  };

  return (
    <>
      <UnifiedHeader />
      <main className="relative min-h-screen bg-gradient-to-b from-blue-50 via-white to-sky-100 overflow-hidden pt-16">
      {/* Floating Decorative Icons */}
      <motion.div
        className="absolute top-20 left-10 text-sky-300 opacity-50"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Sparkles size={36} />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-blue-400 opacity-40"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <Waves size={48} />
      </motion.div>

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 bg-white/80 hover:bg-sky-100 p-3 rounded-full shadow-md"
      >
        <ArrowLeft className="text-sky-600" />
      </button>

      {/* Hero Section */}
      <section className="relative h-[70vh] w-full">
        <Image
          src={hotel.images?.[0] || "/placeholder-hotel.jpg"}
          alt={hotel.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        <div className="absolute bottom-16 left-10 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold mb-3"
          >
            {hotel.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-lg"
          >
            <MapPin className="text-sky-300" /> {hotel.location}
          </motion.p>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-10">
        {/* Top Summary */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            <h2 className="text-3xl font-bold text-slate-800">
              About the Hotel
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {hotel.description || "No description available."}
            </p>

            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-sky-600 font-medium">
                <Users size={18} /> {hotel.capacity} Guests
              </div>
              <div className="flex items-center gap-2 text-sky-600 font-medium">
                <Star size={18} /> {hotel.rating || "4.5"} ★
              </div>
            </div>
          </motion.div>

          {/* Image Preview Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-4"
          >
            {hotel.images?.slice(0, 4).map((img: string, i: number) => (
              <Image
                key={i}
                src={img}
                alt={`Preview ${i}`}
                width={300}
                height={200}
                className="rounded-xl object-cover shadow-md hover:scale-105 transition-transform"
              />
            ))}
          </motion.div>
        </div>

        {/* Amenities */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">
            Amenities
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {hotel.amenities?.length ? (
              hotel.amenities.map((a: string, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-lg transition"
                >
                  {getAmenityIcon(a)}
                  <span className="capitalize text-slate-700 font-medium">
                    {a}
                  </span>
                </motion.div>
              ))
            ) : (
              <p className="text-slate-500">No amenities listed.</p>
            )}
          </div>
        </div>

        {/* Food Policy */}
        <div className="mt-12 bg-gradient-to-r from-sky-50 to-blue-50 p-6 rounded-2xl border border-sky-100">
          <h3 className="text-xl font-semibold text-slate-800 mb-3">
            Food Policy
          </h3>
          <p className="text-slate-700">
            {hotel.outsideFoodAllowed
              ? "✅ Outside food is allowed in this property."
              : "❌ Outside food is not allowed."}
          </p>
        </div>

        {/* Price and CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6 bg-white shadow-xl rounded-2xl p-8 border border-sky-100"
        >
          <div>
            <p className="text-2xl font-bold text-sky-700">
              ${hotel.price} / night
            </p>
            <p className="text-slate-600 text-sm mt-1">
              Includes all amenities and taxes.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookNow}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Now
          </motion.button>
        </motion.div>
      </section>
    </main>
    </>
  );
}

/* Amenity icons mapper */
function getAmenityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("wifi")) return <Wifi className="text-sky-500" />;
  if (n.includes("pool")) return <Waves className="text-sky-500" />;
  if (n.includes("parking")) return <ParkingCircle className="text-sky-500" />;
  if (n.includes("food")) return <Utensils className="text-sky-500" />;
  if (n.includes("bed")) return <BedDouble className="text-sky-500" />;
  return <Sparkles className="text-sky-500" />;
}

export default function HotelSingle() {
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <HotelSingleContent />
    </Suspense>
  );
}
