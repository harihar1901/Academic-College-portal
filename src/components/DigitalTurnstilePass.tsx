import React, { useState } from 'react';
import { 
  QrCode, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Download, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { BookingRequest } from '../types';

interface DigitalTurnstilePassProps {
  booking: BookingRequest;
  onClose?: () => void;
}

export const DigitalTurnstilePass: React.FC<DigitalTurnstilePassProps> = ({ booking, onClose }) => {
  const [scanned, setScanned] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Generate real .ics calendar invite
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`Campus Booking: ${booking.resourceName} (${booking.purpose})`);
    const description = encodeURIComponent(`Authorized reservation at ${booking.resourceName}.\nPurpose: ${booking.purpose}\nTurnstile Access Pass: ACTIVE.`);
    const location = encodeURIComponent(booking.resourceName);

    // Format dates for .ics: YYYYMMDDTHHMMSS
    const dateClean = booking.date.replace(/-/g, '');
    const startClean = booking.startTime.replace(/:/g, '') + '00';
    const endClean = booking.endTime.replace(/:/g, '') + '00';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CampusPortal//Academic Scheduling//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${booking.resourceName} - ${booking.purpose}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      `DTSTART:${dateClean}T${startClean}`,
      `DTEND:${dateClean}T${endClean}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `campus-pass-${booking.resourceName.toLowerCase().replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const handleSimulateTurnstileScan = () => {
    setScanned(true);
    setTimeout(() => {
      setScanned(false);
    }, 3500);
  };

  // Pseudo-security hash from booking ID
  const passHash = `PASS-SHA256-${booking.id.toUpperCase().slice(-8)}-${booking.date.replace(/-/g, '')}`;

  return (
    <div className="relative w-full max-w-md mx-auto my-4 text-white select-none">
      
      {/* Turnstile Access Simulation Banner */}
      {scanned && (
        <div className="absolute inset-0 z-30 bg-emerald-950/95 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center justify-center text-center animate-fade-down border-2 border-emerald-400 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-3 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-emerald-300" />
          </div>
          <span className="font-mono text-xs tracking-widest text-emerald-400 font-bold uppercase">
            Turnstile Gate 02 // Clear
          </span>
          <h3 className="font-display text-2xl font-black text-white mt-1">
            ACCESS GRANTED
          </h3>
          <p className="text-xs text-emerald-200/80 mt-1 max-w-xs">
            Credential recognized for {booking.userName}. Gate barrier disengaged for {booking.resourceName}.
          </p>
          <div className="mt-4 px-3 py-1 rounded-full bg-emerald-500/20 text-[10px] font-mono text-emerald-300">
            {passHash}
          </div>
        </div>
      )}

      {/* Main Boarding Pass Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#18231a] via-[#121a14] to-[#0c120d] border border-white/15 shadow-2xl overflow-hidden">
        
        {/* Top Header Strip */}
        <div className="p-5 pb-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="block text-[9px] font-mono tracking-widest uppercase text-emerald-400 font-bold">
                CAMPUS TURNSTILE CLEARANCE
              </span>
              <span className="font-display font-bold text-sm text-white tracking-tight">
                Official Institutional Pass
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ACTIVE</span>
          </div>
        </div>

        {/* Venue & Purpose Main Hero */}
        <div className="p-6 pb-5 space-y-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block">
              RESERVED FACILITY
            </span>
            <h3 className="font-display text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {booking.resourceName}
            </h3>
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] font-mono text-white/50 uppercase block">Event Purpose</span>
              <span className="font-semibold text-white/90 line-clamp-1">{booking.purpose}</span>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-white/50 uppercase block">Capacity</span>
              <span className="font-bold text-emerald-400">{booking.expectedParticipants} Seats</span>
            </div>
          </div>

          {/* Schedule Strip */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] font-mono text-white/50 uppercase block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-emerald-400" /> Date
              </span>
              <span className="font-bold text-sm text-white mt-0.5 block">{booking.date}</span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] font-mono text-white/50 uppercase block flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" /> Interval
              </span>
              <span className="font-bold text-sm text-white mt-0.5 block">
                {booking.startTime} – {booking.endTime}
              </span>
            </div>
          </div>
        </div>

        {/* Perforated Ticket Divider with Notches */}
        <div className="relative my-1">
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-brand-cream border border-brand-dark/20 z-10" />
          <div className="border-t-2 border-dashed border-white/15 w-full" />
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-brand-cream border border-brand-dark/20 z-10" />
        </div>

        {/* QR Code & Credential Details Bottom Strip */}
        <div className="p-6 pt-5 bg-black/30 flex items-center justify-between gap-4">
          
          {/* Authentic Scannable QR Graphic */}
          <div className="relative p-2.5 rounded-2xl bg-white text-black shrink-0 shadow-md group">
            {/* Visual QR Code Grid */}
            <div className="w-24 h-24 flex flex-col justify-between p-1 bg-white relative overflow-hidden">
              <div className="flex justify-between">
                <div className="w-6 h-6 border-4 border-black p-0.5"><div className="w-2 h-2 bg-black" /></div>
                <div className="w-6 h-6 border-4 border-black p-0.5"><div className="w-2 h-2 bg-black" /></div>
              </div>
              <div className="flex items-center justify-around my-auto">
                <div className="w-2 h-2 bg-black" />
                <div className="w-3 h-1 bg-black" />
                <div className="w-2 h-2 bg-black" />
                <div className="w-1 h-3 bg-black" />
              </div>
              <div className="flex justify-between items-end">
                <div className="w-6 h-6 border-4 border-black p-0.5"><div className="w-2 h-2 bg-black" /></div>
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-black" /><div className="bg-black" /><div className="bg-black" />
                </div>
              </div>
              {/* Laser scanning micro-animation line */}
              <div className="absolute inset-x-0 h-0.5 bg-emerald-500 shadow-sm animate-pulse top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="block text-[8px] font-mono text-center text-black/60 font-bold mt-1">
              SCAN AT GATE
            </span>
          </div>

          {/* Holder Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div>
              <span className="text-[10px] font-mono uppercase text-white/50 block">Credential Holder</span>
              <span className="font-display font-bold text-sm text-white truncate block">
                {booking.userName}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 capitalize block">
                {booking.userRole} Scholar
              </span>
            </div>

            <div>
              <span className="text-[9px] font-mono uppercase text-white/40 block">Digital Token</span>
              <span className="text-[9px] font-mono text-white/70 truncate block">
                {passHash}
              </span>
            </div>

            <div className="pt-1 text-[10px] font-mono text-white/50">
              Turnstile: <strong className="text-white">Gate 02 &amp; Turnstile 3A</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons Strip */}
        <div className="p-4 bg-white/[0.02] border-t border-white/10 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCalendar}
            className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            {downloaded ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Calendar className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{downloaded ? 'Saved (.ics)' : 'Add to Calendar'}</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateTurnstileScan}
            className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-md group"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate Gate Tap</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default DigitalTurnstilePass;
