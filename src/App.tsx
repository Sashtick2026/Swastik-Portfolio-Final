/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import LenisScroller from "./components/LenisScroller";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/sections/Hero";
import FeaturedWork from "./components/sections/FeaturedWork";
import About from "./components/sections/About";
import Reviews from "./components/sections/Reviews";
import Contact from "./components/sections/Contact";
import ScrollReveal from "./components/ScrollReveal";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  return (
    <div className="relative min-h-screen bg-bg-dark noise-bg selection:bg-accent-purple/30 selection:text-text-light selection:backdrop-filter">
      {/* High-end smooth scrolling & cursor feedback integrations */}
      <LenisScroller />
      <CustomCursor />

      {/* Floating Header Capsule Navigation */}
      <Navbar />

      {/* Futuristic OS Administration Panel / Login Overlay */}
      <AdminPanel />

      {/* Main Sections Stack */}
      <main className="relative z-10">
        <Hero />
        
        <ScrollReveal yOffset={60} duration={0.9}>
          <FeaturedWork />
        </ScrollReveal>

        <ScrollReveal yOffset={60} duration={0.9}>
          <About />
        </ScrollReveal>

        <ScrollReveal yOffset={60} duration={0.9}>
          <Reviews />
        </ScrollReveal>

        <ScrollReveal yOffset={60} duration={0.9}>
          <Contact />
        </ScrollReveal>
      </main>
    </div>
  );
}

