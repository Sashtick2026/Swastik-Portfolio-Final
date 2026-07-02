import { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc, deleteDoc, collection, getDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType, auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

export interface Project {
  id: string;
  category: "personal" | "portfolio" | "e-commerce" | "business" | "others" | string;
  title: string;
  logo: string;
  headline: string;
  color: string;
  glowColor: string;
  status: "published" | "draft";
  isFeatured: boolean;
  link?: string;
  description?: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  avatar: string;
  isFeatured: boolean;
  reply?: string;
}

export interface HeroData {
  eyebrow: string;
  headlineLine1: string;
  headlineLine1Accent: string;
  headlineLine2: string;
  headlineLine2Accent: string;
  description: string;
  btn1Text: string;
  btn2Text: string;
  videoUrl: string;
}

export interface AboutData {
  name: string;
  age: string;
  from: string;
  experience: string;
  availability: string;
  specialization: string;
  headline1: string;
  headline2: string;
  description: string;
  bgVideoUrl: string;
  holoVideoUrl: string;
}

export interface ContactData {
  email: string;
  telegram: string;
  whatsapp: string;
  location: string;
}

export interface SiteSettings {
  siteName: string;
  logoText: string;
  logoUrl: string;
  accentColor: string;
  seoDescription: string;
  customCode: string;
}

export interface VersionHistoryItem {
  id: string;
  timestamp: string;
  description: string;
  data: string; // serialized snapshot
}

export interface PortfolioData {
  hero: HeroData;
  about: AboutData;
  projects: Project[];
  testimonials: Review[];
  contact: ContactData;
  settings: SiteSettings;
}

// Default initial seed data matching the finished public UI
const INITIAL_DATA: PortfolioData = {
  hero: {
    eyebrow: "FREELANCE WEB DESIGNER & DEVELOPER",
    headlineLine1: "LOOK",
    headlineLine1Accent: "PREMIUM",
    headlineLine2: "SPEND",
    headlineLine2Accent: "SMART",
    description: "Custom websites crafted to elevate your brand—not your expenses.",
    btn1Text: "VIEW MY WORK",
    btn2Text: "START A PROJECT",
    videoUrl: "https://res.cloudinary.com/dhs9tptrr/video/upload/v1782668610/Basic_Model-1782633469000_qliqqd.mp4",
  },
  about: {
    name: "Swastik",
    age: "18",
    from: "Bangladesh",
    experience: "Gaining",
    availability: "Open for Projects",
    specialization: "Web Design, Web Development, Vibe Coding",
    headline1: "DESIGNING EXPERIENCES.",
    headline2: "DELIVERING RESULTS.",
    description: "I help businesses stand out online with premium websites built using modern tools, smart workflows, and AI-powered vibe coding. Quality work, practical budgets, and on-time delivery — that's my promise.",
    bgVideoUrl: "https://res.cloudinary.com/dhs9tptrr/video/upload/v1782670771/Basic_Model-1782652074000_lmrljd.mp4",
    holoVideoUrl: "https://res.cloudinary.com/dhs9tptrr/video/upload/v1782670930/Basic_Model-1782628786000_dlrz0l.mp4",
  },
  projects: [
    {
      id: "love-you-sraya",
      category: "personal",
      title: "Love You Sraya",
      logo: "SRAYA",
      headline: "A tribute of love.",
      color: "from-rose-500 to-pink-600",
      glowColor: "rgba(244,63,94,0.4)",
      status: "published",
      isFeatured: true,
      link: "https://love-you-sraya.vercel.app",
      description: "A beautifully animated romantic tribute landing page expressing unconditional love and affection with deep cinematic feelings."
    },
    {
      id: "love-you-godhuli",
      category: "personal",
      title: "Love You Godhuli",
      logo: "GODHULI",
      headline: "Eternal evening skies.",
      color: "from-amber-500 to-orange-600",
      glowColor: "rgba(245,158,11,0.4)",
      status: "published",
      isFeatured: true,
      link: "https://love-you-godhuli.vercel.app",
      description: "A golden hour themed digital space dedicated to cherish beautiful moments, sunset vibes, and lifelong promises."
    },
    {
      id: "rong-heritage",
      category: "portfolio",
      title: "Rong Heritage",
      logo: "RONG",
      headline: "Celebrating colors of our roots.",
      color: "from-red-600 to-amber-600",
      glowColor: "rgba(220,38,38,0.4)",
      status: "published",
      isFeatured: true,
      link: "https://rongheritage.vercel.app",
      description: "An immersive cultural heritage web experience showcasing traditional art, color dyes, and rich historical legacies."
    }
  ],
  testimonials: [],
  contact: {
    email: "hello@swastik.design",
    telegram: "@swastik_design",
    whatsapp: "+91 12345 67890",
    location: "Bangladesh",
  },
  settings: {
    siteName: "SWASTIK PORTFOLIO",
    logoText: "SWASTIK",
    logoUrl: "https://res.cloudinary.com/dhs9tptrr/image/upload/v1782799976/file_00000000cdbc720bbdcb331b29594cf2_iv9mwj.png",
    accentColor: "#A855F7",
    seoDescription: "Swastik's Premium Portfolio Website - Web Designer & Developer",
    customCode: "",
  },
};

// Global subscription list for reactive changes
const listeners: (() => void)[] = [];

// Load state with fallback
let currentState: PortfolioData = JSON.parse(JSON.stringify(INITIAL_DATA));
let publishedState: PortfolioData = JSON.parse(JSON.stringify(INITIAL_DATA));

// Attempt to load initial cache from localStorage for instant display before Firebase loads
try {
  const cachedDraft = localStorage.getItem("swastik_portfolio_draft");
  if (cachedDraft) {
    currentState = JSON.parse(cachedDraft);
  }
  const cachedPub = localStorage.getItem("swastik_portfolio_published");
  if (cachedPub) {
    publishedState = JSON.parse(cachedPub);
  }
} catch (e) {
  console.error("Failed to load cached local storage data", e);
}

// Session/Auth State
let adminSession: boolean = (() => {
  try {
    const saved = sessionStorage.getItem("swastik_admin_session");
    return saved === "true";
  } catch {
    return false;
  }
})();

// Failed attempts tracking
let loginFailAttempts = (() => {
  try {
    const saved = localStorage.getItem("swastik_login_fails");
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
})();

let loginLockUntil = (() => {
  try {
    const saved = localStorage.getItem("swastik_login_lock_until");
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
})();

// Version history list
let versionHistory: VersionHistoryItem[] = (() => {
  try {
    const saved = localStorage.getItem("swastik_version_history");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load version history", e);
  }
  return [
    {
      id: "init",
      timestamp: new Date().toLocaleString(),
      description: "Initial Release (Original Design)",
      data: JSON.stringify(INITIAL_DATA),
    },
  ];
})();

function notify() {
  listeners.forEach((listener) => listener());
}

// Set up dynamic Firestore real-time synchronization
function setupFirestoreSync() {
  try {
    // 1. Hero
    onSnapshot(doc(db, "hero", "draft"), (snap) => {
      if (snap.exists()) {
        currentState.hero = snap.data() as HeroData;
        localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "hero", "draft"), INITIAL_DATA.hero)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "hero/draft"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "hero/draft");
    });
    
    onSnapshot(doc(db, "hero", "published"), (snap) => {
      if (snap.exists()) {
        publishedState.hero = snap.data() as HeroData;
        localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "hero", "published"), INITIAL_DATA.hero)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "hero/published"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "hero/published");
    });

    // 2. About
    onSnapshot(doc(db, "about", "draft"), (snap) => {
      if (snap.exists()) {
        currentState.about = snap.data() as AboutData;
        localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "about", "draft"), INITIAL_DATA.about)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "about/draft"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "about/draft");
    });
    
    onSnapshot(doc(db, "about", "published"), (snap) => {
      if (snap.exists()) {
        publishedState.about = snap.data() as AboutData;
        localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "about", "published"), INITIAL_DATA.about)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "about/published"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "about/published");
    });

    // 3. Contact
    onSnapshot(doc(db, "contact", "draft"), (snap) => {
      if (snap.exists()) {
        currentState.contact = snap.data() as ContactData;
        localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "contact", "draft"), INITIAL_DATA.contact)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "contact/draft"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "contact/draft");
    });
    
    onSnapshot(doc(db, "contact", "published"), (snap) => {
      if (snap.exists()) {
        publishedState.contact = snap.data() as ContactData;
        localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "contact", "published"), INITIAL_DATA.contact)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "contact/published"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "contact/published");
    });

    // 4. Settings
    onSnapshot(doc(db, "settings", "draft"), (snap) => {
      if (snap.exists()) {
        currentState.settings = snap.data() as SiteSettings;
        localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "settings", "draft"), INITIAL_DATA.settings)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "settings/draft"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "settings/draft");
    });
    
    onSnapshot(doc(db, "settings", "published"), (snap) => {
      if (snap.exists()) {
        publishedState.settings = snap.data() as SiteSettings;
        localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));
        notify();
      } else if (adminSession) {
        setDoc(doc(db, "settings", "published"), INITIAL_DATA.settings)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, "settings/published"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "settings/published");
    });

    // 5. Projects Collection
    onSnapshot(collection(db, "projects"), (snap) => {
      const projects: Project[] = [];
      snap.forEach((doc) => {
        projects.push({ id: doc.id, ...doc.data() } as Project);
      });
      
      currentState.projects = projects;
      publishedState.projects = projects.filter(p => p.status === "published");
      localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
      localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));

      if (projects.length === 0 && adminSession && !localStorage.getItem("swastik_projects_initialized")) {
        INITIAL_DATA.projects.forEach((p) => {
          setDoc(doc(db, "projects", p.id), p)
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `projects/${p.id}`));
        });
        localStorage.setItem("swastik_projects_initialized", "true");
      } else if (projects.length > 0) {
        localStorage.setItem("swastik_projects_initialized", "true");
      }
      notify();
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "projects");
    });

    // 6. Testimonials Collection
    onSnapshot(collection(db, "testimonials"), (snap) => {
      const reviews: Review[] = [];
      snap.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() } as Review);
      });

      // Clear any existing testimonials once to start fresh as requested
      if (reviews.length > 0 && !localStorage.getItem("swastik_all_reviews_cleared_v2")) {
        localStorage.setItem("swastik_all_reviews_cleared_v2", "true");
        reviews.forEach((r) => {
          deleteDoc(doc(db, "testimonials", r.id))
            .catch(e => handleFirestoreError(e, OperationType.DELETE, `testimonials/${r.id}`));
        });
        currentState.testimonials = [];
        publishedState.testimonials = [];
        localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
        localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));
        notify();
        return;
      }

      currentState.testimonials = reviews;
      publishedState.testimonials = reviews;
      localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
      localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));

      if (reviews.length === 0 && adminSession && !localStorage.getItem("swastik_testimonials_initialized")) {
        INITIAL_DATA.testimonials.forEach((t) => {
          setDoc(doc(db, "testimonials", t.id), t)
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `testimonials/${t.id}`));
        });
        localStorage.setItem("swastik_testimonials_initialized", "true");
      } else if (reviews.length > 0) {
        localStorage.setItem("swastik_testimonials_initialized", "true");
      }
      notify();
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "testimonials");
    });

    // 7. Navigation Collection
    onSnapshot(doc(db, "navigation", "published"), (snap) => {
      if (!snap.exists() && adminSession) {
        setDoc(doc(db, "navigation", "published"), {
          links: [
            { label: "Home", href: "#hero" },
            { label: "Work", href: "#work" },
            { label: "About", href: "#about" },
            { label: "Reviews", href: "#reviews" },
            { label: "Contact", href: "#contact" },
          ]
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, "navigation/published"));
        
        setDoc(doc(db, "navigation", "draft"), {
          links: [
            { label: "Home", href: "#hero" },
            { label: "Work", href: "#work" },
            { label: "About", href: "#about" },
            { label: "Reviews", href: "#reviews" },
            { label: "Contact", href: "#contact" },
          ]
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, "navigation/draft"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "navigation/published");
    });

    // 8. SocialLinks Collection
    onSnapshot(doc(db, "socialLinks", "published"), (snap) => {
      if (!snap.exists() && adminSession) {
        setDoc(doc(db, "socialLinks", "published"), {
          links: [
            { name: "LinkedIn", url: "https://linkedin.com" },
            { name: "Dribbble", url: "https://dribbble.com" },
            { name: "Behance", url: "https://behance.net" },
            { name: "Instagram", url: "https://instagram.com" },
          ]
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, "socialLinks/published"));
        
        setDoc(doc(db, "socialLinks", "draft"), {
          links: [
            { name: "LinkedIn", url: "https://linkedin.com" },
            { name: "Dribbble", url: "https://dribbble.com" },
            { name: "Behance", url: "https://behance.net" },
            { name: "Instagram", url: "https://instagram.com" },
          ]
        }).catch(e => handleFirestoreError(e, OperationType.WRITE, "socialLinks/draft"));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "socialLinks/published");
    });

    // No on-boot admin document registration. Handled securely on login or by Auth state.
  } catch (error) {
    console.error("Firebase syncing failed", error);
  }
}

