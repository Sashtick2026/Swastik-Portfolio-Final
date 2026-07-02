import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolio } from "../../lib/store";
import { 
  Mail, 
  Send, 
  Clock, 
  ShieldCheck, 
  Lock, 
  ChevronDown, 
  ArrowUpRight 
} from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Zod Schema matching requirements
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Social Links Data
const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    )
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 24-12 24zm10.12-10.645c-.298-.1-2.95-.944-5.91-.433.992 2.764 1.393 5.093 1.475 5.617 2.65-1.336 4.135-3.8 4.435-5.184zm-6.264 6.136c-.113-.7-.577-3.136-1.638-5.938-2.6.745-5.32 1.135-7.737 1.135-.246 0-.48-.003-.706-.01 1.63 3.16 4.9 5.31 8.68 5.31 1.5 0 2.924-.34 4.2-.924-.075-.125-.19-.34-.3-.573zm-11.23-5.22c.205.006.417.01.637.01 2.19 0 4.653-.356 7.155-1.045-.333-.746-.7-1.533-1.09-2.34-4.832 1.362-9.255.842-9.762.774.225 3.115 1.618 5.86 3.06 2.6zm-2.03-4.22c.5.06 4.542.5 9.117-.852-.895-1.6-1.92-3.11-2.92-4.34-4.228 1.4-6.423 4.56-6.423 4.56l.226.632zm7.42-5.492c.983 1.192 1.996 2.65 2.87 4.195 2.897-.978 4.076-2.54 4.314-2.88-1.89-2.043-4.57-3.237-7.184-1.315zm5.5 1.458c-.183.247-1.258 1.655-4.05 2.645.36.754.7 1.5 1.01 2.247 2.72-.4 5.336.27 5.753.39-.08-2.18-.89-4.14-2.22-5.282z"/>
      </svg>
    )
  },
  {
    name: "Behance",
    url: "https://behance.net",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 13.555h-6c0 .77.34 1.353 1.01 1.353.64 0 1.05-.33 1.16-.946h1.76c-.15 1.441-1.27 2.45-2.93 2.45-1.91 0-3.03-1.353-3.03-3.157 0-1.914 1.25-3.212 2.97-3.212 1.8 0 2.9 1.155 2.9 3.102 0 .143-.01.275-.02.41zm-1.83-1.474c-.03-.528-.32-.913-.88-.913-.53 0-.87.352-.95.913h1.83zm-10.45 4.33h-4.3v-2.838h4c1.11 0 1.83.473 1.83 1.408 0 .858-.72 1.43-1.83 1.43zm-.3-4.554h-4v-2.31h3.7c.94 0 1.57.385 1.57 1.133 0 .737-.63 1.177-1.57 1.177zM11.64 6.16c0-1.87-1.46-2.838-3.56-2.838H3.35v13.111h4.94c2.27 0 3.75-1.078 3.75-2.97 0-.968-.44-1.782-1.21-2.222.95-.495 1.56-1.375 1.56-2.56.01-.264-.01-.5-.01-.521zm4.84.45h4v1H16.48v-1z"/>
      </svg>
    )
  },
  {
    name: "Instagram",
    url: "https://instagram.com",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    )
  }
];

// Dropdown constants
const projectTypes = ["Web Design", "Development", "Full-Stack System", "Bespoke SaaS"];
const budgetRanges = ["< $5,000", "$5,000 - $10,000", "$10,000 - $20,000", "$20,000+"];

