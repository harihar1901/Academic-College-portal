import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default initial resources (venues & labs ready to book)
const SEED_RESOURCES = [
  {
    id: 'res-auditorium',
    name: 'Grand Campus Auditorium',
    type: 'auditorium',
    capacity: 500,
    location: 'Central Campus Block, Ground Floor',
    facilities: ['4K Cinema Projector', 'Stage Lighting', 'Surround Sound', 'High-speed Wi-Fi', 'Central Air Conditioning', '8 Wireless Microphones'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800&auto=format&fit=crop&q=80',
    description: 'Premier campus auditorium for large symposia, convocations, national conferences, and cultural summits with tiered acoustic seating.'
  },
  {
    id: 'res-seminar-a',
    name: 'Seminar Hall A',
    type: 'seminar_hall',
    capacity: 150,
    location: 'Academic Block 2, 2nd Floor (Room 204)',
    facilities: ['High-Lumen Projector', 'Interactive Smart Board', 'Podium Mic', 'Central Air Conditioning', 'Dual HD Displays'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    description: 'Medium-large amphitheater classroom equipped with high-fidelity AV gear, suitable for departmental seminars, workshops, and guest lectures.'
  },
  {
    id: 'res-seminar-b',
    name: 'Seminar Hall B',
    type: 'seminar_hall',
    capacity: 100,
    location: 'Science & Innovation Wing, 1st Floor',
    facilities: ['Laser Projector', 'Surround Microphone Array', 'Whiteboard', 'Wi-Fi 6', 'Air Conditioning'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    description: 'Modern collaborative lecture hall configured with ergonomic swivel seating, excellent for interactive workshops and defense presentations.'
  },
  {
    id: 'res-turing-lab',
    name: 'Alan Turing Computing Lab',
    type: 'computer_lab',
    capacity: 65,
    location: 'IT & Computer Science Tower, 3rd Floor',
    facilities: ['65 High-End GPU Workstations', 'Dual Monitors', 'Gigabit Fiber LAN', 'Overhead Projector', 'UPS Backup'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80',
    description: 'Specialized computing facility equipped with RTX GPUs, deep learning frameworks, and synchronized workstations for hackathons and coding labs.'
  },
  {
    id: 'res-conf-suite',
    name: 'Executive Conference Suite',
    type: 'conference_room',
    capacity: 35,
    location: 'Senate Administration Building, 4th Floor',
    facilities: ['Telepresence Video Bar', '4K Smart Board', 'Omnidirectional Mics', 'Executive Leather Seating', 'Coffee Station'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    description: 'High-level committee room designed for academic council meetings, thesis defense panels, and international research consultations.'
  },
  {
    id: 'res-portable-projector',
    name: '4K Ultra-Portable Projector Kit',
    type: 'equipment',
    capacity: 200,
    location: 'AV Media Dispatch Center, Room 102',
    facilities: ['4500 Lumens Laser', 'Wireless HDMI Transmitter', 'Tripod Stand', 'Bluetooth Speaker Pair', 'Carry Case'],
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    description: 'Deployable ultra-bright laser projection equipment available for outdoor workshops, satellite classrooms, or poster showcase sessions.'
  }
];

// Seed users for the 3 distinct roles
const SEED_USERS = [
  {
    id: 'usr-student-1',
    name: 'Harihar Velram',
    email: 'hari@campus.edu',
    password: 'student123',
    role: 'student',
    studentId: 'CS2026-042',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-faculty-1',
    name: 'Dr. Sarah Vance',
    email: 'svance@campus.edu',
    password: 'faculty123',
    role: 'faculty',
    staffId: 'FAC-AI-108',
    department: 'Department of Computing & AI',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'usr-admin-1',
    name: 'Prof. Arthur Pendelton',
    email: 'admin@campus.edu',
    password: 'admin123',
    role: 'admin',
    adminKey: 'admin2026',
    department: 'Campus Resource Administration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

// Seed events
const SEED_EVENTS = [
  {
    id: 'evt-1',
    title: 'AI & Large Language Models Workshop',
    description: 'An intensive hands-on technical workshop exploring transformer architectures, prompt engineering, agentic workflows, and deploying on-premise open-weights models.',
    category: 'Workshop',
    department: 'Department of Computing & AI',
    date: '2026-09-28',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venueId: 'res-seminar-a',
    venueName: 'Seminar Hall A',
    organizer: 'Dr. Sarah Vance',
    speaker: 'Dr. Elena Rostova (Deep Learning Research Lead)',
    capacity: 150,
    registeredCount: 0,
    registeredUsers: [],
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    isFeatured: true
  },
  {
    id: 'evt-2',
    title: 'National Quantum Computing Symposium',
    description: 'Distinguished speakers from academia and quantum tech industries will discuss quantum algorithms, qubit coherence, quantum cryptography, and near-term NISQ devices.',
    category: 'Symposium',
    department: 'Department of Physics & Electronics',
    date: '2026-10-02',
    startTime: '09:00 AM',
    endTime: '04:30 PM',
    venueId: 'res-auditorium',
    venueName: 'Grand Campus Auditorium',
    organizer: 'Prof. Arthur Pendelton',
    speaker: 'Prof. Marcus Chen, FRS',
    capacity: 500,
    registeredCount: 0,
    registeredUsers: [],
    bannerUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    isFeatured: true
  }
];

class FileDatabase {
  constructor() {
    this.usersFile = path.join(DATA_DIR, 'users.json');
    this.resourcesFile = path.join(DATA_DIR, 'resources.json');
    this.eventsFile = path.join(DATA_DIR, 'events.json');
    this.bookingsFile = path.join(DATA_DIR, 'bookings.json'); // Strictly starts with 0 bookings!
    this.notificationsFile = path.join(DATA_DIR, 'notifications.json');
    this.init();
  }

  init() {
    if (!fs.existsSync(this.usersFile)) {
      fs.writeFileSync(this.usersFile, JSON.stringify(SEED_USERS, null, 2));
    }
    if (!fs.existsSync(this.resourcesFile)) {
      fs.writeFileSync(this.resourcesFile, JSON.stringify(SEED_RESOURCES, null, 2));
    }
    if (!fs.existsSync(this.eventsFile)) {
      fs.writeFileSync(this.eventsFile, JSON.stringify(SEED_EVENTS, null, 2));
    }
    // STRICTLY 0 BOOKINGS AT START
    if (!fs.existsSync(this.bookingsFile)) {
      fs.writeFileSync(this.bookingsFile, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(this.notificationsFile)) {
      fs.writeFileSync(this.notificationsFile, JSON.stringify([], null, 2));
    }
  }

  read(file) {
    try {
      const data = fs.readFileSync(file, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  write(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  }

  getUsers() { return this.read(this.usersFile); }
  saveUsers(users) { this.write(this.usersFile, users); }

  getResources() { return this.read(this.resourcesFile); }
  saveResources(resources) { this.write(this.resourcesFile, resources); }

  getEvents() { return this.read(this.eventsFile); }
  saveEvents(events) { this.write(this.eventsFile, events); }

  getBookings() { return this.read(this.bookingsFile); }
  saveBookings(bookings) { this.write(this.bookingsFile, bookings); }

  getNotifications() { return this.read(this.notificationsFile); }
  saveNotifications(notifs) { this.write(this.notificationsFile, notifs); }

  // Clear all bookings to start from zero whenever requested
  resetBookingsToZero() {
    this.write(this.bookingsFile, []);
    this.write(this.notificationsFile, []);
    return true;
  }
}

export const db = new FileDatabase();

// Connect to MongoDB if URI is live, otherwise use file database
export async function initMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;
  try {
    // 2 second timeout so startup is instantaneous if no mongod service is running
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected to MongoDB at:', uri);
    return true;
  } catch (err) {
    console.log('ℹ️  MongoDB not detected locally. Using Persistent Store (server/data/).');
    console.log('ℹ️  (To connect real MongoDB Atlas later, add your MONGODB_URI to server/.env)');
    return false;
  }
}
