"use client";

import { motion } from "framer-motion";
import { Award, Clock, Star, Users, CalendarCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "15+ Years Experience",
    description: "Over a decade of mastering the craft of precision barbering.",
  },
  {
    icon: Award,
    title: "Award Winning",
    description: "Recognized as top barbershop for excellence and consistency.",
  },
  {
    icon: Star,
    title: "Premium Products",
    description: "Only the finest grooming products used on every client.",
  },
  {
    icon: Users,
    title: "Walk-ins Welcome",
    description: "No appointment? No problem. We welcome walk-in clients.",
  },
  {
    icon: CalendarCheck,
    title: "Online Booking",
    description: "Book your appointment 24/7 from your phone or computer.",
  },
  {
    icon: Sparkles,
    title: "Luxury Experience",
    description: "From the ambiance to the service — pure luxury every visit.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-28 bg-[#050505] relative overflow-hidden">
      {/* Gold accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">Why Choose Us</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-white"
          >
            The <span className="gold-text italic">AK&apos;s</span> Difference
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="group glass border border-white/5 hover:border-[#D4AF37]/20 rounded-2xl p-8 transition-all duration-400 cursor-default"
              >
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-14 h-14 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center mb-5 group-hover:bg-[#D4AF37]/20 transition-colors duration-300"
                >
                  <Icon size={26} className="text-[#D4AF37]" />
                </motion.div>
                <h3 className="font-serif text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[#C8C8C8] text-sm leading-relaxed font-sans">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