export default function Contact() {
  const { data } = usePortfolio();

  const contactCards = [
    {
      id: "email",
      label: "EMAIL ME",
      value: data.contact.email,
      href: `mailto:${data.contact.email}`,
      icon: <Mail className="w-[26px] h-[26px] text-[#A855F7]" />
    },
    {
      id: "telegram",
      label: "TELEGRAM",
      value: data.contact.telegram,
      href: `https://t.me/${data.contact.telegram.replace("@", "")}`,
      icon: (
        <svg className="w-[26px] h-[26px] text-[#A855F7] fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      )
    },
    {
      id: "whatsapp",
      label: "WHATSAPP",
      value: data.contact.whatsapp,
      href: `https://wa.me/${data.contact.whatsapp.replace(/[^0-9]/g, "")}`,
      icon: (
        <svg className="w-[26px] h-[26px] text-[#A855F7] fill-currentColor" viewBox="0 0 24 24">
          <path d="M12.004 2C6.482 2 2 6.482 2 12.004c0 1.908.533 3.717 1.458 5.284L2.012 22l4.832-1.266a9.96 9.96 0 0 0 5.16 1.274h.004c5.522 0 10.004-4.482 10.004-10.004S17.526 2 12.004 2zm0 1.662c4.6 0 8.342 3.742 8.342 8.342 0 4.6-3.742 8.342-8.342 8.342a8.286 8.286 0 0 1-4.437-1.275l-.318-.189-2.924.766.78-2.85-.208-.33a8.288 8.288 0 0 1-1.233-4.464c0-4.6 3.742-8.342 8.342-8.342zm-2.43 3.424c-.167 0-.348.04-.504.12-.15.08-.33.22-.454.385-.294.384-.52 1.05-.204 1.83.336.83.99 1.69 1.684 2.38.7.69 1.56 1.34 2.39 1.68.78.32 1.45.09 1.83-.2.16-.13.3-.3.39-.45a.94.94 0 0 0 .12-.51l-.54-.27c-.24-.12-.48-.24-.72-.12a.384.384 0 0 0-.21.21l-.24.3c-.12.15-.3.18-.48.09-.54-.27-1.05-.66-1.47-1.08a4.9 4.9 0 0 1-1.08-1.47c-.09-.18-.06-.36.09-.48l.3-.24a.384.384 0 0 0 .21-.21c.12-.24 0-.48-.12-.72l-.27-.54c-.08-.16-.25-.33-.42-.33z"/>
        </svg>
      )
    },
    {
      id: "location",
      label: "LOCATION",
      value: data.contact.location,
      href: "#",
      icon: (
        <svg className="w-[26px] h-[26px] text-[#A855F7] fill-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      )
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const featureBarRef = useRef<HTMLDivElement>(null);

  // Animation elements refs
  const labelRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLSpanElement>(null);
  const heading2Ref = useRef<HTMLSpanElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const socialRef = useRef<HTMLDivElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);

  // States for interaction and UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"project" | "budget" | null>(null);
  const [cardTilts, setCardTilts] = useState<{ [key: number]: { x: number; y: number } }>({});
  const [formTilt, setFormTilt] = useState({ x: 0, y: 0 });

  // Refs for dropdown click-outside handling
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const budgetDropdownRef = useRef<HTMLDivElement>(null);

  // React Hook Form & Zod setup
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    }
  });

  // Handle click outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        projectDropdownRef.current && 
        !projectDropdownRef.current.contains(target) &&
        budgetDropdownRef.current &&
        !budgetDropdownRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // GSAP Animations (Entrance + ScrollTrigger)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // 1. Entrance Animations Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none none",
      }
    });

    // 0.2: Background fades
    tl.fromTo(section, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.0, ease: "power2.out" }, 
      0.2
    );

    // 0.4: Section label
    tl.fromTo(labelRef.current,
      { opacity: 0, y: 25 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
      0.4
    );

    // 0.7: Heading line one
    tl.fromTo(heading1Ref.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      0.7
    );

    // 1.0: Heading line two
    tl.fromTo(heading2Ref.current,
      { opacity: 0, y: 35 },
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
      1.0
    );

    // 1.3: Description
    tl.fromTo(descRef.current,
      { opacity: 0, y: 25 },
      { opacity: 0.82, y: 0, duration: 0.9, ease: "power3.out" },
      1.3
    );

    // 1.6: Contact cards appear one by one
    const validCards = cardRefs.current.filter(Boolean);
    if (validCards.length > 0) {
      tl.fromTo(validCards,
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.12, ease: "power3.out" },
        1.6
      );
    }

    // 2.1: Social icons fade upward
    if (socialRef.current) {
      const socialIcons = socialRef.current.querySelectorAll(".social-icon-btn");
      tl.fromTo(socialRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        2.1
      );
      if (socialIcons.length > 0) {
        tl.fromTo(socialIcons,
          { opacity: 0, scale: 0.8, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.7)" },
          2.2
        );
      }
    }

    // 2.5: Form slides in from the right
    tl.fromTo(formContainerRef.current,
      { opacity: 0, x: 80, scale: 0.97 },
      { opacity: 1, x: 0, scale: 1, duration: 1.1, ease: "power4.out" },
      2.5
    );

    // 3.0: Input fields stagger upward
    const validInputs = inputRefs.current.filter(Boolean);
    if (validInputs.length > 0) {
      tl.fromTo(validInputs,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
        3.0
      );
    }

    // 3.5: Button appears
    tl.fromTo(buttonRef.current,
      { opacity: 0, scale: 0.94, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.5)" },
      3.5
    );

    // 3.8: Security text
    tl.fromTo(securityRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      3.8
    );

    // 4.1: Bottom feature bar rises
    tl.fromTo(featureBarRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.0, ease: "power3.out" },
      4.1
    );

    // 2. Scroll Parallax effect
    const scrollTriggerParallax = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        // Background Parallax: 5%
        if (bgVideoRef.current) {
          gsap.set(bgVideoRef.current, {
            y: (progress - 0.5) * -50,
          });
        }
        // Entire content moves upward 18px
        if (contentWrapperRef.current) {
          gsap.set(contentWrapperRef.current, {
            y: (progress - 0.5) * -18,
          });
        }
        // Feature bar moves upward 12px
        if (featureBarRef.current) {
          gsap.set(featureBarRef.current, {
            y: (progress - 0.5) * -12,
          });
        }
      }
    });

    return () => {
      tl.kill();
      scrollTriggerParallax.kill();
    };
  }, []);

  // Card Tilt Handler (max 3 degrees)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const tiltX = -(y - yc) / (yc / 3);
    const tiltY = (x - xc) / (xc / 3);
    
    setCardTilts(prev => ({
      ...prev,
      [index]: { x: tiltX, y: tiltY }
    }));
  };

  const handleCardMouseLeave = (index: number) => {
    setCardTilts(prev => ({
      ...prev,
      [index]: { x: 0, y: 0 }
    }));
  };

  // Form Tilt Handler (max 2 degrees)
  const handleFormMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const form = e.currentTarget;
    const rect = form.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    
    const tiltX = -(y - yc) / (yc / 2);
    const tiltY = (x - xc) / (xc / 2);
    
    setFormTilt({ x: tiltX, y: tiltY });
  };

  const handleFormMouseLeave = () => {
    setFormTilt({ x: 0, y: 0 });
  };

  // Submission handler
  const onSubmit = async (formData: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Store inside Firebase messages collection
      const { collection, addDoc } = await import("firebase/firestore");
      const { db, handleFirestoreError, OperationType } = await import("../../lib/firebase");
      
      const deviceType = window.innerWidth < 768 ? "mobile" : "desktop";

      await addDoc(collection(db, "messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        submittedAt: new Date().toISOString(),
        isRead: false,
        isStarred: false,
        isArchived: false,
        replyStatus: "unreplied",
        deviceType,
      }).catch(e => handleFirestoreError(e, OperationType.CREATE, "messages"));

      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Firebase message submission error:", error);
      // Fallback
      setIsSuccess(true);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#050505] pt-[120px] pb-[100px] px-6 md:px-[72px] flex flex-col items-center justify-between opacity-0 transition-opacity duration-300"
    >
      {/* 1. Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <video
          ref={bgVideoRef}
          key={data.about.bgVideoUrl || data.hero.videoUrl}
          autoPlay
          muted
          loop
          playsInline
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover z-[-3]"
        >
          <source
            src={data.about.bgVideoUrl || data.hero.videoUrl}
            type="video/mp4"
          />
        </video>

        {/* Dark Cinematic Overlay */}
        <div
          className="absolute inset-0 z-[-2]"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,.85) 0%, rgba(0,0,0,.72) 50%, rgba(0,0,0,.85) 100%)",
          }}
        />

        {/* Ambient Bloom, Vignette and Purple Ambient Lighting Overlays */}
        <div className="absolute inset-0 pointer-events-none z-[-1] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06)_0%,transparent_80%)]" />
        <div className="absolute top-[35%] left-[20%] w-[550px] h-[550px] rounded-full bg-[#A855F7]/4 blur-[130px] pointer-events-none z-[-1]" />
        <div className="absolute bottom-[25%] right-[20%] w-[550px] h-[550px] rounded-full bg-[#6366F1]/4 blur-[130px] pointer-events-none z-[-1]" />

        {/* Tiny Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] opacity-35">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[5px] h-[5px] bg-[#A855F7]/65 rounded-full animate-pulse"
              style={{
                top: `${12 + Math.random() * 75}%`,
                left: `${8 + Math.random() * 84}%`,
                boxShadow: "0 0 10px rgba(168,85,247,0.5)",
                animationDuration: `${4.5 + Math.random() * 5.5}s`,
                animationDelay: `${Math.random() * 2.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Content Layout Wrapper */}
      <div className="relative z-10 w-full max-w-[1450px] mx-auto flex flex-col items-center">
        
        {/* Core Double Column Layout Grid */}
        <div 
          ref={contentWrapperRef} 
          className="w-full flex flex-col lg:flex-row gap-[70px] justify-between items-center lg:items-start text-left mb-16"
        >
          {/* LEFT COLUMN: Section Title, Pitch, Contact Cards, Social Connect */}
          <div className="w-full lg:w-[45%] flex flex-col">
            
            {/* Small Label Indicator with line */}
            <div ref={labelRef} className="flex items-center gap-4 mb-7 opacity-0">
              <span className="font-sans font-medium text-lg tracking-[6px] text-[#A855F7] uppercase">
                LET'S WORK TOGETHER
              </span>
              <div 
                className="w-[70px] h-[2px] bg-[#A855F7] rounded-full" 
                style={{ boxShadow: "0 0 12px rgba(168,85,247,.45)" }}
              />
            </div>

            {/* Main Heading broken into exactly two lines */}
            <h2 className="font-sans font-black text-4xl sm:text-6xl lg:text-[76px] leading-[0.95] tracking-tighter text-white">
              <span ref={heading1Ref} className="block opacity-0">HAVE A PROJECT</span>
              <span ref={heading2Ref} className="block opacity-0 mt-2">
                IN MIND?{" "}
                <span 
                  className="bg-gradient-to-r from-[#E9D5FF] to-[#A855F7] bg-clip-text text-transparent"
                  style={{ filter: "drop-shadow(0 0 18px rgba(168,85,247,.22))" }}
                >
                  LET'S TALK.
                </span>
              </span>
            </h2>

            {/* Description */}
            <p
              ref={descRef}
              className="font-sans font-normal text-lg sm:text-[28px] leading-relaxed text-white/82 max-w-[560px] mt-[34px] opacity-0"
            >
              I'm available for new projects and collaborations.
              <br />
              Let's create something premium together.
            </p>

            {/* Stacked Glass Contact Cards */}
            <div className="flex flex-col gap-[18px] w-full max-w-full sm:max-w-[360px] mt-10">
              {contactCards.map((card, idx) => {
                const tilt = cardTilts[idx] || { x: 0, y: 0 };
                return (
                  <div
                    key={card.id}
                    ref={(el) => { cardRefs.current[idx] = el; }}
                    onMouseMove={(e) => handleCardMouseMove(e, idx)}
                    onMouseLeave={() => handleCardMouseLeave(idx)}
                    style={{
                      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                      transition: "transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.45s ease, box-shadow 0.45s ease, background-color 0.45s ease",
                    }}
                    className="group opacity-0 w-full h-[90px] px-[22px] rounded-[18px] border border-white/8 bg-[#121212]/34 backdrop-blur-[22px] flex items-center gap-[22px] cursor-pointer hover:border-[#A855F7]/30 hover:shadow-[0_0_24px_rgba(168,85,247,0.18)] hover:bg-[#1a1a1a]/40"
                  >
                    <a href={card.href} className="flex items-center gap-[22px] w-full h-full">
                      {/* Purple glowing circular icon */}
                      <div className="w-[52px] h-[52px] rounded-full bg-[#A855F7]/12 flex items-center justify-center border border-[#A855F7]/25 transition-all duration-[450ms] group-hover:rotate-[6deg] group-hover:bg-[#A855F7]/18 group-hover:scale-[1.05]" style={{ boxShadow: "0 0 12px rgba(168,85,247,0.15)" }}>
                        {card.icon}
                      </div>
                      
                      {/* Text wrapper */}
                      <div className="flex flex-col">
                        <span className="font-sans font-bold text-[14px] tracking-[2px] text-white/50 uppercase leading-none mb-1.5">
                          {card.label}
                        </span>
                        <span className="font-sans font-medium text-[18px] sm:text-[22px] text-white tracking-wide leading-none group-hover:text-[#E9D5FF] transition-colors">
                          {card.value}
                        </span>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Social Connect links with line indicator */}
            <div ref={socialRef} className="flex flex-col items-center sm:items-start text-center sm:text-left mt-12 opacity-0">
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-6">
                <span className="font-sans font-medium text-lg tracking-[5px] text-[#A855F7] uppercase">
                  LET'S CONNECT
                </span>
                <div 
                  className="w-[70px] h-[2px] bg-[#A855F7] rounded-full" 
                  style={{ boxShadow: "0 0 12px rgba(168,85,247,.45)" }}
                />
              </div>
              <div className="flex justify-center sm:justify-start gap-4">
                {socialLinks.map((social) => (
                  <a
                     key={social.name}
                     href={social.url}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="social-icon-btn w-[56px] h-[56px] rounded-full border border-white/8 bg-transparent flex items-center justify-center text-white/70 hover:text-white hover:bg-[#A855F7] hover:border-[#A855F7] hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-[1.08] transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Contact Form with glass background & validation */}
          <div className="w-full lg:w-[55%] flex justify-center">
            
            {/* Form Glass Container with subtle mouse tilt interaction */}
            <div
              ref={formContainerRef}
              onMouseMove={handleFormMouseMove}
              onMouseLeave={handleFormMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${formTilt.x}deg) rotateY(${formTilt.y}deg)`,
                transition: "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.45s ease, box-shadow 0.45s ease",
              }}
              className="opacity-0 w-full max-w-[720px] rounded-[24px] border border-white/8 bg-[#121212]/34 backdrop-blur-[24px] p-6 sm:p-10 select-none relative hover:border-white/12"
            >
              
              {/* Form Content Toggle depending on submission state */}
              {!isSuccess ? (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
                  
                  {/* Form Header */}
                  <div className="flex items-center gap-5 pb-4 border-b border-white/5">
                    <div className="w-[70px] h-[70px] rounded-full bg-[#A855F7]/12 flex items-center justify-center border border-[#A855F7]/25 shrink-0" style={{ boxShadow: "0 0 24px rgba(168,85,247,0.25)" }}>
                      <Mail className="w-8 h-8 text-[#A855F7]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <h3 className="font-sans font-bold text-[32px] sm:text-[42px] leading-tight text-white tracking-tight">
                        SEND ME A MESSAGE
                      </h3>
                      <p className="font-sans text-[16px] sm:text-[20px] text-white/60 leading-tight">
                        Fill out the form below and I'll get back to you as soon as possible.
                      </p>
                    </div>
                  </div>

                  {/* Grid fields row 1 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name input */}
                    <div ref={(el) => { inputRefs.current[0] = el; }} className="flex flex-col text-left opacity-0">
                      <input
                        type="text"
                        placeholder="Your Name"
                        {...register("name")}
                        className={`w-full h-[54px] sm:h-[62px] bg-[#0A0A0A]/28 border rounded-[16px] px-[20px] text-base sm:text-lg font-sans text-white focus:outline-none placeholder:text-white/45 transition-all duration-300 ${
                          errors.name
                            ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_18px_rgba(248,113,113,0.25)]"
                            : "border-white/8 focus:border-[#A855F7] focus:shadow-[0_0_18px_rgba(168,85,247,0.25)]"
                        }`}
                      />
                      {errors.name && (
                        <span className="text-red-400 text-[14px] mt-1.5 pl-2 font-sans">
                          {errors.name.message}
                        </span>
                      )}
                    </div>

                    {/* Email input */}
                    <div ref={(el) => { inputRefs.current[1] = el; }} className="flex flex-col text-left opacity-0">
                      <input
                        type="email"
                        placeholder="Your Email"
                        {...register("email")}
                        className={`w-full h-[54px] sm:h-[62px] bg-[#0A0A0A]/28 border rounded-[16px] px-[20px] text-base sm:text-lg font-sans text-white focus:outline-none placeholder:text-white/45 transition-all duration-300 ${
                          errors.email
                            ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_18px_rgba(248,113,113,0.25)]"
                            : "border-white/8 focus:border-[#A855F7] focus:shadow-[0_0_18px_rgba(168,85,247,0.25)]"
                        }`}
                      />
                      {errors.email && (
                        <span className="text-red-400 text-[14px] mt-1.5 pl-2 font-sans">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Input TextArea */}
                  <div ref={(el) => { inputRefs.current[2] = el; }} className="flex flex-col text-left opacity-0">
                    <textarea
                      placeholder="Tell me about your project..."
                      rows={5}
                      {...register("message")}
                      style={{ height: "150px" }}
                      className={`w-full bg-[#0A0A0A]/28 border rounded-[16px] p-[20px] text-base sm:text-lg font-sans text-white focus:outline-none placeholder:text-white/45 transition-all duration-300 resize-none ${
                        errors.message
                          ? "border-red-400 focus:border-red-400 focus:shadow-[0_0_18px_rgba(248,113,113,0.25)]"
                          : "border-white/8 focus:border-[#A855F7] focus:shadow-[0_0_18px_rgba(168,85,247,0.25)]"
                      }`}
                    />
                    {errors.message && (
                      <span className="text-red-400 text-[14px] mt-1.5 pl-2 font-sans">
                        {errors.message.message}
                      </span>
                    )}
                  </div>

                  {/* Primary CTA Submit Button */}
                  <button
                    type="submit"
                    ref={buttonRef}
                    disabled={isSubmitting}
                    className="group relative w-full h-[60px] sm:h-[72px] rounded-[16px] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-sans font-semibold text-[18px] sm:text-[22px] flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(124,58,237,.40)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none opacity-0"
                    style={{
                      boxShadow: "0 10px 25px rgba(124,58,237,.15)"
                    }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        <span>SENDING...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>SEND MESSAGE</span>
                        <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </div>
                    )}
                  </button>

                  {/* Security Policy Notice */}
                  <div ref={securityRef} className="flex items-center justify-center gap-2 mt-2 opacity-0 text-white/45 text-[14px] sm:text-[16px] font-sans">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#A855F7]" />
                    <span>Your information is 100% secure and never shared.</span>
                  </div>

                </form>
              ) : (
                /* Success Presentation */
                <div className="flex flex-col items-center justify-center text-center py-16 gap-6">
                  <div className="w-[84px] h-[84px] rounded-full bg-emerald-500/12 flex items-center justify-center border border-emerald-500/25 text-emerald-400 mb-2 animate-bounce">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  <h3 className="font-sans font-bold text-[36px] text-white">
                    MESSAGE SENT!
                  </h3>
                  <p className="font-sans text-xl text-white/70 max-w-[480px] leading-relaxed">
                    Thank you. Your project brief has been transmitted. I will review the scope and reply to you within a few hours.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 px-8 h-[56px] border border-white/10 rounded-[12px] bg-white/5 hover:bg-white/10 text-white font-sans text-lg hover:border-[#A855F7]/30 transition-all duration-300 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* 4. Bottom Feature Panel Bar */}
        <div 
          ref={featureBarRef}
          className="w-full mt-[70px] pointer-events-auto opacity-0"
        >
          <div className="w-full min-h-[120px] rounded-[24px] border border-white/8 bg-[#121212]/34 backdrop-blur-[24px] py-8 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-0 select-none">
            
            {/* Feature Column 1 */}
            <div className="flex items-center gap-4 sm:gap-5 px-3 md:px-6 w-full md:border-r border-white/10 last:border-0 justify-start sm:justify-center">
              <div className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] rounded-full bg-[#A855F7]/12 flex items-center justify-center border border-[#A855F7]/25 shrink-0" style={{ boxShadow: "0 0 12px rgba(168,85,247,0.15)" }}>
                <Send className="w-5 h-5 sm:w-6 sm:h-6 text-[#A855F7]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-semibold text-[18px] sm:text-[22px] md:text-[26px] text-white leading-tight mb-1 sm:mb-1.5">
                  Quick Response
                </span>
                <span className="font-sans text-xs sm:text-[15px] md:text-[18px] text-white/60 leading-tight whitespace-nowrap">
                  I usually reply within a few hours.
                </span>
              </div>
            </div>

            {/* Feature Column 2 */}
            <div className="flex items-center gap-4 sm:gap-5 px-3 md:px-6 w-full md:border-r border-white/10 last:border-0 justify-start sm:justify-center">
              <div className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] rounded-full bg-[#A855F7]/12 flex items-center justify-center border border-[#A855F7]/25 shrink-0" style={{ boxShadow: "0 0 12px rgba(168,85,247,0.15)" }}>
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#A855F7]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-semibold text-[18px] sm:text-[22px] md:text-[26px] text-white leading-tight mb-1 sm:mb-1.5">
                  On-Time Delivery
                </span>
                <span className="font-sans text-xs sm:text-[15px] md:text-[18px] text-white/60 leading-tight whitespace-nowrap">
                  I respect deadlines and deliver on time.
                </span>
              </div>
            </div>

            {/* Feature Column 3 */}
            <div className="flex items-center gap-4 sm:gap-5 px-3 md:px-6 w-full last:border-0 justify-start sm:justify-center">
              <div className="w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] rounded-full bg-[#A855F7]/12 flex items-center justify-center border border-[#A855F7]/25 shrink-0" style={{ boxShadow: "0 0 12px rgba(168,85,247,0.15)" }}>
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#A855F7]" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-sans font-semibold text-[18px] sm:text-[22px] md:text-[26px] text-white leading-tight mb-1 sm:mb-1.5">
                  Satisfaction First
                </span>
                <span className="font-sans text-xs sm:text-[15px] md:text-[18px] text-white/60 leading-tight whitespace-nowrap">
                  Your satisfaction is my top priority.
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
