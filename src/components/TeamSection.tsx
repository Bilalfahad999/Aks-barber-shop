"use client";

import { motion } from "framer-motion";

const team = [
  {
    name: "KD",
    role: "Master Barber",
    experience: "8+ Years",
    specialties: ["Classic Cuts", "Skin Fades", "Beard Design"],
    // Replace with: /team/kd.jpg  (drop the real photo in /public/team/)
    image: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=400&q=80",
    delay: 0,
  },
  {
    name: "Ali",
    role: "Fade Specialist",
    experience: "5+ Years",
    specialties: ["Skin Fades", "Tapers", "Line-ups"],
    // Replace with: /team/ali.jpg
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&q=80",
    delay: 0.1,
  },
  {
    name: "Haleem",
    role: "Senior Barber",
    experience: "6+ Years",
    specialties: ["Modern Cuts", "Hot Shave", "Grooming"],
    // Replace with: /team/haleem.jpg
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80",
    delay: 0.2,
  },
  {
    name: "Jashan",
    role: "Beard Expert",
    experience: "4+ Years",
    specialties: ["Beard Sculpting", "Fades", "Styling"],
    // Replace with: /team/jashan.jpg
    image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=80",
    delay: 0.3,
  },
  {
    name: "KC",
    role: "Barber & Stylist",
    experience: "3+ Years",
    specialties: ["Kids Cuts", "Modern Styles", "Line-ups"],
    // Replace with: /team/kc.jpg
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&q=80",
    delay: 0.4,
  },
];

function TeamCard({ member }: { member: typeof team[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: member.delay, duration: 0.6 }}
      className="group relative"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 5 + member.delay * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: member.delay,
        }}
        className="glass border border-white/5 rounded-2xl p-6 text-center hover:border-[#D4AF37]/30 transition-all duration-400 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
      >
        {/* Image */}
        <div className="relative mx-auto mb-5 w-28 h-28">
          <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/30 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-all duration-400 animate-pulse-gold" />
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top rounded-full scale-95 group-hover:scale-100 transition-transform duration-400"
          />
        </div>

        {/* Info */}
        <h3 className="font-serif text-xl font-bold text-white mb-1">{member.name}</h3>
        <p className="gold-text text-sm font-medium font-sans mb-1">{member.role}</p>
        <p className="text-[#C8C8C8] text-xs font-sans mb-4">{member.experience} Experience</p>

        {/* Specialties */}
        <div className="flex flex-wrap gap-2 justify-center">
          {member.specialties.map((s) => (
            <span
              key={s}
              className="text-xs px-3 py-1 rounded-full bg-white/5 text-[#C8C8C8] border border-white/8"
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamSection() {
  return (
    <section id="team" className="py-28 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">Our Team</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Meet the <span className="gold-text italic">Artisans</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#C8C8C8] max-w-lg mx-auto font-sans"
          >
            Our skilled barbers bring passion, expertise, and artistry to every cut.
          </motion.p>
        </div>

        {/* 5-card responsive grid: 1 → 2 → 3 → 5 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
