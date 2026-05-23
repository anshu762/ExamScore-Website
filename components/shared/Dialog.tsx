"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="dialog-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <motion.div
            key="dialog-content"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.12 }}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-[#D6D0C4]/40 bg-[#FDFCF9] shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-[#D6D0C4]/30 px-5 py-4">
                <h3 className="font-serif text-base font-semibold text-[#0A1A14]">{title}</h3>
                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6B7A72] transition-colors hover:bg-[#0F3226]/5 hover:text-[#0F3226]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
