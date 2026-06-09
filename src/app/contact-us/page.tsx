"use client";

import { motion } from "framer-motion";
import { Mail, Briefcase, FileText, BarChart3, MapPin } from "lucide-react";

const CONTACT_DEPARTMENTS = [
  {
    title: "Hiring",
    subtitle: "Join the team, build stories",
    email: "careers@theviralfever.com",
    icon: Briefcase,
  },
  {
    title: "Script Pitching",
    subtitle: "Pitch your story to us",
    email: "scripts@theviralfever.com",
    icon: FileText,
  },
  {
    title: "Business Enquiry",
    subtitle: "Partner with us for impactful storytelling",
    email: "business@theviralfever.com",
    icon: BarChart3,
  },
];

export default function ContactUsPage() {
  return (
    <div className="relative min-h-[calc(100vh-6rem)] bg-black text-white flex flex-col py-16 px-4 md:px-8 max-w-[1400px] mx-auto overflow-hidden">
      
      {/* Background visual detail */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Title Header */}
      <div className="mb-16 border-b border-white/5 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-xs font-extrabold uppercase tracking-widest block mb-2">
            Reach Out
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            Get in Touch
          </h1>
        </motion.div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Column: Interactive Map */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 p-2 h-[350px] sm:h-[450px]"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3769.2965394888356!2d72.83225399999999!3d19.1384926!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c825a5cb8ba9%3A0xe64e777fd90c77dd!2sThe%20Viral%20Fever!5e0!3m2!1sen!2sin!4v1751865964291!5m2!1sen!2sin"
            className="w-full h-full rounded-xl"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="TVF Office Location Map"
          />
        </motion.div>

        {/* Right Column: Contact listings */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          {/* Office Address Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 rounded-xl bg-white/5 border border-white/5 flex gap-4"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-2">
                Headquarters
              </h4>
              <p className="text-white/70 text-sm md:text-base leading-relaxed">
                702, A-Wing, Fortune Terraces, New Link Rd, Veera Desai Industrial Estate,
                Andheri West, Mumbai, Maharashtra 400053
              </p>
            </div>
          </motion.div>

          {/* Department Listings */}
          <div className="flex flex-col gap-6">
            {CONTACT_DEPARTMENTS.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <motion.div
                  key={dept.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                  className="p-6 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all duration-300 flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-white font-extrabold text-lg uppercase tracking-wider mb-1 group-hover:text-primary transition-colors duration-300">
                      {dept.title}
                    </h3>
                    <p className="text-white/60 text-xs md:text-sm mb-3">
                      {dept.subtitle}
                    </p>
                    <a
                      href={`mailto:${dept.email}`}
                      className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:underline"
                    >
                      <Mail className="h-4 w-4" /> {dept.email}
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
