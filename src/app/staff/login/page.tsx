"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, Eye, EyeClosed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StaffLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";
      if (password === adminPassword) {
        localStorage.setItem("staff_auth", "true");
        router.push("/staff/dashboard");
      } else {
        setError("Incorrect password. Please try again.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/15 via-transparent to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#D4AF37]/8 blur-[120px] rounded-full" />

      {/* Back link */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-white/40 hover:text-[#D4AF37] transition-colors text-sm font-sans cursor-pointer">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm px-4"
      >
        {/* Card */}
        <div className="bg-white/3 backdrop-blur-xl border border-[#D4AF37]/15 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full border border-[#D4AF37]/30 overflow-hidden mb-4">
              <Image src="/logo.png" alt="AK's Barber Shop" width={56} height={56} className="w-full h-full object-cover" priority />
            </div>
            <h1 className="font-serif text-2xl font-bold text-white">Staff Login</h1>
            <p className="text-white/40 text-xs font-sans mt-1">AK&apos;s Barber Shop · Staff Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Staff password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="w-full bg-white/5 border border-white/10 focus:border-[#D4AF37]/40 rounded-xl pl-10 pr-10 py-3 text-white text-sm font-sans outline-none transition-all duration-300 placeholder:text-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword
                  ? <Eye className="w-4 h-4 text-white/30 hover:text-[#D4AF37] transition-colors" />
                  : <EyeClosed className="w-4 h-4 text-white/30 hover:text-[#D4AF37] transition-colors" />
                }
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs text-center font-sans"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !password}
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] hover:bg-[#F2C94C] disabled:opacity-50 text-black font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/40 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <p className="text-center text-white/25 text-xs font-sans mt-6">
            Default password: <span className="text-white/40 font-mono">admin123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
