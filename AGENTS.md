<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TVF Clone - Project Handbook & Agent Context

This handbook documents the current state, technical decisions, and architecture of the cloned "The Viral Fever" (TVF) website (`https://theviralfever.com/`) to help subsequent AI agents collaborate effectively.

---

## 🚀 Project Overview & Completed Scope
The website has been cloned with 100% visual and interactive fidelity using a modern Next.js stack:
1. **Home Page (`/`):** Loops the official TVF montage video, features a stylized "Our Journey" section, maps an 8-show "Binge-Worthy Originals" grid (fully interactive with the details modal), displays subscribers stats, features a double-row scrolling show poster marquee, and maps sister channels.
2. **Originals (`/originals`):** Uses an interactive 3D perspective stack slider with active-card cursor overlay ("View Demo"). Supports real-time text searches and genre filters. Clicking the active card triggers the details modal.
3. **Branded Content (`/branded-content`):** Categorized grid directory of partner brands with hover-activated circular details.
4. **Contact Us (`/contact-us`):** Location map embed, administrative department emails, and office location highlights.
5. **Blog & Details (`/blog`, `/blog/[id]`):** Complete publication log showcasing news, events, and behind-the-scenes content.

---

## 🛠️ Technical Stack & Configurations
- **Framework:** Next.js 16+ (App Router, TypeScript)
- **Database:** MongoDB (via Mongoose schemas defined in `src/models/`).
- **Styling:** Tailwind CSS v4 (no raw CSS used).
- **Animations:** Framer Motion for stack transitions, modal fades, hover states, and scrolling marquees.
- **Configurations:**
  - `next.config.ts`: Configured `remotePatterns` for `api.theviralfever.com` (montage media & official posters) and `images.unsplash.com` (actor avatar images).
  - `@import` url loading Google Fonts (**Syne**, **Big Shoulders Display**, **Marcellus**, **Aladin**) configured cleanly in `globals.css` to prevent Turbopack compile warnings.

---

## 🏗️ Architecture & Server-Side Rendering (SSR)
- **SSR Page Loaders**: All public landing pages (`/`, `/originals`, `/branded-content`, `/blog`) are Server Components that fetch data directly from MongoDB and pass serializable JSON objects as props.
- **Hydration & Caching**: Props pre-fill client component states on mount, preventing initial shimmers and loading skeletons, optimizing First Contentful Paint (FCP), and providing fully indexable HTML content for SEO.
- **Favicon**: Recreated the film camera "PLUS" logo as a clean, square-cropped SVG file (`public/favicon.svg`) and linked it in `src/app/layout.tsx` metadata icons.

---

## 🧩 Key Reusable Components
- **[Navbar](file:///d:/Najmul%20New/src/components/Navbar.tsx):** Sticky translucency, mobile side navigation drawer, and SVG social links.
- **[Footer](file:///d:/Najmul%20New/src/components/Footer.tsx):** High-fidelity dark layout containing inline SVGs to avoid package mismatch warnings.
- **[PerspectiveSlider](file:///d:/Najmul%20New/src/components/PerspectiveSlider.tsx):** Pure Framer-Motion 3D perspective stack. Computes offsets and rotation angles dynamically.
- **[ShowDetailsModal](file:///d:/Najmul%20New/src/components/ShowDetailsModal.tsx):** Immersive details modal featuring laurel badges, IMDb rating outline pill, and scrollable circular cast lists.

---

## 🔑 Admin Dashboard Modules (`/admin/dashboard`)
1. **Spotlight Summary Dashboard**: Default tab showing live metrics (e.g. active hero, shows on homepage, published blogs, inquiries count, unused image count) and Quick Action shortcuts.
2. **Hero Banner Manager**: CRUD operations to prioritize and publish spotlight slides.
3. **Content Manager**: Dynamic CRUD dashboard for Shows, including IMDb scores, type badges, and cast arrays.
4. **Relational Branded Content**: Manages standalone Categories and Brand items, preventing category duplicates by dynamically grouping brands.
5. **Partner Inquiries**: Lists response cards from the frontend "Partner With Us" modal form.
6. **Unused Images Manager**: Scans Cloudinary assets inside `tvf-clone/`, compares them with database models (including regex parsing of inline `<img>` tags inside Blog content), and offers bulk delete actions.

---

## ⚠️ Notes for Future Agents
- **Props Serialization**: When querying Mongoose models inside Next.js Server Components, always map documents to convert ObjectIds (`_id`) to strings and serialize dates before passing them to Client Components.
- **Icon Libraries**: Do not install third-party icon packages for brand social icons. Use inline SVGs to keep the production build stable and prevent export missing failures.
- **Fonts Loading**: Do not load the Google fonts inside `layout.tsx` using `next/font/google` as Turbopack fails to resolve some of the fonts during optimized builds. Keep the `@import` directive at the absolute top of [globals.css](file:///d:/Najmul%20New/src/app/globals.css).
- **Deployments**: The codebase is fully verified and deployed to Vercel. Double-check types using `pnpm build` before pushing any code modification.
