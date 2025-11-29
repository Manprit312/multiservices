"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";

interface BookingData {
  serviceId: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  location: string;
  name: string;
  phone: string;
  email: string;
}

function PaymentContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = params?.id as string;

  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "wallet">("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    // Get booking data from URL params or localStorage
    const stored = localStorage.getItem("cleaning_booking_data");
    if (stored) {
      setBookingData(JSON.parse(stored));
    } else {
      // Fallback: try to get from URL params
      const data = {
        serviceId: serviceId,
        serviceName: searchParams?.get("serviceName") || "Cleaning Service",
        price: Number(searchParams?.get("price")) || 0,
        date: searchParams?.get("date") || "",
        time: searchParams?.get("time") || "",
        location: searchParams?.get("location") || "",
        name: searchParams?.get("name") || "",
        phone: searchParams?.get("phone") || "",
        email: searchParams?.get("email") || "",
      };
      if (data.price > 0) {
        setBookingData(data);
      } else {
        router.push(`/cleaning/${serviceId}`);
      }
    }
  }, [serviceId, searchParams, router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      localStorage.removeItem("cleaning_booking_data");
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push(`/cleaning/${serviceId}/success`);
      }, 3000);
    }, 2000);
  };

  if (!bookingData) {
    return (
      <>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </>
    );
  }

  if (success) {
    return (
      <>
        <UnifiedHeader />
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-20 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center max-w-md mx-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">Your booking has been confirmed. Redirecting...</p>
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
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
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
                <h3 className="text-xl font-bold mb-6 text-gray-900">Booking Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-semibold text-gray-900">{bookingData.serviceName}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{bookingData.date} at {bookingData.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-2">{bookingData.location}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="font-semibold text-gray-900">{bookingData.name}</p>
                    <p className="text-sm text-gray-600">{bookingData.phone}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{bookingData.price}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹0</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-green-600">₹{bookingData.price}</span>
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
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6 text-green-600" />
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
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "card", label: "Card", icon: CreditCard },
                      { id: "upi", label: "UPI", icon: Sparkles },
                      { id: "wallet", label: "Wallet", icon: Shield },
                    ].map((method) => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as "card" | "upi" | "wallet")}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            paymentMethod === method.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon className={`w-6 h-6 mx-auto mb-2 ${
                            paymentMethod === method.id ? "text-green-600" : "text-gray-400"
                          }`} />
                          <span className={`text-sm font-medium ${
                            paymentMethod === method.id ? "text-green-600" : "text-gray-600"
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
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
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
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
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
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
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
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
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
                        <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black">
                          <option>Paytm</option>
                          <option>PhonePe</option>
                          <option>Google Pay</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={processing}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pay ₹{bookingData.price}
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
      <PaymentContent />
    </Suspense>
  );
}

