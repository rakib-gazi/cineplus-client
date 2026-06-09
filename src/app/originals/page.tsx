"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search, ChevronLeft, ChevronRight, Award, Play } from "lucide-react";
import PerspectiveSlider from "@/components/PerspectiveSlider";

import { SHOWS_DATA, Show } from "@/data/shows";
import ShowDetailsModal from "@/components/ShowDetailsModal";

const CATEGORIES = ["All", "Drama", "Comedy", "Youth", "Family", "Romance", "Tech"];

export default function OriginalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for custom cursor overlay
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Filter shows
  const filteredOriginals = SHOWS_DATA.filter((show) => {
    const matchesSearch = show.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      show.category.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  const activeShow = filteredOriginals[activeIndex] || filteredOriginals[0];

  const handleNext = () => {
    if (filteredOriginals.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % filteredOriginals.length);
  };

  const handlePrev = () => {
    if (filteredOriginals.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + filteredOriginals.length) % filteredOriginals.length);
  };

  // Adjust active index if filtered array changes
  useEffect(() => {
    setActiveIndex(0);
  }, [searchTerm, selectedCategory]);

  return (
    <div className="relative min-h-[calc(100vh-6rem)] bg-black text-white flex flex-col py-12 px-4 md:px-8 max-w-[1740px] mx-auto overflow-hidden">
      
      {/* Custom View Demo Cursor Overlay */}
      {isHoveringCard && (
        <motion.div
          style={{
            position: "fixed",
            left: mousePos.x - 50,
            top: mousePos.y - 50,
            pointerEvents: "none",
            zIndex: 100,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="w-24 h-24 rounded-full bg-primary/95 text-black font-extrabold text-xs flex items-center justify-center uppercase tracking-widest text-center shadow-lg border border-black/10"
        >
          View<br />Demo
        </motion.div>
      )}

      {/* Header section with title and search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
            TVF <span className="text-primary">Originals</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Explore our critically acclaimed, award-winning series
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search original shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all duration-300"
          />
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-white/40" />
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-12">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
              selectedCategory === category
                ? "bg-primary border-primary text-black scale-105"
                : "bg-white/5 border-white/5 text-white/70 hover:bg-white/10 hover:border-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredOriginals.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
          <p className="text-white/40 text-lg mb-4">No original shows match your search.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("All");
            }}
            className="text-primary font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow">
          {/* Left panel: Info on active show */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <AnimatePresence mode="wait">
              {activeShow && (
                <motion.div
                  key={activeShow.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                    <Award className="h-3.5 w-3.5" /> IMDB {activeShow.rating}/10
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
                    {activeShow.title}
                  </h2>
                  <span className="text-primary text-sm font-bold uppercase tracking-wider block mb-6">
                    {activeShow.category}
                  </span>
                  <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
                    {activeShow.desc}
                  </p>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.youtube.com/@TheViralFever"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-6 py-4 rounded-lg bg-primary hover:bg-white text-black font-extrabold text-sm tracking-wide transition-all shadow-xl hover:scale-[1.02]"
                    >
                      <Play className="h-4 w-4 fill-current" /> Watch Now
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Slider navigation controls */}
            <div className="flex items-center gap-4 mt-12">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/10 hover:border-primary text-white hover:text-primary transition-all flex items-center justify-center bg-white/5 hover:bg-white/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-bold tracking-widest text-white/50">
                {activeIndex + 1} / {filteredOriginals.length}
              </span>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/10 hover:border-primary text-white hover:text-primary transition-all flex items-center justify-center bg-white/5 hover:bg-white/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Right panel: 3D perspective cards layout */}
          <div
            ref={containerRef}
            className="lg:col-span-7 flex justify-center items-center h-[450px] sm:h-[550px] relative order-1 lg:order-2"
          >
            <PerspectiveSlider
              shows={filteredOriginals}
              activeIndex={activeIndex}
              setActiveIndex={setActiveIndex}
              isHoveringCard={isHoveringCard}
              setIsHoveringCard={setIsHoveringCard}
              onCardClick={(show) => {
                setSelectedShow(show);
                setIsModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Show Details Modal */}
      <ShowDetailsModal
        show={selectedShow}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
