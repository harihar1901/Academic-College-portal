import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Clock4, 
  Trash2, 
  Plus, 
  QrCode,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { BookingStatus, BookingRequest } from '../types';
import { DigitalTurnstilePass } from './DigitalTurnstilePass';

interface UserDashboardProps {
  onClose: () => void;
  onOpenBookResource: () => void;
  onOpenEvents: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onClose,
  onOpenBookResource,
  onOpenEvents
}) => {
  const { 
    currentUser, 
    bookings, 
    events, 
    myRegistrations, 
    cancelBooking, 
    unregisterForEvent 
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'bookings' | 'events'>('bookings');
  const [selectedPassBooking, setSelectedPassBooking] = useState<BookingRequest | null>(null);

  // Filter bookings for this user
  const userBookings = bookings.filter(b => b.userId === currentUser.id || b.userEmail === currentUser.email);

  // Filter events registered by this user
  const registeredEvents = events.filter(e => myRegistrations.includes(e.id));

  // Helper status badge
  const renderStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Turnstile Pass Minted</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <Clock4 className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Review</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
            <span>Cancelled</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md overflow-y-auto animate-fade-down">
      <div className="relative w-full max-w-4xl bg-brand-cream rounded-3xl shadow-2xl border border-brand-dark/15 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Executive Modal Header */}
        <div className="p-6 sm:p-8 bg-brand-dark text-white flex items-center justify-between border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-emerald-400">
                Institutional Member Dashboard
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
              {currentUser.name}
            </h2>
            <p className="text-xs text-white/70 mt-0.5">
              Identity: <span className="capitalize font-mono font-bold text-emerald-300">{currentUser.role}</span> • {currentUser.department}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metric Cards */}
        <div className="p-6 bg-brand-light/60 border-b border-brand-dark/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-brand-dark/10 shadow-xs">
              <div className="text-[10px] font-mono uppercase font-bold text-brand-dark/50 tracking-wider">
                Public Events
              </div>
              <div className="font-display text-3xl font-black text-brand-dark mt-1">
                {events.length}
              </div>
              <div className="text-[11px] text-brand-green font-medium mt-0.5">
                Campus-wide calendar
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-dark/10 shadow-xs">
              <div className="text-[10px] font-mono uppercase font-bold text-brand-dark/50 tracking-wider">
                My Bookings
              </div>
              <div className="font-display text-3xl font-black text-brand-dark mt-1">
                {userBookings.length}
              </div>
              <div className="text-[11px] text-brand-dark/70 font-medium mt-0.5">
                {userBookings.filter(b => b.status === 'confirmed').length} Approved Passes • {userBookings.filter(b => b.status === 'pending').length} In Review
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-dark/10 shadow-xs">
              <div className="text-[10px] font-mono uppercase font-bold text-brand-dark/50 tracking-wider">
                Registered Events
              </div>
              <div className="font-display text-3xl font-black text-brand-dark mt-1">
                {registeredEvents.length}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                Active RSVPs
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-8 pt-4 bg-white flex items-center gap-6 border-b border-brand-dark/10">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'bookings'
                ? 'border-brand-dark text-brand-dark'
                : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
            }`}
          >
            My Campus Bookings ({userBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              activeTab === 'events'
                ? 'border-brand-dark text-brand-dark'
                : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
            }`}
          >
            My Registered Events ({registeredEvents.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-4 bg-white">
          {activeTab === 'bookings' ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-brand-dark">
                  Reservation History &amp; Turnstile Clearances
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    onOpenBookResource();
                  }}
                  className="px-4 py-2 bg-brand-dark hover:bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Book Facility</span>
                </button>
              </div>

              {userBookings.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-brand-dark/15 rounded-3xl p-8 bg-brand-cream/30">
                  <Building2 className="w-10 h-10 text-brand-dark/30 mx-auto mb-2" />
                  <p className="font-display font-bold text-base text-brand-dark">No campus bookings yet</p>
                  <p className="text-xs text-brand-dark/60 mt-1 max-w-sm mx-auto">
                    Reserve seminar halls, auditoriums, or computer labs with instant collision checking.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBookResource();
                    }}
                    className="mt-4 px-5 py-2.5 rounded-full bg-brand-dark text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-green transition-all"
                  >
                    Start First Booking
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-brand-dark/15 bg-brand-cream/30 hover:border-brand-green/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-display font-extrabold text-base text-brand-dark">
                            {b.resourceName}
                          </h4>
                          {renderStatusBadge(b.status)}
                        </div>

                        <p className="text-xs font-medium text-brand-dark/80">
                          Purpose: <strong>{b.purpose}</strong> ({b.expectedParticipants} expected attendees)
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-dark/65 pt-0.5">
                          <span className="flex items-center gap-1 font-mono font-medium">
                            <Calendar className="w-3.5 h-3.5 text-brand-green" />
                            {b.date}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono font-medium">
                            <Clock className="w-3.5 h-3.5 text-brand-green" />
                            {b.startTime} – {b.endTime}
                          </span>
                        </div>

                        {b.rejectionReason && (
                          <div className="p-2.5 rounded-lg bg-red-50 text-red-800 text-xs mt-2 border border-red-200">
                            <strong>Reason:</strong> {b.rejectionReason}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {b.status === 'confirmed' && (
                          <button
                            onClick={() => setSelectedPassBooking(b)}
                            className="px-4 py-2 rounded-xl bg-brand-dark text-white hover:bg-brand-green text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5"
                          >
                            <QrCode className="w-3.5 h-3.5 text-emerald-300" />
                            <span>View Turnstile Pass</span>
                          </button>
                        )}

                        {b.status !== 'cancelled' && b.status !== 'rejected' && (
                          <button
                            onClick={() => cancelBooking(b.id)}
                            className="px-3.5 py-2 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-bold text-brand-dark">
                  My Confirmed Event Passes
                </h3>
                <button
                  onClick={() => {
                    onClose();
                    onOpenEvents();
                  }}
                  className="px-4 py-2 bg-brand-dark hover:bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Browse All Events</span>
                </button>
              </div>

              {registeredEvents.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-brand-dark/15 rounded-3xl p-8 bg-brand-cream/30">
                  <Calendar className="w-10 h-10 text-brand-dark/30 mx-auto mb-2" />
                  <p className="font-display font-bold text-base text-brand-dark">No event registrations found</p>
                  <p className="text-xs text-brand-dark/60 mt-1">Browse upcoming academic seminars and workshops to reserve a seat.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registeredEvents.map(e => (
                    <div
                      key={e.id}
                      className="p-5 rounded-2xl border border-brand-dark/15 bg-brand-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-green">
                          {e.category} • {e.department}
                        </span>
                        <h4 className="font-display font-bold text-base text-brand-dark">
                          {e.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-dark/65 pt-1">
                          <span>📅 {e.date}</span>
                          <span>•</span>
                          <span>⏰ {e.startTime} – {e.endTime}</span>
                          <span>•</span>
                          <span>📍 {e.venueName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => unregisterForEvent(e.id)}
                          className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
                        >
                          Cancel Pass
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Digital Turnstile Pass Modal Overlay */}
        {selectedPassBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-down">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setSelectedPassBooking(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors flex items-center gap-1 font-mono text-xs uppercase"
              >
                <span>Close Pass</span>
                <X className="w-4 h-4" />
              </button>
              <DigitalTurnstilePass booking={selectedPassBooking} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserDashboard;
