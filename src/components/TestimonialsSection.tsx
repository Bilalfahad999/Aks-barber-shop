"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "James Wilson",
    review: "Best barber shop I've ever been to. The fade was absolutely perfect and the hot towel shave felt like pure luxury. I won't go anywhere else.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
    service: "Skin Fade + Hot Shave",
  },
  {
    name: "Marcus Johnson",
    review: "Alex is a true artist. He transformed my look completely. The attention to detail is unmatched and the atmosphere is top tier.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    service: "VIP Package",
  },
  {
    name: "David Clarke",
    review: "AK's is in a league of its own. Professional, clean, and my beard has never looked better. Highly recommend the beard sculpting.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=80&q=80",
    service: "Beard Trim",
  },
  {
    name: "Ryan Patel",
    review: "I've been coming here for 2 years. Consistent quality every single time. The team knows exactly what I want and delivers perfection.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80",
    service: "Hair + Beard Combo",
  },
  {
    name: "Kevin Osei",
    review: "Walked in feeling ordinary, left feeling like a king. The whole experience from booking to service is world-class.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531727991582-cfd25ce79613?w=80&q=80",
    service: "Classic Haircut",
  },
  {
    name: "Thomas Reed",
    review: "Premium products, premium barbers, premium experience. Worth every penny. My go-to spot for grooming in the city.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
    service: "Luxury Hot Towel Shave",
  },
];

function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-80 glass-gold rounded-2xl p-6 mx-3">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array(t.rating).fill(0).map((_, i) => (
          <Star key={i} size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
        ))}
      </div>

      {/* Review */}
      <p className="text-[#C8C8C8] text-sm leading-relaxed mb-5 font-sans italic">
        &ldquo;{t.review}&rdquo;
      </p>

      {/* Divider */}
      <div className="w-full h-px bg-[#D4AF37]/20 mb-4" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={t.image}
          alt={t.name}
          className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/30"
        />
        <div>
          <p className="text-white text-sm font-semibold font-serif">{t.name}</p>
          <p className="text-[#D4AF37] text-xs font-sans">{t.service}</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-28 bg-[#080808] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">Testimonials</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-white"
          >
            What Our <span className="gold-text italic">Clients Say</span>
          </motion.h2>
        </div>
      </div>

      {/* Infinite scroll carousel */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#080808] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#080808] to-transparent pointer-events-none" />

        <div className="flex animate-scroll-left">
          {doubled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
