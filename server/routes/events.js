import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const events = db.getEvents();
  res.json({ success: true, count: events.length, data: events });
});

router.post('/', (req, res) => {
  const { title, description, category, department, date, startTime, endTime, venueId, venueName, organizer, speaker, capacity, bannerUrl } = req.body;
  if (!title || !date || !startTime || !endTime) {
    return res.status(400).json({ error: 'Title, date, and times are required.' });
  }

  const newEvent = {
    id: `evt-${Date.now()}`,
    title,
    description: description || '',
    category: category || 'Workshop',
    department: department || 'Academic Council',
    date,
    startTime,
    endTime,
    venueId: venueId || 'res-seminar-a',
    venueName: venueName || 'Seminar Hall A',
    organizer: organizer || 'Campus Faculty',
    speaker: speaker || 'Invited Scholar',
    capacity: Number(capacity) || 100,
    registeredCount: 0,
    registeredUsers: [],
    bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    isFeatured: false
  };

  const events = db.getEvents();
  events.unshift(newEvent);
  db.saveEvents(events);

  res.status(201).json({ success: true, data: newEvent });
});

// Event Registration
router.post('/:id/register', (req, res) => {
  const { userId } = req.body;
  const events = db.getEvents();
  const event = events.find(e => e.id === req.params.id);

  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.registeredCount >= event.capacity) {
    return res.status(400).json({ error: 'Event capacity reached.' });
  }

  if (!event.registeredUsers) event.registeredUsers = [];
  if (userId && !event.registeredUsers.includes(userId)) {
    event.registeredUsers.push(userId);
    event.registeredCount += 1;
    db.saveEvents(events);
  }

  res.json({ success: true, event });
});

// Event Unregister
router.delete('/:id/register', (req, res) => {
  const { userId } = req.body;
  const events = db.getEvents();
  const event = events.find(e => e.id === req.params.id);

  if (!event) return res.status(404).json({ error: 'Event not found' });

  if (event.registeredUsers && userId) {
    event.registeredUsers = event.registeredUsers.filter(u => u !== userId);
    event.registeredCount = Math.max(0, event.registeredCount - 1);
    db.saveEvents(events);
  }

  res.json({ success: true, event });
});

export default router;
