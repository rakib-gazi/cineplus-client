"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Sparkles, X, Send, Loader2, Phone, Mail, User, Building, MessageSquare } from "lucide-react";

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
  logo: string;
  category: string | { _id: string; name: string };
}

interface GroupedCategory {
  _id: string;
  name: string;
  brands: Brand[];
}

interface BrandedContentClientProps {
  initialGroupedCategories: GroupedCategory[];
}

export default function BrandedContentClient({
  initialGroupedCategories,
}: BrandedContentClientProps) {
  const [groupedCategories, setGroupedCategories] = useState<GroupedCategory[]>(initialGroupedCategories);
  const [loading, setLoading] = useState(false);
  
  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setSubmitSuccess(null);

    if (!name.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      setFormError("Please fill out all required fields.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          institution: institution.trim() || undefined,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        // Reset form
        setName("");
        setPhone("");
        setEmail("");
        setInstitution("");
        setMessage("");
      } else {
        setFormError(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch (err) {
      setFormError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* 1. Hero video banner */}
      <section className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source
            src="https://api.theviralfever.com/wp-content/uploads/2025/07/montage-001-720p.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end pb-12 px-4 md:px-8 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[700px]"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3 w-3" /> Impactful Storytelling Partnerships
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-4">
              Branded Content
            </h1>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              We collaborate with global brands to weave their message organically into
              stories that audiences love, talk about, and share.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. Brand Directories by Category */}
      <section className="py-24 max-w-[1400px] mx-auto px-4 md:px-8 w-full min-h-[40vh] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-xs uppercase font-extrabold tracking-widest text-white/40 animate-pulse">
              Loading brands...
            </p>
          </div>
        ) : groupedCategories.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/[0.01] max-w-lg mx-auto w-full px-6">
            <p className="text-white/40 text-sm font-semibold uppercase tracking-wider">
              No branded content partners added yet.
            </p>
          </div>
        ) : (
          groupedCategories.map((category) => (
            <div key={category._id} className="mb-24 last:mb-0">
              {/* Category title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center mb-16 text-center"
              >
                <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-widest text-white border-b border-primary/30 pb-4">
                  {category.name}
                </h2>
              </motion.div>

              {/* Brands grid */}
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {category.brands.map((brand, brandIdx) => (
                  <motion.div
                    key={brand._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: brandIdx * 0.05,
                    }}
                    className="relative group w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-white border border-white/10 shadow-lg cursor-pointer hover:shadow-primary/5 hover:border-primary/20 hover:scale-105 transition-all duration-300"
                  >
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-4 group-hover:opacity-10 transition-opacity duration-300"
                      sizes="(max-width: 640px) 112px, 144px"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <span className="text-white text-xs sm:text-sm font-extrabold text-center uppercase tracking-wider leading-tight drop-shadow-md">
                        {brand.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>

      {/* 3. Call to Action / Pitch details */}
      <section className="py-20 bg-[#0a0a0a] border-t border-white/5 text-center">
        <div className="max-w-[800px] mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider mb-6">
            Partner With Us
          </h3>
          <p className="text-white/60 text-sm md:text-base mb-8 leading-relaxed">
            Ready to co-create premium storytelling that resonates with millions? Get in
            touch with our brand partnerships team to pitch your brand objectives.
          </p>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSubmitSuccess(null);
              setFormError(null);
            }}
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg bg-primary hover:bg-white text-black font-extrabold text-sm tracking-wide transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            Send Business Enquiry
          </button>
        </div>
      </section>

      {/* 4. Glassmorphic Modal for Partner Inquiry Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-neutral-900/90 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-wider text-white">
                    Send Business Enquiry
                  </h3>
                  <p className="text-xs text-white/50">
                    Connect with our brand partnerships team
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary text-2xl font-bold">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold uppercase text-white tracking-wide">
                    Enquiry Submitted!
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed max-w-sm mx-auto">
                    Thank you for reaching out. Our brand partnerships team will review your objectives and contact you shortly.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 hover:border-primary text-xs uppercase font-bold tracking-wider text-white hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-xs rounded-lg text-center">
                      {formError}
                    </div>
                  )}

                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-white/50 block">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. John Doe"
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Contact Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone field */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-extrabold tracking-widest text-white/50 block">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +1 234 567 890"
                          className="w-full bg-black/55 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email field */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-extrabold tracking-widest text-white/50 block">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. name@brand.com"
                          className="w-full bg-black/55 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-primary focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Institution/Brand field */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-white/50 block">
                      Institution / Brand Name (Optional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. Acme Corp"
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-primary focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-extrabold tracking-widest text-white/50 block">
                      Partnership Objectives *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 text-white/30" />
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us about your campaign aims, target audience or custom objectives..."
                        className="w-full bg-black/55 border border-white/10 rounded-lg py-3 pl-11 pr-4 text-sm text-white placeholder-white/20 focus:border-primary focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-primary hover:bg-white text-black font-extrabold text-sm tracking-wider uppercase transition-all shadow-xl hover:scale-[1.01] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-black" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 text-black" />
                        Submit Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
