import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { AcademicEvent } from '../types';

interface UpcomingEventsProps {
  onSelectEvent: (event: AcademicEvent) => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ onSelectEvent }) => {
  const { events, myRegistrations } = usePortal();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAll, setShowAll] = useState<boolean>(false);

  const categories = ['All', 'Workshop', 'Symposium', 'Hackathon', 'Seminar', 'Conference'];

  const filteredEvents = events.filter(e => {
    const matchesCategory = selectedCategory === 'All' || e.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.venueName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const displayedEvents = showAll ? filteredEvents : filteredEvents.slice(0, 3);

  return (
    <section id="events" className="py-20 bg-brand-cream scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header matching wireframe */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-brand-dark/10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-dark/50">
              Campus Academic Calendar
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark mt-1">
              UPCOMING EVENTS
            </h2>
            <p className="text-sm text-brand-dark/65 mt-1">
              Explore seminars, research colloquia, competitions, and technical workshops across university departments.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark/40" />
            <input
              type="text"
              placeholder="Search event, venue, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-brand-dark/15 text-xs text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-green transition-all"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-dark text-white shadow-xs'
                  : 'bg-white/80 text-brand-dark/70 hover:bg-white hover:text-brand-dark border border-brand-dark/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Cards Grid - Wireframe Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedEvents.map((evt) => {
            const isRegistered = myRegistrations.includes(evt.id);
            const remainingSeats = evt.capacity - evt.registeredCount;
            const percentFilled = Math.round((evt.registeredCount / evt.capacity) * 100);

            return (
              <div
                key={evt.id}
                className="group bg-white rounded-2xl border border-brand-dark/10 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image with category chip */}
                  <div className="relative h-48 w-full overflow-hidden bg-brand-sand">
                    <img 
                      src={evt.bannerUrl} 
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-brand-dark shadow-xs">
                        {evt.category}
                      </span>
                    </div>

                    {isRegistered && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-brand-green mb-1">
                      {evt.department}
                    </div>

                    <h3 className="font-playfair text-xl font-bold text-brand-dark group-hover:text-brand-green transition-colors line-clamp-2 min-h-[3.25rem]">
                      {evt.title}
                    </h3>

                    {/* Metadata lines: Date, Time, Venue */}
                    <div className="mt-4 space-y-2 text-xs text-brand-dark/75">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-green shrink-0" />
                        <span className="font-medium">{evt.date}</span>
                        <span className="text-brand-dark/40">•</span>
                        <Clock className="w-3.5 h-3.5 text-brand-dark/40 shrink-0" />
                        <span>{evt.startTime} – {evt.endTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                        <span className="truncate font-medium">{evt.venueName}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Users className="w-4 h-4 text-brand-dark/50 shrink-0" />
                        <span>{evt.registeredCount} / {evt.capacity} seats filled ({remainingSeats} seats remaining)</span>
                      </div>
                    </div>

                    {/* Seats progress bar */}
                    <div className="mt-3 w-full bg-brand-light rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          percentFilled > 90 ? 'bg-amber-600' : 'bg-brand-green'
                        }`}
                        style={{ width: `${percentFilled}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectEvent(evt)}
                    className="w-full py-3 rounded-xl border border-brand-dark/20 bg-brand-cream/60 hover:bg-brand-dark hover:text-white text-brand-dark text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty Search Result */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-brand-dark/10 p-8">
            <Calendar className="w-10 h-10 text-brand-dark/30 mx-auto mb-3" />
            <p className="font-playfair text-lg font-bold text-brand-dark">No upcoming events found</p>
            <p className="text-xs text-brand-dark/60 mt-1">Try clearing your search keyword or switching the category filter.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 px-4 py-2 bg-brand-dark text-white text-xs font-semibold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Wireframe View All Events CTA */}
        {filteredEvents.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark text-white text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-brand-green transition-all shadow-sm"
            >
              <span>{showAll ? 'Show Fewer Events' : 'View All Events'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
