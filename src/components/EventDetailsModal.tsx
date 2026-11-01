import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Share2,
  Building
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { AcademicEvent } from '../types';

interface EventDetailsModalProps {
  event: AcademicEvent | null;
  onClose: () => void;
  onViewMyBookings: () => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onViewMyBookings
}) => {
  const { registerForEvent, unregisterForEvent, myRegistrations, currentUser } = usePortal();
  const [successNotice, setSuccessNotice] = useState(false);

  if (!event) return null;

  const isRegistered = myRegistrations.includes(event.id);
  const seatsRemaining = event.capacity - event.registeredCount;
  const isFull = seatsRemaining <= 0;

  const handleRegister = () => {
    const ok = registerForEvent(event.id);
    if (ok) {
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 4000);
    }
  };

  const handleUnregister = () => {
    unregisterForEvent(event.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm overflow-y-auto animate-fade-down">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-dark/10 overflow-hidden my-8">
        
        {/* Banner with close button and category */}
        <div className="relative h-64 sm:h-72 w-full bg-brand-sand overflow-hidden">
          <img 
            src={event.bannerUrl} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-green text-white shadow-sm">
                {event.category}
              </span>
              <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">
                {event.department}
              </span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Registration status feedback */}
          {successNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between animate-fade-up">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>✅ Registration successful! This event is now linked to your student dashboard.</span>
              </div>
              <button
                onClick={onViewMyBookings}
                className="underline font-bold hover:text-emerald-950"
              >
                View in My Events →
              </button>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-brand-dark/10 text-xs">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-brand-dark/50">Date</div>
              <div className="font-semibold text-brand-dark flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-green" />
                <span>{event.date}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-brand-dark/50">Time</div>
              <div className="font-semibold text-brand-dark flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-green" />
                <span>{event.startTime}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-brand-dark/50">Venue</div>
              <div className="font-semibold text-brand-dark flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-green" />
                <span className="truncate">{event.venueName}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-brand-dark/50">Capacity</div>
              <div className="font-semibold text-brand-dark flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-green" />
                <span>{seatsRemaining} seats left</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-2">
              Event Overview
            </h4>
            <p className="text-xs sm:text-sm text-brand-dark/80 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Speaker & Organizer Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-cream/60 border border-brand-dark/10">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">
                Keynote Speaker
              </span>
              <div className="font-playfair text-sm font-bold text-brand-dark mt-0.5">
                {event.speaker}
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">
                Faculty Organizer
              </span>
              <div className="font-playfair text-sm font-bold text-brand-dark mt-0.5">
                {event.organizer}
              </div>
            </div>
          </div>

          {/* Requirements & Registration Deadline */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-brand-dark/70">
            <div>
              <span className="font-semibold text-brand-dark">Registration Deadline:</span>{' '}
              <span className="font-mono text-red-700 font-bold">{event.registrationDeadline}</span>
            </div>
            {event.requirements && (
              <div>
                <span className="font-semibold text-brand-dark">Prerequisites:</span>{' '}
                <span>{event.requirements.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
            <div className="text-xs text-brand-dark/60">
              Logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})
            </div>

            <div className="flex items-center gap-3">
              {isRegistered ? (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Seat Confirmed
                  </span>
                  <button
                    onClick={handleUnregister}
                    className="px-4 py-2 rounded-full border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isFull}
                  className={`px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
                    isFull
                      ? 'bg-brand-dark/20 text-brand-dark/40 cursor-not-allowed'
                      : 'bg-brand-dark hover:bg-brand-green text-white transform hover:-translate-y-0.5'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>{isFull ? 'Hall at Full Capacity' : 'Register for Event'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
