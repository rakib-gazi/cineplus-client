"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Award, Compass, Play } from "lucide-react";
import { SHOWS_DATA, Show } from "@/data/shows";
import ShowDetailsModal from "@/components/ShowDetailsModal";

const SISTER_CHANNELS = [
  {
    name: "The Timeliners",
    subscribers: "7M+ subscribers",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/the-timeliners-1.webp",
    youtube: "https://www.youtube.com/@TheTimeliners",
  },
  {
    name: "The Screen Patti",
    subscribers: "6M+ subscribers",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/tsp.webp",
    youtube: "https://www.youtube.com/@TheScreenPatti",
  },
  {
    name: "Girliyapa",
    subscribers: "5M+ subscribers",
    image: "https://api.theviralfever.com/wp-content/uploads/2025/07/girliyapa.webp",
    youtube: "https://www.youtube.com/@Girliyapa",
  },
];

const MARQUEE_POSTERS = [
  "https://api.theviralfever.com/wp-content/uploads/2025/06/Screenshot-2025-07-05-at-13.28.01-1.webp",
  "https://api.theviralfever.com/wp-content/uploads/2025/07/Untitled-design.jpg",
  "https://api.theviralfever.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-02-at-5.44.14-PM.webp",
  "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-03-184453-1.webp",
  "https://api.theviralfever.com/wp-content/uploads/2025/07/Untitled-design-1.jpg",
  "https://api.theviralfever.com/wp-content/uploads/2025/07/pitchers-poster.png",
  "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-05-at-20.30.36-1-scaled.webp",
  "https://api.theviralfever.com/wp-content/uploads/2025/07/Screenshot-2025-07-05-at-13.29.43-1.webp",
];

