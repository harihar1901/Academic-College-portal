import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Calendar, 
  Users, 
  BarChart3, 
  Plus, 
  Trash2, 
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { CampusResource, AcademicEvent } from '../types';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { 
    bookings, 
    resources, 
    events, 
    approveBooking, 
    rejectBooking, 
    updateResource, 
    createResource,
    deleteResource,
    createEvent,
    deleteEvent
  } = usePortal();

  const [activeTab, setActiveTab] = useState<'approvals' | 'resources' | 'events' | 'reports'>('approvals');
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Resource reserved for prioritized institutional examination.');

  // New Resource Form state
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResName, setNewResName] = useState('');
  const [newResType, setNewResType] = useState<CampusResource['type']>('seminar_hall');
  const [newResCapacity, setNewResCapacity] = useState(120);
  const [newResLocation, setNewResLocation] = useState('New Innovation Block, Floor 2');

  // New Event Form state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState<AcademicEvent['category']>('Workshop');
  const [newEventDept, setNewEventDept] = useState('Computer Science & AI');
  const [newEventDate, setNewEventDate] = useState('2026-10-20');
  const [newEventVenue, setNewEventVenue] = useState(resources[0]?.id || '');
  const [newEventCapacity, setNewEventCapacity] = useState(100);

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');

  const handleConfirmRejection = () => {
    if (rejectingBookingId) {
      rejectBooking(rejectingBookingId, rejectionReason);
      setRejectingBookingId(null);
    }
  };

  const handleCreateResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName.trim()) return;

    createResource({
      name: newResName,
      type: newResType,
      capacity: newResCapacity,
      location: newResLocation,
      facilities: ['Projector', 'Wi-Fi 6', 'Air Conditioning'],
      isAvailable: true,
      imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
      description: 'Campus facility registered for departmental events and seminar sessions.'
    });

    setNewResName('');
    setShowAddResource(false);
  };

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const chosenVenue = resources.find(r => r.id === newEventVenue) || resources[0];

    createEvent({
      title: newEventTitle,
      description: 'Faculty-approved academic seminar exploring specialized research disciplines.',
      category: newEventCategory,
      department: newEventDept,
      date: newEventDate,
      startTime: '10:00 AM',
      endTime: '01:00 PM',
      venueId: chosenVenue.id,
      venueName: chosenVenue.name,
      organizer: 'Campus Administration',
      speaker: 'Guest Academic Chair',
      capacity: newEventCapacity,
      registrationDeadline: newEventDate,
      bannerUrl: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&auto=format&fit=crop&q=80'
    });

    setNewEventTitle('');
    setShowAddEvent(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/80 backdrop-blur-md overflow-y-auto animate-fade-down">
      <div className="relative w-full max-w-5xl bg-brand-cream rounded-3xl shadow-2xl border border-brand-dark/20 overflow-hidden my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 sm:p-8 bg-brand-dark text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
                  Administrative Command Suite
                </span>
              </div>
              <h2 className="font-playfair text-2xl font-bold">
                Campus Operations &amp; Resource Approval
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Statistics Bar matching section 14 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-brand-light/60 border-b border-brand-dark/10">
          <div className="p-4 bg-white rounded-2xl border border-brand-dark/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Events Scheduled</div>
            <div className="font-playfair text-3xl font-bold text-brand-dark mt-1">{events.length}</div>
            <div className="text-[10px] text-brand-green font-semibold mt-0.5">Active on public calendar</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-brand-dark/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Campus Resources</div>
            <div className="font-playfair text-3xl font-bold text-brand-dark mt-1">{resources.length}</div>
            <div className="text-[10px] text-brand-dark/60 font-semibold mt-0.5">Halls, labs &amp; AV units</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-brand-dark/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Pending Approvals</div>
            <div className="font-playfair text-3xl font-bold text-amber-700 mt-1">{pendingBookings.length}</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Requires review</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-brand-dark/10">
            <div className="text-[10px] uppercase font-bold tracking-wider text-brand-dark/50">Conflict Prevention</div>
            <div className="font-playfair text-3xl font-bold text-emerald-700 mt-1">100%</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Zero double-bookings</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8 pt-3 bg-white flex items-center gap-8 border-b border-brand-dark/10 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`pb-3 border-b-2 flex items-center gap-2 ${
              activeTab === 'approvals' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
            }`}
          >
            <span>Approval Queue</span>
            {pendingBookings.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                {pendingBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-3 border-b-2 ${
              activeTab === 'resources' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
            }`}
          >
            Resource Management ({resources.length})
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 border-b-2 ${
              activeTab === 'events' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
            }`}
          >
            Event Management ({events.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`pb-3 border-b-2 ${
              activeTab === 'reports' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-dark/50 hover:text-brand-dark'
            }`}
          >
            Utilization Reports
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto bg-white">
          
          {/* TAB 1: APPROVAL QUEUE */}
          {activeTab === 'approvals' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-playfair text-xl font-bold text-brand-dark">
                  Pending Resource Booking Requests
                </h3>
                <p className="text-xs text-brand-dark/65 mt-0.5">
                  Review student and faculty booking petitions. Approved slots immediately lock the schedule.
                </p>
              </div>

              {pendingBookings.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-brand-dark/20 rounded-2xl p-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="font-playfair font-bold text-brand-dark">No Pending Requests</p>
                  <p className="text-xs text-brand-dark/60 mt-1">All campus resource requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingBookings.map(b => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                            {b.userRole} Request
                          </span>
                          <span className="text-brand-dark/30">•</span>
                          <span className="text-xs font-semibold text-brand-dark">{b.userName} ({b.userEmail})</span>
                        </div>

                        <h4 className="font-playfair font-bold text-lg text-brand-dark">
                          {b.resourceName}
                        </h4>

                        <p className="text-xs text-brand-dark/80">
                          Purpose: <strong>"{b.purpose}"</strong> ({b.expectedParticipants} expected attendees)
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-dark/70 pt-1 font-medium">
                          <span>📅 {b.date}</span>
                          <span>•</span>
                          <span>⏰ {b.startTime} – {b.endTime}</span>
                          {b.requirements.length > 0 && (
                            <>
                              <span>•</span>
                              <span>⚡ Gear: {b.requirements.join(', ')}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Approve / Reject Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => approveBooking(b.id)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve</span>
                        </button>

                        <button
                          onClick={() => setRejectingBookingId(b.id)}
                          className="px-4 py-2 bg-white border border-red-200 text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Previously Confirmed Bookings History */}
              <div className="pt-6 border-t border-brand-dark/10">
                <h4 className="font-playfair text-base font-bold text-brand-dark mb-3">
                  Recently Approved Schedule ({confirmedBookings.length})
                </h4>
                <div className="space-y-2">
                  {confirmedBookings.slice(0, 4).map(b => (
                    <div key={b.id} className="p-3 bg-brand-cream/40 rounded-xl text-xs flex items-center justify-between">
                      <div>
                        <strong>{b.resourceName}</strong> — {b.purpose} by {b.userName}
                      </div>
                      <div className="text-brand-dark/60 font-medium">
                        {b.date} ({b.startTime} - {b.endTime})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RESOURCE MANAGEMENT */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-brand-dark">
                    Campus Facilities Catalog
                  </h3>
                  <p className="text-xs text-brand-dark/65 mt-0.5">
                    Modify seating capacity, equipment amenities, or toggle maintenance downtime.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddResource(!showAddResource)}
                  className="px-4 py-2 bg-brand-dark hover:bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Facility</span>
                </button>
              </div>

              {showAddResource && (
                <form onSubmit={handleCreateResourceSubmit} className="p-5 rounded-2xl bg-brand-cream border border-brand-dark/10 space-y-4">
                  <h4 className="font-playfair font-bold text-base text-brand-dark">
                    Register New Campus Resource
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Resource Name (e.g. Newton Seminar Hall)"
                      value={newResName}
                      onChange={(e) => setNewResName(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-brand-dark/20 text-xs bg-white"
                      required
                    />
                    <select
                      value={newResType}
                      onChange={(e) => setNewResType(e.target.value as any)}
                      className="px-3 py-2 rounded-xl border border-brand-dark/20 text-xs bg-white"
                    >
                      <option value="seminar_hall">Seminar Hall</option>
                      <option value="auditorium">Auditorium</option>
                      <option value="computer_lab">Computer Lab</option>
                      <option value="conference_room">Conference Room</option>
                      <option value="equipment">Specialized Equipment</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Capacity"
                      value={newResCapacity}
                      onChange={(e) => setNewResCapacity(parseInt(e.target.value, 10) || 0)}
                      className="px-3 py-2 rounded-xl border border-brand-dark/20 text-xs bg-white"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddResource(false)}
                      className="px-3 py-1.5 text-xs text-brand-dark"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-brand-dark text-white rounded-xl text-xs font-bold uppercase"
                    >
                      Save Resource
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {resources.map(res => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl border border-brand-dark/10 bg-brand-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-playfair font-bold text-base text-brand-dark">
                          {res.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-dark/10 text-brand-dark">
                          {res.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-brand-dark/70 mt-1">
                        📍 {res.location} • 👥 <strong>{res.capacity} Seats</strong>
                      </p>
                      <p className="text-[11px] text-brand-dark/60 mt-0.5">
                        Amenities: {res.facilities.join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateResource(res.id, { isAvailable: !res.isAvailable })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                          res.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {res.isAvailable ? '✓ Operational' : '⚠ Maintenance'}
                      </button>

                      <button
                        onClick={() => deleteResource(res.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EVENT MANAGEMENT */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-brand-dark">
                    Academic Events &amp; Symposia Publisher
                  </h3>
                  <p className="text-xs text-brand-dark/65 mt-0.5">
                    Create new university events, inspect RSVPs, or cancel scheduled events.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddEvent(!showAddEvent)}
                  className="px-4 py-2 bg-brand-dark hover:bg-brand-green text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </button>
              </div>

              {showAddEvent && (
                <form onSubmit={handleCreateEventSubmit} className="p-5 rounded-2xl bg-brand-cream border border-brand-dark/10 space-y-3">
                  <h4 className="font-playfair font-bold text-base text-brand-dark">
                    Publish New Academic Event
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-brand-dark/20 text-xs bg-white"
                      required
                    />
                    <select
                      value={newEventCategory}
                      onChange={(e) => setNewEventCategory(e.target.value as any)}
                      className="px-3 py-2 rounded-xl border border-brand-dark/20 text-xs bg-white"
                    >
                      <option value="Workshop">Workshop</option>
                      <option value="Symposium">Symposium</option>
                      <option value="Seminar">Seminar</option>
                      <option value="Conference">Conference</option>
                      <option value="Hackathon">Hackathon</option>
                    </select>
                    <input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-brand-dark/20 text-xs bg-white"
                      required
                    />
                    <select
                      value={newEventVenue}
                      onChange={(e) => setNewEventVenue(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-brand-dark/20 text-xs bg-white"
                    >
                      {resources.map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({r.capacity} cap)</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddEvent(false)}
                      className="px-3 py-1.5 text-xs text-brand-dark"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-brand-dark text-white rounded-xl text-xs font-bold uppercase"
                    >
                      Publish Event
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {events.map(e => (
                  <div
                    key={e.id}
                    className="p-4 rounded-2xl border border-brand-dark/10 bg-brand-cream/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
                        {e.category} • {e.department}
                      </span>
                      <h4 className="font-playfair font-bold text-base text-brand-dark">
                        {e.title}
                      </h4>
                      <p className="text-xs text-brand-dark/70 mt-1">
                        📅 {e.date} ({e.startTime} - {e.endTime}) • 📍 {e.venueName}
                      </p>
                      <p className="text-[11px] text-brand-dark/60 mt-0.5">
                        Registrations: <strong>{e.registeredCount} / {e.capacity}</strong> attendees ({e.capacity - e.registeredCount} seats remaining)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteEvent(e.id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS & UTILIZATION */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-playfair text-xl font-bold text-brand-dark">
                  Campus Facilities Analytics &amp; Reports
                </h3>
                <p className="text-xs text-brand-dark/65 mt-0.5">
                  Audited scheduling utilization, peak request intervals, and departmental metrics.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl border border-brand-dark/10 bg-brand-cream/40 space-y-4">
                  <h4 className="font-playfair font-bold text-base text-brand-dark flex items-center justify-between">
                    <span>Most Booked Resources</span>
                    <TrendingUp className="w-4 h-4 text-brand-green" />
                  </h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Seminar Hall A</span>
                        <span>88% Utilization</span>
                      </div>
                      <div className="w-full bg-brand-sand h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-dark h-full rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Grand Campus Auditorium</span>
                        <span>74% Utilization</span>
                      </div>
                      <div className="w-full bg-brand-sand h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-green h-full rounded-full" style={{ width: '74%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Alan Turing Computing Lab</span>
                        <span>62% Utilization</span>
                      </div>
                      <div className="w-full bg-brand-sand h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '62%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>Seminar Hall B</span>
                        <span>45% Utilization</span>
                      </div>
                      <div className="w-full bg-brand-sand h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full rounded-full" style={{ width: '45%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-brand-dark/10 bg-brand-cream/40 space-y-4">
                  <h4 className="font-playfair font-bold text-base text-brand-dark flex items-center justify-between">
                    <span>Active Departments</span>
                    <Users className="w-4 h-4 text-brand-green" />
                  </h4>

                  <div className="space-y-2.5 text-xs text-brand-dark/80">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-brand-dark/5">
                      <span>Computer Science &amp; AI</span>
                      <strong className="text-brand-dark">14 Bookings / 4 Events</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-brand-dark/5">
                      <span>Department of Physics &amp; Quantum Sciences</span>
                      <strong className="text-brand-dark">8 Bookings / 2 Events</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-brand-dark/5">
                      <span>Biomedical Engineering Council</span>
                      <strong className="text-brand-dark">5 Bookings / 2 Events</strong>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-brand-dark/5">
                      <span>Clean Energy &amp; Electrical Sciences</span>
                      <strong className="text-brand-dark">4 Bookings / 1 Event</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rejection Modal Note */}
        {rejectingBookingId && (
          <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-red-200 space-y-4">
              <h4 className="font-playfair font-bold text-lg text-brand-dark">
                Reject Booking Request
              </h4>
              <p className="text-xs text-brand-dark/70">
                Specify the reason for rejecting this booking so the applicant can select an alternative hall or time.
              </p>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-dark/20 text-xs text-brand-dark focus:outline-none focus:border-red-500"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectingBookingId(null)}
                  className="px-4 py-2 text-xs font-semibold text-brand-dark hover:bg-brand-light rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRejection}
                  className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
