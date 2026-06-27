'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight, CalendarCheck, User } from 'lucide-react';
import Link from 'next/link';

export function Component() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState<string | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'register') {
      if (!name.trim()) { setError('Please enter your name.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, email: email.trim(), password, name: name.trim() }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Something went wrong.');
        setIsLoading(false);
        return;
      }
      // Save session
      sessionStorage.setItem('client_session', JSON.stringify({ email: email.trim().toLowerCase(), name: data.name }));
      router.push('/');
    } catch {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-white/5 border ${focused === field ? 'border-[#D4AF37]/40' : 'border-white/10'} rounded-xl px-4 py-3 text-white text-sm font-sans outline-none transition-all duration-300 placeholder:text-white/20`;

  return (
    <div className="min-h-screen w-screen bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/20 via-[#8B6914]/20 to-black" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vh] h-[50vh] rounded-b-[50%] bg-[#D4AF37]/8 blur-[80px]" />
      <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vh] h-[50vh] rounded-t-full bg-[#D4AF37]/8 blur-[60px]"
        animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror' }} />

      <Link href="/" className="absolute top-6 left-6 cursor-pointer flex items-center gap-2 text-white/40 hover:text-[#D4AF37] transition-colors duration-300 text-sm font-sans z-20">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-sm relative z-10 px-4"
        style={{ perspective: 1200 }}
      >
        <motion.div className="relative" style={{ rotateX, rotateY }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
          {/* Animated border */}
          <motion.div className="absolute -inset-[1px] rounded-2xl"
            animate={{ boxShadow: ['0 0 10px 2px rgba(212,175,55,0.04)', '0 0 22px 5px rgba(212,175,55,0.12)', '0 0 10px 2px rgba(212,175,55,0.04)'] }}
            transition={{ duration: 4, repeat: Infinity, repeatType: 'mirror' }} />

          {/* Light beams */}
          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none">
            {[
              { cls: 'absolute top-0 left-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent', anim: { left: ['-40%', '100%'] }, delay: 0 },
              { cls: 'absolute top-0 right-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent', anim: { top: ['-40%', '100%'] }, delay: 0.6 },
              { cls: 'absolute bottom-0 right-0 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent', anim: { right: ['-40%', '100%'] }, delay: 1.2 },
              { cls: 'absolute bottom-0 left-0 h-[40%] w-[2px] bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent', anim: { bottom: ['-40%', '100%'] }, delay: 1.8 },
            ].map((b, i) => (
              <motion.div key={i} className={`${b.cls} opacity-50`}
                animate={b.anim}
                transition={Object.fromEntries(Object.keys(b.anim).map(k => [k, { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: b.delay }]))} />
            ))}
          </div>

          {/* Card */}
          <div className="relative bg-black/60 backdrop-blur-xl rounded-2xl border border-[#D4AF37]/10 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'linear-gradient(135deg,#D4AF37 0.5px,transparent 0.5px),linear-gradient(45deg,#D4AF37 0.5px,transparent 0.5px)', backgroundSize: '30px 30px' }} />

            {/* Tab switcher */}
            <div className="flex border-b border-white/5">
              {(['login', 'register'] as const).map(m => (
                <button key={m} type="button" onClick={() => { setMode(m); setError(''); }}
                  className={`cursor-pointer flex-1 py-3.5 text-xs font-sans font-medium tracking-wider uppercase transition-all duration-300 ${mode === m ? 'text-[#D4AF37] border-b border-[#D4AF37]' : 'text-white/30 hover:text-white/60'}`}>
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <div className="p-7">
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}
                  className="mx-auto w-11 h-11 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 flex items-center justify-center mb-3">
                  <CalendarCheck size={18} className="text-[#D4AF37]" />
                </motion.div>
                <h1 className="font-serif text-xl font-bold text-white">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-white/40 text-xs font-sans mt-1">
                  {mode === 'login' ? 'Sign in to view your appointments' : 'Set a password to track your bookings'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <AnimatePresence mode="wait">
                  {mode === 'register' && (
                    <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="relative">
                        <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === 'name' ? 'text-[#D4AF37]' : 'text-white/25'}`} />
                        <input type="text" placeholder="Your full name" value={name}
                          onChange={e => { setName(e.target.value); setError(''); }}
                          onFocus={() => setFocused('name')} onBlur={() => setFocused(null)}
                          className={`${inputClass('name')} pl-10`} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === 'email' ? 'text-[#D4AF37]' : 'text-white/25'}`} />
                  <input type="email" placeholder="Email address" value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
                    className={`${inputClass('email')} pl-10`} />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === 'password' ? 'text-[#D4AF37]' : 'text-white/25'}`} />
                  <input type={showPassword ? 'text' : 'password'} placeholder={mode === 'register' ? 'Create a password (min. 6 chars)' : 'Password'} value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
                    className={`${inputClass('password')} pl-10 pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                    {showPassword ? <Eye className="w-4 h-4 text-white/25 hover:text-[#D4AF37] transition-colors" /> : <EyeClosed className="w-4 h-4 text-white/25 hover:text-[#D4AF37] transition-colors" />}
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {mode === 'register' && (
                    <motion.div key="confirm" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="relative">
                        <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === 'confirm' ? 'text-[#D4AF37]' : 'text-white/25'}`} />
                        <input type={showPassword ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword}
                          onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                          onFocus={() => setFocused('confirm')} onBlur={() => setFocused(null)}
                          className={`${inputClass('confirm')} pl-10`} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-red-400 text-xs font-sans text-center py-1">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isLoading}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 bg-[#D4AF37] hover:bg-[#F2C94C] disabled:opacity-50 text-black font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] mt-1">
                  {isLoading
                    ? <div className="w-4 h-4 border-2 border-black/40 border-t-transparent rounded-full animate-spin" />
                    : <><span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span><ArrowRight size={14} /></>}
                </motion.button>

                <div className="flex items-center gap-3 py-1">
                  <div className="flex-grow h-px bg-white/5" />
                  <span className="text-white/20 text-xs font-sans">AK&apos;s Barber Shop</span>
                  <div className="flex-grow h-px bg-white/5" />
                </div>

                <p className="text-center text-xs text-white/35 font-sans">
                  No appointment yet?{' '}
                  <button type="button" onClick={() => { window.location.href = window.location.origin + '/#booking'; }}
                    className="text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors font-medium cursor-pointer">
                    Book one now
                  </button>
                </p>
              </form>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
