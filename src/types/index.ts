export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export type ResourceType = 
  | 'auditorium' 
  | 'seminar_hall' 
  | 'classroom' 
  | 'computer_lab' 
  | 'conference_room' 
  | 'equipment';

export interface CampusResource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  location: string;
  facilities: string[];
  isAvailable: boolean; // active vs maintenance
  imageUrl: string;
  description: string;
}

export type EventCategory = 
  | 'Seminar' 
  | 'Workshop' 
  | 'Symposium' 
  | 'Conference' 
  | 'Hackathon' 
  | 'Competition';

export interface AcademicEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  department: string;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  venueId: string;
  venueName: string;
  organizer: string;
  speaker: string;
  capacity: number;
  registeredCount: number;
  registrationDeadline: string;
  bannerUrl: string;
  requirements?: string[];
  isFeatured?: boolean;
}

export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

export interface BookingRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  resourceId: string;
  resourceName: string;
  resourceType: ResourceType;
  date: string; // YYYY-MM-DD
  startTime: string; // "14:00"
  endTime: string; // "16:00"
  purpose: string;
  expectedParticipants: number;
  requirements: string[];
  status: BookingStatus;
  submittedAt: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // user id or 'all' or 'admin'
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export interface EventRegistration {
  id: string;
  userId: string;
  eventId: string;
  eventTitle: string;
  registeredAt: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBooking?: BookingRequest;
  message: string;
  alternativeSlots?: { startTime: string; endTime: string; label: string }[];
  alternativeResources?: { resource: CampusResource; startTime: string; endTime: string }[];
}
