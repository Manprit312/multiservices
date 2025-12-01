"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {

  CheckCircle,
  ArrowLeft,

  Clock,
  Sparkles,

} from "lucide-react";
import UnifiedHeader from "@/components/UnifiedHeader";
import RequireAuth from "@/components/RequireAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CleaningService {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  duration?: string;
  suppliesIncluded?: boolean;
  images?: string[];
  provider?: {
    _id: string;
    name: string;
    logo?: string;
  };
}

function CleaningDetailContent() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params?.id as string;

  const [service, setService] = useState<CleaningService | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    location: "",
    name: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchService() {
      if (!serviceId) return;
      try {
        const res = await fetch(`${API_BASE}/api/cleaning/${serviceId}`);
        const data = await res.json();
        if (data.success && data.cleaning) {
          setService(data.cleaning);
        }
      } catch (err) {
        console.error("Failed to fetch service:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [serviceId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Store booking data for payment page
      const bookingData = {
        serviceId: service?._id || "",
        serviceName: service?.name || "",
        price: service?.price || 0,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      };
      localStorage.setItem("cleaning_booking_data", JSON.stringify(bookingData));
      
      // Redirect to payment page
      router.push(`/cleaning/${serviceId}/payment`);
    } catch {
      alert("Booking failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Service not found</h2>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <RequireAuth>
      <UnifiedHeader />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Services</span>
          </button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Service Images & Details */}
            <div>
              {/* Main Image */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6 bg-gray-200">
                {service.images && service.images.length > 0 ? (
                  <Image
                    src={service.images[0]}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100">
                    <Sparkles className="w-24 h-24 text-green-500" />
                  </div>
                )}
              </div>

              {/* Service Details */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h1 className="text-3xl font-bold mb-4 text-gray-900">{service.name}</h1>
                
                {service.provider && (
                  <div className="flex items-center gap-3 mb-4">
                    {service.provider.logo && (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-200">
                        <Image
                          src={service.provider.logo}
                          alt={service.provider.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-700">{service.provider.name}</p>
                    </div>
                  </div>
                )}

                {service.description && (
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                )}

                <div className="space-y-4">
                  {service.category && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        <strong>Category:</strong> {service.category}
                      </span>
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        <strong>Duration:</strong> {service.duration}
                      </span>
                    </div>
                  )}
                  {service.suppliesIncluded !== undefined && (
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">
                        <strong>Supplies:</strong> {service.suppliesIncluded ? "Included" : "Not Included"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-green-600">₹{service.price}</span>
                    <span className="text-gray-500">per service</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg sticky top-24"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Book This Service</h2>
                
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Location
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your address"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
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
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent text-black"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-700 font-medium">Total Amount</span>
                      <span className="text-2xl font-bold text-green-600">₹{service.price}</span>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Processing..." : "Confirm Booking"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}

export default function CleaningDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>}>
      <CleaningDetailContent />
    </Suspense>
  );
}

