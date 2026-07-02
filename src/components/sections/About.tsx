import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePortfolio } from "../../lib/store";
import { 
  User, 
  MapPin, 
  Briefcase, 
  Send, 
  Code, 
  Layers, 
  Lightbulb, 
  Compass, 
  Rocket,
  Target,
  Cpu,
  Sparkles,
  Terminal,
  ShieldCheck,
  Zap
} from "lucide-react";

// Official monochrome SVG logos with high-fidelity hover effect & size 32px
const FigmaLogo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="Figma tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <svg className="w-8 h-8 text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.69 2 6 4.69 6 8c0 1.34.44 2.58 1.19 3.58C6.44 12.58 6 13.82 6 15c0 3.31 2.69 6 6 6c3.31 0 6-2.69 6-6c0-1.18-.44-2.42-1.19-3.42C17.56 10.58 18 9.34 18 8c0-3.31-2.69-6-6-6zm-3 6c0-1.66 1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3s-3-1.34-3-3zm3 10c-1.66 0-3-1.34-3-3s1.34-3 3-3h3v3c0 1.66-1.34 3-3 3zm0-7c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3zm3 0h-3v-3c0-1.66 1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"/>
    </svg>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">Figma</span>
  </div>
);

const FramerLogo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="Framer tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <svg className="w-8 h-8 text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 2h14v6H12L5 2zM12 8h7v6H5l7-6zM5 14h7v8l7-8H5z" />
    </svg>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">Framer</span>
  </div>
);

const WebflowLogo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="Webflow tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <svg className="w-8 h-8 text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.062 5.093c-.636 0-1.167.311-1.503.784l-3.342 5.348-2.613-5.267a1.696 1.696 0 0 0-1.53-.865c-.637 0-1.168.31-1.505.783L8.227 11.22l-2.07-4.175a1.697 1.697 0 0 0-1.531-.865c-.954 0-1.697.743-1.697 1.697s.743 1.697 1.697 1.697c.21 0 .393-.053.572-.144l2.76-5.56 1.613 3.25c.16.324.494.542.855.542.36 0 .694-.218.855-.542l1.614-3.25 2.759 5.56c.18.09.362.144.572.144.954 0 1.697-.743 1.697-1.697V6.79c0-.954-.743-1.697-1.697-1.697"/>
    </svg>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">Webflow</span>
  </div>
);

const SupabaseLogo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="Supabase tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <svg className="w-8 h-8 text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.35 11.2L14.24 2.3c-.5-.6-1.4-.6-1.9 0l-1.3 1.6c-.3.4-.3.9 0 1.3l5.4 6.8H10c-.8 0-1.4.6-1.4 1.4v.2l2.3 8.1c.3.9 1.4 1.2 2.1.6l7.1-5.9c.7-.6.7-1.6.2-2.2l-1.3-1.6c-.3-.4-.8-.4-1.2 0l-5.4 6.8h6.5c.8 0 1.4-.6 1.4-1.4V12.6c0-.5-.2-1-.6-1.4z" />
    </svg>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">Supabase</span>
  </div>
);

const CursorLogo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="Cursor tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <svg className="w-8 h-8 text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">Cursor</span>
  </div>
);

const V0Logo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="V0 tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <div className="w-8 h-8 flex items-center justify-center">
      <span className="font-mono font-black text-lg tracking-tighter text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300">V0</span>
    </div>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">V0</span>
  </div>
);

const GitHubLogo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="GitHub tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <svg className="w-8 h-8 text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">GitHub</span>
  </div>
);

const VercelLogo = () => (
  <div 
    tabIndex={0}
    role="button"
    aria-label="Vercel tool badge"
    className="flex items-center gap-3 group cursor-pointer hover-trigger py-2 px-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#A855F7]/30 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300"
  >
    <svg className="w-8 h-8 text-white/70 group-hover:text-[#A855F7] group-hover:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 22.525H0L12 1.745l12 20.78z" />
    </svg>
    <span className="font-sans font-medium text-[13px] text-white/60 group-hover:text-white transition-colors">Vercel</span>
  </div>
);

