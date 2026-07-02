import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import gsap from "gsap";
import { usePortfolio } from "../../lib/store";
import { motion, AnimatePresence } from "motion/react";
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Smile, 
  MessageSquare, 
  Heart,
  Send,
  CheckCircle,
  Plus,
  User
} from "lucide-react";

// Reusable Testimonial Card Component
interface TestimonialCardProps {
  review: {
    id: string;
    name: string;
    role: string;
    company: string;
    text: string;
    rating: number;
    avatar: string;
    isFeatured: boolean;
  };
  isActive?: boolean;
  className?: string;
  isDesktop?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ review, isActive, className = "", isDesktop = true }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    // Max 4 degrees tilt as specified
    const tiltX = -(y - yc) / (yc / 4);
    const tiltY = (x - xc) / (xc / 4);
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isDesktop 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translate3d(0, ${isActive ? "-10px" : "0px"}, 0)`
          : undefined,
        transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.45s ease, box-shadow 0.45s ease, background-color 0.45s ease",
      }}
      className={`group w-full lg:w-[380px] min-h-[310px] h-auto p-[28px] rounded-[22px] border bg-[#121212]/36 backdrop-blur-[22px] overflow-hidden flex flex-col justify-between cursor-pointer relative z-10 gap-4 ${
        isActive 
          ? "border-[#A855F7]/50 shadow-[0_0_28px_rgba(168,85,247,0.25)] bg-[#1a1a1a]/40" 
          : "border-white/8 hover:border-[#A855F7]/30 hover:shadow-[0_0_28px_rgba(168,85,247,0.15)] hover:bg-[#1a1a1a]/40"
      } ${className}`}
    >
      {/* Quotation Mark */}
      <div className="flex justify-between items-start">
        <Quote className="w-[42px] h-[42px] text-[#A855F7] opacity-80 group-hover:opacity-100 transition-all duration-300" style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.4))" }} />
      </div>

      {/* Review Text - Clamped to 5 lines */}
      <p className="font-sans font-normal text-[15px] sm:text-[15.5px] leading-relaxed text-white/92 my-auto line-clamp-5">
        {review.text}
      </p>

      {review.reply && (
        <div className="p-3.5 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/20 text-[13px] text-white/90 flex flex-col gap-1 relative overflow-hidden text-left">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#A855F7]" />
          <span className="font-mono text-[9px] font-bold text-[#A855F7] tracking-wider uppercase">Swastik's Reply</span>
          <p className="italic text-white/80 leading-relaxed font-sans text-xs">
            "{review.reply}"
          </p>
        </div>
      )}

      {/* Thin Divider */}
      <div className="w-full h-[1px] bg-white/10" />

      {/* Client Info Footer */}
      <div className="flex items-center justify-between w-full pt-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/60 transition-transform duration-[450ms] group-hover:scale-[1.05] group-hover:border-[#A855F7]/40 group-hover:bg-[#A855F7]/10 group-hover:text-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,0.05)]">
            <User className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-medium text-base sm:text-[16px] text-white tracking-wide leading-tight">
              {review.name}
            </span>
            <span className="font-sans text-[12px] sm:text-[13px] text-white/50 leading-tight truncate max-w-[150px]">
              {review.role}, {review.company}
            </span>
          </div>
        </div>

        {/* Dynamic Filled Stars */}
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-[16px] h-[16px] ${
                i < review.rating 
                  ? "fill-[#A855F7] text-[#A855F7]" 
                  : "text-white/20"
              }`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Energy Sphere Component
