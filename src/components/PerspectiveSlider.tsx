"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Show } from "@/data/shows";

interface PerspectiveSliderProps {
  shows: Show[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isHoveringCard: boolean;
  setIsHoveringCard: (hovering: boolean) => void;
  onCardClick?: (show: Show) => void;
}

export default function PerspectiveSlider({
  shows,
  activeIndex,
  setActiveIndex,
  isHoveringCard,
  setIsHoveringCard,
  onCardClick,
}: PerspectiveSliderProps) {
  return (
    <div className="relative w-[280px] sm:w-[350px] aspect-[3/4] preserve-3d">
      <AnimatePresence>
        {shows.map((show, idx) => {
          // Calculate offsets relative to the active index
          const offset = idx - activeIndex;
          const isCenter = idx === activeIndex;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Transform calculations for 3D stack depth
          const rotateY = offset * -25;
          const translateZ = Math.abs(offset) * -100;
          const translateX = offset * 120;
          const opacity = 1 - Math.abs(offset) * 0.45;
          const zIndex = 10 - Math.abs(offset);

          return (
            <motion.div
              key={show.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                originX: 0.5,
                originY: 0.5,
                zIndex,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                x: translateX,
                scale: isCenter ? 1 : 0.9,
                opacity,
                rotateY,
                z: translateZ,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
              onClick={() => {
                if (isCenter) {
                  onCardClick?.(show);
                } else {
                  setActiveIndex(idx);
                }
              }}
              onMouseEnter={() => isCenter && setIsHoveringCard(true)}
              onMouseLeave={() => isCenter && setIsHoveringCard(false)}
              className={`rounded-2xl overflow-hidden border cursor-pointer ${
                isCenter
                  ? "border-primary shadow-2xl shadow-primary/10"
                  : "border-white/5 pointer-events-none"
              }`}
            >
              <Image
                src={show.image}
                alt={show.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 280px, 350px"
              />
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              {/* Show title overlay on cards behind the active card */}
              {!isCenter && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[1px]">
                  <h3 className="text-white text-center font-bold px-4 uppercase text-lg sm:text-2xl drop-shadow-md">
                    {show.title}
                  </h3>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
