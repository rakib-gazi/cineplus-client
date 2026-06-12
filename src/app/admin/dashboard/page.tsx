"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Trash2, Power, LayoutGrid, CheckCircle, 
  XCircle, ExternalLink, Sparkles, LogOut, ArrowLeft, RefreshCw,
  Film, Award, Star
} from "lucide-react";

interface HeroContentItem {
  _id: string;
  tag: string;
  title: string;
  shortDescription: string;
  link: string;
  currentActiveOnLiveSite: boolean;
  createdAt: string;
}

interface ShowContentItem {
  _id: string;
  title: string;
  dramaType: string;
  showDramaType: boolean;
  shortDescription: string;
  awardWinnerCategory: string;
  awardGivenInstitution: string;
  showAwards: boolean;
  imdbScore: string;
  showImdbScore: boolean;
  link: string;
  image: string;
  homepageStatus: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"hero" | "content">("hero");
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ==========================================
  // TAB 1: HERO SECTION STATE & HANDLERS
  // ==========================================
  const [heroes, setHeroes] = useState<HeroContentItem[]>([]);
  const [editingHeroId, setEditingHeroId] = useState<string | null>(null);
  const [deleteConfirmHeroId, setDeleteConfirmHeroId] = useState<string | null>(null);
  
  const [heroTag, setHeroTag] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroShortDescription, setHeroShortDescription] = useState("");
  const [heroLink, setHeroLink] = useState("");
  const [heroActive, setHeroActive] = useState(false);
  const [submittingHero, setSubmittingHero] = useState(false);

  const fetchHeroes = async () => {
    try {
      const res = await fetch("/api/hero");
      if (res.ok) {
        const data = await res.json();
        setHeroes(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch hero contents", "error");
    }
  };

  const handleHeroFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingHero(true);

    const payload = {
      tag: heroTag,
      title: heroTitle,
      shortDescription: heroShortDescription,
      link: heroLink,
      currentActiveOnLiveSite: heroActive,
    };

    try {
      const url = editingHeroId ? `/api/hero/${editingHeroId}` : "/api/hero";
      const method = editingHeroId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingHeroId ? "Hero content updated" : "Hero content created");
        resetHeroForm();
        await fetchHeroes();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    } finally {
      setSubmittingHero(false);
    }
  };

  const resetHeroForm = () => {
    setHeroTag("");
    setHeroTitle("");
    setHeroShortDescription("");
    setHeroLink("");
    setHeroActive(false);
    setEditingHeroId(null);
  };

  const startHeroEdit = (item: HeroContentItem) => {
    setEditingHeroId(item._id);
    setHeroTag(item.tag);
    setHeroTitle(item.title);
    setHeroShortDescription(item.shortDescription);
    setHeroLink(item.link);
    setHeroActive(item.currentActiveOnLiveSite);
  };

  const handleHeroDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/hero/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Hero content deleted");
        if (editingHeroId === id) resetHeroForm();
        setDeleteConfirmHeroId(null);
        await fetchHeroes();
      } else {
        const data = await res.json();
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  const toggleHeroActiveStatus = async (item: HeroContentItem) => {
    const payload = {
      tag: item.tag,
      title: item.title,
      shortDescription: item.shortDescription,
      link: item.link,
      currentActiveOnLiveSite: !item.currentActiveOnLiveSite,
    };

    try {
      const res = await fetch(`/api/hero/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(!item.currentActiveOnLiveSite ? "Hero set active" : "Hero deactivated");
        await fetchHeroes();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to toggle status", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  // ==========================================
  // TAB 2: CONTENT MANAGEMENT STATE & HANDLERS
  // ==========================================
  const [shows, setShows] = useState<ShowContentItem[]>([]);
  const [editingShowId, setEditingShowId] = useState<string | null>(null);
  const [deleteConfirmShowId, setDeleteConfirmShowId] = useState<string | null>(null);
  
  const [showTitle, setShowTitle] = useState("");
  const [showDramaType, setShowDramaType] = useState("");
  const [showShowDramaType, setShowShowDramaType] = useState(false);
  const [showShortDescription, setShowShortDescription] = useState("");
  const [showAwardWinnerCategory, setShowAwardWinnerCategory] = useState("");
  const [showAwardGivenInstitution, setShowAwardGivenInstitution] = useState("");
  const [showShowAwards, setShowShowAwards] = useState(false);
  const [showImdbScore, setShowImdbScore] = useState("");
  const [showShowImdbScore, setShowShowImdbScore] = useState(false);
  const [showLink, setShowLink] = useState("");
  const [showImage, setShowImage] = useState("");
  const [showHomepageStatus, setShowHomepageStatus] = useState(false);
  const [submittingShow, setSubmittingShow] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchShows = async () => {
    try {
      const res = await fetch("/api/shows");
      if (res.ok) {
        const data = await res.json();
        setShows(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch show contents", "error");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setShowImage(data.url);
        showToast("Image uploaded successfully");
      } else {
        showToast(data.error || "Failed to upload image", "error");
      }
    } catch (err) {
      showToast("Image upload network error", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleShowFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingShow(true);

    if (!showImage) {
      showToast("Please upload a show poster image first", "error");
      setSubmittingShow(false);
      return;
    }

    const payload = {
      title: showTitle,
      dramaType: showDramaType,
      showDramaType: showShowDramaType,
      shortDescription: showShortDescription,
      awardWinnerCategory: showAwardWinnerCategory,
      awardGivenInstitution: showAwardGivenInstitution,
      showAwards: showShowAwards,
      imdbScore: showImdbScore,
      showImdbScore: showShowImdbScore,
      link: showLink,
      image: showImage,
      homepageStatus: showHomepageStatus,
    };

    try {
      const url = editingShowId ? `/api/shows/${editingShowId}` : "/api/shows";
      const method = editingShowId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingShowId ? "Show updated successfully" : "Show created successfully");
        resetShowForm();
        await fetchShows();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    } finally {
      setSubmittingShow(false);
    }
  };

  const resetShowForm = () => {
    setShowTitle("");
    setShowDramaType("");
    setShowShowDramaType(false);
    setShowShortDescription("");
    setShowAwardWinnerCategory("");
    setShowAwardGivenInstitution("");
    setShowShowAwards(false);
    setShowImdbScore("");
    setShowShowImdbScore(false);
    setShowLink("");
    setShowImage("");
    setShowHomepageStatus(false);
    setEditingShowId(null);
  };

  const startShowEdit = (item: ShowContentItem) => {
    setEditingShowId(item._id);
    setShowTitle(item.title);
    setShowDramaType(item.dramaType || "");
    setShowShowDramaType(item.showDramaType);
    setShowShortDescription(item.shortDescription);
    setShowAwardWinnerCategory(item.awardWinnerCategory || "");
    setShowAwardGivenInstitution(item.awardGivenInstitution || "");
    setShowShowAwards(item.showAwards);
    setShowImdbScore(item.imdbScore || "");
    setShowShowImdbScore(item.showImdbScore);
    setShowLink(item.link);
    setShowImage(item.image);
    setShowHomepageStatus(item.homepageStatus);
  };

  const handleShowDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/shows/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Show deleted successfully");
        if (editingShowId === id) resetShowForm();
        setDeleteConfirmShowId(null);
        await fetchShows();
      } else {
        const data = await res.json();
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  const toggleShowHomepageStatus = async (item: ShowContentItem) => {
    const payload = {
      title: item.title,
      dramaType: item.dramaType,
      showDramaType: item.showDramaType,
      shortDescription: item.shortDescription,
      awardWinnerCategory: item.awardWinnerCategory,
      awardGivenInstitution: item.awardGivenInstitution,
      showAwards: item.showAwards,
      imdbScore: item.imdbScore,
      showImdbScore: item.showImdbScore,
      link: item.link,
      image: item.image,
      homepageStatus: !item.homepageStatus,
    };

    try {
      const res = await fetch(`/api/shows/${item._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(!item.homepageStatus ? "Added to homepage" : "Removed from homepage");
        await fetchShows();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to toggle status", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  // ==========================================
  // INITIALIZATION & LOGOUT
  // ==========================================
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.replace("/admin/login");
          return;
        }
        const authData = await authRes.json();
        setAdminEmail(authData.admin.email);
        
        await fetchHeroes();
        await fetchShows();
      } catch (err) {
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.replace("/admin/login");
      }
    } catch (err) {
      showToast("Logout failed", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
          <p className="text-sm font-semibold tracking-wider text-white/60 uppercase animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const activeHero = heroes.find(h => h.currentActiveOnLiveSite);
  const homepageShowsCount = shows.filter(s => s.homepageStatus).length;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-50 rounded-xl px-5 py-3 border text-sm font-bold shadow-2xl flex items-center gap-2 ${
              toast.type === "success" 
                ? "bg-green-500/10 border-green-500/20 text-green-400" 
                : "bg-primary/10 border-primary/20 text-primary"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-white/[0.01] p-6 justify-between shrink-0">
        <div className="space-y-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo-color.svg" alt="TVF Logo" className="h-12 object-contain" />
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/80">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("hero")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "hero" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutGrid className="h-4 w-4" /> Hero Section
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "content" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Film className="h-4 w-4" /> Content Manager
            </button>
            <a 
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm uppercase font-bold tracking-wider"
            >
              <ArrowLeft className="h-4 w-4" /> View Live Site
            </a>
          </nav>
        </div>

        {/* User Footer block */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="px-2">
            <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Logged In As</p>
            <p className="text-xs text-white/80 font-semibold truncate" title={adminEmail}>
              {adminEmail}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-white/10 hover:border-primary/50 text-white/70 hover:text-primary transition-all text-xs uppercase font-bold tracking-wider cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Mobile Nav */}
        <header className="flex lg:hidden items-center justify-between border-b border-white/10 bg-white/[0.01] px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo-color.svg" alt="TVF Logo" className="h-10 object-contain" />
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/80">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab(activeTab === "hero" ? "content" : "hero")}
              className="text-white/60 hover:text-white transition-colors"
            >
              {activeTab === "hero" ? <Film className="h-5 w-5" /> : <LayoutGrid className="h-5 w-5" />}
            </button>
            <a href="/" className="text-white/60 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </a>
            <button onClick={handleLogout} className="text-white/60 hover:text-primary transition-colors cursor-pointer">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Inner Scrollable Workspace */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-[1500px] w-full mx-auto space-y-10">
          
          {/* ======================================================== */}
          {/* TAB 1: HERO SECTION MANAGER */}
          {/* ======================================================== */}
          {activeTab === "hero" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Hero Section Manager
                  </h1>
                  <p className="text-white/50 text-sm">
                    Control, create, and prioritize your live site landing banner elements.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Items</p>
                    <p className="text-2xl font-extrabold text-white">{heroes.length}</p>
                  </div>
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[150px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Active Element</p>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${activeHero ? "bg-green-500 animate-pulse" : "bg-primary"}`} />
                      <span className="text-xs uppercase font-extrabold tracking-wider">
                        {activeHero ? "Published" : "None"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Form */}
                <div className="xl:col-span-5 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" /> 
                        {editingHeroId ? "Modify Hero Details" : "Create Hero Banner"}
                      </h3>
                      {editingHeroId && (
                        <button 
                          onClick={resetHeroForm}
                          className="text-xs font-bold text-white/40 hover:text-primary uppercase tracking-wider cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleHeroFormSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Super-Tag / Pill Text
                        </label>
                        <input
                          type="text"
                          required
                          value={heroTag}
                          onChange={(e) => setHeroTag(e.target.value)}
                          placeholder="e.g. India's Premium Digital Content Creators"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Main Banner Title
                        </label>
                        <input
                          type="text"
                          required
                          value={heroTitle}
                          onChange={(e) => setHeroTitle(e.target.value)}
                          placeholder="e.g. The Viral Fever"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Description / Sub-Headline
                        </label>
                        <textarea
                          required
                          value={heroShortDescription}
                          onChange={(e) => setHeroShortDescription(e.target.value)}
                          placeholder="Describe the content series or message..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium resize-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Target Action Link / URL
                        </label>
                        <input
                          type="text"
                          required
                          value={heroLink}
                          onChange={(e) => setHeroLink(e.target.value)}
                          placeholder="e.g. /originals or external YouTube URL"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wide text-white">Publish Live</p>
                          <p className="text-[10px] text-white/40">Set this banner active on the homepage header.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={heroActive}
                            onChange={(e) => setHeroActive(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" />
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingHero}
                        className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/10 cursor-pointer disabled:opacity-50"
                      >
                        {submittingHero ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ) : editingHeroId ? (
                          "Update Banner Details"
                        ) : (
                          "Add to Directory"
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Hero Directory List */}
                <div className="xl:col-span-7 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                      Content Library ({heroes.length})
                    </h3>
                    <button 
                      onClick={fetchHeroes} 
                      className="p-1.5 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>

                  {heroes.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No items found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {heroes.map((item) => (
                        <motion.div
                          key={item._id}
                          layout
                          className={`rounded-xl border p-5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                            item.currentActiveOnLiveSite 
                              ? "border-green-500/35 hover:border-green-500/50 shadow-[0_0_15px_-3px_rgba(34,197,94,0.1)]" 
                              : "border-white/5 hover:border-white/10"
                          }`}
                        >
                          <div className="space-y-3 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-white/5 border border-white/10 text-white/70 uppercase tracking-wider truncate max-w-[200px]">
                                {item.tag}
                              </span>
                              
                              <button
                                onClick={() => toggleHeroActiveStatus(item)}
                                className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                                  item.currentActiveOnLiveSite
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                                    : "bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {item.currentActiveOnLiveSite ? (
                                  <>
                                    <CheckCircle className="h-2.5 w-2.5" /> Published
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-2.5 w-2.5" /> Offline
                                  </>
                                )}
                              </button>
                            </div>

                            <h4 className="text-lg font-bold text-white uppercase tracking-wide leading-tight truncate">
                              {item.title}
                            </h4>

                            <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                              {item.shortDescription}
                            </p>

                            <div className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-white transition-colors truncate">
                              <ExternalLink className="h-3 w-3" />
                              <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                {item.link}
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center md:flex-col gap-3 justify-end border-t md:border-t-0 border-white/5 pt-4 md:pt-0 shrink-0">
                            <button
                              onClick={() => startHeroEdit(item)}
                              className={`p-2.5 rounded-lg border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-white/70 hover:text-white transition-all cursor-pointer ${
                                editingHeroId === item._id ? "border-primary/50 text-primary hover:text-primary" : ""
                              }`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {deleteConfirmHeroId === item._id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleHeroDelete(item._id)}
                                  className="px-2.5 py-1.5 rounded bg-primary hover:bg-white text-black font-extrabold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmHeroId(null)}
                                  className="p-1.5 rounded border border-white/10 text-white/60 hover:text-white cursor-pointer"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmHeroId(item._id)}
                                className="p-2.5 rounded-lg border border-white/5 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/10 text-white/70 hover:text-primary transition-all cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CONTENT MANAGEMENT MODULE */}
          {/* ======================================================== */}
          {activeTab === "content" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Content Management
                  </h1>
                  <p className="text-white/50 text-sm">
                    Manage series, dramas, ratings, laurels, and homepage grid status.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Shows</p>
                    <p className="text-2xl font-extrabold text-white">{shows.length}</p>
                  </div>
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[150px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Live Homepage</p>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className={`h-2.5 w-2.5 rounded-full ${homepageShowsCount > 0 ? "bg-green-500 animate-pulse" : "bg-white/20"}`} />
                      <p className="text-xs uppercase font-extrabold tracking-wider text-white">
                        {homepageShowsCount} Shows
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Left Form: Create/Edit Shows */}
                <div className="xl:col-span-5 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" /> 
                        {editingShowId ? "Modify Show Details" : "Create New Show"}
                      </h3>
                      {editingShowId && (
                        <button 
                          onClick={resetShowForm}
                          className="text-xs font-bold text-white/40 hover:text-primary uppercase tracking-wider cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleShowFormSubmit} className="space-y-5">
                      
                      {/* Title */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Show Title (Required)
                        </label>
                        <input
                          type="text"
                          required
                          value={showTitle}
                          onChange={(e) => setShowTitle(e.target.value)}
                          placeholder="e.g. Panchayat"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Show Poster Image (Required)
                        </label>
                        
                        <div className="space-y-3">
                          {/* Selected image preview */}
                          {showImage && (
                            <div className="relative w-28 h-36 rounded-lg overflow-hidden border border-white/10 bg-black group">
                              <img
                                src={showImage}
                                alt="Show Poster Preview"
                                className="object-cover w-full h-full"
                              />
                              <button
                                type="button"
                                onClick={() => setShowImage("")}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold uppercase text-primary tracking-wider"
                              >
                                Remove
                              </button>
                            </div>
                          )}

                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-file-input"
                            />
                            <label
                              htmlFor="image-file-input"
                              className={`w-full flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg bg-black/40 text-white/60 hover:text-white transition-all cursor-pointer ${
                                uploading 
                                  ? "border-primary/20 cursor-not-allowed opacity-50" 
                                  : "border-white/10 hover:border-primary/40"
                              }`}
                            >
                              {uploading ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                  <span className="text-xs uppercase font-extrabold tracking-wider">Uploading to Cloudinary...</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <Plus className="h-5 w-5 text-primary" />
                                  <span className="text-xs uppercase font-extrabold tracking-wider">
                                    {showImage ? "Change Selected Image" : "Upload Poster Image"}
                                  </span>
                                  <span className="text-[10px] text-white/30">PNG, JPG, JPEG up to 10MB</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Target Link */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Target Action Link / Watch URL (Required)
                        </label>
                        <input
                          type="text"
                          required
                          value={showLink}
                          onChange={(e) => setShowLink(e.target.value)}
                          placeholder="e.g. https://www.youtube.com/... or /originals"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Short Description (Required)
                        </label>
                        <textarea
                          required
                          value={showShortDescription}
                          onChange={(e) => setShowShortDescription(e.target.value)}
                          placeholder="Provide a short synopsis of the series..."
                          rows={3}
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium resize-none"
                        />
                      </div>

                      {/* Drama Type Optional Section */}
                      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Drama Type (Optional)</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={showShowDramaType}
                              onChange={(e) => setShowShowDramaType(e.target.checked)}
                              className="accent-primary rounded"
                            />
                            Show on live site
                          </label>
                        </div>
                        <input
                          type="text"
                          value={showDramaType}
                          onChange={(e) => setShowDramaType(e.target.value)}
                          placeholder="e.g. Family Comedy / Drama"
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      {/* IMDb Score Optional Section */}
                      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">IMDb Score (Optional)</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={showShowImdbScore}
                              onChange={(e) => setShowShowImdbScore(e.target.checked)}
                              className="accent-primary rounded"
                            />
                            Show on live site
                          </label>
                        </div>
                        <input
                          type="text"
                          value={showImdbScore}
                          onChange={(e) => setShowImdbScore(e.target.value)}
                          placeholder="e.g. 8.9"
                          className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      {/* Laurels / Awards Optional Section */}
                      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Laurels / Awards (Optional)</span>
                          <label className="flex items-center gap-1.5 cursor-pointer text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={showShowAwards}
                              onChange={(e) => setShowShowAwards(e.target.checked)}
                              className="accent-primary rounded"
                            />
                            Show on live site
                          </label>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={showAwardWinnerCategory}
                            onChange={(e) => setShowAwardWinnerCategory(e.target.value)}
                            placeholder="Award Category (e.g. Best Comedy Series)"
                            className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                          />
                          <input
                            type="text"
                            value={showAwardGivenInstitution}
                            onChange={(e) => setShowAwardGivenInstitution(e.target.value)}
                            placeholder="Award Given Institution (e.g. Filmfare Awards)"
                            className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                          />
                        </div>
                      </div>

                      {/* Homepage status toggle */}
                      <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.02] border border-white/5">
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wide text-white">Show in Homepage Grid</p>
                          <p className="text-[10px] text-white/40">Include this show card in Binge-Worthy grid.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={showHomepageStatus}
                            onChange={(e) => setShowHomepageStatus(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500" />
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingShow}
                        className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/10 cursor-pointer disabled:opacity-50"
                      >
                        {submittingShow ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ) : editingShowId ? (
                          "Update Show Details"
                        ) : (
                          "Add Show to Library"
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Column: List of Shows */}
                <div className="xl:col-span-7 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                      Show Catalogue ({shows.length})
                    </h3>
                    <button 
                      onClick={fetchShows} 
                      className="p-1.5 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>

                  {shows.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No shows found</p>
                      <p className="text-xs">Create a show item to begin populating your catalogue.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {shows.map((item) => (
                        <motion.div
                          key={item._id}
                          layout
                          className={`rounded-xl border p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-all relative flex flex-col sm:flex-row gap-5 ${
                            item.homepageStatus 
                              ? "border-green-500/25 shadow-[0_0_15px_-3px_rgba(34,197,94,0.05)]" 
                              : "border-white/5"
                          }`}
                        >
                          {/* Image Box */}
                          <div className="relative w-24 h-32 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          {/* Content Block */}
                          <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                {/* Drama Type Badge */}
                                {item.dramaType && (
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider truncate max-w-[120px] ${
                                    item.showDramaType ? "bg-primary/10 border border-primary/20 text-primary" : "bg-white/5 border border-white/10 text-white/40"
                                  }`}>
                                    {item.dramaType}
                                  </span>
                                )}

                                {/* IMDb Rating Badge */}
                                {item.imdbScore && (
                                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                    item.showImdbScore ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : "bg-white/5 border-white/10 text-white/40"
                                  }`}>
                                    <Star className="h-2.5 w-2.5 fill-current" /> {item.imdbScore}
                                  </span>
                                )}

                                {/* Award Badge */}
                                {item.awardWinnerCategory && (
                                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                    item.showAwards ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-white/5 border-white/10 text-white/40"
                                  }`}>
                                    <Award className="h-2.5 w-2.5" /> Award
                                  </span>
                                )}
                              </div>

                              <h4 className="text-base font-bold text-white uppercase tracking-wide leading-tight truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-white/50 leading-relaxed line-clamp-2">
                                {item.shortDescription}
                              </p>
                            </div>

                            {/* Active Homepage Toggle */}
                            <div className="flex flex-wrap items-center gap-4 mt-3">
                              <button
                                onClick={() => toggleShowHomepageStatus(item)}
                                className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                                  item.homepageStatus
                                    ? "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                                    : "bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10"
                                }`}
                              >
                                {item.homepageStatus ? "Live on Grid" : "Offline"}
                              </button>
                              
                              <span className="text-[10px] text-white/30 truncate max-w-[200px]" title={item.link}>
                                Link: {item.link}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex sm:flex-col items-center justify-end gap-2.5 border-t sm:border-t-0 border-white/5 pt-3 sm:pt-0 shrink-0">
                            <button
                              onClick={() => startShowEdit(item)}
                              className={`p-2.5 rounded-lg border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-white/70 hover:text-white transition-all cursor-pointer ${
                                editingShowId === item._id ? "border-primary/50 text-primary hover:text-primary" : ""
                              }`}
                              title="Edit Show"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            {deleteConfirmShowId === item._id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleShowDelete(item._id)}
                                  className="px-2 py-1.5 rounded bg-primary hover:bg-white text-black font-extrabold text-[9px] uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Del
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmShowId(null)}
                                  className="p-1 rounded border border-white/10 text-white/60 hover:text-white"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmShowId(item._id)}
                                className="p-2.5 rounded-lg border border-white/5 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/10 text-white/70 hover:text-primary transition-all cursor-pointer"
                                title="Delete Show"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