setupFirestoreSync();

// Listen to auth state changes from Firebase Auth to dynamically sync login status
onAuthStateChanged(auth, (user) => {
  const allowedAdmins = ["swastik6024@gmail.com", "sashtick26@gmail.com"];
  if (user && user.email && allowedAdmins.includes(user.email.toLowerCase())) {
    adminSession = true;
    try {
      sessionStorage.setItem("swastik_admin_session", "true");
    } catch (e) {
      console.warn("Session storage not available:", e);
    }
  } else {
    adminSession = false;
    try {
      sessionStorage.removeItem("swastik_admin_session");
    } catch (e) {
      console.warn("Session storage not available:", e);
    }
  }
  notify();
});

export const portfolioStore = {
  // Get active live website data (reads from published state, fallback to draft)
  getData(): PortfolioData {
    return publishedState;
  },

  // Get current raw draft content for editing in the Admin Panel
  getDraftData(): PortfolioData {
    return currentState;
  },

  // Update specific draft section
  async updateDraft<K extends keyof PortfolioData>(section: K, data: PortfolioData[K]) {
    const oldData = currentState[section];
    currentState[section] = data;
    localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
    
    // Save to Firestore draft
    if (section === "hero" || section === "about" || section === "contact" || section === "settings") {
      await setDoc(doc(db, section, "draft"), data)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, `${section}/draft`));
    } else if (section === "projects") {
      const projectsList = data as Project[];
      const oldProjects = oldData as Project[];
      if (oldProjects && Array.isArray(oldProjects)) {
        await Promise.all(oldProjects.map(async (p) => {
          if (!projectsList.some(np => np.id === p.id)) {
            await deleteDoc(doc(db, "projects", p.id))
              .catch(e => handleFirestoreError(e, OperationType.DELETE, `projects/${p.id}`));
          }
        }));
      }
      await Promise.all(projectsList.map(async (p) => {
        await setDoc(doc(db, "projects", p.id), p)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `projects/${p.id}`));
      }));
    } else if (section === "testimonials") {
      const testimonialsList = data as Review[];
      const oldTestimonials = oldData as Review[];
      if (oldTestimonials && Array.isArray(oldTestimonials)) {
        await Promise.all(oldTestimonials.map(async (t) => {
          if (!testimonialsList.some(nt => nt.id === t.id)) {
            await deleteDoc(doc(db, "testimonials", t.id))
              .catch(e => handleFirestoreError(e, OperationType.DELETE, `testimonials/${t.id}`));
          }
        }));
      }
      await Promise.all(testimonialsList.map(async (t) => {
        await setDoc(doc(db, "testimonials", t.id), t)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, `testimonials/${t.id}`));
      }));
    }

    notify();
  },

  // Reset draft to matching published state
  async discardChanges() {
    currentState = JSON.parse(JSON.stringify(publishedState));
    localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
    
    // Sync draft back to Firebase draft
    await Promise.all([
      setDoc(doc(db, "hero", "draft"), currentState.hero)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "hero/draft")),
      setDoc(doc(db, "about", "draft"), currentState.about)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "about/draft")),
      setDoc(doc(db, "contact", "draft"), currentState.contact)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "contact/draft")),
      setDoc(doc(db, "settings", "draft"), currentState.settings)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "settings/draft")),
    ]);
    
    notify();
  },

  // Reset entire system to original template state
  async resetToDefault() {
    const oldProjects = [...currentState.projects];
    const oldTestimonials = [...currentState.testimonials];

    currentState = JSON.parse(JSON.stringify(INITIAL_DATA));
    publishedState = JSON.parse(JSON.stringify(INITIAL_DATA));
    localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
    localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));
    
    // Write back to Firebase
    await Promise.all([
      setDoc(doc(db, "hero", "draft"), INITIAL_DATA.hero)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "hero/draft")),
      setDoc(doc(db, "hero", "published"), INITIAL_DATA.hero)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "hero/published")),
      setDoc(doc(db, "about", "draft"), INITIAL_DATA.about)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "about/draft")),
      setDoc(doc(db, "about", "published"), INITIAL_DATA.about)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "about/published")),
      setDoc(doc(db, "contact", "draft"), INITIAL_DATA.contact)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "contact/draft")),
      setDoc(doc(db, "contact", "published"), INITIAL_DATA.contact)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "contact/published")),
      setDoc(doc(db, "settings", "draft"), INITIAL_DATA.settings)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "settings/draft")),
      setDoc(doc(db, "settings", "published"), INITIAL_DATA.settings)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "settings/published")),
    ]);

    // Delete existing projects/testimonials and write default
    await Promise.all([
      ...oldProjects.map(p => deleteDoc(doc(db, "projects", p.id))
        .catch(e => handleFirestoreError(e, OperationType.DELETE, `projects/${p.id}`))),
      ...INITIAL_DATA.projects.map(p => setDoc(doc(db, "projects", p.id), p)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, `projects/${p.id}`))),
      ...oldTestimonials.map(t => deleteDoc(doc(db, "testimonials", t.id))
        .catch(e => handleFirestoreError(e, OperationType.DELETE, `testimonials/${t.id}`))),
      ...INITIAL_DATA.testimonials.map(t => setDoc(doc(db, "testimonials", t.id), t)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, `testimonials/${t.id}`)))
    ]);

    // Reset localstorage init flags to allow clean state
    localStorage.setItem("swastik_projects_initialized", "true");
    localStorage.setItem("swastik_testimonials_initialized", "true");

    portfolioStore.addHistoryVersion("Reset to Factory Default");
    notify();
  },

  // Publish active draft changes to live site
  async publishChanges() {
    publishedState = JSON.parse(JSON.stringify(currentState));
    localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));
    
    // Publish sections to Firestore
    await Promise.all([
      setDoc(doc(db, "hero", "published"), currentState.hero)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "hero/published")),
      setDoc(doc(db, "about", "published"), currentState.about)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "about/published")),
      setDoc(doc(db, "contact", "published"), currentState.contact)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "contact/published")),
      setDoc(doc(db, "settings", "published"), currentState.settings)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, "settings/published")),
    ]);

    // Publish project states
    await Promise.all(currentState.projects.map(async (p) => {
      await setDoc(doc(db, "projects", p.id), p)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, `projects/${p.id}`));
    }));

    // Publish testimonials
    await Promise.all(currentState.testimonials.map(async (t) => {
      await setDoc(doc(db, "testimonials", t.id), t)
        .catch(e => handleFirestoreError(e, OperationType.WRITE, `testimonials/${t.id}`));
    }));

    portfolioStore.addHistoryVersion(`Published Website Content`);
    notify();
  },

  // Save a new client testimonial directly to the collection
  async addTestimonial(review: Review) {
    // Optimistically update local states
    if (!currentState.testimonials.some(t => t.id === review.id)) {
      currentState.testimonials = [...currentState.testimonials, review];
    }
    if (!publishedState.testimonials.some(t => t.id === review.id)) {
      publishedState.testimonials = [...publishedState.testimonials, review];
    }
    localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
    localStorage.setItem("swastik_portfolio_published", JSON.stringify(publishedState));

    // Save directly to Firestore collection
    await setDoc(doc(db, "testimonials", review.id), review)
      .catch(e => handleFirestoreError(e, OperationType.WRITE, `testimonials/${review.id}`));
    notify();
  },

  // Add history item
  addHistoryVersion(description: string) {
    const newItem: VersionHistoryItem = {
      id: "ver_" + Date.now(),
      timestamp: new Date().toLocaleString(),
      description,
      data: JSON.stringify(currentState),
    };
    versionHistory = [newItem, ...versionHistory].slice(0, 15); // keep max 15
    localStorage.setItem("swastik_version_history", JSON.stringify(versionHistory));
    notify();
  },

  // Restore previous version
  restoreVersion(versionId: string) {
    const item = versionHistory.find((v) => v.id === versionId);
    if (item) {
      currentState = JSON.parse(item.data);
      localStorage.setItem("swastik_portfolio_draft", JSON.stringify(currentState));
      // auto publish restored version as draft
      notify();
      return true;
    }
    return false;
  },

  getVersionHistory(): VersionHistoryItem[] {
    return versionHistory;
  },

  // AUTH LOGIC
  isLoggedIn(): boolean {
    return adminSession;
  },

  async login(adminId: string, pass: string): Promise<{ success: boolean; message: string }> {
    const now = Date.now();
    if (loginLockUntil > now) {
      const minutesLeft = Math.ceil((loginLockUntil - now) / 60000);
      return {
        success: false,
        message: `Admin Panel locked. Please try again in ${minutesLeft} minute(s).`,
      };
    }

    const emailLower = adminId.toLowerCase();
    const adminIdClean = emailLower.replace(/[^a-zA-Z0-9]/g, "_");
    
    let validAdmin = false;
    let validPass = "";

    try {
      // First try cleaned key (e.g. sashtick26_gmail_com)
      let adminDocRef = doc(db, "admins", adminIdClean);
      let adminSnap = await getDoc(adminDocRef);
      
      // If not found, try the direct email address as key
      if (!adminSnap.exists()) {
        adminDocRef = doc(db, "admins", emailLower);
        adminSnap = await getDoc(adminDocRef);
      }

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        if (adminData && adminData.email.toLowerCase() === emailLower && adminData.password === pass && adminData.role === "admin") {
          validAdmin = true;
          validPass = adminData.password;
        }
      }
    } catch (err) {
      console.error("Firestore admin lookup failed", err);
    }

    if (validAdmin) {
      try {
        // Authenticate with Firebase Auth
        await signInWithEmailAndPassword(auth, emailLower, validPass);
      } catch (signInErr: any) {
        // If user doesn't exist or is not found in Firebase Auth, automatically register them!
        if (
          signInErr.code === "auth/user-not-found" ||
          signInErr.code === "auth/invalid-credential" ||
          signInErr.code === "auth/user-disabled" ||
          signInErr.code === "auth/error"
        ) {
          try {
            await createUserWithEmailAndPassword(auth, emailLower, validPass);
          } catch (createErr: any) {
            console.warn("Firebase Auth auto-creation failed:", createErr);
          }
        } else {
          console.warn("Firebase Auth login failed:", signInErr);
        }
      }

      adminSession = true;
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          // Save under UID
          await setDoc(doc(db, "admins", currentUser.uid), {
            email: emailLower,
            password: validPass,
            role: "admin"
          });
        }
        // Save under Cleaned Email ID
        await setDoc(doc(db, "admins", adminIdClean), {
          email: emailLower,
          password: validPass,
          role: "admin"
        });
        // Save under Email as well
        await setDoc(doc(db, "admins", emailLower), {
          email: emailLower,
          password: validPass,
          role: "admin"
        });
      } catch (adminDocErr) {
        console.warn("Failed to write admin document to Firestore:", adminDocErr);
      }
      try {
        sessionStorage.setItem("swastik_admin_session", "true");
      } catch (e) {
        console.warn(e);
      }
      loginFailAttempts = 0;
      try {
        localStorage.removeItem("swastik_login_fails");
      } catch (e) {
        console.warn(e);
      }
      notify();
      return { success: true, message: `Welcome back, Admin!` };
    } else {
      loginFailAttempts += 1;
      try {
        localStorage.setItem("swastik_login_fails", String(loginFailAttempts));
      } catch (e) {
        console.warn(e);
      }
      
      if (loginFailAttempts >= 5) {
        const lockTime = Date.now() + 5 * 60 * 1000; // 5 mins lock
        loginLockUntil = lockTime;
        try {
          localStorage.setItem("swastik_login_lock_until", String(lockTime));
        } catch (e) {
          console.warn(e);
        }
        return {
          success: false,
          message: "Too many failed attempts. Locked for 5 minutes.",
        };
      }

      return {
        success: false,
        message: `Invalid ID or Password. ${5 - loginFailAttempts} attempts remaining.`,
      };
    }
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Firebase Auth signout failed", e);
    }
    adminSession = false;
    try {
      sessionStorage.removeItem("swastik_admin_session");
    } catch (e) {
      console.warn(e);
    }
    notify();
  },

  // SUBSCRIBE HOOK
  subscribe(listener: () => void) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  },
};

