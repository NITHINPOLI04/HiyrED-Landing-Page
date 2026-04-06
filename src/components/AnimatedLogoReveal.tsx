import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect } from "react";

// Premium easing curves
const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;
const EASE_LOGO = [0.16, 1, 0.3, 1] as const;

const TypewriterText = ({ text, delay }: { text: string; delay: number }) => {
  return (
    <div className="h-8 flex items-center justify-center">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="text-[#c7ae6a] text-base md:text-lg font-medium tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.02, delay: delay + i * 0.055 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
      {/* Blinking cursor */}
      <motion.span
        className="inline-block w-[2px] h-5 md:h-6 bg-[#c7ae6a] ml-0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "linear",
          delay: delay,
        }}
      />
    </div>
  );
};

const LogoSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 80 400 680" className="w-full h-full">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#d4b96a" />
        <stop offset="50%" stopColor="#c7ae6a" />
        <stop offset="100%" stopColor="#b99944" />
      </linearGradient>
    </defs>
    <g fill="url(#goldGrad)">
      <circle cx="454.67" cy="324.85" r="29.13" />
      <path d="M230.28,300.44s79.17,126.47,173.19,98.66c36.43-48.55-14.57-274.78-19.86-299.28,0,0,23.17,189.37-6.3,260.35-74.47,32.97-147.02-59.72-147.02-59.72Z" />
      <path d="M127.36,596.41c28.03-6.62,194-35.75,307.89-220.49-9.71,87.62-57.61,258.89-323.78,366.16,65.38-35.33,160.46-98.44,236.67-215.56,0,0-104.03,95.05-220.78,69.89Z" />
    </g>
  </svg>
);

const DecorativeCircles = () => (
  <div className="absolute inset-0 pointer-events-none">
    <motion.div
      className="absolute top-[-12%] left-[-8%] w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full border border-white/[0.07]"
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute top-[18%] right-[-12%] w-[220px] h-[220px] md:w-[260px] md:h-[260px] rounded-full border border-white/[0.04]"
      animate={{ rotate: -360 }}
      transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute bottom-[-18%] right-[8%] w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-full border border-white/[0.07]"
      animate={{ rotate: 360 }}
      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
    />
    <motion.div
      className="absolute bottom-[8%] left-[18%] w-[130px] h-[130px] md:w-[160px] md:h-[160px] rounded-full border border-white/[0.04]"
      animate={{ rotate: -360 }}
      transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export const AnimatedLogoReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.4 });
  const [animKey, setAnimKey] = useState(0);

  // Every time it comes INTO view, bump the key so animations replay fresh
  useEffect(() => {
    if (isInView) {
      setAnimKey((k) => k + 1);
    }
  }, [isInView]);

  return (
    <div ref={containerRef} className="w-full max-w-[500px] mx-auto">
      <div className="w-full aspect-[4/3] relative rounded-[32px] overflow-hidden bg-[#fbf0cf] p-[6px]">
        {isInView ? (
          <motion.div
            key={animKey}
            className="w-full h-full rounded-[28px] bg-gradient-to-br from-[#162641] to-[#1c2f4d] relative overflow-hidden flex flex-col items-center justify-center"
            initial={{ scale: 0.88, opacity: 0, borderRadius: "40px" }}
            animate={{ scale: 1, opacity: 1, borderRadius: "28px" }}
            transition={{
              duration: 1.1,
              ease: EASE_REVEAL as unknown as number[],
            }}
          >
            {/* Decorative circles */}
            <DecorativeCircles />

            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-radial from-white/[0.03] via-transparent to-transparent pointer-events-none" />

            {/* Logo with scale + rotate reveal */}
            <motion.div
              className="w-28 h-28 md:w-36 md:h-36 mb-5 relative z-10"
              initial={{ scale: 0.5, opacity: 0, rotate: -12, y: 15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
              transition={{
                duration: 1,
                ease: EASE_LOGO as unknown as number[],
                delay: 1.2,
              }}
            >
              <LogoSVG />
            </motion.div>

            {/* Typewriter tagline */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.3, duration: 0.3 }}
            >
              <TypewriterText text="Empowering Futures" delay={2.4} />
            </motion.div>

            {/* Subtle bottom vignette */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#162641]/40 to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          /* Empty beige canvas when out of view */
          <div className="w-full h-full rounded-[28px] bg-[#fbf0cf]" />
        )}
      </div>
    </div>
  );
};
