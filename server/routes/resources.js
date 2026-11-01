import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

router.get('/', (req, res) => {
  const resources = db.getResources();
  res.json({ success: true, count: resources.length, data: resources });
});

router.get('/:id', (req, res) => {
  const resources = db.getResources();
  const resource = resources.find(r => r.id === req.params.id);
  if (!resource) return res.status(404).json({ error: 'Resource not found' });
  res.json({ success: true, data: resource });
});

router.post('/', (req, res) => {
  const { name, type, capacity, location, facilities, imageUrl, description } = req.body;
  if (!name || !capacity) {
    return res.status(400).json({ error: 'Name and capacity are required.' });
  }

  const newResource = {
    id: `res-${Date.now()}`,
    name,
    type: type || 'seminar_hall',
    capacity: Number(capacity) || 50,
    location: location || 'Campus Main Block',
    facilities: Array.isArray(facilities) ? facilities : [],
    isAvailable: true,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    description: description || ''
  };

  const resources = db.getResources();
  resources.push(newResource);
  db.saveResources(resources);

  res.status(201).json({ success: true, data: newResource });
});

export default router;
