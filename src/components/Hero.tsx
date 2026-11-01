import React, { useState } from 'react';
import { ArrowRight, Calendar, Building2, Sparkles, CheckCircle2, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface HeroProps {
  onExploreEvents: () => void;
  onBookResource: () => void;
  onOpenAi: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreEvents,
  onBookResource,
  onOpenAi
}) => {
  const [selectedFacility, setSelectedFacility] = useState('All Facilities');
  const [selectedSlot, setSelectedSlot] = useState('Today & Tomorrow');

  return (
    <section 
      id="home"
      className="relative w-full min-h-[740px] lg:min-h-[820px] overflow-hidden bg-brand-cream flex flex-col justify-between pt-24 pb-12"
    >
      {/* Background Layer with vibrant, clearly visible animated video */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-center opacity-70 transition-opacity duration-700 filter brightness-95 contrast-105"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260820_010308_b1636845-4c15-4ab6-b0c9-9a29bfb0c6e3.mp4"
        />
        {/* Soft edge gradient to ensure pristine text readability while leaving video clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/40 via-brand-cream/15 to-brand-cream/90" />
        {/* Subtle grid accent for authentic editorial architecture feel */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#2d3a2e 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
      </div>

      {/* Main Content Column */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full flex-1 flex flex-col justify-center items-start pt-6 sm:pt-10">
        
        {/* Editorial Eyebrow Tag */}
        <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-up stagger-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-dark text-white text-[11px] font-mono tracking-widest uppercase font-semibold">
            <span>OFFICIAL CAMPUS PLATFORM</span>
          </div>
          <button
            onClick={onOpenAi}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-dark/20 bg-white/80 hover:bg-white text-brand-dark text-[11px] font-semibold tracking-wide transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-green" />
            <span>AI Conflict-Free Engine Active</span>
            <ChevronRight className="w-3 h-3 text-brand-dark/50" />
          </button>
        </div>

        <div className="w-full max-w-5xl animate-fade-up stagger-2">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold tracking-tight leading-[1.04] text-brand-dark">
            Academic Event &amp;
            <span className="block text-brand-green font-bold mt-1">
              Resource Booking Portal
            </span>
          </h1>

          {/* Subheading: Direct, Confident, Editorial */}
          <p className="mt-5 text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-brand-dark/85 max-w-3xl leading-snug">
            With purpose and zero scheduling conflicts. Reserve lecture halls, specialized laboratories, amphitheaters, and research gear in real time.
          </p>

          <p className="mt-2 text-sm sm:text-base text-brand-dark/70 max-w-2xl leading-relaxed">
            Eliminate double-bookings and fragmented paper trails with automated collision detection, institutional governance workflows, and instant turnstile access passes.
          </p>
        </div>

        {/* Vita Travels-Inspired Structured Quick-Reserve Ribbon */}
        <div className="w-full max-w-5xl mt-9 bg-white/90 backdrop-blur-md rounded-2xl border border-brand-dark/15 p-2.5 sm:p-3 shadow-lg shadow-brand-dark/5 animate-fade-up stagger-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            
            {/* Field 1: Facility Type */}
            <div className="lg:col-span-3 px-3.5 py-2 rounded-xl hover:bg-brand-cream/80 transition-colors cursor-pointer border border-transparent hover:border-brand-dark/10">
              <span className="block text-[10px] font-mono tracking-wider uppercase text-brand-dark/50 font-bold">
                Facility Category
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-sm font-bold text-brand-dark">{selectedFacility}</span>
                <SlidersHorizontal className="w-3.5 h-3.5 text-brand-dark/40" />
              </div>
            </div>

            {/* Field 2: Dates / Slots */}
            <div className="lg:col-span-3 px-3.5 py-2 rounded-xl hover:bg-brand-cream/80 transition-colors cursor-pointer border border-transparent hover:border-brand-dark/10">
              <span className="block text-[10px] font-mono tracking-wider uppercase text-brand-dark/50 font-bold">
                Schedule &amp; Availability
              </span>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-sm font-bold text-brand-dark">{selectedSlot}</span>
                <Calendar className="w-3.5 h-3.5 text-brand-dark/40" />
              </div>
            </div>

            {/* Field 3: Conflict Status */}
            <div className="lg:col-span-3 px-3.5 py-2 rounded-xl bg-brand-light/60 border border-brand-dark/10">
              <span className="block text-[10px] font-mono tracking-wider uppercase text-brand-dark/50 font-bold">
                Collision Engine
              </span>
              <div className="flex items-center gap-1.5 mt-0.5 text-brand-green font-bold text-xs sm:text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Conflict Verified</span>
              </div>
            </div>

            {/* Action Button: Explore / Book */}
            <div className="lg:col-span-3 flex items-center gap-2">
              <button
                onClick={onBookResource}
                className="w-full h-12 inline-flex items-center justify-center gap-2 px-6 bg-brand-dark text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-xl hover:bg-brand-green transition-all shadow-md group"
              >
                <span>Book Facility</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-8 animate-fade-up stagger-4">
          <button
            onClick={onExploreEvents}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-dark text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full hover:bg-brand-green transition-all transform hover:-translate-y-0.5 shadow-md"
          >
            <Calendar className="w-4 h-4 text-brand-light" />
            <span>Browse Campus Events</span>
          </button>

          <button
            onClick={onBookResource}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-brand-dark text-xs sm:text-sm font-bold tracking-wider uppercase rounded-full border border-brand-dark/20 hover:bg-brand-light hover:border-brand-dark transition-all transform hover:-translate-y-0.5 shadow-xs"
          >
            <Building2 className="w-4 h-4 text-brand-green" />
            <span>Browse Resources</span>
          </button>

          <button
            onClick={onOpenAi}
            className="inline-flex items-center gap-2 px-5 py-3.5 text-brand-dark text-xs sm:text-sm font-semibold hover:text-brand-green transition-colors"
          >
            <Sparkles className="w-4 h-4 text-brand-green" />
            <span className="underline underline-offset-4 decoration-brand-green/40">Ask Natural Language AI Room Finder</span>
          </button>
        </div>

        {/* Key Operational Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10 pt-6 border-t border-brand-dark/10 w-full max-w-4xl animate-fade-up stagger-5">
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">100%</div>
            <div className="text-[11px] uppercase tracking-wider text-brand-dark/60 font-semibold mt-0.5">
              Conflict Prevention
            </div>
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">6+</div>
            <div className="text-[11px] uppercase tracking-wider text-brand-dark/60 font-semibold mt-0.5">
              Campus Facilities
            </div>
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">Instant</div>
            <div className="text-[11px] uppercase tracking-wider text-brand-dark/60 font-semibold mt-0.5">
              Slot Verification
            </div>
          </div>
          <div>
            <div className="font-display text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">Audit-Ready</div>
            <div className="text-[11px] uppercase tracking-wider text-brand-dark/60 font-semibold mt-0.5">
              Approval Protocol
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Governance Footer Banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full mt-8 animate-fade-up stagger-6">
        <p className="text-left text-[11px] tracking-[0.25em] uppercase text-brand-dark/50 mb-3 font-semibold">
          Affiliated Academic Divisions &amp; Councils
        </p>
        <div className="flex flex-wrap items-center justify-between gap-6 py-2 border-t border-brand-dark/10 text-brand-dark/75">
          <span className="font-display text-sm sm:text-base font-bold tracking-tight">
            Faculty of Computing
          </span>
          <span className="font-oswald text-sm sm:text-base tracking-wider uppercase">
            Science &amp; Innovation
          </span>
          <span className="font-montserrat text-xs sm:text-sm font-bold tracking-wider uppercase">
            Campus Research Council
          </span>
          <span className="font-roboto-slab text-xs sm:text-sm font-semibold tracking-wide uppercase">
            Facilities Management
          </span>
          <span className="font-raleway text-xs sm:text-sm font-bold tracking-wider uppercase">
            Student Senate
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
