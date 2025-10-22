"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Calculator, CheckCircle2, Trash2, Clock } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CleaningCostCalculator() {
  const [services, setServices] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // Fetch cleaning services from API
  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch(`${API_BASE}/api/cleaning`);
        const data = await res.json();
        if (data.success) setServices(data.cleanings);
      } catch (err) {
        console.error("Error fetching cleaning services:", err);
      }
    }
    fetchServices();
  }, []);

  // Calculate total cost
  useEffect(() => {
    const newTotal = selectedServices.reduce((sum, s) => {
      const perHourRate =
        s.duration && s.duration > 0
          ? parseFloat(s.price || 0) / s.duration
          : parseFloat(s.price || 0);
      return sum + perHourRate * (s.customDuration || s.duration || 1);
    }, 0);
    setTotal(newTotal);
  }, [selectedServices]);

  // Select or deselect a service
  const toggleService = (service: any) => {
    setSelectedServices((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, { ...service, customDuration: service.duration || 1 }]
    );
  };

  // Update duration for a selected service
  const updateDuration = (id: string, value: number) => {
    setSelectedServices((prev) =>
      prev.map((s) =>
        s._id === id ? { ...s, customDuration: Number(value) } : s
      )
    );
  };

  // Clear all selections
  const resetCalculator = () => {
    setSelectedServices([]);
    setTotal(0);
  };

  return (
    <section className="relative bg-gradient-to-b from-emerald-50 via-white to-green-50 py-20 overflow-hidden">
      {/* Floating Icons */}
      <motion.div
        className="absolute top-10 left-16 text-emerald-400 opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <Sparkles size={36} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-center mb-10 text-emerald-700 flex items-center justify-center gap-3"
        >
          <Calculator className="text-emerald-500" /> Cleaning Cost Calculator
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Service Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100"
          >
            <h3 className="font-bold text-xl text-gray-800 mb-4">
              Choose Cleaning Services
            </h3>

            {services.length === 0 ? (
              <p className="text-gray-500">No services available yet.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {services.map((service) => {
                  const isSelected = selectedServices.some(
                    (s) => s._id === service._id
                  );
                  const perHourRate =
                    service.duration && service.duration > 0
                      ? (service.price / service.duration).toFixed(2)
                      : service.price;
                  return (
                    <motion.div
                      key={service._id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 border rounded-xl cursor-pointer flex justify-between items-center transition ${
                        isSelected
                          ? "bg-emerald-50 border-emerald-300"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => toggleService(service)}
                    >
                      <div>
                        <p className="font-semibold text-gray-800">
                          {service.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₹{perHourRate} / hr (Total ₹{service.price} for{" "}
                          {service.duration} hrs)
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2
                          className="text-emerald-500"
                          size={20}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="font-bold text-xl text-gray-800 mb-6">
                Summary
              </h3>

              <div className="space-y-4 mb-6">
                {selectedServices.length === 0 ? (
                  <p className="text-gray-500">No services selected yet.</p>
                ) : (
                  selectedServices.map((s) => {
                    const perHourRate =
                      s.duration && s.duration > 0
                        ? parseFloat(s.price) / s.duration
                        : parseFloat(s.price);
                    const itemTotal = perHourRate * (s.customDuration || 1);

                    return (
                      <div
                        key={s._id}
                        className="flex flex-col border-b pb-3 border-gray-100"
                      >
                        <div className="flex justify-between items-center text-gray-700 text-sm">
                          <span className="font-medium">{s.name}</span>
                          <span>
                            ₹{itemTotal.toFixed(2)} ({s.customDuration} hrs)
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={14} className="text-emerald-400" />
                            Duration:
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={s.customDuration}
                            onChange={(e) =>
                              updateDuration(s._id, Number(e.target.value))
                            }
                            className="w-16 border rounded-lg px-2 py-1 text-center text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <p className="text-lg font-bold text-emerald-600">
                  Total: ₹{total.toFixed(2)}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={resetCalculator}
                  className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-100 transition"
                >
                  <Trash2 size={16} />
                  Clear
                </motion.button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-8 bg-gradient-to-r from-emerald-600 to-green-500 text-white font-semibold rounded-full px-6 py-3 shadow-md hover:shadow-lg transition"
            >
              Confirm Booking
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
