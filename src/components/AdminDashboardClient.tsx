"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit2, Trash2, LayoutGrid, Gauge, CheckCircle, 
  XCircle, ExternalLink, Sparkles, LogOut, ArrowLeft, RefreshCw,
  Film, Award, Star, Radio, Images, Newspaper, Bold, Italic, 
  Underline, List, ListOrdered, Heading2, Heading3, AlignLeft, 
  AlignCenter, AlignRight, Link2, FileText, Image as ImageIcon,
  Building, Mail, Loader2
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

interface CastMember {
  name: string;
  role?: string;
  image: string;
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
  cast?: CastMember[];
}

interface SisterChannelItem {
  _id: string;
  logo: string;
  title: string;
  subscriber: string;
  link: string;
  createdAt: string;
}

interface GalleryItem {
  _id: string;
  url: string;
  createdAt: string;
}

interface Brand {
  name: string;
  logo: string;
  _id?: string;
}

interface BrandedCategoryItem {
  _id: string;
  name: string;
  createdAt: string;
}

interface BrandedBrandItem {
  _id: string;
  name: string;
  logo: string;
  category: string | { _id: string; name: string };
  createdAt: string;
}

interface PartnerInquiryItem {
  _id: string;
  name: string;
  phone: string;
  email: string;
  institution?: string;
  message: string;
  createdAt: string;
}

interface UnusedImageItem {
  public_id: string;
  secure_url: string;
  bytes: number;
  created_at: string;
}

