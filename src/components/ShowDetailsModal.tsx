"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, Play, ArrowRight } from "lucide-react";
import { Show } from "@/data/shows";

interface ShowDetailsModalProps {
  show: Show | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShowDetailsModal({ show, isOpen, onClose }: ShowDetailsModalProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/90 backdrop-blur-md p-4 md:p-8">
          
          {/* Subtle grid background pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 z-55 w-12 h-12 rounded-full bg-white hover:bg-primary text-black transition-all flex items-center justify-center shadow-lg hover:scale-110 active:scale-95"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-[1200px] bg-transparent text-white grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center mx-auto my-auto z-10 py-8 lg:py-0"
          >
            
            {/* Left Content Side */}
            <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
              
              {/* Category / Genre Tag */}
              <span className="text-primary text-xs sm:text-sm font-extrabold uppercase tracking-widest mb-4 block">
                {show.category}
              </span>

              {/* Title */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white mb-6 leading-none">
                {show.title}
              </h2>

              {/* Description */}
              <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                {show.desc}
              </p>

              {/* Laurels Badge (Awards Indicator) */}
              <div className="flex items-center gap-3 mb-8">
                <svg className="h-10 w-10 text-white/40 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" className="hidden" />
                  <path d="M6 12c0-3.31 2.69-6 6-6s6 2.69 6 6-2.69 6-6 6-6-2.69-6-6zm1.5 0c0 2.48 2.02 4.5 4.5 4.5s4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5-4.5 2.02-4.5 4.5z" className="hidden" />
                  {/* Laurels graphics */}
                  <path d="M2.3 8A9.9 9.9 0 0 0 1 12c0 2.3.8 4.4 2.1 6.1l1.5-1.3A7.9 7.9 0 0 1 3 12c0-1.8.6-3.5 1.6-4.9L2.3 8zm19.4 0l-1.5 1.2A7.9 7.9 0 0 1 21 12c0 1.8-.6 3.5-1.6 4.9l1.5 1.3A9.9 9.9 0 0 0 23 12c0-2.3-.8-4.4-2.1-6.1zM8 19.5c1.2.3 2.6.5 4 .5s2.8-.2 4-.5l-.4-1.9c-1.1.3-2.3.4-3.6.4s-2.5-.1-3.6-.4l-.4 1.9zM12 4a7.9 7.9 0 0 1 3.6.8l.9-1.8A9.9 9.9 0 0 0 12 2a9.9 9.9 0 0 0-4.5 1l.9 1.8A7.9 7.9 0 0 1 12 4z" />
                </svg>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest text-white/50 uppercase">
                    TVF Digital Awards Winner
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white/80">
                    Critically Acclaimed Series
                  </span>
                </div>
              </div>

              {/* Cast Section */}
              <div className="mb-10">
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-white/40 mb-4">
                  Cast & Crew
                </h4>
                <div className="flex flex-wrap gap-x-6 gap-y-4 max-w-xl">
                  {show.cast?.map((actor, index) => (
                    <div key={index} className="flex flex-col items-center text-center w-[70px]">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10 mb-2">
                        <Image
                          src={actor.image}
                          alt={actor.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-white/70 leading-tight">
                        {actor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons Panel */}
              <div className="flex flex-wrap items-center gap-4">
                {/* IMDb Rating button */}
                <div className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full border border-primary/40 bg-black text-white font-bold text-xs uppercase tracking-wider">
                  <span className="bg-primary text-black px-1.5 py-0.5 rounded font-black text-[10px]">
                    IMDb
                  </span>
                  <span>{show.rating} / 10</span>
                </div>

                {/* Watch Now Button */}
                <a
                  href="https://www.youtube.com/@TheViralFever"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between gap-6 pl-6 pr-2 py-2 rounded-full border border-white bg-black hover:bg-white hover:text-black font-extrabold text-xs uppercase tracking-widest transition-all group"
                >
                  <span>Watch Now</span>
                  <div className="w-8 h-8 rounded-full bg-white group-hover:bg-black text-black group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </a>
              </div>

            </div>

            {/* Right Poster Side */}
            <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
              <div className="relative w-[280px] sm:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black">
                <Image
                  src={show.image}
                  alt={show.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 280px, 380px"
                  priority
                />
                {/* Gradient shadows */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
