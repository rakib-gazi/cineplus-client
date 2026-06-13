"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lock, Mail } from "lucide-react";

export default function AdminLoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If user is already authenticated, skip login page
    const verifySession = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          router.replace("/admin/dashboard");
        } else {
          setChecking(false);
        }
      } catch (err) {
        setChecking(false);
      }
    };
    verifySession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-primary" />
          <p className="text-sm font-semibold tracking-wider text-white/60 uppercase animate-pulse">
            Checking Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-black px-4 overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] translate-x-1/2 translate-y-1/2 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 shadow-2xl z-10"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src="/logo-color.svg"
            alt="TVF Logo"
            className="h-16 object-contain mb-4"
          />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" /> Staff Administration
          </div>
          <h2 className="text-2xl font-extrabold uppercase text-white tracking-wide">
            Control Portal
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg bg-primary/10 border border-primary/25 p-3.5 text-center text-sm font-semibold text-primary"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
              Administrative Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cineplus.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
              Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-primary transition-colors text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg bg-primary hover:bg-white text-black font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/40 font-medium">
            Protected administration module. Unauthorized login attempts are logged.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
