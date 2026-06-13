"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, ArrowRight, Loader2 } from "lucide-react";

interface BlogPost {
  _id: string;
  banner: string;
  title: string;
  blogdate: string;
  content: string;
  createdAt: string;
}

export default function BlogClient() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Custom hover cursor state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blog");
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setBlogs(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Strip HTML tags helper
  const stripHtml = (htmlStr: string) => {
    if (!htmlStr) return "";
    return htmlStr.replace(/<[^>]*>/g, "");
  };

  // Filter posts based on search term
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-[calc(100vh-6rem)] bg-black text-white flex flex-col py-16 px-4 md:px-8 max-w-[1740px] mx-auto overflow-hidden">
      
      {/* Custom Read Article Cursor Overlay */}
      <AnimatePresence>
        {hoveredCardId && (
          <motion.div
            style={{
              position: "fixed",
              left: mousePos.x - 48,
              top: mousePos.y - 48,
              pointerEvents: "none",
              zIndex: 100,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="w-24 h-24 rounded-full bg-primary text-black font-extrabold text-[10px] flex items-center justify-center uppercase tracking-widest text-center shadow-2xl border border-black/10"
          >
            Read<br />Article
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 border-b border-white/5 pb-10 mt-10">
        <div>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-3">
            CINEPLUS <span className="text-primary">BLOG</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base font-medium">
            Discover the latest news, behind-the-scenes logs, and production updates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all duration-300"
          />
          <Search className="absolute left-4 top-4 h-4.5 w-4.5 text-white/30" />
        </div>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-xs uppercase font-extrabold tracking-widest text-white/40 animate-pulse">
            Loading Articles...
          </p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-24 text-center space-y-4">
          <div className="w-16 h-16 rounded-full border border-white/10 bg-white/[0.02] flex items-center justify-center text-white/40 text-xl font-bold">
            !
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold uppercase tracking-wider text-white">No articles found</h3>
            <p className="text-sm text-white/40 max-w-sm">
              We couldn&apos;t find any blog posts matching &quot;{searchTerm}&quot;. Try adjusting your search query.
              </p>
          </div>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 pb-16"
        >
          {filteredBlogs.map((blog) => (
            <motion.article
              key={blog._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="group relative flex flex-col bg-white/[0.01] border border-white/5 hover:border-primary/25 rounded-2xl overflow-hidden transition-all duration-350 shadow-lg hover:shadow-primary/5 cursor-pointer"
              onMouseEnter={() => setHoveredCardId(blog._id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              <Link href={`/blog/${blog._id}`} className="flex flex-col h-full">
                {/* Banner wrapper */}
                <div className="relative aspect-video w-full overflow-hidden bg-black/40 border-b border-white/5">
                  <img
                    src={blog.banner}
                    alt={blog.title}
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500 ease-out opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-60" />
                </div>

                {/* Content wrapper */}
                <div className="flex-grow p-6 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    {/* Date badge */}
                    <div className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-widest">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                      <span>{formatDate(blog.blogdate)}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-wide text-white group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                      {blog.title}
                    </h3>

                    {/* Snippet */}
                    <p className="text-xs md:text-sm text-white/50 leading-relaxed font-sans line-clamp-3">
                      {stripHtml(blog.content)}
                    </p>
                  </div>

                  {/* Read More dynamic bottom footer */}
                  <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-primary group-hover:text-white transition-colors duration-200 pt-4 border-t border-white/5">
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1.5 transition-transform duration-200" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  );
}
