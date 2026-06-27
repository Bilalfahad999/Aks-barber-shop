"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, Clock, User, Scissors, CheckCircle, XCircle, AlertCircle, Loader2, ArrowLeft, Phone, Gift, Star, LogOut, Tag } from "lucide-react";
import { calcWithOffer } from "@/lib/pricing";

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string;
  barber: string;
  services: string[];
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20", icon: CheckCircle },
  completed: { label: "Completed", color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10 border-[#D4AF37]/20", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", icon: XCircle },
};

interface Offer {
  id: string;
  customerEmail: string;
  customerName: string;
  type: string;
  value: string;
  message: string;
  expiryDate: string;
  used: boolean;
  createdAt: string;
}

function AppointmentsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<{ email: string; name: string } | null>(null);

  // Auth check — redirect to login if no session
  useEffect(() => {
    const raw = sessionStorage.getItem("client_session");
    if (!raw) {
      router.replace("/signin");
      return;
    }
    const s = JSON.parse(raw);
    setSession(s);
  }, [router]);

  const email = session?.email || params.get("email") || "";

  useEffect(() => {
    if (!email) return;
    Promise.all([
      fetch(`/api/bookings?email=${encodeURIComponent(email)}`).then(r => r.json()),
      fetch(`/api/offers?email=${encodeURIComponent(email)}`).then(r => r.json()),
    ]).then(([bookingData, offerData]) => {
      setBookings([...bookingData].sort(
        (a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ));
      setOffers(offerData);
    }).finally(() => setLoading(false));
  }, [email]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr + "T00:00:00").toLocaleDateString("en-CA", {
        weekday: "short", year: "numeric", month: "short", day: "numeric"
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#C8C8C8]/60 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-sans cursor-pointer">
            <ArrowLeft size={15} />
            Back to site
          </Link>
          <div className="flex items-center gap-3">
            {session && (
              <span className="text-white/50 text-xs font-sans hidden sm:block">
                Hi, <span className="text-[#D4AF37]">{session.name}</span>
              </span>
            )}
            <button
              onClick={() => { sessionStorage.removeItem("client_session"); router.push("/signin"); }}
              className="cursor-pointer flex items-center gap-1.5 text-white/30 hover:text-red-400 text-xs font-sans transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans mb-2">Booking History</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
            My <span className="gold-text italic">Appointments</span>
          </h1>
          <p className="text-[#C8C8C8]/60 text-sm font-sans mt-2">{email}</p>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={32} className="text-[#D4AF37] animate-spin" />
            <p className="text-[#C8C8C8]/60 text-sm font-sans">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-white/20" />
            </div>
            <p className="text-white/60 font-sans mb-6">No appointments found for this email.</p>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#F2C94C] text-black font-semibold rounded-full text-sm transition-all duration-300 cursor-pointer"
            >
              Book an Appointment
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
            >
              {(["pending", "confirmed", "completed", "cancelled"] as const).map((s) => {
                const count = bookings.filter((b) => b.status === s).length;
                const cfg = STATUS_CONFIG[s];
                return (
                  <div key={s} className={`rounded-xl border p-3 text-center ${cfg.bg}`}>
                    <p className={`text-xl font-bold font-serif ${cfg.color}`}>{count}</p>
                    <p className="text-xs text-[#C8C8C8]/60 font-sans capitalize mt-0.5">{cfg.label}</p>
                  </div>
                );
              })}
            </motion.div>

            {/* Booking cards */}
            {bookings.map((b, i) => {
              const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const serviceList = Array.isArray(b.services) ? b.services : [b.services];
              const activeOffer = offers.find(o => !o.used && o.customerEmail.toLowerCase() === b.email?.toLowerCase());
              const pricing = calcWithOffer(serviceList, activeOffer);
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-white font-serif font-semibold text-lg">{b.name}</p>
                      <p className="text-[#C8C8C8]/50 text-xs font-sans mt-0.5">
                        Booked {new Date(b.createdAt).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-sans font-medium px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.color} flex-shrink-0`}>
                      <StatusIcon size={11} />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-[#C8C8C8]">
                      <CalendarDays size={13} className="text-[#D4AF37] flex-shrink-0" />
                      <span className="font-sans">{formatDate(b.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#C8C8C8]">
                      <Clock size={13} className="text-[#D4AF37] flex-shrink-0" />
                      <span className="font-sans">{b.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#C8C8C8]">
                      <User size={13} className="text-[#D4AF37] flex-shrink-0" />
                      <span className="font-sans">{b.barber}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#C8C8C8]">
                      <Phone size={13} className="text-[#D4AF37] flex-shrink-0" />
                      <span className="font-sans">{b.phone}</span>
                    </div>
                  </div>

                  {/* Services + Price */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {serviceList.map((s: string) => (
                        <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#D4AF37]/8 border border-[#D4AF37]/20 text-[#D4AF37] font-sans">
                          <Scissors size={9} />
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      {pricing.offerLabel && (
                        <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 font-sans">
                          <Tag size={8} /> {pricing.offerLabel}
                        </span>
                      )}
                      {pricing.discount > 0 && (
                        <span className="text-xs text-[#C8C8C8]/30 font-sans line-through">${pricing.subtotal}</span>
                      )}
                      <span className="text-base font-bold font-serif text-[#D4AF37]">${pricing.total}</span>
                    </div>
                  </div>

                  {b.notes && (
                    <p className="mt-3 text-xs text-[#C8C8C8]/50 font-sans border-t border-white/5 pt-3">
                      Note: {b.notes}
                    </p>
                  )}
                </motion.div>
              );
            })}

            {/* Special Offers */}
            {offers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: bookings.length * 0.07 + 0.1 }}
                className="mt-6"
              >
                <h2 className="font-serif text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Gift size={16} className="text-[#D4AF37]" />
                  Your Special Offers
                </h2>
                <div className="space-y-3">
                  {offers.map((o) => (
                    <div
                      key={o.id}
                      className={`rounded-2xl border p-5 ${o.used ? "border-white/5 opacity-50" : "border-[#D4AF37]/30 bg-[#D4AF37]/5"}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-[#D4AF37]" />
                          <span className="text-white font-bold font-serif">{o.value}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-sans ${o.used ? "text-white/30 border-white/10" : "text-[#D4AF37] border-[#D4AF37]/30 bg-[#D4AF37]/10"}`}>
                          {o.used ? "Used" : "Active"}
                        </span>
                      </div>
                      <p className="text-[#C8C8C8]/70 text-sm font-sans italic">&ldquo;{o.message}&rdquo;</p>
                      <p className="text-white/30 text-xs font-sans mt-2">Expires: {o.expiryDate}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Book again CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: bookings.length * 0.07 + 0.2 }}
              className="text-center pt-6"
            >
              <Link
                href="/#booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#F2C94C] text-black font-semibold rounded-full text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                <Scissors size={14} />
                Book Another Appointment
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 size={32} className="text-[#D4AF37] animate-spin" />
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  );
}
