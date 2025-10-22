"use client";

import React, { useState } from "react";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";

/**
 * Taxi page (Rapido-like) — put at src/app/taxi/page.tsx
 *
 * Notes:
 * - Form POSTs to /api/book-ride (route.ts below).
 * - Uses an Unsplash map image as background (Next.js will optimize it).
 * - If you haven't already allowed images.unsplash.com in next.config.js, add that remotePattern.
 */

export default function TaxiPage() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [when, setWhen] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<{ ok: boolean; message?: string; fare?: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResp(null);

    if (!pickup.trim() || !drop.trim()) {
      setResp({ ok: false, message: "Please enter both pickup and drop locations." });
      return;
    }

    setLoading(true);
    try {
      const r = await fetch("/api/book-ride", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pickup, drop, when }),
      });
      const data = await r.json();
      if (r.ok) {
        setResp({ ok: true, message: data.message, fare: data.fare });
      } else {
        setResp({ ok: false, message: data.message || "Booking failed" });
      }
    } catch (err) {
      console.error("Booking error:", err);
      setResp({ ok: false, message: "Network error — try again." });
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-900 antialiased">
      {/* Background map hero */}
      <section className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            // Rapido-like map image from Unsplash (real-looking map)
            backgroundImage:
              "url('https://images.unsplash.com/photo-1508170069958-96f0dcf7c5f1?auto=format&fit=crop&w=2000&q=80')",
            filter: "grayscale(4%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 lg:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Bharat Moves On Rapido!</h1>
            <p className="mt-4 text-gray-700 max-w-2xl mx-auto">Book quick and affordable rides — bike, auto or cab — in a tap.</p>
          </div>

          {/* Booking form centered */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 max-w-2xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8"
          >
            <div className="space-y-4">
              <div>
                <label className="sr-only">Pickup</label>
                <div className="flex items-center gap-3 bg-white rounded-full border px-4 py-3">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  <input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder="Enter Pickup Location"
                    className="outline-none w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="sr-only">Drop</label>
                <div className="flex items-center gap-3 bg-white rounded-full border px-4 py-3">
                  <MapPin className="w-5 h-5 text-yellow-500" />
                  <input
                    value={drop}
                    onChange={(e) => setDrop(e.target.value)}
                    placeholder="Enter Drop Location"
                    className="outline-none w-full text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="sr-only">When</label>
                <div className="flex items-center gap-3 bg-white rounded-full border px-4 py-3">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <input
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    type="datetime-local"
                    className="outline-none w-full text-sm"
                  />
                </div>
              </div>

              <div className="text-center mt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-yellow-400 hover:bg-yellow-380 text-black font-bold rounded-full px-12 py-4 shadow"
                  aria-busy={loading}
                >
                  {loading ? "Booking..." : "Book Ride"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {resp && (
                <div
                  className={`mt-4 text-sm font-medium text-center ${resp.ok ? "text-green-700 bg-green-50 rounded-lg p-3" : "text-red-700 bg-red-50 rounded-lg p-3"
                    }`}
                >
                  <div>{resp.message}</div>
                  {resp.ok && typeof resp.fare === "number" && (
                    <div className="mt-2 font-extrabold">Estimated fare: ₹{resp.fare}</div>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Our Services */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold mb-6">Our Services</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <section className="bg-white rounded-2xl p-6 shadow">
            <div className="h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=900&q=80"
                alt="bike taxi"
                width={900}
                height={600}
                className="object-cover h-full w-full rounded-lg"
              />

            </div>
            <h3 className="mt-4 font-bold text-lg">Bike Taxi</h3>
            <p className="text-sm text-gray-600 mt-2">Fast & cheap city rides for single riders.</p>
            <div className="mt-4">
              <button className="bg-yellow-400 px-4 py-2 rounded-full font-semibold">Book a ride</button>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow">
            <div className="h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80"
                alt="auto"
                width={900}
                height={600}
                className="object-cover h-full w-full rounded-lg"
              />

            </div>
            <h3 className="mt-4 font-bold text-lg">Auto</h3>
            <p className="text-sm text-gray-600 mt-2">Metered autos for short distances.</p>
            <div className="mt-4">
              <button className="bg-yellow-400 px-4 py-2 rounded-full font-semibold">Book a ride</button>
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 shadow">
            <div className="h-40 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1549921296-3f1387d1f4c6?auto=format&fit=crop&w=900&q=80"
                alt="cab"
                width={900}
                height={600}
                className="object-cover h-full w-full rounded-lg"
              />

            </div>
            <h3 className="mt-4 font-bold text-lg">Cab</h3>
            <p className="text-sm text-gray-600 mt-2">Comfortable AC cabs for longer journeys.</p>
            <div className="mt-4">
              <button className="bg-yellow-400 px-4 py-2 rounded-full font-semibold">Book a ride</button>
            </div>
          </section>
        </div>
      </section>

      {/* Earn / Safety / Download sections */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold">Flexible Hours & High Earnings</h3>
          <p className="text-gray-600">Join as a Rapido captain and earn on your own terms. Drive whenever you want.</p>
          <button className="mt-3 bg-black text-white px-6 py-3 rounded-full font-semibold">Start Earning</button>
        </div>
        <div className="rounded-2xl overflow-hidden bg-white shadow">
          <Image
            src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=900&q=80"
            alt="drivers"
            width={900}
            height={600}
            className="object-cover w-full h-56 rounded-2xl"
          />

        </div>
      </section>

      <section className="bg-yellow-500 text-black py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-extrabold mb-3">Download Now</h3>
          <p className="mb-6">Book rides instantly — Rapido: Bike-Taxi, Auto & Cabs</p>
          <div className="flex justify-center gap-4">
            <div className="bg-black text-yellow-400 px-5 py-3 rounded-lg">App Store</div>
            <div className="bg-black text-yellow-400 px-5 py-3 rounded-lg">Google Play</div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 font-bold">rapido</div>
            <p className="mt-3 text-sm text-gray-600">© {new Date().getFullYear()} Rapido-like Demo</p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
            <div>
              <h4 className="font-semibold mb-2">Company</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>About Us</li>
                <li>Careers</li>
                <li>Safety</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Help</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Contact</li>
                <li>Blog</li>
                <li>Privacy</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
