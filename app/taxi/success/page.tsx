"use client";

import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Home, Car, Navigation } from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";
import Link from "next/link";

function SuccessContent() {

  useEffect(() => {
    // Clear any stored booking data
    localStorage.removeItem("ride_booking_data");
  }, []);

  return (
    <>
      <UnifiedHeader />
      <main className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 pt-20 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl max-w-2xl w-full text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <CheckCircle className="w-14 h-14 text-white" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Ride Confirmed! 🚗
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Your ride has been successfully booked. The driver will arrive at your pickup location shortly.
          </motion.p>

          {/* Booking Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-50 rounded-2xl p-6 mb-8 text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Ride Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Car className="w-5 h-5 text-yellow-600" />
                <span>Driver details will be shared via SMS</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Navigation className="w-5 h-5 text-yellow-600" />
                <span>Track your ride in real-time</span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
            <Link
              href="/taxi"
              className="px-6 py-3 bg-white border-2 border-yellow-600 text-yellow-600 font-semibold rounded-lg hover:bg-yellow-50 transition-all"
            >
              Book Another Ride
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div></div>}>
      <SuccessContent />
    </Suspense>
  );
}

