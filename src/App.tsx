import { motion, useInView, useReducedMotion, AnimatePresence } from "motion/react";
import { AnimatedLogoReveal } from "./components/AnimatedLogoReveal";
import {
  CheckCircle2,
  Users,
  Briefcase,
  Bell,
  ShieldCheck,
  BarChart3,
  Code2,
  FileText,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Award
} from "lucide-react";
import React, { useState, useRef, useEffect, type ReactNode, type RefObject } from "react";

// ─── Reusable Animation Variants ───────────────────────────────────────────────

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const; // Stripe/Linear-style smooth ease
const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeDown = {
  hidden: { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const staggerContainerSlow = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.15,
    },
  },
};

// ─── Reusable Animated Wrapper ─────────────────────────────────────────────────

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  variants?: Record<string, Record<string, number>>;
  stagger?: typeof staggerContainer;
  delay?: number;
  once?: boolean;
  amount?: number;
}

const AnimatedSection = ({
  children,
  className = "",
  variants = fadeUp,
  stagger,
  delay = 0,
  once = true,
  amount = 0.2,
}: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });
  const shouldReduce = useReducedMotion();

  if (shouldReduce) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger || variants}
      transition={{
        duration: 0.6,
        ease: EASE_PREMIUM as unknown as number[],
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Counter Animation Hook ────────────────────────────────────────────────────

const useCountUp = (target: string, duration: number = 1.5) => {
  const [count, setCount] = useState("0");
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as RefObject<HTMLElement>, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    // Extract number from string like "< 2 mins" -> 2, "50%+" -> 50, "90%" -> 90
    const numMatch = target.match(/(\d+)/);
    if (!numMatch) {
      setCount(target);
      return;
    }
    const finalNum = parseInt(numMatch[1]);
    const prefix = target.substring(0, target.indexOf(numMatch[1]));
    const suffix = target.substring(target.indexOf(numMatch[1]) + numMatch[1].length);

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(eased * finalNum);
      setCount(`${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return { count, ref };
};

// ─── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Liquid Glass CSS — injected once */}
      <style>{`
        @keyframes liquidShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .liquid-glass-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          transition:
            top 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            left 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            right 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            margin 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            border-radius 0.6s cubic-bezier(0.16, 1, 0.3, 1),
            background 0.5s cubic-bezier(0.4, 0, 0.2, 1),
            backdrop-filter 0.5s ease,
            -webkit-backdrop-filter 0.5s ease,
            box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1),
            border-color 0.5s ease,
            border 0.5s ease,
            max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* Default state — full-width clean bar */
        .liquid-glass-nav.nav-default {
          top: 0;
          left: 0;
          right: 0;
          max-width: 100%;
          margin: 0 auto;
          border-radius: 0;
          background: rgba(255, 255, 255, 0.82);
          -webkit-backdrop-filter: blur(12px) saturate(1.2);
          backdrop-filter: blur(12px) saturate(1.2);
          border-bottom: 1px solid rgba(229, 231, 235, 0.8);
          box-shadow: none;
        }
        /* Scrolled state — floating liquid glass pill */
        .liquid-glass-nav.nav-scrolled {
          top: 0;
          left: 0;
          right: 0;
          max-width: 1050px;
          margin: 12px auto 0 auto;
          border-radius: 999px;
          /* Apple liquid glass: translucent white with heavy blur */
          background: rgba(255, 255, 255, 0.45);
          -webkit-backdrop-filter: blur(40px) saturate(1.8) brightness(1.05);
          backdrop-filter: blur(40px) saturate(1.8) brightness(1.05);
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow:
            0 4px 30px rgba(22, 38, 65, 0.08),
            0 1px 3px rgba(22, 38, 65, 0.05),
            inset 0 1px 1px rgba(255, 255, 255, 0.7),
            inset 0 -1px 1px rgba(255, 255, 255, 0.3);
        }
        /* Specular highlight — top edge refraction */
        .liquid-glass-nav.nav-scrolled::before {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.9) 20%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.9) 80%,
            transparent
          );
          border-radius: 999px;
          pointer-events: none;
        }
        /* Subtle inner glow for depth */
        .liquid-glass-nav.nav-scrolled::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.25) 0%,
            transparent 40%,
            transparent 70%,
            rgba(199, 174, 106, 0.04) 100%
          );
          pointer-events: none;
        }
        /* Shimmer animation on the glass surface */
        .liquid-glass-nav.nav-scrolled .glass-shimmer {
          position: absolute;
          inset: 0;
          border-radius: 999px;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.08) 25%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.08) 75%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: liquidShimmer 8s ease-in-out infinite;
          pointer-events: none;
        }
        .nav-inner {
          transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      padding 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-logo {
          transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1),
                      filter 0.4s ease;
        }
        /* Circular logo container for scrolled state */
        .logo-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(22, 38, 65, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow:
            0 2px 8px rgba(22, 38, 65, 0.15),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .logo-circle:hover {
          background: rgba(22, 38, 65, 1);
          box-shadow:
            0 4px 16px rgba(22, 38, 65, 0.25),
            inset 0 1px 1px rgba(255, 255, 255, 0.15);
        }
        .logo-circle img {
          width: 24px;
          height: 24px;
        }
        .logo-brand-text {
          font-weight: 700;
          font-size: 17px;
          color: #162641;
          letter-spacing: -0.02em;
          line-height: 1;
          white-space: nowrap;
        }
        /* ── Mobile responsive adjustments ── */
        @media (max-width: 767px) {
          .liquid-glass-nav.nav-scrolled {
            max-width: calc(100% - 24px);
            margin: 8px auto 0 auto;
            border-radius: 24px;
          }
          .liquid-glass-nav.nav-scrolled::before {
            border-radius: 24px;
          }
          .liquid-glass-nav.nav-scrolled::after {
            border-radius: 24px;
          }
          .liquid-glass-nav.nav-scrolled .glass-shimmer {
            border-radius: 24px;
          }
          /* When mobile menu is open, flatten bottom radius */
          .liquid-glass-nav.nav-scrolled.nav-menu-open {
            border-radius: 24px 24px 0 0;
          }
          .liquid-glass-nav.nav-scrolled.nav-menu-open::after {
            border-radius: 24px 24px 0 0;
          }
          /* Mobile dropdown glass effect */
          .mobile-menu-glass {
            background: rgba(255, 255, 255, 0.55) !important;
            -webkit-backdrop-filter: blur(40px) saturate(1.8) brightness(1.05);
            backdrop-filter: blur(40px) saturate(1.8) brightness(1.05);
            border-top: 1px solid rgba(255, 255, 255, 0.3);
          }
          .liquid-glass-nav.nav-scrolled .mobile-menu-glass {
            border-radius: 0 0 24px 24px;
            border: 1px solid rgba(255, 255, 255, 0.55);
            border-top: 1px solid rgba(255, 255, 255, 0.25);
          }
        }
      `}</style>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[], delay: 0.1 }}
        className={`liquid-glass-nav ${scrolled ? "nav-scrolled" : "nav-default"}${isOpen ? " nav-menu-open" : ""}`}
      >
        {/* Shimmer layer */}
        <div className="glass-shimmer" />

        <div
          className="relative z-10 mx-auto"
          style={{
            maxWidth: scrolled ? "100%" : "80rem",
            padding: scrolled ? "0 16px" : "0 24px",
            transition: "max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1), padding 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div
            className="nav-inner flex justify-between items-center"
            style={{ height: scrolled ? "52px" : "80px" }}
          >
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {scrolled ? (
                /* Scrolled: Circle icon + brand name text */
                <>
                  <div className="logo-circle">
                    <img src="/favicon.svg" alt="" />
                  </div>
                  <span className="logo-brand-text">hiyrED<sup style={{ fontSize: '9px', verticalAlign: 'super', marginLeft: '1px' }}>®</sup></span>
                </>
              ) : (
                /* Default: Full logo SVG */
                <img
                  src="/logo_Txt.svg"
                  alt="hiyrED®"
                  className="nav-logo"
                  style={{ height: "88px" }}
                />
              )}
            </motion.div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-7">
              {["Community", "For Recruiters", "For Institutions", "For Educators", "Contact"].map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (item === "For Recruiters") {
                      (window as any).triggerWaitlist("Recruiters");
                    } else if (item === "For Institutions") {
                      (window as any).triggerWaitlist("Institutions");
                    } else if (item === "Contact") {
                      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                    } else {
                      (window as any).triggerWaitlist("Community");
                    }
                  }}
                  className="text-sm font-medium text-gray-600 hover:text-brand-navy transition-colors relative group cursor-pointer"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: EASE_SMOOTH as unknown as number[] }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold group-hover:w-full transition-all duration-300 ease-out" />
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/*<motion.button
                className="px-6 py-2 text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                Sign In
              </motion.button>*/}
              <motion.button
                onClick={() => (window as any).triggerWaitlist("Community")}
                className="px-6 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-full hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/20 cursor-pointer"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(22,38,65,0.3)" }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55, duration: 0.4, ease: EASE_PREMIUM as unknown as number[] }}
              >
                Join hiyrED®
              </motion.button>
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-600"
                whileTap={{ scale: 0.9 }}
              >
                {isOpen ? <X /> : <Menu />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: EASE_SMOOTH as unknown as number[] }}
              className={`md:hidden px-4 pt-2 pb-6 space-y-4 overflow-hidden relative z-10 mobile-menu-glass ${scrolled
                ? "rounded-b-3xl"
                : "border-b border-gray-100"
                }`}
            >
              {["Community", "For Recruiters", "For Institutions", "For Educators"].map((item, i) => (
                <motion.a
                  key={item}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    if (item === "For Recruiters") {
                      (window as any).triggerWaitlist("Recruiters");
                    } else if (item === "For Institutions") {
                      (window as any).triggerWaitlist("Institutions");
                    } else {
                      (window as any).triggerWaitlist("Community");
                    }
                  }}
                  className="block text-base font-medium text-gray-600 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.button
                onClick={() => {
                  setIsOpen(false);
                  (window as any).triggerWaitlist("Community");
                }}
                className="w-full px-6 py-3 bg-brand-navy text-white font-semibold rounded-xl cursor-pointer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                Join hiyrED®
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

// ─── Hero ──────────────────────────────────────────────────────────────────────

const Hero = () => {
  return (
    <section className="pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-brand-navy leading-[1.1] mb-6"
              variants={fadeLeft}
              transition={{ duration: 0.7, ease: EASE_PREMIUM as unknown as number[] }}
            >
              Forge your potential into <span className="text-brand-gold">proven</span> capability.
            </motion.h1>
            <motion.p
              className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl"
              variants={fadeLeft}
              transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[], delay: 0.1 }}
            >
              The definitive ecosystem for ambitious students. Map your strengths, build real-world capabilities, and let your verified proof-of-work attract industry leaders.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              variants={fadeUp}
              transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[], delay: 0.2 }}
            >
              <div className="relative inline-block mt-4">
                {/* Floating Highlighted Free Tag
                <motion.span
                  className="absolute -top-4 left-6 z-20 px-3.5 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap"
                  animate={{
                    x: [0, 135, 148, 135, 0, -13, 0],
                    y: [0, 0, 28, 56, 56, 28, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    times: [0, 0.3, 0.4, 0.5, 0.8, 0.9, 1],
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Free
                </motion.span>*/}
                <motion.button
                  onClick={() => (window as any).triggerWaitlist("Community")}
                  className="px-8 py-4 bg-brand-navy text-white font-bold rounded-full hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/20 flex items-center gap-2 group cursor-pointer"
                  whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(22,38,65,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Join the Community
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
              {/*<motion.button
                className="px-8 py-4 bg-white text-brand-navy font-bold rounded-full border-2 border-brand-navy/10 hover:border-brand-navy/20 transition-all"
                whileHover={{ scale: 1.04, borderColor: "rgba(22,38,65,0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                Hire Verified Talent
              </motion.button>*/}
            </motion.div>
          </motion.div>

          {/* Right: Redesigned Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_PREMIUM as unknown as number[] }}
            className="relative flex items-center justify-center min-h-[450px] sm:min-h-[500px] lg:min-h-[600px] w-full"
          >
            {/* Background Blob Shape */}
            <motion.div
              animate={{
                rotate: [0, 6, -6, 0],
                scale: [1, 1.03, 0.97, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute w-[85%] sm:w-[75%] lg:w-[90%] max-w-[500px] aspect-[589/648] -z-10"
            >
              <img
                src="/blob.svg"
                alt="Background Blob"
                className="w-full h-full object-contain select-none pointer-events-none opacity-90"
              />
            </motion.div>

            {/* Foreground Avatar Illustration */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: EASE_PREMIUM as unknown as number[] }}
              className="relative w-[75%] sm:w-[65%] lg:w-[80%] max-w-[420px] aspect-[604/871] z-10 flex items-center justify-center"
            >
              <img
                src="/avtar.svg"
                alt="Student coding avatar"
                className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_20px_50px_rgba(22,38,65,0.25)]"
              />
            </motion.div>

            {/* Liquid Glass Badge 1 (Top Left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20, y: -20 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [0, 8, -4, 0],
                y: [0, -12, 6, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{
                delay: 0.7,
                duration: 7,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="absolute top-[8%] left-[2%] lg:left-[-5%] z-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[1.5rem_2.5rem_2rem_3rem] p-4 shadow-[0_15px_35px_rgba(22,38,65,0.15)] flex items-center gap-3 hover:scale-105 hover:bg-white/35 transition-all duration-300 pointer-events-auto select-none"
            >
              <div className="w-9 h-9 rounded-full bg-brand-gold/30 flex items-center justify-center shadow-inner">
                <Users className="text-brand-navy w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] text-brand-navy/60 font-semibold tracking-wide uppercase">Student Profile</p>
                <p className="font-bold text-brand-navy text-xs sm:text-sm">Alex Rivera</p>
              </div>
            </motion.div>

            {/* Liquid Glass Badge 2 (Top Right / Middle Right) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20, y: -10 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [0, -6, 6, 0],
                y: [0, 14, -8, 0],
                rotate: [0, -3, 3, 0]
              }}
              transition={{
                delay: 0.9,
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="absolute top-[25%] right-[2%] lg:right-[-5%] z-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2.5rem_1.5rem_3rem_2rem] p-4 shadow-[0_15px_35px_rgba(22,38,65,0.15)] flex items-center gap-3 hover:scale-105 hover:bg-white/35 transition-all duration-300 pointer-events-auto select-none"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center shadow-inner">
                <ShieldCheck className="text-emerald-700 w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] text-brand-navy/60 font-semibold tracking-wide uppercase">DSA Mastery</p>
                <p className="font-bold text-emerald-700 text-xs sm:text-sm">Skill Verified</p>
              </div>
            </motion.div>

            {/* Liquid Glass Badge 3 (Bottom Left) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -10, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: [0, -8, 8, 0],
                y: [0, -10, 12, 0],
                rotate: [0, 2, -1, 0]
              }}
              transition={{
                delay: 1.1,
                duration: 9,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
              }}
              className="absolute bottom-[10%] left-[5%] lg:left-[-2%] z-20 bg-white/20 backdrop-blur-xl border border-white/30 rounded-[2rem_2rem_2.5rem_1.5rem] p-4 shadow-[0_15px_35px_rgba(22,38,65,0.15)] flex items-center gap-3 hover:scale-105 hover:bg-white/35 transition-all duration-300 pointer-events-auto select-none"
            >
              <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center shadow-inner">
                <Code2 className="text-purple-700 w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] text-brand-navy/60 font-semibold tracking-wide uppercase">GitHub Project</p>
                <p className="font-bold text-purple-700 text-xs sm:text-sm">Fullstack Deployed</p>
              </div>
            </motion.div>

            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-gold/10 rounded-full blur-3xl -z-20"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ─── Metrics ───────────────────────────────────────────────────────────────────

const MetricCard = ({ value, label, index }: { key?: number; value: string; label: string; index: number }) => {
  const { count, ref } = useCountUp(value, 1.2);

  return (
    <motion.div
      ref={ref as RefObject<HTMLDivElement>}
      variants={fadeUp}
      transition={{
        duration: 0.5,
        ease: EASE_PREMIUM as unknown as number[],
        delay: index * 0.12
      }}
      whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(22,38,65,0.08)" }}
      className="p-8 rounded-2xl bg-[#fbf0cf] border border-gray-100 text-center transition-shadow duration-300"
    >
      <h3 className="text-4xl font-bold text-[#c7ae6a] mb-2">{count}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{label}</p>
    </motion.div>
  );
};

const Metrics = () => {
  const metrics = [
    { value: "500k+", label: "Active Students in Talent Pool" },
    { value: "85%", label: "Placement Readiness via Forge" },
    { value: "120+", label: "Domain-specific Capability Paths" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection stagger={staggerContainer} className="grid md:grid-cols-3 gap-8 mb-20">
          {metrics.map((m, i) => (
            <MetricCard key={i} value={m.value} label={m.label} index={i} />
          ))}
        </AnimatedSection>

        <AnimatedSection className="text-center" delay={0.2}>
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-10"
          >
            Scouting talent directly from the hiyrED® Forge
          </motion.p>

          {/* Marquee Logo Strip */}
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10" />
            <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10" />
            <motion.div
              className="flex items-center gap-16 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center gap-16 opacity-40 grayscale">
                  <div className="text-2xl font-black text-brand-navy min-w-max">PELOTON</div>
                  <div className="text-2xl font-black text-brand-navy min-w-max">LEVER</div>
                  <div className="text-2xl font-black text-brand-navy min-w-max">GUSTO</div>
                  <div className="text-2xl font-black text-brand-navy min-w-max">HIREVUE</div>
                  <div className="text-2xl font-black text-brand-navy min-w-max">ZAPIER</div>
                  <div className="text-2xl font-black text-brand-navy min-w-max">GLOSSIER</div>
                  <div className="text-2xl font-black text-brand-navy min-w-max">MAILCHIMP</div>
                </div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};



// ─── How It Works ──────────────────────────────────────────────────────────────

const TheJourney = () => {
  const steps = [
    {
      number: "01",
      title: "Submit Your Application",
      desc: "Become a member of the hiyrED® Community—via institution or independently—and complete your profile setup. hiyrED® Cortex maps your baseline capability."
    },
    {
      number: "02",
      title: "Consult with Our Team",
      desc: "Engage in Cortex-informed, capability-directed career counselling via hiyrED® Compass to align your aspirations with current reality and verify eligibility before the Forge."
    },
    {
      number: "03",
      title: "Understand Your CTC Path",
      desc: "Understand your Capability Transformation Cortex Path (CTC Path). hiyrED® Cortex measures the gap between your current skills and recruiter expectations to build your market value."
    },
    {
      number: "04",
      title: "Start Learning",
      desc: "Unlock hiyrED® Forge to start structured competency paths (concept → applied practice → real-world output), complete Industry Projects evaluated by hiring organizations, and build verified proof-of-work."
    }
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Winding Road Watermark Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
        <svg
          viewBox="0 0 1440 900"
          className="w-full h-full opacity-[0.15]"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Road Shadow */}
          <path
            d="M -100 150 C 300 50 300 450 600 350 C 900 250 900 650 1200 550 C 1350 500 1450 650 1600 650"
            stroke="#162641"
            strokeWidth="90"
            strokeLinecap="round"
            fill="none"
          />
          {/* Road Border (Gold) */}
          <path
            d="M -100 150 C 300 50 300 450 600 350 C 900 250 900 650 1200 550 C 1350 500 1450 650 1600 650"
            stroke="#C7AE6A"
            strokeWidth="74"
            strokeLinecap="round"
            fill="none"
          />
          {/* Road Body */}
          <path
            d="M -100 150 C 300 50 300 450 600 350 C 900 250 900 650 1200 550 C 1350 500 1450 650 1600 650"
            stroke="#162641"
            strokeWidth="70"
            strokeLinecap="round"
            fill="none"
          />
          {/* Road Dashed Line */}
          <path
            d="M -100 150 C 300 50 300 450 600 350 C 900 250 900 650 1200 550 C 1350 500 1450 650 1600 650"
            stroke="white"
            strokeWidth="3"
            strokeDasharray="16 16"
            strokeLinecap="round"
            fill="none"
          />

          {/* Map Pins / Milestones */}
          {/* Pin 1 */}
          <g transform="translate(180, 135) scale(1.2)">
            <path d="M0 0 C-8 -15 -12 -20 -12 -28 A12 12 0 0 1 12 -28 C12 -20 8 -15 0 0 Z" fill="#C7AE6A" />
            <circle cx="0" cy="-28" r="4" fill="white" />
          </g>
          {/* Pin 2 */}
          <g transform="translate(520, 375) scale(1.2)">
            <path d="M0 0 C-8 -15 -12 -20 -12 -28 A12 12 0 0 1 12 -28 C12 -20 8 -15 0 0 Z" fill="#162641" />
            <circle cx="0" cy="-28" r="4" fill="white" />
          </g>
          {/* Pin 3 */}
          <g transform="translate(930, 395) scale(1.2)">
            <path d="M0 0 C-8 -15 -12 -20 -12 -28 A12 12 0 0 1 12 -28 C12 -20 8 -15 0 0 Z" fill="#C7AE6A" />
            <circle cx="0" cy="-28" r="4" fill="white" />
          </g>
          {/* Pin 4 */}
          <g transform="translate(1250, 560) scale(1.2)">
            <path d="M0 0 C-8 -15 -12 -20 -12 -28 A12 12 0 0 1 12 -28 C12 -20 8 -15 0 0 Z" fill="#162641" />
            <circle cx="0" cy="-28" r="4" fill="white" />
          </g>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection className="text-center mb-20" stagger={staggerContainer}>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-brand-navy mb-6"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
          >
            The <span className="text-[#c7ae6a]">Student Journey</span>
          </motion.h2>
          <motion.p
            className="text-gray-500 max-w-2xl mx-auto"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
          >
            From discovering your path to begin your career — a structured, capability-driven ecosystem built for your success.
          </motion.p>
        </AnimatedSection>

        <AnimatedSection stagger={staggerContainerSlow} className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-12">
          {/* Left Column: Steps list */}
          <div className="lg:col-span-7 flex flex-col">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeLeft}
                className="flex gap-6 md:gap-8 py-8 border-b border-gray-100 last:border-0 items-start text-left"
              >
                {/* Step Number */}
                <span className="text-4xl md:text-5xl font-black text-brand-gold shrink-0 leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {s.number}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-brand-navy mb-2">{s.title}</h4>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Image */}
          <div className="lg:col-span-5 w-full">
            <motion.div
              variants={fadeRight}
              className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 w-full"
            >
              <img
                src="/student_journey.png"
                alt="Student preparing with hiyrED"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/10 to-transparent pointer-events-none" />
            </motion.div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ─── Atomic Structure Helpers ──────────────────────────────────────────────────

const ORBIT_RADIUS = 200;

const orbitConfig = [
  { tiltZ: 0, tiltX: 60, engines: [0, 1], speed: 1, startAngles: [0, 180] },
  { tiltZ: 60, tiltX: 60, engines: [2, 3], speed: -0.7, startAngles: [60, 240] },
  { tiltZ: -60, tiltX: 60, engines: [4], speed: 0.5, startAngles: [120] },
];

function getElectronPos(tiltZDeg: number, tiltXDeg: number, thetaDeg: number, R: number) {
  const tZ = (tiltZDeg * Math.PI) / 180;
  const tX = (tiltXDeg * Math.PI) / 180;
  const t = (thetaDeg * Math.PI) / 180;
  const px = R * Math.cos(t);
  const py = R * Math.sin(t);
  const rxX = px;
  const rxY = py * Math.cos(tX);
  const rxZ = py * Math.sin(tX);
  const x = rxX * Math.cos(tZ) - rxY * Math.sin(tZ);
  const y = rxX * Math.sin(tZ) + rxY * Math.cos(tZ);
  const z = rxZ;
  return { x, y, z };
}

function getEngineScreenPos(engineIdx: number, angle: number) {
  for (const orbit of orbitConfig) {
    const eIdx = orbit.engines.indexOf(engineIdx);
    if (eIdx !== -1) {
      const theta = orbit.startAngles[eIdx] + angle * orbit.speed;
      const pos = getElectronPos(orbit.tiltZ, orbit.tiltX, theta, ORBIT_RADIUS);
      return { x: 260 + pos.x, y: 260 + pos.y, z: pos.z };
    }
  }
  return { x: 260, y: 260, z: 0 };
}

// ─── Where Hiyred Stands Apart (USP / Differentiators) ──────────────────────────

const HiyredEdge = () => {
  const [selectedEngine, setSelectedEngine] = useState<number | null>(null);
  const [hoveredEngine, setHoveredEngine] = useState<number | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    if (selectedEngine !== null || hoveredEngine !== null) return;

    let animationFrameId: number;
    const animate = () => {
      setCurrentAngle((prev) => prev + 0.3);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedEngine, hoveredEngine]);

  const activeEngineIndex = hoveredEngine !== null ? hoveredEngine : selectedEngine;

  const shifts = [
    { role: "Students", old: "Unclear prep & zero feedback", new: "CTC Paths & Forge-built readiness", icon: <Users className="text-brand-gold w-5 h-5" /> },
    { role: "Institutions", old: "Seasonal amnesia & ad-hoc decisions", new: "Cortex foresight & cohort analytics", icon: <BarChart3 className="text-brand-gold w-5 h-5" /> },
    { role: "Recruiters", old: "Resume stacks & unready hires", new: "Verified capability profiles via Industry Pool", icon: <Briefcase className="text-brand-gold w-5 h-5" /> },
    { role: "Educators", old: "Eclipsed effort & no platform", new: "Compass mentorship & outcome recognition", icon: <Award className="text-brand-gold w-5 h-5" /> },
  ];

  const differentiators = [
    {
      index: "01",
      engine: "INDUSTRY POOL",
      title: "Structured Hiring Ecosystem",
      headline: "Every industry, every domain — precisely segmented.",
      desc: "hiyrED® maps companies across Product and Service verticals, down to sub-domains like CTO Networks and PM Channels — so matching happens at the right depth, not just the right keywords.",
      accent: "#C7AE6A",
    },
    {
      index: "02",
      engine: "TALENT POOL",
      title: "Capability-First Talent Mapping",
      headline: "Not who you are on paper — what you can actually do.",
      desc: "hiyrED® builds each student's profile around demonstrated strengths, not just grades. Students are guided toward roles that match their abilities — before they start applying.",
      accent: "#7dd3fc",
    },
  ];

  const engineDetails = [
    {
      name: "hiyrED® Cortex",
      label: "Think",
      title: "Predictive Intelligence Engine",
      tagline: "Cortex thinks so the ecosystem acts.",
      desc: "hiyrED® Cortex is the underlying intelligence layer that watches, learns, and intervenes across capability and well-being signals simultaneously, making resumes redundant.",
      accent: "#C7AE6A",
      icon: <BarChart3 className="w-5 h-5" />,
      bullets: [
        "Synthesizes signals from Forge, Premier League, Pulse, and Compass.",
        "Generates the Capability Transformation Cortex Path (CTC Path).",
        "Provides real-time skill gap heatmaps by domain and branch.",
        "Visualizes candidate readiness scores for proactive hiring."
      ]
    },
    {
      name: "hiyrED® Forge",
      label: "Build",
      title: "Guided Placement Readiness",
      tagline: "Forge builds what recruiters need and students become.",
      desc: "Structured competency enhancement system sharpening raw talent into role-ready professionals through assessed, applied, and role-aligned capability paths.",
      accent: "#7dd3fc",
      icon: <Code2 className="w-5 h-5" />,
      bullets: [
        "Tailored coding, aptitude, case-based, and core subject tests.",
        "Includes hiyrED® Premier League time-bound industry challenges.",
        "Integrated CodeLAB for problem-solving with dynamic XP tracking.",
        "Provides real Industry Projects evaluated by hiring organizations."
      ]
    },
    {
      name: "hiyrED® Pulse",
      label: "Feel",
      title: "Mental Well-being & Resilience",
      tagline: "Pulse feels what performance metrics miss.",
      desc: "Dedicated well-being intelligence monitoring resilience, motivation, stress, and burnout patterns to trigger timely human support before setbacks become crises.",
      accent: "#fb7185",
      icon: <Bell className="w-5 h-5" />,
      bullets: [
        "Tracks resilience velocity through re-engagement quality.",
        "Flags sudden engagement drops or post-rejection disengagement.",
        "Monitors burnout risk patterns and triggers pause recommendations.",
        "Coordinates with hiyrED® Compass for friendly tutor interventions."
      ]
    },
    {
      name: "hiyrED® Compass",
      label: "Guide",
      title: "Expert Mentorship & Counselling",
      tagline: "Mentors and guides students toward reality.",
      desc: "Cortex-informed mentorship and career counselling platform that connects students with educators, career experts, and ICF-certified well-being coaches.",
      accent: "#6ee7b7",
      icon: <Users className="w-5 h-5" />,
      bullets: [
        "Mentors access full capability profiles instead of blank resumes.",
        "Directs career counseling based on actual capability data.",
        "Integrates ICF-certified coaches to anchor mental well-being.",
        "Provides branch- and role-specific live counselling sessions."
      ]
    },
    {
      name: "hiyrED® Legacy",
      label: "Reinforce",
      title: "Community Contribution Pathway",
      tagline: "Built for the Community. Driven by the Talent.",
      desc: "A collaborative pathway empowering placed students to contribute back, guide their peers, design new paths, and co-create sustainable opportunities at scale.",
      accent: "#c4b5fd",
      icon: <Award className="w-5 h-5" />,
      bullets: [
        "Students share verified interview reviews to train future cohorts.",
        "Mentor rising talent targeting similar industry roles.",
        "Unlock exclusive capability badges and role enhancements.",
        "Join organizing committees for hiyrED® Premier League events."
      ]
    }
  ];

  return (
    <>
      <section
        className="relative py-32 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0e1a2e 0%, #162641 60%, #1a2d4a 100%)" }}
      >
        {/* Inline styles for Keyframes */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes glowWorm {
            0%, 100% {
              box-shadow: 0 0 10px rgba(0, 240, 255, 0.35), inset 0 0 8px rgba(0, 240, 255, 0.15);
              filter: drop-shadow(0 0 2px rgba(0, 240, 255, 0.35));
            }
            50% {
              box-shadow: 0 0 25px rgba(0, 240, 255, 0.95), 0 0 45px rgba(0, 72, 255, 0.65), inset 0 0 12px rgba(0, 240, 255, 0.25);
              filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.95));
            }
          }
          @keyframes orbit-dash {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -24; }
          }
          @keyframes nucleus-breathe {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 0.85; }
          }
        `}} />

        {/* Background texture dots */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(199,174,106,0.07) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Five Engines Section */}
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Heading and description */}
            <div className="lg:col-span-6 text-left flex flex-col justify-center">
              <motion.h3
                className="text-2xl sm:text-3xl lg:text-[2.25rem] font-extrabold text-white mb-3 leading-tight lg:whitespace-nowrap"
                variants={fadeUp}
              >
                5 Engine{" "}
                <span className="text-[#C7AE6A] uppercase ml-1">
                  POWERHOUSE
                </span>
              </motion.h3>
              <motion.p
                className="text-xs font-semibold text-white/40 mb-8 border-b border-white/5 pb-6 flex items-center gap-1.5"
                variants={fadeUp}
              >
                <span>click on the engines to know more</span>
              </motion.p>

              <AnimatedSection className="flex flex-col gap-6 text-left" stagger={staggerContainerSlow}>
                <motion.h2
                  className="text-5xl sm:text-6xl font-black uppercase leading-none tracking-tight"
                  style={{
                    background: "linear-gradient(135deg, #ffffff 0%, #C7AE6A 50%, #e3d6b4 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  variants={fadeUp}
                >
                  Built
                </motion.h2>

                {/* Horizontal community phrases */}
                <motion.div
                  className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs md:text-sm font-semibold whitespace-normal sm:whitespace-nowrap overflow-visible"
                  variants={fadeUp}
                >
                  <span className="flex items-baseline gap-1">
                    <span className="font-black italic text-[#C7AE6A]">For</span>
                    <span className="text-white/70">the community</span>
                  </span>
                  <span className="text-[#C7AE6A]/40 text-xs">·</span>
                  <span className="flex items-baseline gap-1">
                    <span className="font-black italic text-[#C7AE6A]">Of</span>
                    <span className="text-white/70">the community</span>
                  </span>
                  <span className="text-[#C7AE6A]/40 text-xs">·</span>
                  <span className="flex items-baseline gap-1">
                    <span className="font-black italic text-[#C7AE6A]">By</span>
                    <span className="text-white/70">the community</span>
                  </span>
                </motion.div>

                {/* Divider line */}
                <div className="w-16 h-px bg-gradient-to-r from-[#C7AE6A] to-transparent my-1" />

                {/* Tagline */}
                <motion.p
                  className="text-lg lg:text-xl font-bold text-white/80 tracking-wide"
                  variants={fadeUp}
                >
                  Driven by the <span className="text-[#C7AE6A]">Talent</span>.
                </motion.p>
              </AnimatedSection>
            </div>

            {/* Right: Rotational Wheel */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end lg:items-center items-start relative overflow-visible lg:h-[540px] h-auto w-full">
              {/* Desktop: Atomic Structure */}
              <div className="hidden lg:flex justify-center items-center relative w-[520px] h-[520px] lg:translate-x-16 overflow-visible">

                {/* SVG Orbit Ellipses */}
                <svg className="absolute w-[520px] h-[520px] overflow-visible pointer-events-none" viewBox="0 0 520 520" style={{ filter: 'drop-shadow(0 0 6px rgba(0, 240, 255, 0.1))' }}>
                  <defs>
                    <linearGradient id="atomOrbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.9" />
                      <stop offset="25%" stopColor="#0072ff" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.25" />
                      <stop offset="75%" stopColor="#0072ff" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="atomOrbitGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {orbitConfig.map((orbit, i) => {
                    const ry = ORBIT_RADIUS * Math.cos((orbit.tiltX * Math.PI) / 180);
                    return (
                      <g key={i} transform={`rotate(${orbit.tiltZ}, 260, 260)`}>
                        <ellipse cx="260" cy="260" rx={ORBIT_RADIUS} ry={ry}
                          fill="none" stroke="#00f0ff" strokeWidth="6" opacity="0.06"
                          filter="url(#atomOrbitGlow)" />
                        <ellipse cx="260" cy="260" rx={ORBIT_RADIUS} ry={ry}
                          fill="none" stroke="url(#atomOrbitGrad)" strokeWidth="1.5"
                          strokeDasharray="12 6" opacity="0.55"
                          style={{ animation: `orbit-dash ${8 + i * 3}s linear infinite` }} />
                        <ellipse cx="260" cy="260" rx={ORBIT_RADIUS} ry={ry}
                          fill="none" stroke="#00f0ff" strokeWidth="0.5" opacity="0.15" />
                      </g>
                    );
                  })}
                </svg>

                {/* Central Nucleus Glow */}
                <div className="absolute w-36 h-36 rounded-full bg-[#00f0ff]/15 blur-2xl pointer-events-none z-0"
                  style={{
                    animation: 'nucleus-breathe 4s ease-in-out infinite',
                  }} />

                {/* Central Hub */}
                <div className="absolute w-24 h-24 rounded-full flex items-center justify-center z-10">
                  <div className="w-18 h-18 rounded-full bg-white flex items-center justify-center shadow-md" style={{ animation: 'glowWorm 3s ease-in-out infinite' }}>
                    <img src="/Logo-Stick-Figure.svg" alt="hiyrED® Hub" className="w-11 h-11 object-contain" />
                  </div>
                </div>

                {/* Energy Particles */}
                {orbitConfig.map((orbit, oi) =>
                  [0, 120, 240].map((baseAngle) => {
                    const theta = baseAngle + currentAngle * orbit.speed * 1.8;
                    const pos = getElectronPos(orbit.tiltZ, orbit.tiltX, theta, ORBIT_RADIUS);
                    const inFront = pos.z >= 0;
                    return (
                      <div
                        key={`p-${oi}-${baseAngle}`}
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          left: `${260 + pos.x - 2}px`,
                          top: `${260 + pos.y - 2}px`,
                          width: '4px',
                          height: '4px',
                          background: '#00f0ff',
                          opacity: inFront ? 0.6 : 0.1,
                          boxShadow: inFront ? '0 0 8px 2px rgba(0,240,255,0.6)' : 'none',
                          zIndex: inFront ? 12 : 3,
                          transition: 'opacity 0.3s ease',
                        }}
                      />
                    );
                  })
                )}

                {/* Connector Line to Popup */}
                {activeEngineIndex !== null && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 15 }}>
                    {(() => {
                      const idx = activeEngineIndex;
                      const ePos = getEngineScreenPos(idx, currentAngle);
                      const startX = ePos.x;
                      const startY = ePos.y;
                      const endX = -10;
                      const endY = 260;
                      const cp1x = startX - 80;
                      const cp1y = startY;
                      const cp2x = endX + 80;
                      const cp2y = endY;
                      return (
                        <>
                          <AnimatePresence>
                            <motion.path
                              key={idx}
                              d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                              stroke={engineDetails[idx].accent}
                              strokeWidth="2.5"
                              strokeDasharray="6 6"
                              fill="none"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 0.8 }}
                              exit={{ pathLength: 0, opacity: 0 }}
                              transition={{ duration: 0.5, ease: "easeOut" }}
                            />
                          </AnimatePresence>
                          <AnimatePresence>
                            <motion.circle
                              key={`dot-${idx}`}
                              cx="-10"
                              cy="260"
                              r="4"
                              fill={engineDetails[idx].accent}
                              initial={{ scale: 0 }}
                              animate={{ scale: [1, 1.8, 1] }}
                              exit={{ scale: 0 }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          </AnimatePresence>
                        </>
                      );
                    })()}
                  </svg>
                )}

                {/* Detailed Pop-up Overlay Card */}
                <AnimatePresence>
                  {activeEngineIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, x: -30, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -30, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: EASE_PREMIUM as unknown as number[] }}
                      className="absolute left-[-300px] top-[75px] w-[290px] h-[370px] bg-white rounded-[2.5rem] p-6 shadow-2xl z-30 border-l-[6px] text-left flex flex-col justify-between"
                      style={{
                        borderColor: engineDetails[activeEngineIndex].accent,
                        boxShadow: `0 25px 50px -12px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.8), 0 0 35px ${engineDetails[activeEngineIndex].accent}15`
                      }}
                    >
                      {selectedEngine !== null && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEngine(null);
                          }}
                          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-navy transition-colors cursor-pointer z-40"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeEngineIndex}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="h-full flex flex-col justify-between overflow-visible"
                        >
                          <div className="overflow-visible">
                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300"
                                style={{
                                  background: `${engineDetails[activeEngineIndex].accent}15`,
                                  color: engineDetails[activeEngineIndex].accent
                                }}
                              >
                                {engineDetails[activeEngineIndex].icon}
                              </div>
                              <div>
                                <span
                                  className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 block transition-colors duration-300"
                                  style={{ color: engineDetails[activeEngineIndex].accent }}
                                >
                                  {engineDetails[activeEngineIndex].label}
                                </span>
                                <h3 className="text-base font-black text-brand-navy leading-none">
                                  {engineDetails[activeEngineIndex].name}
                                </h3>
                              </div>
                            </div>

                            <p className="text-[10px] font-extrabold text-[#C7AE6A] uppercase tracking-wider mb-2.5 leading-none">
                              {engineDetails[activeEngineIndex].title}
                            </p>

                            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                              {engineDetails[activeEngineIndex].desc}
                            </p>

                            <ul className="space-y-1.5">
                              {engineDetails[activeEngineIndex].bullets.map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-600 leading-tight">
                                  <CheckCircle2
                                    className="w-3.5 h-3.5 shrink-0 mt-0.5 transition-colors duration-300"
                                    style={{ color: engineDetails[activeEngineIndex].accent }}
                                  />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <span className="text-[9px] font-bold text-gray-400 italic mt-2 leading-none border-t border-gray-50 pt-2 block w-full">
                            {engineDetails[activeEngineIndex].tagline}
                          </span>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Electron Nodes (Engines) */}
                {orbitConfig.flatMap((orbit) =>
                  orbit.engines.map((engineIdx, ei) => {
                    const theta = orbit.startAngles[ei] + currentAngle * orbit.speed;
                    const pos = getElectronPos(orbit.tiltZ, orbit.tiltX, theta, ORBIT_RADIUS);
                    const screenX = 260 + pos.x;
                    const screenY = 260 + pos.y;
                    const isInFront = pos.z >= 0;
                    const eng = engineDetails[engineIdx];
                    const isActive = activeEngineIndex === engineIdx;

                    return (
                      <div
                        key={engineIdx}
                        className="absolute"
                        style={{
                          left: `${screenX - 38}px`,
                          top: `${screenY - 38}px`,
                          width: '76px',
                          height: '76px',
                          zIndex: isInFront ? 20 : 5,
                          transition: 'opacity 0.3s ease',
                        }}
                      >
                        <div
                          onClick={() => setSelectedEngine(selectedEngine === engineIdx ? null : engineIdx)}
                          onMouseEnter={() => setHoveredEngine(engineIdx)}
                          onMouseLeave={() => setHoveredEngine(null)}
                          className={`relative w-full h-full rounded-full flex items-center justify-center shadow-lg border-[3.5px] cursor-pointer select-none transition-all duration-300 bg-white ${isActive ? 'scale-110' : 'hover:scale-105'
                            }`}
                          style={{
                            borderColor: eng.accent,
                            boxShadow: isActive
                              ? `0 0 25px ${eng.accent}90, inset 0 0 10px rgba(255,255,255,0.8)`
                              : `0 4px 12px rgba(0,0,0,0.15)`,
                            opacity: isInFront || isActive ? 1 : 0.5,
                          }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                              background: isActive ? eng.accent : `${eng.accent}12`,
                              color: isActive ? '#162641' : eng.accent
                            }}
                          >
                            {eng.icon}
                          </div>

                          {/* Orbit Label */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider transition-all duration-300 pointer-events-none top-[84px]"
                            style={{
                              background: isActive ? `${eng.accent}20` : 'rgba(22, 38, 65, 0.9)',
                              border: `1px solid ${isActive ? eng.accent : 'rgba(255,255,255,0.1)'}`,
                              color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
                              boxShadow: isActive ? `0 0 10px ${eng.accent}30` : 'none'
                            }}
                          >
                            {eng.name}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

              </div>

              {/* Mobile/Tablet: Flat Grid fallback */}
              <div className="lg:hidden w-full grid sm:grid-cols-2 gap-4 mt-8">
                {engineDetails.map((eng, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-6 shadow-md border-l-[5px] text-left"
                    style={{ borderColor: eng.accent }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: `${eng.accent}15`, color: eng.accent }}
                      >
                        {eng.icon}
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 block" style={{ color: eng.accent }}>
                          {eng.label}
                        </span>
                        <h4 className="text-sm font-extrabold text-brand-navy leading-none">{eng.name}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{eng.desc}</p>

                    <ul className="space-y-1.5">
                      {eng.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-600 leading-tight">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: eng.accent }} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What sets us apart */}
      <section className="relative py-24 overflow-hidden bg-[#fbf0cf]">
        {/* Background texture dots */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(22,38,65,0.06) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-20" stagger={staggerContainer}>
            <motion.h2
              className="text-4xl lg:text-6xl font-bold text-brand-navy mb-4 leading-tight"
              variants={fadeUp}
              transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
            >
              What sets{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #b59a53 0%, #8c7333 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                us
              </span>{" "}
              apart
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base font-bold uppercase tracking-[0.3em] mb-6 text-[#b59a53]"
              variants={fadeUp}
            >
              Structure · Visibility · Alignment
            </motion.p>
            <motion.p
              className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed font-medium"
              variants={fadeUp}
              transition={{ duration: 0.5 }}
            >
              Five interconnected engines that form the core of the hiyrED® ecosystem — engineered to build capability and drive real outcomes.
            </motion.p>
          </AnimatedSection>

          {/* New 2-column structure: Differentiators stacked on the left, Shifts on the right */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-8">
            {/* Left side: Differentiators (Industry Pool, Talent Pool) */}
            <div className="lg:col-span-6 flex flex-col gap-6 w-full">
              {differentiators.map((d, i) => {
                const textAccent = i === 0 ? "#b59a53" : "#0284c7";
                const bgAccent = i === 0 ? "#C7AE6A" : "#7dd3fc";
                return (
                  <motion.div
                    key={i}
                    variants={i % 2 === 0 ? fadeLeft : fadeRight}
                    transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                    whileHover={{
                      y: -6,
                      transition: { duration: 0.3, ease: EASE_SMOOTH as unknown as number[] },
                    }}
                    className="group relative rounded-[2.5rem] p-8 lg:p-10 cursor-default overflow-hidden text-left"
                    style={{
                      background: "rgba(255, 255, 255, 0.45)",
                      border: "1px solid rgba(255, 255, 255, 0.6)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    {/* Hover glow border */}
                    <motion.div
                      className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 1.5px ${textAccent}35, 0 10px 40px ${textAccent}12`,
                      }}
                    />

                    {/* Corner index */}
                    <span
                      className="absolute top-8 right-8 text-7xl font-black leading-none select-none pointer-events-none"
                      style={{ color: `${bgAccent}20`, fontVariantNumeric: "tabular-nums" }}
                    >
                      {d.index}
                    </span>

                    {/* Engine badge */}
                    <div className="flex items-center gap-3 mb-6">
                      <motion.span
                        className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em]"
                        style={{
                          background: `${bgAccent}15`,
                          color: textAccent,
                          border: `1px solid ${textAccent}30`,
                        }}
                        whileHover={{ scale: 1.06 }}
                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      >
                        {d.engine}
                      </motion.span>
                      {/* Divider line */}
                      <motion.div
                        className="h-px flex-1 max-w-[48px] bg-brand-navy/15"
                        initial={{ scaleX: 0, originX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl font-bold text-brand-navy mb-3"
                      style={{ lineHeight: 1.25 }}
                    >
                      {d.title}
                    </h3>

                    {/* Headline */}
                    <p
                      className="text-sm font-semibold mb-4 leading-snug"
                      style={{ color: textAccent }}
                    >
                      {d.headline}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">{d.desc}</p>

                    {/* Bottom accent bar */}
                    <motion.div
                      className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${textAccent}, transparent)` }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Right side: Shifts comparisons (transparent glass background box container) */}
            <div className="lg:col-span-6 bg-white/45 backdrop-blur-xl p-8 lg:p-10 rounded-[2.5rem] flex flex-col gap-4 shadow-xl text-left border border-white/60">
              {/* Headers */}
              <div className="flex items-center gap-6 px-4 pb-1">
                <p className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">what the stakeholders say</p>
                <div className="hidden sm:block w-5" />
                <p className="flex-1 text-xs font-bold text-[#b59a53] tracking-wider uppercase">WHAT hiyrED® DELIVERS</p>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {shifts.map((s, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/95 px-6 py-5 rounded-2xl border border-white/90 shadow-md flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group"
                    whileHover={{ x: -8, boxShadow: "0 20px 40px rgba(22,38,65,0.06)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-1">
                      <p className="text-gray-500 font-medium text-sm leading-snug">{s.old}</p>
                    </div>
                    <div className="hidden sm:block text-gray-400">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <div className="flex-1 flex items-center gap-2">
                      {s.icon}
                      <p className="text-brand-navy font-bold text-sm leading-snug">{s.new}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};



// ─── Features ──────────────────────────────────────────────────────────────────

const EcosystemHub = () => {
  const ecosystem = [
    { icon: <Users />, title: "Students", desc: "Join the community, upskill through structured paths, and build an undeniable proof-of-work portfolio." },
    { icon: <Briefcase />, title: "Recruiters", desc: "Bypass resumes. Scout and handpick pre-assessed talent directly from a pan-India verified pool." },
    { icon: <ShieldCheck />, title: "Institutions", desc: "Track cohort capability, identify skill gaps, and visualize real-time placement readiness." },
    { icon: <Code2 />, title: "Educators & Mentors", desc: "Mentor via hiyrED® Compass, design capability paths, and earn by creating trackable impact." },
  ];

  return (
    <section className="py-24 bg-[#fbf0cf]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12" stagger={staggerContainer}>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-[#162641]"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            An ecosystem engineered for success
          </motion.h2>
        </AnimatedSection>

        <AnimatedSection stagger={staggerContainerFast} className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {ecosystem.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
              whileHover={{
                y: -8,
                boxShadow: "0 20px 50px rgba(22,38,65,0.08)",
                transition: { duration: 0.3, ease: EASE_SMOOTH as unknown as number[] }
              }}
              className="p-8 lg:p-10 rounded-[3rem] bg-white border border-gray-100 hover:shadow-xl hover:shadow-brand-navy/5 transition-all group cursor-default flex items-start gap-6"
            >
              <motion.div
                className="w-14 h-14 bg-brand-navy/5 text-brand-navy rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-navy group-hover:text-white transition-colors duration-300"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {f.icon}
              </motion.div>
              <div>
                <h4 className="text-xl font-bold text-brand-navy mb-3 transition-colors duration-300">{f.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </AnimatedSection>
      </div>
    </section>
  );
};

// ─── Testimonial ───────────────────────────────────────────────────────────────

const Testimonial = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <AnimatedSection variants={scaleIn} className="w-full max-w-[1150px]">
          {/* Outer Wrapper for the soft layered border effect */}
          <motion.div
            className="w-full p-[2px] bg-[#c4b5fd]/40 rounded-[4rem]"
            whileHover={{ boxShadow: "0 20px 60px rgba(196,181,253,0.2)" }}
            transition={{ duration: 0.4 }}
          >
            {/* Inner Card */}
            <div className="w-full lg:h-[340px] rounded-[3.5rem] bg-[#fafafa] p-8 lg:py-[40px] lg:px-[48px] flex flex-col lg:flex-row items-center lg:gap-[48px] transition-all">
              {/* Left Side: Image */}
              <motion.div
                className="w-full lg:w-[280px] h-[220px] lg:h-full rounded-[2rem] overflow-hidden shrink-0"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, ease: EASE_SMOOTH as unknown as number[] }}
              >
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                  alt="Maya Lin"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              {/* Right Side: Content */}
              <AnimatedSection
                stagger={staggerContainer}
                className="flex-1 flex flex-col justify-center text-left py-8 lg:py-0"
              >
                <div className="max-w-3xl">
                  {/* Quote */}
                  <motion.h3
                    className="text-xl md:text-2xl lg:text-[2.25rem] font-medium text-[#1a1a1a] leading-[1.3] mb-6 tracking-tight"
                    variants={fadeRight}
                    transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                  >
                    "We've hired faster and smarter since switching to hiyrED® — it&apos;s like having a recruiter built into our hiring process"
                  </motion.h3>

                  {/* Author Info */}
                  <motion.div
                    className="mb-8"
                    variants={fadeUp}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-base lg:text-lg font-bold text-[#1a1a1a]">Maya Lin, </span>
                    <span className="text-base lg:text-lg text-[#6b7280]">VP of People, SeedFlow</span>
                  </motion.div>

                  {/* Navigation Controls */}
                  <motion.div
                    className="flex items-center gap-4"
                    variants={fadeUp}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.button
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <span className="text-xs font-medium text-gray-500 tracking-widest">1 / 5</span>
                    <motion.button
                      className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.92 }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                </div>
              </AnimatedSection>
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

const TalentShowcasePreview = () => {
  const students = [
    { name: "Alex Rivera", role: "Frontend Developer", capability: "84% Forge Readiness", verified: true },
    { name: "Sarah Chen", role: "Data Analyst", capability: "72% Forge Readiness", verified: true },
    { name: "Rahul Sharma", role: "Backend Engineer", capability: "95% Forge Readiness", verified: true },
    { name: "Priya Patel", role: "Product Manager", capability: "68% Forge Readiness", verified: false },
  ];

  return (
    <section className="py-24 bg-[#fbf0cf]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text */}
          <AnimatedSection stagger={staggerContainer}>
            <motion.h2
              className="text-4xl lg:text-5xl font-bold text-brand-navy mb-6"
              variants={fadeLeft}
              transition={{ duration: 0.6 }}
            >
              The Capability Verified Talent Pool
            </motion.h2>
            <motion.p
              className="text-lg text-gray-600 mb-10 leading-relaxed"
              variants={fadeLeft}
              transition={{ duration: 0.5 }}
            >
              No resumes. No college bias. Just pure, verified proof-of-work. Industry leaders use the Talent Pool to scout students based entirely on their real-world Forge capabilities.
            </motion.p>
            <motion.button
              className="px-8 py-4 bg-brand-navy text-white font-bold rounded-full hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/20"
              variants={fadeUp}
              whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(22,38,65,0.3)" }}
              whileTap={{ scale: 0.97 }}
            >
              View Talent Pool
            </motion.button>
          </AnimatedSection>

          {/* Right: Student Cards */}
          <AnimatedSection stagger={staggerContainerFast} className="grid gap-4">
            {students.map((s, i) => (
              <motion.div
                key={i}
                variants={fadeRight}
                transition={{ duration: 0.4, ease: EASE_PREMIUM as unknown as number[] }}
                whileHover={{
                  x: 10,
                  boxShadow: "0 10px 40px rgba(22,38,65,0.08)",
                  transition: { duration: 0.25, ease: EASE_SMOOTH as unknown as number[] }
                }}
                className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-12 h-12 rounded-[1.25rem] bg-gray-50 flex items-center justify-center group-hover:bg-brand-gold/10 transition-colors duration-300"
                  >
                    <Users className="text-gray-400 group-hover:text-brand-gold transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-brand-navy">{s.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{s.role}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{s.capability}</span>
                      {s.verified && <span className="text-[10px] text-gray-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-brand-gold" /> Verified Projects</span>}
                    </div>
                  </div>
                </div>
                <motion.button
                  className="p-2 rounded-full bg-gray-50 text-gray-400 group-hover:bg-brand-navy group-hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};



// ─── Insights & News ──────────────────────────────────────────────────────────

const InsightsNews = () => {
  const [activeArticle, setActiveArticle] = useState<any | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  const articles = [
    {
      badge: "Trending",
      badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      title: "Bootcamps vs. Online Courses: Choosing the Right Route into Tech",
      desc: "Is a structured bootcamp or a self-paced course better for entering tech? We analyze the cost, commitment, and placement outcomes.",
      content: "Entering the tech industry can feel like standing at a crossroads. On one hand, you have coding bootcamps—structured, fast-paced, highly intensive, and often costing thousands of dollars upfront. On the other hand, self-paced online courses offer ultimate flexibility and low costs, but suffer from a notoriously low completion rate (often under 10%).\n\nSo, which path is the right one for you? Traditional bootcamps force you into a fixed schedule, whereas self-paced platforms lack any real human accountability. At hiyrED®, we bridge this divide by aligning structured capability paths with outcome-based models. We believe the key is not just consuming tutorials, but building verified proof-of-work that hiring teams can actually trust.\n\nWhen evaluating paths, consider three dimensions: feedback loops, structure, and outcome alignment. A successful tech route must challenge you to build real-world systems while testing your coding, design, and problem-solving abilities continuously under time pressure.",
      author: "Umair Mughal",
      date: "April 21, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600"
    },
    {
      badge: "Deep Dive",
      badgeColor: "text-sky-400 bg-sky-400/10 border-sky-400/20",
      title: "AI-Supported Tech Roles: Start with Zero Code Experience",
      desc: "Discover the new wave of tech roles powered by AI assistants that allow you to start immediately with no previous coding background.",
      content: "The rise of generative AI has fundamentally changed what it means to be a technology professional. Today, you do not need to spend years mastering complex programming syntax to build valuable software. AI coding assistants, low-code systems, and prompt engineering have opened up a brand-new category of 'AI-supported' tech roles.\n\nThese positions value systems design, logical problem-solving, product thinking, and domain knowledge over raw typing speed. In these roles, human intelligence guides the system, while AI handles the syntax generation. This transition shifts the core value of an engineer from code execution to architectural design and capability validation.\n\nAt hiyrED®, we prepare students for this new reality. Our capability mapping targets multi-disciplinary domains, helping you prove your aptitude, communication skills, and systems engineering mindset, regardless of whether you have a computer science degree. The future of tech is collaborative, and AI is your co-pilot.",
      author: "Ashwini Zinjurde",
      date: "March 13, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600"
    },
    {
      badge: "Guides",
      badgeColor: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      title: "Eligibility for Fully-Funded Tech Training: A Guide to Forge Paths",
      desc: "Learn how you can qualify for fully-funded competency paths and corporate-partnered projects through the hiyrED® Forge program.",
      content: "At hiyrED®, we believe that financial constraints should never stand in the way of talent. That is why our core capability-building paths through the hiyrED® Forge are fully funded. But how does this program work, and who qualifies?\n\nOur outcome-aligned model means we invest in your training upfront. You only contribute back to the community after you secure a high-quality placement, based on a percentage of your actual Cost to Company (CTC). This ensures that our incentives are 100% aligned with your professional success.\n\nTo qualify, students undergo a Cortex-informed assessment on entry to map their baseline skills, cognitive ability, and interest areas. From there, counselors help you establish your target CTC Path. Once eligible, you gain immediate, unrestricted access to specialized domain training, industry hackathons, and certified mentorship sessions.",
      author: "Umair Mughal",
      date: "March 10, 2026",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
    },
    {
      badge: "Trends",
      badgeColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
      title: "Resumes are Dead: The Rise of the Capability Profile",
      desc: "Why traditional resumes fail to capture actual skills, and how hiyrED® Cortex leverages data to build verified proof-of-work profiles.",
      content: "For decades, the two-page PDF resume has been the default gatekeeper of professional opportunities. Yet, everyone knows its core flaws: resumes are easy to inflate, fail to show how a candidate works under pressure, and say nothing about their communication, attitude, or well-being.\n\nAt hiyrED®, we are rendering resumes redundant. Through hiyrED® Cortex, we synthesize dynamic data points from assessments, Forge activities, Premier League challenges, and mentor feedback into a single, real-time dynamic Capability Profile.\n\nInstead of reading through text claims like 'expert problem solver', recruiters can view verified metrics, CodeLAB performance patterns, and direct evaluations of Industry Projects. By focusing on verified proof-of-work, we remove college tier bias and help companies hire based on demonstrated capabilities rather than pedigree.",
      author: "Ashwini Zinjurde",
      date: "February 28, 2026",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600"
    },
    {
      badge: "Mentorship",
      badgeColor: "text-rose-400 bg-rose-400/10 border-rose-400/20",
      title: "Understanding hiyrED® Compass Career Counselling",
      desc: "A close look at how hiyrED® Compass connects students with career experts and coaches to guide growth based on actual performance data.",
      content: "Traditional career counselling is often reactive and generic—resulting in students receiving the same copy-paste advice regardless of their unique cognitive profiles. hiyrED® Compass is designed on a completely different premise: 'Where your capability is, that is where we guide you.'\n\nBy feeding live capability maps from hiyrED® Cortex directly to our career experts and ICF-certified life coaches, we ensure that every session is hyper-personalized. If your data points indicate high mathematical aptitude but lower verbal fluency, our mentors don't just tell you to 'study harder'; they guide you toward roles that leverage your quantitative strengths while suggesting targeted communication paths.\n\nCompass bridges the gap between raw data and human motivation, ensuring that student career decisions are anchored in reality and guided by professionals who understand their actual capability trajectory.",
      author: "Umair Mughal",
      date: "January 15, 2026",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600"
    },
    {
      badge: "Well-being",
      badgeColor: "text-[#c7ae6a] bg-[#c7ae6a]/10 border-[#c7ae6a]/20",
      title: "Resilience Velocity: How We Measure Responses to Setbacks",
      desc: "Failed an assessment? Missed a shortlist? Learn how hiyrED® Pulse tracks and supports your resilience velocity to trigger friendly interventions.",
      content: "Setbacks are an inevitable part of building a career. You might fail a difficult Forge coding test, get dropped from a recruiter shortlist, or find yourself struggling with a project deadline. Traditional learning systems ignore these emotional dips, but hiyrED® Pulse is engineered to support you through them.\n\nWe measure 'resilience velocity'—defined as the speed and quality of a student's re-engagement after a setback. Pulse reads engagement patterns from action, not self-reporting. If the system flags declining resilience or post-rejection disengagement, it alerts mentors via hiyrED® Compass.\n\nRather than putting more placement pressure on you, the platform triggers friendly, supportive human interventions, offering customized pause recommendations and motivation coaching. We believe that true career readiness is built on resilience, and mental well-being is a core performance metric.",
      author: "Ashwini Zinjurde",
      date: "December 20, 2025",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600"
    }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < articles.length - visibleCards) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <section
      className="relative py-28 overflow-hidden text-left"
      style={{ background: "linear-gradient(160deg, #0b1322 0%, #101c30 60%, #162641 100%)" }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      {/* Background decoration dots and circles */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(199,174,106,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#c7ae6a]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[30rem] h-[30rem] bg-blue-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16" stagger={staggerContainer}>
          <motion.p
            className="text-xs font-black uppercase tracking-[0.25em] text-[#c7ae6a] mb-3"
            variants={fadeUp}
          >
            Blog & News
          </motion.p>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
          >
            hiyrED® <span className="text-[#c7ae6a]">Insights & News</span>
          </motion.h2>
          <motion.p
            className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
          >
            Explore the latest articles, expert insights, and essential updates from hiyrED®. Stay informed about industry trends, capability building, and resources designed to accelerate your career.
          </motion.p>
        </AnimatedSection>

        {/* Carousel Slider Outer Wrapper with side arrows */}
        <div className="relative px-12 md:px-16">
          {/* Left Arrow (Absolute positioned, centered vertically) */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-[#0b1322]/80 backdrop-blur-md flex items-center justify-center text-white hover:border-[#c7ae6a] hover:text-[#c7ae6a] hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Slider Viewport */}
          <div className="overflow-hidden w-full py-12">
            <motion.div
              animate={{ x: `-${currentIndex * (100 / visibleCards)}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="flex"
              style={{ width: "100%" }}
            >
              {articles.map((art, i) => {
                // Apply vertical stagger translates to break grid monotony on desktop inside track
                let staggerClass = "";
                const colIndex = i % 3;
                if (colIndex === 0) staggerClass = "lg:translate-y-6";
                if (colIndex === 2) staggerClass = "lg:-translate-y-6";

                return (
                  <div
                    key={i}
                    className="shrink-0 w-full sm:w-1/2 lg:w-1/3 px-4"
                  >
                    <motion.div
                      variants={fadeUp}
                      transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                      whileHover={{
                        y: colIndex === 0 ? 12 : colIndex === 2 ? -36 : -12,
                        scale: 1.025,
                        transition: { duration: 0.3, ease: EASE_SMOOTH as unknown as number[] },
                      }}
                      className={`group flex flex-col justify-between rounded-[2.5rem] overflow-hidden ${staggerClass} transition-shadow duration-500 relative h-full`}
                      style={{
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid rgba(255, 255, 255, 0.07)",
                        backdropFilter: "blur(20px)",
                      }}
                    >
                      {/* Image Container with zoom effect */}
                      <div className="relative h-56 overflow-hidden rounded-t-[2.5rem] w-full shrink-0">
                        <img
                          src={art.image}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        {/* Subtle dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1322]/80 via-transparent to-transparent pointer-events-none" />

                        {/* Category Badge on top of image */}
                        <span className={`absolute top-6 left-6 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${art.badgeColor} backdrop-blur-md`}>
                          {art.badge}
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className="p-8 flex-1 flex flex-col justify-between">
                        <div>
                          {/* Meta info */}
                          <div className="flex items-center gap-2 text-gray-500 text-xs mb-4">
                            <span>{art.author}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-700" />
                            <span>{art.date}</span>
                          </div>

                          {/* Title */}
                          <h3 className="text-xl font-bold text-white group-hover:text-[#c7ae6a] transition-colors duration-300 mb-3 leading-snug">
                            {art.title}
                          </h3>

                          {/* Excerpt */}
                          <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {art.desc}
                          </p>
                        </div>

                        {/* Read More & Read Time */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-5 mt-auto">
                          <span className="text-xs text-gray-500 font-medium">
                            {art.readTime}
                          </span>
                          <span
                            onClick={() => setActiveArticle(art)}
                            className="flex items-center gap-1.5 text-xs text-[#c7ae6a] font-bold group-hover:underline cursor-pointer"
                          >
                            Read Article
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                          </span>
                        </div>
                      </div>

                      {/* Hover Glow Border */}
                      <motion.div
                        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          boxShadow: "inset 0 0 0 1.5px rgba(199, 174, 106, 0.25), 0 20px 50px rgba(199, 174, 106, 0.05)",
                        }}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Arrow (Absolute positioned, centered vertically) */}
          <button
            onClick={nextSlide}
            disabled={currentIndex >= articles.length - visibleCards}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/10 bg-[#0b1322]/80 backdrop-blur-md flex items-center justify-center text-white hover:border-[#c7ae6a] hover:text-[#c7ae6a] hover:bg-white/5 disabled:opacity-20 disabled:pointer-events-none transition-all cursor-pointer z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Paging Indicators (Capsule Dots) */}
        <div className="flex items-center justify-center gap-2 mt-4 z-10 relative">
          {Array.from({ length: articles.length - visibleCards + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx ? "w-8 bg-[#c7ae6a]" : "w-2 bg-white/20 hover:bg-white/40"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Glassmorphic Modal with Exit Transition */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop (Do not max blur - change blur to light 2px) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveArticle(null)}
              className="absolute inset-0 bg-[#0b1322]/75 backdrop-blur-[2px]"
            />

            {/* Modal Body (Increased size, no scrollbar) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative w-full max-w-5xl max-h-[85vh] overflow-y-auto no-scrollbar rounded-[3rem] p-10 md:p-16 text-left z-10 shadow-2xl border border-white/10"
              style={{
                background: "rgba(16, 28, 48, 0.75)",
                backdropFilter: "blur(40px)",
              }}
            >
              {/* Floating Close Button */}
              <motion.button
                onClick={() => setActiveArticle(null)}
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 hover:text-[#c7ae6a] transition-all cursor-pointer"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Category Badge */}
              <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${activeArticle.badgeColor} mb-8`}>
                {activeArticle.badge}
              </span>

              {/* Title (Increased text size) */}
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {activeArticle.title}
              </h2>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-gray-400 text-sm mb-10">
                <span className="font-bold text-white text-base">{activeArticle.author}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <span>{activeArticle.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                <span className="text-[#c7ae6a] font-semibold">{activeArticle.readTime}</span>
              </div>

              {/* Modal Image */}
              <div className="relative h-80 md:h-[400px] w-full overflow-hidden rounded-3xl mb-10">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101c30]/60 to-transparent pointer-events-none" />
              </div>

              {/* Article Body Content (Increased sizing & spacing) */}
              <div className="text-gray-300 text-base md:text-lg leading-relaxed space-y-8">
                {activeArticle.content.split("\n\n").map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="border-t border-white/5 pt-10 mt-10 flex justify-end">
                <motion.button
                  onClick={() => setActiveArticle(null)}
                  className="px-8 py-3.5 bg-brand-navy text-white text-sm font-bold rounded-full border border-white/10 hover:bg-[#c7ae6a] hover:text-brand-navy transition-colors duration-300 shadow-lg cursor-pointer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close Article
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};



// ─── FAQs Section ─────────────────────────────────────────────────────────────

const FAQItem = ({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void; key?: any }) => {
  return (
    <div className="border-b border-gray-100 last:border-0 py-5">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left group focus:outline-none cursor-pointer"
      >
        <span className="font-bold text-brand-navy text-base md:text-lg group-hover:text-brand-gold transition-colors duration-200">
          {question}
        </span>
        <div
          className={`w-7 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm transition-all duration-300 ${isOpen ? "bg-brand-navy" : "bg-brand-gold hover:bg-brand-gold-rich"
            }`}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
            className="font-bold text-xl leading-none select-none"
          >
            +
          </motion.span>
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE_PREMIUM as unknown as number[] }}
        className="overflow-hidden"
      >
        <p className="text-gray-500 text-sm md:text-base leading-relaxed pt-4 pr-10">
          {answer}
        </p>
      </motion.div>
    </div>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is hiyrED® and how does it differ from traditional platforms?",
      answer: "hiyrED® is a community-driven talent ecosystem—built by students, for students—where capability is built, proven, and connected to opportunity. Unlike traditional resume-based portals, we map talent using verified capabilities derived from real-world assessments and industry projects."
    },
    {
      question: "What are the key system engines powering hiyrED®?",
      answer: "The ecosystem is driven by four key engines: Cortex (synthesizes capability and well-being data into verified profiles), Forge (offers tailored placement readiness paths), Pulse (monitors mental well-being and burnout signals), and Compass (provides cortex-informed mentorship and professional career coaching)."
    },
    {
      question: "What is the Capability Transformation Cortex Path (CTC Path)?",
      answer: "The CTC Path is a dynamic roadmap generated by hiyrED® Cortex. It analyzes the gap between your current verified skills and requirements from our recruiter network, mapping a structured, step-by-step journey to close that gap and reach role-readiness."
    },
    {
      question: "Is hiyrED® free for students? How does the payment model work?",
      answer: "Joining the hiyrED® community, building your profile, and completing Forge capability paths is entirely free. We only succeed when you succeed—you only pay after you secure a placement, based on an outcome-aligned percentage of your Cost to Company (CTC)."
    },
    {
      question: "How does hiyrED® support student mental well-being and resilience?",
      answer: "Through hiyrED® Pulse, the system tracks patterns of stress, burnout, and declining resilience (like re-engagement velocity after a setback). Pulse flags these signals early to coordinate friendly mentor interventions via hiyrED® Compass, offering supportive pauses rather than pressure."
    },
    {
      question: "How can recruiters and institutions verify student capabilities on the platform?",
      answer: "Recruiters access verified capability profiles in the Talent Pool rather than unverified resumes. They can see concrete performance indicators, including assessed Forge milestones, scores from the hiyrED® Premier League, and direct outcomes from verified Industry Projects evaluated by hiring organizations."
    }
  ];

  return (
    <section className="py-24 bg-[#fbf0cf]/15 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16" stagger={staggerContainer}>
          <motion.p
            className="text-sm font-black uppercase tracking-[0.2em] mb-3 text-brand-gold"
            variants={fadeUp}
          >
            FAQs
          </motion.p>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-brand-navy mb-4 leading-tight"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
          >
            Got Questions? We've Got Answers
          </motion.h2>
        </AnimatedSection>

        <AnimatedSection variants={fadeUp}>
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-gray-100 shadow-sm text-left">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ─── Final CTA ─────────────────────────────────────────────────────────────────

const FinalCTA = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection variants={scaleIn}>
          <motion.div
            className="relative p-12 lg:p-20 rounded-[4rem] overflow-hidden gold-gradient"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH as unknown as number[] }}
          >
            <div className="relative z-10 grid lg:grid-cols-12 gap-12 items-center text-left">
              {/* Left Column: CTA */}
              <AnimatedSection stagger={staggerContainer} className="lg:col-span-7">
                <motion.h2
                  className="text-4xl lg:text-5xl font-extrabold text-brand-navy mb-6 leading-tight"
                  variants={fadeUp}
                  transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                >
                  Ready to build your capability?
                </motion.h2>
                <motion.p
                  className="text-lg text-brand-navy/80 mb-10 max-w-xl"
                  variants={fadeUp}
                  transition={{ duration: 0.5 }}
                >
                  Join the ecosystem where ambition meets structure. Upskill, prove your worth, and let the industry come to you.
                </motion.p>
                <div className="relative inline-block mt-4">
                  {/* Floating Highlighted Free Tag 
                  <motion.span
                    className="absolute -top-4 left-6 z-20 px-3.5 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap"
                    animate={{
                      x: [0, 140, 156, 140, 0, -16, 0],
                      y: [0, 0, 32, 64, 64, 32, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      times: [0, 0.3, 0.4, 0.5, 0.8, 0.9, 1],
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    Free
                  </motion.span>*/}
                  <motion.button
                    onClick={() => (window as any).triggerWaitlist("Community")}
                    className="px-10 py-5 bg-brand-navy text-white font-black rounded-full hover:scale-105 transition-all shadow-2xl shadow-brand-navy/20 border border-brand-navy/5 cursor-pointer"
                    variants={fadeUp}
                    whileHover={{ scale: 1.06, boxShadow: "0 20px 60px rgba(22,38,65,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Join the Community
                  </motion.button>
                </div>
              </AnimatedSection>

              {/* Right Column: Outcomes Promise */}
              <motion.div
                className="lg:col-span-5 bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 lg:p-10 border border-white/30 shadow-xl"
                variants={fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-brand-navy shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider text-brand-navy">
                    Outcome-Based Success
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-brand-navy mb-4">
                  No upfront costs.
                </h3>
                <p className="text-brand-navy/80 text-sm leading-relaxed mb-6">
                  We believe in your capability so much that we invest in it. You only pay after you get placed, based on a percentage of your CTC. If you don't win, neither do we.
                </p>
                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold bg-brand-navy text-white">
                  Income Share Agreement (ISA)
                </span>
              </motion.div>
            </div>

            {/* Decorative circles */}
            <motion.div
              className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"
              animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
};

// ─── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => {
  const navLinks = ["Community", "For Recruiters", "For Institutions", "Contact"];
  const legalLinks = ["Privacy", "Terms", "Cookies"];

  return (
    <footer className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
          {/* Left: Logo + Tagline */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <img src="/favicon.svg" alt="" className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">hiyrED<sup className="text-[8px] ml-0.5">®</sup></span>
              <p className="text-white/40 text-xs mt-0.5">Futures Empowered</p>
            </div>
          </div>

          {/* Right: Nav Links + Socials */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-white/50 hover:text-brand-gold transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              {/* Twitter / X */}
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-gold hover:text-brand-navy flex items-center justify-center transition-all duration-200 text-white/40 hover:scale-110">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-gold hover:text-brand-navy flex items-center justify-center transition-all duration-200 text-white/40 hover:scale-110">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-brand-gold hover:text-brand-navy flex items-center justify-center transition-all duration-200 text-white/40 hover:scale-110">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Gold Accent Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent mb-6" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-xs">© 2026 hiyrED® Inc. All Rights Reserved.</p>
          <div className="flex gap-6">
            {legalLinks.map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/25 text-xs hover:text-white/60 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// ─── Waitlist Popup (Stage 1) ──────────────────────────────────────────────────

interface WaitlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: (data: { category: string; name: string; email: string; phone: string }) => void;
  initialCategory: string;
  anchorEl: HTMLElement | null;
}

const WaitlistPopup = ({ isOpen, onClose, onProceed, initialCategory, anchorEl }: WaitlistPopupProps) => {
  const [category, setCategory] = useState(initialCategory);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [coords, setCoords] = useState<{ top: number; left: number; isFloating: boolean }>({ top: 0, left: 0, isFloating: false });

  useEffect(() => {
    setCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !anchorEl) {
      setCoords({ top: 0, left: 0, isFloating: false });
      return;
    }

    const updatePosition = () => {
      if (window.innerWidth < 768) {
        setCoords({ top: 0, left: 0, isFloating: false });
        return;
      }

      const rect = anchorEl.getBoundingClientRect();
      const popupWidth = 420;
      
      // Calculate top
      const top = rect.bottom + window.scrollY + 8;
      
      // Calculate left (align right side of popup with right side of button)
      let left = rect.right + window.scrollX - popupWidth;
      
      // Prevent left edge overflow
      if (left < 16) left = 16;
      // Prevent right edge overflow
      if (left + popupWidth > window.innerWidth - 16) {
        left = window.innerWidth - popupWidth - 16;
      }

      setCoords({ top, left, isFloating: true });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, anchorEl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = "Valid email is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    onProceed({ category, name, email, phone });
  };

  if (!isOpen) return null;

  const wrapperStyle: React.CSSProperties = coords.isFloating
    ? {
        position: "absolute",
        top: coords.top,
        left: coords.left,
        transformOrigin: "top right",
      }
    : {
        position: "relative",
        transformOrigin: "center",
      };

  return (
    <AnimatePresence>
      <div 
        className={`fixed inset-0 z-50 p-4 ${
          coords.isFloating ? "pointer-events-none" : "bg-brand-navy/60 backdrop-blur-md flex items-center justify-center"
        }`}
        onClick={(e) => {
          if (e.target === e.currentTarget && !coords.isFloating) onClose();
        }}
      >
        {/* Backdrop overlay for floating state so click outside closes it */}
        {coords.isFloating && (
          <div className="fixed inset-0 z-0 pointer-events-auto" onClick={onClose} />
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.4, ease: EASE_PREMIUM as unknown as number[] }}
          className="relative max-w-md w-full rounded-3xl p-8 overflow-hidden text-left shadow-2xl pointer-events-auto"
          style={{
            ...wrapperStyle,
            background: "rgba(255, 255, 255, 0.65)",
            backdropFilter: "blur(40px) saturate(1.8) brightness(1.05)",
            WebkitBackdropFilter: "blur(40px) saturate(1.8) brightness(1.05)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            boxShadow: "0 20px 50px rgba(22, 38, 65, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.6)",
          }}
        >
          {/* Specular highlight overlay */}
          <div 
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8) 30%, rgba(255, 255, 255, 0.8) 70%, transparent)"
            }}
          />

          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 p-2 text-brand-navy/60 hover:text-brand-navy transition-colors cursor-pointer z-10">
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-extrabold text-brand-navy mb-6 flex items-center gap-2">
            <span>🔥</span> Join the Waitlist
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-2">I am joining as a:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Community", label: "Community", sub: "Student" },
                  { id: "Recruiters", label: "Recruiter", sub: "Company" },
                  { id: "Institutions", label: "Institution", sub: "HEI" }
                ].map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`py-3 px-2 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                        isSelected
                          ? "bg-brand-navy text-white border-brand-navy shadow-lg shadow-brand-navy/15 scale-102"
                          : "bg-white/40 border-white/50 text-gray-700 hover:bg-white/60"
                      }`}
                    >
                      <p className="text-sm font-bold leading-tight">{cat.label}</p>
                      <p className={`text-[10px] ${isSelected ? "text-brand-gold" : "text-brand-navy/55"}`}>{cat.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                style={{
                  background: "rgba(255, 255, 255, 0.35)",
                  backdropFilter: "blur(10px)",
                  border: errors.name ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.5)",
                  color: "#162641",
                }}
                className="w-full px-4 py-3 rounded-xl focus:bg-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/40 placeholder-brand-navy/40 font-medium"
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                style={{
                  background: "rgba(255, 255, 255, 0.35)",
                  backdropFilter: "blur(10px)",
                  border: errors.email ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.5)",
                  color: "#162641",
                }}
                className="w-full px-4 py-3 rounded-xl focus:bg-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/40 placeholder-brand-navy/40 font-medium"
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  background: "rgba(255, 255, 255, 0.35)",
                  backdropFilter: "blur(10px)",
                  border: errors.phone ? "1px solid rgba(239, 68, 68, 0.5)" : "1px solid rgba(255, 255, 255, 0.5)",
                  color: "#162641",
                }}
                className="w-full px-4 py-3 rounded-xl focus:bg-white/60 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-gold/40 placeholder-brand-navy/40 font-medium"
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.phone}</p>}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-brand-navy hover:bg-brand-navy/95 text-white font-bold rounded-xl transition-all shadow-xl shadow-brand-navy/10 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Full Form</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ─── Waitlist Full Form (Stage 2) ──────────────────────────────────────────────

interface WaitlistFullFormProps {
  isOpen: boolean;
  category: string;
  basicInfo: { name: string; email: string; phone: string };
  onClose: () => void;
}

const WaitlistFullForm = ({ isOpen, category, basicInfo, onClose }: WaitlistFullFormProps) => {
  const [success, setSuccess] = useState(false);
  const [joinedCount, setJoinedCount] = useState(1134);

  // Community State
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [domains, setDomains] = useState<string[]>(["Tech"]);
  const [linkedin, setLinkedin] = useState("");

  // Recruiter State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [recruiterDomains, setRecruiterDomains] = useState<string[]>(["Tech"]);
  const [volume, setVolume] = useState("10-50");

  // Institution State
  const [instName, setInstName] = useState("");
  const [instRole, setInstRole] = useState("");
  const [cityState, setCityState] = useState("");
  const [strength, setStrength] = useState("500-2000");
  const [branchesOffered, setBranchesOffered] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setSuccess(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Animate the joined counter on open
    let start = 1100;
    const end = 1248;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.round(start + progress * (end - start));
      setJoinedCount(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const toggleDomain = (dom: string, isRecruiter: boolean) => {
    const list = isRecruiter ? recruiterDomains : domains;
    const setList = isRecruiter ? setRecruiterDomains : setDomains;
    if (list.includes(dom)) {
      setList(list.filter(d => d !== dom));
    } else {
      setList([...list, dom]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (category === "Community") {
      if (!college.trim()) newErrors.college = "College Name is required";
      if (!branch.trim()) newErrors.branch = "Branch is required";
    } else if (category === "Recruiters") {
      if (!company.trim()) newErrors.company = "Company Name is required";
      if (!role.trim()) newErrors.role = "Designation/Role is required";
    } else if (category === "Institutions") {
      if (!instName.trim()) newErrors.instName = "Institution Name is required";
      if (!instRole.trim()) newErrors.instRole = "Your Role is required";
      if (!cityState.trim()) newErrors.cityState = "City / State is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-brand-navy/65 backdrop-blur-2xl overflow-y-auto flex items-center justify-center p-3 md:p-6">
        {/* Background Dot Grid & Glass Ambient Glows */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.08]" 
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        {/* Ambient Light Spheres for Liquid Glass Refraction */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#00f0ff]/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#c7ae6a]/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-purple-500/10 blur-[140px] pointer-events-none" />

        {/* Floating Badges (Objective Engines & Placement/Community Widgets) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none hidden lg:block">
          
          {/* Cortex Engine */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[6%] bg-white/20 backdrop-blur-2xl border border-white/40 px-5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff]">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#00f0ff] font-bold uppercase tracking-wider">Cortex</p>
              <p className="text-xs font-bold text-white">Think</p>
            </div>
          </motion.div>

          {/* Widget 1: Google Shortlisted Status */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[28%] left-[10%] bg-emerald-500/15 backdrop-blur-2xl border border-emerald-400/30 px-4.5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/25 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-emerald-300 font-extrabold uppercase tracking-wide">Shortlisted</p>
              <p className="text-[11px] font-bold text-white">Google Drive · 3 CSE</p>
            </div>
          </motion.div>

          {/* Forge Engine */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[12%] right-[8%] bg-white/20 backdrop-blur-2xl border border-white/40 px-5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#c7ae6a]/20 flex items-center justify-center text-[#c7ae6a]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-[#c7ae6a] font-bold uppercase tracking-wider">Forge</p>
              <p className="text-xs font-bold text-white">Build</p>
            </div>
          </motion.div>

          {/* Widget 2: Placements Live */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[32%] right-[12%] bg-[#c7ae6a]/15 backdrop-blur-2xl border border-[#c7ae6a]/30 px-4.5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#c7ae6a]/25 flex items-center justify-center text-[#c7ae6a]">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-[#c7ae6a] font-extrabold uppercase tracking-wide">Placements Live</p>
              <p className="text-[11px] font-bold text-white">18 Hiring Partners</p>
            </div>
          </motion.div>

          {/* Pulse Engine */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[16%] left-[6%] bg-white/20 backdrop-blur-2xl border border-white/40 px-5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">Pulse</p>
              <p className="text-xs font-bold text-white">Feel</p>
            </div>
          </motion.div>

          {/* Widget 3: Community Activity */}
          <motion.div
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[32%] left-[10%] bg-blue-500/15 backdrop-blur-2xl border border-blue-400/30 px-4.5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/25 flex items-center justify-center text-blue-300">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-blue-300 font-extrabold uppercase tracking-wide">Community Hub</p>
              <p className="text-[11px] font-bold text-white">4.2K+ Members Active</p>
            </div>
          </motion.div>

          {/* Compass Engine */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[14%] right-[6%] bg-white/20 backdrop-blur-2xl border border-white/40 px-5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Compass</p>
              <p className="text-xs font-bold text-white">Guide</p>
            </div>
          </motion.div>

          {/* Widget 4: Premier League */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute bottom-[28%] right-[10%] bg-purple-500/15 backdrop-blur-2xl border border-purple-400/30 px-4.5 py-3 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.15)] flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/25 flex items-center justify-center text-purple-300">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[9px] text-purple-300 font-extrabold uppercase tracking-wide">Premier League</p>
              <p className="text-[11px] font-bold text-white">24 Teams Registered</p>
            </div>
          </motion.div>
        </div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.4, ease: EASE_PREMIUM as unknown as number[] }}
          className="relative max-w-xl w-full rounded-3xl p-5 md:p-7 text-left overflow-hidden shadow-2xl z-10"
          style={{
            background: "rgba(255, 255, 255, 0.78)",
            backdropFilter: "blur(50px) saturate(2.2) brightness(1.04)",
            WebkitBackdropFilter: "blur(50px) saturate(2.2) brightness(1.04)",
            border: "1px solid rgba(255, 255, 255, 0.85)",
            boxShadow: "0 25px 80px rgba(15, 23, 42, 0.22), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -1px 2px rgba(0, 0, 0, 0.04)",
          }}
        >
          {/* Specular highlight line */}
          <div 
            className="absolute inset-x-0 top-0 h-px pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 80%, transparent)"
            }}
          />

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <img src="/favicon.svg" alt="" className="w-5 h-5 drop-shadow-sm" />
                <span className="text-xs font-black text-brand-navy tracking-wide">hiyrED®</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-brand-navy tracking-tight leading-tight">
                {success ? "Welcome to hiyrED®!" : "Complete Your Profile"}
              </h2>
              <p className="text-[11px] text-brand-navy/60 mt-0.5 font-medium">
                {success ? "Your waitlist spot is confirmed." : "Unlock verified capability-based talent pathways."}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 text-brand-navy/60 hover:text-brand-navy transition-all rounded-full hover:bg-white/50 backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95 border border-transparent hover:border-white/60">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-5"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 backdrop-blur-xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-1.5">Application Received Successfully</h3>
              <p className="text-xs text-brand-navy/70 max-w-sm mx-auto mb-6 font-medium">
                Thank you for joining, <span className="font-bold text-brand-navy">{basicInfo.name}</span>. We've sent details of confirmation to <span className="font-semibold text-brand-navy">{basicInfo.email}</span>.
              </p>

              {/* Spot position */}
              <div 
                className="inline-block rounded-2xl px-6 py-4 shadow-xl mb-6 border border-white/40"
                style={{
                  background: "linear-gradient(135deg, rgba(22, 38, 65, 0.95), rgba(15, 23, 42, 0.95))",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 15px 35px rgba(22, 38, 65, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)"
                }}
              >
                <p className="text-[9px] font-bold uppercase tracking-wider text-brand-gold mb-0.5">Your Waitlist Spot</p>
                <p className="text-2xl font-black text-white">#{joinedCount}</p>
              </div>

              <div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-white/60 hover:bg-white/90 text-brand-navy font-bold text-xs rounded-full transition-all duration-300 cursor-pointer backdrop-blur-md border border-white/80 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Basic Info Read-Only Banner */}
              <div 
                className="rounded-xl p-3 flex flex-wrap gap-x-5 gap-y-1 text-xs border"
                style={{
                  background: "rgba(255, 255, 255, 0.55)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 4px 15px rgba(22, 38, 65, 0.03), inset 0 1px 1px rgba(255, 255, 255, 0.8)"
                }}
              >
                <div>
                  <span className="text-brand-navy/50 font-semibold text-[11px]">NAME:</span>{" "}
                  <span className="text-brand-navy font-bold">{basicInfo.name}</span>
                </div>
                <div>
                  <span className="text-brand-navy/50 font-semibold text-[11px]">EMAIL:</span>{" "}
                  <span className="text-brand-navy font-bold">{basicInfo.email}</span>
                </div>
                <div>
                  <span className="text-brand-navy/50 font-semibold text-[11px]">ROLE:</span>{" "}
                  <span className="text-brand-gold font-extrabold uppercase tracking-wider text-[11px]">{category}</span>
                </div>
              </div>

              {/* Category-Specific Form Body */}
              {category === "Community" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">College / University</label>
                      <input
                        type="text"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        placeholder="e.g. IIT Madras"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: errors.college ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                      {errors.college && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.college}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">Branch / Department</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="e.g. Computer Science"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: errors.branch ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                      {errors.branch && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.branch}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Year of Study</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setYearOfStudy(yr)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                            yearOfStudy === yr
                              ? "bg-brand-navy text-white border-white/30 shadow-md shadow-brand-navy/20 scale-102"
                              : "bg-white/40 border-white/70 text-brand-navy hover:bg-white/70 hover:shadow-sm"
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Domain Interest (Select all that apply)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Tech", "Core subjects", "Business", "Multi-disciplinary"].map((dom) => {
                        const isSel = domains.includes(dom);
                        return (
                          <button
                            key={dom}
                            type="button"
                            onClick={() => toggleDomain(dom, false)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                              isSel
                                ? "bg-brand-navy text-white border-white/30 shadow-md shadow-brand-navy/20 scale-102"
                                : "bg-white/40 border-white/70 text-brand-navy hover:bg-white/70 hover:shadow-sm"
                            }`}
                          >
                            {dom} {isSel && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">LinkedIn Profile URL (Optional)</label>
                    <input
                      type="url"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                      style={{
                        background: "rgba(255, 255, 255, 0.5)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.75)",
                        color: "#162641",
                        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                      }}
                      className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                    />
                  </div>
                </div>
              )}

              {category === "Recruiters" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">Company Name</label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Google India"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: errors.company ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                      {errors.company && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.company}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">Designation / Role</label>
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Talent Acquisition Lead"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: errors.role ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                      {errors.role && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.role}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Hiring Domains (Select all that apply)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Tech", "Core subjects", "Business", "Multi-disciplinary"].map((dom) => {
                        const isSel = recruiterDomains.includes(dom);
                        return (
                          <button
                            key={dom}
                            type="button"
                            onClick={() => toggleDomain(dom, true)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                              isSel
                                ? "bg-brand-navy text-white border-white/30 shadow-md shadow-brand-navy/20 scale-102"
                                : "bg-white/40 border-white/70 text-brand-navy hover:bg-white/70 hover:shadow-sm"
                            }`}
                          >
                            {dom} {isSel && "✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Approx. Annual Hiring Volume</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["1-10", "10-50", "50-200", "200+"].map((vol) => (
                        <button
                          key={vol}
                          type="button"
                          onClick={() => setVolume(vol)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                            volume === vol
                              ? "bg-brand-navy text-white border-white/30 shadow-md shadow-brand-navy/20 scale-102"
                              : "bg-white/40 border-white/70 text-brand-navy hover:bg-white/70 hover:shadow-sm"
                          }`}
                        >
                          {vol} hires/year
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {category === "Institutions" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">Institution Name</label>
                      <input
                        type="text"
                        value={instName}
                        onChange={(e) => setInstName(e.target.value)}
                        placeholder="e.g. VIT University"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: errors.instName ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                      {errors.instName && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.instName}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">Your Role / Designation</label>
                      <input
                        type="text"
                        value={instRole}
                        onChange={(e) => setInstRole(e.target.value)}
                        placeholder="e.g. Placement Director"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: errors.instRole ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                      {errors.instRole && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.instRole}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">City / State</label>
                      <input
                        type="text"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        placeholder="e.g. Vellore, Tamil Nadu"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: errors.cityState ? "1px solid rgba(239, 68, 68, 0.6)" : "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                      {errors.cityState && <p className="text-red-500 text-[10px] mt-0.5 font-semibold">{errors.cityState}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-0.5">Branches Offered (e.g. CSE, ECE, Mech)</label>
                      <input
                        type="text"
                        value={branchesOffered}
                        onChange={(e) => setBranchesOffered(e.target.value)}
                        placeholder="e.g. CSE, ECE, EEE, Mech, Civil"
                        style={{
                          background: "rgba(255, 255, 255, 0.5)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.75)",
                          color: "#162641",
                          boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.03)"
                        }}
                        className="w-full px-3.5 py-2 text-xs rounded-lg focus:bg-white/80 transition-all focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/60 placeholder-brand-navy/40 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-brand-navy/70 mb-1">Approx. Student Strength (Total in current cohort)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {["<500", "500-2000", "2000-5000", ">5000"].map((str) => (
                        <button
                          key={str}
                          type="button"
                          onClick={() => setStrength(str)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-200 cursor-pointer backdrop-blur-md ${
                            strength === str
                              ? "bg-brand-navy text-white border-white/30 shadow-md shadow-brand-navy/20 scale-102"
                              : "bg-white/40 border-white/70 text-brand-navy hover:bg-white/70 hover:shadow-sm"
                          }`}
                        >
                          {str} students
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom bar & Submit */}
              <div className="pt-3.5 border-t border-white/60 flex flex-col md:flex-row justify-between items-center gap-3">
                <p className="text-[11px] text-brand-navy/70 font-semibold">
                  🔥 <span className="font-extrabold text-brand-navy">{joinedCount}</span> ambition-driven leaders joined the waitlist
                </p>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03, boxShadow: "0 15px 35px rgba(22, 38, 65, 0.2)" }}
                  whileTap={{ scale: 0.97 }}
                  className="px-7 py-3 bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-brand-navy/15 border border-white/20 flex items-center justify-center gap-2 w-full md:w-auto cursor-pointer backdrop-blur-md"
                >
                  <span>Submit Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [waitlistPopup, setWaitlistPopup] = useState({ isOpen: false, initialCategory: "Community", anchorEl: null as HTMLElement | null });
  const [waitlistFullForm, setWaitlistFullForm] = useState({
    isOpen: false,
    category: "Community",
    basicInfo: { name: "", email: "", phone: "" }
  });

  useEffect(() => {
    (window as any).triggerWaitlist = (category: string = "Community", anchorEl: HTMLElement | null = null) => {
      setWaitlistPopup({ isOpen: true, initialCategory: category, anchorEl });
    };
    return () => {
      delete (window as any).triggerWaitlist;
    };
  }, []);

  const handleProceedToFullForm = (data: { category: string; name: string; email: string; phone: string }) => {
    setWaitlistPopup({ isOpen: false, initialCategory: data.category, anchorEl: null });
    setWaitlistFullForm({
      isOpen: true,
      category: data.category,
      basicInfo: { name: data.name, email: data.email, phone: data.phone }
    });
  };

  return (
    <div className="min-h-screen font-sans selection:bg-brand-gold/30">
      <Navbar />
      <main>
        <Hero />
        <Metrics />
        <HiyredEdge />
        <TheJourney />
        <EcosystemHub />
        <Testimonial />
        <TalentShowcasePreview />
        <InsightsNews />
        <FAQs />
        <FinalCTA />
      </main>
      <Footer />

      {/* Waitlist Dialog Modals */}
      <WaitlistPopup
        isOpen={waitlistPopup.isOpen}
        onClose={() => setWaitlistPopup({ ...waitlistPopup, isOpen: false })}
        onProceed={handleProceedToFullForm}
        initialCategory={waitlistPopup.initialCategory}
        anchorEl={waitlistPopup.anchorEl}
      />
      <WaitlistFullForm
        isOpen={waitlistFullForm.isOpen}
        category={waitlistFullForm.category}
        basicInfo={waitlistFullForm.basicInfo}
        onClose={() => setWaitlistFullForm({ ...waitlistFullForm, isOpen: false })}
      />
    </div>
  );
}

