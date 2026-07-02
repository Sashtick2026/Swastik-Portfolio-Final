import React, { useState, useEffect } from "react";
import { Menu, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolio } from "../lib/store";

export default function Navbar() {
  const { data } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Triple click detection using ref for synchronous reliability
  const logoClicksRef = React.useRef({ count: 0, lastTime: 0 });

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const now = Date.now();
    const clicks = logoClicksRef.current;
    
    if (now - clicks.lastTime < 800) {
      clicks.count += 1;
      if (clicks.count >= 3) {
        clicks.count = 0;
        // Trigger secret event to show Admin Login Modal
        window.dispatchEvent(new CustomEvent("open-admin-login"));
      }
    } else {
      clicks.count = 1;
    }
    clicks.lastTime = now;

    // Scroll to top on single click
    if (clicks.count === 1) {
      handleScrollTo(e, "#hero");
    }
  };

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Reviews", href: "#reviews" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ease-out px-4 md:px-8 py-4 ${
          scrolled ? "py-3 md:py-4 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)]" : "py-5 md:py-8 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Brand Name */}
          <a
            href="#hero"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group z-50 hover-trigger"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-purple to-accent-glow flex items-center justify-center p-[1px] shadow-[0_0_15px_rgba(123,46,255,0.4)] group-hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-all duration-500 overflow-hidden">
              <div className="w-full h-full bg-bg-dark rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={data.settings.logoUrl} 
                  alt={data.settings.logoText} 
                  className="w-full h-full object-contain p-[2px]"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <span className="font-display font-medium text-sm tracking-[0.25em] text-text-light group-hover:text-accent-glow transition-colors duration-500">
              {data.settings.logoText}
            </span>
          </a>

          {/* Desktop Navigation Pill */}
          <nav
            className={`hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-white/5 backdrop-blur-xl bg-bg-dark/40 shadow-lg transition-all duration-500 ${
              scrolled ? "border-white/10 bg-bg-dark/65" : ""
            }`}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="relative px-5 py-2 rounded-full font-display font-medium text-xs tracking-wider text-text-muted hover:text-text-light hover-trigger transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block z-50">
            <a
              href="#contact"
              onClick={(e) => handleScrollTo(e, "#contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent-purple/20 bg-accent-purple/5 hover:bg-accent-purple/10 text-accent-glow hover:text-text-light text-xs font-display font-semibold tracking-wider hover-trigger transition-all duration-500"
            >
              Start Project
            </a>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full border border-white/5 bg-bg-dark/50 backdrop-blur-md text-text-light hover:text-accent-glow hover-trigger focus:outline-none transition-colors duration-300 z-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer with backdrop blur and slide-in drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md z-30 md:hidden"
            />

            {/* Slide-In Drawer Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 w-[85vw] max-w-[360px] h-screen bg-[#070707]/90 backdrop-blur-2xl border-l border-white/8 z-40 md:hidden flex flex-col justify-between px-8 py-12"
            >
              {/* Background ambient lighting in drawer */}
              <div className="absolute top-[20%] left-[-20px] w-48 h-48 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-[20%] right-[-20px] w-48 h-48 bg-accent-glow/5 rounded-full blur-3xl pointer-events-none" />

              {/* Top empty space to respect header button */}
              <div className="h-12" />

              {/* Menu items links with comfortable, elegant spacing */}
              <nav className="flex flex-col gap-6 text-left w-full mt-4">
                {navLinks.map((link, i) => (
                  <motion.a
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleScrollTo(e, link.href)}
                    className="group flex items-center justify-between font-display font-bold text-2xl tracking-[0.18em] text-text-muted hover:text-text-light hover:text-accent-glow transition-all duration-300 py-2 border-b border-white/5"
                  >
                    <span>{link.label.toUpperCase()}</span>
                    <span className="text-xs text-accent-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300">// {`0${i + 1}`}</span>
                  </motion.a>
                ))}
              </nav>

              {/* Footer interactive Call-to-action button inside drawer */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.15, duration: 0.4 }}
                className="w-full"
              >
                <a
                  href="#contact"
                  onClick={(e) => handleScrollTo(e, "#contact")}
                  className="flex items-center justify-center w-full h-[54px] rounded-full bg-gradient-to-r from-accent-purple to-accent-glow text-text-light font-display font-semibold text-xs tracking-[0.2em] shadow-[0_8px_25px_rgba(123,46,255,0.3)] hover:scale-[1.02] transition-transform duration-300"
                >
                  START PROJECT
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
