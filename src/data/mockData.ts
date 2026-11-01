import { User, CampusResource, AcademicEvent, BookingRequest, NotificationItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-student-1',
    name: 'Harihar Velram',
    email: 'hari@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-faculty-1',
    name: 'Dr. Sarah Vance',
    email: 'svance@campus.edu',
    role: 'faculty',
    department: 'Department of Computing & AI',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-admin-1',
    name: 'Prof. Arthur Pendelton',
    email: 'admin.facilities@campus.edu',
    role: 'admin',
    department: 'Campus Resource Administration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_RESOURCES: CampusResource[] = [
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

export const INITIAL_EVENTS: AcademicEvent[] = [
  {
    id: 'event-1',
    title: 'AI & Large Language Models Workshop',
    description: 'An intensive hands-on technical workshop exploring transformer architectures, prompt engineering, agentic workflows, and deploying on-premise open-weights models.',
    category: 'Workshop',
    department: 'Department of Computing & AI',
    date: '2026-09-25',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    venueId: 'res-seminar-a',
    venueName: 'Seminar Hall A',
    organizer: 'Dr. Sarah Vance',
    speaker: 'Dr. Elena Rostova (Deep Learning Research Lead)',
    capacity: 150,
    registeredCount: 124,
    registrationDeadline: '2026-09-24',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    requirements: ['Bring laptop with Python 3.10+', 'Basic PyTorch familiarity'],
    isFeatured: true
  },
  {
    id: 'event-2',
    title: 'National Quantum Computing Symposium',
    description: 'Distinguished speakers from academia and quantum tech industries will discuss quantum algorithms, qubit coherence, quantum cryptography, and near-term NISQ devices.',
    category: 'Symposium',
    department: 'Department of Physics & Electronics',
    date: '2026-09-28',
    startTime: '09:00 AM',
    endTime: '04:30 PM',
    venueId: 'res-auditorium',
    venueName: 'Grand Campus Auditorium',
    organizer: 'Prof. Arthur Pendelton',
    speaker: 'Prof. Marcus Chen, FRS',
    capacity: 500,
    registeredCount: 380,
    registrationDeadline: '2026-09-27',
    bannerUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    requirements: ['Open to all faculties & students', 'Badge provided at entry'],
    isFeatured: true
  },
  {
    id: 'event-3',
    title: 'Inter-University Cyber Defense Hackathon',
    description: 'A 24-hour Capture-The-Flag (CTF) tournament challenging teams in reverse engineering, binary exploitation, web security, and industrial control protocol vulnerability hunting.',
    category: 'Hackathon',
    department: 'Information Security Council',
    date: '2026-10-02',
    startTime: '09:00 AM',
    endTime: '09:00 AM (Next Day)',
    venueId: 'res-turing-lab',
    venueName: 'Alan Turing Computing Lab',
    organizer: 'Cyber Security Student Guild',
    speaker: 'Col. Vikram Rathore (Cyber Defense Expert)',
    capacity: 65,
    registeredCount: 52,
    registrationDeadline: '2026-10-01',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    requirements: ['Teams of 2-4', 'Ethernet cables provided'],
    isFeatured: true
  },
  {
    id: 'event-4',
    title: 'Bio-Engineering & Neural Interfaces Seminar',
    description: 'Recent breakthroughs in brain-computer interfaces, microelectrode arrays, biocompatible polymers, and assistive neural prosthetics.',
    category: 'Seminar',
    department: 'Biomedical Engineering',
    date: '2026-10-05',
    startTime: '02:00 PM',
    endTime: '04:30 PM',
    venueId: 'res-seminar-b',
    venueName: 'Seminar Hall B',
    organizer: 'Dr. Clara Zimmerman',
    speaker: 'Dr. Arjun Mehta (Neurotech Labs)',
    capacity: 100,
    registeredCount: 82,
    registrationDeadline: '2026-10-04',
    bannerUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80',
    requirements: ['Undergraduate & Postgraduates welcome']
  },
  {
    id: 'event-5',
    title: 'Sustainable Energy & Micro-Grid Colloquium',
    description: 'Exploring perovskite photovoltaic efficiency, battery energy storage systems (BESS), and distributed smart grid architectures for educational campuses.',
    category: 'Conference',
    department: 'Electrical & Clean Energy Sciences',
    date: '2026-10-14',
    startTime: '10:00 AM',
    endTime: '03:00 PM',
    venueId: 'res-conf-suite',
    venueName: 'Executive Conference Suite',
    organizer: 'Clean Tech Advisory Board',
    speaker: 'Dr. Fiona Gallagher',
    capacity: 35,
    registeredCount: 29,
    registrationDeadline: '2026-10-12',
    bannerUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    requirements: ['Faculty and Research Scholars priority']
  },
  {
    id: 'event-6',
    title: 'Autonomous Drone Navigation Design Challenge',
    description: 'Student competition on real-time computer vision obstacle avoidance algorithms using onboard ROS2 nodes and optical flow tracking.',
    category: 'Competition',
    department: 'Robotics & Mechatronics Society',
    date: '2026-10-18',
    startTime: '01:00 PM',
    endTime: '05:00 PM',
    venueId: 'res-seminar-a',
    venueName: 'Seminar Hall A',
    organizer: 'Robotics Guild',
    speaker: 'Kavita Sundaram (Aerospace Lead)',
    capacity: 150,
    registeredCount: 110,
    registrationDeadline: '2026-10-17',
    bannerUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    requirements: ['Hardware specs to be verified on arrival']
  }
];

export const INITIAL_BOOKINGS: BookingRequest[] = [
  // Prescheduled confirmed bookings to illustrate real conflict detection on 2026-09-28
  {
    id: 'book-seed-1',
    userId: 'user-faculty-1',
    userName: 'Dr. Sarah Vance',
    userRole: 'faculty',
    userEmail: 'svance@campus.edu',
    resourceId: 'res-seminar-a',
    resourceName: 'Seminar Hall A',
    resourceType: 'seminar_hall',
    date: '2026-09-28',
    startTime: '09:00',
    endTime: '11:00',
    purpose: 'Faculty Colloquium & Curriculum Review',
    expectedParticipants: 80,
    requirements: ['Projector', 'Podium Mic'],
    status: 'confirmed',
    submittedAt: '2026-09-18 10:30'
  },
  {
    id: 'book-seed-2',
    userId: 'user-faculty-1',
    userName: 'Dr. Sarah Vance',
    userRole: 'faculty',
    userEmail: 'svance@campus.edu',
    resourceId: 'res-seminar-a',
    resourceName: 'Seminar Hall A',
    resourceType: 'seminar_hall',
    date: '2026-09-28',
    startTime: '13:00',
    endTime: '14:00',
    purpose: 'Department Research Pitch Session',
    expectedParticipants: 45,
    requirements: ['Projector'],
    status: 'confirmed',
    submittedAt: '2026-09-19 11:15'
  },
  {
    id: 'book-seed-3',
    userId: 'user-student-1',
    userName: 'Hariharan S.',
    userRole: 'student',
    userEmail: 'hari@campus.edu',
    resourceId: 'res-seminar-a',
    resourceName: 'Seminar Hall A',
    resourceType: 'seminar_hall',
    date: '2026-09-28',
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Student AI Club Project Demonstration',
    expectedParticipants: 95,
    requirements: ['Projector', 'Smart Board'],
    status: 'confirmed',
    submittedAt: '2026-09-19 14:00'
  },
  // Pending booking for Admin approval demo
  {
    id: 'book-seed-4',
    userId: 'user-student-1',
    userName: 'Hariharan S.',
    userRole: 'student',
    userEmail: 'hari@campus.edu',
    resourceId: 'res-seminar-b',
    resourceName: 'Seminar Hall B',
    resourceType: 'seminar_hall',
    date: '2026-09-29',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Open Source Community Orientation for Freshers',
    expectedParticipants: 85,
    requirements: ['Projector', 'Laser pointer'],
    status: 'pending',
    submittedAt: '2026-09-20 09:40'
  },
  {
    id: 'book-seed-5',
    userId: 'user-faculty-1',
    userName: 'Dr. Sarah Vance',
    userRole: 'faculty',
    userEmail: 'svance@campus.edu',
    resourceId: 'res-turing-lab',
    resourceName: 'Alan Turing Computing Lab',
    resourceType: 'computer_lab',
    date: '2026-09-30',
    startTime: '14:00',
    endTime: '17:00',
    purpose: 'GPU Accelerated Matrix Workshop',
    expectedParticipants: 60,
    requirements: ['Workstations', 'Dual Monitors'],
    status: 'pending',
    submittedAt: '2026-09-20 11:20'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-student-1',
    title: 'Booking Confirmed: Seminar Hall A',
    message: 'Your booking request for Student AI Club Project Demonstration on 28 Sep (2:00 PM - 4:00 PM) was approved by Campus Facilities.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'notif-2',
    userId: 'user-student-1',
    title: 'Event Approaching: AI Workshop',
    message: 'The AI & Large Language Models Workshop will start at 10:00 AM on 25 Sep in Seminar Hall A.',
    type: 'info',
    timestamp: '5 hours ago',
    read: true
  },
  {
    id: 'notif-3',
    userId: 'admin',
    title: 'New Booking Requests Pending',
    message: 'There are 2 new campus resource booking requests awaiting your review and approval.',
    type: 'warning',
    timestamp: '10 minutes ago',
    read: false
  }
];
