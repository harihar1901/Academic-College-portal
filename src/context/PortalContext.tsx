import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  CampusResource, 
  AcademicEvent, 
  BookingRequest, 
  NotificationItem, 
  ConflictCheckResult 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_RESOURCES, 
  INITIAL_EVENTS 
} from '../data/mockData';
import { bookingsApi, resourcesApi, eventsApi } from '../services/api';

interface PortalContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  switchUserRole: (role: UserRole) => void;
  loginUser: (email: string) => boolean;
  logout: () => void;
  resources: CampusResource[];
  events: AcademicEvent[];
  bookings: BookingRequest[];
  setBookings: React.Dispatch<React.SetStateAction<BookingRequest[]>>;
  notifications: NotificationItem[];
  myRegistrations: string[];
  checkConflict: (
    resourceId: string, 
    date: string, 
    startTime: string, 
    endTime: string, 
    excludeBookingId?: string
  ) => ConflictCheckResult;
  submitBooking: (bookingData: {
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    expectedParticipants: number;
    requirements: string[];
  }) => Promise<{ success: boolean; conflict?: ConflictCheckResult; booking?: BookingRequest; error?: string }>;
  approveBooking: (bookingId: string) => Promise<void>;
  rejectBooking: (bookingId: string, reason: string) => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<void>;
  resetAllBookingsToZero: () => Promise<void>;
  registerForEvent: (eventId: string) => boolean;
  unregisterForEvent: (eventId: string) => void;
  createEvent: (eventData: Omit<AcademicEvent, 'id' | 'registeredCount'>) => void;
  updateEvent: (id: string, updates: Partial<AcademicEvent>) => void;
  deleteEvent: (id: string) => void;
  createResource: (resData: Omit<CampusResource, 'id'>) => void;
  updateResource: (id: string, updates: Partial<CampusResource>) => void;
  deleteResource: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const parts = timeStr.trim().split(/[:\s]+/);
    let hour = parseInt(parts[0], 10);
    const minute = parseInt(parts[1], 10) || 0;
    const isPM = timeStr.toUpperCase().includes('PM');
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    return hour * 60 + minute;
  }
  const [h, m] = timeStr.split(':').map(n => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
}

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Current user session
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('portal_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name === 'Hariharan S.') {
        parsed.name = 'Harihar Velram';
      }
      return parsed;
    }
    return INITIAL_USERS[0];
  });

  const [resources, setResources] = useState<CampusResource[]>(() => {
    const saved = localStorage.getItem('portal_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [events, setEvents] = useState<AcademicEvent[]>(() => {
    const saved = localStorage.getItem('portal_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  // STRICTLY START FROM 0 BOOKINGS!
  const [bookings, setBookings] = useState<BookingRequest[]>([]);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('portal_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [myRegistrations, setMyRegistrations] = useState<string[]>([]);

  // Fetch from Express backend on mount
  useEffect(() => {
    const loadFromBackend = async () => {
      try {
        const [resData, evtData, bookData] = await Promise.all([
          resourcesApi.getAll().catch(() => null),
          eventsApi.getAll().catch(() => null),
          bookingsApi.getAll().catch(() => null)
        ]);

        if (resData && resData.data) setResources(resData.data);
        if (evtData && evtData.data) setEvents(evtData.data);
        if (bookData && bookData.data) setBookings(bookData.data);
      } catch (err) {
        console.warn('Backend connecting or offline. Using current client state.');
      }
    };
    loadFromBackend();
  }, []);

  // Sync session state to LocalStorage
  useEffect(() => {
    localStorage.setItem('portal_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('portal_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('portal_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('portal_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('portal_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const switchUserRole = (role: UserRole) => {
    const target = INITIAL_USERS.find(u => u.role === role) || {
      id: `user-${role}-custom`,
      name: role === 'admin' ? 'Campus Admin' : role === 'faculty' ? 'Faculty Member' : 'Student Scholar',
      email: `${role}@campus.edu`,
      role,
      department: 'University Central'
    };
    setCurrentUser(target);
  };

  const loginUser = (email: string) => {
    const found = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'student',
      department: 'Engineering & Computing'
    };
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
    // Default back to guest student view
    setCurrentUser(INITIAL_USERS[0]);
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Client-Side Conflict Checking Engine
  const checkConflict = (
    resourceId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeBookingId?: string
  ): ConflictCheckResult => {
    const reqStart = timeToMinutes(startTime);
    const reqEnd = timeToMinutes(endTime);

    if (reqStart >= reqEnd) {
      return {
        hasConflict: true,
        message: 'Invalid time selection: End time must be strictly after start time.'
      };
    }

    const targetResource = resources.find(r => r.id === resourceId);
    if (!targetResource) {
      return {
        hasConflict: true,
        message: 'The requested campus resource does not exist.'
      };
    }

    if (!targetResource.isAvailable) {
      return {
        hasConflict: true,
        message: `${targetResource.name} is currently flagged as inactive or under maintenance.`
      };
    }

    const dayBookings = bookings.filter(b => 
      b.resourceId === resourceId &&
      b.date === date &&
      (b.status === 'confirmed' || b.status === 'pending') &&
      b.id !== excludeBookingId
    );

    const conflicting = dayBookings.find(b => {
      const bStart = timeToMinutes(b.startTime);
      const bEnd = timeToMinutes(b.endTime);
      return reqStart < bEnd && reqEnd > bStart;
    });

    if (conflicting) {
      return {
        hasConflict: true,
        conflictingBooking: conflicting,
        message: `${targetResource.name} is already reserved between ${conflicting.startTime} and ${conflicting.endTime} on ${date} for "${conflicting.purpose}".`
      };
    }

    return {
      hasConflict: false,
      message: `${targetResource.name} is completely available for your chosen time window.`
    };
  };

  // Submit Booking Request (Communicates with Backend)
  const submitBooking = async (bookingData: {
    resourceId: string;
    date: string;
    startTime: string;
    endTime: string;
    purpose: string;
    expectedParticipants: number;
    requirements: string[];
  }) => {
    // 1. Client-side conflict check
    const localConflict = checkConflict(
      bookingData.resourceId,
      bookingData.date,
      bookingData.startTime,
      bookingData.endTime
    );
    if (localConflict.hasConflict) {
      return { success: false, conflict: localConflict };
    }

    try {
      // 2. Server-side persistence via Express API
      const res = await bookingsApi.create({
        ...bookingData,
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        userEmail: currentUser.email
      });

      if (res && res.booking) {
        setBookings(prev => [res.booking, ...prev]);
        addNotification({
          userId: currentUser.id,
          title: res.booking.status === 'confirmed' ? `Booking Confirmed` : 'Booking Request Submitted',
          message: `Request for ${res.booking.resourceName} on ${res.booking.date} (${res.booking.startTime} - ${res.booking.endTime}) processed.`,
          type: res.booking.status === 'confirmed' ? 'success' : 'info'
        });
        return { success: true, booking: res.booking };
      }
    } catch (err: any) {
      console.warn('Backend call fallback to local:', err.message);
    }

    // Local fallback
    const res = resources.find(r => r.id === bookingData.resourceId);
    const initialStatus = currentUser.role === 'admin' ? 'confirmed' : 'pending';
    const newBooking: BookingRequest = {
      id: `book-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      userEmail: currentUser.email,
      resourceId: bookingData.resourceId,
      resourceName: res ? res.name : 'Campus Facility',
      resourceType: res ? res.type : 'seminar_hall',
      date: bookingData.date,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      purpose: bookingData.purpose,
      expectedParticipants: bookingData.expectedParticipants,
      requirements: bookingData.requirements,
      status: initialStatus,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setBookings(prev => [newBooking, ...prev]);
    return { success: true, booking: newBooking };
  };

  const approveBooking = async (bookingId: string) => {
    try {
      await bookingsApi.approve(bookingId, currentUser.name);
    } catch (e) {
      console.warn('Backend approve fallback:', e);
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed', reviewedBy: currentUser.name } : b));
  };

  const rejectBooking = async (bookingId: string, reason: string) => {
    try {
      await bookingsApi.reject(bookingId, reason, currentUser.name);
    } catch (e) {
      console.warn('Backend reject fallback:', e);
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'rejected', rejectionReason: reason, reviewedBy: currentUser.name } : b));
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await bookingsApi.cancel(bookingId);
    } catch (e) {
      console.warn('Backend cancel fallback:', e);
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
  };

  const resetAllBookingsToZero = async () => {
    try {
      await bookingsApi.resetZero();
    } catch (e) {
      console.warn('Backend reset fallback:', e);
    }
    setBookings([]);
    setNotifications([]);
    localStorage.removeItem('portal_bookings');
    localStorage.removeItem('portal_notifications');
  };

  const registerForEvent = (eventId: string): boolean => {
    const evt = events.find(e => e.id === eventId);
    if (!evt || myRegistrations.includes(eventId)) return false;
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));
    setMyRegistrations(prev => [...prev, eventId]);
    return true;
  };

  const unregisterForEvent = (eventId: string) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) } : e));
    setMyRegistrations(prev => prev.filter(id => id !== eventId));
  };

  const createEvent = (eventData: Omit<AcademicEvent, 'id' | 'registeredCount'>) => {
    const newEvent: AcademicEvent = {
      ...eventData,
      id: `event-${Date.now()}`,
      registeredCount: 0
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  const updateEvent = (id: string, updates: Partial<AcademicEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const createResource = (resData: Omit<CampusResource, 'id'>) => {
    const newRes: CampusResource = { ...resData, id: `res-${Date.now()}` };
    setResources(prev => [...prev, newRes]);
  };

  const updateResource = (id: string, updates: Partial<CampusResource>) => {
    setResources(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <PortalContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchUserRole,
      loginUser,
      logout,
      resources,
      events,
      bookings,
      setBookings,
      notifications,
      myRegistrations,
      checkConflict,
      submitBooking,
      approveBooking,
      rejectBooking,
      cancelBooking,
      resetAllBookingsToZero,
      registerForEvent,
      unregisterForEvent,
      createEvent,
      updateEvent,
      deleteEvent,
      createResource,
      updateResource,
      deleteResource,
      markNotificationRead,
      markAllNotificationsRead
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
