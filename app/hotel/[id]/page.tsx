"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  MapPin,
  Star,
  Utensils,
  Wifi,
  ParkingCircle,
  Sparkles,
  Waves,
  BedDouble,
  ArrowLeft,
  Calendar,
  Coffee,
  Car,
  Leaf,
  Dumbbell,
  Plane,
  ThumbsUp,
  Gem,
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
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch(`${API_BASE}/api/hotels/${id}`);
        const data = await res.json();
        if (data.success) {
          setHotel(data.hotel);
          // Log images for debugging
          if (process.env.NODE_ENV === 'development') {
            console.log("Hotel images:", data.hotel.images);
          }
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Failed to fetch hotel:", err);
        }
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
    router.push(`/hotel/${id}/book`);
  };

  // Get images array or use placeholder
  const images = hotel.images && hotel.images.length > 0 
    ? hotel.images 
    : ["https://via.placeholder.com/800x600?text=No+Image"];

  // Calculate rating display
  const rating = hotel.rating || 4.5;
  const reviewCount = Math.floor(Math.random() * 2000) + 100;
  const ratingText = rating >= 9 ? "Excellent" : rating >= 8 ? "Very Good" : rating >= 7 ? "Good" : "Fair";

  // Generate star display (5 stars)
  const stars = Math.round(rating / 2); // Convert 10-point scale to 5 stars

  return (
    <>
      <UnifiedHeader />
      <main className="relative min-h-screen bg-white pt-16">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="fixed top-20 left-2 sm:left-4 z-20 bg-white/90 hover:bg-green-50 p-2 sm:p-3 rounded-full shadow-lg border border-green-200"
      >
        <ArrowLeft className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Image Gallery Section */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 pt-4 sm:pt-8 pb-4 sm:pb-6">
        {/* Mobile: Single column carousel */}
        <div className="block md:hidden">
          <div className="relative h-[250px] sm:h-[300px] rounded-lg overflow-hidden shadow-md mb-3">
            {images[selectedImage] && (
              <Image
                src={images[selectedImage]}
                alt={`${hotel.name} - Image ${selectedImage + 1}`}
                fill
                className="object-cover"
                unoptimized={images[selectedImage]?.includes('placeholder')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
                }}
              />
            )}
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
          {/* Thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-md cursor-pointer transition-all ${
                  selectedImage === idx ? 'ring-2 ring-green-500' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={img}
                  alt={`${hotel.name} - Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={img?.includes('placeholder')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[400px] lg:h-[500px] xl:h-[600px]">
          {/* Main large image */}
          <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden shadow-md group">
            {images[selectedImage] && (
              <>
                <Image
                  src={images[selectedImage]}
                  alt={`${hotel.name} - Image ${selectedImage + 1}`}
                  fill
                  className="object-cover cursor-pointer"
                  unoptimized={images[selectedImage]?.includes('placeholder')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://via.placeholder.com/800x600?text=Image+Not+Found";
                  }}
                />
                <button className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowLeft className="text-gray-700 w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail grid - stacked on right */}
          {images.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative rounded-lg overflow-hidden shadow-md cursor-pointer transition-all ${
                selectedImage === idx ? 'ring-4 ring-green-500' : 'hover:opacity-80'
              }`}
            >
              <Image
                src={img}
                alt={`${hotel.name} - Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized={img?.includes('placeholder')}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                }}
              />
              {idx === 2 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold text-lg">
                  {images.length - 3}+
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <nav className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {["Overview", "About", "Rooms", "Accessibility", "Policies"].map((tab) => (
              <button
                key={tab.toLowerCase()}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-3 sm:py-4 px-2 text-xs sm:text-sm md:text-base font-medium border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.toLowerCase()
                    ? "border-green-600 text-green-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookNow}
            className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Select a room</span>
            <span className="sm:hidden">Book Now</span>
          </motion.button>
        </div>
      </section>

      {/* Main Content Section - Two Column Layout */}
      <section className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Hotel Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Hotel Header with Tag, Stars, Name, Rating */}
            <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                <span className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-semibold">
                  Luxury
                </span>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base font-semibold">
                  {rating.toFixed(1)} {ratingText}
                </div>
                <span className="text-gray-700 text-sm sm:text-base font-medium">
                  {reviewCount.toLocaleString()} reviews &gt;
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {hotel.description || "Steps from Darling Harbour, this hotel offers a vibrant city atmosphere with stunning harbour views. Enjoy a delicious buffet breakfast, 24-hour gym, and exceptional concierge services for a truly memorable stay."}
              </p>
              <div className="mt-3 sm:mt-4 text-gray-600">
                <p className="font-medium text-sm sm:text-base">{hotel.location}</p>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs sm:text-sm inline-block mt-1"
                >
                  View in a map &gt;
                </a>
              </div>
            </div>

            {/* Highlights Section */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Highlights</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <Gem className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">Buffet breakfast</p>
                    <p className="text-xs sm:text-sm text-gray-600">Start your day with a delicious buffet breakfast—a rare find in the area.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <ThumbsUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">Easy to get around</p>
                    <p className="text-xs sm:text-sm text-gray-600">Guests love the convenient spot for exploring the area.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 sm:mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-gray-900">Discover nearby landmarks</p>
                    <p className="text-xs sm:text-sm text-gray-600">Close to Hyde Park.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Attractions */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Nearby attractions</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base flex-1 min-w-0">SEA LIFE Sydney Aquarium</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-auto flex-shrink-0">2 min walk</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base flex-1 min-w-0">Pitt Street Mall</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-auto flex-shrink-0">5 min walk</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base flex-1 min-w-0">King Street Wharf</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-auto flex-shrink-0">5 min walk</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Plane className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base flex-1 min-w-0 truncate">Sydney, NSW (SYD-Kingsford Smith Intl.)</span>
                  <span className="text-gray-500 text-xs sm:text-sm ml-auto flex-shrink-0">12 min drive</span>
                </div>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs sm:text-sm mt-2 inline-block"
              >
                See all about this area &gt;
              </a>
            </div>

            {/* About This Property */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">About this property</h3>
              <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">Waterfront hotel with bars/lounges and fitness centre</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {hotel.amenities && hotel.amenities.length > 0 ? (
                  hotel.amenities.map((a: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3">
                      {getAmenityIcon(a)}
                      <span className="text-gray-700 text-sm sm:text-base capitalize">{a}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Coffee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Buffet breakfast available</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Utensils className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Restaurant</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Free Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Car className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Limo or town car service available</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">Aromatherapy treatments in spa</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 text-sm sm:text-base">On-site fitness centre</span>
                    </div>
                  </>
                )}
              </div>
              <a href="#" className="text-blue-600 hover:underline text-xs sm:text-sm mt-3 sm:mt-4 inline-block">
                See all about this property &gt;
              </a>
            </div>
          </div>

          {/* Right Column - Explore the Area */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Explore the area</h3>
              {/* Map Container */}
              <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] bg-gray-200 rounded-lg mb-3 sm:mb-4 overflow-hidden relative">
                {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(hotel.location)}`}
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-4">
                      <MapPin className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-xs sm:text-sm">Map view available</p>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs sm:text-sm mt-2 inline-block"
                      >
                        View on Google Maps &gt;
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-sm sm:text-base mb-2">{hotel.location}</p>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs sm:text-sm"
              >
                View in a map &gt;
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}

/* Amenity icons mapper */
function getAmenityIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("wifi") || n.includes("internet")) return <Wifi className="w-5 h-5 text-green-600" />;
  if (n.includes("pool") || n.includes("swimming")) return <Waves className="w-5 h-5 text-green-600" />;
  if (n.includes("parking")) return <ParkingCircle className="w-5 h-5 text-green-600" />;
  if (n.includes("food") || n.includes("restaurant") || n.includes("breakfast")) return <Utensils className="w-5 h-5 text-green-600" />;
  if (n.includes("bed") || n.includes("room")) return <BedDouble className="w-5 h-5 text-green-600" />;
  if (n.includes("coffee") || n.includes("cafe")) return <Coffee className="w-5 h-5 text-green-600" />;
  if (n.includes("car") || n.includes("transport") || n.includes("limo")) return <Car className="w-5 h-5 text-green-600" />;
  if (n.includes("spa") || n.includes("aromatherapy") || n.includes("massage")) return <Leaf className="w-5 h-5 text-green-600" />;
  if (n.includes("gym") || n.includes("fitness") || n.includes("workout")) return <Dumbbell className="w-5 h-5 text-green-600" />;
  return <Sparkles className="w-5 h-5 text-green-600" />;
}

export default function HotelSingle() {
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <HotelSingleContent />
    </Suspense>
  );
}