export default function HomePage() {
  const [selectedShow, setSelectedShow] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroContent, setHeroContent] = useState({
    tag: "India's Premium Digital Content Creators",
    title: "Cine Plus Studio",
    shortDescription: "Consistently delivering original stories that break stereotypes, balance youth-centric themes, and bring families together.",
    link: "/originals"
  });
  const [homepageShows, setHomepageShows] = useState<any[]>([]);

  useEffect(() => {
    const fetchActiveHero = async () => {
      try {
        const res = await fetch("/api/hero/active");
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.active && result.data) {
            setHeroContent({
              tag: result.data.tag,
              title: result.data.title,
              shortDescription: result.data.shortDescription,
              link: result.data.link
            });
          }
        }
      } catch (err) {
        console.error("Error fetching active hero content:", err);
      }
    };

    const fetchHomepageShows = async () => {
      try {
        const res = await fetch("/api/shows/homepage");
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setHomepageShows(result.data);
          }
        }
      } catch (err) {
        console.error("Error fetching homepage shows:", err);
      }
    };

    fetchActiveHero();
    fetchHomepageShows();
  }, []);

  const mappedDynamicShows = homepageShows.map((item) => ({
    title: item.title,
    category: item.showDramaType ? item.dramaType : "",
    image: item.image,
    rating: item.imdbScore,
    desc: item.shortDescription,
    cast: [],
    link: item.link,
    awardWinnerCategory: item.awardWinnerCategory,
    awardGivenInstitution: item.awardGivenInstitution,
    showAwards: item.showAwards,
    showDramaType: item.showDramaType,
    showImdbScore: item.showImdbScore,
  }));

  const combinedShows = [...mappedDynamicShows, ...SHOWS_DATA];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Video Montage */}
      <section className="relative w-full h-[70vh] md:h-[85vh] lg:h-[90vh] overflow-hidden bg-black">
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
        <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-24 px-4 md:px-8 max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-[700px]"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="h-3 w-3" /> {heroContent.tag}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 uppercase">
              {heroContent.title}
            </h1>
            <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
              {heroContent.shortDescription}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={heroContent.link}
                target={heroContent.link.startsWith("http") ? "_blank" : undefined}
                className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg bg-primary text-black font-bold text-sm tracking-wide transition-all hover:bg-white hover:scale-[1.02] shadow-xl"
              >
                Watch Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-sm transition-all hover:scale-[1.02]"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. About Us Section */}
      <section id="about" className="py-24 bg-black border-t border-white/5 relative scroll-mt-20">
        <div className="max-w-[1200px] mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary text-sm font-extrabold uppercase tracking-widest block mb-4">
              Lights · Camera · Experiment
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-12">
              Our Journey
            </h2>
          </motion.div>

          <div className="max-w-[900px] mx-auto space-y-8 text-white/70 text-base md:text-lg leading-relaxed text-justify md:text-center">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              The Viral Fever (TVF) is one of India&apos;s most popular and critically
              acclaimed content brands. Since its inception in 2012, TVF has consistently
              delivered original content that breaks stereotypes and resonates with millions,
              striking a balance between youth-centric storytelling and family-friendly entertainment.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Founded by Arunabh Kumar, TVF has earned both national and international
              recognition, with multiple original series featured among the top global shows. The
              brand has garnered accolades from prestigious platforms such as the Filmfare
              Awards, the International Emmys, and the Asian Academy Creative Awards.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Despite the rise of numerous content creators and media outlets, TVF remains a
              pioneering force in India&apos;s digital entertainment space, known for its
              consistency, creativity, and commitment to quality storytelling.
            </motion.p>
          </div>
        </div>
      </section>

      {/* 3. Binge-Worthy Originals Gallery */}
      <section className="py-24 bg-tvf-dark relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-primary text-xs font-extrabold uppercase tracking-widest block mb-2">
                Premium Content
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
                Binge-Worthy Originals
              </h2>
            </div>
            <Link
              href="/originals"
              className="inline-flex items-center gap-2 text-primary hover:text-white font-bold transition-colors mt-4 sm:mt-0 text-sm md:text-base group"
            >
              View All Series{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {combinedShows.slice(0, 8).map((show, idx) => (
              <motion.div
                key={show.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => {
                  setSelectedShow(show);
                  setIsModalOpen(true);
                }}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-black/40 border border-white/5 hover:border-primary/45 transition-all shadow-xl hover:shadow-2xl cursor-pointer"
              >
                <Image
                  src={show.image}
                  alt={show.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity" />

                {/* Card Detail Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  {show.rating && (!("showImdbScore" in show) || show.showImdbScore) && (
                    <div className="inline-flex items-center gap-1 text-[10px] md:text-xs text-primary font-bold uppercase tracking-wider mb-2">
                      <Award className="h-3 w-3" /> Rated {show.rating} IMDB
                    </div>
                  )}
                  <h3 className="text-white font-extrabold text-base md:text-xl uppercase tracking-wide leading-tight group-hover:text-primary transition-colors">
                    {show.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Sister Channels */}
      <section className="py-24 bg-black relative border-t border-white/5">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-extrabold uppercase tracking-widest block mb-2">
              Our Networks
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
              Sister Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SISTER_CHANNELS.map((channel, idx) => (
              <motion.a
                key={channel.name}
                href={channel.youtube}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="flex flex-col items-center p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all text-center group relative overflow-hidden"
              >
                <div className="relative w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-primary transition-colors duration-300">
                  <Image
                    src={channel.image}
                    alt={channel.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-white font-extrabold text-xl uppercase tracking-wide mb-1 group-hover:text-primary transition-colors">
                  {channel.name}
                </h3>
                <p className="text-white/60 text-sm mb-6">{channel.subscribers}</p>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary group-hover:text-white transition-colors">
                  Subscribe On YouTube <Play className="h-3 w-3 fill-current" />
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Show Posters Scrolling Marquee */}
      <section className="py-16 bg-tvf-dark overflow-hidden border-y border-white/5 relative">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-tvf-dark to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-tvf-dark to-transparent z-10 pointer-events-none" />

        {/* Row 1 (Left Scrolling) */}
        <div className="flex overflow-hidden mb-6 relative">
          <div className="animate-marquee-left flex gap-6">
            {MARQUEE_POSTERS.concat(MARQUEE_POSTERS).map((img, idx) => (
              <div
                key={idx}
                className="relative w-[180px] md:w-[220px] aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0 border border-white/10"
              >
                <Image
                  src={img}
                  alt="Show Poster"
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 (Right Scrolling) */}
        <div className="flex overflow-hidden relative">
          <div className="animate-marquee-right flex gap-6">
            {MARQUEE_POSTERS.concat(MARQUEE_POSTERS).map((img, idx) => (
              <div
                key={idx}
                className="relative w-[180px] md:w-[220px] aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0 border border-white/10"
              >
                <Image
                  src={img}
                  alt="Show Poster"
                  fill
                  className="object-cover"
                  sizes="220px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Stats Fun Fact Section */}
      <section className="py-20 bg-black text-white relative border-b border-white/5">
        <div className="max-w-[1000px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:divide-x md:divide-white/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <h3 className="text-5xl md:text-7xl font-extrabold text-primary mb-4 tracking-tight">
                100+
              </h3>
              <span className="text-white/60 text-lg md:text-xl font-semibold uppercase tracking-wider">
                Number of Shows
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center justify-center p-6"
            >
              <h3 className="text-5xl md:text-7xl font-extrabold text-primary mb-4 tracking-tight">
                12+
              </h3>
              <span className="text-white/60 text-lg md:text-xl font-semibold uppercase tracking-wider">
                Years of Disrupting Storytelling
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Show Details Modal */}
      <ShowDetailsModal
        show={selectedShow}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
