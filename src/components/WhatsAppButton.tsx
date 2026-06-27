"use client";

import { motion } from "framer-motion";

export default function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/15194577777"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer fixed bottom-24 right-7 z-40 w-13 h-13 rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_32px_rgba(37,211,102,0.6)] transition-shadow duration-300"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
      {/* Button */}
      <span className="relative w-13 h-13 rounded-full bg-[#25D366] flex items-center justify-center w-12 h-12">
        <svg viewBox="0 0 32 32" width="26" height="26" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.003 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.354.632 4.56 1.733 6.465L2.667 29.333l7.07-1.701A13.29 13.29 0 0 0 16.003 29.333C23.364 29.333 29.333 23.364 29.333 16S23.364 2.667 16.003 2.667zm0 2.4c6.033 0 10.93 4.9 10.93 10.933s-4.897 10.933-10.93 10.933c-2.1 0-4.054-.595-5.718-1.625l-.41-.254-4.197 1.01 1.044-4.082-.274-.43A10.9 10.9 0 0 1 5.07 16c0-6.033 4.9-10.933 10.933-10.933zm-3.26 5.6c-.22 0-.576.082-.877.408-.301.326-1.15 1.123-1.15 2.74s1.177 3.179 1.342 3.399c.164.22 2.289 3.63 5.627 4.946 2.75 1.084 3.31.869 3.907.814.597-.054 1.926-.787 2.199-1.547.274-.76.274-1.412.192-1.547-.082-.136-.302-.218-.631-.382-.33-.163-1.926-.95-2.227-1.059-.3-.109-.52-.163-.74.164-.22.326-.85 1.059-1.042 1.277-.192.22-.384.247-.713.082-.33-.163-1.39-.513-2.65-1.635-.98-.873-1.642-1.95-1.835-2.277-.192-.327-.02-.503.145-.665.148-.147.33-.382.494-.573.164-.192.22-.327.33-.545.11-.218.055-.409-.028-.573-.082-.163-.73-1.787-1.013-2.443-.26-.6-.53-.518-.73-.527l-.6-.01z"/>
        </svg>
      </span>
    </motion.a>
  );
}
