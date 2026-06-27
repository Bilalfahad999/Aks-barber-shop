"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";

const hours = [
  { day: "Monday – Friday", time: "10:00 AM – 8:00 PM" },
  { day: "Saturday", time: "9:00 AM – 8:00 PM" },
  { day: "Sunday", time: "10:00 AM – 6:30 PM" },
];

const locations = [
  {
    label: "Location 1 – East London",
    address: "1498 Dundas St, London, ON N5W 3B9, Canada",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=1498+Dundas+St+London+ON+N5W+3B9+Canada",
    embed: "https://maps.google.com/maps?q=1498+Dundas+St,+London,+ON+N5W+3B9,+Canada&output=embed&z=15",
  },
  {
    label: "Location 2 – West London",
    address: "1061 Wonderland Rd S Unit 5, London, ON N6K 3X4, Canada",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=1061+Wonderland+Rd+S+London+ON+N6K+3X4+Canada",
    embed: "https://maps.google.com/maps?q=1061+Wonderland+Rd+S,+London,+ON+N6K+3X4,+Canada&output=embed&z=15",
  },
];

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.28 8.28 0 004.84 1.56V6.78a4.85 4.85 0 01-1.07-.09z" />
    </svg>
  );
}

export default function LocationSection() {
  return (
    <section id="location" className="py-28 bg-[#000000] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

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
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">Find Us</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-white"
          >
            Visit <span className="gold-text italic">Our Shops</span>
          </motion.h2>
        </div>

        {/* Info row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
        >
          {/* Addresses */}
          <div className="glass border border-white/5 rounded-2xl p-6 space-y-4 md:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <MapPin size={16} className="text-[#D4AF37] flex-shrink-0" />
              <p className="text-white font-semibold font-serif text-sm">Our Locations</p>
            </div>
            {locations.map((loc, i) => (
              <div key={i} className="pl-1 space-y-1">
                <p className="text-[#D4AF37] text-xs font-sans font-medium">{loc.label}</p>
                <p className="text-[#C8C8C8] text-xs font-sans leading-relaxed">{loc.address}</p>
                <a
                  href={loc.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer inline-flex items-center gap-1 text-xs text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors font-sans"
                >
                  <Navigation size={10} />
                  Get Directions
                </a>
              </div>
            ))}
          </div>

          {/* Phone & Email */}
          <div className="glass border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                <Phone size={15} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1 font-serif text-sm">Phone</p>
                <a
                  href="tel:+15194577777"
                  className="text-[#C8C8C8] text-sm font-sans hover:text-[#D4AF37] transition-colors cursor-pointer"
                >
                  +1 (519) 457-7777
                </a>
              </div>
            </div>
            <div className="w-full h-px bg-white/5" />
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                <Mail size={15} className="text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white font-semibold mb-1 font-serif text-sm">Email</p>
                <a
                  href="mailto:akbarbershop2@gmail.com"
                  className="text-[#C8C8C8] text-sm font-sans hover:text-[#D4AF37] transition-colors cursor-pointer break-all"
                >
                  akbarbershop2@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="glass border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock size={16} className="text-[#D4AF37]" />
              <p className="text-white font-semibold font-serif text-sm">Opening Hours</p>
            </div>
            <div className="space-y-3">
              {hours.map((h) => (
                <div key={h.day} className="flex justify-between text-sm font-sans gap-3">
                  <span className="text-[#C8C8C8]">{h.day}</span>
                  <span className="text-[#D4AF37] text-right flex-shrink-0">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two Maps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {locations.map((loc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
              <p className="text-[#D4AF37] text-xs font-sans font-medium tracking-wider uppercase flex items-center gap-2">
                <MapPin size={12} />
                {loc.label}
              </p>
              <div className="rounded-2xl overflow-hidden border border-white/5 h-64">
                <iframe
                  src={loc.embed}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={loc.label}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <p className="text-[#C8C8C8]/60 text-sm font-sans">Follow us:</p>
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/akbarberz/?igshid=MzRlODBiNWFlZA%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-[#C8C8C8] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_14px_rgba(212,175,55,0.2)] transition-all duration-300 text-sm font-sans"
            >
              <InstagramIcon />
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@aks_barbershop?_t=8gq3vyyqs7R&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-[#C8C8C8] hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_14px_rgba(212,175,55,0.2)] transition-all duration-300 text-sm font-sans"
            >
              <TikTokIcon />
              TikTok
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
