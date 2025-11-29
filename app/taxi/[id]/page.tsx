"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  ArrowLeft,
  Car,
  Navigation,
} from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface RideService {
  _id: string;
  pickup: string;
  drop: string;
  vehicleType?: string;
  fare: number;
  distance?: number;
  when?: string;
  provider?: {
    _id: string;
    name: string;
    logo?: string;
  };
}

function TaxiDetailContent() {
  const params = useParams();
  const router = useRouter();
  const rideId = params?.id as string;

  const [ride, setRide] = useState<RideService | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    pickup: "",
    drop: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
  });

  const vehicleTypes = {
    cab: { name: "Cab", icon: Car, color: "from-yellow-500 to-orange-500" },
    auto: { name: "Auto Rickshaw", icon: Car, color: "from-yellow-400 to-yellow-600" },
    bike: { name: "Bike", icon: Car, color: "from-orange-400 to-red-500" },
  };

  useEffect(() => {
    async function fetchRide() {
      if (!rideId) return;
      try {
        const res = await fetch(`${API_BASE}/api/book-ride/${rideId}`);
        const data = await res.json();
        if (data.success && data.ride) {
          setRide(data.ride);
          // Pre-fill booking form with ride data
          setBookingData({
            ...bookingData,
            pickup: data.ride.pickup || "",
            drop: data.ride.drop || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch ride:", err);
        // Fallback: create a basic ride object
        setRide({
          _id: rideId,
          pickup: "",
          drop: "",
          vehicleType: "cab",
          fare: 300,
          distance: 10,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchRide();
  }, [rideId]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.pickup || !bookingData.drop || !bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone) {
      return;
    }

    // Store booking data for payment page
    const rideBookingData = {
      pickup: bookingData.pickup,
      drop: bookingData.drop,
      date: bookingData.date,
      time: bookingData.time,
      name: bookingData.name,
      phone: bookingData.phone,
      email: bookingData.email,
      vehicleType: ride?.vehicleType || "cab",
      vehicleName: vehicleTypes[ride?.vehicleType as keyof typeof vehicleTypes]?.name || "Cab",
      fare: ride?.fare || 300,
      distance: ride?.distance || 10,
      rideId: ride?._id || rideId,
      providerId: ride?.provider?._id || "",
    };
    
    try {
      localStorage.setItem("ride_booking_data", JSON.stringify(rideBookingData));
      
      // Redirect to payment page immediately
      window.location.href = `/taxi/payment`;
    } catch (error) {
      console.error("Error storing booking data:", error);
      // Fallback: try router.push
      router.push(`/taxi/payment`);
    }
  };

  if (loading) {
    return (
      <>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </>
    );
  }

  if (!ride) {
    return (
      <>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Service not found</h2>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg cursor-pointer"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  const vehicle = vehicleTypes[ride.vehicleType as keyof typeof vehicleTypes] || vehicleTypes.cab;

  return (
    <>
      <UnifiedHeader />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span>Back to Services</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Service Details */}
            <div>
              {/* Vehicle Type Card */}
              <div className={`bg-gradient-to-r ${vehicle.color} rounded-2xl p-8 mb-6 text-white shadow-lg`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <vehicle.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{vehicle.name}</h1>
                    <p className="text-white/90">Comfortable and reliable ride</p>
                  </div>
                </div>
                {ride.provider && (
                  <div className="flex items-center gap-3 mt-4">
                    {ride.provider.logo && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={ride.provider.logo}
                          alt={ride.provider.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span className="font-medium">{ride.provider.name}</span>
                  </div>
                )}
              </div>

              {/* Route Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Route Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pickup Location</p>
                      <p className="font-semibold text-gray-900">{ride.pickup || "Enter pickup location"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 ml-5">
                    <div className="w-0.5 h-8 bg-gray-300 ml-5"></div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Navigation className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Drop Location</p>
                      <p className="font-semibold text-gray-900">{ride.drop || "Enter drop location"}</p>
                    </div>
                  </div>
                </div>
                {ride.distance && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Distance</span>
                      <span className="font-semibold text-gray-900">{ride.distance} km</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Pricing</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-yellow-600">₹{ride.fare}</span>
                  <span className="text-gray-500">per ride</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Includes all taxes and charges</p>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg sticky top-24"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Book Your Ride</h2>
                
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter pickup address"
                      value={bookingData.pickup}
                      onChange={(e) => setBookingData({ ...bookingData, pickup: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Drop Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter drop address"
                      value={bookingData.drop}
                      onChange={(e) => setBookingData({ ...bookingData, drop: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        required
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <input
                        type="time"
                        required
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black cursor-pointer"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={bookingData.name}
                      onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 9876543210"
                      value={bookingData.phone}
                      onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black placeholder:text-gray-500"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Total Amount</span>
                      <span className="text-2xl font-bold text-yellow-600">₹{ride.fare}</span>
                    </div>
                    <button
                      type="submit"
                      disabled={!bookingData.pickup || !bookingData.drop || !bookingData.date || !bookingData.time || !bookingData.name || !bookingData.phone}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Proceed to Payment - ₹{ride.fare}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function TaxiDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div></div>}>
      <TaxiDetailContent />
    </Suspense>
  );
}

