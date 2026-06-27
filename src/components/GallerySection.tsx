"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const images = [
  { src: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&q=80", alt: "Precision haircut", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", alt: "Barber at work", span: "" },
  { src: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80", alt: "Skin fade", span: "" },
  { src: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80", alt: "Beard styling", span: "row-span-2" },
  { src: "https://images.unsplash.com/photo-1512864084360-7c0d4d72a03b?w=600&q=80", alt: "Clean cut", span: "" },
  { src: "https://images.unsplash.com/photo-1542189286-ef96d09ae03c?w=600&q=80", alt: "Hot shave", span: "" },
  { src: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&q=80", alt: "Shop interior", span: "" },
  { src: "https://images.unsplash.com/photo-1590540406806-23091aca0f78?w=600&q=80", alt: "Classic look", span: "" },
];

export default function GallerySection() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="gallery" className="py-28 bg-[#000000] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">Gallery</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-white"
          >
            Our <span className="gold-text italic">Work</span>
          </motion.h2>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setSelected(img.src)}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <ZoomIn
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>
              {/* Gold border on hover */}
              <div className="absolute inset-0 rounded-xl border-2 border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <img src={selected} alt="Gallery" className="w-full h-auto rounded-xl shadow-2xl" />
              <button
                onClick={() => setSelected(null)}
                className="cursor-pointer absolute -top-4 -right-4 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center hover:bg-[#F2C94C] transition-colors"
              >
                <X size={18} className="text-black" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
