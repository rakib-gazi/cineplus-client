"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";

interface BlogPost {
  _id: string;
  banner: string;
  title: string;
  blogdate: string;
  content: string;
  createdAt: string;
}

interface BlogDetailsProps {
  id: string;
}

export default function BlogDetailsClient({ id }: BlogDetailsProps) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await fetch(`/api/blog/${id}`);
        const result = await res.json();
        if (res.ok && result.success) {
          setBlog(result.data);
        } else {
          setError(result.error || "Failed to load blog post");
        }
      } catch (err) {
        setError("Network error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [id]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xs uppercase font-extrabold tracking-widest text-white/40 animate-pulse">
          Loading Article Content...
        </p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="w-16 h-16 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center text-primary text-2xl font-bold">
          !
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold uppercase tracking-wide">Failed to load blog</h2>
          <p className="text-sm text-white/40 max-w-md">{error || "The requested blog article does not exist or has been deleted."}</p>
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary text-xs uppercase font-bold tracking-wider text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Hero Header Banner */}
      <div className="relative h-[40vh] md:h-[55vh] w-full bg-neutral-900 overflow-hidden border-b border-white/5">
        <img
          src={blog.banner}
          alt={blog.title}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
        
        {/* Banner Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 max-w-[1200px] mx-auto px-4 md:px-8 pb-8 md:pb-12 space-y-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Blogs
          </Link>
          
          <div className="space-y-2 max-w-6xl">
            {/* Date Badge */}
            <div className="inline-flex items-center gap-2 text-[10px] md:text-xs font-bold text-white/55 uppercase tracking-widest bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{formatDate(blog.blogdate)}</span>
            </div>
            
            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight line-clamp-3">
              {blog.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Article Container */}
      <main className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 space-y-12">
        {/* Rich HTML rendered content */}
        <div 
          className="prose prose-invert max-w-none text-white/80 leading-relaxed font-sans text-xs md:text-sm space-y-6 
            [&_a]:text-primary [&_a]:underline [&_a:hover]:text-white 
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:border-b [&_h2]:border-white/5 [&_h2]:pb-2
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:leading-relaxed [&_p]:mb-5
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/60 [&_blockquote]:bg-white/[0.01] [&_blockquote]:py-1 [&_blockquote]:rounded-r-md"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        
        {/* Back navigation footer */}
        <div className="pt-8 border-t border-white/5 flex justify-start">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blogs
          </Link>
        </div>
      </main>
    </div>
  );
}
