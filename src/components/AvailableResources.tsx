import React, { useState } from 'react';
import { Building2, Users, MapPin, CheckCircle2, AlertCircle, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { CampusResource, ResourceType } from '../types';

interface AvailableResourcesProps {
  onBookResource: (resource: CampusResource) => void;
}

export const AvailableResources: React.FC<AvailableResourcesProps> = ({ onBookResource }) => {
  const { resources, bookings } = usePortal();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [showAll, setShowAll] = useState<boolean>(false);

  const filterTypes = [
    { label: 'All Resources', value: 'all' },
    { label: 'Auditoriums', value: 'auditorium' },
    { label: 'Seminar Halls', value: 'seminar_hall' },
    { label: 'Computer Labs', value: 'computer_lab' },
    { label: 'Conference Rooms', value: 'conference_room' },
    { label: 'AV & Equipment', value: 'equipment' },
  ];

  const filteredResources = resources.filter(res => {
    if (selectedType === 'all') return true;
    return res.type === selectedType;
  });

  const displayedResources = showAll ? filteredResources : filteredResources.slice(0, 3);

  // Helper to check today's booking density
  const getResourceStatus = (resourceId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const activeToday = bookings.filter(b => 
      b.resourceId === resourceId && 
      (b.status === 'confirmed' || b.status === 'pending')
    );
    return {
      count: activeToday.length,
      isAvailable: activeToday.length === 0
    };
  };

  return (
    <section id="resources" className="py-20 bg-brand-light/40 scroll-mt-20 border-t border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header matching wireframe */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-brand-dark/10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-dark/50">
              Campus Facilities &amp; Equipment
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark mt-1">
              AVAILABLE RESOURCES
            </h2>
            <p className="text-sm text-brand-dark/65 mt-1">
              Check real-time facility availability, seating capacities, and equipment specifications before reserving.
            </p>
          </div>

          {/* Quick Info Tag */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Conflict Prevention Active</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {filterTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all ${
                selectedType === t.value
                  ? 'bg-brand-dark text-white shadow-xs'
                  : 'bg-white text-brand-dark/70 hover:bg-brand-cream hover:text-brand-dark border border-brand-dark/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid - Wireframe Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedResources.map((res) => {
            const status = getResourceStatus(res.id);

            return (
              <div
                key={res.id}
                className="group bg-white rounded-2xl border border-brand-dark/10 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image with status badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-brand-sand">
                    <img
                      src={res.imageUrl}
                      alt={res.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Wireframe Availability Badge */}
                    <div className="absolute top-3 left-3">
                      {res.isAvailable ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-700 text-white shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Available</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-700 text-white shadow-md">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Maintenance</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider bg-black/60 text-white backdrop-blur-sm">
                      {res.capacity} Seats
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-brand-green mb-1">
                      {res.type.replace('_', ' ')}
                    </div>

                    <h3 className="font-playfair text-xl font-bold text-brand-dark group-hover:text-brand-green transition-colors">
                      {res.name}
                    </h3>

                    <p className="text-xs text-brand-dark/70 mt-1.5 leading-relaxed line-clamp-2">
                      {res.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-brand-dark/80">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                        <span className="truncate">{res.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-brand-green shrink-0" />
                        <span>Maximum Capacity: <strong>{res.capacity} attendees</strong></span>
                      </div>
                    </div>

                    {/* Facilities Tags */}
                    <div className="mt-4 pt-3 border-t border-brand-dark/10">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50 mb-2">
                        Equipment &amp; Facilities
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {res.facilities.slice(0, 3).map((f, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-md bg-brand-cream text-[10px] font-medium text-brand-dark/80 border border-brand-dark/5"
                          >
                            ✓ {f}
                          </span>
                        ))}
                        {res.facilities.length > 3 && (
                          <span className="px-2 py-0.5 rounded-md bg-brand-light text-[10px] font-semibold text-brand-dark/60">
                            +{res.facilities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Button: [Book Now] */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onBookResource(res)}
                    className="w-full py-3 rounded-xl bg-brand-dark hover:bg-brand-green text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Wireframe [ View Resources ] CTA */}
        {filteredResources.length > 3 && (
          <div className="text-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-dark text-white text-xs font-semibold tracking-wider uppercase rounded-full hover:bg-brand-green transition-all shadow-sm"
            >
              <span>{showAll ? 'Show Fewer Resources' : 'View All Resources'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