// React hook to use store reactively
export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(portfolioStore.getData());
  const [draft, setDraft] = useState<PortfolioData>(portfolioStore.getDraftData());
  const [loggedIn, setLoggedIn] = useState<boolean>(portfolioStore.isLoggedIn());
  const [history, setHistory] = useState<VersionHistoryItem[]>(portfolioStore.getVersionHistory());

  useEffect(() => {
    const unsubscribe = portfolioStore.subscribe(() => {
      setData(portfolioStore.getData());
      setDraft(portfolioStore.getDraftData());
      setLoggedIn(portfolioStore.isLoggedIn());
      setHistory(portfolioStore.getVersionHistory());
    });
    return unsubscribe;
  }, []);

  return {
    data,
    draft,
    loggedIn,
    history,
    updateDraft: portfolioStore.updateDraft,
    discardChanges: portfolioStore.discardChanges,
    publishChanges: portfolioStore.publishChanges,
    resetToDefault: portfolioStore.resetToDefault,
    restoreVersion: portfolioStore.restoreVersion,
    login: portfolioStore.login,
    logout: portfolioStore.logout,
    addTestimonial: portfolioStore.addTestimonial,
  };
}

// Auto-reset state migration to seed new content requested by user
setTimeout(async () => {
  if (!localStorage.getItem("swastik_auto_reset_v4")) {
    try {
      console.log("Auto-resetting website states to the new defaults...");
      await portfolioStore.resetToDefault();
      localStorage.setItem("swastik_auto_reset_v4", "true");
      console.log("Auto-reset completed successfully!");
    } catch (e) {
      console.error("Auto-reset failed:", e);
    }
  }
}, 1200);

