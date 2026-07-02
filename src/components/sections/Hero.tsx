import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolio } from "../../lib/store";
import { 
  Instagram, 
  Linkedin, 
  Dribbble, 
  Sparkles, 
  Smartphone, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight 
} from "lucide-react";

export default function Hero() {
  const { data } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLHeadingElement>(null);
  const accentLineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);

  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  // Reload video if URL changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [data.hero.videoUrl]);

  // Auto-scrolling interval for bottom features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle Scroll Parallax (Content moves 25%, Background moves 10%)
  // Optimized: Only updates state when Hero is visible on screen
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll <= window.innerHeight) {
        setScrollY(currentScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Mouse Parallax
  // Optimized: Only tracks mouse when Hero is visible on screen
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.scrollY > window.innerHeight) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      // Calculate normalized mouse positions (-0.5 to 0.5)
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // GSAP Entrance Animations Sequenced Exactly as specified
  useEffect(() => {
    // 0.0 Video already playing (managed by html5 properties)

    const tl = gsap.timeline();

    // 0.3 Overlay fades
    tl.to(overlayRef.current, {
      opacity: 1,
      duration: 1.2,
      ease: "power2.out",
    }, 0.3);

    // 0.8 Eyebrow slides from left
    tl.fromTo(eyebrowRef.current,
      { opacity: 0, x: -50 },
      { opacity: 0.95, x: 0, duration: 1.0, ease: "power3.out" },
      0.8
    );

    // 1.2 Headline first line
    tl.fromTo(line1Ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" },
      1.2
    );

    // 1.6 Headline second line
    tl.fromTo(line2Ref.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" },
      1.6
    );

    // 2.0 Purple line grows from left
    tl.fromTo(accentLineRef.current,
      { width: 0, opacity: 0 },
      { width: "300px", opacity: 1, duration: 1.0, ease: "power3.inOut" },
      2.0
    );

    // 2.2 Paragraph fades upward
    tl.fromTo(descRef.current,
      { opacity: 0, y: 20 },
      { opacity: 0.82, y: 0, duration: 1.0, ease: "power3.out" },
      2.2
    );

    // 2.5 Buttons appear
    tl.fromTo(buttonsRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      2.5
    );

    // 2.8 Social icons fade upward one by one
    if (socialRef.current) {
      const socialChildren = socialRef.current.children;
      tl.fromTo(socialChildren,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" },
        2.8
      );
    }

    // 3.2 Bottom glass card rises
    tl.fromTo(infoCardRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      3.2
    );

  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Parallax translation math
  const contentYOffset = scrollY * -0.25; // Content moves upward 25% on scroll
  const videoYOffset = scrollY * -0.10;   // Video moves upward 10% on scroll

  // Mouse Parallax translations
  const mouseContentX = mousePos.x * 10;  // 10px max movement
  const mouseContentY = mousePos.y * 10;
  const mouseVideoX = mousePos.x * 4;     // Video moves slower
  const mouseVideoY = mousePos.y * 4;

  const navLinks = [
    { label: "HOME", href: "#hero" },
    { label: "ABOUT", href: "#about" },
    { label: "WORK", href: "#work" },
    { label: "SERVICES", href: "#work" }, // Services section routes to FeaturedWork/Capabilities
    { label: "CONTACT", href: "#contact" },
  ];

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-screen md:h-screen overflow-hidden bg-[#050505] flex flex-col md:flex-row md:items-center justify-center px-6 md:px-[72px] py-24 md:py-0"
    >
      {/* 1. Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        referrerPolicy="no-referrer"
        style={{
          transform: `translate3d(${mouseVideoX}px, ${mouseVideoY + videoYOffset}px, 0)`,
          transition: "transform 0.15s ease-out",
        }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source
          src={data.hero.videoUrl}
          type="video/mp4"
        />
      </video>

      {/* Very subtle film grain/overlay effect */}
      <div className="absolute inset-0 bg-radial-gradient opacity-10 pointer-events-none z-10" />
      <div className="absolute inset-0 noise-bg pointer-events-none opacity-20 z-10" />

      {/* 2. Premium Dark Cinematic Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(90deg, rgba(5,5,5,.88) 0%, rgba(5,5,5,.75) 35%, rgba(5,5,5,.45) 65%, rgba(5,5,5,.25) 100%)`,
        }}
      />



      {/* 4. Hero Content (Vertically centered, responsive alignments) */}
      <div
        ref={contentRef}
        style={{
          transform: `translate3d(${mouseContentX}px, ${mouseContentY + contentYOffset}px, 0)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative z-10 w-full max-w-[92vw] sm:max-w-[680px] lg:max-w-[780px] xl:max-w-[880px] flex flex-col justify-center items-center lg:items-start text-center lg:text-left select-none pointer-events-auto mx-auto lg:mx-0 mt-20 lg:mt-0"
      >
        {/* Eyebrow Text */}
        <div
          ref={eyebrowRef}
          className="font-sans font-semibold text-xs sm:text-sm tracking-[4px] sm:tracking-[6px] text-[#A855F7] opacity-0 mb-6 uppercase"
        >
          {data.hero.eyebrow}
        </div>

        {/* Main Editorial Headline */}
        <h1 className="font-sans font-black text-3xl sm:text-5xl md:text-[76px] lg:text-[104px] tracking-tighter leading-[0.92] text-white mb-6 select-none flex flex-col items-center lg:items-start w-full">
          {/* Line 1 */}
          <div ref={line1Ref} className="opacity-0 flex items-center justify-center lg:justify-start flex-wrap w-full">
            <span className="bg-gradient-to-b from-white to-[#E8E8E8] bg-clip-text text-transparent">
              {data.hero.headlineLine1}&nbsp;
            </span>
            <span className="relative bg-gradient-to-b from-[#D8B4FE] to-[#8B5CF6] bg-clip-text text-transparent text-glow drop-shadow-[0_0_22px_rgba(168,85,247,0.18)]">
              {data.hero.headlineLine1Accent}
              <span className="absolute bottom-2 md:bottom-3 -right-4 w-[8px] h-[8px] md:w-[12px] md:h-[12px] bg-[#8B5CF6] rounded-full shadow-[0_0_18px_rgba(168,85,247,0.7)]" />
            </span>
            <span>.</span>
          </div>

          {/* Line 2 */}
          <div ref={line2Ref} className="opacity-0 flex items-center justify-center lg:justify-start flex-wrap mt-1 w-full">
            <span className="bg-gradient-to-b from-white to-[#E8E8E8] bg-clip-text text-transparent">
              {data.hero.headlineLine2}&nbsp;
            </span>
            <span className="relative bg-gradient-to-b from-[#D8B4FE] to-[#8B5CF6] bg-clip-text text-transparent text-glow drop-shadow-[0_0_22px_rgba(168,85,247,0.18)]">
              {data.hero.headlineLine2Accent}
              <span className="absolute bottom-2 md:bottom-3 -right-4 w-[8px] h-[8px] md:w-[12px] md:h-[12px] bg-[#8B5CF6] rounded-full shadow-[0_0_18px_rgba(168,85,247,0.7)]" />
            </span>
            <span>.</span>
          </div>
        </h1>

        {/* Thin Purple Accent Line */}
        <div className="h-[2px] w-full max-w-[200px] sm:max-w-[300px] mb-8 overflow-hidden">
          <div
            ref={accentLineRef}
            className="h-full w-0 bg-gradient-to-r from-transparent via-[#A855F7] to-transparent shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          />
        </div>

        {/* Description */}
        <p
          ref={descRef}
          className="font-sans font-light text-base sm:text-xl lg:text-[24px] leading-relaxed text-white/82 max-w-[560px] opacity-0 mb-10"
        >
          {data.hero.description}
        </p>

        {/* Action Buttons (Full-width stacked on mobile, row on tablet/desktop) */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full sm:w-auto opacity-0 px-4 sm:px-0">
          <button
            onClick={() => handleScrollTo("#work")}
            className="relative h-[56px] sm:h-auto px-9 py-4 sm:py-5 rounded-2xl font-sans font-bold text-sm tracking-widest text-white bg-gradient-to-b from-[#7C3AED] to-[#A855F7] shadow-[0_10px_40px_rgba(124,58,237,0.45)] hover:-translate-y-1 hover:brightness-110 active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer hover-trigger text-center flex items-center justify-center"
          >
            {data.hero.btn1Text} &nbsp;&rarr;
          </button>
          <button
            onClick={() => handleScrollTo("#contact")}
            className="relative h-[56px] sm:h-auto px-9 py-4 sm:py-5 rounded-2xl font-sans font-bold text-sm tracking-widest text-white border border-white/18 bg-transparent hover:bg-white/8 active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer hover-trigger text-center flex items-center justify-center"
          >
            {data.hero.btn2Text}
          </button>
        </div>
      </div>

      {/* 5. Social Section (Bottom Left) */}
      <div
        ref={socialRef}
        className="absolute bottom-12 left-6 md:left-[72px] hidden lg:flex items-center gap-6 z-10"
      >
        <span className="font-sans font-semibold text-xs tracking-[4px] text-[#A855F7]">
          FOLLOW ME
        </span>
        <div className="w-[120px] h-[1px] bg-white/10" />
        <div className="flex items-center gap-3">
          {[
            { icon: <Linkedin className="w-5 h-5" />, href: "#" },
            { icon: <Dribbble className="w-5 h-5" />, href: "#" },
            { icon: <Instagram className="w-5 h-5" />, href: "#" },
          ].map((soc, i) => (
            <a
              key={i}
              href={soc.href}
              className="w-[52px] h-[52px] rounded-full border border-white/8 bg-white/5 backdrop-blur-md flex items-center justify-center text-[#ECECEC] hover:text-white hover:border-[#A855F7] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-1.5 hover:rotate-6 transition-all duration-300 hover-trigger"
            >
              {soc.icon}
            </a>
          ))}
        </div>
      </div>

      {/* 6. Bottom Information Card (Unified Premium Auto-Scrolling Carousel) */}
      <div
        ref={infoCardRef}
        className="relative mt-12 md:absolute md:bottom-12 md:left-6 md:right-[72px] lg:left-auto lg:right-[72px] md:mt-0 z-10 opacity-0 pointer-events-auto w-full md:w-auto"
      >
        <div className="relative w-full md:w-[480px] xl:w-[540px] h-[130px] sm:h-[140px] rounded-[24px] border border-white/8 bg-[#0F0F0F]/35 backdrop-blur-[26px] overflow-hidden p-4 sm:p-6 flex flex-col justify-between shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeatureIndex}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center gap-4 sm:gap-6 flex-1 text-left select-none"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                {[
                  <motion.div
                    key="sparkles"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#A855F7]" />
                  </motion.div>,
                  <motion.div
                    key="smartphone"
                    animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -3, 0] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  >
                    <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-[#A855F7]" />
                  </motion.div>,
                  <motion.div
                    key="trending"
                    animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  >
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#A855F7]" />
                  </motion.div>,
                  <motion.div
                    key="dollar"
                    animate={{ y: [0, -4, 0], scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  >
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-[#A855F7]" />
                  </motion.div>
                ][activeFeatureIndex]}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-sans font-extrabold text-sm sm:text-base text-white uppercase tracking-wider mb-1 truncate">
                  {[
                    "Premium Design",
                    "Fast and Responsive",
                    "Seo Friendly",
                    "Budget Friendly"
                  ][activeFeatureIndex]}
                </h4>
                <p className="font-sans font-light text-xs sm:text-sm text-[#9E9E9E] leading-relaxed truncate">
                  {[
                    "Modern. Clean. Impactful.",
                    "Built for every device.",
                    "Optimized to rank higher.",
                    "Premium quality. Practical price."
                  ][activeFeatureIndex]}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress indicators & Pagination at the bottom */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <div className="flex gap-2.5 items-center">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className="relative h-1 bg-white/10 rounded-full overflow-hidden w-8 cursor-pointer"
                >
                  {idx === activeFeatureIndex ? (
                    <motion.div
                      key={idx}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 4.0, ease: "linear" }}
                      className="absolute top-0 left-0 h-full bg-[#A855F7] shadow-[0_0_8px_#A855F7]"
                    />
                  ) : null}
                </button>
              ))}
            </div>
            <span className="font-mono text-[10px] text-white/40 tracking-widest">
              0{activeFeatureIndex + 1} / 04
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
