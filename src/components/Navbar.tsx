"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { title: "Home", url: "/" },
  { title: "About Us", url: "/#about" },
  { title: "Originals", url: "/originals" },
  { title: "Branded Content", url: "/branded-content" },
  { title: "Blog", url: "/blog" },
  { title: "Contact Us", url: "/contact-us" },
];

const SOCIAL_LINKS = [
  {
    name: "Youtube",
    url: "https://www.youtube.com/@cineplusbd",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.398 12 3.398 12 3.398s-7.52 0-9.388.657a3.003 3.003 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.657 5.837a3.002 3.002 0 0 0 2.11 2.108C4.48 20.602 12 20.602 12 20.602s7.52 0 9.388-.657a3.002 3.002 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.657-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/cinepluse",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/cineplusbd",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0  z-50 transition-all duration-300 ${isScrolled
          ? "bg-black/80 backdrop-blur-md py-4 shadow-lg border-b border-white/5"
          : "bg-transparent pt-2"
          }`}
      >
        <div className="max-w-[1740px] mx-auto px-4 md:px-8 flex items-center justify-between ">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center transition-transform hover:scale-105 "
          >
            <img
              src="/logo-color.svg"
              alt="Logo"
              className="h-20 object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-10">
            <ul className="flex items-center gap-10 text-sm font-semibold tracking-wider uppercase">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.url ||
                  (link.url.startsWith("/#") && pathname === "/");

                return (
                  <li key={link.title}>
                    <Link
                      href={link.url}
                      className={`transition-colors duration-200 hover:text-primary ${isActive ? "text-primary font-bold" : "text-white"
                        }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Socials & Mobile Burger */}
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4">
              {SOCIAL_LINKS.map((social, idx) => {
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-primary transition-colors duration-200"
                  >
                    {social.svg}
                  </a>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="xl:hidden p-2 rounded-md border border-white/20 hover:border-primary text-white hover:text-primary transition-all duration-200"
              aria-label="Toggle Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Offcanvas Overlay Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />

            {/* Sidebar Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
              className="fixed right-0 top-0 bottom-0 w-[300px] sm:w-[350px] bg-tvf-dark border-l border-white/5 z-50 p-8 flex flex-col justify-between"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between mb-12">
                  <div className="relative h-20 w-56">
                    <img
                      alt="Logo"
                      src="/logo.svg"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-md border border-white/10 text-white/70 hover:text-primary hover:border-primary transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-6 text-lg font-semibold tracking-wider uppercase">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.url;
                    return (
                      <Link
                        key={link.title}
                        href={link.url}
                        onClick={() => setIsOpen(false)}
                        className={`transition-colors py-2 hover:text-primary ${isActive ? "text-primary font-bold" : "text-white"
                          }`}
                      >
                        {link.title}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Social icons at bottom of drawer */}
              <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                {SOCIAL_LINKS.map((social, idx) => {
                  return (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-primary transition-colors"
                    >
                      {social.svg}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
