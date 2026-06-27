"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[#D4AF37]"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.1, 0.5, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + delay,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

type Particle = { id: number; x: number; y: number; size: number; delay: number };

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToServices = () => {
    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background parallax image */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5,
        }}
      >
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </motion.div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* Gold lines decoration */}
      <div className="absolute top-1/2 left-0 w-24 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
      <div className="absolute top-1/2 right-0 w-24 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/40" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-28 md:pt-32">
        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <span className="w-8 h-px bg-[#D4AF37]" />
          <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">
            Premium Grooming Experience
          </span>
          <span className="w-8 h-px bg-[#D4AF37]" />
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="font-serif text-6xl md:text-8xl font-bold leading-tight mb-6"
        >
          <span className="text-white">Precision.</span>{" "}
          <span className="gold-text">Style.</span>
          <br />
          <span className="text-white italic">Confidence.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="text-[#C8C8C8] text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed font-sans"
        >
          Premium haircuts, beard styling, fades, grooming and luxury barber experience — crafted for the modern gentleman.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={scrollToBooking}
            className="cursor-pointer group relative px-8 py-4 bg-[#D4AF37] text-black font-semibold rounded-full text-sm tracking-widest uppercase overflow-hidden hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-400"
          >
            <span className="relative z-10">Book Appointment</span>
            <div className="absolute inset-0 bg-[#F2C94C] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-400" />
          </button>
          <button
            onClick={scrollToServices}
            className="cursor-pointer px-8 py-4 border border-white/20 text-white font-medium rounded-full text-sm tracking-widest uppercase hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300"
          >
            View Services
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-20 flex items-center justify-center gap-12 flex-wrap"
        >
          {[
            { num: "15+", label: "Years Experience" },
            { num: "5K+", label: "Happy Clients" },
            { num: "4", label: "Expert Barbers" },
            { num: "★ 5.0", label: "Google Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-2xl font-bold gold-text">{stat.num}</div>
              <div className="text-[#C8C8C8] text-xs tracking-widest uppercase font-sans mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToServices}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-[#C8C8C8]/60 hover:text-[#D4AF37] transition-colors"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} />
        </motion.div>
      </motion.button>
    </section>
  );
}
