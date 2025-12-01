"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Star,
  Cloud,
  Circle,
  Triangle,
  Square,
  CheckCircle,
} from "lucide-react";

// ✅ Helper type for Lucide icons
type LucideIconComponent = React.FC<React.SVGProps<SVGSVGElement>>;

export default function ContactSection() {
  const floatingIcons = ["Star", "Cloud", "Circle", "Triangle", "Square"] as const;

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    
    const formData = new FormData(e.currentTarget);
    const body = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
        e.currentTarget.reset();
        setTimeout(() => setSubmitStatus("idle"), 3000);
      } else {
        setSubmitStatus("error");
        setTimeout(() => setSubmitStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative overflow-hidden pt-20 pb-32" id="contactus">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(240,253,244,0.7) 0%, rgba(220,252,231,0.7) 100%)",
        }}
        aria-hidden
      />

      {/* Floating Lucide icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: 18 }).map((_, i) => {
          const IconName = floatingIcons[i % floatingIcons.length];
          const Icon =
            {
              Star,
              Cloud,
              Circle,
              Triangle,
              Square,
            }[IconName] as LucideIconComponent; // ✅ Typed properly

          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.floor(Math.random() * 22) + 12;
          const color = Math.random() > 0.5 ? "#10b981" : "#16a34a";
          const duration = Math.random() * 6 + 6;
          const delay = Math.random() * 5;
          const rotate = Math.random() > 0.5;

          return (
            <Icon
              key={i}
              className="absolute opacity-40"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                color,
                width: `${size}px`,
                height: `${size}px`,
                animation: `${rotate ? "float-rotate" : "float"} ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* Floating blobs */}
      <div
        aria-hidden
        className="absolute -left-8 -top-10 w-72 h-72 rounded-full"
        style={{
          background: "linear-gradient(135deg,#16a34a,#10b981)",
          filter: "blur(36px)",
          opacity: 0.22,
          transform: "rotate(12deg)",
        }}
      />
      <div
        aria-hidden
        className="absolute right-6 top-20 w-44 h-44 rounded-full float-blob"
        style={{
          background: "linear-gradient(135deg,#34d399,#6ee7b7)",
          filter: "blur(24px)",
          opacity: 0.28,
        }}
      />
      <div
        aria-hidden
        className="absolute left-6 bottom-20 w-56 h-56 rounded-full float-blob"
        style={{
          background: "linear-gradient(135deg,#059669,#047857)",
          filter: "blur(26px)",
          opacity: 0.15,
          animationDelay: "0.8s",
        }}
      />

      {/* Waves */}
      <div className="absolute left-0 right-0 top-0 h-[420px] pointer-events-none">
        <svg
          viewBox="0 0 1440 320"
          className="w-[240%] translate-x-0 wave-1"
          style={{ height: 420, overflow: "visible" }}
          preserveAspectRatio="xMinYMin slice"
          aria-hidden
        >
          <path
            fill="#fff"
            d="M0,256L48,234.7C96,213,192,171,288,138.7C384,107,480,85,576,74.7C672,64,768,64,864,96C960,128,1056,192,1152,197.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L0,320Z"
          />
        </svg>

        <svg
          viewBox="0 0 1440 320"
          className="w-[240%] translate-x-0 wave-2"
          style={{ height: 380, opacity: 0.85, transform: "translateY(50px)" }}
          preserveAspectRatio="xMinYMin slice"
          aria-hidden
        >
          <path
            fill="#fff"
            d="M0,192L48,197.3C96,203,192,213,288,213.3C384,213,480,203,576,197.3C672,192,768,192,864,181.3C960,171,1056,149,1152,144C1248,139,1344,149,1392,154.7L1440,160L1440,320L0,320Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - contact info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight hero-heading mb-6">
              Contact Us
            </h2>
            <p className="text-slate-700 mb-8 max-w-md">
              Have questions, feedback, or need support? We’re here to help you
              24/7 — just reach out.
            </p>
            <div className="space-y-4 text-slate-700">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-green-500" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-500" />
                <span>hello@servihub.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span>Ludhiana, Punjab</span>
              </div>
            </div>
          </div>

          {/* Right - contact form */}
          <form
            className="bg-white p-8 rounded-2xl shadow space-y-4"
            onSubmit={handleSubmit}
          >
            <div className="grid grid-cols-2 gap-3">
              <input
                name="firstName"
                placeholder="First name"
                className="rounded-xl px-[calc(1rem+2px)] py-[calc(0.75rem+2px)] outline-none bg-white bg-clip-padding border-[2px] border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#16a34a,#10b981)_border-box]"
                required
              />
              <input
                name="lastName"
                placeholder="Last name"
                className="rounded-xl px-[calc(1rem+2px)] py-[calc(0.75rem+2px)] outline-none bg-white bg-clip-padding border-[2px] border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#16a34a,#10b981)_border-box]"
              />
            </div>
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="rounded-xl px-[calc(1rem+2px)] py-[calc(0.75rem+2px)] outline-none bg-white bg-clip-padding border-[2px] border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#16a34a,#10b981)_border-box]"
              required
            />
            <textarea
              name="message"
              placeholder="Your message..."
              className="rounded-xl w-full h-28 px-[calc(1rem+2px)] py-[calc(0.75rem+2px)] outline-none bg-white bg-clip-padding border-[2px] border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(90deg,#16a34a,#10b981)_border-box]"
              required
            />
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-3 rounded-full font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {submitStatus === "success" ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Message Sent!
                  </motion.span>
                ) : submitStatus === "error" ? (
                  <motion.span
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center justify-center gap-2"
                  >
                    Failed. Try Again
                  </motion.span>
                ) : submitting ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Send Message
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </form>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-25px);
            opacity: 0.7;
          }
          100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
        }

        @keyframes float-rotate {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-25px) rotate(25deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
          }
        }

        @keyframes waveMove {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-40%);
          }
        }

        @keyframes floatUpDown {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-18px) scale(1.03);
            opacity: 1;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
        }

        .wave-1 {
          animation: waveMove 18s linear infinite;
        }
        .wave-2 {
          animation: waveMove 26s linear infinite reverse;
        }
        .float-blob {
          animation: floatUpDown 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
