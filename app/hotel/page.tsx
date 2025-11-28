"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Search, 
  Calendar, 
  Users, 
  Star, 
  X,
  ArrowRight,
  Sparkles,
  MapPin,
  Filter,
  ArrowUpDown
} from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";
import { DEFAULT_IMAGES } from "@/lib/cloudinary";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  price: number;
  capacity: number;
  rating?: number;
  amenities?: string[];
  images?: string[];
  provider?: {
    _id: string;
    name: string;
    logo?: string;
  };
}

interface Provider {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  rating?: number;
}

const commonAmenities = ["WiFi", "AC", "Parking", "Restaurant", "Pool", "Gym", "Spa", "Breakfast", "Room Service"];

function HotelPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams?.get("provider");

  // Search form state
  const [location, setLocation] = useState("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState(2);

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [minRating, setMinRating] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "rating" | "name">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Data state
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  // Fetch provider data
  useEffect(() => {
    async function fetchProvider() {
      if (!providerId) {
        setSelectedProvider(null);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/providers/${providerId}`);
        const data = await res.json();
        if (data.success && data.provider) {
          setSelectedProvider(data.provider);
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch provider:", err);
        }
      }
    }
    fetchProvider();
  }, [providerId]);

  // Fetch hotels with filters
  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (providerId) params.append("providerId", providerId);
        if (location) params.append("location", location);
        if (minPrice) params.append("minPrice", minPrice);
        if (maxPrice) params.append("maxPrice", maxPrice);
        if (guests) params.append("capacity", String(guests));
        if (selectedAmenities.length > 0) {
          selectedAmenities.forEach(amenity => params.append("amenities", amenity));
        }
        if (minRating) params.append("rating", minRating);
        if (sortBy) params.append("sortBy", sortBy);
        if (sortOrder) params.append("sortOrder", sortOrder);

        const res = await fetch(`${API_BASE}/api/hotels?${params.toString()}`);
        const data: { success: boolean; hotels: Hotel[] } = await res.json();
        if (data.success) setHotels(data.hotels);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch hotels", err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, [providerId, location, minPrice, maxPrice, guests, selectedAmenities, minRating, sortBy, sortOrder]);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedAmenities([]);
    setMinRating("");
    setLocation("");
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters are already applied via useEffect
  };

  return (
    <>
      <UnifiedHeader />
      <main className="min-h-screen text-slate-900 antialiased bg-gradient-to-b from-blue-50 to-sky-100 relative overflow-hidden pt-16">
        {/* Provider Banner */}
        {providerId && selectedProvider && (
          <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 shadow-lg border-2 border-blue-200">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {selectedProvider.logo ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow">
                      <Image
                        src={selectedProvider.logo}
                        alt={selectedProvider.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-sky-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow">
                      {selectedProvider.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Hotels from {selectedProvider.name}</h3>
                    {selectedProvider.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedProvider.description}</p>
                    )}
                    {selectedProvider.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{selectedProvider.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => router.push("/hotel")}
                  className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Change Provider
                </button>
              </div>
            </div>
          </section>
        )}

        {!providerId && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-sky-50 rounded-3xl border-2 border-dashed border-blue-200">
              <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3 text-gray-800">No Provider Selected</h2>
              <p className="text-gray-600 mb-6">Please select a service provider from the home page to view their hotels.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Choose Provider <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {providerId && !selectedProvider && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading provider information...</p>
            </div>
          </section>
        )}

        {providerId && selectedProvider && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-sky-100">
              <div className="relative h-[600px] sm:h-[700px] w-full">
                <Image
                  src={DEFAULT_IMAGES.hotelHero}
                  alt="Hotel Hero"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-sky-800/20 backdrop-blur-[1px]" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white z-20 px-4">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl"
                >
                  Discover Your Next <br />
                  <span className="text-sky-300">Perfect Stay</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1 }}
                  className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-100 max-w-2xl mx-auto"
                >
                  Explore top-rated hotels and curated experiences for your perfect stay.
                </motion.p>

                <motion.form
                  onSubmit={onSearch}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="mt-6 sm:mt-10 bg-white/90 backdrop-blur-md border border-blue/80 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 sm:gap-4 p-4 sm:p-6 justify-center z-30 max-w-5xl mx-auto w-full"
                >
                  <div className="flex items-center gap-2 sm:gap-3 border rounded-full px-3 sm:px-4 py-2 sm:py-3 flex-1 bg-white">
                    <Search className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Where to?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full outline-none text-xs sm:text-sm text-black font-medium bg-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 border rounded-full px-3 sm:px-4 py-2 sm:py-3 bg-white">
                    <Calendar className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <input
                      type="date"
                      value={checkin}
                      onChange={(e) => setCheckin(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="outline-none text-xs sm:text-sm text-black font-medium bg-transparent w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 border rounded-full px-3 sm:px-4 py-2 sm:py-3 bg-white">
                    <Calendar className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <input
                      type="date"
                      value={checkout}
                      onChange={(e) => setCheckout(e.target.value)}
                      min={checkin || new Date().toISOString().split('T')[0]}
                      className="outline-none text-xs sm:text-sm text-black font-medium bg-transparent w-full"
                    />
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 border rounded-full px-3 sm:px-4 py-2 sm:py-3 bg-white">
                    <Users className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="outline-none text-xs sm:text-sm text-black font-medium bg-transparent w-full"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-sky-600 hover:to-blue-700 text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105 text-xs sm:text-sm md:text-base whitespace-nowrap"
                  >
                    Search
                  </button>
                </motion.form>
              </div>
            </section>

            {/* FILTERS AND SORT SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-4 flex-wrap">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                    {(minPrice || maxPrice || selectedAmenities.length > 0 || minRating) && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {[minPrice, maxPrice, selectedAmenities.length, minRating].filter(Boolean).length}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-500" />
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [by, order] = e.target.value.split("-");
                        setSortBy(by as "price" | "rating" | "name");
                        setSortOrder(order as "asc" | "desc");
                      }}
                      className="px-3 py-2 bg-white rounded-lg shadow-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating-desc">Rating: High to Low</option>
                      <option value="rating-asc">Rating: Low to High</option>
                      <option value="name-asc">Name: A to Z</option>
                      <option value="name-desc">Name: Z to A</option>
                    </select>
                  </div>

                  {(minPrice || maxPrice || selectedAmenities.length > 0 || minRating) && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  {loading ? "Loading..." : `${hotels.length} ${hotels.length === 1 ? 'hotel' : 'hotels'} found`}
                </div>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Price Range */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Price Range (₹/night)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Rating</label>
                      <select
                        value={minRating}
                        onChange={(e) => setMinRating(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Any Rating</option>
                        <option value="4.5">4.5+ ⭐</option>
                        <option value="4.0">4.0+ ⭐</option>
                        <option value="3.5">3.5+ ⭐</option>
                        <option value="3.0">3.0+ ⭐</option>
                      </select>
                    </div>

                    {/* Capacity */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Guests</label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Amenities</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {commonAmenities.map((amenity) => (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedAmenities.includes(amenity)
                              ? "bg-blue-500 text-white shadow-md"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </section>

            {/* HOTEL LIST */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading hotels...</p>
                </div>
              ) : hotels.length === 0 ? (
                <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl border-2 border-dashed border-gray-300">
                  <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-3 text-gray-800">No Hotels Found</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search criteria to find more hotels.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel, i) => (
                    <motion.div
                      key={hotel._id || i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
                    >
                      <Link href={`/hotel/${hotel._id}?provider=${providerId || ''}`} className="block w-full h-full">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={hotel.images?.[0] || DEFAULT_IMAGES.hotelPlaceholder}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {hotel.rating && (
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm font-semibold">{hotel.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-lg text-slate-800 group-hover:text-sky-600 transition mb-1">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span>{hotel.location}</span>
                          </div>
                          {hotel.description && (
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                              {hotel.description}
                            </p>
                          )}
                          {hotel.amenities && hotel.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                                >
                                  {amenity}
                                </span>
                              ))}
                              {hotel.amenities.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                                  +{hotel.amenities.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <p className="text-2xl font-bold text-sky-600">₹{hotel.price}</p>
                              <p className="text-xs text-gray-500">per night</p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{hotel.capacity} {hotel.capacity === 1 ? 'guest' : 'guests'}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}

export default function HotelPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
      <HotelPageContent />
    </Suspense>
  );
}
