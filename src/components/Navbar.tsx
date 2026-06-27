"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Scissors, CalendarCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Team", href: "#team" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#location" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clientSession, setClientSession] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const raw = sessionStorage.getItem("client_session");
    if (raw) {
      try { setClientSession(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("client_session");
    setClientSession(null);
    setMobileOpen(false);
  };

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo("#home")} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/60 flex items-center justify-center group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all duration-300">
              <Scissors size={16} className="text-[#D4AF37] group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="leading-tight">
              <span className="block font-serif text-lg font-bold gold-text tracking-wide">AK&apos;s</span>
              <span className="block text-[8px] text-[#C8C8C8] tracking-[0.35em] uppercase font-sans">Barber Shop</span>
            </div>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-5 lg:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="relative text-sm text-[#C8C8C8] hover:text-white transition-colors duration-300 group cursor-pointer"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            {/* My Bookings / Logged-in state */}
            {clientSession ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/appointments"
                  className="cursor-pointer flex items-center gap-1.5 px-3 lg:px-4 py-2 text-sm font-medium text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 rounded-full transition-all duration-300"
                >
                  <CalendarCheck size={14} />
                  <span className="hidden lg:inline">Hi, {clientSession.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="cursor-pointer text-xs text-white/30 hover:text-red-400 transition-colors duration-300 font-sans hidden lg:inline"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="cursor-pointer flex items-center gap-1.5 px-3 lg:px-4 py-2 text-sm font-medium text-[#C8C8C8] border border-white/10 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] rounded-full transition-all duration-300"
              >
                <CalendarCheck size={14} />
                <span className="hidden lg:inline">My Bookings</span>
              </Link>
            )}
            {/* Staff Portal */}
            <Link
              href="/staff/login"
              className="cursor-pointer flex items-center gap-1.5 px-3 lg:px-4 py-2 text-sm font-medium text-[#C8C8C8] border border-white/10 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] rounded-full transition-all duration-300"
            >
              <ShieldCheck size={14} />
              <span className="hidden lg:inline">Staff Portal</span>
            </Link>
            {/* Book Now */}
            <button
              onClick={() => scrollTo("#booking")}
              className="cursor-pointer px-5 py-2 text-sm font-medium text-black bg-[#D4AF37] hover:bg-[#F2C94C] rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] tracking-wide"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white cursor-pointer"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 z-40 bg-black/98 backdrop-blur-xl border-b border-white/5 px-6 py-8 flex flex-col gap-5 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => scrollTo(link.href)}
                className="text-left text-lg font-serif text-[#C8C8C8] hover:text-[#D4AF37] transition-colors cursor-pointer"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => scrollTo("#booking")}
              className="mt-2 w-full py-3 text-black bg-[#D4AF37] rounded-full font-medium cursor-pointer"
            >
              Book Appointment
            </motion.button>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              {clientSession ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/appointments"
                    onClick={() => setMobileOpen(false)}
                    className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 text-[#D4AF37] border border-[#D4AF37]/30 rounded-full font-medium text-sm transition-all duration-300"
                  >
                    <CalendarCheck size={15} />
                    Hi, {clientSession.name.split(" ")[0]} — My Bookings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="cursor-pointer text-xs text-white/30 hover:text-red-400 transition-colors text-center py-1"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 text-[#C8C8C8] border border-white/10 rounded-full font-medium text-sm hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all duration-300"
                >
                  <CalendarCheck size={15} />
                  My Bookings
                </Link>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/staff/login"
                onClick={() => setMobileOpen(false)}
                className="cursor-pointer flex items-center justify-center gap-2 w-full py-3 text-[#C8C8C8] border border-white/10 rounded-full font-medium text-sm hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all duration-300"
              >
                <ShieldCheck size={15} />
                Staff Portal
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
