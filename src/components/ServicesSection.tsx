"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Scissors, Star, Zap, Leaf, Users, Crown, Droplets, Gift } from "lucide-react";

const services = [
  {
    icon: Scissors,
    name: "Classic Haircut",
    description: "Precision cut tailored to your style and face shape by expert hands.",
    price: "$40",
    popular: false,
  },
  {
    icon: Zap,
    name: "Skin Fade",
    description: "Seamless gradient fade blended to perfection for a sharp, modern look.",
    price: "$50",
    popular: true,
  },
  {
    icon: Star,
    name: "Beard Trim",
    description: "Sculpted and shaped beard styling to complement your features.",
    price: "$25",
    popular: false,
  },
  {
    icon: Crown,
    name: "Hair + Beard Combo",
    description: "Complete grooming package — haircut and beard shaping in one session.",
    price: "$60",
    popular: true,
  },
  {
    icon: Users,
    name: "Kids Cut",
    description: "Gentle and fun haircuts for children in a welcoming environment.",
    price: "$30",
    popular: false,
  },
  {
    icon: Leaf,
    name: "Hot Towel Shave",
    description: "Luxury straight razor shave with hot towel and premium oils.",
    price: "$45",
    popular: false,
  },
  {
    icon: Droplets,
    name: "Hair Wash",
    description: "Deep cleanse and scalp massage with premium salon products.",
    price: "$15",
    popular: false,
  },
  {
    icon: Gift,
    name: "VIP Package",
    description: "The ultimate grooming experience — cut, beard, wash, and hot towel.",
    price: "$90",
    popular: false,
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const Icon = service.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      whileHover={{ y: -8 }}
      className="relative group cursor-pointer"
    >
      {service.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-black text-xs font-semibold rounded-full tracking-widest uppercase z-10">
          Popular
        </div>
      )}
      <div
        className={`relative h-full rounded-2xl p-6 transition-all duration-400 overflow-hidden
          ${service.popular
            ? "glass-gold border border-[#D4AF37]/20"
            : "glass border border-white/5 hover:border-[#D4AF37]/20"
          }
          group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}
      >
        {/* Gold border animation on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.1), transparent, rgba(212,175,55,0.05))" }}
        />

        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300
          ${service.popular
            ? "bg-[#D4AF37]/20 group-hover:bg-[#D4AF37]/30"
            : "bg-white/5 group-hover:bg-[#D4AF37]/10"
          }`}
        >
          <Icon
            size={22}
            className={`transition-colors duration-300 ${service.popular ? "text-[#D4AF37]" : "text-[#C8C8C8] group-hover:text-[#D4AF37]"}`}
          />
        </div>

        {/* Content */}
        <h3 className="font-serif text-xl font-semibold text-white mb-2">{service.name}</h3>
        <p className="text-[#C8C8C8] text-sm leading-relaxed mb-5 font-sans">{service.description}</p>

        {/* Price + Book */}
        <div className="flex items-center justify-between">
          <span className="font-serif text-2xl font-bold gold-text">{service.price}</span>
          <button
            onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
            className="cursor-pointer text-xs text-[#D4AF37] border border-[#D4AF37]/30 px-4 py-2 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          >
            Book
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="py-28 bg-[#000000] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-[#D4AF37]/30" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">Our Services</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Crafted for the{" "}
            <span className="gold-text italic">Modern Gentleman</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#C8C8C8] max-w-lg mx-auto font-sans"
          >
            Every service is delivered with precision, care, and the highest quality products.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <ServiceCard key={service.name} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
