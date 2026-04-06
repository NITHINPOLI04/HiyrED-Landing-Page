import { motion, useInView, useReducedMotion } from "motion/react";
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
  X
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
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
            <div className="w-10 h-10 bg-brand-navy rounded-xl flex items-center justify-center">
              <span className="text-brand-gold font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-brand-navy tracking-tight">hiyrED</span>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-8">
            {["For Colleges", "For Students", "For Recruiters", "How It Works", "Contact"].map((item, i) => (
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
              Login
            </motion.button>
            <motion.button 
              className="px-6 py-2.5 bg-brand-navy text-white text-sm font-semibold rounded-full hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/20"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 40px rgba(22,38,65,0.3)" }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.55, duration: 0.4, ease: EASE_PREMIUM as unknown as number[] }}
            >
              Start Hiring
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
          {["For Colleges", "For Students", "For Recruiters", "How It Works"].map((item, i) => (
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
            Start Hiring
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
              Fastest way to <span className="text-brand-gold">streamline</span> campus hiring
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl"
              variants={fadeLeft}
              transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[], delay: 0.1 }}
            >
              hiyrED brings students, recruiters, and placement teams onto one intelligent platform — eliminating chaos and enabling faster, smarter hiring.
            </motion.p>
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={fadeUp}
              transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[], delay: 0.2 }}
            >
              <motion.button 
                className="px-8 py-4 bg-brand-navy text-white font-bold rounded-full hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/20 flex items-center gap-2 group"
                whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(22,38,65,0.3)" }}
                whileTap={{ scale: 0.97 }}
              >
                Start Hiring
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                className="px-8 py-4 bg-white text-brand-navy font-bold rounded-full border-2 border-brand-navy/10 hover:border-brand-navy/20 transition-all"
                whileHover={{ scale: 1.04, borderColor: "rgba(22,38,65,0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Platform
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
                className="glass-card p-6 rounded-2xl"
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
                        animate={{ width: "75%" }}
                        transition={{ delay: 1, duration: 1.2, ease: EASE_SMOOTH as unknown as number[] }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">Eligibility: 98% Match</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                className="glass-card p-6 rounded-2xl mt-8"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-brand-navy/10 flex items-center justify-center">
                      <Briefcase className="text-brand-navy w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">New Job Post</p>
                      <p className="font-bold text-brand-navy">Software Engineer</p>
                    </div>
                  </div>
                  <motion.span 
                    className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full inline-block"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2, duration: 0.4, type: "spring", stiffness: 300 }}
                  >
                    Active Drive
                  </motion.span>
                </motion.div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                className="glass-card p-6 rounded-2xl col-span-2 mx-auto w-3/4"
              >
                <motion.div
                  animate={{ x: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Bell className="text-blue-600 w-4 h-4" />
                      </div>
                      <p className="text-sm font-medium text-brand-navy">Interview Scheduled</p>
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
      className="p-8 rounded-3xl bg-[#FDFCF9] border border-gray-100 text-center transition-shadow duration-300"
    >
      <h3 className="text-4xl font-bold text-[#c7ae6a] mb-2">{count}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{label}</p>
    </motion.div>
  );
};

const Metrics = () => {
  const metrics = [
    { value: "< 2 mins", label: "Avg time from job post to student notification" },
    { value: "50%+", label: "Reduction in admin workload" },
    { value: "90%", label: "Less manual coordination (emails/WhatsApp)" },
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
            Trusted by 100+ Companies & Colleges
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

// ─── Why Choose ────────────────────────────────────────────────────────────────

const WhyChoose = () => {
  const points = [
    { title: "Automated Eligibility Engine", desc: "No manual filtering — rules enforce themselves" },
    { title: "Human-Centered Matching", desc: "Students see only what they qualify for" },
    { title: "Smart Notifications", desc: "Never miss deadlines, interviews, or updates" },
    { title: "Speed Without Chaos", desc: "Everything happens in one platform — no emails, no confusion" },
  ];

  return (
    <section className="py-24 bg-[#FDFCF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Points */}
          <AnimatedSection stagger={staggerContainerSlow}>
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-brand-navy mb-12"
              variants={fadeLeft}
              transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
            >
              Why choose hiyrED?
            </motion.h2>
            <div className="space-y-8">
              {points.map((p, i) => (
                <motion.div 
                  key={i} 
                  className="flex gap-4 group cursor-default"
                  variants={fadeLeft}
                  transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
                  whileHover={{ x: 6 }}
                >
                  <motion.div 
                    className="mt-1"
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <CheckCircle2 className="text-brand-gold w-6 h-6" />
                  </motion.div>
                  <div>
                    <h4 className="text-xl font-bold text-brand-navy mb-1 group-hover:text-brand-gold transition-colors duration-300">{p.title}</h4>
                    <p className="text-gray-600">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>

          {/* Right: Brand Card */}
          <AnimatedSection variants={scaleIn} className="relative flex justify-center lg:justify-end">
            <motion.div 
              className="w-full max-w-[480px] h-[360px] rounded-[32px] bg-gradient-to-br from-[#162641] to-[#1e3557] relative overflow-hidden flex flex-col items-center justify-center p-12 transition-all"
              whileHover={{ scale: 1.02, boxShadow: "0 30px 80px rgba(22,38,65,0.25)" }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH as unknown as number[] }}
            >
              {/* Abstract Decorative Circles with subtle rotation */}
              <motion.div 
                className="absolute top-[-10%] left-[-10%] w-[200px] h-[200px] rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-[20%] right-[-15%] w-[250px] h-[250px] rounded-full border border-white/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute bottom-[-20%] right-[10%] w-[300px] h-[300px] rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute bottom-[10%] left-[20%] w-[150px] h-[150px] rounded-full border border-white/5"
                animate={{ rotate: -360 }}
                transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Center Content */}
              <div className="relative z-10 text-center">
                <motion.h3 
                  className="text-6xl lg:text-7xl font-bold tracking-tight mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
                  viewport={{ once: true }}
                >
                  <span className="text-white">hiyr</span>
                  <span className="text-[#bd9d51]">ED</span>
                </motion.h3>
                <motion.p 
                  className="text-[#cbd5e1] text-lg font-medium tracking-wide"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  Intelligent Campus Hiring
                </motion.p>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

// ─── How It Works ──────────────────────────────────────────────────────────────

const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Define Your Hiring Rules", desc: "Admins set eligibility, policies, and job requirements" },
    { number: "02", title: "We Auto-Shortlist Students", desc: "Only eligible candidates are filtered instantly" },
    { number: "03", title: "Track, Interview & Hire", desc: "Manage rounds, feedback, and offers in one place" },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-20" stagger={staggerContainer}>
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-brand-navy mb-6"
            variants={fadeUp}
            transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
          >
            How hiyrED Works
          </motion.h2>
          <motion.p 
            className="text-gray-500 max-w-2xl mx-auto"
            variants={fadeUp}
            transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
          >
            From curated intros to faster hiring — here's how we match standout talent with forward-thinking companies.
          </motion.p>
        </AnimatedSection>

        <div className="relative" ref={sectionRef}>
          {/* ── Dashed connector arcs BEHIND cards using CSS borders ── */}
          {/* Entry trail */}
          <motion.div 
            className="hidden md:block absolute pointer-events-none"
            style={{ left: "-10px", top: "45%", width: "60px", height: "40px", borderBottom: "2px dashed #c5c0b6", borderRadius: "0 0 50% 0", zIndex: 0 }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 0.5, scaleX: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE_PREMIUM as unknown as number[] }}
          />
          {/* Arc 1→2 */}
          <motion.div 
            className="hidden md:block absolute pointer-events-none"
            style={{ left: "30%", top: "55%", width: "12%", height: "60px", borderBottom: "2px dashed #c5c0b6", borderLeft: "2px dashed #c5c0b6", borderRight: "2px dashed #c5c0b6", borderRadius: "0 0 50% 50%", zIndex: 0, transformOrigin: "top" }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={isInView ? { opacity: 0.5, scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
          />
          {/* Arc 2→3 */}
          <motion.div 
            className="hidden md:block absolute pointer-events-none"
            style={{ left: "63.5%", top: "55%", width: "12%", height: "60px", borderBottom: "2px dashed #c5c0b6", borderLeft: "2px dashed #c5c0b6", borderRight: "2px dashed #c5c0b6", borderRadius: "0 0 50% 50%", zIndex: 0, transformOrigin: "top" }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={isInView ? { opacity: 0.5, scaleY: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9, ease: EASE_PREMIUM as unknown as number[] }}
          />

          {/* ── Step Cards (above connectors) ── */}
          <div style={{ position: "relative", zIndex: 1 }}>
          <AnimatedSection stagger={staggerContainerSlow} className="grid md:grid-cols-3 gap-8 relative">
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
                className="p-10 rounded-[2.5rem] bg-[#FDFCF9] border border-gray-100 relative group cursor-default"
              >
                <motion.span 
                  className="text-6xl font-black text-brand-navy/5 absolute top-8 right-8 group-hover:text-brand-gold/10 transition-colors duration-500"
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
                <h4 className="text-2xl font-bold text-brand-navy mb-4">{s.title}</h4>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Features ──────────────────────────────────────────────────────────────────

const Features = () => {
  const features = [
    { icon: <ShieldCheck />, title: "Eligibility Engine", desc: "Automated rule enforcement for every job drive." },
    { icon: <BarChart3 />, title: "DriveIntel Analytics", desc: "Real-time data on placement performance." },
    { icon: <Code2 />, title: "CodeLAB Practice", desc: "Integrated coding assessments and practice." },
    { icon: <Bell />, title: "Smart Notifications", desc: "Instant updates via WhatsApp, Email, and Push." },
    { icon: <FileText />, title: "Resume Vault", desc: "Centralized, verified student resume database." },
    { icon: <Users />, title: "Application Tracking", desc: "End-to-end candidate lifecycle management." },
  ];

  return (
    <section className="py-24 bg-[#FDFCF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12" stagger={staggerContainer}>
          <motion.p 
            className="text-sm font-medium text-[#bd9d51] uppercase tracking-[0.2em] mb-2"
            variants={fadeUp}
          >
            CORE MODULES
          </motion.p>
          <motion.h2 
            className="text-4xl lg:text-5xl font-bold text-[#162641]"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Everything you need, built in
          </motion.h2>
        </AnimatedSection>
        
        <AnimatedSection stagger={staggerContainerFast} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              variants={fadeUp}
              transition={{ duration: 0.5, ease: EASE_PREMIUM as unknown as number[] }}
              whileHover={{ 
                y: -8, 
                boxShadow: "0 20px 50px rgba(22,38,65,0.08)",
                transition: { duration: 0.3, ease: EASE_SMOOTH as unknown as number[] }
              }}
              className="p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-brand-navy/5 transition-all group cursor-default"
            >
              <motion.div 
                className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold mb-6"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {f.icon}
              </motion.div>
              <h4 className="text-xl font-bold text-brand-navy mb-3 group-hover:text-brand-gold transition-colors duration-300">{f.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
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
            className="w-full p-[2px] bg-[#c4b5fd]/40 rounded-[32px]"
            whileHover={{ boxShadow: "0 20px 60px rgba(196,181,253,0.2)" }}
            transition={{ duration: 0.4 }}
          >
            {/* Inner Card */}
            <div className="w-full lg:h-[340px] rounded-[28px] bg-[#fafafa] p-8 lg:py-[40px] lg:px-[48px] flex flex-col lg:flex-row items-center lg:gap-[48px] transition-all">
              {/* Left Side: Image */}
              <motion.div 
                className="w-full lg:w-[280px] h-[220px] lg:h-full rounded-[20px] overflow-hidden shrink-0"
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
                    "We've hired faster and smarter since switching to hiyrED — it&apos;s like having a recruiter built into our hiring process"
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

// ─── Job Board Preview ─────────────────────────────────────────────────────────

const JobBoardPreview = () => {
  const jobs = [
    { title: "Product Designer", type: "Full-time", location: "Remote" },
    { title: "Frontend Engineer", type: "Internship", location: "Bangalore" },
    { title: "Data Analyst", type: "Full-time", location: "Hyderabad" },
    { title: "Backend Developer", type: "Full-time", location: "Pune" },
  ];

  return (
    <section className="py-24 bg-[#FDFCF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text */}
          <AnimatedSection stagger={staggerContainer}>
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-brand-navy mb-6"
              variants={fadeLeft}
              transition={{ duration: 0.6 }}
            >
              Smart Job Board
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 mb-10 leading-relaxed"
              variants={fadeLeft}
              transition={{ duration: 0.5 }}
            >
              Students explore only relevant opportunities — fully filtered and ready to apply. No more scrolling through irrelevant posts.
            </motion.p>
            <motion.button 
              className="px-8 py-4 bg-brand-navy text-white font-bold rounded-full hover:bg-brand-navy/90 transition-all shadow-xl shadow-brand-navy/20"
              variants={fadeUp}
              whileHover={{ scale: 1.04, boxShadow: "0 20px 60px rgba(22,38,65,0.3)" }}
              whileTap={{ scale: 0.97 }}
            >
              Browse Opportunities
            </motion.button>
          </AnimatedSection>

          {/* Right: Job Cards */}
          <AnimatedSection stagger={staggerContainerFast} className="grid gap-4">
            {jobs.map((j, i) => (
              <motion.div
                key={i}
                variants={fadeRight}
                transition={{ duration: 0.4, ease: EASE_PREMIUM as unknown as number[] }}
                whileHover={{ 
                  x: 10, 
                  boxShadow: "0 10px 40px rgba(22,38,65,0.08)",
                  transition: { duration: 0.25, ease: EASE_SMOOTH as unknown as number[] }
                }}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-gold/10 transition-colors duration-300"
                  >
                    <Briefcase className="text-gray-400 group-hover:text-brand-gold transition-colors duration-300" />
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-brand-navy">{j.title}</h4>
                    <p className="text-xs text-gray-500">{j.type} • {j.location}</p>
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
            className="relative p-16 lg:p-24 rounded-[4rem] text-center overflow-hidden gold-gradient"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.4, ease: EASE_SMOOTH as unknown as number[] }}
          >
            <AnimatedSection stagger={staggerContainer} className="relative z-10">
              <motion.h2 
                className="text-4xl lg:text-6xl font-bold text-brand-navy mb-6"
                variants={fadeUp}
                transition={{ duration: 0.6, ease: EASE_PREMIUM as unknown as number[] }}
              >
                Ready to simplify campus hiring?
              </motion.h2>
              <motion.p 
                className="text-xl text-brand-navy/70 mb-12 max-w-2xl mx-auto"
                variants={fadeUp}
                transition={{ duration: 0.5 }}
              >
                We automate, match, and manage — you just hire. Join 500+ institutions already using hiyrED.
              </motion.p>
              <motion.button 
                className="px-10 py-5 bg-brand-navy text-white font-bold rounded-full hover:scale-105 transition-all shadow-2xl shadow-brand-navy/30"
                variants={fadeUp}
                whileHover={{ scale: 1.06, boxShadow: "0 20px 60px rgba(22,38,65,0.4)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started Now
              </motion.button>
            </AnimatedSection>
            
            {/* Decorative circles */}
            <motion.div 
              className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-96 h-96 bg-brand-navy/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"
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
              <div className="w-10 h-10 bg-brand-gold rounded-xl flex items-center justify-center">
                <span className="text-brand-navy font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">hiyrED</span>
            </div>
            <p className="text-gray-400 max-w-xs mb-8">
              Transforming campus hiring from manual chaos into an intelligent, automated system.
            </p>
            <div className="flex gap-4">
              {/* Social Icons */}
              {[1,2,3,4].map(i => (
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
            <p className="text-gray-500 text-xs">© 2026 hiyrED Inc. All Rights Reserved.</p>
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
        <WhyChoose />
        <HowItWorks />
        <Features />
        <Testimonial />
        <JobBoardPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
