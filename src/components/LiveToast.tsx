import React, { useEffect, useState } from 'react';
import { CheckCircle2, Bell, AlertCircle, X, Sparkles, QrCode } from 'lucide-react';
import { usePortal } from '../context/PortalContext';
import { BookingRequest } from '../types';

interface ToastData {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  booking?: BookingRequest;
  actionText?: string;
  onAction?: () => void;
}

export const LiveToast: React.FC<{
  onOpenDashboard?: () => void;
  onOpenAdmin?: () => void;
}> = ({ onOpenDashboard, onOpenAdmin }) => {
  const { currentUser, setBookings } = usePortal();
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource('http://localhost:5000/api/stream');

      eventSource.addEventListener('BOOKING_APPROVED', (e: any) => {
        try {
          const booking: BookingRequest = JSON.parse(e.data);
          
          // Update live bookings state so dashboard reflects approval instantaneously
          setBookings((prev: BookingRequest[]) => prev.map((b: BookingRequest) => b.id === booking.id ? booking : b));

          // Toast for the applicant
          const isMyBooking = booking.userId === currentUser.id || booking.userEmail === currentUser.email;
          if (isMyBooking) {
            addToast({
              id: `toast-${Date.now()}`,
              title: 'Turnstile Access Pass Minted!',
              message: `Your booking for ${booking.resourceName} has been APPROVED by the Administration.`,
              type: 'success',
              booking,
              actionText: 'View Digital Pass',
              onAction: () => onOpenDashboard?.()
            });
          }
        } catch (err) {
          console.warn('SSE Parse error', err);
        }
      });

      eventSource.addEventListener('NEW_BOOKING', (e: any) => {
        try {
          const booking: BookingRequest = JSON.parse(e.data);
          setBookings((prev: BookingRequest[]) => {
            if (prev.some((b: BookingRequest) => b.id === booking.id)) return prev;
            return [booking, ...prev];
          });

          // If current user is admin, alert them in real-time
          if (currentUser.role === 'admin') {
            addToast({
              id: `toast-${Date.now()}`,
              title: 'New Booking Petition Received',
              message: `${booking.userName} (${booking.userRole}) requested ${booking.resourceName} for "${booking.purpose}".`,
              type: 'info',
              booking,
              actionText: 'Review in Admin Hub',
              onAction: () => onOpenAdmin?.()
            });
          }
        } catch (err) {
          console.warn('SSE Parse error', err);
        }
      });

      eventSource.addEventListener('BOOKING_REJECTED', (e: any) => {
        try {
          const booking: BookingRequest = JSON.parse(e.data);
          setBookings((prev: BookingRequest[]) => prev.map((b: BookingRequest) => b.id === booking.id ? booking : b));

          if (booking.userId === currentUser.id) {
            addToast({
              id: `toast-${Date.now()}`,
              title: 'Booking Request Update',
              message: `Your request for ${booking.resourceName} was not approved: ${booking.rejectionReason || 'Institutional scheduling priority.'}`,
              type: 'warning',
              booking,
              actionText: 'View Dashboard',
              onAction: () => onOpenDashboard?.()
            });
          }
        } catch (err) {
          console.warn('SSE Parse error', err);
        }
      });

      eventSource.addEventListener('RESET_ZERO', () => {
        setBookings([]);
      });

    } catch (err) {
      console.warn('EventSource connection failed, backend might be offline.');
    }

    return () => {
      eventSource?.close();
    };
  }, [currentUser]);

  const addToast = (t: ToastData) => {
    setToasts(prev => [t, ...prev.slice(0, 3)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(item => item.id !== t.id));
    }, 7000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-fade-down ${
            toast.type === 'success'
              ? 'bg-[#131d15]/95 border-emerald-500/40 text-white'
              : toast.type === 'info'
              ? 'bg-[#182028]/95 border-blue-500/40 text-white'
              : 'bg-[#251818]/95 border-red-500/40 text-white'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-white/10 shrink-0 mt-0.5">
                {toast.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : toast.type === 'info' ? (
                  <Bell className="w-4 h-4 text-blue-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div>
                <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                  {toast.title}
                </h4>
                <p className="text-xs text-white/80 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>

                {toast.actionText && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-mono font-bold text-emerald-300 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{toast.actionText}</span>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-white/50 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveToast;
