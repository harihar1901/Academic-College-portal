# Academic Event & Campus Resource Booking Portal

A centralized web-based platform for university students, faculty, and administrators to discover academic events, check real-time resource availability, request facility reservations, and manage schedules with zero double-booking conflicts.

## Key Features
- **Strict Conflict Detection Engine**: Prevents double-bookings across same-day/same-time slots and suggests open alternatives.
- **Administrative Approval Workflow**: Requests are routed to administrators with 1-click approvals and reasoned rejection notes.
- **Academic Event Discovery & RSVP**: Searchable catalog with category filtering and instant seat reservation.
- **Natural Language AI Room Finder**: Searches campus inventory based on plain text criteria (capacity, date, equipment).
- **Role-Based Views**: Instant simulation between Student, Faculty, and Admin views.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Design System**: Editorial styling (`#2d3a2e`, `#3d5a3e`, `#faf8f5`), Playfair Display, responsive layouts.

## Getting Started

### 1. Backend API Server (Node.js + Express)
```bash
cd server
npm install
node server.js
```
The server will start on `http://localhost:5000` (connects to MongoDB or operates in resilient in-memory mode).

### 2. Frontend Client (React + Vite + Tailwind)
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
