import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePortfolio, Project, Review } from "../lib/store";
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Settings,
  X,
  FileText,
  Briefcase,
  User,
  MessageSquare,
  Mail,
  History,
  CheckCircle,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  ChevronRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Laptop,
  Inbox,
  Search,
  Star,
  Archive,
  MailOpen,
  Smartphone,
  Filter,
  Check
} from "lucide-react";

export default function AdminPanel() {
  const { data, draft, loggedIn, history, updateDraft, publishChanges, restoreVersion, login, logout, resetToDefault } = usePortfolio();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"testimonials" | "messages">("testimonials");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [toast, setToast] = useState<{ show: boolean; status: "saving" | "success" | "error"; message: string } | null>(null);

  // Project Editor State
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  // Local Form Buffers (to prevent keypress saving network spam and cursor jump)
  const [heroFormLocal, setHeroFormLocal] = useState<any>(null);
  const [aboutFormLocal, setAboutFormLocal] = useState<any>(null);
  const [contactFormLocal, setContactFormLocal] = useState<any>(null);

  // Keep local buffers in sync with data from database initially
  useEffect(() => {
    if (data?.hero) {
      setHeroFormLocal((prev: any) => prev === null ? { ...data.hero } : prev);
    }
  }, [data?.hero]);

  useEffect(() => {
    if (data?.about) {
      setAboutFormLocal((prev: any) => prev === null ? { ...data.about } : prev);
    }
  }, [data?.about]);

  useEffect(() => {
    if (data?.contact) {
      setContactFormLocal((prev: any) => prev === null ? { ...data.contact } : prev);
    }
  }, [data?.contact]);

  // Force reset buffers when the user navigates tab, discard changes, or resets DB
  useEffect(() => {
    if (data) {
      setHeroFormLocal(data.hero ? { ...data.hero } : null);
      setAboutFormLocal(data.about ? { ...data.about } : null);
      setContactFormLocal(data.contact ? { ...data.contact } : null);
    }
  }, [activeTab]);

  // Testimonial Editor State
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState<Partial<Review>>({});

  // Messages Inbox State
  const [messages, setMessages] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "unread" | "starred" | "archived">("all");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Load and listen to real-time messages from Firestore
  useEffect(() => {
    if (!loggedIn) {
      setMessages([]);
      return;
    }
    let unsubscribe: any;
    
    const setupMessagesListener = async () => {
      try {
        const { collection, onSnapshot, query, orderBy } = await import("firebase/firestore");
        const { db, handleFirestoreError, OperationType } = await import("../lib/firebase");
        
        const q = query(collection(db, "messages"), orderBy("submittedAt", "desc"));
        unsubscribe = onSnapshot(q, (snap) => {
          const list: any[] = [];
          snap.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() });
          });
          setMessages(list);
        }, (err) => {
          handleFirestoreError(err, OperationType.LIST, "messages");
        });
      } catch (err) {
        console.error("Error setting up messages listener:", err);
      }
    };

    setupMessagesListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loggedIn]);

  const handleToggleMessageRead = async (msgId: string, currentRead: boolean) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db, handleFirestoreError, OperationType } = await import("../lib/firebase");
      await updateDoc(doc(db, "messages", msgId), {
        isRead: !currentRead
      }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `messages/${msgId}`));
      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage((prev: any) => ({ ...prev, isRead: !currentRead }));
      }
    } catch (err) {
      console.error("Failed to toggle read state", err);
    }
  };

  const handleToggleMessageStar = async (msgId: string, currentStarred: boolean) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db, handleFirestoreError, OperationType } = await import("../lib/firebase");
      await updateDoc(doc(db, "messages", msgId), {
        isStarred: !currentStarred
      }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `messages/${msgId}`));
      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage((prev: any) => ({ ...prev, isStarred: !currentStarred }));
      }
    } catch (err) {
      console.error("Failed to toggle star state", err);
    }
  };

  const handleToggleMessageArchive = async (msgId: string, currentArchived: boolean) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db, handleFirestoreError, OperationType } = await import("../lib/firebase");
      await updateDoc(doc(db, "messages", msgId), {
        isArchived: !currentArchived
      }).catch(e => handleFirestoreError(e, OperationType.UPDATE, `messages/${msgId}`));
      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage((prev: any) => ({ ...prev, isArchived: !currentArchived }));
      }
    } catch (err) {
      console.error("Failed to toggle archive state", err);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!confirm("Are you sure you want to delete this message? This cannot be undone.")) return;
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      const { db, handleFirestoreError, OperationType } = await import("../lib/firebase");
      await deleteDoc(doc(db, "messages", msgId))
        .catch(e => handleFirestoreError(e, OperationType.DELETE, `messages/${msgId}`));
      if (selectedMessage && selectedMessage.id === msgId) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  // Open on custom login event trigger from Navbar
  useEffect(() => {
    const handleTrigger = () => {
      if (loggedIn) {
        setIsOpen(true);
      } else {
        setShowLogin(true);
      }
    };
    window.addEventListener("open-admin-login", handleTrigger);
    window.addEventListener("trigger-admin-login", handleTrigger);

    // Also support hash route for backup entry
    const handleHash = () => {
      if (window.location.hash === "#admin" || window.location.hash === "#admin-login") {
        if (loggedIn) {
          setIsOpen(true);
        } else {
          setShowLogin(true);
        }
      }
    };
    window.addEventListener("hashchange", handleHash);
    handleHash(); // Run once on load

    return () => {
      window.removeEventListener("open-admin-login", handleTrigger);
      window.removeEventListener("trigger-admin-login", handleTrigger);
      window.removeEventListener("hashchange", handleHash);
    };
  }, [loggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const result = await login(username, password);
      if (result.success) {
        setLoginError("");
        setUsername("");
        setPassword("");
        setShowLogin(false);
        setIsOpen(true);
      } else {
        setLoginError(result.message || "ACCESS DENIED. INVALID DECRYPTION KEYS.");
      }
    } catch (err: any) {
      setLoginError(err.message || "An authentication error occurred.");
    }
  };

  const performSave = async (asyncCallback: () => Promise<void>, successMsg = "Changes saved and published successfully!") => {
    setToast({ show: true, status: "saving", message: "Saving and deploying changes..." });
    setSaveStatus("saving");
    try {
      await asyncCallback();
      setToast({ show: true, status: "success", message: successMsg });
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
        setToast((prev) => prev && prev.status === "success" ? { ...prev, show: false } : prev);
      }, 3000);
    } catch (err: any) {
      console.error("Save failed:", err);
      const errorMessage = err?.message || "Check network or Firestore rules permissions.";
      setToast({ show: true, status: "error", message: `Save Failed: ${errorMessage}` });
      setSaveStatus("idle");
      setTimeout(() => {
        setToast((prev) => prev && prev.status === "error" ? { ...prev, show: false } : prev);
      }, 5000);
    }
  };

  // State modification wrappers
  const handleUpdateHero = (fields: any) => {
    performSave(async () => {
      await updateDraft("hero", { ...draft.hero, ...fields });
      await publishChanges();
    }, "Hero section updated and published!");
  };

  const handleUpdateAbout = (fields: any) => {
    performSave(async () => {
      await updateDraft("about", { ...draft.about, ...fields });
      await publishChanges();
    }, "About section updated and published!");
  };

  const handleUpdateContact = (fields: any) => {
    performSave(async () => {
      await updateDraft("contact", { ...draft.contact, ...fields });
      await publishChanges();
    }, "Contact details updated and published!");
  };

  const handleResetDatabase = async () => {
    if (!window.confirm("CRITICAL WARNING:\n\nAre you sure you want to completely RESET the portfolio website data to factory defaults? This will overwrite the live Firestore database and roll back all changes globally across all devices. This action is permanent and cannot be undone.")) {
      return;
    }
    performSave(async () => {
      await resetToDefault();
    }, "Portfolio database reset to factory defaults globally!");
  };

  const startEditProject = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjectForm(proj);
  };

  const saveProjectForm = () => {
    if (!projectForm.title) {
      alert("Validation Error: Please provide a Website Name / Brand Title.");
      return;
    }
    if (!projectForm.headline) {
      alert("Validation Error: Please provide a Main Headline / Big Statement.");
      return;
    }
    performSave(async () => {
      if (editingProjectId === "new") {
        const newProject: Project = {
          id: "proj_" + Date.now(),
          category: projectForm.category || "personal",
          title: projectForm.title || "",
          logo: projectForm.logo || projectForm.title || "",
          headline: projectForm.headline || "",
          color: projectForm.color || "from-purple-500 to-indigo-600",
          glowColor: projectForm.glowColor || "rgba(139,92,246,0.4)",
          status: projectForm.status || "published",
          isFeatured: projectForm.isFeatured ?? true,
          link: projectForm.link || "https://example.com",
          description: projectForm.description || ""
        };
        const newProjects = [...draft.projects, newProject];
        await updateDraft("projects", newProjects);
      } else if (editingProjectId) {
        const newProjects = draft.projects.map(p => p.id === editingProjectId ? { ...p, ...projectForm } as Project : p);
        await updateDraft("projects", newProjects);
      }
      await publishChanges();
      setEditingProjectId(null);
      setProjectForm({});
    }, editingProjectId === "new" ? "New work added successfully!" : "Work updated successfully!");
  };

  const handleDeleteProject = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    performSave(async () => {
      const newProjects = draft.projects.filter(p => p.id !== id);
      await updateDraft("projects", newProjects);
      await publishChanges();
    }, "Work deleted successfully!");
  };

  const startEditTestimonial = (testi: Review) => {
    setEditingTestimonialId(testi.id);
    setTestimonialForm(testi);
  };

  const saveTestimonialForm = () => {
    if (!testimonialForm.name) {
      alert("Validation Error: Please provide the client Name.");
      return;
    }
    if (!testimonialForm.text) {
      alert("Validation Error: Please provide the client Review message.");
      return;
    }
    performSave(async () => {
      if (editingTestimonialId === "new") {
        const newTesti: Review = {
          id: "rev_" + Date.now(),
          name: testimonialForm.name || "",
          role: testimonialForm.role || "",
          company: testimonialForm.company || "",
          text: testimonialForm.text || "",
          rating: testimonialForm.rating || 5,
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          isFeatured: true,
          reply: testimonialForm.reply || ""
        };
        const newTestimonials = [...draft.testimonials, newTesti];
        await updateDraft("testimonials", newTestimonials);
      } else if (editingTestimonialId) {
        const newTestimonials = draft.testimonials.map(t => t.id === editingTestimonialId ? { ...t, ...testimonialForm } as Review : t);
        await updateDraft("testimonials", newTestimonials);
      }
      await publishChanges();
      setEditingTestimonialId(null);
      setTestimonialForm({});
    }, editingTestimonialId === "new" ? "New testimonial added!" : "Testimonial updated!");
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    performSave(async () => {
      const newTestimonials = draft.testimonials.filter(t => t.id !== id);
      await updateDraft("testimonials", newTestimonials);
      await publishChanges();
    }, "Testimonial deleted successfully!");
  };

  const handleRollback = (id: string) => {
    performSave(async () => {
      await restoreVersion(id);
      await publishChanges();
    }, "Version restored and deployed!");
  };

  return (
    <>
      {/* 1. GLASS-STYLE LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-[15px] px-4"
          >
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              className="relative w-full max-w-[440px] rounded-[24px] border border-white/10 bg-[#0c0c0e]/80 p-8 shadow-[0_0_50px_rgba(139,92,246,0.15)] text-center overflow-hidden"
            >
              {/* Futuristic Background Accents */}
              <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

              {/* Close login */}
              <button
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Shield className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <h3 className="font-sans font-black text-xl tracking-[4px] text-white uppercase">
                  ADMIN TERMINAL
                </h3>
                <p className="font-sans text-xs text-white/40 tracking-[2px] mt-1 uppercase">
                  ENTER DECRYPTION PASSPHRASE
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="USERNAME"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all tracking-wider"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    placeholder="PASSPHRASE"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-mono text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all tracking-wider"
                  />
                </div>

                {loginError && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 text-xs font-sans leading-relaxed space-y-2"
                  >
                    <div className="flex items-center gap-2 font-mono text-red-400 font-bold uppercase tracking-wider text-[10px]">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      AUTHENTICATION ERROR
                    </div>
                    {loginError.includes("operation-not-allowed") ? (
                      <div className="space-y-2">
                        <p className="font-semibold text-white">Email/Password authentication provider is not enabled in Firebase.</p>
                        <p className="text-red-300 text-[11px]">
                          As the project owner, you must enable this provider to authorize edits and save to the database.
                        </p>
                        <div className="bg-black/35 p-2 rounded border border-white/5 font-mono text-[10px] text-left text-white/80 space-y-1">
                          <p className="font-bold text-purple-400">HOW TO ENABLE:</p>
                          <p>1. Open your Firebase Console</p>
                          <p>2. Go to <span className="text-amber-400">Authentication &gt; Sign-in method</span></p>
                          <p>3. Click <span className="text-amber-400">Add new provider</span></p>
                          <p>4. Select <span className="text-amber-400">Email/Password</span>, enable it, and save.</p>
                        </div>
                        <a 
                          href="https://console.firebase.google.com/project/gen-lang-client-0276663528/authentication/providers"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/35 border border-red-500/30 rounded-lg text-white font-mono text-[10px] font-bold tracking-wider uppercase transition-all"
                        >
                          Go to Firebase Console &rarr;
                        </a>
                      </div>
                    ) : (
                      <p className="font-mono text-[11px] uppercase tracking-wider text-red-300">{loginError}</p>
                    )}
                  </motion.div>
                )}

                <button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-sans font-bold text-xs tracking-[3px] shadow-[0_4px_20px_rgba(139,92,246,0.3)] transition-all uppercase cursor-pointer"
                >
                  INITIALIZE DECRYPT
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FULLSCREEN ADMIN OS PANEL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99990] bg-[#050507] text-white flex flex-col font-sans overflow-hidden"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-[20%] w-[500px] h-[500px] rounded-full bg-purple-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-[20%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

            {/* A. SYSTEM MENU HEADER */}
            <header className="h-[70px] border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md px-6 flex items-center justify-between z-10 select-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-black text-sm tracking-widest text-white uppercase">
                      SWASTIK ADMIN
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase tracking-widest">
                      ACTIVE
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-white/40 tracking-wider">
                    FUTURISTIC SUITE v2.8.4
                  </div>
                </div>
              </div>

              {/* Middle Save/History Status Indicators */}
              <div className="hidden sm:flex items-center gap-4 font-mono text-[11px] text-white/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>DURABLE SYNC STATUS: LIVE</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  <RefreshCw className={`w-3.5 h-3.5 text-purple-400 ${saveStatus === "saving" ? "animate-spin" : ""}`} />
                  {saveStatus === "saving" && <span className="text-purple-400">SYNCING STATE...</span>}
                  {saveStatus === "saved" && <span className="text-emerald-400">STATE ENCRYPTED & SAVED</span>}
                  {saveStatus === "idle" && <span>REALTIME AUTOSAVE ONLINE</span>}
                </div>
              </div>

              {/* Close & Logout buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="px-4 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-red-950/20 hover:border-red-500/20 text-white/60 hover:text-red-400 transition-all font-mono text-xs tracking-wider flex items-center gap-2"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  LOGOUT
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* B. MAIN OS WORKSPACE - SIDEBAR + CONTENT PANEL */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Sidebar Tabs */}
              <aside className="w-[80px] md:w-[240px] border-r border-white/5 bg-[#08080a]/40 flex flex-col justify-between py-6 select-none flex-shrink-0">
                <div className="space-y-2 px-3">
                  {[
                    { id: "testimonials", label: "CLIENT REVIEWS & REPLIES", icon: <MessageSquare className="w-5 h-5" /> },
                    { id: "messages", label: "CLIENT MESSAGES", icon: <Inbox className="w-5 h-5" /> },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full h-12 rounded-xl flex items-center gap-3 px-3 transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? "bg-[#8B5CF6]/10 text-white border-l-2 border-[#8B5CF6]"
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className={activeTab === tab.id ? "text-[#8B5CF6]" : ""}>{tab.icon}</div>
                      <span className="hidden md:inline font-sans text-xs font-bold tracking-[2px] uppercase">
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Footer credit in sidebar */}
                <div className="px-6 hidden md:block text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  Secure Operating Panel
                </div>
              </aside>

              {/* Content Panel */}
              <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                
                {/* Save Feedback strip for mobile */}
                {saveStatus !== "idle" && (
                  <div className="sm:hidden flex items-center gap-2 p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl text-xs font-mono text-purple-400">
                    <RefreshCw className={`w-4 h-4 ${saveStatus === "saving" ? "animate-spin" : ""}`} />
                    {saveStatus === "saving" ? "SYNCING CHANGES TO PORTFOLIO..." : "AUTOSAVE SUCCESSFUL!"}
                  </div>
                )}

                {/* 1. DASHBOARD OVERVIEW TAB */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-black tracking-tight uppercase">SYSTEM MONITOR</h2>
                      <p className="text-sm text-white/50">Live status analytics, analytics feeds, and portfolio telemetry diagnostics.</p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { title: "PORTFOLIO STACKS", value: "REACT + GSAP + VITE", icon: <Cpu className="text-purple-400 w-5 h-5" />, color: "from-purple-500/10 to-indigo-500/10" },
                        { title: "LIVE VISITOR TRACKING", value: "7 ACTIVE USERS", icon: <TrendingUp className="text-emerald-400 w-5 h-5" />, color: "from-emerald-500/10 to-teal-500/10" },
                        { title: "PUBLISHED WORKS", value: `${data.projects.filter((p: Project) => p.status === "published").length} LIVE PROJECTS`, icon: <Briefcase className="text-amber-400 w-5 h-5" />, color: "from-amber-500/10 to-orange-500/10" },
                        { title: "CLIENT TESTIMONIALS", value: `${data.testimonials.length} REVIEWS`, icon: <MessageSquare className="text-rose-400 w-5 h-5" />, color: "from-rose-500/10 to-pink-500/10" }
                      ].map((s, idx) => (
                        <div key={idx} className={`rounded-2xl border border-white/5 bg-gradient-to-br ${s.color} p-5 flex items-center justify-between`}>
                          <div>
                            <span className="block font-mono text-[9px] tracking-widest text-white/40 uppercase">{s.title}</span>
                            <span className="block font-sans font-black text-base text-white mt-1">{s.value}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">{s.icon}</div>
                        </div>
                      ))}
                    </div>

                    {/* Futuristic charts & details mock */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Security status & version control quick widget */}
                      <div className="lg:col-span-2 rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <h3 className="font-sans font-bold text-sm tracking-wider uppercase">PORTFOLIO DEPLOYMENT METRICS</h3>
                          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            HEALTHY
                          </span>
                        </div>
                        <div className="space-y-4 text-sm font-mono text-white/60">
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                            <span>VITE DEV SERVER</span>
                            <span className="text-emerald-400">ONLINE [PORT 3000]</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                            <span>REACTION LATENCY</span>
                            <span className="text-purple-400">&lt; 1ms (STORE IN-MEMORY)</span>
                          </div>
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl">
                            <span>DECRYPTION CIPHER</span>
                            <span className="text-indigo-400">AES-GCM CLIENT STATE</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quick action panel */}
                      <div className="rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-6 space-y-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-sans font-bold text-sm tracking-wider uppercase mb-3">STATE ACTIONS</h3>
                          <p className="text-xs text-white/50 leading-relaxed mb-4">Trigger updates directly. Your modifications will instantly stream to the client portfolio overlay without reloading.</p>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => setActiveTab("hero")}
                            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-between px-4 transition-all"
                          >
                            <span>EDIT HERO DETAILS</span>
                            <ChevronRight className="w-4 h-4 text-[#8B5CF6]" />
                          </button>
                          <button
                            onClick={() => setActiveTab("projects")}
                            className="w-full h-11 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold tracking-wider uppercase flex items-center justify-between px-4 transition-all"
                          >
                            <span>MANAGE WORKS</span>
                            <ChevronRight className="w-4 h-4 text-[#8B5CF6]" />
                          </button>
                          <button
                            onClick={handleResetDatabase}
                            className="w-full h-11 rounded-xl bg-red-950/20 border border-red-500/20 hover:bg-red-950/40 hover:border-red-500/40 text-red-400 text-xs font-bold tracking-wider uppercase flex items-center justify-between px-4 transition-all"
                          >
                            <span>RESET DATABASE</span>
                            <RefreshCw className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MESSAGES INBOX TAB */}
                {activeTab === "messages" && (() => {
                  const formatMsgDate = (isoString: string) => {
                    try {
                      const d = new Date(isoString);
                      return d.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                    } catch {
                      return isoString || "";
                    }
                  };

                  const filteredMessages = messages
                    .filter((m) => {
                      if (searchQuery.trim()) {
                        const query = searchQuery.toLowerCase();
                        const matchesName = m.name?.toLowerCase().includes(query);
                        const matchesEmail = m.email?.toLowerCase().includes(query);
                        const matchesMsg = m.message?.toLowerCase().includes(query);
                        if (!matchesName && !matchesEmail && !matchesMsg) return false;
                      }
                      if (filterType === "unread") return !m.isRead;
                      if (filterType === "starred") return m.isStarred;
                      if (filterType === "archived") return m.isArchived;
                      return !m.isArchived;
                    })
                    .sort((a, b) => {
                      const timeA = new Date(a.submittedAt || 0).getTime();
                      const timeB = new Date(b.submittedAt || 0).getTime();
                      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
                    });

                  return (
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight uppercase">MESSAGES INBOX</h2>
                        <p className="text-sm text-white/50">Manage submitted inquiries, review scope details, and respond directly to clients.</p>
                      </div>

                      {/* Stats summary banner */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "ALL INQUIRIES", value: messages.length, color: "text-purple-400" },
                          { label: "UNREAD MESSAGES", value: messages.filter(m => !m.isRead).length, color: "text-amber-400 animate-pulse" },
                          { label: "STARRED", value: messages.filter(m => m.isStarred).length, color: "text-rose-400" },
                          { label: "ARCHIVED", value: messages.filter(m => m.isArchived).length, color: "text-white/40" },
                        ].map((s, idx) => (
                          <div key={idx} className="rounded-xl border border-white/5 bg-[#0a0a0c]/80 p-4">
                            <span className="block font-mono text-[9px] tracking-widest text-white/40 uppercase">{s.label}</span>
                            <span className={`block font-sans font-black text-xl mt-1 ${s.color}`}>{s.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Left List & Right Detail layout */}
                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        
                        {/* Left: Messages List */}
                        <div className="w-full lg:w-[55%] rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-5 space-y-4">
                          
                          {/* Filters, Search & Sort controls */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {(["all", "unread", "starred", "archived"] as const).map((filter) => (
                                <button
                                  key={filter}
                                  onClick={() => {
                                    setFilterType(filter);
                                    setSelectedMessage(null);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold tracking-wider uppercase transition-all ${
                                    filterType === filter
                                      ? "bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30"
                                      : "text-white/40 hover:text-white bg-white/5 border border-transparent"
                                  }`}
                                >
                                  {filter}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                  type="text"
                                  placeholder="Search..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-[120px] sm:w-[150px] h-9 bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                                />
                              </div>
                              <button
                                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                                className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1"
                                title="Toggle Date Sort Order"
                              >
                                <span>DATE:</span>
                                <span className="text-[#8B5CF6]">{sortOrder.toUpperCase()}</span>
                              </button>
                            </div>
                          </div>

                          {/* List of filtered messages */}
                          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                            {filteredMessages.length === 0 ? (
                              <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
                                <Inbox className="w-10 h-10 text-white/15 animate-pulse" />
                                <p className="text-xs font-mono text-white/40 uppercase tracking-widest">No messages found in this tab.</p>
                              </div>
                            ) : (
                              filteredMessages.map((msg) => {
                                const isSelected = selectedMessage?.id === msg.id;
                                return (
                                  <div
                                    key={msg.id}
                                    onClick={() => {
                                      setSelectedMessage(msg);
                                      if (!msg.isRead) {
                                        handleToggleMessageRead(msg.id, false);
                                      }
                                    }}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative flex items-start gap-3.5 ${
                                      isSelected
                                        ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/5"
                                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                                    }`}
                                  >
                                    {/* Unread indicator dot */}
                                    {!msg.isRead && (
                                      <span className="absolute left-2.5 top-[22px] w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                                    )}

                                    {/* User Profile Initial Placeholder */}
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-sans font-extrabold text-sm text-[#8B5CF6] shrink-0">
                                      {(msg.name || "A").charAt(0).toUpperCase()}
                                    </div>

                                    {/* Message brief info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="font-sans font-bold text-sm text-white/90 truncate leading-none">
                                          {msg.name}
                                        </h4>
                                        <span className="font-mono text-[9px] text-white/30 shrink-0">
                                          {formatMsgDate(msg.submittedAt)}
                                        </span>
                                      </div>
                                      <p className="font-sans text-xs text-[#8B5CF6] truncate mb-1.5 font-medium">
                                        {msg.email}
                                      </p>
                                      <p className="font-sans text-xs text-white/50 line-clamp-2 leading-relaxed">
                                        {msg.message}
                                      </p>
                                    </div>

                                    {/* Row Quick Action buttons */}
                                    <div className="flex flex-col gap-2 shrink-0 self-center" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => handleToggleMessageStar(msg.id, msg.isStarred)}
                                        className={`p-1.5 rounded-lg border transition-all ${
                                          msg.isStarred
                                            ? "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                            : "bg-white/5 border-transparent text-white/30 hover:text-white"
                                        }`}
                                      >
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                      </button>
                                      <button
                                        onClick={() => handleToggleMessageArchive(msg.id, msg.isArchived)}
                                        className={`p-1.5 rounded-lg border transition-all ${
                                          msg.isArchived
                                            ? "bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#8B5CF6]"
                                            : "bg-white/5 border-transparent text-white/30 hover:text-white"
                                        }`}
                                        title={msg.isArchived ? "Unarchive" : "Archive"}
                                      >
                                        <Archive className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Right: Selected Message Details */}
                        <div className="w-full lg:w-[45%] rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-6 min-h-[500px] flex flex-col justify-between sticky top-6">
                          {selectedMessage ? (
                            <div className="h-full flex flex-col justify-between gap-6 text-left">
                              
                              {/* Detail Header */}
                              <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center font-sans font-black text-lg text-[#8B5CF6]">
                                      {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <h3 className="font-sans font-black text-base text-white">{selectedMessage.name}</h3>
                                      <span className="font-mono text-[10px] text-white/40">{formatMsgDate(selectedMessage.submittedAt)}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    {selectedMessage.deviceType && (
                                      <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[9px] text-white/40 flex items-center gap-1 uppercase">
                                        <Smartphone className="w-3 h-3" />
                                        {selectedMessage.deviceType}
                                      </span>
                                    )}
                                    <button
                                      onClick={() => handleToggleMessageStar(selectedMessage.id, selectedMessage.isStarred)}
                                      className={`p-2 rounded-xl border transition-all ${
                                        selectedMessage.isStarred
                                          ? "bg-rose-500/15 border-rose-500/25 text-rose-400"
                                          : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                      }`}
                                    >
                                      <Star className="w-4 h-4 fill-current" />
                                    </button>
                                  </div>
                                </div>

                                {/* Sender Details */}
                                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-2">
                                  <div className="space-y-1 min-w-0">
                                    <span className="block font-mono text-[9px] text-white/30 tracking-wider uppercase">Sender Email Address</span>
                                    <span className="font-sans text-sm text-[#8B5CF6] font-semibold break-all truncate block">{selectedMessage.email}</span>
                                  </div>
                                  <a
                                    href={`mailto:${selectedMessage.email}?subject=Reply to your Swastik Portfolio inquiry`}
                                    className="px-3 py-2 rounded-lg bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-sans text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
                                  >
                                    <MailOpen className="w-3.5 h-3.5" />
                                    REPLY
                                  </a>
                                </div>

                                {/* Message body */}
                                <div className="space-y-2">
                                  <span className="block font-mono text-[9px] text-white/30 tracking-wider uppercase">Message Text</span>
                                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 max-h-[300px] overflow-y-auto">
                                    <p className="font-sans text-sm text-white/80 leading-relaxed whitespace-pre-wrap select-text">
                                      {selectedMessage.message}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Detail Footer Actions */}
                              <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleToggleMessageRead(selectedMessage.id, selectedMessage.isRead)}
                                    className="px-3 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs font-sans font-bold uppercase flex items-center gap-1.5"
                                  >
                                    <Mail className="w-4 h-4" />
                                    {selectedMessage.isRead ? "Mark Unread" : "Mark Read"}
                                  </button>
                                  <button
                                    onClick={() => handleToggleMessageArchive(selectedMessage.id, selectedMessage.isArchived)}
                                    className="px-3 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs font-sans font-bold uppercase flex items-center gap-1.5"
                                  >
                                    <Archive className="w-4 h-4" />
                                    {selectedMessage.isArchived ? "Inbox" : "Archive"}
                                  </button>
                                </div>

                                <button
                                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                                  className="px-3 h-10 rounded-xl border border-red-500/10 hover:border-red-500/20 bg-red-950/10 hover:bg-red-950/20 text-red-400 hover:text-red-300 transition-all text-xs font-sans font-bold uppercase flex items-center gap-1.5"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  DELETE
                                </button>
                              </div>

                            </div>
                          ) : (
                            /* Empty detail state */
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
                              <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/10">
                                <Inbox className="w-8 h-8 animate-pulse" />
                              </div>
                              <div className="space-y-1.5">
                                <h4 className="font-sans font-bold text-sm text-white/40 uppercase tracking-widest">Select a Message</h4>
                                <p className="font-sans text-xs text-white/20 max-w-[260px] leading-relaxed">
                                  Click on any incoming client message in the list to inspect full details, copy email addresses, or trigger replies.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })()}

                {/* 2. HERO SECTION EDITOR */}
                {activeTab === "hero" && heroFormLocal && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight uppercase">HERO EDITOR</h2>
                        <p className="text-sm text-white/50">Edit your main website landing tagline, headings, brand values, CTA buttons, and ambient background looping video.</p>
                      </div>
                      <button
                        onClick={() => handleUpdateHero(heroFormLocal)}
                        className="flex items-center gap-2 px-5 h-11 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/20 transition-all self-start sm:self-auto"
                      >
                        <Save className="w-4 h-4" />
                        SAVE & PUBLISH HERO
                      </button>
                    </div>

                    <div className="rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Eyebrow Text Accent</label>
                          <input
                            type="text"
                            value={heroFormLocal.eyebrow || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, eyebrow: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Background Looping Video URL</label>
                          <input
                            type="text"
                            value={heroFormLocal.videoUrl || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, videoUrl: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Headline Line 1 (White text)</label>
                          <input
                            type="text"
                            value={heroFormLocal.headlineLine1 || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, headlineLine1: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Headline Line 1 Accent (Purple text)</label>
                          <input
                            type="text"
                            value={heroFormLocal.headlineLine1Accent || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, headlineLine1Accent: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Headline Line 2 (White text)</label>
                          <input
                            type="text"
                            value={heroFormLocal.headlineLine2 || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, headlineLine2: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Headline Line 2 Accent (Purple text)</label>
                          <input
                            type="text"
                            value={heroFormLocal.headlineLine2Accent || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, headlineLine2Accent: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Narrative Hero Subdescription</label>
                        <textarea
                          rows={3}
                          value={heroFormLocal.description || ""}
                          onChange={(e) => setHeroFormLocal({ ...heroFormLocal, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Left CTA Text</label>
                          <input
                            type="text"
                            value={heroFormLocal.btn1Text || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, btn1Text: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Right CTA Text</label>
                          <input
                            type="text"
                            value={heroFormLocal.btn2Text || ""}
                            onChange={(e) => setHeroFormLocal({ ...heroFormLocal, btn2Text: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleUpdateHero(heroFormLocal)}
                          className="flex items-center gap-2 px-6 h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all"
                        >
                          <Save className="w-5 h-5" />
                          SAVE & PUBLISH HERO CHANGES
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PROJECTS PORTFOLIO EDITOR */}
                {activeTab === "projects" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight uppercase">PROJECTS MANAGER</h2>
                        <p className="text-sm text-white/50">Add, edit, rearrange, or delete your design works on the featured carousel grid.</p>
                      </div>
                      <button
                        onClick={() => startEditProject({ id: "new", category: "personal", title: "", logo: "", headline: "", color: "from-purple-500 to-indigo-600", glowColor: "rgba(139,92,246,0.4)", status: "published", isFeatured: true, link: "https://example.com", description: "" })}
                        className="px-5 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      >
                        <Plus className="w-4 h-4" />
                        NEW PROJECT
                      </button>
                    </div>

                    {/* Editor Form Modal or inline element */}
                    {editingProjectId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[24px] border border-purple-500/30 bg-[#0c0c0f]/90 p-6 space-y-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h3 className="font-sans font-bold text-sm tracking-wider uppercase text-[#8B5CF6]">
                            {editingProjectId === "new" ? "CREATE NEW CAROUSEL WORK" : `EDIT: ${projectForm.title}`}
                          </h3>
                          <button onClick={() => setEditingProjectId(null)} className="text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Left: Interactive Input Options */}
                          <div className="space-y-5 text-left">
                            {/* Option 1: Website Category */}
                            <div>
                              <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Website Category</label>
                              <select
                                value={projectForm.category || "personal"}
                                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500"
                              >
                                <option value="personal" className="bg-[#0c0c0f]">PERSONAL</option>
                                <option value="portfolio" className="bg-[#0c0c0f]">PORTFOLIO</option>
                                <option value="e-commerce" className="bg-[#0c0c0f]">E-COMMERCE</option>
                                <option value="business" className="bg-[#0c0c0f]">BUSINESS</option>
                                <option value="others" className="bg-[#0c0c0f]">OTHERS</option>
                              </select>
                            </div>

                            {/* Option 2: Website Information */}
                            <div>
                              <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Website Information (Description & Details)</label>
                              <textarea
                                rows={4}
                                value={projectForm.description || ""}
                                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                                placeholder="E.g., High-performance website featuring animated training regimes, membership analytics tracking, and visual trackers."
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-purple-500 resize-none font-sans"
                              />
                            </div>

                            {/* Option 3: Website Link */}
                            <div>
                              <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Website Link (URL)</label>
                              <input
                                type="url"
                                value={projectForm.link || ""}
                                onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                                placeholder="E.g., https://swastik.design"
                                className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                              />
                            </div>

                            {/* Additional supportive options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Website Name / Brand Title</label>
                                <input
                                  type="text"
                                  value={projectForm.title || ""}
                                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value, logo: projectForm.logo || e.target.value })}
                                  placeholder="E.g., PowerFit Gym"
                                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Main Headline / Big Statement</label>
                                <input
                                  type="text"
                                  value={projectForm.headline || ""}
                                  onChange={(e) => setProjectForm({ ...projectForm, headline: e.target.value })}
                                  placeholder="E.g., TRANSFORM YOUR BODY."
                                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Abbrev. Logo</label>
                                <input
                                  type="text"
                                  value={projectForm.logo || ""}
                                  onChange={(e) => setProjectForm({ ...projectForm, logo: e.target.value })}
                                  placeholder="E.g., POWERFIT"
                                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Card Gradient</label>
                                <input
                                  type="text"
                                  value={projectForm.color || ""}
                                  onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                                  placeholder="from-orange-500 to-red-600"
                                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                                />
                              </div>
                              <div>
                                <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Status</label>
                                <select
                                  value={projectForm.status || "published"}
                                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
                                  className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500"
                                >
                                  <option value="published" className="bg-[#0c0c0f]">PUBLISHED</option>
                                  <option value="draft" className="bg-[#0c0c0f]">DRAFT</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Right: Live Preview of the Website */}
                          <div className="flex flex-col h-full justify-between text-left">
                            <div>
                              <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Website Live Preview</label>
                              <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden relative flex flex-col h-[380px] lg:h-[420px] shadow-inner">
                                {/* Simulated Address bar */}
                                <div className="h-9 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                                  <div className="flex gap-1.5 shrink-0">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                  </div>
                                  <div className="flex-1 bg-black/20 rounded-md h-6 text-[10px] text-white/40 font-mono px-3 flex items-center justify-between overflow-hidden">
                                    <span className="truncate">{projectForm.link || "No website link entered"}</span>
                                    <span className="text-[8px] tracking-widest text-[#8B5CF6] font-bold shrink-0">SECURE</span>
                                  </div>
                                  {projectForm.link && projectForm.link.startsWith("http") && (
                                    <a
                                      href={projectForm.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-white/40 hover:text-white p-1 rounded-md hover:bg-white/5 transition-colors flex items-center"
                                      title="Open preview link in a new tab"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}
                                </div>
                                {/* Website Frame content */}
                                <div className="flex-1 relative bg-neutral-900 overflow-hidden">
                                  {projectForm.link && projectForm.link.startsWith("http") ? (
                                    <iframe
                                      src={projectForm.link}
                                      title="Live Admin Preview"
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full border-0 bg-white"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-3 bg-[#0a0a0c]">
                                      <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#8B5CF6]">
                                        <Cpu className="w-5 h-5 animate-pulse" />
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs font-mono text-white/80 uppercase tracking-widest">Awaiting Valid Website Link</p>
                                        <p className="text-[11px] text-white/40 max-w-[280px] mx-auto leading-relaxed">
                                          Please provide a secure URL (starting with http:// or https://) on the left to display an interactive live browser preview here.
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 justify-end pt-2 border-t border-white/5">
                          <button
                            onClick={() => setEditingProjectId(null)}
                            className="px-5 h-10 rounded-xl border border-white/10 text-xs font-bold tracking-wider uppercase hover:bg-white/5 transition-colors"
                          >
                            CANCEL
                          </button>
                          <button
                            onClick={saveProjectForm}
                            className="px-5 h-10 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4fe0] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.25)]"
                          >
                            <Save className="w-4 h-4" />
                            SAVE CHANGES
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Table / List layout of projects */}
                    <div className="rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="border-b border-white/5 bg-white/2 text-white/40 font-mono uppercase text-[10px] tracking-wider">
                              <th className="p-4 md:p-5">WORK TITLE</th>
                              <th className="p-4 md:p-5">CATEGORY</th>
                              <th className="p-4 md:p-5">GRADIENT COLOR</th>
                              <th className="p-4 md:p-5">STATUS</th>
                              <th className="p-4 md:p-5 text-right">ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {draft.projects.map((proj: Project) => (
                              <tr key={proj.id} className="hover:bg-white/2 transition-colors">
                                <td className="p-4 md:p-5 font-bold">
                                  <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 flex items-center justify-center font-mono text-[10px] text-purple-400 border border-purple-500/20">
                                      {proj.logo}
                                    </span>
                                    <span>{proj.title}</span>
                                  </div>
                                </td>
                                <td className="p-4 md:p-5 font-mono text-white/60 uppercase text-[10px] tracking-wider">
                                  {proj.category}
                                </td>
                                <td className="p-4 md:p-5">
                                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono text-white bg-gradient-to-r ${proj.color}`}>
                                    {proj.color}
                                  </span>
                                </td>
                                <td className="p-4 md:p-5">
                                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider ${
                                    proj.status === "published"
                                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                      : "bg-white/5 text-white/40 border-white/10"
                                  }`}>
                                    {proj.status}
                                  </span>
                                </td>
                                <td className="p-4 md:p-5 text-right space-x-2">
                                  <button
                                    onClick={() => startEditProject(proj)}
                                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/30 hover:text-[#8B5CF6] transition-all font-mono text-[10px]"
                                  >
                                    EDIT
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProject(proj.id)}
                                    className="p-1.5 rounded-lg border border-white/5 hover:bg-red-950/20 hover:border-red-500/20 hover:text-red-400 transition-all text-white/30"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. ABOUT SECTION EDITOR */}
                {activeTab === "about" && aboutFormLocal && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight uppercase">ABOUT EDITOR</h2>
                        <p className="text-sm text-white/50">Edit your background cinematic looping video, interactive 3D holograph model URL, experience attributes, age, location and custom subheadings.</p>
                      </div>
                      <button
                        onClick={() => handleUpdateAbout(aboutFormLocal)}
                        className="flex items-center gap-2 px-5 h-11 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/20 transition-all self-start sm:self-auto"
                      >
                        <Save className="w-4 h-4" />
                        SAVE & PUBLISH ABOUT
                      </button>
                    </div>

                    <div className="rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Intro Headline Accent Line 1</label>
                          <input
                            type="text"
                            value={aboutFormLocal.headline1 || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, headline1: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Intro Headline Accent Line 2 (Gradient)</label>
                          <input
                            type="text"
                            value={aboutFormLocal.headline2 || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, headline2: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Background Cinematic Loop Video Link</label>
                          <input
                            type="text"
                            value={aboutFormLocal.bgVideoUrl || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, bgVideoUrl: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">3D Volumetric Hologram Video Link</label>
                          <input
                            type="text"
                            value={aboutFormLocal.holoVideoUrl || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, holoVideoUrl: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Bio Description Statement</label>
                        <textarea
                          rows={4}
                          value={aboutFormLocal.description || ""}
                          onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-purple-500/50 resize-none"
                        />
                      </div>

                      {/* Info grid fields mapping */}
                      <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 border-t border-white/5 pt-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Name</label>
                          <input
                            type="text"
                            value={aboutFormLocal.name || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, name: e.target.value })}
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Age</label>
                          <input
                            type="text"
                            value={aboutFormLocal.age || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, age: e.target.value })}
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">From (Country)</label>
                          <input
                            type="text"
                            value={aboutFormLocal.from || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, from: e.target.value })}
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Experience</label>
                          <input
                            type="text"
                            value={aboutFormLocal.experience || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, experience: e.target.value })}
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Availability</label>
                          <input
                            type="text"
                            value={aboutFormLocal.availability || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, availability: e.target.value })}
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Specialization</label>
                          <input
                            type="text"
                            value={aboutFormLocal.specialization || ""}
                            onChange={(e) => setAboutFormLocal({ ...aboutFormLocal, specialization: e.target.value })}
                            className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleUpdateAbout(aboutFormLocal)}
                          className="flex items-center gap-2 px-6 h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all"
                        >
                          <Save className="w-5 h-5" />
                          SAVE & PUBLISH ABOUT CHANGES
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. TESTIMONIALS EDITOR */}
                {activeTab === "testimonials" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight uppercase">TESTIMONIALS MANAGER</h2>
                        <p className="text-sm text-white/50">Edit current reviews or append custom reviews that feed into the beautiful glowing bento grid.</p>
                      </div>
                      <button
                        onClick={() => startEditTestimonial({ id: "new", name: "", role: "", company: "", text: "", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", isFeatured: true })}
                        className="px-5 h-11 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
                      >
                        <Plus className="w-4 h-4" />
                        NEW TESTIMONIAL
                      </button>
                    </div>

                    {editingTestimonialId && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-[24px] border border-purple-500/30 bg-[#0c0c0f]/90 p-6 space-y-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                      >
                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                          <h3 className="font-sans font-bold text-sm tracking-wider uppercase text-[#8B5CF6]">
                            {editingTestimonialId === "new" ? "CREATE CLIENT TESTIMONIAL" : `EDIT: ${testimonialForm.name}`}
                          </h3>
                          <button onClick={() => setEditingTestimonialId(null)} className="text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div>
                            <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Client Full Name</label>
                            <input
                              type="text"
                              value={testimonialForm.name || ""}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Designation / Role</label>
                            <input
                              type="text"
                              value={testimonialForm.role || ""}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Company / Organization</label>
                            <input
                              type="text"
                              value={testimonialForm.company || ""}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })}
                              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="md:col-span-3">
                            <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Client Quote Text</label>
                            <textarea
                              rows={2}
                              value={testimonialForm.text || ""}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                            />
                          </div>
                          <div>
                            <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Rating Scale</label>
                            <select
                              value={testimonialForm.rating || 5}
                              onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                              className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-purple-500"
                            >
                              {[5, 4, 3, 2, 1].map((r) => (
                                <option key={r} value={r} className="bg-[#0c0c0f]">{r} STARS</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Your Reply to this Review</label>
                          <textarea
                            rows={3}
                            placeholder="Write your response/reply to the client review..."
                            value={testimonialForm.reply || ""}
                            onChange={(e) => setTestimonialForm({ ...testimonialForm, reply: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500 resize-none"
                          />
                        </div>

                        <div className="flex items-center gap-3 justify-end pt-2">
                          <button
                            onClick={() => setEditingTestimonialId(null)}
                            className="px-5 h-10 rounded-xl border border-white/10 text-xs font-bold tracking-wider uppercase hover:bg-white/5"
                          >
                            CANCEL
                          </button>
                          <button
                            onClick={saveTestimonialForm}
                            className="px-5 h-10 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4fe0] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1"
                          >
                            <Save className="w-4 h-4" />
                            SAVE CHANGES
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Testimonials List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {draft.testimonials.map((testi: Review) => (
                        <div key={testi.id} className="rounded-2xl border border-white/5 bg-[#0a0a0c]/80 p-5 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full border border-[#A855F7]/30 bg-[#A855F7]/10 flex items-center justify-center text-[#A855F7]">
                                  <User className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-bold text-xs">{testi.name}</div>
                                  <div className="text-[10px] text-white/40 uppercase tracking-wider">{testi.role} at {testi.company}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-xs text-amber-400">{testi.rating}</span>
                                <span className="text-[10px] text-amber-400">★</span>
                              </div>
                            </div>
                            <p className="text-xs text-white/70 italic leading-relaxed">
                              "{testi.text}"
                            </p>
                            {testi.reply ? (
                              <div className="mt-3 p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 space-y-1">
                                <span className="font-mono text-[8px] font-bold text-[#8B5CF6] tracking-wider uppercase block">Your Reply:</span>
                                <p className="text-xs text-white/80 leading-relaxed italic">
                                  "{testi.reply}"
                                </p>
                              </div>
                            ) : (
                              <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-white/30">
                                <span className="font-mono text-[8px] uppercase tracking-wider">No reply yet</span>
                                <button
                                  onClick={() => startEditTestimonial(testi)}
                                  className="font-mono text-[9px] text-[#8B5CF6] hover:underline uppercase"
                                >
                                  Reply
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-end gap-2 border-t border-white/5 pt-3">
                            <button
                              onClick={() => startEditTestimonial(testi)}
                              className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-[#8B5CF6]/10 hover:border-[#8B5CF6]/30 hover:text-[#8B5CF6] transition-all font-mono text-[9px]"
                            >
                              EDIT REACTION
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(testi.id)}
                              className="p-1.5 rounded-lg border border-white/5 hover:bg-red-950/20 hover:border-red-500/20 hover:text-red-400 transition-all text-white/30"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. CONTACT INFRASTRUCTURE EDITOR */}
                {activeTab === "contact" && contactFormLocal && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-black tracking-tight uppercase">CONTACT DETAILS</h2>
                        <p className="text-sm text-white/50">Edit email, location, messaging routes, telegram handle and live whatsapp integration coordinates.</p>
                      </div>
                      <button
                        onClick={() => handleUpdateContact(contactFormLocal)}
                        className="flex items-center gap-2 px-5 h-11 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-purple-500/20 transition-all self-start sm:self-auto"
                      >
                        <Save className="w-4 h-4" />
                        SAVE & PUBLISH CONTACT
                      </button>
                    </div>

                    <div className="rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Decentralized Official Email</label>
                          <input
                            type="email"
                            value={contactFormLocal.email || ""}
                            onChange={(e) => setContactFormLocal({ ...contactFormLocal, email: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">Telegram Username Handle</label>
                          <input
                            type="text"
                            value={contactFormLocal.telegram || ""}
                            onChange={(e) => setContactFormLocal({ ...contactFormLocal, telegram: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">WhatsApp Connection Number</label>
                          <input
                            type="text"
                            value={contactFormLocal.whatsapp || ""}
                            onChange={(e) => setContactFormLocal({ ...contactFormLocal, whatsapp: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                        <div>
                          <label className="block font-mono text-[10px] tracking-wider text-white/40 uppercase mb-2">HQ / Home Location Base</label>
                          <input
                            type="text"
                            value={contactFormLocal.location || ""}
                            onChange={(e) => setContactFormLocal({ ...contactFormLocal, location: e.target.value })}
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-purple-500/50"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleUpdateContact(contactFormLocal)}
                          className="flex items-center gap-2 px-6 h-12 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 transition-all"
                        >
                          <Save className="w-5 h-5" />
                          SAVE & PUBLISH CONTACT CHANGES
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. VERSION LOG HISTORY & ROLLBACK */}
                {activeTab === "versions" && (
                  <div className="space-y-6">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-black tracking-tight uppercase">VERSION CONTROLLER</h2>
                      <p className="text-sm text-white/50">Browse automatic state snapshots, audit modifications logs, and restore full website settings to any previous epoch instantly.</p>
                    </div>

                    <div className="rounded-[24px] border border-white/5 bg-[#0a0a0c]/80 p-6 space-y-4">
                      <h3 className="font-sans font-bold text-sm tracking-wider uppercase border-b border-white/5 pb-3">SNAPSHOTS AUDIT FEED</h3>

                      <div className="space-y-4">
                        {history.slice().map((v: any, index: number) => {
                          // The history in store is already sorted with newest first, let's verify. Yes, addHistoryVersion does [newItem, ...versionHistory].
                          const isCurrent = v.data === JSON.stringify(draft);
                          return (
                            <div
                              key={v.id}
                              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                isCurrent
                                  ? "border-purple-500/40 bg-[#8B5CF6]/5 shadow-[0_0_20px_rgba(139,92,246,0.05)]"
                                  : "border-white/5 bg-white/2 hover:border-white/10"
                              }`}
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-xs font-bold text-purple-400">EPOCH_ID: #{v.id.substring(4, 11)}</span>
                                  <span className="font-mono text-[10px] text-white/30">{v.timestamp}</span>
                                  {isCurrent && (
                                    <span className="text-[9px] font-mono font-black text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                      ACTIVE SITE CODES
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-white/60 font-mono uppercase tracking-wide">
                                  MODIFICATION FEED: {v.description}
                                </p>
                              </div>

                              <button
                                onClick={() => handleRollback(v.id)}
                                disabled={isCurrent}
                                className={`px-4 h-9 rounded-xl font-mono text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                                  isCurrent
                                    ? "bg-transparent border border-white/5 text-white/20 cursor-not-allowed"
                                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10 cursor-pointer"
                                }`}
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                ROLLBACK
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Modern Toast Popup System */}
      <AnimatePresence>
        {toast && toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0d0d12]/95 border border-white/10 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl p-4 flex items-start gap-3.5"
          >
            <div className="mt-0.5">
              {toast.status === "saving" && (
                <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
              )}
              {toast.status === "success" && (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              )}
              {toast.status === "error" && (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-bold font-mono tracking-wider text-white uppercase">
                {toast.status === "saving" && "SYNCING DATABASE"}
                {toast.status === "success" && "SUCCESSFULLY DEPLOYED"}
                {toast.status === "error" && "OPERATION FAILURE"}
              </h4>
              <p className="text-xs text-white/75 leading-relaxed">
                {toast.message}
              </p>
            </div>
            {toast.status !== "saving" && (
              <button
                onClick={() => setToast({ ...toast, show: false })}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
