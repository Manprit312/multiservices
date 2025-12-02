"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  CreditCard,
  Lock,
  ArrowLeft,
  Sparkles,
  Shield,
  Clock,
  MapPin,
  Navigation,
  Car,
  DollarSign,
} from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";

interface BookingData {
  pickup: string;
  drop: string;
  vehicleType: string;
  vehicleName: string;
  driverId: string;
  driverName: string;
  fare: number;
  distance: number;
  estimatedTime: number;
  paymentMethod: string;
  providerId: string;
}

function PaymentContent() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "wallet" | "cash">("cash");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    // Get booking data from localStorage
    const stored = localStorage.getItem("ride_booking_data");
    if (stored) {
      setBookingData(JSON.parse(stored));
    } else {
      router.push("/taxi");
    }
  }, [router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData) return;

    setProcessing(true);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/book-ride`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: bookingData.pickup,
          drop: bookingData.drop,
          when: new Date().toISOString(),
          provider: bookingData.providerId,
          vehicleType: bookingData.vehicleType,
          driverId: bookingData.driverId,
          fare: bookingData.fare,
          distance: bookingData.distance,
          paymentMethod: paymentMethod,
        }),
      });

      const data = await res.json();
      
      if (data.ok || data.success) {
        setProcessing(false);
        setSuccess(true);
        localStorage.removeItem("ride_booking_data");
        
        // Redirect to success page after 3 seconds
        setTimeout(() => {
          router.push("/taxi/success");
        }, 3000);
      } else {
        alert(data.message || "Payment failed. Please try again.");
        setProcessing(false);
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <UnifiedHeader />
        <main className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 pt-20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ride Booked!</h2>
            <p className="text-gray-600 mb-6">Your ride has been confirmed. Redirecting...</p>
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm">Processing your booking...</span>
            </div>
          </motion.div>
        </main>
      </>
    );
  }

  return (
    <>
      <UnifiedHeader />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Booking</span>
          </motion.button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Booking Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                <h3 className="text-xl font-bold mb-6 text-gray-900">Ride Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      {bookingData.vehicleName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="line-clamp-2">{bookingData.pickup}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Navigation className="w-4 h-4 text-red-600" />
                    <span className="line-clamp-2">{bookingData.drop}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span>~{bookingData.estimatedTime} min</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="font-semibold text-gray-900">{bookingData.distance} km</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{bookingData.fare}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹0</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-yellow-600">₹{bookingData.fare}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
                    <p className="text-sm text-gray-600">Your payment is encrypted and secure</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { id: "cash", label: "Cash", icon: DollarSign },
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "upi", label: "UPI", icon: Sparkles },
                      { id: "wallet", label: "Wallet", icon: Shield },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as "card" | "upi" | "wallet" | "cash")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            paymentMethod === method.id
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            paymentMethod === method.id ? "text-yellow-600" : "text-gray-400"
                          }`} />
                          <span className={`text-xs font-medium ${
                            paymentMethod === method.id ? "text-yellow-600" : "text-gray-600"
                          }`}>
                            {method.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handlePayment} className="space-y-4">
                  {paymentMethod === "card" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          maxLength={19}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            maxLength={5}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            maxLength={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "upi" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="yourname@upi"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black"
                        />
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "wallet" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Wallet
                        </label>
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-black">
                          <option>Paytm</option>
                          <option>PhonePe</option>
                          <option>Google Pay</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === "cash" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                    >
                      <p className="text-sm text-gray-700">
                        💵 You&apos;ll pay the driver in cash when the ride is completed.
                      </p>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          {paymentMethod === "cash" ? "Confirm Booking" : `Pay ₹${bookingData.fare}`}
                        </>
                      )}
                    </button>
                    <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
                      <Shield className="w-3 h-3" />
                      Secured by SSL encryption
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div></div>}>
      <PaymentContent />
    </Suspense>
  );
}