const EnergySphereOverlay: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const yOffset = (scrollProgress - 0.5) * -8; // moves upward 8px on scroll

  return (
    <div
      style={{
        transform: `translate3d(-50%, calc(-50% + ${yOffset}px), 0)`,
        boxShadow: "0 0 90px rgba(168,85,247,0.35)",
        mixBlendMode: "screen",
      }}
      className="absolute top-1/2 left-1/2 w-[420px] h-[420px] rounded-full pointer-events-none z-0 opacity-85 overflow-hidden flex items-center justify-center bg-radial from-[#A855F7]/25 via-[#8B5CF6]/10 to-transparent transition-transform duration-100 ease-out"
    >
      {/* Animated Glowing Plasma Fields */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3)_0%,transparent_70%)] animate-pulse" style={{ animationDuration: "3.5s" }} />
      
      {/* Intricate High Tech Rotating Rings */}
      <div className="absolute w-[95%] h-[95%] rounded-full border border-dashed border-[#A855F7]/20 animate-[spin_30s_linear_infinite]" />
      <div className="absolute w-[80%] h-[80%] rounded-full border border-dotted border-[#8B5CF6]/30 animate-[spin_20s_linear_infinite_reverse]" />

      {/* Plasma Core Orbs */}
      <div className="absolute w-[180px] h-[180px] rounded-full bg-gradient-to-tr from-[#A855F7] to-[#E9D5FF] blur-2xl opacity-30 animate-ping" style={{ animationDuration: "5s" }} />
      <div className="absolute w-[240px] h-[240px] rounded-full bg-radial from-[#C084FC]/20 to-transparent blur-xl animate-pulse" style={{ animationDuration: "4s" }} />
    </div>
  );
};