export default function About() {
  const { data } = usePortfolio();
  const containerRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const holoVideoRef = useRef<HTMLVideoElement>(null);
  
  // Element Refs for GSAP Entrance Timeline
  const labelRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLDivElement>(null);
  const heading2Ref = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const infoCardsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);

  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [particleCount, setParticleCount] = useState(6);
  const [isXl, setIsXl] = useState(false);

  // Reload videos if URLs change
  useEffect(() => {
    if (bgVideoRef.current) {
      bgVideoRef.current.load();
    }
  }, [data.about.bgVideoUrl]);

  useEffect(() => {
    if (holoVideoRef.current) {
      holoVideoRef.current.load();
    }
  }, [data.about.holoVideoUrl]);

  // Responsive Particle Count Calculation & Breakpoint Checks
  useEffect(() => {
    const handleResize = () => {
      setParticleCount(window.innerWidth < 768 ? 5 : 12);
      setIsXl(window.innerWidth >= 1280);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Play/Pause Video Optimization when in/out of screen viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            bgVideoRef.current?.play().catch(() => {});
            holoVideoRef.current?.play().catch(() => {});
          } else {
            bgVideoRef.current?.pause();
            holoVideoRef.current?.pause();
          }
        });
      },
      { threshold: 0.01 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Handle Scroll Parallax (Hologram moves 12%, Background moves 6%)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
      if (isVisible) {
        setScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle Mouse Move for Parallax and Tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top <= window.innerHeight && rect.bottom >= 0;
      if (!isVisible) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth) - 0.5;
      const y = (clientY / innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [hasAnimated, setHasAnimated] = useState(false);

  const runEntranceAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const tl = gsap.timeline();

    // 1. Background fades in
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 1.0,
    }, 0.2);

    // 2. Hologram fades & scales from 0.95 to 1
    if (leftColRef.current) {
      const holoWrapper = leftColRef.current.querySelector(".hologram-wrapper");
      tl.fromTo(holoWrapper,
        { opacity: 0, scale: 0.95, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.3, ease: "power3.out" },
        0.5
      );
    }

    // Glow and Rings activate
    if (leftColRef.current) {
      const hologram = leftColRef.current.querySelector(".holo-glow-element");
      const rings = leftColRef.current.querySelectorAll(".holo-ring");
      tl.to(hologram, {
        filter: "drop-shadow(0 0 35px rgba(168,85,247,0.7))",
        duration: 1.0,
        ease: "power2.out"
      }, 0.9);
      tl.to(rings, {
        opacity: 0.5,
        duration: 1.0,
        stagger: 0.12,
        ease: "power2.out"
      }, 0.9);
    }

    // Floating labels appear (Tablet & Desktop Only)
    if (leftColRef.current) {
      const floatingLabels = leftColRef.current.querySelectorAll(".floating-glass-card");
      const dottedLines = leftColRef.current.querySelectorAll(".dotted-connector-path");
      const mobileLabels = leftColRef.current.querySelectorAll(".mobile-attribute-card");
      
      tl.fromTo(floatingLabels,
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        1.1
      );
      tl.fromTo(dottedLines,
        { strokeDashoffset: 100, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.4, duration: 1.2, ease: "power2.out" },
        1.1
      );
      // Animate the cards one by one on mobile
      tl.fromTo(mobileLabels,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
        1.1
      );
    }

    // 3. Heading reveals line by line
    tl.fromTo(labelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      1.4
    );

    tl.fromTo(heading1Ref.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      1.6
    );

    tl.fromTo(heading2Ref.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power4.out" },
      1.8
    );

    // 4. Paragraph fades upward
    tl.fromTo(descRef.current,
      { opacity: 0, y: 25 },
      { opacity: 0.82, y: 0, duration: 1.0, ease: "power3.out" },
      2.0
    );

    // 5. Cards stagger upward
    if (infoCardsRef.current) {
      const cards = infoCardsRef.current.children;
      tl.fromTo(cards,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
        2.2
      );
    }

    // 6. Timeline icons animate
    if (timelineRef.current) {
      const timelineHeading = timelineRef.current.querySelector("h4");
      const stepsHorizontal = timelineRef.current.querySelectorAll(".timeline-step-horizontal");
      const stepsVertical = timelineRef.current.querySelectorAll(".timeline-step-vertical");
      
      tl.fromTo(timelineHeading,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        2.5
      );
      
      tl.fromTo([stepsHorizontal, stepsVertical],
        { opacity: 0, scale: 0.9, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" },
        2.7
      );
    }

    // 7. Tool logos fade in
    tl.fromTo(toolbarRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      3.1
    );
  };

  // GSAP Entrance Animations Sequenced Exactly as specified
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runEntranceAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.02 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Fallback timer
    const fallbackTimer = setTimeout(() => {
      runEntranceAnimation();
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [hasAnimated]);

  // Parallax translation maths
  const contentYOffset = scrollY * -0.04; 
  const videoYOffset = scrollY * 0.06;    
  const holoYOffset = isXl ? scrollY * 0.12 : 0;    

  // Mouse tilt translation maths
  const mouseContentX = mousePos.x * 10;
  const mouseContentY = mousePos.y * 10;
  const mouseHoloX = mousePos.x * 12;
  const mouseHoloY = mousePos.y * 12;
  const holoRotationY = mousePos.x * 10; 

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#050505] flex flex-col justify-center items-center opacity-95 transition-opacity duration-300"
    >
      {/* 1. Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          referrerPolicy="no-referrer"
          style={{
            transform: `translate3d(0, ${videoYOffset}px, 0)`,
          }}
          className="absolute inset-0 w-full h-full object-cover z-[-3]"
        >
          <source
            src={data.about.bgVideoUrl}
            type="video/mp4"
          />
        </video>

        {/* Cinematic Dark Overlay */}
        <div
          className="absolute inset-0 z-[-2]"
          style={{
            background: `linear-gradient(180deg, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.75) 50%, rgba(5,5,5,0.88) 100%)`,
          }}
        />

        {/* Subtle Vignette & Glow effects */}
        <div className="absolute inset-0 pointer-events-none z-[-1] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.04)_0%,transparent_80%)]" />
        <div className="absolute top-[30%] left-[15%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[#8B5CF6]/2 blur-[100px] sm:blur-[140px] pointer-events-none z-[-1]" />
        <div className="absolute bottom-[30%] right-[10%] w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] rounded-full bg-[#A855F7]/2 blur-[90px] sm:blur-[130px] pointer-events-none z-[-1]" />

        {/* Dynamic Floating Particles Field with Reduced opacity on Mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] opacity-30 md:opacity-45">
          {[...Array(particleCount)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[3px] h-[3px] bg-[#A855F7] rounded-full animate-pulse"
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${5 + Math.random() * 90}%`,
                boxShadow: "0 0 10px rgba(168,85,247,0.8)",
                animationDuration: `${4 + Math.random() * 6}s`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Main Responsive Grid Container with strict scale constraints */}
      <div 
        ref={leftColRef}
        style={{
          transform: `translate3d(${mouseContentX}px, ${mouseContentY + contentYOffset}px, 0)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative z-10 w-full max-w-[1500px] mx-auto px-[clamp(20px,5vw,80px)] py-[clamp(80px,8vw,140px)] grid grid-cols-1 md:grid-cols-[48%_52%] xl:grid-cols-[46%_54%] gap-12 md:gap-[40px] xl:gap-[clamp(40px,5vw,80px)] items-start"
      >
        
        {/* HEADER BLOCK (Top on Mobile, Column 2 Row 1 on Desktop) */}
        <div className="relative z-10 w-full flex flex-col justify-center text-center md:text-left items-center md:items-start pointer-events-auto md:col-start-2 md:row-start-1">
          {/* Small label with glowing accent line */}
          <div ref={labelRef} className="flex items-center gap-4 mb-5 md:mb-7 opacity-0">
            <span className="font-sans font-semibold text-sm sm:text-lg tracking-[6px] text-[#A855F7] uppercase">
              ABOUT ME
            </span>
            <div 
              className="h-[2px] w-[50px] sm:w-[70px] bg-[#A855F7]" 
              style={{
                boxShadow: "0 0 10px rgba(168,85,247,0.8)"
              }}
            />
          </div>

          {/* Main Heading with fluid font scaling */}
          <h3 className="font-sans font-black text-[clamp(1.9rem,5.5vw,4.5rem)] leading-[1.0] md:leading-[0.95] tracking-tighter text-white mb-6 max-w-[700px]">
            <div ref={heading1Ref} className="opacity-0">{data.about.headline1}</div>
            <div 
              ref={heading2Ref} 
              className="opacity-0 bg-gradient-to-r from-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent text-glow drop-shadow-[0_0_18px_rgba(168,85,247,0.22)]"
            >
              {data.about.headline2}
            </div>
          </h3>

          {/* Paragraph */}
          <p 
            ref={descRef} 
            className="font-sans font-light text-[clamp(1rem,1.3vw,1.25rem)] leading-[1.8] text-white/80 max-w-[620px] mt-4 md:mt-6 mb-8 opacity-0"
          >
            {data.about.description}
          </p>
        </div>

        {/* HOLOGRAM BLOCK (Second on Mobile, Column 1 Row 1-3 on Desktop) */}
        <div className="relative w-full h-auto flex flex-col items-center justify-center select-none md:col-start-1 md:row-start-1 md:row-span-3 md:sticky md:top-24">
          {/* Hologram Box - everything is kept safe and responsive here */}
          <div className="relative w-full max-w-[320px] sm:max-w-[420px] md:max-w-[460px] xl:max-w-[560px] aspect-square flex items-center justify-center">
            
            {/* Animated Hologram Rings underneath (Perfect 3D perspective) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div 
                className="relative flex items-center justify-center w-full h-full"
                style={{ transform: "rotateX(75deg) translateY(60px)" }}
              >
                {/* Largest Ring */}
                <div 
                  className="holo-ring absolute rounded-full border-2 border-[#A855F7] opacity-0 animate-[spin_40s_linear_infinite] w-[110%] h-[110%]"
                  style={{
                    boxShadow: "0 0 30px rgba(168,85,247,0.55), inset 0 0 30px rgba(168,85,247,0.55)",
                  }}
                />
                {/* Middle Ring */}
                <div 
                  className="holo-ring absolute rounded-full border-2 border-[#A855F7] opacity-0 animate-[spin_30s_linear_infinite_reverse] w-[85%] h-[85%]"
                  style={{
                    boxShadow: "0 0 25px rgba(168,85,247,0.5), inset 0 0 25px rgba(168,85,247,0.5)",
                  }}
                />
                {/* Smallest Ring */}
                <div 
                  className="holo-ring absolute rounded-full border-2 border-[#A855F7] opacity-0 animate-[spin_20s_linear_infinite] w-[60%] h-[60%]"
                  style={{
                    boxShadow: "0 0 20px rgba(168,85,247,0.45), inset 0 0 20px rgba(168,85,247,0.45)",
                  }}
                />
              </div>
            </div>

            {/* Dotted Connection Lines inside the container box to prevent viewport overflow (Desktop only) */}
            <svg 
              className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden xl:block"
              viewBox="0 0 600 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* DESKTOP PATHS (xl and above) */}
              <g>
                {/* Focused Line */}
                <path 
                  className="dotted-connector-path"
                  d="M 120,110 L 260,250" 
                  stroke="#A855F7" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.5))" }}
                />
                {/* Creative Line */}
                <path 
                  className="dotted-connector-path"
                  d="M 90,300 L 250,300" 
                  stroke="#A855F7" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.5))" }}
                />
                {/* Reliable Line */}
                <path 
                  className="dotted-connector-path"
                  d="M 120,490 L 260,350" 
                  stroke="#A855F7" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.5))" }}
                />
                {/* AI Powered Line */}
                <path 
                  className="dotted-connector-path"
                  d="M 480,150 L 340,250" 
                  stroke="#A855F7" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.5))" }}
                />
                {/* Modern Line */}
                <path 
                  className="dotted-connector-path"
                  d="M 510,300 L 350,300" 
                  stroke="#A855F7" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.5))" }}
                />
                {/* Efficient Line */}
                <path 
                  className="dotted-connector-path"
                  d="M 480,450 L 340,350" 
                  stroke="#A855F7" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                  style={{ filter: "drop-shadow(0 0 5px rgba(168,85,247,0.5))" }}
                />
              </g>
            </svg>

            {/* Left Floating Labels (Positively bound to holographic parent container) */}
            {/* Card 1: FOCUSED */}
            <div 
              tabIndex={0}
              className="floating-glass-card absolute top-[5%] left-[-4%] lg:left-[-12%] xl:left-[-22%] w-[115px] lg:w-[130px] xl:w-[160px] p-2.5 lg:p-3 xl:p-4.5 rounded-[18px] border border-white/8 bg-[#101010]/22 backdrop-blur-[12px] md:backdrop-blur-[18px] z-20 opacity-0 select-none pointer-events-auto hover:border-[#A855F7]/40 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300 group hidden xl:block"
              style={{
                transform: `translate3d(${mousePos.x * -4}px, ${mousePos.y * -4}px, 0)`
              }}
            >
              <span className="block font-sans font-black text-[clamp(9px,1.2vw,12px)] tracking-[2px] text-[#A855F7] mb-1">FOCUSED</span>
              <span className="block font-sans font-medium text-[clamp(9px,1.1vw,11px)] text-white/50 group-hover:text-white/90 transition-colors">Clean Code</span>
              <span className="block font-sans font-medium text-[clamp(9px,1.1vw,11px)] text-white/50 group-hover:text-white/90 transition-colors">Smart Flow</span>
            </div>

            {/* Card 2: CREATIVE */}
            <div 
              tabIndex={0}
              className="floating-glass-card absolute top-[43%] left-[-10%] lg:left-[-18%] xl:left-[-29%] w-[115px] lg:w-[130px] xl:w-[160px] p-2.5 lg:p-3 xl:p-4.5 rounded-[18px] border border-white/8 bg-[#101010]/22 backdrop-blur-[12px] md:backdrop-blur-[18px] z-20 opacity-0 select-none pointer-events-auto hover:border-[#A855F7]/40 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300 group hidden xl:block"
              style={{
                transform: `translate3d(${mousePos.x * -3}px, ${mousePos.y * -3}px, 0)`
              }}
            >
              <span className="block font-sans font-black text-[clamp(9px,1.2vw,12px)] tracking-[2px] text-[#A855F7] mb-1">CREATIVE</span>
              <span className="block font-sans font-medium text-[clamp(9px,1.1vw,11px)] text-white/50 group-hover:text-white/90 transition-colors">Connected design</span>
            </div>

            {/* Card 3: RELIABLE */}
            <div 
              tabIndex={0}
              className="floating-glass-card absolute bottom-[5%] left-[-4%] lg:left-[-12%] xl:left-[-22%] w-[115px] lg:w-[130px] xl:w-[160px] p-2.5 lg:p-3 xl:p-4.5 rounded-[18px] border border-white/8 bg-[#101010]/22 backdrop-blur-[12px] md:backdrop-blur-[18px] z-20 opacity-0 select-none pointer-events-auto hover:border-[#A855F7]/40 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300 group hidden xl:block"
              style={{
                transform: `translate3d(${mousePos.x * -4}px, ${mousePos.y * -4}px, 0)`
              }}
            >
              <span className="block font-sans font-black text-[clamp(9px,1.2vw,12px)] tracking-[2px] text-[#A855F7] mb-1">RELIABLE</span>
              <span className="block font-sans font-medium text-[clamp(9px,1.1vw,11px)] text-white/50 group-hover:text-white/90 transition-colors">On time delivery</span>
            </div>

            {/* Right Floating Labels */}
            {/* Card 4: AI-POWERED */}
            <div 
              tabIndex={0}
              className="floating-glass-card absolute top-[12%] right-[-4%] lg:right-[-12%] xl:right-[-22%] w-[115px] lg:w-[130px] xl:w-[160px] p-2.5 lg:p-3 xl:p-4.5 rounded-[18px] border border-white/8 bg-[#101010]/22 backdrop-blur-[12px] md:backdrop-blur-[18px] z-20 opacity-0 select-none pointer-events-auto hover:border-[#A855F7]/40 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300 group hidden xl:block"
              style={{
                transform: `translate3d(${mousePos.x * -4}px, ${mousePos.y * -4}px, 0)`
              }}
            >
              <span className="block font-sans font-black text-[clamp(9px,1.2vw,12px)] tracking-[2px] text-[#A855F7] mb-1">AI-POWERED</span>
              <span className="block font-sans font-medium text-[clamp(9px,1.1vw,11px)] text-white/50 group-hover:text-white/90 transition-colors">Smarter code.</span>
            </div>

            {/* Card 5: MODERN */}
            <div 
              tabIndex={0}
              className="floating-glass-card absolute top-[45%] right-[-10%] lg:right-[-18%] xl:right-[-28%] w-[115px] lg:w-[130px] xl:w-[160px] p-2.5 lg:p-3 xl:p-4.5 rounded-[18px] border border-white/8 bg-[#101010]/22 backdrop-blur-[12px] md:backdrop-blur-[18px] z-20 opacity-0 select-none pointer-events-auto hover:border-[#A855F7]/40 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300 group hidden xl:block"
              style={{
                transform: `translate3d(${mousePos.x * -3}px, ${mousePos.y * -3}px, 0)`
              }}
            >
              <span className="block font-sans font-black text-[clamp(9px,1.2vw,12px)] tracking-[2px] text-[#A855F7] mb-1">MODERN</span>
              <span className="block font-sans font-medium text-[clamp(9px,1.1vw,11px)] text-white/50 group-hover:text-white/90 transition-colors">Tools for modern web</span>
            </div>

            {/* Card 6: EFFICIENT */}
            <div 
              tabIndex={0}
              className="floating-glass-card absolute bottom-[10%] right-[-4%] lg:right-[-12%] xl:right-[-22%] w-[115px] lg:w-[130px] xl:w-[160px] p-2.5 lg:p-3 xl:p-4.5 rounded-[18px] border border-white/8 bg-[#101010]/22 backdrop-blur-[12px] md:backdrop-blur-[18px] z-20 opacity-0 select-none pointer-events-auto hover:border-[#A855F7]/40 focus-visible:ring-2 focus-visible:ring-[#A855F7] outline-none transition-all duration-300 group hidden xl:block"
              style={{
                transform: `translate3d(${mousePos.x * -4}px, ${mousePos.y * -4}px, 0)`
              }}
            >
              <span className="block font-sans font-black text-[clamp(9px,1.2vw,12px)] tracking-[2px] text-[#A855F7] mb-1">EFFICIENT</span>
              <span className="block font-sans font-medium text-[clamp(9px,1.1vw,11px)] text-white/50 group-hover:text-white/90 transition-colors">Better results</span>
            </div>

            {/* Hologram project video wrapper */}
            <div 
              className="hologram-wrapper absolute inset-0 w-full h-full flex items-center justify-center opacity-0 z-10"
              style={{
                transform: `translate3d(${mouseHoloX}px, ${mouseHoloY + holoYOffset}px, 0) rotateY(${holoRotationY}deg)`,
                transition: "transform 0.15s ease-out",
              }}
            >
              {/* Scan lines & volumetric glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/4 to-transparent rounded-[32px] blur-3xl pointer-events-none" />
              
              {/* Hologram Video Projector Base */}
              <video
                ref={holoVideoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                referrerPolicy="no-referrer"
                className="holo-glow-element h-full w-full max-h-[500px] object-contain object-center select-none pointer-events-none transition-all duration-[800ms] opacity-[0.97]"
                style={{
                  mixBlendMode: "screen",
                  filter: "drop-shadow(0 0 12px rgba(168,85,247,0.3))",
                }}
              >
                <source
                  src={data.about.holoVideoUrl}
                  type="video/mp4"
                />
              </video>

              {/* Vertical glowing project scan lines overlay */}
              <div 
                className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[80%] h-full pointer-events-none opacity-[0.05] select-none z-10"
                style={{
                  background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(168, 85, 247, 0.25) 50%)",
                  backgroundSize: "100% 4px"
                }}
              />
            </div>

          </div>

          {/* GRID OF ATTRIBUTE CARDS (Visible on Mobile & Tablet/Laptops below XL size, Hidden on wide desktops) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 w-full px-2 mt-8 relative z-20 xl:hidden">
            {[
              { id: "focused", title: "Focused", icon: <Target className="w-5 h-5 text-[#A855F7]" />, lines: ["Clean Code", "Smart Flow"] },
              { id: "reliable", title: "Reliable", icon: <ShieldCheck className="w-5 h-5 text-[#A855F7]" />, lines: ["On time", "Every time"] },
              { id: "modern", title: "Modern", icon: <Code className="w-5 h-5 text-[#A855F7]" />, lines: ["Tools for", "modern web"] },
              { id: "creative", title: "Creative", icon: <Rocket className="w-5 h-5 text-[#A855F7]" />, lines: ["Design that", "connects"] },
              { id: "ai-powered", title: "AI Powered", icon: <Cpu className="w-5 h-5 text-[#A855F7]" />, lines: ["Smarter code.", "Faster delivery."] },
              { id: "efficient", title: "Efficient", icon: <Zap className="w-5 h-5 text-[#A855F7]" />, lines: ["Better workflow,", "Better results"] },
            ].map((card) => (
              <div 
                key={card.id} 
                className="mobile-attribute-card opacity-0 min-h-[72px] p-4 rounded-[16px] border border-[#A855F7]/15 bg-[#121212]/35 backdrop-blur-[18px] flex items-center gap-3.5 active:scale-[0.98] transition-all duration-200 select-none cursor-pointer"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                  {card.icon}
                </div>
                <div className="flex flex-col text-left justify-center min-w-0">
                  <span className="block font-sans font-semibold text-[clamp(0.9rem,2vw,1rem)] text-[#A855F7] uppercase tracking-wider mb-0.5 truncate">{card.title}</span>
                  {card.lines.map((line, lIdx) => (
                    <span key={lIdx} className="block font-sans font-normal text-[clamp(0.75rem,1.8vw,0.9rem)] text-white/75 leading-tight">{line}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* INFO GRID OF CARDS (Fourth on Mobile, Column 2 Row 2 on Desktop) */}
        <div 
          ref={infoCardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[650px] mb-10 md:mb-12 md:col-start-2 md:row-start-2 mt-8 md:mt-0"
        >
          {/* Name */}
          <div className="min-h-[96px] rounded-[18px] border border-white/8 bg-[#121212]/30 backdrop-blur-[12px] md:backdrop-blur-[20px] p-[22px] flex items-center gap-4 hover:border-[#A855F7]/30 transition-all duration-300 opacity-0 w-full">
            <User className="w-6 h-6 text-[#A855F7] flex-shrink-0" />
            <div className="text-left">
              <span className="block font-sans text-[10px] tracking-wider text-white/40 uppercase">NAME</span>
              <span className="block font-sans font-bold text-lg text-white">{data.about.name}</span>
            </div>
          </div>

          {/* Age */}
          <div className="min-h-[96px] rounded-[18px] border border-white/8 bg-[#121212]/30 backdrop-blur-[12px] md:backdrop-blur-[20px] p-[22px] flex items-center gap-4 hover:border-[#A855F7]/30 transition-all duration-300 opacity-0 w-full">
            <User className="w-6 h-6 text-[#A855F7] flex-shrink-0" />
            <div className="text-left">
              <span className="block font-sans text-[10px] tracking-wider text-white/40 uppercase">AGE</span>
              <span className="block font-sans font-bold text-lg text-white">{data.about.age}</span>
            </div>
          </div>

          {/* From */}
          <div className="min-h-[96px] rounded-[18px] border border-white/8 bg-[#121212]/30 backdrop-blur-[12px] md:backdrop-blur-[20px] p-[22px] flex items-center gap-4 hover:border-[#A855F7]/30 transition-all duration-300 opacity-0 w-full">
            <MapPin className="w-6 h-6 text-[#A855F7] flex-shrink-0" />
            <div className="text-left">
              <span className="block font-sans text-[10px] tracking-wider text-white/40 uppercase">FROM</span>
              <span className="block font-sans font-bold text-lg text-white">{data.about.from}</span>
            </div>
          </div>

          {/* Experience */}
          <div className="min-h-[96px] rounded-[18px] border border-white/8 bg-[#121212]/30 backdrop-blur-[12px] md:backdrop-blur-[20px] p-[22px] flex items-center gap-4 hover:border-[#A855F7]/30 transition-all duration-300 opacity-0 w-full">
            <Briefcase className="w-6 h-6 text-[#A855F7] flex-shrink-0" />
            <div className="text-left">
              <span className="block font-sans text-[10px] tracking-wider text-white/40 uppercase">EXPERIENCE</span>
              <span className="block font-sans font-bold text-lg text-white">{data.about.experience}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="min-h-[96px] rounded-[18px] border border-white/8 bg-[#121212]/30 backdrop-blur-[12px] md:backdrop-blur-[20px] p-[22px] flex items-center gap-4 hover:border-[#A855F7]/30 transition-all duration-300 opacity-0 w-full">
            <Send className="w-6 h-6 text-[#A855F7] flex-shrink-0" />
            <div className="text-left">
              <span className="block font-sans text-[10px] tracking-wider text-white/40 uppercase">AVAILABILITY</span>
              <span className="block font-sans font-bold text-lg text-white">{data.about.availability}</span>
            </div>
          </div>

          {/* Specialization (Spans full width dynamically with equal padding/height) */}
          <div className="col-span-1 sm:col-span-2 min-h-[96px] rounded-[18px] border border-white/8 bg-[#121212]/30 backdrop-blur-[12px] md:backdrop-blur-[20px] p-[22px] flex items-center gap-4 hover:border-[#A855F7]/30 transition-all duration-300 opacity-0 w-full">
            <Layers className="w-6 h-6 text-[#A855F7] flex-shrink-0" />
            <div className="text-left">
              <span className="block font-sans text-[10px] tracking-wider text-white/40 uppercase">SPECIALIZATION</span>
              <span className="block font-sans font-bold text-[14px] sm:text-lg text-white">{data.about.specialization}</span>
            </div>
          </div>
        </div>

        {/* MY APPROACH - Process timeline (Fifth on Mobile, Column 2 Row 3 on Desktop) */}
        <div 
          ref={timelineRef}
          className="w-full max-w-[650px] mb-4 md:col-start-2 md:row-start-3"
        >
          <h4 className="font-sans font-semibold text-xs tracking-[3px] text-[#A855F7] uppercase mb-8 text-center md:text-left">
            MY APPROACH
          </h4>

          {/* Desktop Horizontal Timeline */}
          <div className="hidden md:grid grid-cols-4 gap-4 items-start relative w-full">
            {[
              { icon: <Lightbulb className="w-5 h-5 text-[#A855F7]" />, label: "Understand" },
              { icon: <Compass className="w-5 h-5 text-[#A855F7]" />, label: "Design" },
              { icon: <Code className="w-5 h-5 text-[#A855F7]" />, label: "Vibe Coding" },
              { icon: <Rocket className="w-5 h-5 text-[#A855F7]" />, label: "Launch" }
            ].map((step, sIdx) => (
              <div key={sIdx} className="timeline-step-horizontal flex flex-col items-center justify-center text-center relative group">
                <div className="w-[52px] h-[52px] rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-3 group-hover:border-[#A855F7]/60 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.35)] transition-all duration-300 cursor-pointer">
                  {step.icon}
                </div>
                <span className="font-sans font-semibold text-xs text-white tracking-wide">
                  {step.label}
                </span>

                {/* Horizontal dotted connector indicator line between steps */}
                {sIdx < 3 && (
                  <div className="absolute top-[26px] left-[calc(50%+26px)] w-[calc(100%-52px)] h-[1px] border-b border-dashed border-white/10" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile/Tablet Vertical Timeline */}
          <div className="flex md:hidden flex-col gap-6 relative pl-6 border-l border-dashed border-[#A855F7]/30 max-w-[400px] mx-auto md:mx-0">
            {[
              { icon: <Lightbulb className="w-5 h-5 text-[#A855F7]" />, label: "Understand", desc: "Research & scope requirements" },
              { icon: <Compass className="w-5 h-5 text-[#A855F7]" />, label: "Design", desc: "Crafting custom interfaces" },
              { icon: <Code className="w-5 h-5 text-[#A855F7]" />, label: "Vibe Coding", desc: "Rapid implementation & elite logic" },
              { icon: <Rocket className="w-5 h-5 text-[#A855F7]" />, label: "Launch", desc: "Optimizing & going live" }
            ].map((step, sIdx) => (
              <div key={sIdx} className="timeline-step-vertical flex items-start gap-4 relative group">
                <div className="w-[48px] h-[48px] rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#A855F7]/60 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all duration-300 cursor-pointer shrink-0">
                  {step.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-sans font-semibold text-sm text-white tracking-wide">
                    {step.label}
                  </span>
                  <span className="font-sans text-xs text-[#9E9E9E] mt-0.5">
                    {step.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Toolbar: Perfectly responsive on all viewports */}
      <div 
        ref={toolbarRef}
        className="w-full max-w-[1500px] mx-auto px-[clamp(20px,5vw,80px)] pb-[clamp(40px,4vw,80px)] z-20 opacity-0 pointer-events-auto mt-6 md:mt-12"
      >
        <div className="w-full min-h-[110px] rounded-[22px] border border-white/8 bg-[#121212]/35 backdrop-blur-[12px] md:backdrop-blur-[24px] p-6 flex flex-col lg:flex-row justify-between items-center gap-6">
          {/* Left Text */}
          <div className="text-center lg:text-left flex flex-col justify-center w-full lg:w-auto">
            <h4 className="font-sans font-bold text-xs tracking-[1px] text-white uppercase mb-1">
              I BUILD WITH MODERN TOOLS
            </h4>
            <p className="font-sans font-light text-xs text-[#9E9E9E] max-w-[420px] mx-auto lg:mx-0">
              No bloated code. No slow process. Just smart tools and clean results.
            </p>
          </div>

          {/* Right Logo List: Smooth Horizontal scrolling container with snap on Mobile, auto wrap on Tablet, flex on Desktop */}
          <div className="w-full lg:w-auto overflow-x-auto lg:overflow-visible flex items-center justify-start lg:justify-end gap-4 pb-2 snap-x snap-mandatory scrollbar-none scroll-smooth">
            <div className="snap-center shrink-0"><FigmaLogo /></div>
            <div className="snap-center shrink-0"><FramerLogo /></div>
            <div className="snap-center shrink-0"><WebflowLogo /></div>
            <div className="snap-center shrink-0"><SupabaseLogo /></div>
            <div className="snap-center shrink-0"><CursorLogo /></div>
            <div className="snap-center shrink-0"><V0Logo /></div>
            <div className="snap-center shrink-0"><GitHubLogo /></div>
            <div className="snap-center shrink-0"><VercelLogo /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
