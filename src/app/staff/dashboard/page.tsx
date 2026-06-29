"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Search, CalendarDays, Clock, User,
  CheckCircle, XCircle, AlertCircle, Loader2, Gift,
  Trash2, Plus, ChevronDown, Phone, Mail, Star, Tag, Scissors,
} from "lucide-react";
import Image from "next/image";
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

interface Offer {
  id: string;
  customerEmail: string;
  customerName: string;
  type: "discount" | "free_service" | "custom";
  value: string;
  message: string;
  expiryDate: string;
  used: boolean;
  createdAt: string;
}

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30", icon: AlertCircle },
  confirmed: { label: "Confirmed", color: "text-blue-400",   bg: "bg-blue-400/10 border-blue-400/30",   icon: CheckCircle },
  completed: { label: "Completed", color: "text-[#D4AF37]",  bg: "bg-[#D4AF37]/10 border-[#D4AF37]/30", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-400",    bg: "bg-red-400/10 border-red-400/30",    icon: XCircle },
};

const OFFER_TYPES = [
  { value: "discount",     label: "Discount %" },
  { value: "free_service", label: "Free Service" },
  { value: "custom",       label: "Custom Offer" },
];

export default function StaffDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"bookings" | "offers">("bookings");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // New offer form state
  const [offerForm, setOfferForm] = useState({
    customerEmail: "",
    customerName: "",
    type: "discount" as Offer["type"],
    value: "",
    message: "",
    expiryDate: "",
  });
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Auth check
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("staff_auth") !== "true") {
        router.replace("/staff/login");
      }
    }
  }, [router]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [bRes, oRes] = await Promise.all([
      fetch("/api/bookings"),
      fetch("/api/offers"),
    ]);
    const [b, o] = await Promise.all([bRes.json(), oRes.json()]);
    setBookings([...b].sort((a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setOffers([...o].sort((a: Offer, b: Offer) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await fetchData();
    setUpdatingId(null);
  };

  const deleteOffer = async (id: string) => {
    await fetch("/api/offers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchData();
  };

  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfferLoading(true);
    await fetch("/api/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offerForm),
    });
    setOfferLoading(false);
    setOfferSuccess(true);
    setOfferForm({ customerEmail: "", customerName: "", type: "discount", value: "", message: "", expiryDate: "" });
    await fetchData();
    setTimeout(() => setOfferSuccess(false), 3000);
  };

  const logout = () => {
    localStorage.removeItem("staff_auth");
    router.push("/staff/login");
  };

  // Stats
  const today = new Date().toISOString().split("T")[0];
  const stats = {
    today:     bookings.filter(b => b.date === today).length,
    upcoming:  bookings.filter(b => b.status === "confirmed" && b.date >= today).length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  // Filter bookings
  const filtered = bookings.filter(b => {
    const matchSearch = search === "" ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Unique customers for offer autocomplete
  const uniqueCustomers = Array.from(
    new Map(bookings.map(b => [b.email, { email: b.email, name: b.name }])).values()
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-[#D4AF37]/30 overflow-hidden">
              <Image src="/logo.png" alt="AK's Barber Shop" width={36} height={36} className="w-full h-full object-cover" priority />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-white leading-tight">AK&apos;s Barber Shop</p>
              <p className="text-[10px] text-[#D4AF37]/70 font-sans tracking-widest uppercase">Staff Dashboard</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-red-400 border border-white/10 hover:border-red-400/30 rounded-full transition-all duration-300 font-sans"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's Bookings", value: stats.today, color: "text-[#D4AF37]", border: "border-[#D4AF37]/20" },
            { label: "Upcoming",         value: stats.upcoming, color: "text-blue-400", border: "border-blue-400/20" },
            { label: "Completed",        value: stats.completed, color: "text-green-400", border: "border-green-400/20" },
            { label: "Cancelled",        value: stats.cancelled, color: "text-red-400", border: "border-red-400/20" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white/3 border ${s.border} rounded-2xl p-5`}
            >
              <p className={`text-3xl font-bold font-serif ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs font-sans mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["bookings", "offers"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-300 capitalize ${
                activeTab === tab
                  ? "bg-[#D4AF37] text-black"
                  : "bg-white/5 text-white/50 hover:text-white border border-white/10"
              }`}
            >
              {tab === "bookings" ? "Bookings" : "Special Offers"}
            </button>
          ))}
        </div>

        {/* ── BOOKINGS TAB ── */}
        {activeTab === "bookings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-sans outline-none focus:border-[#D4AF37]/40 transition-all placeholder:text-white/20"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none bg-[#0a0a0a] border border-white/10 rounded-xl px-4 pr-9 py-2.5 text-sm text-white font-sans outline-none focus:border-[#D4AF37]/40 transition-all cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={28} className="text-[#D4AF37] animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-white/30 font-sans text-sm">No bookings found.</div>
            ) : (
              <div className="space-y-3">
                {filtered.map((b, i) => {
                  const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.pending;
                  const StatusIcon = cfg.icon;
                  const services = Array.isArray(b.services) ? b.services : [b.services];
                  const activeOffer = offers.find(o => !o.used && o.customerEmail.toLowerCase() === b.email?.toLowerCase());
                  const pricing = calcWithOffer(services, activeOffer);
                  return (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white/3 border border-white/8 rounded-2xl p-5 hover:border-white/15 transition-all duration-300"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-serif font-semibold text-white">{b.name}</p>
                            <span className={`inline-flex items-center gap-1 text-[10px] font-sans px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                              <StatusIcon size={9} />
                              {cfg.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-white/40 font-sans">
                            <span className="flex items-center gap-1"><Phone size={10} />{b.phone}</span>
                            <span className="flex items-center gap-1"><Mail size={10} />{b.email}</span>
                            <span className="flex items-center gap-1"><CalendarDays size={10} />{b.date}</span>
                            <span className="flex items-center gap-1"><Clock size={10} />{b.time}</span>
                            <span className="flex items-center gap-1"><User size={10} />{b.barber}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {pricing.offerLabel && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-400/10 border border-green-400/20 text-green-400 font-sans">
                              <Tag size={8} /> Offer: {pricing.offerLabel}
                            </span>
                          )}
                          {pricing.discount > 0 && (
                            <span className="text-xs text-white/30 font-sans line-through">${pricing.subtotal}</span>
                          )}
                          <span className="text-lg font-bold font-serif text-[#D4AF37]">${pricing.total}</span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 flex-wrap">
                          {b.status === "pending" && (
                            <button
                              onClick={() => updateStatus(b.id, "confirmed")}
                              disabled={updatingId === b.id}
                              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium bg-blue-500/10 text-blue-400 border border-blue-400/20 rounded-lg hover:bg-blue-500/20 transition-all disabled:opacity-50"
                            >
                              {updatingId === b.id ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />}
                              Confirm
                            </button>
                          )}
                          {(b.status === "pending" || b.status === "confirmed") && (
                            <button
                              onClick={() => updateStatus(b.id, "completed")}
                              disabled={updatingId === b.id}
                              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/20 transition-all disabled:opacity-50"
                            >
                              {updatingId === b.id ? <Loader2 size={11} className="animate-spin" /> : <Star size={11} />}
                              Complete
                            </button>
                          )}
                          {b.status !== "cancelled" && b.status !== "completed" && (
                            <button
                              onClick={() => updateStatus(b.id, "cancelled")}
                              disabled={updatingId === b.id}
                              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-medium bg-red-500/10 text-red-400 border border-red-400/20 rounded-lg hover:bg-red-500/20 transition-all disabled:opacity-50"
                            >
                              {updatingId === b.id ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-1.5">
                        {services.map((s: string) => (
                          <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4AF37]/8 border border-[#D4AF37]/15 text-[#D4AF37]/80 font-sans flex items-center gap-1">
                            <Scissors size={8} />{s}
                          </span>
                        ))}
                      </div>
                      {b.notes && (
                        <p className="mt-2 text-xs text-white/30 font-sans border-t border-white/5 pt-2">Note: {b.notes}</p>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── OFFERS TAB ── */}
        {activeTab === "offers" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* Create offer form */}
            <div className="bg-white/3 border border-[#D4AF37]/15 rounded-2xl p-6">
              <h2 className="font-serif text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Gift size={18} className="text-[#D4AF37]" />
                Create Special Offer
              </h2>
              <p className="text-white/40 text-xs font-sans mb-6">Send a personalised offer to a customer by their email.</p>

              <form onSubmit={submitOffer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50 font-sans flex items-center gap-1.5"><Mail size={11} className="text-[#D4AF37]" />Customer Email</label>
                  <input
                    type="email"
                    required
                    list="customer-emails"
                    placeholder="customer@email.com"
                    value={offerForm.customerEmail}
                    onChange={e => setOfferForm(f => ({ ...f, customerEmail: e.target.value }))}
                    className="bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white font-sans outline-none transition-all placeholder:text-white/20"
                  />
                  <datalist id="customer-emails">
                    {uniqueCustomers.map(c => <option key={c.email} value={c.email}>{c.name}</option>)}
                  </datalist>
                </div>

                {/* Customer name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50 font-sans flex items-center gap-1.5"><User size={11} className="text-[#D4AF37]" />Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={offerForm.customerName}
                    onChange={e => setOfferForm(f => ({ ...f, customerName: e.target.value }))}
                    className="bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white font-sans outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                {/* Offer type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50 font-sans flex items-center gap-1.5"><Gift size={11} className="text-[#D4AF37]" />Offer Type</label>
                  <div className="relative">
                    <select
                      value={offerForm.type}
                      onChange={e => setOfferForm(f => ({ ...f, type: e.target.value as Offer["type"] }))}
                      className="appearance-none w-full bg-[#0a0a0a] border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 pr-9 py-2.5 text-sm text-white font-sans outline-none transition-all cursor-pointer"
                    >
                      {OFFER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  </div>
                </div>

                {/* Value */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50 font-sans flex items-center gap-1.5"><Star size={11} className="text-[#D4AF37]" />
                    {offerForm.type === "discount" ? "Discount Value (e.g. 20%)" : offerForm.type === "free_service" ? "Free Service Name" : "Offer Value"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={offerForm.type === "discount" ? "20%" : offerForm.type === "free_service" ? "Free Beard Trim" : "e.g. Buy 1 Get 1"}
                    value={offerForm.value}
                    onChange={e => setOfferForm(f => ({ ...f, value: e.target.value }))}
                    className="bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white font-sans outline-none transition-all placeholder:text-white/20"
                  />
                </div>

                {/* Expiry */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white/50 font-sans flex items-center gap-1.5"><CalendarDays size={11} className="text-[#D4AF37]" />Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={offerForm.expiryDate}
                    onChange={e => setOfferForm(f => ({ ...f, expiryDate: e.target.value }))}
                    className="bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white font-sans outline-none transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className="text-xs text-white/50 font-sans">Personal Message</label>
                  <textarea
                    required
                    placeholder="Hi! As a valued customer, we'd like to offer you..."
                    value={offerForm.message}
                    onChange={e => setOfferForm(f => ({ ...f, message: e.target.value }))}
                    rows={3}
                    className="bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-2.5 text-sm text-white font-sans outline-none transition-all resize-none placeholder:text-white/20"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={offerLoading}
                    className="cursor-pointer flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#F2C94C] disabled:opacity-50 text-black font-semibold text-sm rounded-xl transition-all duration-300"
                  >
                    {offerLoading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    Send Offer
                  </button>
                  <AnimatePresence>
                    {offerSuccess && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-green-400 text-sm font-sans flex items-center gap-1.5"
                      >
                        <CheckCircle size={14} /> Offer sent successfully!
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>

            {/* Existing offers */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-white mb-4">Active Offers ({offers.length})</h3>
              {offers.length === 0 ? (
                <div className="text-center py-12 text-white/30 font-sans text-sm">No offers created yet.</div>
              ) : (
                <div className="space-y-3">
                  {offers.map((o, i) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`bg-white/3 border rounded-2xl p-5 flex flex-wrap items-start justify-between gap-3 ${o.used ? "border-white/5 opacity-50" : "border-[#D4AF37]/15"}`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Gift size={14} className="text-[#D4AF37]" />
                          <p className="text-white font-semibold font-serif">{o.value}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans border ${o.used ? "text-white/30 bg-white/5 border-white/10" : "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20"}`}>
                            {o.used ? "Used" : "Active"}
                          </span>
                        </div>
                        <p className="text-white/50 text-xs font-sans">{o.customerName} · {o.customerEmail}</p>
                        <p className="text-white/40 text-xs font-sans mt-1 italic">&ldquo;{o.message}&rdquo;</p>
                        <p className="text-white/30 text-[10px] font-sans mt-1.5">Expires: {o.expiryDate}</p>
                      </div>
                      <button
                        onClick={() => deleteOffer(o.id)}
                        className="cursor-pointer p-2 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all duration-200"
                        aria-label="Delete offer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
