"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, HelpCircle } from "lucide-react";

const BRAND_CATEGORIES = [
  {
    name: "Consumer Electronics",
    brands: [
      {
        name: "Bosch",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/Logos.png",
      },
      {
        name: "IFB",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/IFB-logo.webp",
      },
      {
        name: "Boat",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/87.png",
      },
      {
        name: "Finolex",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/finolex-logo.webp",
      },
      {
        name: "Asus",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/ASUS-logo.webp",
      },
      {
        name: "Huawei",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/14.png",
      },
      {
        name: "LG",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/LG-Logo.webp",
      },
      {
        name: "ZTE Smartphone",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/ZTE-LOgo-1.webp",
      },
      {
        name: "Philips",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/Phillips-Logo-2008-1-scaled.webp",
      },
      {
        name: "Oppo",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/oppo-logo-1.webp",
      },
      {
        name: "Infinix",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/download-19.webp",
      },
      {
        name: "One Plus",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/88.png",
      },
      {
        name: "MI",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/89.png",
      },
      {
        name: "Samsung",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/Samsung_Logo.svg.webp",
      },
      {
        name: "LAVA MOBILES",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/Lava_International.svg.webp",
      },
    ],
  },
  {
    name: "Personal Hygiene",
    brands: [
      {
        name: "Gillette Venus",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/Gillette-Venus.webp",
      },
      {
        name: "Mamaearth",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/88-1.png",
      },
      {
        name: "Everyuth Naturals",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/89-1.png",
      },
      {
        name: "Gillette",
        logo: "https://api.theviralfever.com/wp-content/uploads/2025/07/91.png",
      },
    ],
  },
];

export default function BrandedContentPage() {
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
      <section className="py-24 max-w-[1400px] mx-auto px-4 md:px-8 w-full">
        {BRAND_CATEGORIES.map((category, catIdx) => (
          <div key={category.name} className="mb-24 last:mb-0">
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
                  key={brand.name}
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
        ))}
      </section>

      {/* 3. Call to Action / Pitch details */}
      <section className="py-20 bg-tvf-dark border-t border-white/5 text-center">
        <div className="max-w-[800px] mx-auto px-4">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white uppercase tracking-wider mb-6">
            Partner With Us
          </h3>
          <p className="text-white/60 text-sm md:text-base mb-8 leading-relaxed">
            Ready to co-create premium storytelling that resonates with millions? Get in
            touch with our brand partnerships team to pitch your brand objectives.
          </p>
          <a
            href="mailto:business@theviralfever.com"
            className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg bg-primary hover:bg-white text-black font-extrabold text-sm tracking-wide transition-all shadow-xl hover:scale-[1.02]"
          >
            Send Business Enquiry
          </a>
        </div>
      </section>
    </div>
  );
}
