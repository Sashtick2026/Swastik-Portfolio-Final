import React, { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import gsap from "gsap";
import { usePortfolio } from "../../lib/store";
import { 
  ArrowUpRight, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  TrendingUp, 
  DollarSign,
  Activity,
  Layers,
  ShoppingBag,
  Palette,
  CheckCircle,
  Clock,
  Cpu,
  X,
  ExternalLink
} from "lucide-react";

// Types for Project Cards
interface Project {
  id: string;
  category: string;
  title: string;
  logo: string;
  headline: string;
  color: string;
  glowColor: string;
  link?: string;
  description?: string;
}

export default function FeaturedWork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const featureBarRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef<number>(0);

  const [scrollY, setScrollY] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeLivePreviewId, setActiveLivePreviewId] = useState<string | null>(null);
  const [tiltMap, setTiltMap] = useState<Record<string, { x: number; y: number }>>({});

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    containScroll: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(1); // default to second card active
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Track scroll position for subtle parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  // Mouse wheel support for horizontal carousel navigation (throttled)
  useEffect(() => {
    const carouselEl = carouselWrapperRef.current;
    if (!carouselEl || !emblaApi) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > 10) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastWheelTime.current > 500) {
          if (e.deltaX > 0) {
            emblaApi.scrollNext();
          } else {
            emblaApi.scrollPrev();
          }
          lastWheelTime.current = now;
        }
      }
    };

    carouselEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => carouselEl.removeEventListener("wheel", handleWheel);
  }, [emblaApi]);

  // Auto scrolling for Selected Work preview cards
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      if (hoveredCardId === null) {
        emblaApi.scrollNext();
      }
    }, 4000); // automatic scroll every 4 seconds
    return () => clearInterval(interval);
  }, [emblaApi, hoveredCardId]);

  const [hasAnimated, setHasAnimated] = useState(false);

  const runEntranceAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const tl = gsap.timeline();

    // 0.2 Small label fades upward
    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      0.2
    );

    // 0.4 Heading line one
    tl.fromTo(
      headingRef.current?.children[0],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" },
      0.4
    );

    // 0.7 Heading line two
    tl.fromTo(
      headingRef.current?.children[1],
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power4.out" },
      0.7
    );

    // 1.0 Description
    tl.fromTo(
      descRef.current,
      { opacity: 0, y: 25 },
      { opacity: 0.82, y: 0, duration: 1.0, ease: "power3.out" },
      1.0
    );

    // 1.2 CTA button
    tl.fromTo(
      ctaBtnRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      1.2
    );

    // 1.5 Carousel slides upward while fading in
    tl.fromTo(
      carouselWrapperRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" },
      1.5
    );

    // 2.0 Feature bar rises
    tl.fromTo(
      featureBarRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      2.0
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

    // Bulletproof fallback: Run animation after 1.5s to prevent blank page on layout anomalies
    const fallbackTimer = setTimeout(() => {
      runEntranceAnimation();
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [hasAnimated]);

  // Mouse tilt movement handler (Max 5°)
  const handleMouseMove = (projectId: string, e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation: maximum 5 degrees tilt
    const rotateX = ((centerY - y) / centerY) * 5;
    const rotateY = ((x - centerX) / centerX) * -5; // negative to tilt toward cursor

    setTiltMap((prev) => ({
      ...prev,
      [projectId]: { x: rotateX, y: rotateY }
    }));
  };

  const handleMouseLeave = (projectId: string) => {
    setTiltMap((prev) => ({
      ...prev,
      [projectId]: { x: 0, y: 0 }
    }));
    setHoveredCardId(null);
  };

  // Parallax Calculation
  const videoYOffset = scrollY * 0.12; 
  const featureBarYOffset = scrollY * -0.05; // Subtle upward movement relative to page scrolling

  const { data } = usePortfolio();

  // Projects list matching high-fidelity UI from the reference image, filtered for published status
  const projects = data.projects.filter(p => p.status === "published");

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#050505] pt-[120px] pb-[80px] px-6 md:px-[72px] flex flex-col justify-between"
    >
      {/* 1. Background Video with Parallax & Dark Cinematic Overlay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          referrerPolicy="no-referrer"
          style={{
            transform: `translate3d(0, ${videoYOffset}px, 0)`,
          }}
          className="absolute inset-0 w-full h-full object-cover z-[-3]"
        >
          <source
            src={data.about.bgVideoUrl || data.hero.videoUrl}
            type="video/mp4"
          />
        </video>

        {/* Cinematic dark overlay gradient */}
        <div 
          className="absolute inset-0 z-[-2]"
          style={{
            background: `linear-gradient(180deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.72) 40%, rgba(5,5,5,0.92) 100%)`
          }}
        />

        {/* Subtle Vignette & Volumetric glows */}
        <div className="absolute inset-0 pointer-events-none z-[-1] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_75%)]" />
        <div className="absolute top-[20%] right-[10%] w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/4 blur-[130px] pointer-events-none z-[-1]" />
        <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] rounded-full bg-[#A855F7]/3 blur-[120px] pointer-events-none z-[-1]" />

        {/* Tiny Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] opacity-40">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[3px] h-[3px] bg-[#A855F7] rounded-full animate-pulse"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${10 + Math.random() * 80}%`,
                boxShadow: "0 0 8px rgba(168,85,247,0.8)",
                animationDuration: `${3 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Header Container */}
      <div ref={headerRef} className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex-1">
          {/* Small Label with Glowing purple accent line */}
          <div ref={labelRef} className="flex items-center gap-4 mb-7 opacity-0">
            <span className="font-sans font-medium text-lg tracking-[6px] text-[#A855F7] uppercase">
              SELECTED WORK
            </span>
            <div 
              className="h-[2px] w-[70px] bg-[#A855F7]" 
              style={{
                boxShadow: "0 0 10px rgba(168,85,247,0.8)"
              }}
            />
          </div>

          {/* Main Heading */}
          <h2 ref={headingRef} className="font-sans font-black text-4xl sm:text-6xl md:text-[72px] leading-[0.95] tracking-tighter text-white max-w-[760px]">
            <div className="opacity-0">WEBSITES THAT</div>
            <div className="opacity-0 bg-gradient-to-r from-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent text-glow drop-shadow-[0_0_22px_rgba(168,85,247,0.18)]">
              MAKE AN IMPACT.
            </div>
          </h2>

          {/* Description */}
          <p ref={descRef} className="font-sans font-light text-xl sm:text-[30px] leading-[1.4] text-white/82 max-w-[650px] mt-7 opacity-0">
            A collection of websites I've designed and developed for brands that value quality and results.
          </p>
        </div>

        {/* View All Projects Button (Top Right CTA) */}
        <div className="flex justify-start md:justify-end">
          <button
            ref={ctaBtnRef}
            onClick={() => {
              const el = document.querySelector("#work");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center justify-center gap-3 h-[56px] px-[34px] rounded-full border border-[#A855F7] bg-[#121212]/18 backdrop-blur-[20px] text-[#ECECEC] font-sans font-medium text-lg hover:bg-[#A855F7] hover:text-white hover:scale-103 hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all duration-[350ms] ease-out cursor-pointer opacity-0"
          >
            VIEW ALL PROJECTS
            <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>

      {/* 3. Project Carousel */}
      <div 
        ref={carouselWrapperRef}
        className="relative z-10 w-full mt-4 mb-10 overflow-hidden opacity-0"
      >
        <div className="overflow-visible" ref={emblaRef}>
          <div className="flex gap-[26px]">
            {projects.map((project, idx) => {
              const isActive = idx === selectedIndex;
              const isHovered = hoveredCardId === project.id;
              const tilt = tiltMap[project.id] || { x: 0, y: 0 };

              return (
                <div
                  key={project.id}
                  className="flex-shrink-0 relative transition-all duration-700 ease-out w-[82vw] sm:w-[45vw] md:w-[30vw] lg:w-[28vw] xl:w-[18.2vw] min-w-[270px] max-w-[420px]"
                  style={{
                    // Side cards style: Opacity: 70%, Scale: 0.92, slight blur
                    opacity: isActive ? 1.0 : 0.7,
                    transform: `scale(${isActive ? 1.04 : 0.92})`,
                    filter: isActive ? "none" : "blur(1.5px)",
                  }}
                  onMouseEnter={() => setHoveredCardId(project.id)}
                  onMouseLeave={() => handleMouseLeave(project.id)}
                  onMouseMove={(e) => handleMouseMove(project.id, e)}
                >
                  {/* Card Container with Glass Morphism */}
                  <div
                    onClick={() => {
                      if (project.link && activeLivePreviewId !== project.id) {
                        setActiveLivePreviewId(project.id);
                      }
                    }}
                    className={`relative w-full h-[420px] sm:h-[480px] md:h-[560px] rounded-[22px] bg-[#121212]/40 border backdrop-blur-[18px] overflow-hidden cursor-pointer transition-all duration-500 flex flex-col justify-between ${
                      isActive 
                        ? "border-[#A855F7]/55 shadow-[0_0_35px_rgba(168,85,247,0.35)]" 
                        : "border-white/8 hover:border-white/15"
                    } ${isHovered ? "-translate-y-[10px] shadow-[0_15px_45px_rgba(168,85,247,0.25)]" : ""}`}
                    style={{
                      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                      transition: isHovered ? "none" : "transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease, translate 0.5s ease",
                    }}
                  >
                    {/* CARD IMAGE block - High Fidelity Live Website Preview */}
                    <div className="relative h-[310px] sm:h-[350px] md:h-[430px] w-full overflow-hidden rounded-t-[22px] bg-[#0A0A0A] border-b border-white/5 group">
                      {activeLivePreviewId === project.id && project.link ? (
                        <div className="absolute inset-0 bg-[#0c0c0f] flex flex-col z-30">
                          {/* Browser Header Bar */}
                          <div className="h-8 bg-[#16161a] border-b border-white/5 flex items-center px-3 gap-2 justify-between shrink-0 select-none">
                            <div className="flex gap-1 shrink-0">
                              <span className="w-2 h-2 rounded-full bg-red-500/60" />
                              <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                              <span className="w-2 h-2 rounded-full bg-green-500/60" />
                            </div>
                            <div className="flex-1 max-w-[140px] bg-black/40 rounded h-4.5 px-2 flex items-center justify-between text-[8px] text-white/40 font-mono overflow-hidden">
                              <span className="truncate">{project.link}</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {project.link && (
                                <a 
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-white/40 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors flex items-center"
                                  title="Open in new tab"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveLivePreviewId(null);
                                }}
                                className="text-white/40 hover:text-white p-0.5 rounded hover:bg-white/5 transition-colors flex items-center"
                                title="Close Live View"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          {/* Live website Frame */}
                          <div className="flex-1 bg-white relative">
                            <iframe
                              src={project.link}
                              title={`${project.title} Preview`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full border-0"
                            />
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full transition-transform duration-700 ease-out flex flex-col relative bg-white"
                          style={{
                            transform: isHovered ? "scale(1.04)" : "scale(1.0)",
                          }}
                        >
                          {project.link ? (
                            <div className="w-full h-full relative">
                              {/* Live website Frame as default Card Banner */}
                              <iframe
                                src={project.link}
                                title={`${project.title} Preview`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full border-0 pointer-events-none select-none bg-white"
                              />
                              {/* Overlay for aesthetic integration and allowing smooth card dragging/clicking */}
                              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-all duration-300 pointer-events-none" />
                            </div>
                          ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${project.color || "from-purple-500 to-indigo-600"} flex flex-col justify-between p-5 text-left select-none`}>
                              <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                                <span className="font-sans font-black text-xs tracking-wider uppercase text-white">
                                  {project.logo || project.title}
                                </span>
                                <div className="flex gap-1.5 items-center bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                  <span className="font-mono text-[8px] text-white/90 tracking-wider uppercase">{project.category}</span>
                                </div>
                              </div>

                              <div className="my-auto flex flex-col items-start gap-1.5 pt-2">
                                <span className="font-mono text-[8px] text-white/60 tracking-[3px] uppercase">CREATIVE DESIGN</span>
                                <h3 className="font-sans font-black text-lg sm:text-xl leading-tight text-white tracking-tight animate-fade-in">
                                  {project.headline}
                                </h3>
                                <p className="font-sans text-[9px] text-white/70 max-w-[210px] leading-relaxed line-clamp-3">
                                  {project.description || "Fully customized professional digital solution with responsive layouts and fluid transitions."}
                                </p>
                              </div>

                              <div className="flex gap-2 p-2.5 bg-black/40 border border-white/5 rounded-lg items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <Cpu className="w-3 h-3 text-white/80 animate-pulse" />
                                  <span className="font-sans text-[8px] text-white/90 font-semibold uppercase tracking-wider">{project.category} PREVIEW</span>
                                </div>
                                <span className="font-sans text-[8px] text-white/40">2026 EDITION</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Live preview hover activate overlay */}
                      {project.link && activeLivePreviewId !== project.id && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center z-20 gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveLivePreviewId(project.id);
                            }}
                            className="px-4 py-2 rounded-full bg-[#A855F7] hover:bg-[#9333EA] text-white font-sans font-bold text-[10px] tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-[#A855F7]/30 scale-95 group-hover:scale-100 transition-all duration-300 cursor-pointer"
                          >
                            <Cpu className="w-3.5 h-3.5" />
                            INTERACT LIVE
                          </button>
                          {project.link.startsWith("http") && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white font-sans text-[10px] tracking-wider uppercase flex items-center gap-1 transition-colors shadow-lg cursor-pointer"
                              title="Open in new tab"
                            >
                              LAUNCH OUT
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* CARD FOOTER */}
                    <div className="p-4 sm:p-6 flex flex-col justify-center bg-black/20 h-[100px] sm:h-[130px]">
                      {/* Small category label */}
                      <span className="font-sans font-medium text-[10px] sm:text-xs tracking-[2px] text-white/55 uppercase mb-1">
                        {project.category}
                      </span>
                      {/* Project Title & Arrow Row */}
                      <div className="flex justify-between items-center">
                        <h4 className="font-sans font-semibold text-[18px] sm:text-[22px] md:text-[30px] leading-tight text-white tracking-tight">
                          {project.title}
                        </h4>
                        <div 
                          className="w-[32px] h-[32px] sm:w-[42px] sm:h-[42px] rounded-full border border-white/10 flex items-center justify-center text-[#A855F7] transition-all duration-300 shrink-0"
                          style={{
                            transform: isHovered ? "translate(4px, -4px)" : "none",
                            backgroundColor: isHovered ? "#A855F7" : "transparent",
                            color: isHovered ? "#FFFFFF" : "#A855F7"
                          }}
                        >
                          <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Pagination */}
      <div className="relative z-10 w-full flex items-center justify-center gap-6 mt-4 mb-16">
        {/* Left Arrow Button */}
        <button
          onClick={scrollPrev}
          className="w-[58px] h-[58px] rounded-full border border-[#A855F7] bg-transparent text-[#A855F7] flex items-center justify-center hover:bg-[#A855F7] hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Pagination Dots */}
        <div className="flex items-center gap-4">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === selectedIndex 
                  ? "bg-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,0.9)] scale-125" 
                  : "bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={scrollNext}
          className="w-[58px] h-[58px] rounded-full border border-[#A855F7] bg-transparent text-[#A855F7] flex items-center justify-center hover:bg-[#A855F7] hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 cursor-pointer"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* 5. Feature Bar - Large Floating Glass Container */}
      <div 
        ref={featureBarRef}
        style={{
          transform: `translate3d(0, ${featureBarYOffset}px, 0)`,
        }}
        className="relative z-10 w-full max-w-[1400px] mx-auto opacity-0"
      >
        <div className="w-full min-h-[140px] rounded-[24px] border border-white/8 bg-[#121212]/35 backdrop-blur-[26px] overflow-hidden">
          {/* Grid Layout - Responsive: grid on all screen sizes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 h-full divide-y lg:divide-y-0 lg:divide-x divide-white/5">
            {[
              {
                icon: <Sparkles className="w-8 h-8 md:w-9 md:h-9 text-[#A855F7]" />,
                title: "Premium Design",
                desc: "Modern. Clean. Impactful."
              },
              {
                icon: <Smartphone className="w-8 h-8 md:w-9 md:h-9 text-[#A855F7]" />,
                title: "Fast & Responsive",
                desc: "Built for all devices."
              },
              {
                icon: <TrendingUp className="w-8 h-8 md:w-9 md:h-9 text-[#A855F7]" />,
                title: "SEO Friendly",
                desc: "Optimized to rank higher."
              },
              {
                icon: <DollarSign className="w-8 h-8 md:w-9 md:h-9 text-[#A855F7]" />,
                title: "Budget Friendly",
                desc: "Premium quality, fair price."
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-row items-center gap-5 px-6 sm:px-8 py-6 relative"
              >
                {/* Feature Icon */}
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                {/* Text */}
                <div className="flex flex-col text-left">
                  <h4 className="font-sans font-semibold text-lg md:text-[20px] text-white leading-snug">
                    {feature.title}
                  </h4>
                  <p className="font-sans font-light text-sm md:text-base text-[#9E9E9E] mt-1">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
