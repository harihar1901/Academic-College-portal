import React from 'react';
import { Sparkles, ArrowUpRight, Compass, Layers } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { AccordionGallery, AccordionGalleryItem } from './AccordionGallery';

interface QuickAccessProps {
  onSelectEvents: () => void;
  onSelectResources: () => void;
  onSelectBookings: () => void;
  onSelectAi: () => void;
}

export const QuickAccess: React.FC<QuickAccessProps> = ({
  onSelectEvents,
  onSelectResources,
  onSelectBookings,
  onSelectAi
}) => {
  const { events, resources, bookings, currentUser } = usePortal();
  const userBookings = bookings.filter((b) => b.userId === currentUser.id);

  const items: AccordionGalleryItem[] = [
    {
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop',
      label: 'Events Catalog',
      subtitle: `${events.length} Seminars & Guest Lectures`,
      link: '#events',
      onClick: onSelectEvents
    },
    {
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      label: 'Facility Booking',
      subtitle: `${resources.length} Halls, Labs & Studios`,
      link: '#resources',
      onClick: onSelectResources
    },
    {
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop',
      label: 'My Bookings',
      subtitle: `${userBookings.length} Active Slots`,
      link: '#dashboard',
      onClick: onSelectBookings
    },
    {
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
      label: 'AI Room Finder',
      subtitle: 'Natural Language Search',
      link: '#ai',
      onClick: onSelectAi
    },
    {
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1200&auto=format&fit=crop',
      label: 'Campus Quad',
      subtitle: 'Conflict Prevention Engine',
      link: '#resources',
      onClick: onSelectResources
    }
  ];

  return (
    <section id="quick-access" className="py-24 bg-brand-light/60 border-t border-brand-dark/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-brand-dark/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-dark/5 text-brand-dark text-[11px] font-mono tracking-widest uppercase font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-brand-green" />
              <span>Section 04 // Rapid Navigation</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
              CAMPUS DOMAINS
            </h2>
            <p className="text-sm text-brand-dark/70 mt-2 max-w-xl font-normal leading-relaxed">
              Interactive accordion navigation. Hover or tap across campus sectors to inspect live capacity, reserve auditoriums, or query the intelligence model.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-brand-dark/60 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>GSAP Interactive 3D Canvas</span>
            </div>
            <span className="hidden sm:inline text-brand-dark/20">•</span>
            <span className="hidden sm:inline">Tilt &amp; Parallax Enabled</span>
          </div>
        </div>

        {/* React Bits <AccordionGallery /> Component */}
        <div className="w-full">
          <AccordionGallery
            items={items}
            defaultIndex={1}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#ffffff"
            overlayColor="#060010"
            textColor="#ffffff"
            grayscale={true}
            showLabels={true}
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            height={480}
            gap={12}
            radius={20}
            orientation="horizontal"
            className="shadow-xl border border-brand-dark/10 bg-brand-dark/95 p-3 rounded-3xl"
          />
        </div>

        {/* Interactive Quick Directives Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={onSelectEvents}
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-brand-dark/10 hover:border-brand-green/40 hover:shadow-sm transition-all group text-left"
          >
            <div>
              <span className="text-[10px] font-mono text-brand-green uppercase tracking-wider block font-bold">01 // Events</span>
              <span className="text-sm font-playfair font-bold text-brand-dark group-hover:text-brand-green transition-colors">Catalog</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-brand-dark/40 group-hover:text-brand-green transition-colors" />
          </button>

          <button
            onClick={onSelectResources}
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-brand-dark/10 hover:border-brand-green/40 hover:shadow-sm transition-all group text-left"
          >
            <div>
              <span className="text-[10px] font-mono text-brand-green uppercase tracking-wider block font-bold">02 // Venues</span>
              <span className="text-sm font-playfair font-bold text-brand-dark group-hover:text-brand-green transition-colors">Reservations</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-brand-dark/40 group-hover:text-brand-green transition-colors" />
          </button>

          <button
            onClick={onSelectBookings}
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-brand-dark/10 hover:border-brand-green/40 hover:shadow-sm transition-all group text-left"
          >
            <div>
              <span className="text-[10px] font-mono text-brand-green uppercase tracking-wider block font-bold">03 // Passes</span>
              <span className="text-sm font-playfair font-bold text-brand-dark group-hover:text-brand-green transition-colors">My Schedule</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-brand-dark/40 group-hover:text-brand-green transition-colors" />
          </button>

          <button
            onClick={onSelectAi}
            className="flex items-center justify-between p-4 rounded-xl bg-white border border-brand-dark/10 hover:border-brand-green/40 hover:shadow-sm transition-all group text-left"
          >
            <div>
              <span className="text-[10px] font-mono text-brand-green uppercase tracking-wider block font-bold">04 // Intelligent</span>
              <span className="text-sm font-playfair font-bold text-brand-dark group-hover:text-brand-green transition-colors">AI Matcher</span>
            </div>
            <Sparkles className="w-4 h-4 text-brand-green" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default QuickAccess;
