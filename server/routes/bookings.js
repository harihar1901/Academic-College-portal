import express from 'express';
import { db } from '../db/database.js';
import { sseBus } from '../server.js';

const router = express.Router();

function timeToMinutes(timeStr) {
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

// Check conflict helper
function verifyConflict(resourceId, date, startTime, endTime, excludeBookingId = null) {
  const reqStart = timeToMinutes(startTime);
  const reqEnd = timeToMinutes(endTime);

  if (reqStart >= reqEnd) {
    return {
      hasConflict: true,
      message: 'Invalid time selection: End time must be strictly after start time.'
    };
  }

  const resources = db.getResources();
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

  const bookings = db.getBookings();
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
}

// GET all bookings (Strictly starts with 0 bookings)
router.get('/', (req, res) => {
  const bookings = db.getBookings();
  res.json({ success: true, count: bookings.length, data: bookings });
});

// POST check conflict endpoint
router.post('/check-conflict', (req, res) => {
  const { resourceId, date, startTime, endTime, excludeBookingId } = req.body;
  if (!resourceId || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  const result = verifyConflict(resourceId, date, startTime, endTime, excludeBookingId);
  res.json({ success: true, ...result });
});

// POST create booking
router.post('/', (req, res) => {
  const { 
    resourceId, 
    date, 
    startTime, 
    endTime, 
    purpose, 
    expectedParticipants, 
    requirements,
    userId,
    userName,
    userRole,
    userEmail
  } = req.body;

  if (!resourceId || !date || !startTime || !endTime || !purpose) {
    return res.status(400).json({ error: 'Please provide all required booking parameters.' });
  }

  // 1. Conflict verification on server
  const conflict = verifyConflict(resourceId, date, startTime, endTime);
  if (conflict.hasConflict) {
    return res.status(409).json({ success: false, conflict, error: conflict.message });
  }

  const resources = db.getResources();
  const resource = resources.find(r => r.id === resourceId);

  // Admin bookings auto-confirm; Student/Faculty bookings go to pending
  const initialStatus = userRole === 'admin' ? 'confirmed' : 'pending';

  const newBooking = {
    id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId: userId || 'anonymous',
    userName: userName || 'Campus Member',
    userRole: userRole || 'student',
    userEmail: userEmail || 'user@campus.edu',
    resourceId: resource ? resource.id : resourceId,
    resourceName: resource ? resource.name : 'Campus Facility',
    resourceType: resource ? resource.type : 'hall',
    date,
    startTime,
    endTime,
    purpose,
    expectedParticipants: Number(expectedParticipants) || 10,
    requirements: Array.isArray(requirements) ? requirements : [],
    status: initialStatus,
    submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  const bookings = db.getBookings();
  bookings.unshift(newBooking);
  db.saveBookings(bookings);

  // Notify admin or user
  const notifs = db.getNotifications();
  notifs.unshift({
    id: `notif-${Date.now()}`,
    userId: userId || 'user',
    title: initialStatus === 'confirmed' ? `Booking Confirmed: ${newBooking.resourceName}` : 'Booking Request Submitted',
    message: initialStatus === 'confirmed'
      ? `Your booking for ${newBooking.resourceName} on ${date} (${startTime} - ${endTime}) is confirmed.`
      : `Your request for ${newBooking.resourceName} has been routed for administrative approval.`,
    type: initialStatus === 'confirmed' ? 'success' : 'info',
    timestamp: 'Just now',
    read: false
  });
  db.saveNotifications(notifs);

  sseBus.emit('broadcast', { type: 'NEW_BOOKING', data: newBooking });

  res.status(201).json({ success: true, booking: newBooking });
});

// PUT approve booking
router.put('/:id/approve', (req, res) => {
  const { id } = req.params;
  const { reviewerName } = req.body;
  const bookings = db.getBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  booking.status = 'confirmed';
  booking.reviewedBy = reviewerName || 'Campus Administration';
  db.saveBookings(bookings);

  sseBus.emit('broadcast', { type: 'BOOKING_APPROVED', data: booking });

  res.json({ success: true, booking });
});

// PUT reject booking
router.put('/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason, reviewerName } = req.body;
  const bookings = db.getBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  booking.status = 'rejected';
  booking.rejectionReason = reason || 'Declined due to facility maintenance or scheduling priority.';
  booking.reviewedBy = reviewerName || 'Campus Administration';
  db.saveBookings(bookings);

  sseBus.emit('broadcast', { type: 'BOOKING_REJECTED', data: booking });

  res.json({ success: true, booking });
});

// PUT cancel booking
router.put('/:id/cancel', (req, res) => {
  const { id } = req.params;
  const bookings = db.getBookings();
  const booking = bookings.find(b => b.id === id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found.' });
  }

  booking.status = 'cancelled';
  db.saveBookings(bookings);

  sseBus.emit('broadcast', { type: 'BOOKING_CANCELLED', data: booking });

  res.json({ success: true, booking });
});

// POST reset bookings to zero
router.post('/reset-zero', (req, res) => {
  db.resetBookingsToZero();
  res.json({ success: true, message: 'All bookings wiped out. Starting from zero bookings!' });
});

export default router;
