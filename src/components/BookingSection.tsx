"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle, CalendarDays, Clock, User, Phone, Scissors, FileText, Check, ChevronDown, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(7, "Valid phone required"),
  barber: z.string().min(1, "Please select a barber"),
  services: z.array(z.string()).min(1, "Please select at least one service"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const barbers = ["KD", "Ali", "Haleem", "Jashan", "KC", "Any Available"];

const SERVICE_LIST = [
  { label: "Classic Haircut", price: "$40" },
  { label: "Skin Fade", price: "$50" },
  { label: "Beard Trim", price: "$25" },
  { label: "Hair + Beard Combo", price: "$60" },
  { label: "Kids Cut", price: "$30" },
  { label: "Luxury Hot Towel Shave", price: "$45" },
  { label: "Hair Wash", price: "$15" },
  { label: "VIP Grooming Package", price: "$90" },
];

const times = ["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","12:30 PM","1:00 PM","1:30 PM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","4:30 PM","5:00 PM","5:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM"];

function InputField({
  label, icon: Icon, error, ...props
}: { label: string; icon: React.ElementType; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-[#C8C8C8] font-sans flex items-center gap-2">
        <Icon size={13} className="text-[#D4AF37]" />
        {label}
      </label>
      <input
        {...props}
        className={`w-full bg-white/5 border ${error ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white text-sm font-sans outline-none focus:border-[#D4AF37]/50 focus:bg-white/8 transition-all duration-300 placeholder:text-white/20`}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

function SelectField({
  label, icon: Icon, children, error, ...props
}: { label: string; icon: React.ElementType; children: React.ReactNode; error?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-[#C8C8C8] font-sans flex items-center gap-2">
        <Icon size={13} className="text-[#D4AF37]" />
        {label}
      </label>
      <select
        {...props}
        className={`w-full bg-[#0a0a0a] border ${error ? "border-red-500/50" : "border-white/10"} rounded-xl px-4 py-3 text-white text-sm font-sans outline-none focus:border-[#D4AF37]/50 transition-all duration-300 appearance-none`}
      >
        {children}
      </select>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}

export default function BookingSection() {
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [minDate, setMinDate] = useState("");

  // Login gate state
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const [showLoginGate, setShowLoginGate] = useState(false);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginName, setLoginName] = useState("");
  const [loginConfirm, setLoginConfirm] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { services: [] },
  });

  const toggleService = (label: string) => {
    const updated = selectedServices.includes(label)
      ? selectedServices.filter((s) => s !== label)
      : [...selectedServices, label];
    setSelectedServices(updated);
    setValue("services", updated);
    trigger("services");
  };

  const submitBooking = async (data: FormData, email: string) => {
    setSubmitting(true);
    try {
      await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, email }),
      });
      toast.success("Appointment booked successfully!");
      const serviceList = data.services.join(", ");
      const msg = encodeURIComponent(
        `Hello AK's Barber Shop,\nI would like to confirm my appointment.\n\n` +
        `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${email}\nServices: ${serviceList}\nBarber: ${data.barber}\nDate: ${data.date}\nTime: ${data.time}\n\nThank you.`
      );
      setTimeout(() => { window.open(`https://wa.me/15194577777?text=${msg}`, "_blank"); }, 1500);
      reset();
      setSelectedServices([]);
      setPendingData(null);
      setShowLoginGate(false);
      setSuccess(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    const raw = sessionStorage.getItem("client_session");
    if (raw) {
      const session = JSON.parse(raw);
      await submitBooking(data, session.email);
    } else {
      // Not logged in — show login gate before booking
      setPendingData(data);
      setLoginName(data.name);
      setShowLoginGate(true);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail.trim() || !loginPassword) { setLoginError("Please fill in all fields."); return; }
    if (loginMode === "register") {
      if (!loginName.trim()) { setLoginError("Please enter your name."); return; }
      if (loginPassword.length < 6) { setLoginError("Password must be at least 6 characters."); return; }
      if (loginPassword !== loginConfirm) { setLoginError("Passwords do not match."); return; }
    }
    setLoginLoading(true);
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: loginMode, email: loginEmail.trim(), password: loginPassword, name: loginName.trim() }),
      });
      const data = await res.json();
      if (!data.success) { setLoginError(data.error || "Something went wrong."); setLoginLoading(false); return; }
      const sessionEmail = loginEmail.trim().toLowerCase();
      sessionStorage.setItem("client_session", JSON.stringify({ email: sessionEmail, name: data.name }));
      // Now submit the pending booking with the authenticated email
      if (pendingData) await submitBooking(pendingData, sessionEmail);
    } catch {
      setLoginError("Network error. Please try again.");
      setLoginLoading(false);
    }
  };

  return (
    <section id="booking" className="py-28 bg-[#050505] relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <span className="w-8 h-px bg-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs tracking-[0.4em] uppercase font-sans">Book Appointment</span>
            <span className="w-8 h-px bg-[#D4AF37]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl font-bold text-white"
          >
            Reserve Your <span className="gold-text italic">Session</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#C8C8C8] mt-3 font-sans text-sm"
          >
            Book online and confirm instantly via WhatsApp.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {/* Login gate — shown before booking is submitted */}
          {showLoginGate ? (
            <motion.div
              key="login-gate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-gold rounded-3xl p-8 md:p-10"
            >
              {/* Tab switcher */}
              <div className="flex border-b border-white/5 mb-6">
                {(["login", "register"] as const).map(m => (
                  <button key={m} type="button" onClick={() => { setLoginMode(m); setLoginError(""); }}
                    className={`cursor-pointer flex-1 py-3 text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 ${loginMode === m ? "text-[#D4AF37] border-b border-[#D4AF37]" : "text-white/30 hover:text-white/60"}`}>
                    {m === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-3">
                  <Lock size={18} className="text-[#D4AF37]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {loginMode === "login" ? "Sign in to confirm booking" : "Create an account to book"}
                </h3>
                <p className="text-[#C8C8C8]/60 text-xs font-sans mt-1">
                  {loginMode === "login" ? "Your appointment will be saved after sign in." : "A free account lets you track all your appointments."}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {loginMode === "register" && (
                  <input type="text" placeholder="Your full name" value={loginName}
                    onChange={e => { setLoginName(e.target.value); setLoginError(""); }}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-3 text-white text-sm font-sans outline-none transition-all placeholder:text-white/20" />
                )}
                <input type="email" placeholder="Email address" value={loginEmail}
                  onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-3 text-white text-sm font-sans outline-none transition-all placeholder:text-white/20" />
                <div className="relative">
                  <input type={showLoginPw ? "text" : "password"} placeholder="Password" value={loginPassword}
                    onChange={e => { setLoginPassword(e.target.value); setLoginError(""); }}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-3 pr-10 text-white text-sm font-sans outline-none transition-all placeholder:text-white/20" />
                  <button type="button" onClick={() => setShowLoginPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/25 hover:text-[#D4AF37] transition-colors">
                    {showLoginPw ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                </div>
                {loginMode === "register" && (
                  <input type={showLoginPw ? "text" : "password"} placeholder="Confirm password" value={loginConfirm}
                    onChange={e => { setLoginConfirm(e.target.value); setLoginError(""); }}
                    className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl px-4 py-3 text-white text-sm font-sans outline-none transition-all placeholder:text-white/20" />
                )}
                {loginError && <p className="text-red-400 text-xs font-sans text-center">{loginError}</p>}
                <button type="submit" disabled={loginLoading}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] hover:bg-[#F2C94C] disabled:opacity-50 text-black font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                  {loginLoading
                    ? <div className="w-4 h-4 border-2 border-black/40 border-t-transparent rounded-full animate-spin" />
                    : <><span>{loginMode === "login" ? "Sign In & Confirm Booking" : "Create Account & Book"}</span><ArrowRight size={14} /></>}
                </button>
                <button type="button" onClick={() => { setShowLoginGate(false); setPendingData(null); }}
                  className="cursor-pointer w-full text-center text-xs text-white/30 hover:text-white/60 transition-colors py-1 font-sans">
                  ← Back to booking form
                </button>
              </form>
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-gold rounded-3xl p-16 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-[#D4AF37]" />
              </motion.div>
              <h3 className="font-serif text-3xl font-bold text-white mb-3">Booking Confirmed!</h3>
              <p className="text-[#C8C8C8] mb-8 font-sans">
                Opening WhatsApp to confirm your appointment...
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => { setSuccess(false); }}
                  className="cursor-pointer px-8 py-3 bg-[#D4AF37] text-black font-semibold rounded-full hover:bg-[#F2C94C] transition-colors"
                >
                  Book Another
                </button>
                <a href="/appointments"
                  className="cursor-pointer px-8 py-3 border border-[#D4AF37]/40 text-[#D4AF37] font-semibold rounded-full hover:bg-[#D4AF37]/10 transition-colors text-center text-sm"
                >
                  View My Bookings
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit(onSubmit)}
              className="glass border border-white/5 rounded-3xl p-8 md:p-10 space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Full Name"
                  icon={User}
                  placeholder="Your name"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <InputField
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  placeholder="+1 519 457-7777"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>

              <SelectField label="Preferred Barber" icon={User} error={errors.barber?.message} {...register("barber")}>
                <option value="">Select barber...</option>
                {barbers.map(b => <option key={b} value={b}>{b}</option>)}
              </SelectField>

              {/* Multi-select Services Dropdown */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm text-[#C8C8C8] font-sans flex items-center gap-2">
                  <Scissors size={13} className="text-[#D4AF37]" />
                  Services
                  <span className="text-[#D4AF37]/60 text-xs">(select one or more)</span>
                </label>

                {/* Trigger */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className={`cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-sans transition-all duration-200
                    ${dropdownOpen ? "border-[#D4AF37]/50 bg-white/8" : "border-white/10 bg-white/5 hover:border-white/20"}
                    ${errors.services ? "border-red-500/50" : ""}`}
                >
                  <span className={selectedServices.length ? "text-white" : "text-white/25"}>
                    {selectedServices.length === 0
                      ? "Select services..."
                      : selectedServices.length === 1
                      ? selectedServices[0]
                      : `${selectedServices.length} services selected`}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-[#D4AF37] transition-transform duration-200 flex-shrink-0 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#0e0e0e] border border-white/10 rounded-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                    {SERVICE_LIST.map(({ label, price }) => {
                      const checked = selectedServices.includes(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleService(label)}
                          className={`cursor-pointer w-full flex items-center justify-between px-4 py-3 text-left transition-all duration-150 border-b border-white/5 last:border-0
                            ${checked ? "bg-[#D4AF37]/8" : "hover:bg-white/4"}`}
                        >
                          <span className={`text-sm font-sans ${checked ? "text-white" : "text-[#C8C8C8]"}`}>
                            {label}
                          </span>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`text-xs font-serif font-bold ${checked ? "text-[#D4AF37]" : "text-[#C8C8C8]/50"}`}>
                              {price}
                            </span>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-150
                              ${checked ? "bg-[#D4AF37] border-[#D4AF37]" : "border-white/25"}`}
                            >
                              {checked && <Check size={10} className="text-black" strokeWidth={3} />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {errors.services && (
                  <p className="text-red-400 text-xs">{errors.services.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputField
                  label="Preferred Date"
                  icon={CalendarDays}
                  type="date"
                  error={errors.date?.message}
                  min={minDate}
                  {...register("date")}
                />
                <SelectField label="Preferred Time" icon={Clock} error={errors.time?.message} {...register("time")}>
                  <option value="">Select time...</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </SelectField>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-[#C8C8C8] font-sans flex items-center gap-2">
                  <FileText size={13} className="text-[#D4AF37]" />
                  Notes (optional)
                </label>
                <textarea
                  {...register("notes")}
                  placeholder="Any special requests or notes..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-sans outline-none focus:border-[#D4AF37]/50 transition-all resize-none placeholder:text-white/20"
                />
              </div>

              {/* Selected summary */}
              {selectedServices.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedServices.map(s => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] font-sans">
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer w-full py-4 bg-[#D4AF37] hover:bg-[#F2C94C] disabled:opacity-60 text-black font-semibold rounded-xl text-sm tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] mt-2"
              >
                {submitting ? "Booking..." : "Book Appointment"}
              </button>

              <p className="text-center text-[#C8C8C8]/60 text-xs font-sans">
                After booking, WhatsApp will open with your appointment details for quick confirmation.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
