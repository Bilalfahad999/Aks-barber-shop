"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, Calendar, CheckCircle, XCircle, Clock, RefreshCw,
  Users, CalendarCheck, Scissors, Filter, LogOut
} from "lucide-react";

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  barber: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
};

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass border border-white/5 rounded-2xl p-5"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <p className="text-[#C8C8C8] text-sm font-sans">{label}</p>
      <p className="font-serif text-3xl font-bold text-white mt-1">{value}</p>
    </motion.div>
  );
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterBarber, setFilterBarber] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data);
    } catch {
      console.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchBookings();
  }, [authenticated, fetchBookings]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123")) {
      setAuthenticated(true);
    } else {
      setPwError(true);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || [b.name, b.phone, b.email, b.service].some(
      (f) => f.toLowerCase().includes(search.toLowerCase())
    );
    const matchDate = !filterDate || b.date === filterDate;
    const matchBarber = !filterBarber || b.barber === filterBarber;
    const matchStatus = !filterStatus || b.status === filterStatus;
    return matchSearch && matchDate && matchBarber && matchStatus;
  });

  const today = new Date().toISOString().split("T")[0];
  const stats = {
    today: bookings.filter((b) => b.date === today).length,
    upcoming: bookings.filter((b) => b.status === "confirmed" && b.date >= today).length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  const barbers = Array.from(new Set(bookings.map((b) => b.barber)));

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-gold rounded-3xl p-10 w-full max-w-sm text-center"
        >
          <div className="w-14 h-14 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-6">
            <Scissors size={26} className="text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-[#C8C8C8] text-sm mb-8 font-sans">AK&apos;s Barber Shop Dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
              placeholder="Enter password"
              className={`w-full bg-white/5 border ${pwError ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white font-sans outline-none focus:border-[#D4AF37]/50 text-sm placeholder:text-white/20`}
            />
            {pwError && <p className="text-red-400 text-xs">Incorrect password</p>}
            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-[#D4AF37] hover:bg-[#F2C94C] text-black font-semibold rounded-xl transition-colors text-sm"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#D4AF37]/50 flex items-center justify-center">
              <Scissors size={14} className="text-[#D4AF37]" />
            </div>
            <div>
              <span className="font-serif font-bold gold-text">AK&apos;s</span>
              <span className="text-[#C8C8C8] text-sm ml-2 font-sans">Admin Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchBookings}
              className="cursor-pointer w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-[#D4AF37]/30 transition-colors"
              title="Refresh"
            >
              <RefreshCw size={14} className="text-[#C8C8C8]" />
            </button>
            <button
              onClick={() => setAuthenticated(false)}
              className="cursor-pointer flex items-center gap-2 text-sm text-[#C8C8C8] hover:text-white transition-colors font-sans"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={CalendarCheck} label="Today's Bookings" value={stats.today} color="bg-[#D4AF37]/10 text-[#D4AF37]" />
          <StatCard icon={Clock} label="Upcoming" value={stats.upcoming} color="bg-blue-500/10 text-blue-400" />
          <StatCard icon={CheckCircle} label="Completed" value={stats.completed} color="bg-green-500/10 text-green-400" />
          <StatCard icon={XCircle} label="Cancelled" value={stats.cancelled} color="bg-red-500/10 text-red-400" />
        </div>

        {/* Filters */}
        <div className="glass border border-white/5 rounded-2xl p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C8C8C8]" />
              <input
                type="text"
                placeholder="Search name, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm font-sans outline-none focus:border-[#D4AF37]/40 placeholder:text-white/20"
              />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-sans outline-none focus:border-[#D4AF37]/40"
            />
            <select
              value={filterBarber}
              onChange={(e) => setFilterBarber(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-sans outline-none focus:border-[#D4AF37]/40"
            >
              <option value="">All Barbers</option>
              {barbers.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm font-sans outline-none focus:border-[#D4AF37]/40"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="glass border border-white/5 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-white">
              Appointments <span className="text-[#D4AF37] ml-2">{filtered.length}</span>
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-[#C8C8C8] font-sans">Loading bookings...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-[#C8C8C8] font-sans">No bookings found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Client", "Service", "Barber", "Date & Time", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs text-[#C8C8C8] font-sans font-medium tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <motion.tr
                      key={b.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/3 hover:bg-white/2 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-white text-sm font-semibold font-serif">{b.name}</p>
                        <p className="text-[#C8C8C8] text-xs font-sans">{b.phone}</p>
                      </td>
                      <td className="px-5 py-4 text-[#C8C8C8] text-sm font-sans">{b.service}</td>
                      <td className="px-5 py-4 text-[#C8C8C8] text-sm font-sans">{b.barber}</td>
                      <td className="px-5 py-4">
                        <p className="text-white text-sm font-sans">{b.date}</p>
                        <p className="text-[#C8C8C8] text-xs font-sans">{b.time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-3 py-1 rounded-full border font-sans ${STATUS_STYLES[b.status]}`}>
                          {STATUS_LABELS[b.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {b.status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, "confirmed")}
                                className="cursor-pointer text-xs px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors font-sans"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, "cancelled")}
                                className="cursor-pointer text-xs px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors font-sans"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {b.status === "confirmed" && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, "completed")}
                                className="cursor-pointer text-xs px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors font-sans"
                              >
                                Complete
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, "cancelled")}
                                className="cursor-pointer text-xs px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors font-sans"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {(b.status === "completed" || b.status === "cancelled") && (
                            <span className="text-xs text-[#C8C8C8]/40 font-sans">—</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
