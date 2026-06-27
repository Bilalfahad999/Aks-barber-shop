"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="cursor-pointer fixed bottom-8 right-8 z-40 w-11 h-11 rounded-full bg-[#D4AF37] flex items-center justify-center hover:bg-[#F2C94C] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="text-black" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
