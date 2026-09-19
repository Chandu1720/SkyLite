import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Tag, Copy, Check, X, Film, Gift } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useToast } from '../ui/Toast';

const STORAGE_DISMISSED_KEY = 'skylite_welcome_dismissed_v1';

export const WelcomePromoModal: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Settings values with robust fallbacks
  const isEnabled = settings?.welcomePopupEnabled !== false;
  const title = settings?.welcomePopupTitle || 'Exclusive Welcome Offer ✨';
  const subtitle = settings?.welcomePopupSubtitle || 'Get 20% OFF on your very first private theatre booking experience!';
  const couponCode = settings?.welcomePopupCouponCode || 'WELCOME20';
  const discountText = settings?.welcomePopupDiscountText || 'FLAT 20% OFF';

  useEffect(() => {
    // Only show if enabled and not previously dismissed
    const isDismissed = sessionStorage.getItem(STORAGE_DISMISSED_KEY) || localStorage.getItem(STORAGE_DISMISSED_KEY);
    if (isEnabled && !isDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isEnabled]);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_DISMISSED_KEY, 'true');
    localStorage.setItem(STORAGE_DISMISSED_KEY, 'true');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast('success', `Copied "${couponCode}" to clipboard!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaimAndBook = () => {
    handleCopyCode();
    handleDismiss();
    navigate(`/book?coupon=${couponCode}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.2 }}
            className="relative w-full max-w-md bg-gradient-to-b from-[#0e172a] to-[#060b18] border-2 border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/20 overflow-hidden z-10 text-center"
          >
            {/* Background Decorative Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Special First-Time Gift
            </div>

            {/* Logo & Title */}
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-blue-600/30 to-sky-500/30 border border-blue-400/40 p-2 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/20">
              <img src="/logo.png" alt="SkyLite Logo" className="w-full h-full object-contain rounded-full" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-2 leading-tight">
              {title}
            </h3>

            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              {subtitle}
            </p>

            {/* Discount & Coupon Box */}
            <div className="bg-black/60 border border-blue-500/30 rounded-2xl p-4 mb-6 relative group">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                Your Exclusive Promo Code
              </div>
              <div className="text-lg font-bold text-blue-400 mb-2">
                {discountText}
              </div>

              <div className="flex items-center justify-between bg-brand-darker border border-blue-500/40 rounded-xl px-4 py-2.5">
                <span className="font-mono font-extrabold text-xl text-white tracking-widest">
                  {couponCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-semibold transition-all border border-blue-500/30 active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleClaimAndBook}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white font-heading font-bold text-base shadow-lg shadow-blue-500/30 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Claim & Book Experience
              </button>

              <button
                onClick={handleDismiss}
                className="text-xs text-gray-400 hover:text-gray-200 transition-colors block mx-auto pt-1"
              >
                No thanks, I'll book at regular price
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
