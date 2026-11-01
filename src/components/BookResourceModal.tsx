import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { usePortal, timeToMinutes } from '../context/PortalContext';
import { CampusResource, ConflictCheckResult } from '../types';

interface BookResourceModalProps {
  initialResource?: CampusResource | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookResourceModal: React.FC<BookResourceModalProps> = ({
  initialResource,
  onClose,
  onSuccess
}) => {
  const { resources, bookings, checkConflict, submitBooking, currentUser } = usePortal();

  const [selectedResourceId, setSelectedResourceId] = useState<string>(
    initialResource?.id || (resources[0]?.id || '')
  );
  const [date, setDate] = useState<string>('2026-09-28'); // Pre-set to demonstrate the seed conflict
  const [startTime, setStartTime] = useState<string>('14:00');
  const [endTime, setEndTime] = useState<string>('16:00');
  const [purpose, setPurpose] = useState<string>('');
  const [expectedParticipants, setExpectedParticipants] = useState<number>(80);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(['Projector']);

  const [conflictResult, setConflictResult] = useState<ConflictCheckResult | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const currentResource = resources.find(r => r.id === selectedResourceId);

  // Run conflict check whenever resource, date, or times change
  useEffect(() => {
    if (selectedResourceId && date && startTime && endTime) {
      const res = checkConflict(selectedResourceId, date, startTime, endTime);
      setConflictResult(res);
    }
  }, [selectedResourceId, date, startTime, endTime, bookings]);

  // Standard time slots for daily timeline visualization
  const timelineSlots = [
    { start: '09:00', end: '11:00', label: '09:00 – 11:00' },
    { start: '11:00', end: '13:00', label: '11:00 – 13:00' },
    { start: '13:00', end: '14:00', label: '13:00 – 14:00' },
    { start: '14:00', end: '16:00', label: '14:00 – 16:00' },
    { start: '16:00', end: '18:00', label: '16:00 – 18:00' },
    { start: '18:00', end: '20:00', label: '18:00 – 20:00' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!purpose.trim()) {
      setErrorMessage('Please describe the purpose of this reservation.');
      return;
    }

    if (expectedParticipants <= 0) {
      setErrorMessage('Please specify expected attendee count.');
      return;
    }

    if (currentResource && expectedParticipants > currentResource.capacity) {
      setErrorMessage(`Expected participants (${expectedParticipants}) exceed room capacity (${currentResource.capacity}).`);
      return;
    }

    const result = await submitBooking({
      resourceId: selectedResourceId,
      date,
      startTime,
      endTime,
      purpose,
      expectedParticipants,
      requirements: selectedFacilities
    });

    if (result.success) {
      setSubmissionSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } else if (result.conflict) {
      setConflictResult(result.conflict);
    } else if (result.error) {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm overflow-y-auto animate-fade-down">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-brand-dark/10 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-brand-cream border-b border-brand-dark/10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-green" />
              <span className="text-xs uppercase tracking-widest font-bold text-brand-green">
                Campus Resource Booking
              </span>
            </div>
            <h2 className="font-playfair text-2xl font-bold text-brand-dark mt-1">
              Reserve a Campus Facility
            </h2>
            <p className="text-xs text-brand-dark/65 mt-0.5">
              Live verification detects conflicts and enforces institutional scheduling policy.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-dark/10 text-brand-dark/60 hover:text-brand-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submissionSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-playfair text-2xl font-bold text-brand-dark">
              {currentUser.role === 'admin' ? 'Booking Confirmed!' : 'Request Submitted for Review'}
            </h3>
            <p className="text-xs sm:text-sm text-brand-dark/70 max-w-md mx-auto">
              {currentUser.role === 'admin'
                ? `Your booking for ${currentResource?.name} on ${date} (${startTime} - ${endTime}) is officially confirmed.`
                : `Your booking request for ${currentResource?.name} has been routed to Campus Administration for approval. You will be notified shortly.`}
            </p>
            <div className="pt-2 text-xs font-semibold text-brand-green">
              Redirecting to your dashboard...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Step 1: Select Resource */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-2">
                Step 1: Select Campus Resource
              </label>
              <select
                value={selectedResourceId}
                onChange={(e) => setSelectedResourceId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-dark/20 bg-brand-cream/40 text-xs font-semibold text-brand-dark focus:outline-none focus:border-brand-green"
              >
                {resources.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({r.capacity} seats) — {r.type.replace('_', ' ')}
                  </option>
                ))}
              </select>

              {currentResource && (
                <div className="mt-2 p-3 bg-brand-cream/60 rounded-xl border border-brand-dark/5 flex flex-wrap items-center justify-between text-xs text-brand-dark/75 gap-2">
                  <span>📍 {currentResource.location}</span>
                  <span>👥 Capacity: <strong>{currentResource.capacity}</strong></span>
                  <span>⚡ Facilities: {currentResource.facilities.slice(0, 3).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Step 2: Date & Time Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-brand-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                  Start Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-brand-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-medium"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-brand-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-medium"
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Daily Schedule Conflict Visualization Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/60">
                  {date} Schedule Timeline for {currentResource?.name}
                </span>
                <span className="text-[10px] text-brand-dark/50">
                  🔴 Booked / 🟢 Available
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {timelineSlots.map(slot => {
                  const sM = timeToMinutes(slot.start);
                  const eM = timeToMinutes(slot.end);
                  const isSlotBooked = bookings.some(b => 
                    b.resourceId === selectedResourceId &&
                    b.date === date &&
                    (b.status === 'confirmed' || b.status === 'pending') &&
                    sM < timeToMinutes(b.endTime) && eM > timeToMinutes(b.startTime)
                  );
                  const isCurrentSelection = 
                    sM >= timeToMinutes(startTime) && eM <= timeToMinutes(endTime);

                  return (
                    <button
                      type="button"
                      key={slot.label}
                      onClick={() => {
                        setStartTime(slot.start);
                        setEndTime(slot.end);
                      }}
                      className={`p-2 rounded-lg text-center text-[10px] font-semibold transition-all border ${
                        isSlotBooked
                          ? 'bg-red-50 text-red-700 border-red-200 cursor-not-allowed'
                          : isCurrentSelection
                          ? 'bg-brand-dark text-white border-brand-dark shadow-xs'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <div>{slot.start}</div>
                      <div className="text-[9px] opacity-80">{isSlotBooked ? 'Booked' : 'Available'}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Real-time Conflict Engine Status Banner */}
            {conflictResult && (
              <div className="animate-fade-up">
                {conflictResult.hasConflict ? (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
                    <div className="flex items-start gap-3 text-red-800">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                      <div>
                        <h4 className="font-bold text-xs uppercase tracking-wider">
                          Booking Conflict Detected
                        </h4>
                        <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                          {conflictResult.message}
                        </p>
                      </div>
                    </div>

                    {/* Smart Alternatives Recommended */}
                    {(conflictResult.alternativeSlots?.length || conflictResult.alternativeResources?.length) ? (
                      <div className="pt-3 border-t border-red-200/70 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-brand-dark">
                          💡 Recommended Alternatives:
                        </div>

                        {/* Alternative Slots for same room */}
                        {conflictResult.alternativeSlots && conflictResult.alternativeSlots.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-brand-dark/70 font-medium">Same venue later:</span>
                            {conflictResult.alternativeSlots.slice(0, 2).map((alt) => (
                              <button
                                type="button"
                                key={alt.label}
                                onClick={() => {
                                  setStartTime(alt.startTime);
                                  setEndTime(alt.endTime);
                                }}
                                className="px-2.5 py-1 rounded-md bg-white border border-brand-dark/20 text-brand-dark text-[11px] font-semibold hover:bg-brand-dark hover:text-white transition-colors"
                              >
                                {alt.label} →
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Alternative Resources */}
                        {conflictResult.alternativeResources && conflictResult.alternativeResources.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <span className="text-[11px] text-brand-dark/70 font-medium">Alternative available room:</span>
                            {conflictResult.alternativeResources.map((alt) => (
                              <button
                                type="button"
                                key={alt.resource.id}
                                onClick={() => {
                                  setSelectedResourceId(alt.resource.id);
                                }}
                                className="px-2.5 py-1 rounded-md bg-white border border-brand-dark/20 text-brand-green text-[11px] font-bold hover:bg-brand-green hover:text-white transition-colors"
                              >
                                {alt.resource.name} ({alt.resource.capacity} seats) →
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span>{conflictResult.message}</span>
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-bold">
                      Zero Conflicts
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Purpose & Expected Attendees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                  Purpose / Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. AI Workshop for 100 students"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-1.5">
                  Expected Attendees
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 text-brand-dark/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max={currentResource?.capacity || 1000}
                    value={expectedParticipants}
                    onChange={(e) => setExpectedParticipants(parseInt(e.target.value, 10) || 0)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-brand-green font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Equipment selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brand-dark/70 mb-2">
                Required Equipment &amp; Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {['Projector', 'Smart Board', 'Microphone', 'AC', 'High-Speed Wi-Fi', 'Podium'].map(item => {
                  const selected = selectedFacilities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => {
                        if (selected) {
                          setSelectedFacilities(selectedFacilities.filter(f => f !== item));
                        } else {
                          setSelectedFacilities([...selectedFacilities, item]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-white text-brand-dark/70 border-brand-dark/15 hover:border-brand-dark'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-600 font-semibold">{errorMessage}</p>
            )}

            {/* Submit Action */}
            <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
              <div className="text-xs text-brand-dark/60">
                Logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-brand-dark/20 text-xs font-semibold text-brand-dark hover:bg-brand-light"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={conflictResult?.hasConflict}
                  className={`px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm ${
                    conflictResult?.hasConflict
                      ? 'bg-brand-dark/30 text-white/60 cursor-not-allowed'
                      : 'bg-brand-dark hover:bg-brand-green text-white transform hover:-translate-y-0.5'
                  }`}
                >
                  <span>{currentUser.role === 'admin' ? 'Confirm Booking' : 'Submit Booking Request'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
