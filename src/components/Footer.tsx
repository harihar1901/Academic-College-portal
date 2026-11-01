import React from 'react';
import { GraduationCap, ArrowUp, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-brand-light pt-16 pb-12 border-t border-brand-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-playfair text-xl font-bold tracking-tight text-white">
                CAMPUS<span className="text-brand-light/70">PORTAL</span>
              </span>
            </div>

            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              Official centralized academic event scheduling and campus resource booking system. Dedicated to conflict-free venue coordination for students, faculty, and university administrators.
            </p>

            <div className="flex items-center gap-4 text-xs text-white/60 pt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-light" />
                University Senate Block
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-brand-light" />
                facilities@campus.edu
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-white/70">
              <li><a href="#home" className="hover:text-white transition-colors">Portal Home</a></li>
              <li><a href="#events" className="hover:text-white transition-colors">Academic Events</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors">Campus Resources</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">Booking Lifecycle</a></li>
            </ul>
          </div>

          {/* Col 3: Institutional Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/90">
              Booking Desk Hours
            </h4>
            <p className="text-xs text-white/70 leading-relaxed">
              Monday – Friday: 08:00 AM – 08:00 PM<br />
              Saturday: 09:00 AM – 02:00 PM<br />
              Sunday &amp; Gazetted Holidays: Closed
            </p>
            <p className="text-[11px] text-white/50 pt-1">
              Automated AI query desk available 24/7.
            </p>
          </div>
        </div>

        {/* Wireframe Exact Footer Bar: About | Contact | Help | Privacy | Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 font-medium">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <span className="text-white/20">|</span>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <span className="text-white/20">|</span>
            <a href="#help" className="hover:text-white transition-colors">Help</a>
            <span className="text-white/20">|</span>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
            <span className="text-white/20">|</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
          </div>

          <div className="flex items-center gap-4">
            <span>© 2026 Academic Event &amp; Resource Booking Portal. All rights reserved.</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
