export default function Footer() {
  const SOCIAL_MEDIA = [
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
    }
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
          15/12 D, Haji Chinu Miah Road, Mohammadpur, Dhaka, Bangladesh, 1207
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
          © {new Date().getFullYear()} All right reserved by cineplus Studio
        </p>
      </div>
    </footer>
  );
}
