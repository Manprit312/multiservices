"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Users,
  Car,
  Heart,
  ArrowRight,
  Star,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function RideSharePage() {
  const [ride, setRide] = useState({
    from: "",
    to: "",
    date: "",
    seats: 1,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    alert(
      `Searching for rides from ${ride.from || "N/A"} to ${ride.to || "N/A"} on ${
        ride.date || "N/A"
      }`
    );
  };

  return (
    <div className="bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto py-24 px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-transparent leading-tight">
            Share Rides. Save Money. <br /> Drive with Passion. ❤️
          </h1>
          <p className="text-gray-700 text-lg max-w-md mx-auto md:mx-0">
            Experience the freedom of community rides — affordable, safe, and fun.
            Every shared trip brings people closer and saves the planet.
          </p>
          <button className="bg-gradient-to-r from-rose-600 via-red-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:shadow-2xl transition-all inline-flex items-center group">
            Find a Ride
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mt-12 md:mt-0"
        >
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://res.cloudinary.com/demo/image/upload/w_1200,h_800,c_fill,q_auto,f_auto/v1/multiserv_rides/ride-hero"
              alt="Ride Sharing"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </motion.div>
      </section>

      {/* Booking Section */}
      <section className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-10 -mt-10 relative z-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Find or Offer a Ride
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-6 items-center"
        >
          <div>
            <label className="font-semibold text-gray-600 mb-2 block">From</label>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
              <MapPin className="text-rose-500 mr-2" />
              <input
                type="text"
                placeholder="Pickup location"
                className="bg-transparent outline-none flex-1"
                onChange={(e) => setRide({ ...ride, from: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600 mb-2 block">To</label>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
              <MapPin className="text-rose-500 mr-2" />
              <input
                type="text"
                placeholder="Drop location"
                className="bg-transparent outline-none flex-1"
                onChange={(e) => setRide({ ...ride, to: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600 mb-2 block">Date</label>
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
              <Calendar className="text-rose-500 mr-2" />
              <input
                type="date"
                className="bg-transparent outline-none flex-1"
                onChange={(e) => setRide({ ...ride, date: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600 mb-2 block">Seats</label>
            <select
              className="w-full border border-gray-300 rounded-full px-5 py-3 outline-none"
              onChange={(e) => setRide({ ...ride, seats: parseInt(e.target.value) })}
            >
              <option value="1">1 Seat</option>
              <option value="2">2 Seats</option>
              <option value="3">3 Seats</option>
              <option value="4">4 Seats</option>
            </select>
          </div>
        </form>
        <div className="text-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-rose-600 via-red-500 to-pink-500 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-xl transition-all"
          >
            Search Rides
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-black mb-16 bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-transparent">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              icon: <Users className="w-10 h-10 text-rose-600" />,
              title: "Create a Ride",
              desc: "Post or search for a ride within your area in seconds.",
            },
            {
              icon: <CheckCircle className="w-10 h-10 text-red-500" />,
              title: "Match with Riders",
              desc: "Connect securely with verified passengers or drivers.",
            },
            {
              icon: <Car className="w-10 h-10 text-pink-500" />,
              title: "Enjoy & Save",
              desc: "Split fares, save fuel, and help reduce traffic & pollution.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white rounded-3xl p-10 shadow-xl hover:-translate-y-2 transition-all"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                {s.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-24 px-6">
        <h2 className="text-4xl font-black text-center mb-12 bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-transparent">
          Why Choose ServiHub RideShare?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
          {[
            {
              icon: <Heart />,
              title: "Eco-Friendly",
              desc: "Reduce emissions and make your travel planet-friendly.",
            },
            {
              icon: <Clock />,
              title: "Time-Saving",
              desc: "Find convenient rides instantly that fit your schedule.",
            },
            {
              icon: <Users />,
              title: "Verified Community",
              desc: "Ride only with trusted, verified members near you.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-rose-50 to-pink-50 p-10 rounded-3xl shadow-lg hover:shadow-2xl transition"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-500 text-white mx-auto mb-5 flex items-center justify-center rounded-full">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-rose-600 via-red-500 to-pink-500 text-white py-24 text-center">
        <h2 className="text-4xl font-black mb-10">What Our Riders Say</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            {
              name: "Aarav Singh",
              feedback:
                "The easiest way to share rides with people I trust. Saves me ₹2000/month!",
            },
            {
              name: "Priya Nair",
              feedback:
                "I love the community — safe, friendly, and eco-conscious!",
            },
            {
              name: "Ravi Mehta",
              feedback:
                "RedCherry theme gives energetic vibes, and so does the experience!",
            },
          ].map((t, idx) => (
            <div key={idx} className="bg-white/10 p-8 rounded-2xl backdrop-blur-lg shadow-lg">
              <Star className="text-yellow-300 mx-auto mb-4" />
              <p className="italic mb-4">&quot;{t.feedback}&quot;</p>
              <p className="font-bold text-lg">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-center">
        <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-rose-600 to-red-500 bg-clip-text text-transparent">
          Start Sharing Today ❤️
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of riders who save money and make meaningful connections every day.
        </p>
        <button className="bg-gradient-to-r from-rose-600 via-red-500 to-pink-500 text-white px-12 py-5 rounded-full text-xl font-bold hover:shadow-2xl transition-all inline-flex items-center group">
          Join Now
          <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </button>
      </section>
    </div>
  );
}
