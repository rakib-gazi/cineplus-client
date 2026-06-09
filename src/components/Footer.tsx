export default function Footer() {
  const SOCIAL_MEDIA = [
    {
      name: "Youtube",
      url: "https://www.youtube.com/@TheViralFever",
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
      name: "Instagram",
      url: "https://www.instagram.com/theviralfever",
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
    {
      name: "Facebook",
      url: "https://www.facebook.com/TheViralFever/",
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
      name: "LinkedIn",
      url: "https://in.linkedin.com/company/theviralfever",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Twitter X",
      url: "https://x.com/TheViralFever",
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 72 72"
          fill="currentColor"
        >
          <path d="M42.5,31.2L66,6h-6L39.8,27.6L24,6H4l24.6,33.6L4,66h6l21.3-22.8L48,66h20L42.5,31.2z M12.9,10h8l38.1,52h-8L12.9,10z" />
        </svg>
      ),
    },
    {
      name: "Snapchat",
      url: "https://www.snapchat.com/add/the.viralfever",
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
          <path d="M12 3c-1.2 0-2.4.6-3 1.7A8 8 0 0 0 8 9v1.2c0 .9-.5 1.8-1.3 2.3A2 2 0 0 0 6 16c0 1.2 1.6 2 3 2v1c0 1.1.9 2 2 2s2-.9 2-2v-1c1.4 0 3-.8 3-2a2 2 0 0 0-.7-1.5c-.8-.5-1.3-1.4-1.3-2.3V9a8 8 0 0 0-1-4.3c-.6-1.1-1.8-1.7-3-1.7Z" />
          <path d="M6 16c-1.5 0-3-.5-3-1.5s1-1.5 2.5-1.5" />
          <path d="M18 16c1.5 0 3-.5 3-1.5s-1-1.5-2.5-1.5" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: "https://www.whatsapp.com/channel/0029VaBm5kL7YSd0pXhaXy0e",
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
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-black pt-16 pb-12 border-t border-white/5 z-10">
      <div className="max-w-[1400px] mx-auto px-4 text-center">
        {/* Contact Heading */}
        <h4 className="text-4xl md:text-5xl font-extrabold uppercase text-primary tracking-wider mb-6">
          Contact
        </h4>

        {/* Address */}
        <p className="max-w-[800px] mx-auto text-white/80 text-sm md:text-base leading-relaxed mb-8">
          702, A-Wing, Fortune Terraces, New Link Rd, Veera Desai Industrial Estate,
          Andheri West, Mumbai, Maharashtra 400053
        </p>

        {/* Line separator */}
        <div className="h-[1px] bg-white/20 max-w-[1200px] mx-auto mb-8 rounded-full" />

        {/* Social Icons Container */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-10">
          {SOCIAL_MEDIA.map((social) => {
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full text-white/70 hover:text-primary hover:bg-white/10 hover:scale-110 transition-all duration-300 shadow-md border border-white/10"
                title={social.name}
              >
                {social.svg}
              </a>
            );
          })}
        </div>

        {/* Copyright text */}
        <p className="text-white/40 text-xs md:text-sm tracking-wide">
          © {new Date().getFullYear()} Contagious Online Media Network Private Limited
        </p>
      </div>
    </footer>
  );
}
