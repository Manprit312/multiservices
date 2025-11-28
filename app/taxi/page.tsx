"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Bike, 
  Car, 
  Star, 
  Circle, 
  Triangle,
  Navigation,
  Clock,
  DollarSign,
  User,
  CreditCard,
  Wallet,
  CheckCircle,
  X,
  Search,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Facebook, Twitter, Instagram } from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";

interface VehicleType {
  id: string;
  name: string;
  icon: React.ReactNode;
  baseFare: number;
  perKm: number;
  timePerKm: number; // minutes
  description: string;
  capacity: number;
}

const vehicleTypes: VehicleType[] = [
  {
    id: "bike",
    name: "Bike",
    icon: <Bike className="w-6 h-6" />,
    baseFare: 20,
    perKm: 5,
    timePerKm: 2,
    description: "Quick and affordable",
    capacity: 1,
  },
  {
    id: "auto",
    name: "Auto",
    icon: <Truck className="w-6 h-6" />,
    baseFare: 30,
    perKm: 8,
    timePerKm: 3,
    description: "Best for short trips",
    capacity: 3,
  },
  {
    id: "cab",
    name: "Cab",
    icon: <Car className="w-6 h-6" />,
    baseFare: 50,
    perKm: 12,
    timePerKm: 2.5,
    description: "Comfortable and spacious",
    capacity: 4,
  },
];

interface Driver {
  id: string;
  name: string;
  rating: number;
  rides: number;
  vehicle: string;
  distance: number; // km away
  eta: number; // minutes
  image?: string;
}

const mockDrivers: Driver[] = [
  { id: "1", name: "Rajesh Kumar", rating: 4.8, rides: 1250, vehicle: "Bike", distance: 0.5, eta: 2 },
  { id: "2", name: "Amit Singh", rating: 4.9, rides: 2100, vehicle: "Auto", distance: 1.2, eta: 4 },
  { id: "3", name: "Vikram Patel", rating: 4.7, rides: 890, vehicle: "Cab", distance: 2.1, eta: 5 },
];

interface Provider {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  rating?: number;
}

function TaxiPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const providerId = searchParams?.get("provider");
  
  const [step, setStep] = useState<"select" | "vehicle" | "driver" | "confirm" | "tracking">("select");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "wallet">("cash");
  const [loading, setLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
        console.error("Failed to fetch provider:", err);
      }
    }
    fetchProvider();
  }, [providerId]);

  // Calculate fare and distance
  useEffect(() => {
    if (pickup && drop && selectedVehicle) {
      // Simulate distance calculation (in real app, use map API)
      const simulatedDistance = Math.floor(Math.random() * 15) + 3; // 3-18 km
      setDistance(simulatedDistance);
      
      const calculatedFare = selectedVehicle.baseFare + (simulatedDistance * selectedVehicle.perKm);
      setFare(Math.round(calculatedFare));
      
      const time = Math.round(simulatedDistance * selectedVehicle.timePerKm);
      setEstimatedTime(time);
    }
  }, [pickup, drop, selectedVehicle]);

  const handleVehicleSelect = (vehicle: VehicleType) => {
    setSelectedVehicle(vehicle);
    setStep("driver");
  };

  const handleDriverSelect = (driver: Driver) => {
    setSelectedDriver(driver);
    setStep("confirm");
  };

  const handleConfirmBooking = async () => {
    if (!pickup || !drop || !selectedVehicle || !selectedDriver) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/book-ride`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          drop,
          when: new Date().toISOString(),
          provider: providerId,
          vehicleType: selectedVehicle.id,
          driverId: selectedDriver.id,
          fare,
          distance,
          paymentMethod,
        }),
      });
      const data = await res.json();
      
      if (data.ok || data.success) {
        setBookingConfirmed(true);
        setStep("tracking");
      } else {
        alert(data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UnifiedHeader />
      <div className="relative min-h-screen overflow-hidden text-gray-900 bg-gradient-to-b from-yellow-50 to-white pt-16 sm:pt-20">
        {providerId && selectedProvider && (
          <section className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-yellow-200">
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
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl border-2 border-white shadow">
                      {selectedProvider.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Rides from {selectedProvider.name}</h3>
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
                  onClick={() => router.push("/taxi")}
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
            <div className="text-center py-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-2 border-dashed border-yellow-200">
              <Car className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-3 text-gray-800">No Provider Selected</h2>
              <p className="text-gray-600 mb-6">Please select a service provider from the home page to book a ride.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                Choose Provider <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {providerId && !selectedProvider && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
              <p className="mt-4 text-gray-600">Loading provider information...</p>
            </div>
          </section>
        )}

        {providerId && selectedProvider && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Progress Steps */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4">
              {["Select", "Vehicle", "Driver", "Confirm"].map((label, index) => {
                const stepIndex = ["select", "vehicle", "driver", "confirm"].indexOf(step);
                const isActive = index <= stepIndex;
                return (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className={`text-xs sm:text-sm mt-1 ${isActive ? "text-yellow-600 font-semibold" : "text-gray-500"}`}>
                        {label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`h-0.5 w-8 sm:w-12 ${isActive ? "bg-yellow-500" : "bg-gray-200"}`} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Booking Form */}
            <div className="lg:col-span-2">
              {step === "select" && (
          <motion.div
                  initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
                >
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Book Your Ride</h2>
                  
            <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                <input
                        type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                        placeholder="Enter pickup location"
                        className="w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </button>
              </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      </div>
                <input
                        type="text"
                  value={drop}
                  onChange={(e) => setDrop(e.target.value)}
                        placeholder="Enter drop location"
                        className="w-full pl-10 pr-4 py-3 sm:py-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none text-sm sm:text-base"
                />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </button>
              </div>

                    <button
                      onClick={() => {
                        if (pickup && drop) setStep("vehicle");
                        else alert("Please enter both pickup and drop locations");
                      }}
                      disabled={!pickup || !drop}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 sm:py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    >
                      Continue to Select Vehicle
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "vehicle" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">Choose Vehicle</h2>
                    <button
                      onClick={() => setStep("select")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
              </div>

                  <div className="space-y-4">
                    {vehicleTypes.map((vehicle) => {
                      const estimatedFare = vehicle.baseFare + (distance * vehicle.perKm);
                      return (
                        <motion.div
                          key={vehicle.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleVehicleSelect(vehicle)}
                          className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedVehicle?.id === vehicle.id
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-gray-200 hover:border-yellow-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`p-3 sm:p-4 rounded-xl ${
                                selectedVehicle?.id === vehicle.id ? "bg-yellow-500 text-white" : "bg-gray-100"
                              }`}>
                                {vehicle.icon}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg sm:text-xl">{vehicle.name}</h3>
                                <p className="text-sm text-gray-600">{vehicle.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                                  <span>👤 {vehicle.capacity}</span>
                                  <span>⏱️ ~{Math.round(distance * vehicle.timePerKm)} min</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                                ₹{estimatedFare}
                              </div>
                              <div className="text-xs text-gray-500">Est. fare</div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === "driver" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold">Select Driver</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {pickup} → {drop} | ₹{fare} | ~{estimatedTime} min
                      </p>
                    </div>
                <button
                      onClick={() => setStep("vehicle")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {mockDrivers
                      .filter(d => d.vehicle === selectedVehicle?.name)
                      .map((driver) => (
                        <motion.div
                          key={driver.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleDriverSelect(driver)}
                          className={`p-4 sm:p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedDriver?.id === driver.id
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-gray-200 hover:border-yellow-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                                {driver.name.charAt(0)}
                              </div>
                              <div>
                                <h3 className="font-bold text-base sm:text-lg">{driver.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="text-sm font-semibold">{driver.rating}</span>
                                  <span className="text-xs text-gray-500">({driver.rides} rides)</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-xs sm:text-sm text-gray-600">
                                  <span>📍 {driver.distance} km away</span>
                                  <span>⏱️ {driver.eta} min ETA</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}

              {step === "confirm" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold">Confirm Booking</h2>
                    <button
                      onClick={() => setStep("driver")}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                </button>
              </div>

                  <div className="space-y-6">
                    {/* Trip Details */}
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                      <h3 className="font-semibold mb-4 text-sm sm:text-base">Trip Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm sm:text-base">{pickup}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span className="text-sm sm:text-base">{drop}</span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Info */}
                    {selectedDriver && (
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl">
                          {selectedDriver.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base sm:text-lg">{selectedDriver.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm">{selectedDriver.rating}</span>
                            <span className="text-xs text-gray-500">• {selectedDriver.rides} rides</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Payment Method */}
                    <div>
                      <h3 className="font-semibold mb-4 text-sm sm:text-base">Payment Method</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: "cash", label: "Cash", icon: <DollarSign className="w-5 h-5" /> },
                          { id: "card", label: "Card", icon: <CreditCard className="w-5 h-5" /> },
                          { id: "wallet", label: "Wallet", icon: <Wallet className="w-5 h-5" /> },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              paymentMethod === method.id
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-gray-200 hover:border-yellow-300"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2">
                              {method.icon}
                              <span className="text-xs sm:text-sm font-medium">{method.label}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                      onClick={handleConfirmBooking}
                      disabled={loading}
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
                    >
                      {loading ? "Confirming..." : `Confirm & Pay ₹${fare}`}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "tracking" && bookingConfirmed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
                >
                  <div className="text-center mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ride Confirmed!</h2>
                    <p className="text-gray-600">Your driver is on the way</p>
                  </div>

                  {selectedDriver && (
                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                          {selectedDriver.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{selectedDriver.name}</h3>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-sm">{selectedDriver.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-semibold">{selectedVehicle?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ETA:</span>
                          <span className="font-semibold">{selectedDriver.eta} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Fare:</span>
                          <span className="font-semibold text-yellow-600">₹{fare}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Navigation className="w-5 h-5 text-yellow-600 animate-pulse" />
                      <span className="font-semibold">Driver is {selectedDriver?.distance} km away</span>
                    </div>
                    <p className="text-sm text-gray-600">You'll be notified when your driver arrives</p>
                  </div>

                  <button
                    onClick={() => {
                      setStep("select");
                      setPickup("");
                      setDrop("");
                      setSelectedVehicle(null);
                      setSelectedDriver(null);
                      setBookingConfirmed(false);
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-all"
                  >
                    Book Another Ride
                  </button>
                </motion.div>
              )}
            </div>

            {/* Right: Map/Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 sticky top-24">
                {step === "select" && (
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl mb-4">Quick Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Enter accurate pickup and drop locations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Choose vehicle type based on distance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Fare is calculated automatically</span>
                      </li>
                    </ul>
                  </div>
                )}

                {(step === "vehicle" || step === "driver" || step === "confirm") && selectedVehicle && (
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl mb-4">Trip Summary</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">From:</span>
                        <span className="font-medium text-right max-w-[60%]">{pickup}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="font-medium text-right max-w-[60%]">{drop}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Distance:</span>
                          <span className="font-semibold">{distance} km</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Est. Time:</span>
                          <span className="font-semibold">~{estimatedTime} min</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-600">Vehicle:</span>
                          <span className="font-semibold">{selectedVehicle.name}</span>
                        </div>
                        {fare && (
                          <div className="flex justify-between pt-3 border-t mt-3">
                            <span className="font-bold text-base">Total Fare:</span>
                            <span className="font-bold text-xl text-yellow-600">₹{fare}</span>
                          </div>
                        )}
                      </div>
                    </div>
        </div>
                )}

                {step === "tracking" && (
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl mb-4">Live Tracking</h3>
                    <div className="bg-gray-100 rounded-xl h-48 sm:h-64 flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Navigation className="w-12 h-12 text-yellow-500 mx-auto mb-2 animate-pulse" />
                        <p className="text-sm text-gray-600">Map View</p>
                        <p className="text-xs text-gray-500 mt-1">Driver is on the way</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-semibold text-green-600">On the way</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">ETA:</span>
                        <span className="font-semibold">{selectedDriver?.eta} min</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}

export default function TaxiPage() {
  return (
    <Suspense fallback={<div className="h-16 bg-white"></div>}>
      <TaxiPageContent />
    </Suspense>
  );
}