export default function Reviews() {
  const { data, addTestimonial } = usePortfolio();
  const reviewsData = data.testimonials || [];

  const containerRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const cardsGroupRef = useRef<HTMLDivElement>(null);
  
  // Elements for GSAP Entrance Animations
  const labelRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0.5);
  const [isDesktop, setIsDesktop] = useState(true);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formCompany, setFormCompany] = useState("");
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formText, setFormText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Embla Carousel Setup for Swipeable Testimonials on Mobile/Tablet
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: reviewsData.length > 1,
    align: "center",
    skipSnaps: false,
  });

  // Track responsive device width
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update scrollProgress relative to viewport for pixel-perfect parallax
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalDist = rect.height + windowHeight;
      const currentDist = windowHeight - rect.top;
      
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const progress = Math.min(Math.max(currentDist / totalDist, 0), 1);
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync Embla selected slide with activeIndex
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Auto-scrolling reviews to make the section alive (only if we have reviews)
  useEffect(() => {
    if (reviewsData.length <= 1) return;
    const interval = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext();
      } else {
        setActiveIndex((prev) => (prev + 1) % reviewsData.length);
      }
    }, 4500); // automatic scroll every 4.5 seconds
    return () => clearInterval(interval);
  }, [emblaApi, reviewsData.length]);

  // Handle previous/next slide navigation
  const handlePrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    } else {
      setActiveIndex((prev) => (prev - 1 + reviewsData.length) % reviewsData.length);
    }
  };

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
    } else {
      setActiveIndex((prev) => (prev + 1) % reviewsData.length);
    }
  };

  const handleDotClick = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    } else {
      setActiveIndex(index);
    }
  };

  const [hasAnimated, setHasAnimated] = useState(false);

  const runEntranceAnimation = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const tl = gsap.timeline();

    // Background fades
    tl.to(containerRef.current, {
      opacity: 1,
      duration: 1.0,
    }, 0.2);

    // Section label
    tl.fromTo(labelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.4
    );

    // Heading line one
    tl.fromTo(heading1Ref.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      0.7
    );

    // Heading line two
    tl.fromTo(heading2Ref.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      1.0
    );

    // Description
    tl.fromTo(descRef.current,
      { opacity: 0, y: 25 },
      { opacity: 0.82, y: 0, duration: 1.0, ease: "power3.out" },
      1.3
    );

    // Energy sphere glow increases
    if (sphereRef.current) {
      tl.fromTo(sphereRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 0.85, scale: 1, duration: 1.2, ease: "power2.out" },
        1.6
      );
    }

    // Top testimonial cards
    const topCards = containerRef.current?.querySelectorAll(".top-card-element");
    if (topCards && topCards.length > 0) {
      tl.fromTo(topCards,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.2, ease: "power3.out" },
        1.9
      );
    }

    // Pagination
    tl.fromTo(paginationRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      2.7
    );

    // Stats panel rises
    tl.fromTo(statsRef.current,
      { opacity: 0, y: 45 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      3.0
    );
  };

  // GSAP Entrance Animations
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

    const fallbackTimer = setTimeout(() => {
      runEntranceAnimation();
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [hasAnimated]);

  // Form submission handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formName.trim() || !formRole.trim() || !formCompany.trim() || !formText.trim()) {
      setFormError("All fields are required.");
      return;
    }

    if (formText.length < 10) {
      setFormError("Review text must be at least 10 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewId = `rev_${Date.now()}`;
      
      const newReview = {
        id: reviewId,
        name: formName.trim(),
        role: formRole.trim(),
        company: formCompany.trim(),
        text: formText.trim(),
        rating: formRating,
        avatar: "",
        isFeatured: true,
      };

      if (addTestimonial) {
        await addTestimonial(newReview);
      }

      setIsSuccess(true);
      // Clean up fields
      setFormName("");
      setFormRole("");
      setFormCompany("");
      setFormText("");
      setFormRating(5);

      setTimeout(() => {
        setIsSuccess(false);
        setIsFormOpen(false);
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setFormError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parallax offsets mapped to scroll progress
  const bgYOffset = (scrollProgress - 0.5) * -40; // background Parallax 5%
  const groupYOffset = (scrollProgress - 0.5) * -18; // testimonial group moves upward 18px on scroll

  return (
    <section
      id="reviews"
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#050505] pt-[120px] pb-[100px] px-6 md:px-[72px] flex flex-col items-center justify-between opacity-95 transition-opacity duration-300"
    >
      {/* 1. Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <video
          ref={bgVideoRef}
          autoPlay
          muted
          loop
          playsInline
          referrerPolicy="no-referrer"
          style={{
            transform: `translate3d(0, ${bgYOffset}px, 0)`,
          }}
          className="absolute inset-0 w-full h-full object-cover z-[-3]"
        >
          <source
            src="https://res.cloudinary.com/dhs9tptrr/video/upload/v1782707893/Video_Object_Remover-1782651228409_bp3c7o.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark Cinematic Overlay */}
        <div
          className="absolute inset-0 z-[-2]"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,.84) 0%, rgba(0,0,0,.70) 50%, rgba(0,0,0,.84) 100%)`,
          }}
        />

        {/* Soft bloom, subtle vignette and extremely subtle purple fog */}
        <div className="absolute inset-0 pointer-events-none z-[-1] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06)_0%,transparent_80%)]" />
        <div className="absolute top-[40%] left-[25%] w-[600px] h-[600px] rounded-full bg-[#8B5CF6]/4 blur-[160px] pointer-events-none z-[-1]" />
        
        {/* Tiny Floating Particles Field */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] opacity-35">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#A855F7]/80 rounded-full animate-pulse"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${10 + Math.random() * 80}%`,
                boxShadow: "0 0 8px rgba(168,85,247,0.6)",
                animationDuration: `${5 + Math.random() * 5}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Content Layout Wrapper */}
      <div className="relative z-10 w-full max-w-[1450px] mx-auto flex flex-col items-center">
        
        {/* Section Header */}
        <div className="text-center mb-10 flex flex-col items-center pointer-events-auto">
          {/* Small Label */}
          <div ref={labelRef} className="opacity-0 mb-6">
            <span className="font-sans font-medium text-lg tracking-[6px] text-[#A855F7] uppercase">
              CLIENT REVIEWS
            </span>
          </div>

          {/* Main Heading */}
          <h3 className="font-sans font-black text-3xl sm:text-5xl md:text-[74px] leading-[0.95] tracking-tighter text-white max-w-4xl">
            <div ref={heading1Ref} className="opacity-0 mb-1">
              TRUSTED BY{" "}
              <span className="bg-gradient-to-r from-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.22)]">
                CLIENTS.
              </span>
            </div>
            <div ref={heading2Ref} className="opacity-0">
              APPRECIATED FOR{" "}
              <span className="bg-gradient-to-r from-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(168,85,247,0.22)]">
                RESULTS.
              </span>
            </div>
          </h3>

          {/* Description */}
          <p
            ref={descRef}
            className="font-sans font-normal text-lg sm:text-[24px] leading-relaxed text-white/82 max-w-[700px] mt-6 opacity-0"
          >
            Real feedback from real people who trusted me with their ideas and saw real impact.
          </p>

          {/* Top Level Write Review Button */}
          {!isFormOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setIsFormOpen(true)}
              className="mt-6 px-6 py-3 rounded-full border border-[#A855F7]/40 bg-black/40 text-white font-sans font-medium text-sm hover:bg-[#A855F7] hover:border-[#A855F7] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Write a Review
            </motion.button>
          )}
        </div>

        {/* Interactive Glassmorphic Review Form Section */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[700px] mb-12 overflow-hidden relative z-20"
            >
              <div className="p-8 sm:p-10 rounded-[24px] border border-white/10 bg-[#121212]/80 backdrop-blur-[24px] shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-[#A855F7]" />
                    <h4 className="font-sans font-bold text-xl sm:text-2xl text-white">
                      Share Your Experience
                    </h4>
                  </div>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-white/40 hover:text-white transition-colors cursor-pointer text-sm font-sans"
                  >
                    Cancel
                  </button>
                </div>

                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10 text-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/25 text-green-400">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h5 className="font-sans font-bold text-lg text-white">
                      Review Submitted Successfully!
                    </h5>
                    <p className="font-sans text-sm text-white/60 max-w-sm">
                      Thank you for your feedback! Your recommendation has been added directly to the page.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="e.g. Rohit Verma"
                          className="px-4 py-3 rounded-xl border border-white/8 bg-white/4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_12px_rgba(168,85,247,0.1)] transition-all font-sans text-sm"
                        />
                      </div>

                      {/* Role Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Your Role / Title
                        </label>
                        <input
                          type="text"
                          required
                          value={formRole}
                          onChange={(e) => setFormRole(e.target.value)}
                          placeholder="e.g. Founder"
                          className="px-4 py-3 rounded-xl border border-white/8 bg-white/4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_12px_rgba(168,85,247,0.1)] transition-all font-sans text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Company Input */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formCompany}
                          onChange={(e) => setFormCompany(e.target.value)}
                          placeholder="e.g. FitFuel India"
                          className="px-4 py-3 rounded-xl border border-white/8 bg-white/4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_12px_rgba(168,85,247,0.1)] transition-all font-sans text-sm"
                        />
                      </div>

                      {/* Star Rating Selector */}
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-xs font-semibold text-white/60 uppercase tracking-wider">
                          Rating
                        </label>
                        <div className="flex items-center gap-2 h-[46px]">
                          <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setFormRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="cursor-pointer transition-transform hover:scale-125 duration-150"
                              >
                                <Star
                                  className={`w-7 h-7 transition-colors duration-150 ${
                                    star <= (hoverRating || formRating)
                                      ? "fill-[#A855F7] text-[#A855F7] drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                                      : "text-white/20"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <span className="font-sans text-sm font-medium text-white/50 pl-2">
                            {formRating === 5
                              ? "Excellent! ⭐"
                              : formRating === 4
                              ? "Very Good"
                              : formRating === 3
                              ? "Good"
                              : formRating === 2
                              ? "Fair"
                              : "Needs Work"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-sans text-xs font-semibold text-white/60 uppercase tracking-wider">
                        Your Review
                      </label>
                      <textarea
                        required
                        minLength={10}
                        maxLength={300}
                        rows={3}
                        value={formText}
                        onChange={(e) => setFormText(e.target.value)}
                        placeholder="Tell us about Swastik's amazing support, custom design, fast development speed..."
                        className="px-4 py-3 rounded-xl border border-white/8 bg-white/4 text-white placeholder-white/20 focus:outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_12px_rgba(168,85,247,0.1)] transition-all font-sans text-sm resize-none"
                      />
                      <div className="flex justify-end text-[10px] text-white/30 font-mono">
                        {formText.length}/300
                      </div>
                    </div>

                    {formError && (
                      <span className="text-red-400 font-sans text-xs text-center">
                        {formError}
                      </span>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl font-sans font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:shadow-[0_0_24px_rgba(168,85,247,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 text-sm"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Review
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Carousel and Testimonial Grid Space */}
        <div className="relative w-full flex items-center justify-center my-8 min-h-[300px]">
          
          {/* Centered Energy Sphere Overlay */}
          <div ref={sphereRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <EnergySphereOverlay scrollProgress={scrollProgress} />
          </div>

          {reviewsData.length > 0 ? (
            <>
              {/* Left Arrow (Desktop Only) */}
              {reviewsData.length > 3 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-[-20px] xl:left-0 z-30 w-[72px] h-[72px] rounded-full border border-[#A855F7]/40 bg-black/20 backdrop-blur-[12px] flex items-center justify-center text-white cursor-pointer hover:bg-[#A855F7] hover:border-[#A855F7] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.08] transition-all duration-300 hidden lg:flex"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}

              {/* Right Arrow (Desktop Only) */}
              {reviewsData.length > 3 && (
                <button
                  onClick={handleNext}
                  className="absolute right-[-20px] xl:right-0 z-30 w-[72px] h-[72px] rounded-full border border-[#A855F7]/40 bg-black/20 backdrop-blur-[12px] flex items-center justify-center text-white cursor-pointer hover:bg-[#A855F7] hover:border-[#A855F7] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.08] transition-all duration-300 hidden lg:flex"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}

              {/* Core Grid and Card Container */}
              <div
                ref={cardsGroupRef}
                style={{
                  transform: `translate3d(0, ${groupYOffset}px, 0)`,
                  transition: "transform 0.15s ease-out",
                }}
                className="w-full max-w-[1240px] px-2 relative z-10"
              >
                {/* 1. DESKTOP DYNAMIC GRID LAYOUT (lg & up) */}
                <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[34px] relative py-10 z-10 justify-items-center">
                  {reviewsData.map((review, idx) => (
                    <div key={review.id} className="top-card-element">
                      <TestimonialCard 
                        review={review} 
                        isActive={activeIndex === idx} 
                        isDesktop={isDesktop}
                      />
                    </div>
                  ))}
                </div>

                {/* 2. TABLET GRID LAYOUT (md to lg) */}
                <div className="hidden md:flex lg:hidden flex-col gap-10 items-center justify-center py-6 z-10 relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[820px] relative z-10 justify-items-center">
                    {reviewsData.map((review, idx) => (
                      <TestimonialCard 
                        key={review.id}
                        review={review} 
                        isActive={activeIndex === idx} 
                        isDesktop={false} 
                      />
                    ))}
                  </div>
                </div>

                {/* 3. MOBILE SWIPEABLE SWIPER (below md) - Embla Carousel */}
                <div className="md:hidden overflow-hidden w-full px-2 py-4" ref={emblaRef}>
                  <div className="flex gap-4">
                    {reviewsData.map((review, rIdx) => (
                      <div key={review.id} className="flex-shrink-0 w-[85vw] max-w-[390px]">
                        <TestimonialCard 
                          review={review} 
                          isActive={activeIndex === rIdx} 
                          isDesktop={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          ) : (
            /* Beautiful empty state if no client reviews exist */
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-xl mx-auto z-10 relative">
              <div className="w-16 h-16 rounded-full bg-[#A855F7]/10 flex items-center justify-center border border-[#A855F7]/25 mb-6 text-[#A855F7] animate-bounce">
                <Smile className="w-8 h-8" />
              </div>
              <h4 className="font-sans font-bold text-2xl text-white mb-2">No Reviews Yet</h4>
              <p className="font-sans text-white/60 text-base mb-8">
                Be the first to share your experience working with Swastik! Your review will appear directly on this section instantly.
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-8 py-4 rounded-full font-sans font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:shadow-[0_0_24px_rgba(168,85,247,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer text-sm"
              >
                Write the First Review
              </button>
            </div>
          )}
        </div>

        {/* Dots Pagination Indicator Below (Only if we have reviews) */}
        {reviewsData.length > 1 && (
          <div 
            ref={paginationRef}
            className="flex items-center justify-center gap-[18px] mt-8 mb-16 opacity-100"
          >
            {reviewsData.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => handleDotClick(dotIdx)}
                className={`h-[10px] rounded-full transition-all duration-300 cursor-pointer ${
                  activeIndex === dotIdx 
                    ? "w-[24px] bg-[#A855F7] shadow-[0_0_12px_#A855F7]" 
                    : "w-[10px] bg-white/20 hover:bg-white/45 border border-white/5"
                }`}
              />
            ))}
          </div>
        )}

        {/* 4. Bottom Stats Bar */}
        <div 
          ref={statsRef}
          className="w-full max-w-[1450px] opacity-100 pointer-events-auto mt-6"
        >
          <div className="w-full min-h-[120px] rounded-[24px] border border-white/8 bg-[#121212]/34 backdrop-blur-[24px] py-8 px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-2 select-none">
            
            {/* Stat Item 1 */}
            <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 w-full lg:border-r border-white/10 last:border-0 justify-center">
              <Smile className="w-8 h-8 md:w-10 md:h-10 text-[#A855F7] flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-sans font-bold text-2xl sm:text-[38px] lg:text-[44px] xl:text-[48px] text-[#A855F7] leading-none mb-1">
                  50+
                </span>
                <span className="font-sans font-medium text-[10px] sm:text-[14px] lg:text-[16px] xl:text-[18px] text-white/90 whitespace-nowrap leading-none">
                  Happy Clients
                </span>
              </div>
            </div>

            {/* Stat Item 2 */}
            <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 w-full lg:border-r border-white/10 last:border-0 justify-center">
              <Star className="w-8 h-8 md:w-10 md:h-10 text-[#A855F7] flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-sans font-bold text-2xl sm:text-[38px] lg:text-[44px] xl:text-[48px] text-[#A855F7] leading-none mb-1">
                  100+
                </span>
                <span className="font-sans font-medium text-[10px] sm:text-[14px] lg:text-[16px] xl:text-[18px] text-white/90 whitespace-nowrap leading-none">
                  Projects Completed
                </span>
              </div>
            </div>

            {/* Stat Item 3 */}
            <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 w-full lg:border-r border-white/10 last:border-0 justify-center">
              <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-[#A855F7] flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-sans font-bold text-2xl sm:text-[38px] lg:text-[44px] xl:text-[48px] text-[#A855F7] leading-none mb-1">
                  4.9/5
                </span>
                <span className="font-sans font-medium text-[10px] sm:text-[14px] lg:text-[16px] xl:text-[18px] text-white/90 whitespace-nowrap leading-none">
                  Average Rating
                </span>
              </div>
            </div>

            {/* Stat Item 4 */}
            <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-6 w-full last:border-0 justify-center">
              <Heart className="w-8 h-8 md:w-10 md:h-10 text-[#A855F7] flex-shrink-0" />
              <div className="flex flex-col text-left">
                <span className="font-sans font-bold text-2xl sm:text-[38px] lg:text-[44px] xl:text-[48px] text-[#A855F7] leading-none mb-1">
                  100%
                </span>
                <span className="font-sans font-medium text-[10px] sm:text-[14px] lg:text-[16px] xl:text-[18px] text-white/90 whitespace-nowrap leading-none">
                  Client Satisfaction
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
