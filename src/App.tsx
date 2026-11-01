import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickAccess } from './components/QuickAccess';
import { UpcomingEvents } from './components/UpcomingEvents';
import { AvailableResources } from './components/AvailableResources';
import { HowItWorks } from './components/HowItWorks';
import { WhyUs } from './components/WhyUs';
import { Footer } from './components/Footer';
import { BookResourceModal } from './components/BookResourceModal';
import { EventDetailsModal } from './components/EventDetailsModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AuthModal } from './components/AuthModal';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LiveToast } from './components/LiveToast';
import { CampusResource, AcademicEvent } from './types';

function MainPortal() {
  const { currentUser } = usePortal();

  // Modal states
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedResourceForBooking, setSelectedResourceForBooking] = useState<CampusResource | null>(null);

  const [eventDetailsModalOpen, setEventDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(null);

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [userDashboardOpen, setUserDashboardOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = (resource?: CampusResource) => {
    setSelectedResourceForBooking(resource || null);
    setBookModalOpen(true);
  };

  const handleOpenEventDetails = (event: AcademicEvent) => {
    setSelectedEvent(event);
    setEventDetailsModalOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col selection:bg-brand-green selection:text-white">
      {/* 1. Top Fixed Navigation Bar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={() => setUserDashboardOpen(true)}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
        onOpenAi={() => setAiModalOpen(true)}
      />

      {/* 2. Hero Section with Video Background & Wireframe Header */}
      <main className="flex-1">
        <Hero
          onExploreEvents={() => scrollToSection('events')}
          onBookResource={() => handleOpenBooking()}
          onOpenAi={() => setAiModalOpen(true)}
        />

        {/* 3. How It Works (Blueprint & Architectural Pipeline right below Hero) */}
        <HowItWorks />

        {/* 4. Upcoming Events Section */}
        <UpcomingEvents
          onSelectEvent={handleOpenEventDetails}
        />

        {/* 5. Available Campus Resources Section */}
        <AvailableResources
          onBookResource={handleOpenBooking}
        />

        {/* 6. Quick Access / Campus Domains (React Bits AccordionGallery) */}
        <QuickAccess
          onSelectEvents={() => scrollToSection('events')}
          onSelectResources={() => scrollToSection('resources')}
          onSelectBookings={() => setUserDashboardOpen(true)}
          onSelectAi={() => setAiModalOpen(true)}
        />

        {/* 7. Why Use The Portal? */}
        <WhyUs />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* --- Interactive Overlays & Modals --- */}

      {/* Resource Booking Modal with Live Conflict Engine */}
      {bookModalOpen && (
        <BookResourceModal
          initialResource={selectedResourceForBooking}
          onClose={() => setBookModalOpen(false)}
          onSuccess={() => {
            setUserDashboardOpen(true);
          }}
        />
      )}

      {/* Event Details & Instant RSVP Modal */}
      {eventDetailsModalOpen && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setEventDetailsModalOpen(false)}
          onViewMyBookings={() => {
            setEventDetailsModalOpen(false);
            setUserDashboardOpen(true);
          }}
        />
      )}

      {/* Natural Language AI Room & Event Finder */}
      {aiModalOpen && (
        <AiAssistantModal
          onClose={() => setAiModalOpen(false)}
          onBookResource={(res) => {
            handleOpenBooking(res);
          }}
          onSelectEvent={(evt) => {
            handleOpenEventDetails(evt);
          }}
        />
      )}

      {/* Auth & Persona Switcher */}
      {authModalOpen && (
        <AuthModal
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onSuccess={() => {}}
        />
      )}

      {/* Student / Faculty User Dashboard */}
      {userDashboardOpen && (
        <UserDashboard
          onClose={() => setUserDashboardOpen(false)}
          onOpenBookResource={() => {
            handleOpenBooking();
          }}
          onOpenEvents={() => scrollToSection('events')}
        />
      )}

      {/* Full Campus Administrator Operations Dashboard */}
      {adminDashboardOpen && (
        <AdminDashboard
          onClose={() => setAdminDashboardOpen(false)}
        />
      )}

      {/* Live Real-Time Toast Notifications (Instant Turnstile / Approval sync) */}
      <LiveToast
        onOpenDashboard={() => setUserDashboardOpen(true)}
        onOpenAdmin={() => setAdminDashboardOpen(true)}
      />
    </div>
  );
}

export function App() {
  return (
    <PortalProvider>
      <MainPortal />
    </PortalProvider>
  );
}

export default App;
