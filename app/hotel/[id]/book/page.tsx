"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Calendar,
  Users,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  X,
  Clock,
} from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  price: number;
  rating?: number;
  capacity?: number;
  images?: string[];
  amenities?: string[];
}

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
}

function HotelBookingContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hotelId = params?.id as string;
  const providerId = searchParams?.get("provider");

  const [step, setStep] = useState<"dates" | "guests" | "details" | "confirm" | "success">("dates");
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    checkIn: "",
    checkOut: "",
    guests: 2,
    guestName: "",
    guestEmail: "",
    guestPhone: "",
  });
  const [nights, setNights] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Fetch hotel details
  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch(`${API_BASE}/api/hotels/${hotelId}`);
        const data = await res.json();
        if (data.success) {
          setHotel(data.hotel);
        }
      } catch (err) {
        console.error("Failed to fetch hotel:", err);
      } finally {
        setLoading(false);
      }
    }
    if (hotelId) fetchHotel();
  }, [hotelId]);

  // Calculate nights and total when dates change
  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut && hotel) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setNights(diffDays);
      setTotalAmount(hotel.price * diffDays);
    }
  }, [bookingData.checkIn, bookingData.checkOut, hotel]);

  const handleNext = () => {
    if (step === "dates") {
      if (!bookingData.checkIn || !bookingData.checkOut) {
        alert("Please select check-in and check-out dates");
        return;
      }
      setStep("guests");
    } else if (step === "guests") {
      if (bookingData.guests < 1) {
        alert("Please select number of guests");
        return;
      }
      setStep("details");
    } else if (step === "details") {
      if (!bookingData.guestName || !bookingData.guestEmail) {
        alert("Please fill in all required guest details");
        return;
      }
      setStep("confirm");
    }
  };

  const handleBack = () => {
    if (step === "guests") setStep("dates");
    else if (step === "details") setStep("guests");
    else if (step === "confirm") setStep("details");
  };

  const handleConfirmBooking = async () => {
    if (!hotel) return;

    setBookingLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/hotels/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel._id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          guestName: bookingData.guestName,
          guestEmail: bookingData.guestEmail,
          guestPhone: bookingData.guestPhone,
          providerId: providerId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingId(data.booking.bookingId);
        setStep("success");
      } else {
        alert(data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <UnifiedHeader />
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!hotel) {
    return (
      <>
        <UnifiedHeader />
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-600">Hotel not found</p>
        </div>
      </>
    );
  }

  const minDate = new Date().toISOString().split("T")[0];
  const maxCheckIn = bookingData.checkIn
    ? new Date(new Date(bookingData.checkIn).getTime() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : "";

  return (
    <>
      <UnifiedHeader />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {[
                { label: "Dates", step: "dates" },
                { label: "Guests", step: "guests" },
                { label: "Details", step: "details" },
                { label: "Confirm", step: "confirm" },
              ].map((item, index) => {
                const stepIndex = ["dates", "guests", "details", "confirm"].indexOf(step);
                const isActive = index <= stepIndex;
                return (
                  <React.Fragment key={item.step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-xs mt-1 ${isActive ? "text-blue-600 font-semibold" : "text-gray-500"}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div
                        className={`h-0.5 w-8 sm:w-16 ${isActive ? "bg-blue-600" : "bg-gray-200"}`}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Booking Form */}
            <div className="lg:col-span-2">
              {/* Hotel Summary Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex gap-4">
                  {hotel.images && hotel.images[0] && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={hotel.images[0]}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{hotel.name}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      <span>{hotel.location}</span>
                    </div>
                    {hotel.rating && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-semibold">{hotel.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Dates */}
                {step === "dates" && (
                  <motion.div
                    key="dates"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                  >
                    <h3 className="text-2xl font-bold mb-6">Select Dates</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Check-in Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={bookingData.checkIn}
                            onChange={(e) => {
                              setBookingData({ ...bookingData, checkIn: e.target.value });
                              if (bookingData.checkOut && e.target.value >= bookingData.checkOut) {
                                setBookingData({ ...bookingData, checkIn: e.target.value, checkOut: "" });
                              }
                            }}
                            min={minDate}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Check-out Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            value={bookingData.checkOut}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, checkOut: e.target.value })
                            }
                            min={
                              bookingData.checkIn ||
                              minDate
                            }
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    {nights > 0 && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">{nights}</span> {nights === 1 ? "night" : "nights"} selected
                        </p>
                      </div>
                    )}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleNext}
                        disabled={!bookingData.checkIn || !bookingData.checkOut}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Guests */}
                {step === "guests" && (
                  <motion.div
                    key="guests"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Number of Guests</h3>
                      <button
                        onClick={handleBack}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Guests
                      </label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          value={bookingData.guests}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guests: Number(e.target.value),
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none appearance-none"
                        >
                          {Array.from({ length: hotel.capacity || 6 }, (_, i) => i + 1).map(
                            (num) => (
                              <option key={num} value={num}>
                                {num} {num === 1 ? "Guest" : "Guests"}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Maximum capacity: {hotel.capacity || 2} guests
                      </p>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleNext}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Guest Details */}
                {step === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Guest Information</h3>
                      <button
                        onClick={handleBack}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={bookingData.guestName}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, guestName: e.target.value })
                            }
                            placeholder="Enter your full name"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={bookingData.guestEmail}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, guestEmail: e.target.value })
                            }
                            placeholder="your.email@example.com"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={bookingData.guestPhone}
                            onChange={(e) =>
                              setBookingData({ ...bookingData, guestPhone: e.target.value })
                            }
                            placeholder="+91 98765 43210"
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={!bookingData.guestName || !bookingData.guestEmail}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirm */}
                {step === "confirm" && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold">Confirm Booking</h3>
                      <button
                        onClick={handleBack}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Booking Summary */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold mb-4">Booking Summary</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hotel:</span>
                            <span className="font-medium">{hotel.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-in:</span>
                            <span className="font-medium">
                              {new Date(bookingData.checkIn).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Check-out:</span>
                            <span className="font-medium">
                              {new Date(bookingData.checkOut).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Guests:</span>
                            <span className="font-medium">{bookingData.guests}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Nights:</span>
                            <span className="font-medium">{nights}</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between">
                              <span className="font-bold">Total Amount:</span>
                              <span className="font-bold text-blue-600 text-lg">
                                ₹{totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Guest Info */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h4 className="font-semibold mb-4">Guest Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">{bookingData.guestName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-medium">{bookingData.guestEmail}</span>
                          </div>
                          {bookingData.guestPhone && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Phone:</span>
                              <span className="font-medium">{bookingData.guestPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-between">
                      <button
                        onClick={handleBack}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                      <button
                        onClick={handleConfirmBooking}
                        disabled={bookingLoading}
                        className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {bookingLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4" />
                            Confirm & Book
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Success Step */}
                {step === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600 mb-4">
                      Your hotel booking has been confirmed successfully.
                    </p>
                    {bookingId && (
                      <p className="text-sm text-gray-500 mb-6">
                        Booking ID: <span className="font-mono font-semibold">{bookingId}</span>
                      </p>
                    )}
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={() => router.push(`/hotel?provider=${providerId || ""}`)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                      >
                        Book Another Hotel
                      </button>
                      <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                      >
                        Go to Home
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Price Summary */}
            {step !== "success" && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                  <h3 className="font-bold text-lg mb-4">Price Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price per night:</span>
                      <span className="font-medium">₹{hotel.price.toLocaleString()}</span>
                    </div>
                    {nights > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Nights:</span>
                          <span className="font-medium">{nights}</span>
                        </div>
                        <div className="border-t pt-3 mt-3">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold">Subtotal:</span>
                            <span className="font-semibold">
                              ₹{(hotel.price * nights).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Taxes & fees included</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between">
                              <span className="font-bold text-lg">Total:</span>
                              <span className="font-bold text-lg text-blue-600">
                                ₹{totalAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {nights === 0 && (
                      <p className="text-gray-500 text-xs mt-4">
                        Select dates to see pricing
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default function HotelBookingPage() {
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <HotelBookingContent />
    </Suspense>
  );
}

