import { motion, useInView, useReducedMotion } from "motion/react";
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
import { useState, useRef, useEffect, type ReactNode, type RefObject } from "react";

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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[], delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm"
        : "bg-white/80 backdrop-blur-md border-b border-gray-100"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <img src="/logo_Txt.svg" alt="hiyrED®" className="h-22" />
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {["Community", "For Recruiters", "For Institutions", "For Educators", "Contact"].map((item, i) => (
              <motion.a
                key={item}
                href="#"
                className="text-sm font-medium text-gray-600 hover:text-brand-navy transition-colors relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: EASE_SMOOTH as unknown as number[] }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-gold group-hover:w-full transition-all duration-300 ease-out" />
              </motion.a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              className="px-6 py-2 text-sm font-semibold text-brand-navy hover:text-brand-gold transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Sign In
            </motion.button>
            <motion.button
              className="px-6 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-full hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/20"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(22,38,65,0.3)" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.4, ease: EASE_PREMIUM as unknown as number[] }}
            >
              Join hiyrED®
            </motion.button>
          </div>

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
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: EASE_SMOOTH as unknown as number[] }}
          className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 overflow-hidden"
        >
          {["Community", "For Recruiters", "For Institutions", "For Educators"].map((item, i) => (
            <motion.a
              key={item}
              href="#"
              className="block text-base font-medium text-gray-600"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
            >
              {item}
            </motion.a>
          ))}
          <motion.button
            className="w-full px-6 py-3 bg-brand-navy text-white font-semibold rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.3 }}
          >
            Join hiyrED®
          </motion.button>
        </motion.div>
      )}
    </motion.nav>
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
                {/* Floating Highlighted Free Tag */}
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
                </motion.span>
                <motion.button
                  className="px-8 py-4 bg-brand-navy text-white font-bold rounded-full hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/20 flex items-center gap-2 group"
                  whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(22,38,65,0.3)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Join the Community
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
              <motion.button
                className="px-8 py-4 bg-white text-brand-navy font-bold rounded-full border-2 border-brand-navy/10 hover:border-brand-navy/20 transition-all"
                whileHover={{ scale: 1.04, borderColor: "rgba(22,38,65,0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                Hire Verified Talent
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE_PREMIUM as unknown as number[] }}
            className="relative"
          >
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                className="glass-card p-6 rounded-[2.5rem]"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
                      <Users className="text-brand-gold w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Student Profile</p>
                      <p className="font-bold text-brand-navy">Alex Rivera</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand-gold rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ delay: 1, duration: 1.2, ease: EASE_SMOOTH as unknown as number[] }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">Capability Path: Frontend Eng.</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                className="glass-card p-6 rounded-[2.5rem] mt-8"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center">
                      <Code2 className="text-brand-navy w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Forge Assessment</p>
                      <p className="font-bold text-brand-navy">DSA Mastery</p>
                    </div>
                  </div>
                  <motion.span
                    className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full inline-block"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.4, type: "spring", stiffness: 300 }}
                  >
                    Skill Verified
                  </motion.span>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                className="glass-card p-6 rounded-[2.5rem] col-span-2 mx-auto w-3/4"
              >
                <motion.div
                  animate={{ x: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <Code2 className="text-purple-600 w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-brand-navy">Fullstack Project Deployed</p>
                    </div>
                    <motion.p
                      className="text-xs text-gray-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                    >
                      Just now
                    </motion.p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Background decorative elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-gold/5 rounded-full blur-3xl -z-10"></div>
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
    { number: "01", title: "Discover", desc: "Map your raw potential and generate your dynamic Capability Transformation Cortex Path (CTC Path)." },
    { number: "02", title: "Build", desc: "Follow your CTC Path via Forge. Master coding, core subjects, and tackle real Industry Projects." },
    { number: "03", title: "Prove", desc: "Earn immutable Skill Badges and compete in the pan-India hiyrED® Premier League." },
    { number: "04", title: "Showcase", desc: "Enter the Verified Talent Pool where recruiters actively scout your proven capabilities." },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="relative">
          <div style={{ position: "relative", zIndex: 1 }}>
            <AnimatedSection stagger={staggerContainerSlow} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 60px rgba(22,38,65,0.08)",
                    transition: { duration: 0.3, ease: EASE_SMOOTH as unknown as number[] }
                  }}
                  className="p-8 lg:p-10 rounded-[3rem] bg-[#fbf0cf] border border-gray-100 relative group cursor-default"
                >
                  <motion.span
                    className="text-5xl font-black text-brand-navy/5 absolute top-8 right-8 group-hover:text-brand-gold/10 transition-colors duration-500"
                  >
                    {s.number}
                  </motion.span>
                  <motion.div
                    className="w-12 h-12 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold mb-8"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    {i + 1}
                  </motion.div>
                  <h4 className="text-xl font-bold text-brand-navy mb-4">{s.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">{s.desc}</p>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Where Hiyred Stands Apart (USP / Differentiators) ──────────────────────────

const HiyredEdge = () => {
  const [selectedEngine, setSelectedEngine] = useState<number | null>(null);
  const [currentAngle, setCurrentAngle] = useState(0);

  useEffect(() => {
    if (selectedEngine !== null) return;

    let animationFrameId: number;
    const animate = () => {
      setCurrentAngle((prev) => (prev + 0.12) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [selectedEngine]);

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
    <section
      className="relative py-32 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0e1a2e 0%, #162641 60%, #1a2d4a 100%)" }}
    >
      {/* Inline styles for Keyframes slow-spin & counter-spin */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
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
        .slow-spin {
          animation: spin 50s linear infinite;
        }
        .counter-spin {
          animation: counter-spin 50s linear infinite;
        }
        .spin-paused {
          animation-play-state: paused !important;
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
      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/0 to-transparent pointer-events-none" />

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
              {/* Giant BUILT */}
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
                className="flex items-center gap-x-3 text-xs md:text-sm font-semibold whitespace-nowrap overflow-visible"
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
          <div className="lg:col-span-6 flex justify-center lg:justify-end items-center relative overflow-visible h-[540px] w-full">
            {/* Desktop: Rotational Wheel */}
            <div className="hidden lg:flex justify-center items-center relative w-[520px] h-[520px] lg:translate-x-16 overflow-visible">

              {/* Electrifying Blue Glowing Wheel Outline */}
              <div className="absolute w-[440px] h-[440px] rounded-full pointer-events-none z-0">
                {/* 1. Clockwise spinning glow */}
                <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
                  <svg className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="electricGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f0ff" stopOpacity="1" />
                        <stop offset="30%" stopColor="#0072ff" stopOpacity="0.85" />
                        <stop offset="70%" stopColor="#7c3aed" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#00f0ff" stopOpacity="1" />
                      </linearGradient>
                      <filter id="neonBlur" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Outer Blurry Glow */}
                    <circle
                      cx="220"
                      cy="220"
                      r="218"
                      fill="none"
                      stroke="url(#electricGlow)"
                      strokeWidth="5"
                      filter="url(#neonBlur)"
                      className="opacity-70"
                    />
                    {/* Crisp Inner Neon Line */}
                    <circle
                      cx="220"
                      cy="220"
                      r="218"
                      fill="none"
                      stroke="url(#electricGlow)"
                      strokeWidth="1.5"
                      className="opacity-95"
                    />
                  </svg>
                </div>

                {/* 2. Counter-clockwise spinning dashed tech ring */}
                <div className="absolute inset-0 animate-[counter-spin_20s_linear_infinite]">
                  <svg className="w-full h-full overflow-visible">
                    <circle
                      cx="220"
                      cy="220"
                      r="210"
                      fill="none"
                      stroke="#00f0ff"
                      strokeWidth="1"
                      strokeDasharray="4 8"
                      className="opacity-40"
                    />
                  </svg>
                </div>
              </div>

              {/* Central Hub Glow Backdrop (Star Glow / Halo) */}
              <div className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-[#00f0ff]/30 to-[#0072ff]/30 blur-xl animate-[pulse_2.5s_ease-in-out_infinite] z-0 pointer-events-none" />

              {/* Central Hub anchor */}
              <div className="absolute w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg z-10">
                <div className="w-18 h-18 rounded-full bg-white flex items-center justify-center shadow-md animate-[glowWorm_3s_ease-in-out_infinite]">
                  <img src="/Logo-Stick-Figure.svg" alt="hiyrED® Hub" className="w-11 h-11 object-contain" />
                </div>
              </div>

              {/* Dashed Line Arrow SVG Overlay */}
              {selectedEngine !== null && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                  <motion.path
                    d={(() => {
                      const baseAngle = (selectedEngine * 360) / 5;
                      const rotatedAngle = (baseAngle + currentAngle) % 360;
                      const radius = 175;
                      const x = Math.cos((rotatedAngle * Math.PI) / 180) * radius + 260;
                      const y = Math.sin((rotatedAngle * Math.PI) / 180) * radius + 260;

                      // Node left edge (always relative to the visual layout)
                      const startX = x - 105;
                      const startY = y;

                      // Popup right anchor at X: 80, Y: 260
                      const endX = 80;
                      const endY = 260;

                      const cp1x = startX - 80;
                      const cp1y = startY;
                      const cp2x = endX + 80;
                      const cp2y = endY;

                      return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
                    })()}
                    stroke={engineDetails[selectedEngine].accent}
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.8 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  {/* Pulsing Arrowhead Dot */}
                  <motion.circle
                    cx="80"
                    cy="260"
                    r="4"
                    fill={engineDetails[selectedEngine].accent}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.8, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </svg>
              )}

              {/* Detailed Pop-up Overlay Card */}
              {selectedEngine !== null && (
                <motion.div
                  initial={{ opacity: 0, x: -40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -40, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="absolute left-[-220px] top-[75px] w-[290px] h-[370px] bg-white rounded-[2.5rem] p-6 shadow-2xl z-30 border-l-[6px] text-left flex flex-col justify-between"
                  style={{
                    borderColor: engineDetails[selectedEngine].accent,
                    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.8)"
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedEngine(null)}
                    className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-brand-navy transition-colors cursor-pointer z-40"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="overflow-visible">
                    {/* Header: Icon + Name */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                        style={{ background: `${engineDetails[selectedEngine].accent}15`, color: engineDetails[selectedEngine].accent }}
                      >
                        {engineDetails[selectedEngine].icon}
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 block" style={{ color: engineDetails[selectedEngine].accent }}>
                          {engineDetails[selectedEngine].label}
                        </span>
                        <h3 className="text-base font-black text-brand-navy leading-none">
                          {engineDetails[selectedEngine].name}
                        </h3>
                      </div>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[10px] font-extrabold text-[#C7AE6A] uppercase tracking-wider mb-2.5 leading-none">
                      {engineDetails[selectedEngine].title}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">
                      {engineDetails[selectedEngine].desc}
                    </p>

                    {/* Bullets */}
                    <ul className="space-y-1.5">
                      {engineDetails[selectedEngine].bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[10px] text-gray-600 leading-tight">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: engineDetails[selectedEngine].accent }} />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer whisper */}
                  <span className="text-[9px] font-bold text-gray-400 italic mt-2 leading-none border-t border-gray-50 pt-2 block w-full">
                    {engineDetails[selectedEngine].tagline}
                  </span>
                </motion.div>
              )}

              {/* Rotational Container */}
              <div
                className="relative w-[440px] h-[440px] flex items-center justify-center rounded-full bg-white/[0.01]"
                style={{ transform: `rotate(${currentAngle}deg)`, transformOrigin: 'center' }}
              >
                {engineDetails.map((eng, i) => {
                  const angle = (i * 360) / 5;
                  const radius = 175; // radius in px
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;

                  return (
                    <div
                      key={i}
                      className="absolute"
                      style={{
                        left: `calc(50% + ${x}px - 105px)`,
                        top: `calc(50% + ${y}px - 55px)`,
                        width: "210px",
                        height: "110px",
                        transform: `rotate(${-currentAngle}deg)`,
                        transformOrigin: 'center'
                      }}
                    >
                      {/* Counter-rotating card */}
                      <div
                        onClick={() => setSelectedEngine(selectedEngine === i ? null : i)}
                        className={`w-full h-full bg-white rounded-2xl p-4 shadow-xl border-l-[4px] flex flex-col justify-between text-left select-none group cursor-pointer ${selectedEngine === i ? 'ring-2 ring-offset-2 ring-white/50 scale-[1.03]' : ''}`}
                        style={{
                          borderColor: eng.accent,
                          boxShadow: selectedEngine === i
                            ? `0 15px 40px ${eng.accent}30`
                            : `0 10px 30px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.8)`,
                        }}
                      >
                        {/* Top row: Icon + Label */}
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                            style={{ background: `${eng.accent}15`, color: eng.accent }}
                          >
                            {eng.icon}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest leading-none mb-1" style={{ color: eng.accent }}>
                              {eng.label}
                            </span>
                            <h4 className="text-xs font-extrabold text-brand-navy leading-none">
                              {eng.name}
                            </h4>
                          </div>
                        </div>
                        {/* Description */}
                        <p className="text-[9px] leading-normal text-gray-500 font-medium line-clamp-2">
                          {eng.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
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

                  {/* Bullets on mobile */}
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

        {/* What sets us apart */}
        <div className="mt-32 pt-24 border-t border-white/10">
          {/* Section Header */}
          <AnimatedSection className="text-center mb-20" stagger={staggerContainer}>
            <motion.h2
              className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              variants={fadeUp}
              transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
            >
              What sets{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #C7AE6A 0%, #e3d6b4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                us
              </span>{" "}
              apart
            </motion.h2>
            <motion.p
              className="text-sm sm:text-base font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: "#C7AE6A" }}
              variants={fadeUp}
            >
              Structure · Visibility · Alignment
            </motion.p>
            <motion.p
              className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed"
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
              {differentiators.map((d, i) => (
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
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Hover glow border */}
                  <motion.div
                    className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 0 1.5px ${d.accent}55, 0 0 40px ${d.accent}18`,
                    }}
                  />

                  {/* Corner index */}
                  <span
                    className="absolute top-8 right-8 text-7xl font-black leading-none select-none pointer-events-none"
                    style={{ color: `${d.accent}10`, fontVariantNumeric: "tabular-nums" }}
                  >
                    {d.index}
                  </span>

                  {/* Engine badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <motion.span
                      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em]"
                      style={{
                        background: `${d.accent}18`,
                        color: d.accent,
                        border: `1px solid ${d.accent}35`,
                      }}
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    >
                      {d.engine}
                    </motion.span>
                    {/* Divider line */}
                    <motion.div
                      className="h-px flex-1 max-w-[48px]"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                      viewport={{ once: true }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className="text-2xl font-bold text-white mb-3 group-hover:transition-colors duration-300"
                    style={{ lineHeight: 1.25 }}
                  >
                    {d.title}
                  </h3>

                  {/* Headline */}
                  <p
                    className="text-sm font-semibold mb-4 leading-snug"
                    style={{ color: d.accent }}
                  >
                    {d.headline}
                  </p>

                  {/* Description */}
                  <p className="text-white/55 text-sm leading-relaxed">{d.desc}</p>

                  {/* Bottom accent bar */}
                  <motion.div
                    className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `linear-gradient(90deg, transparent, ${d.accent}, transparent)` }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Right side: Shifts comparisons (yellow background box container) */}
            <div className="lg:col-span-6 bg-[#fbf0cf] p-8 lg:p-10 rounded-[2.5rem] flex flex-col gap-4 shadow-xl text-left border border-white/20">
              {/* Headers */}
              <div className="flex items-center gap-6 px-4 pb-1">
                <p className="flex-1 text-xs font-bold text-gray-500 uppercase tracking-wider">what the stakeholders say</p>
                <div className="hidden sm:block w-5" />
                <p className="flex-1 text-xs font-bold text-brand-gold tracking-wider uppercase">WHAT hiyrED® DELIVERS</p>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {shifts.map((s, i) => (
                  <motion.div
                    key={i}
                    className="bg-white px-6 py-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 group"
                    whileHover={{ x: -8, boxShadow: "0 20px 40px rgba(22,38,65,0.05)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex-1">
                      <p className="text-gray-400 font-medium text-sm leading-snug">{s.old}</p>
                    </div>
                    <div className="hidden sm:block text-gray-300">
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
      </div>
    </section>
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
              The Verified Talent Pool
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
                  {/* Floating Highlighted Free Tag */}
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
                  </motion.span>
                  <motion.button
                    className="px-10 py-5 bg-brand-navy text-white font-black rounded-full hover:scale-105 transition-all shadow-2xl shadow-brand-navy/20 border border-brand-navy/5"
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
  return (
    <footer className="bg-brand-dark pt-20 pb-10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection stagger={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <motion.div className="col-span-2 lg:col-span-2" variants={fadeUp}>
            <div className="flex items-center gap-2 mb-6">
              <img src="/Logo-Stick-Figure-Hiyred_Txt.svg" alt="hiyrED®" className="h-22" />
            </div>
            <p className="text-gray-400 max-w-xs mb-8">
              The definitive ecosystem for ambitious students to build verified capabilities and showcase their proof-of-work.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              {[1, 2, 3, 4].map(i => (
                <motion.div
                  key={i}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-brand-navy transition-all cursor-pointer"
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-4 h-4 rounded-sm border border-current"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-bold mb-6">Learn More</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {["About Us", "How It Works", "Client Results", "Press & Mentions"].map(item => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className="hover:text-brand-gold transition-colors inline-block"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-bold mb-6">For Partners</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {["For Colleges", "For Students", "For Recruiters", "Pricing Plans"].map(item => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className="hover:text-brand-gold transition-colors inline-block"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="font-bold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              {["Contact Us", "FAQs", "Privacy Policy", "Terms of Service"].map(item => (
                <li key={item}>
                  <motion.a
                    href="#"
                    className="hover:text-brand-gold transition-colors inline-block"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatedSection>

        <AnimatedSection>
          <motion.div
            className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
            variants={fadeUp}
          >
            <p className="text-gray-500 text-xs">© 2026 hiyrED® Inc. All Rights Reserved.</p>
            <div className="flex gap-8 text-gray-500 text-xs">
              {["Privacy", "Terms", "Cookies"].map(item => (
                <motion.a
                  key={item}
                  href="#"
                  className="hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </AnimatedSection>
      </div>
    </footer>
  );
};

// ─── App ───────────────────────────────────────────────────────────────────────

export default function App() {
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
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
