import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EventEmitter } from 'events';
import { initMongo } from './db/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '..', 'dist');

import authRoutes from './routes/auth.js';
import resourceRoutes from './routes/resources.js';
import bookingRoutes from './routes/bookings.js';
import eventRoutes from './routes/events.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

export const sseBus = new EventEmitter();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// SSE Live Real-Time Push Stream
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  sendEvent('connected', { message: 'Real-time SSE event stream connected.' });

  const onBroadcast = (payload) => {
    sendEvent(payload.type, payload.data);
  };

  sseBus.on('broadcast', onBroadcast);

  req.on('close', () => {
    sseBus.off('broadcast', onBroadcast);
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Academic Event & Resource Booking Portal Backend is live.',
    timestamp: new Date().toISOString()
  });
});

// Serve frontend static build assets in production
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: system-ui, sans-serif; text-align: center; padding: 60px 20px;">
        <h2>🎓 Academic Portal Backend is Live!</h2>
        <p>The backend API is running on Render, but the frontend build (<code>dist/</code>) was not found.</p>
        <p>Ensure Render's <strong>Build Command</strong> is set to: <code>npm install && npm run build</code></p>
      </div>
    `);
  });
}

// Start Server & Database
async function startServer() {
  await initMongo();
  app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`🚀 Academic Portal Backend running on http://localhost:${PORT}`);
    console.log(`📡 REST API Endpoints active at http://localhost:${PORT}/api/`);
    console.log(`⚡ Live SSE Stream active at http://localhost:${PORT}/api/stream`);
    console.log(`===================================================`);
  });
}

startServer();