export default function AdminDashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "hero" | "content" | "sister-channels" | "gallery" | "blog" | "branded-content" | "partner-inquiries" | "unused-images">("dashboard");
  
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

  // Cast & Crew State
  const [newCastName, setNewCastName] = useState("");
  const [newCastRole, setNewCastRole] = useState("");
  const [newCastImage, setNewCastImage] = useState("");
  const [uploadingCastImage, setUploadingCastImage] = useState(false);
  const [showCast, setShowCast] = useState<CastMember[]>([]);

  // Content Manager Search, Sort, Pagination states
  const [showSearchQuery, setShowSearchQuery] = useState("");
  const [showSortOrder, setShowSortOrder] = useState<"newest" | "oldest" | "title-asc" | "title-desc">("newest");
  const [showCurrentPage, setShowCurrentPage] = useState(1);

  useEffect(() => {
    setShowCurrentPage(1);
  }, [showSearchQuery, showSortOrder]);

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

  const handleCastImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCastImage(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewCastImage(data.url);
        showToast("Cast photo uploaded successfully");
      } else {
        showToast(data.error || "Failed to upload cast image", "error");
      }
    } catch (err) {
      showToast("Cast photo upload network error", "error");
    } finally {
      setUploadingCastImage(false);
    }
  };

  const addCastMember = () => {
    if (!newCastName.trim()) {
      showToast("Please enter a name for the cast member", "error");
      return;
    }
    if (!newCastImage) {
      showToast("Please upload an avatar image for the cast member", "error");
      return;
    }
    setShowCast([...showCast, { name: newCastName.trim(), role: newCastRole.trim() || undefined, image: newCastImage }]);
    setNewCastName("");
    setNewCastRole("");
    setNewCastImage("");
  };

  const removeCastMember = (index: number) => {
    setShowCast(showCast.filter((_, idx) => idx !== index));
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
      cast: showCast,
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
    setShowCast([]);
    setNewCastName("");
    setNewCastRole("");
    setNewCastImage("");
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
    setShowCast(item.cast || []);
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
      cast: item.cast || [],
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
  // TAB 3: SISTER CHANNELS STATE & HANDLERS
  // ==========================================
  const [channels, setChannels] = useState<SisterChannelItem[]>([]);
  const [editingChannelId, setEditingChannelId] = useState<string | null>(null);
  const [deleteConfirmChannelId, setDeleteConfirmChannelId] = useState<string | null>(null);

  const [channelTitle, setChannelTitle] = useState("");
  const [channelSubscriber, setChannelSubscriber] = useState("");
  const [channelLink, setChannelLink] = useState("");
  const [channelLogo, setChannelLogo] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [submittingChannel, setSubmittingChannel] = useState(false);

  const fetchChannels = async () => {
    try {
      const res = await fetch("/api/sister-channels");
      if (res.ok) {
        const data = await res.json();
        setChannels(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch sister channels", "error");
    }
  };

  const handleChannelLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setChannelLogo(data.url);
        showToast("Logo uploaded successfully");
      } else {
        showToast(data.error || "Failed to upload logo", "error");
      }
    } catch (err) {
      showToast("Logo upload network error", "error");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleChannelFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingChannel(true);

    if (!channelLogo) {
      showToast("Please upload a logo image first", "error");
      setSubmittingChannel(false);
      return;
    }

    const payload = {
      title: channelTitle,
      subscriber: channelSubscriber,
      link: channelLink,
      logo: channelLogo,
    };

    try {
      const url = editingChannelId ? `/api/sister-channels/${editingChannelId}` : "/api/sister-channels";
      const method = editingChannelId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingChannelId ? "Sister channel updated successfully" : "Sister channel created successfully");
        resetChannelForm();
        await fetchChannels();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    } finally {
      setSubmittingChannel(false);
    }
  };

  const resetChannelForm = () => {
    setChannelTitle("");
    setChannelSubscriber("");
    setChannelLink("");
    setChannelLogo("");
    setEditingChannelId(null);
  };

  const startChannelEdit = (item: SisterChannelItem) => {
    setEditingChannelId(item._id);
    setChannelTitle(item.title);
    setChannelSubscriber(item.subscriber);
    setChannelLink(item.link);
    setChannelLogo(item.logo);
  };

  const handleChannelDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sister-channels/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Sister channel deleted successfully");
        if (editingChannelId === id) resetChannelForm();
        setDeleteConfirmChannelId(null);
        await fetchChannels();
      } else {
        const data = await res.json();
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  // ==========================================
  // TAB 4: GALLERY MANAGEMENT STATE & HANDLERS
  // ==========================================
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [deleteConfirmGalleryId, setDeleteConfirmGalleryId] = useState<string | null>(null);
  const [gallerySortOrder, setGallerySortOrder] = useState<"desc" | "asc">("desc");
  const [galleryCurrentPage, setGalleryCurrentPage] = useState(1);

  useEffect(() => {
    setGalleryCurrentPage(1);
  }, [gallerySortOrder]);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      if (res.ok) {
        const data = await res.json();
        setGallery(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch gallery posters", "error");
    }
  };

  const handleGalleryUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGalleryFiles || selectedGalleryFiles.length === 0) {
      showToast("Please select at least one image file", "error");
      return;
    }

    setUploadingGallery(true);
    const uploadedUrls: string[] = [];
    const totalFiles = selectedGalleryFiles.length;

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = selectedGalleryFiles[i];
        setUploadProgress(`Uploading image ${i + 1} of ${totalFiles}...`);

        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            uploadedUrls.push(data.url);
          } else {
            showToast(`Failed to upload ${file.name}: ${data.error || "Unknown error"}`, "error");
          }
        } else {
          showToast(`Network error uploading ${file.name}`, "error");
        }
      }

      if (uploadedUrls.length === 0) {
        showToast("No images were successfully uploaded", "error");
        setUploadingGallery(false);
        return;
      }

      setUploadProgress("Saving image links to database...");
      
      const saveRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: uploadedUrls }),
      });

      if (saveRes.ok) {
        showToast(`Successfully uploaded ${uploadedUrls.length} images!`);
        setSelectedGalleryFiles(null);
        const input = document.getElementById("gallery-files-input") as HTMLInputElement;
        if (input) input.value = "";
        
        await fetchGallery();
      } else {
        const data = await saveRes.json();
        showToast(data.error || "Failed to save image gallery records", "error");
      }
    } catch (err) {
      showToast("An error occurred during gallery upload", "error");
    } finally {
      setUploadingGallery(false);
      setUploadProgress(null);
    }
  };

  const handleGalleryDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Poster deleted successfully");
        setDeleteConfirmGalleryId(null);
        await fetchGallery();
      } else {
        const data = await res.json();
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  // ==========================================
  // TAB 5: BLOG CONTENT STATE & HANDLERS
  // ==========================================
  interface BlogPostItem {
    _id: string;
    banner: string;
    title: string;
    blogdate: string;
    content: string;
    createdAt: string;
  }

  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogBanner, setBlogBanner] = useState("");
  const [blogDate, setBlogDate] = useState("");
  const [blogContent, setBlogContent] = useState("");
  
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [deleteConfirmBlogId, setDeleteConfirmBlogId] = useState<string | null>(null);
  const [submittingBlog, setSubmittingBlog] = useState(false);
  const [uploadingBlogBanner, setUploadingBlogBanner] = useState(false);
  
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [blogSortOrder, setBlogSortOrder] = useState<"desc" | "asc">("desc");
  const [blogCurrentPage, setBlogCurrentPage] = useState(1);
  
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBlogCurrentPage(1);
  }, [blogSearchQuery, blogSortOrder]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch blog posts", "error");
    }
  };

  const handleBlogBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBlogBanner(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBlogBanner(data.url);
        showToast("Blog banner uploaded successfully");
      } else {
        showToast(data.error || "Failed to upload banner", "error");
      }
    } catch (err) {
      showToast("Banner upload network error", "error");
    } finally {
      setUploadingBlogBanner(false);
    }
  };

  const handleInsertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      showToast("Uploading editor image...");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        editorRef.current?.focus();
        document.execCommand("insertImage", false, data.url);
        const imgs = editorRef.current?.getElementsByTagName("img");
        if (imgs) {
          for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            if (img.src === data.url && !img.className) {
              img.className = "rounded-xl my-4 max-h-[350px] object-cover block mx-auto border border-white/10";
            }
          }
        }
        showToast("Image inserted successfully");
      } else {
        showToast(data.error || "Failed to upload image", "error");
      }
    } catch (err) {
      showToast("Upload error", "error");
    }
  };

  const handleBlogFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBlog(true);

    const contentHtml = editorRef.current?.innerHTML || "";

    if (!blogBanner) {
      showToast("Please upload a blog banner first", "error");
      setSubmittingBlog(false);
      return;
    }

    if (!contentHtml.trim() || contentHtml === "<br>" || contentHtml === "<div><br></div>") {
      showToast("Please write some content for the blog post", "error");
      setSubmittingBlog(false);
      return;
    }

    const payload = {
      title: blogTitle.trim(),
      banner: blogBanner,
      blogdate: blogDate || undefined,
      content: contentHtml,
    };

    try {
      const url = editingBlogId ? `/api/blog/${editingBlogId}` : "/api/blog";
      const method = editingBlogId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingBlogId ? "Blog post updated successfully" : "Blog post created successfully");
        resetBlogForm();
        await fetchBlogs();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    } finally {
      setSubmittingBlog(false);
    }
  };

  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogBanner("");
    setBlogDate("");
    setBlogContent("");
    setEditingBlogId(null);
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
  };

  const startBlogEdit = (item: BlogPostItem) => {
    setEditingBlogId(item._id);
    setBlogTitle(item.title);
    setBlogBanner(item.banner);
    setBlogDate(item.blogdate ? new Date(item.blogdate).toISOString().split("T")[0] : "");
    setBlogContent(item.content);
    if (editorRef.current) {
      editorRef.current.innerHTML = item.content;
    }
  };

  const handleBlogDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Blog post deleted successfully");
        if (editingBlogId === id) resetBlogForm();
        setDeleteConfirmBlogId(null);
        await fetchBlogs();
      } else {
        const data = await res.json();
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  // ==========================================
  // TAB 6: BRANDED CONTENT STATE & HANDLERS
  // ==========================================
  const [brandedCategories, setBrandedCategories] = useState<BrandedCategoryItem[]>([]);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deleteConfirmCategoryId, setDeleteConfirmCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [submittingCategory, setSubmittingCategory] = useState(false);

  const [brandedBrands, setBrandedBrands] = useState<BrandedBrandItem[]>([]);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [deleteConfirmBrandId, setDeleteConfirmBrandId] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [brandCategoryId, setBrandCategoryId] = useState("");
  const [uploadingBrandLogo, setUploadingBrandLogo] = useState(false);
  const [submittingBrand, setSubmittingBrand] = useState(false);

  // ==========================================
  // TAB 7: PARTNER INQUIRIES STATE & HANDLERS
  // ==========================================
  const [partnerInquiries, setPartnerInquiries] = useState<PartnerInquiryItem[]>([]);
  const [deleteConfirmInquiryId, setDeleteConfirmInquiryId] = useState<string | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<PartnerInquiryItem | null>(null);

  const fetchBrandedCategories = async () => {
    try {
      const res = await fetch("/api/branded-content/category");
      if (res.ok) {
        const data = await res.json();
        setBrandedCategories(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch branded categories", "error");
    }
  };

  const fetchBrandedBrands = async () => {
    try {
      const res = await fetch("/api/branded-content/brand");
      if (res.ok) {
        const data = await res.json();
        setBrandedBrands(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch branded brands", "error");
    }
  };

  const fetchPartnerInquiries = async () => {
    try {
      const res = await fetch("/api/partner");
      if (res.ok) {
        const data = await res.json();
        setPartnerInquiries(data.data || []);
      }
    } catch (err) {
      showToast("Failed to fetch partner inquiries", "error");
    }
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingBrandLogo(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBrandLogo(data.url);
        showToast("Brand logo uploaded successfully");
      } else {
        showToast(data.error || "Failed to upload brand logo", "error");
      }
    } catch (err) {
      showToast("Logo upload network error", "error");
    } finally {
      setUploadingBrandLogo(false);
    }
  };

  const handleCategoryFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingCategory(true);

    if (!categoryName.trim()) {
      showToast("Please enter a category name", "error");
      setSubmittingCategory(false);
      return;
    }

    try {
      const url = editingCategoryId ? `/api/branded-content/category/${editingCategoryId}` : "/api/branded-content/category";
      const method = editingCategoryId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingCategoryId ? "Category updated successfully" : "Category created successfully");
        resetCategoryForm();
        await fetchBrandedCategories();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    } finally {
      setSubmittingCategory(false);
    }
  };

  const handleBrandFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingBrand(true);

    if (!brandName.trim() || !brandLogo || !brandCategoryId) {
      showToast("Please fill out all fields (name, logo, category)", "error");
      setSubmittingBrand(false);
      return;
    }

    const payload = {
      name: brandName.trim(),
      logo: brandLogo,
      category: brandCategoryId,
    };

    try {
      const url = editingBrandId ? `/api/branded-content/brand/${editingBrandId}` : "/api/branded-content/brand";
      const method = editingBrandId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(editingBrandId ? "Brand updated successfully" : "Brand created successfully");
        resetBrandForm();
        await fetchBrandedBrands();
      } else {
        showToast(data.error || "Operation failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    } finally {
      setSubmittingBrand(false);
    }
  };

  const startCategoryEdit = (item: BrandedCategoryItem) => {
    setEditingCategoryId(item._id);
    setCategoryName(item.name);
  };

  const startBrandEdit = (item: BrandedBrandItem) => {
    setEditingBrandId(item._id);
    setBrandName(item.name);
    setBrandLogo(item.logo);
    const catId = typeof item.category === "object" ? item.category?._id : item.category;
    setBrandCategoryId(catId || "");
  };

  const handleCategoryDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/branded-content/category/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showToast("Category deleted successfully");
        if (editingCategoryId === id) resetCategoryForm();
        setDeleteConfirmCategoryId(null);
        await fetchBrandedCategories();
      } else {
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  const handleBrandDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/branded-content/brand/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Brand deleted successfully");
        if (editingBrandId === id) resetBrandForm();
        setDeleteConfirmBrandId(null);
        await fetchBrandedBrands();
      } else {
        const data = await res.json();
        showToast(data.error || "Delete failed", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  const resetCategoryForm = () => {
    setCategoryName("");
    setEditingCategoryId(null);
  };

  const resetBrandForm = () => {
    setBrandName("");
    setBrandLogo("");
    setBrandCategoryId("");
    setEditingBrandId(null);
  };

  const handleInquiryDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/partner/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Inquiry dismissed successfully");
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
        setDeleteConfirmInquiryId(null);
        await fetchPartnerInquiries();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to dismiss inquiry", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    }
  };

  // ==========================================
  // TAB 8: UNUSED IMAGES STATE & HANDLERS
  // ==========================================
  const [unusedImages, setUnusedImages] = useState<UnusedImageItem[]>([]);
  const [selectedUnusedPids, setSelectedUnusedPids] = useState<string[]>([]);
  const [deletingUnused, setDeletingUnused] = useState(false);
  const [scanningUnused, setScanningUnused] = useState(false);

  const fetchUnusedImages = async () => {
    setScanningUnused(true);
    try {
      const res = await fetch("/api/unused-images");
      if (res.ok) {
        const data = await res.json();
        setUnusedImages(data.data || []);
        setSelectedUnusedPids([]);
      }
    } catch (err) {
      showToast("Failed to fetch unused images", "error");
    } finally {
      setScanningUnused(false);
    }
  };

  const handleDeleteUnusedImages = async (pids: string[]) => {
    if (pids.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${pids.length} image(s) from Cloudinary?`)) return;

    setDeletingUnused(true);
    try {
      const res = await fetch("/api/unused-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_ids: pids }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Deleted ${pids.length} image(s) successfully`);
        await fetchUnusedImages();
      } else {
        showToast(data.error || "Failed to delete images", "error");
      }
    } catch (err) {
      showToast("Connection error occurred", "error");
    } finally {
      setDeletingUnused(false);
    }
  };

  const toggleUnusedSelection = (pid: string) => {
    if (selectedUnusedPids.includes(pid)) {
      setSelectedUnusedPids(selectedUnusedPids.filter((p) => p !== pid));
    } else {
      setSelectedUnusedPids([...selectedUnusedPids, pid]);
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
        await fetchChannels();
        await fetchGallery();
        await fetchBlogs();
        await fetchBrandedCategories();
        await fetchBrandedBrands();
        await fetchPartnerInquiries();
        await fetchUnusedImages();
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

  // Filter search
  const filteredShows = shows.filter((show) =>
    show.title.toLowerCase().includes(showSearchQuery.toLowerCase())
  );

  // Sort
  const sortedShows = [...filteredShows].sort((a, b) => {
    if (showSortOrder === "title-asc") {
      return a.title.localeCompare(b.title);
    } else if (showSortOrder === "title-desc") {
      return b.title.localeCompare(a.title);
    } else if (showSortOrder === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (showSortOrder === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  // Paginate
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(sortedShows.length / ITEMS_PER_PAGE) || 1;
  const paginatedShows = sortedShows.slice(
    (showCurrentPage - 1) * ITEMS_PER_PAGE,
    showCurrentPage * ITEMS_PER_PAGE
  );

  // Sort gallery
  const sortedGallery = [...gallery].sort((a, b) => {
    if (gallerySortOrder === "desc") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
  });

  // Paginate gallery
  const GALLERY_ITEMS_PER_PAGE = 18;
  const galleryTotalPages = Math.ceil(sortedGallery.length / GALLERY_ITEMS_PER_PAGE) || 1;
  const paginatedGallery = sortedGallery.slice(
    (galleryCurrentPage - 1) * GALLERY_ITEMS_PER_PAGE,
    galleryCurrentPage * GALLERY_ITEMS_PER_PAGE
  );

  // Filter blog search
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(blogSearchQuery.toLowerCase())
  );

  // Sort blogs
  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    if (blogSortOrder === "desc") {
      return new Date(b.blogdate).getTime() - new Date(a.blogdate).getTime();
    } else {
      return new Date(a.blogdate).getTime() - new Date(b.blogdate).getTime();
    }
  });

  // Paginate blogs
  const BLOG_ITEMS_PER_PAGE = 6;
  const blogTotalPages = Math.ceil(sortedBlogs.length / BLOG_ITEMS_PER_PAGE) || 1;
  const paginatedBlogs = sortedBlogs.slice(
    (blogCurrentPage - 1) * BLOG_ITEMS_PER_PAGE,
    blogCurrentPage * BLOG_ITEMS_PER_PAGE
  );

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
            <span className="text-primary font-black uppercase text-xl tracking-widest">
              CINEPLUS
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/80">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "dashboard" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Gauge className="h-4 w-4" /> Dashboard
            </button>
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
            <button
              onClick={() => setActiveTab("sister-channels")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "sister-channels" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Radio className="h-4 w-4" /> Sister Channels
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "gallery" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Images className="h-4 w-4" /> Gallery Manager
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "blog" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Newspaper className="h-4 w-4" /> Blog Manager
            </button>
            <button
              onClick={() => setActiveTab("branded-content")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "branded-content" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building className="h-4 w-4" /> Branded Content
            </button>
            <button
              onClick={() => setActiveTab("partner-inquiries")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "partner-inquiries" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Mail className="h-4 w-4" /> Partner Inquiries
            </button>
            <button
              onClick={() => setActiveTab("unused-images")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === "unused-images" 
                  ? "bg-primary/10 border border-primary/20 text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Trash2 className="h-4 w-4" /> Unused Images
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
      <div className="flex-grow flex flex-col min-w-0">
        {/* Top Header Mobile Nav */}
        <header className="flex lg:hidden items-center justify-between border-b border-white/10 bg-white/[0.01] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-primary font-black uppercase text-lg tracking-widest">
              CINEPLUS
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-white/80">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                if (activeTab === "dashboard") setActiveTab("hero");
                else if (activeTab === "hero") setActiveTab("content");
                else if (activeTab === "content") setActiveTab("sister-channels");
                else if (activeTab === "sister-channels") setActiveTab("gallery");
                else if (activeTab === "gallery") setActiveTab("blog");
                else if (activeTab === "blog") setActiveTab("branded-content");
                else if (activeTab === "branded-content") setActiveTab("partner-inquiries");
                else if (activeTab === "partner-inquiries") setActiveTab("unused-images");
                else setActiveTab("dashboard");
              }}
              className="text-white/60 hover:text-white transition-colors flex items-center gap-1"
            >
              {activeTab === "dashboard" ? (
                <LayoutGrid className="h-5 w-5" />
              ) : activeTab === "hero" ? (
                <Film className="h-5 w-5" />
              ) : activeTab === "content" ? (
                <Radio className="h-5 w-5" />
              ) : activeTab === "sister-channels" ? (
                <Images className="h-5 w-5" />
              ) : activeTab === "gallery" ? (
                <Newspaper className="h-5 w-5" />
              ) : activeTab === "blog" ? (
                <Building className="h-5 w-5" />
              ) : activeTab === "branded-content" ? (
                <Mail className="h-5 w-5" />
              ) : activeTab === "partner-inquiries" ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <Gauge className="h-5 w-5" />
              )}
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
          {/* TAB 0: PROJECT SUMMARY DASHBOARD */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <>
              {/* Dashboard Header */}
              <div className="pb-6 border-b border-white/5 space-y-2">
                <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white">
                  Cineplus Studio Dashboard
                </h1>
                <p className="text-white/50 text-sm">
                  Welcome back, administrator. Here is a live summary of your digital storytelling ecosystem.
                </p>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                
                {/* 1. Hero Content Card */}
                <div 
                  onClick={() => setActiveTab("hero")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <LayoutGrid className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Landing Page Banner
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Hero Section</h3>
                    <p className="text-2xl font-black mt-1">
                      {heroes.length} <span className="text-xs font-semibold text-white/50">Items ({heroes.filter(h => h.currentActiveOnLiveSite).length} Active)</span>
                    </p>
                  </div>
                </div>

                {/* 2. Content Manager Card */}
                <div 
                  onClick={() => setActiveTab("content")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <Film className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Original Shows
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Content Manager</h3>
                    <p className="text-2xl font-black mt-1">
                      {shows.length} <span className="text-xs font-semibold text-white/50">Shows ({shows.filter(s => s.homepageStatus).length} on Home)</span>
                    </p>
                  </div>
                </div>

                {/* 3. Sister Channels Card */}
                <div 
                  onClick={() => setActiveTab("sister-channels")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <Radio className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Connected Channels
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Sister Channels</h3>
                    <p className="text-2xl font-black mt-1">
                      {channels.length} <span className="text-xs font-semibold text-white/50">Connected</span>
                    </p>
                  </div>
                </div>

                {/* 4. Journey Timeline Gallery */}
                <div 
                  onClick={() => setActiveTab("gallery")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <Images className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Timeline Journey
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Gallery Manager</h3>
                    <p className="text-2xl font-black mt-1">
                      {gallery.length} <span className="text-xs font-semibold text-white/50">Images</span>
                    </p>
                  </div>
                </div>

                {/* 5. Blog Posts Card */}
                <div 
                  onClick={() => setActiveTab("blog")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <Newspaper className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Articles & News
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Blog Manager</h3>
                    <p className="text-2xl font-black mt-1">
                      {blogs.length} <span className="text-xs font-semibold text-white/50">Articles</span>
                    </p>
                  </div>
                </div>

                {/* 6. Branded Content Card */}
                <div 
                  onClick={() => setActiveTab("branded-content")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <Building className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Partner Brands
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Branded Content</h3>
                    <p className="text-2xl font-black mt-1">
                      {brandedBrands.length} <span className="text-xs font-semibold text-white/50">Brands ({brandedCategories.length} Categories)</span>
                    </p>
                  </div>
                </div>

                {/* 7. Partner Inquiries Card */}
                <div 
                  onClick={() => setActiveTab("partner-inquiries")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <Mail className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Form Submissions
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Partner Inquiries</h3>
                    <p className="text-2xl font-black mt-1">
                      {partnerInquiries.length} <span className="text-xs font-semibold text-white/50">Messages</span>
                    </p>
                  </div>
                </div>

                {/* 8. Unused Images Card */}
                <div 
                  onClick={() => setActiveTab("unused-images")}
                  className="rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all p-6 space-y-4 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
                      <Trash2 className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">
                      Cloud Cleanup
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">Unused Images</h3>
                    <p className="text-2xl font-black mt-1">
                      {unusedImages.length} <span className="text-xs font-semibold text-white/50">Unlinked Assets</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* Quick Actions Panel */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8 space-y-6">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Quick Actions & Shortcuts
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setActiveTab("content")}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 hover:border-primary/45 bg-white/[0.02] hover:bg-white/[0.05] text-sm font-semibold text-white transition-all cursor-pointer"
                  >
                    <span>Add Show Original</span>
                    <Plus className="h-4 w-4 text-primary" />
                  </button>

                  <button 
                    onClick={() => setActiveTab("blog")}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 hover:border-primary/45 bg-white/[0.02] hover:bg-white/[0.05] text-sm font-semibold text-white transition-all cursor-pointer"
                  >
                    <span>Write Blog Post</span>
                    <Plus className="h-4 w-4 text-primary" />
                  </button>

                  <button 
                    onClick={() => setActiveTab("unused-images")}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 hover:border-primary/45 bg-white/[0.02] hover:bg-white/[0.05] text-sm font-semibold text-white transition-all cursor-pointer"
                  >
                    <span>Scan Cloud Assets</span>
                    <RefreshCw className="h-4 w-4 text-primary" />
                  </button>

                  <a 
                    href="/"
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/5 hover:border-primary/45 bg-white/[0.02] hover:bg-white/[0.05] text-sm font-semibold text-white transition-all cursor-pointer"
                  >
                    <span>Go to Live Site</span>
                    <ExternalLink className="h-4 w-4 text-primary" />
                  </a>
                </div>
              </div>
            </>
          )}

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
                          placeholder="e.g. Cineplus Studio"
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

                      {/* Cast & Crew Module Section */}
                      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-4">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block border-b border-white/5 pb-2">
                          Cast & Crew Members (Optional)
                        </span>
                        
                        <div className="space-y-3 p-3 rounded-lg bg-black/40 border border-white/5">
                          <input
                            type="text"
                            placeholder="Member Name (e.g. Jitendra Kumar)"
                            value={newCastName}
                            onChange={(e) => setNewCastName(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-primary"
                          />
                          <input
                            type="text"
                            placeholder="Role / Title (e.g. Lead Actor / Director)"
                            value={newCastRole}
                            onChange={(e) => setNewCastRole(e.target.value)}
                            className="w-full px-3 py-2 rounded bg-black/60 border border-white/10 text-xs text-white placeholder-white/20 focus:outline-none focus:border-primary"
                          />
                          
                          <div className="flex items-center gap-3">
                            {newCastImage && (
                              <img src={newCastImage} className="w-8 h-8 rounded-full object-cover border border-white/20" alt="Preview" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              id="cast-image-input"
                              onChange={handleCastImageUpload}
                              className="hidden"
                            />
                            <label
                              htmlFor="cast-image-input"
                              className={`px-3 py-1.5 rounded border border-white/10 hover:border-primary/45 bg-white/5 text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-all ${
                                uploadingCastImage ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {uploadingCastImage ? "Uploading..." : newCastImage ? "Change Photo" : "Upload Photo"}
                            </label>
                          </div>
                          
                          <button
                            type="button"
                            onClick={addCastMember}
                            className="w-full py-2 bg-primary/10 hover:bg-primary text-primary hover:text-black rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                          >
                            Add Cast Member
                          </button>
                        </div>

                        {/* Current Cast List */}
                        {showCast.length > 0 && (
                          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {showCast.map((actor, idx) => (
                              <div key={idx} className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5 text-xs">
                                <div className="flex items-center gap-2 min-w-0">
                                  <img src={actor.image} className="w-6 h-6 rounded-full object-cover border border-white/10 shrink-0" alt="" />
                                  <div className="min-w-0">
                                    <p className="font-bold text-white truncate">{actor.name}</p>
                                    {actor.role && <p className="text-[10px] text-white/50 truncate">{actor.role}</p>}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeCastMember(idx)}
                                  className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-wider cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
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
                  <div className="flex flex-col md:flex-row gap-3 items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                        Show Catalogue ({sortedShows.length})
                      </h3>
                      <button 
                        onClick={fetchShows} 
                        className="p-1.5 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                        type="button"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                      {/* Search System */}
                      <input
                        type="text"
                        placeholder="Search by title..."
                        value={showSearchQuery}
                        onChange={(e) => setShowSearchQuery(e.target.value)}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary flex-grow md:flex-grow-0 md:w-48"
                      />

                      {/* Sort dropdown */}
                      <select
                        value={showSortOrder}
                        onChange={(e) => setShowSortOrder(e.target.value as any)}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary cursor-pointer font-bold uppercase tracking-wide"
                      >
                        <option value="newest" className="bg-black text-white">Newest First</option>
                        <option value="oldest" className="bg-black text-white">Oldest First</option>
                        <option value="title-asc" className="bg-black text-white">Title: A to Z</option>
                        <option value="title-desc" className="bg-black text-white">Title: Z to A</option>
                      </select>
                    </div>
                  </div>

                  {shows.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No shows found</p>
                      <p className="text-xs">Create a show item to begin populating your catalogue.</p>
                    </div>
                  ) : filteredShows.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No matches found</p>
                      <p className="text-xs">No shows match search query &quot;{showSearchQuery}&quot;.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        {paginatedShows.map((item) => (
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

                                  {/* Cast Count Badge */}
                                  {item.cast && item.cast.length > 0 && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded border border-white/10 bg-white/5 text-white/60 uppercase tracking-wider">
                                      {item.cast.length} Cast
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

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/5">
                          <button
                            type="button"
                            disabled={showCurrentPage === 1}
                            onClick={() => setShowCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-primary disabled:opacity-40 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            Prev
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                type="button"
                                onClick={() => setShowCurrentPage(page)}
                                className={`w-8 h-8 rounded text-xs font-bold transition-all cursor-pointer ${
                                  showCurrentPage === page
                                    ? "bg-primary text-black"
                                    : "bg-white/5 border border-white/5 text-white/70 hover:bg-white/10"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            disabled={showCurrentPage === totalPages}
                            onClick={() => setShowCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-primary disabled:opacity-40 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SISTER CHANNELS MODULE */}
          {/* ======================================================== */}
          {activeTab === "sister-channels" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Sister Channels
                  </h1>
                  <p className="text-white/50 text-sm">
                    Manage corporate networks, sister channels, subscriber counts, and social links.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Networks</p>
                    <p className="text-2xl font-extrabold text-white">{channels.length}</p>
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
                        {editingChannelId ? "Modify Network Details" : "Create Sister Channel"}
                      </h3>
                      {editingChannelId && (
                        <button 
                          onClick={resetChannelForm}
                          className="text-xs font-bold text-white/40 hover:text-primary uppercase tracking-wider cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleChannelFormSubmit} className="space-y-5">
                      {/* Title */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Channel Title / Name
                        </label>
                        <input
                          type="text"
                          required
                          value={channelTitle}
                          onChange={(e) => setChannelTitle(e.target.value)}
                          placeholder="e.g. The Timeliners"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      {/* Logo Upload */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Channel Logo (Square)
                        </label>
                        
                        <div className="space-y-3">
                          {/* Logo preview */}
                          {channelLogo && (
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-black group mx-auto">
                              <img
                                src={channelLogo}
                                alt="Logo Preview"
                                className="object-cover w-full h-full"
                              />
                              <button
                                type="button"
                                onClick={() => setChannelLogo("")}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold uppercase text-primary tracking-wider"
                              >
                                Remove
                              </button>
                            </div>
                          )}

                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleChannelLogoUpload}
                              className="hidden"
                              id="channel-logo-input"
                            />
                            <label
                              htmlFor="channel-logo-input"
                              className={`w-full flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg bg-black/40 text-white/60 hover:text-white transition-all cursor-pointer ${
                                uploadingLogo 
                                  ? "border-primary/20 cursor-not-allowed opacity-50" 
                                  : "border-white/10 hover:border-primary/40"
                              }`}
                            >
                              {uploadingLogo ? (
                                <div className="flex flex-col items-center gap-2">
                                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                  <span className="text-xs uppercase font-extrabold tracking-wider">Uploading to Cloudinary...</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-1">
                                  <Plus className="h-5 w-5 text-primary" />
                                  <span className="text-xs uppercase font-extrabold tracking-wider">
                                    {channelLogo ? "Change Selected Logo" : "Upload Logo Image"}
                                  </span>
                                  <span className="text-[10px] text-white/30">PNG, JPG, JPEG up to 5MB</span>
                                </div>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Subscriber Count */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Subscriber Count Display
                        </label>
                        <input
                          type="text"
                          required
                          value={channelSubscriber}
                          onChange={(e) => setChannelSubscriber(e.target.value)}
                          placeholder="e.g. 7M+ subscribers"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      {/* Youtube / Link */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Action Link / YouTube URL
                        </label>
                        <input
                          type="text"
                          required
                          value={channelLink}
                          onChange={(e) => setChannelLink(e.target.value)}
                          placeholder="e.g. https://www.youtube.com/@TheTimeliners"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingChannel}
                        className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/10 cursor-pointer disabled:opacity-50"
                      >
                        {submittingChannel ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ) : editingChannelId ? (
                          "Update Channel Details"
                        ) : (
                          "Add Network to Directory"
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Directory List */}
                <div className="xl:col-span-7 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                      Network Directory ({channels.length})
                    </h3>
                    <button 
                      onClick={fetchChannels} 
                      className="p-1.5 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                      type="button"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>

                  {channels.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No channels found</p>
                      <p className="text-xs">Add a sister channel using the form to populate the directory.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {channels.map((item) => (
                        <motion.div
                          key={item._id}
                          layout
                          className="rounded-xl border border-white/5 p-5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative flex flex-col sm:flex-row sm:items-center justify-between gap-6"
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-white/10 bg-black">
                              <img
                                src={item.logo}
                                alt={item.title}
                                className="object-cover w-full h-full"
                              />
                            </div>

                            <div className="space-y-1 min-w-0">
                              <h4 className="text-lg font-bold text-white uppercase tracking-wide truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-white/50 font-medium">
                                {item.subscriber}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-white transition-colors truncate">
                                <ExternalLink className="h-3 w-3" />
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
                                  {item.link}
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center sm:flex-col gap-3 justify-end border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 shrink-0">
                            <button
                              onClick={() => startChannelEdit(item)}
                              className={`p-2.5 rounded-lg border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-white/70 hover:text-white transition-all cursor-pointer ${
                                editingChannelId === item._id ? "border-primary/50 text-primary hover:text-primary" : ""
                              }`}
                              title="Edit Channel"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            {deleteConfirmChannelId === item._id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleChannelDelete(item._id)}
                                  className="px-2.5 py-1.5 rounded bg-primary hover:bg-white text-black font-extrabold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmChannelId(null)}
                                  className="p-1 rounded border border-white/10 text-white/60 hover:text-white cursor-pointer"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmChannelId(item._id)}
                                className="p-2.5 rounded-lg border border-white/5 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/10 text-white/70 hover:text-primary transition-all cursor-pointer"
                                title="Delete Channel"
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
          {/* TAB 4: GALLERY MANAGER */}
          {/* ======================================================== */}
          {activeTab === "gallery" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Gallery Manager
                  </h1>
                  <p className="text-white/50 text-sm">
                    Manage the homepage scrolling marquee posters. Upload single or multiple images at once.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Posters</p>
                    <p className="text-2xl font-extrabold text-white">{gallery.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Form */}
                <div className="xl:col-span-4 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8 space-y-6">
                    <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2 border-b border-white/5 pb-4">
                      <Plus className="h-4 w-4 text-primary" /> Upload Posters
                    </h3>

                    <form onSubmit={handleGalleryUpload} className="space-y-5">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">
                          Select Files (Single or Multiple)
                        </label>
                        
                        <div className="relative">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setSelectedGalleryFiles(e.target.files)}
                            className="hidden"
                            id="gallery-files-input"
                            disabled={uploadingGallery}
                          />
                          <label
                            htmlFor="gallery-files-input"
                            className={`w-full flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg bg-black/40 text-white/60 hover:text-white transition-all cursor-pointer ${
                              uploadingGallery 
                                ? "border-primary/20 cursor-not-allowed opacity-50" 
                                : "border-white/10 hover:border-primary/40"
                            }`}
                          >
                            <Plus className="h-6 w-6 text-primary mb-2" />
                            <span className="text-xs uppercase font-extrabold tracking-wider">
                              Choose Image Files
                            </span>
                            <span className="text-[10px] text-white/30 mt-1">Select one or multiple images</span>
                          </label>
                        </div>
                      </div>

                      {/* Selected files listing with previews */}
                      {selectedGalleryFiles && selectedGalleryFiles.length > 0 && (
                        <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-3">
                          <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold border-b border-white/5 pb-1.5">
                            Files Selected ({selectedGalleryFiles.length})
                          </p>
                          <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                            {Array.from(selectedGalleryFiles).map((file, idx) => {
                              let objectUrl = "";
                              if (typeof window !== "undefined") {
                                try {
                                  objectUrl = URL.createObjectURL(file);
                                } catch (err) {
                                  console.error("Error creating object URL", err);
                                }
                              }
                              return (
                                <div key={idx} className="flex flex-col gap-1.5 p-2 bg-white/5 rounded border border-white/5">
                                  <div className="relative aspect-[3/4] w-full rounded overflow-hidden border border-white/10 bg-black shrink-0">
                                    {objectUrl && (
                                      <img
                                        src={objectUrl}
                                        alt="Selected Preview"
                                        className="object-cover w-full h-full"
                                      />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-[10px] font-bold text-white truncate" title={file.name}>
                                      {file.name}
                                    </p>
                                    <p className="text-[9px] text-white/40">
                                      {(file.size / 1024).toFixed(0)} KB
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {uploadProgress && (
                        <div className="p-3.5 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary font-bold text-center animate-pulse">
                          {uploadProgress}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={uploadingGallery || !selectedGalleryFiles || selectedGalleryFiles.length === 0}
                        className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
                      >
                        {uploadingGallery ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ) : (
                          "Upload & Save Posters"
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Directory List */}
                <div className="xl:col-span-8 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                        Poster Catalog ({sortedGallery.length})
                      </h3>
                      <button 
                        onClick={fetchGallery} 
                        className="p-1.5 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                        type="button"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={gallerySortOrder}
                        onChange={(e) => setGallerySortOrder(e.target.value as any)}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary cursor-pointer font-bold uppercase tracking-wide"
                      >
                        <option value="desc" className="bg-black text-white">Descending</option>
                        <option value="asc" className="bg-black text-white">Ascending</option>
                      </select>
                    </div>
                  </div>

                  {gallery.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No posters found</p>
                      <p className="text-xs">Select files and upload them to begin populating the scrolling marquee.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-6 gap-4">
                        {paginatedGallery.map((item) => (
                          <motion.div
                            key={item._id}
                            layout
                            className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-black border border-white/5 hover:border-primary/30 transition-all flex flex-col justify-end"
                          >
                            <img
                              src={item.url}
                              alt="Marquee Poster"
                              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60" />

                            {/* Delete Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center gap-3">
                              <span className="text-[10px] text-white/60 font-semibold uppercase tracking-wider">Show Poster</span>
                              
                              {deleteConfirmGalleryId === item._id ? (
                                <div className="flex flex-col gap-2 w-full">
                                  <p className="text-[10px] text-primary font-bold uppercase">Confirm?</p>
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => handleGalleryDelete(item._id)}
                                      className="px-3 py-1 bg-primary hover:bg-white text-black font-extrabold text-[10px] rounded uppercase tracking-wider"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmGalleryId(null)}
                                      className="px-3 py-1 border border-white/20 text-white hover:bg-white/5 font-extrabold text-[10px] rounded uppercase tracking-wider"
                                    >
                                      No
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmGalleryId(item._id)}
                                  className="p-2.5 rounded-full bg-primary/10 hover:bg-primary text-primary hover:text-black border border-primary/20 hover:border-transparent transition-all"
                                  title="Delete Poster"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {galleryTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/5">
                          <button
                            type="button"
                            disabled={galleryCurrentPage === 1}
                            onClick={() => setGalleryCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-primary disabled:opacity-40 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            Prev
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: galleryTotalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                type="button"
                                onClick={() => setGalleryCurrentPage(page)}
                                className={`w-8 h-8 rounded text-xs font-bold transition-all cursor-pointer ${
                                  galleryCurrentPage === page
                                    ? "bg-primary text-black"
                                    : "bg-white/5 border border-white/5 text-white/70 hover:bg-white/10"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            disabled={galleryCurrentPage === galleryTotalPages}
                            onClick={() => setGalleryCurrentPage(prev => Math.min(prev + 1, galleryTotalPages))}
                            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-primary disabled:opacity-40 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 5: BLOG MANAGER */}
          {/* ======================================================== */}
          {activeTab === "blog" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Blog Manager
                  </h1>
                  <p className="text-white/50 text-sm">
                    Manage the publication of dynamic blog articles. Write using rich-text format.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Posts</p>
                    <p className="text-2xl font-extrabold text-white">{blogs.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Form: Create / Edit Blog */}
                <div className="xl:col-span-5 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" /> 
                        {editingBlogId ? "Modify Blog Post" : "Create Blog Post"}
                      </h3>
                      {editingBlogId && (
                        <button 
                          onClick={resetBlogForm}
                          className="text-xs font-bold text-white/40 hover:text-primary uppercase tracking-wider cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleBlogFormSubmit} className="space-y-5">
                      {/* Title */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Blog Title
                        </label>
                        <input
                          type="text"
                          required
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          placeholder="e.g. Behind the Scenes of Panchayat Season 3"
                          className="w-full px-4 py-3.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-all placeholder-white/20"
                        />
                      </div>

                      {/* Publish Date */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">
                          Publish Date (Optional)
                        </label>
                        <input
                          type="date"
                          value={blogDate}
                          onChange={(e) => setBlogDate(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-primary transition-all"
                        />
                        <span className="text-[9px] text-white/30">Defaults to current submission date if left blank.</span>
                      </div>

                      {/* Banner Image Uploader */}
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">
                          Blog Banner Image
                        </label>
                        
                        <div className="space-y-3">
                          <div className="w-full">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBlogBannerUpload}
                              className="hidden"
                              id="blog-banner-input"
                              disabled={uploadingBlogBanner}
                            />
                            <label
                              htmlFor="blog-banner-input"
                              className={`w-full flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-lg bg-black/40 text-white/60 hover:text-white transition-all cursor-pointer ${
                                uploadingBlogBanner 
                                  ? "border-primary/20 cursor-not-allowed opacity-50" 
                                  : "border-white/10 hover:border-primary/40"
                              }`}
                            >
                              <Plus className="h-5 w-5 text-primary mb-1" />
                              <span className="text-[10px] uppercase font-extrabold tracking-wider">
                                {uploadingBlogBanner ? "Uploading..." : "Upload Banner Image"}
                              </span>
                            </label>
                            
                            <input
                              type="text"
                              value={blogBanner}
                              onChange={(e) => setBlogBanner(e.target.value)}
                              placeholder="Or paste banner image URL..."
                              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-[11px] focus:outline-none focus:border-primary transition-all placeholder-white/20 mt-2"
                              id="blog-banner-url-input"
                            />
                          </div>

                          {blogBanner && (
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black">
                              <img
                                src={blogBanner}
                                alt="Banner Preview"
                                className="object-cover w-full h-full max-h-[180px] mx-auto block"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Rich Text Editor */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Blog Content (Rich Text)
                        </label>
                        
                        <div className="rounded-lg border border-white/10 bg-black/40 overflow-hidden">
                          {/* Formatting Toolbar */}
                          <div className="flex flex-wrap items-center gap-1 p-2 bg-white/[0.03] border-b border-white/10 select-none">
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("bold", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Bold"
                            >
                              <Bold className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("italic", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Italic"
                            >
                              <Italic className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("underline", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Underline"
                            >
                              <Underline className="h-4 w-4" />
                            </button>
                            
                            <div className="w-[1px] h-4 bg-white/15 mx-1" />
                            
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("formatBlock", false, "H2");
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors font-extrabold text-xs uppercase"
                              title="Heading 2"
                            >
                              <Heading2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("formatBlock", false, "H3");
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors font-extrabold text-xs uppercase"
                              title="Heading 3"
                            >
                              <Heading3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("formatBlock", false, "P");
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors font-extrabold text-xs uppercase"
                              title="Paragraph"
                            >
                              <FileText className="h-4 w-4" />
                            </button>

                            <div className="w-[1px] h-4 bg-white/15 mx-1" />

                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("insertUnorderedList", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Bullet List"
                            >
                              <List className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("insertOrderedList", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Numbered List"
                            >
                              <ListOrdered className="h-4 w-4" />
                            </button>

                            <div className="w-[1px] h-4 bg-white/15 mx-1" />

                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("justifyLeft", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Align Left"
                            >
                              <AlignLeft className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("justifyCenter", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Align Center"
                            >
                              <AlignCenter className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document.execCommand("justifyRight", false);
                                editorRef.current?.focus();
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Align Right"
                            >
                              <AlignRight className="h-4 w-4" />
                            </button>

                            <div className="w-[1px] h-4 bg-white/15 mx-1" />

                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                const selection = window.getSelection();
                                let range: Range | null = null;
                                if (selection && selection.rangeCount > 0) {
                                  range = selection.getRangeAt(0);
                                }
                                
                                const url = prompt("Enter URL link (e.g. https://google.com):");
                                if (!url) return;
                                
                                editorRef.current?.focus();
                                if (selection && range) {
                                  selection.removeAllRanges();
                                  selection.addRange(range);
                                }
                                
                                if (selection && selection.toString() === "") {
                                  const text = prompt("Enter Link Text:") || url;
                                  document.execCommand("insertHTML", false, `<a href="${url}" target="_blank" class="text-primary underline hover:text-white transition-colors">${text}</a>`);
                                } else {
                                  document.execCommand("createLink", false, url);
                                }
                              }}
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                              title="Add Link"
                            >
                              <Link2 className="h-4 w-4" />
                            </button>
                            
                            {/* Inline Image Uploader */}
                            <label
                              className="p-1.5 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                              title="Insert Image"
                            >
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleInsertImage}
                                className="hidden"
                              />
                              <ImageIcon className="h-4 w-4" />
                            </label>
                          </div>

                          {/* Editable Area */}
                          <div
                            ref={editorRef}
                            contentEditable
                            className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto focus:outline-none text-white text-sm leading-relaxed prose prose-invert max-w-none [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_p]:mb-3"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submittingBlog || uploadingBlogBanner}
                        className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {submittingBlog ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        ) : editingBlogId ? (
                          "Update Blog Post"
                        ) : (
                          "Publish Blog Post"
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Directory: Catalog List */}
                <div className="xl:col-span-7 space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white">
                        Blog Catalog ({sortedBlogs.length})
                      </h3>
                      <button 
                        onClick={fetchBlogs} 
                        className="p-1.5 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors cursor-pointer"
                        type="button"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      {/* Search */}
                      <input
                        type="text"
                        placeholder="Search by title..."
                        value={blogSearchQuery}
                        onChange={(e) => setBlogSearchQuery(e.target.value)}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-white/30 focus:outline-none focus:border-primary flex-grow sm:flex-grow-0 sm:w-44"
                      />

                      {/* Sort */}
                      <select
                        value={blogSortOrder}
                        onChange={(e) => setBlogSortOrder(e.target.value as any)}
                        className="px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-primary cursor-pointer font-bold uppercase tracking-wide"
                      >
                        <option value="desc" className="bg-black text-white">Newest First</option>
                        <option value="asc" className="bg-black text-white">Oldest First</option>
                      </select>
                    </div>
                  </div>

                  {blogs.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No blog posts found</p>
                      <p className="text-xs">Publish a blog post on the left to begin populating the list.</p>
                    </div>
                  ) : filteredBlogs.length === 0 ? (
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40 space-y-2">
                      <p className="font-semibold uppercase tracking-wider text-sm">No matches found</p>
                      <p className="text-xs">No blogs match the search query &quot;{blogSearchQuery}&quot;.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-4">
                        {paginatedBlogs.map((item) => (
                          <motion.div
                            key={item._id}
                            layout
                            className="rounded-xl border border-white/5 p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex flex-col sm:flex-row gap-5"
                          >
                            {/* Banner Image Preview */}
                            <div className="relative w-32 h-20 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                              <img
                                src={item.banner}
                                alt={item.title}
                                className="object-cover w-full h-full"
                              />
                            </div>

                            {/* Content Info */}
                            <div className="flex-grow min-w-0 flex flex-col justify-between py-0.5">
                              <div>
                                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                                  {item.blogdate ? new Date(item.blogdate).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                  }) : "No Date"}
                                </span>
                                <h4 className="text-sm font-bold text-white uppercase tracking-wide leading-snug truncate mt-1">
                                  {item.title}
                                </h4>
                                <p 
                                  className="text-[11px] text-white/40 line-clamp-1 mt-1 font-sans"
                                  dangerouslySetInnerHTML={{ __html: item.content.replace(/<[^>]*>/g, '') }}
                                />
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col items-center justify-center gap-2 shrink-0">
                              <button
                                onClick={() => startBlogEdit(item)}
                                className={`p-2.5 rounded-lg border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-white/70 hover:text-white transition-all cursor-pointer ${
                                  editingBlogId === item._id ? "border-primary/50 text-primary hover:text-primary" : ""
                                }`}
                                title="Edit Post"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              {deleteConfirmBlogId === item._id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleBlogDelete(item._id)}
                                    className="px-2 py-1 rounded bg-primary hover:bg-white text-black font-extrabold text-[9px] uppercase tracking-wider"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmBlogId(null)}
                                    className="p-1 rounded border border-white/10 text-white/60 hover:text-white"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmBlogId(item._id)}
                                  className="p-2.5 rounded-lg border border-white/5 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/10 text-white/70 hover:text-primary transition-all cursor-pointer"
                                  title="Delete Post"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Pagination Controls */}
                      {blogTotalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 pt-6 border-t border-white/5">
                          <button
                            type="button"
                            disabled={blogCurrentPage === 1}
                            onClick={() => setBlogCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            Prev
                          </button>
                          
                          <div className="flex items-center gap-1">
                            {Array.from({ length: blogTotalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                type="button"
                                onClick={() => setBlogCurrentPage(page)}
                                className={`w-7 h-7 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                  blogCurrentPage === page
                                    ? "bg-primary text-black"
                                    : "bg-white/5 border border-white/5 text-white/70 hover:bg-white/10"
                                }`}
                              >
                                {page}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            disabled={blogCurrentPage === blogTotalPages}
                            onClick={() => setBlogCurrentPage(prev => Math.min(prev + 1, blogTotalPages))}
                            className="px-3 py-1.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 6: BRANDED CONTENT MANAGER */}
          {/* ======================================================== */}
          {activeTab === "branded-content" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Branded Content Manager
                  </h1>
                  <p className="text-white/50 text-sm">
                    Manage branded categories and partner brand logos shown on the live site.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Categories</p>
                    <p className="text-2xl font-extrabold text-white">{brandedCategories.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Form to create/edit category */}
                <div className="xl:col-span-5 space-y-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-6 md:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                        <Plus className="h-4 w-4 text-primary" />
                        {editingCategoryId ? "Modify Category" : "Create Category"}
                      </h3>
                      {editingCategoryId && (
                        <button
                          onClick={resetCategoryForm}
                          className="text-xs font-bold text-white/40 hover:text-primary uppercase tracking-wider cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleCategoryFormSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Category Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          placeholder="e.g. Consumer Electronics"
                          className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingCategory}
                        className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {submittingCategory ? (
                          <Loader2 className="h-5 w-5 animate-spin text-black" />
                        ) : editingCategoryId ? (
                          "Update Category"
                        ) : (
                          "Create Category"
                        )}
                      </button>
                    </form>

                    {/* Brand Manager section */}
                    <div className="border-t border-white/10 pt-6 mt-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                          <Plus className="h-4 w-4 text-primary" />
                          {editingBrandId ? "Modify Brand" : "Create Brand"}
                        </h3>
                        {editingBrandId && (
                          <button
                            onClick={resetBrandForm}
                            className="text-xs font-bold text-white/40 hover:text-primary uppercase tracking-wider cursor-pointer"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>

                      <form onSubmit={handleBrandFormSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                            Brand Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            placeholder="e.g. LG"
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                            Select Category *
                          </label>
                          <select
                            required
                            value={brandCategoryId}
                            onChange={(e) => setBrandCategoryId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium cursor-pointer"
                          >
                            <option value="" className="bg-black text-white/40">-- Choose Category --</option>
                            {brandedCategories.map((cat) => (
                              <option key={cat._id} value={cat._id} className="bg-black text-white">
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 block">
                            Brand Logo Image *
                          </label>
                          <div className="flex items-center gap-4">
                            {brandLogo ? (
                              <div className="relative w-16 h-16 rounded-lg bg-white border border-white/10 overflow-hidden flex-shrink-0">
                                <img
                                  src={brandLogo}
                                  alt="Brand Logo"
                                  className="w-full h-full object-contain p-2"
                                />
                                <button
                                  type="button"
                                  onClick={() => setBrandLogo("")}
                                  className="absolute inset-0 bg-black/75 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity text-xs text-red-500 font-extrabold uppercase"
                                >
                                  Remove
                                </button>
                              </div>
                            ) : (
                              <label className="w-16 h-16 rounded-lg border border-dashed border-white/20 hover:border-primary/50 flex flex-col items-center justify-center text-white/40 hover:text-primary transition-colors cursor-pointer bg-white/[0.01] flex-shrink-0">
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingBrandLogo}
                                  onChange={handleBrandLogoUpload}
                                  className="hidden"
                                />
                                {uploadingBrandLogo ? (
                                  <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                  <ImageIcon className="h-5 w-5" />
                                )}
                              </label>
                            )}
                            <p className="text-[11px] text-white/40 leading-relaxed">
                              Upload PNG/WebP/SVG logo.
                            </p>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submittingBrand || uploadingBrandLogo}
                          className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {submittingBrand ? (
                            <Loader2 className="h-5 w-5 animate-spin text-black" />
                          ) : editingBrandId ? (
                            "Update Brand"
                          ) : (
                            "Create Brand"
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Categories and Brands Directories */}
                <div className="xl:col-span-7 space-y-8">
                  {/* Categories List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                        Categories Directory ({brandedCategories.length})
                        <button
                          onClick={fetchBrandedCategories}
                          className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                          type="button"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </h3>
                    </div>

                    {brandedCategories.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-white/[0.01] p-8 text-center text-white/40">
                        <p className="text-xs font-semibold uppercase tracking-wider">No categories found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[250px] overflow-y-auto pr-1">
                        {brandedCategories.map((item) => (
                          <div
                            key={item._id}
                            className="rounded-lg border border-white/5 p-3.5 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex items-center justify-between gap-3"
                          >
                            <span className="text-sm font-bold text-white uppercase tracking-wider truncate">
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => startCategoryEdit(item)}
                                className={`p-1.5 rounded border border-white/5 bg-white/[0.02] text-white/70 hover:text-primary transition-all cursor-pointer ${
                                  editingCategoryId === item._id ? "border-primary text-primary" : ""
                                }`}
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              {deleteConfirmCategoryId === item._id ? (
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleCategoryDelete(item._id)}
                                    className="px-2 py-0.5 rounded bg-primary text-black font-extrabold text-[9px] uppercase"
                                  >
                                    Yes
                                  </button>
                                  <button
                                    onClick={() => setDeleteConfirmCategoryId(null)}
                                    className="p-0.5 rounded border border-white/10 text-white/60 hover:text-white"
                                  >
                                    <XCircle className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setDeleteConfirmCategoryId(item._id)}
                                  className="p-1.5 rounded border border-white/5 bg-white/[0.02] text-white/70 hover:text-primary transition-all cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Brands List */}
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                        Brands Directory ({brandedBrands.length})
                        <button
                          onClick={fetchBrandedBrands}
                          className="p-1 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors cursor-pointer"
                          type="button"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      </h3>
                    </div>

                    {brandedBrands.length === 0 ? (
                      <div className="rounded-xl border border-white/5 bg-white/[0.01] p-12 text-center text-white/40">
                        <p className="text-xs font-semibold uppercase tracking-wider">No brands found</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {brandedBrands.map((brand) => {
                          const catName = typeof brand.category === "object" ? brand.category?.name : "";
                          return (
                            <div
                              key={brand._id}
                              className="rounded-lg border border-white/5 p-4 bg-white/[0.01] hover:bg-white/[0.02] flex items-center justify-between gap-4"
                            >
                              <div className="flex items-center gap-3.5 min-w-0">
                                <div className="relative w-12 h-12 rounded bg-white overflow-hidden shrink-0 border border-white/10 p-1">
                                  <img
                                    src={brand.logo}
                                    alt={brand.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-bold text-white uppercase tracking-wider truncate">
                                    {brand.name}
                                  </h4>
                                  <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded mt-1 inline-block">
                                    {catName || "Unassigned"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => startBrandEdit(brand)}
                                  className={`p-2 rounded border border-white/5 bg-white/[0.02] text-white/70 hover:text-primary transition-all cursor-pointer ${
                                    editingBrandId === brand._id ? "border-primary text-primary" : ""
                                  }`}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                {deleteConfirmBrandId === brand._id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleBrandDelete(brand._id)}
                                      className="px-2 py-1 rounded bg-primary text-black font-extrabold text-[9px] uppercase cursor-pointer"
                                    >
                                      Confirm
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmBrandId(null)}
                                      className="p-1 rounded border border-white/10 text-white/60 hover:text-white cursor-pointer"
                                    >
                                      <XCircle className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmBrandId(brand._id)}
                                    className="p-2 rounded border border-white/5 bg-white/[0.02] text-white/70 hover:text-primary transition-all cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 7: PARTNER INQUIRIES */}
          {/* ======================================================== */}
          {activeTab === "partner-inquiries" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Partner Enquiries
                  </h1>
                  <p className="text-white/50 text-sm">
                    View campaign proposals and partnership inquiries submitted by brands.
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="px-5 py-3.5 rounded-xl border border-white/5 bg-white/[0.02] text-center min-w-[120px]">
                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Total Submissions</p>
                    <p className="text-2xl font-extrabold text-white">{partnerInquiries.length}</p>
                  </div>
                </div>
              </div>

              {partnerInquiries.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-16 text-center text-white/40 space-y-2 max-w-lg mx-auto">
                  <Mail className="h-8 w-8 mx-auto text-white/20 mb-2" />
                  <p className="font-semibold uppercase tracking-wider text-sm">No enquiries found</p>
                  <p className="text-xs">Incoming submissions from the &apos;Partner With Us&apos; form will show up here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {partnerInquiries.map((inquiry) => (
                    <div
                      key={inquiry._id}
                      className="rounded-xl border border-white/5 p-5 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                            {inquiry.name}
                          </h4>
                          {inquiry.institution && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/70">
                              {inquiry.institution}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/60 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3 text-primary" /> {inquiry.email}</span>
                          <span className="flex items-center gap-1"><Radio className="h-3 w-3 text-primary" /> {inquiry.phone}</span>
                          <span className="text-white/40 font-bold uppercase tracking-widest text-[9px]">
                            {new Date(inquiry.createdAt).toLocaleString()}
                          </span>
                        </p>
                        <p className="text-xs text-white/80 line-clamp-1 italic mt-1 max-w-3xl">
                          &ldquo;{inquiry.message}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-bold uppercase tracking-wide text-white cursor-pointer transition-all"
                        >
                          View Details
                        </button>

                        {deleteConfirmInquiryId === inquiry._id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleInquiryDelete(inquiry._id)}
                              className="px-2 py-1 rounded bg-primary hover:bg-white text-black font-extrabold text-[9px] uppercase tracking-wider cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmInquiryId(null)}
                              className="p-1 rounded border border-white/10 text-white/60 hover:text-white cursor-pointer"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmInquiryId(inquiry._id)}
                            className="p-2.5 rounded-lg border border-white/5 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/10 text-white/70 hover:text-primary transition-all cursor-pointer"
                            title="Dismiss Enquiry"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inquiry Detail Inspection Popup Modal */}
              <AnimatePresence>
                {selectedInquiry && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                      className="absolute inset-0 bg-black/80 backdrop-blur-md"
                      onClick={() => setSelectedInquiry(null)}
                    />
                    <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl z-10 space-y-6">
                      <div className="flex justify-between items-start border-b border-white/5 pb-4">
                        <div>
                          <h3 className="text-lg font-black uppercase text-white tracking-wide">
                            {selectedInquiry.name}
                          </h3>
                          <p className="text-[10px] text-white/40 uppercase mt-0.5 font-bold tracking-widest">
                            Submitted on {new Date(selectedInquiry.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedInquiry(null)}
                          className="p-1 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Email</p>
                            <p className="text-xs text-white/80 font-semibold select-all">{selectedInquiry.email}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Phone</p>
                            <p className="text-xs text-white/80 font-semibold select-all">{selectedInquiry.phone}</p>
                          </div>
                        </div>

                        {selectedInquiry.institution && (
                          <div className="space-y-1">
                            <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold">Institution / Brand</p>
                            <p className="text-xs text-white/80 font-semibold">{selectedInquiry.institution}</p>
                          </div>
                        )}

                        <div className="space-y-1 pt-3 border-t border-white/5">
                          <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Partnership Objectives</p>
                          <p className="text-xs text-white/75 leading-relaxed bg-black/40 border border-white/5 p-4 rounded-xl font-sans whitespace-pre-wrap select-all">
                            {selectedInquiry.message}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                        <a
                          href={`mailto:${selectedInquiry.email}`}
                          className="px-4 py-2.5 rounded-lg bg-primary hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider transition-all"
                        >
                          Reply via Email
                        </a>
                        <button
                          onClick={() => setSelectedInquiry(null)}
                          className="px-4 py-2.5 rounded-lg border border-white/10 text-white/70 hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Close Details
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 8: UNUSED IMAGES MANAGER */}
          {/* ======================================================== */}
          {activeTab === "unused-images" && (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                  <h1 className="text-3xl font-extrabold uppercase tracking-tight text-white mb-2">
                    Unused Images
                  </h1>
                  <p className="text-white/50 text-sm">
                    Scan and delete images uploaded to Cloudinary that are no longer used anywhere.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  {/* Stats */}
                  <div className="px-4 py-2 rounded-lg border border-white/5 bg-white/[0.02] text-xs font-bold">
                    <span className="text-white/40 uppercase tracking-wider block text-[9px] mb-0.5">Total Size</span>
                    <span className="text-white">
                      {(
                        unusedImages.reduce((sum, img) => sum + img.bytes, 0) /
                        (1024 * 1024)
                      ).toFixed(2)}{" "}
                      MB
                    </span>
                  </div>

                  <button
                    onClick={fetchUnusedImages}
                    disabled={scanningUnused}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 hover:border-primary text-xs uppercase font-extrabold tracking-wider text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${scanningUnused ? "animate-spin text-primary" : ""}`} />
                    {scanningUnused ? "Scanning..." : "Rescan Images"}
                  </button>

                  <button
                    onClick={() => handleDeleteUnusedImages(selectedUnusedPids)}
                    disabled={selectedUnusedPids.length === 0 || deletingUnused}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-white text-xs uppercase font-extrabold tracking-wider text-black transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {deletingUnused ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-black" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5 text-black" />
                        Delete Selected ({selectedUnusedPids.length})
                      </>
                    )}
                  </button>
                </div>
              </div>

              {scanningUnused ? (
                <div className="flex flex-col items-center justify-center gap-4 py-24">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-xs uppercase font-extrabold tracking-widest text-white/40 animate-pulse">
                    Scanning Cloudinary assets & Database records...
                  </p>
                </div>
              ) : unusedImages.length === 0 ? (
                <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-16 text-center text-white/40 space-y-2 max-w-lg mx-auto">
                  <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
                  <p className="font-semibold uppercase tracking-wider text-sm text-white">All images are in use!</p>
                  <p className="text-xs">Zero unused image files were found in folder &apos;tvf-clone/&apos;.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Select All Row */}
                  <div className="flex items-center justify-between py-2 px-4 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white/60">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold uppercase tracking-wider text-[10px]">
                      <input
                        type="checkbox"
                        checked={selectedUnusedPids.length === unusedImages.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUnusedPids(unusedImages.map((img) => img.public_id));
                          } else {
                            setSelectedUnusedPids([]);
                          }
                        }}
                        className="rounded border-white/20 bg-black text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      />
                      Select All ({unusedImages.length} images found)
                    </label>
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {unusedImages.map((item) => {
                      const filename = item.public_id.split("/").pop();
                      const fileSize = (item.bytes / 1024).toFixed(1) + " KB";
                      const isSelected = selectedUnusedPids.includes(item.public_id);
                      
                      return (
                        <div
                          key={item.public_id}
                          onClick={() => toggleUnusedSelection(item.public_id)}
                          className={`group relative rounded-xl border p-3.5 bg-white/[0.01] hover:bg-white/[0.02] transition-all flex flex-col justify-between gap-3.5 cursor-pointer ${
                            isSelected ? "border-primary/50 bg-primary/[0.02]" : "border-white/5"
                          }`}
                        >
                          {/* Image Thumbnail */}
                          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-neutral-900 group-hover:border-white/20 transition-colors">
                            <img
                              src={item.secure_url}
                              alt={filename}
                              className="object-cover w-full h-full"
                            />
                            
                            {/* Checkbox overlay */}
                            <div className="absolute top-2 left-2 z-10">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}} // handled by parent onClick
                                className="rounded border-white/20 bg-black/55 text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer shadow-lg"
                              />
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="space-y-1 min-w-0">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider truncate" title={filename}>
                              {filename}
                            </h4>
                            <p className="text-[10px] text-white/40 flex items-center justify-between font-medium">
                              <span>{fileSize}</span>
                              <span>{new Date(item.created_at).toLocaleDateString()}</span>
                            </p>
                          </div>

                          {/* Individual Delete overlay */}
                          <div className="absolute bottom-11 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity z-15">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUnusedImages([item.public_id]);
                              }}
                              className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white shadow-xl hover:scale-105 transition-all cursor-pointer"
                              title="Delete permanently"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-white" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}
