import React from 'react';
import { 
  CheckCircle2, 
  Layers, 
  Clock, 
  CalendarCheck, 
  ShieldCheck, 
  AlertTriangle, 
  BellRing 
} from 'lucide-react';

export const WhyUs: React.FC = () => {
  const features = [
    {
      title: 'Centralized Booking',
      desc: 'One unified repository replacing fragmented department paper forms, emails, and isolated spreadsheets.',
      icon: Layers
    },
    {
      title: 'Real-time Availability',
      desc: 'Instant visual schedules showing confirmed, pending, and open slots for every campus room and AV asset.',
      icon: Clock
    },
    {
      title: 'Event Management',
      desc: 'End-to-end publishing, registration capping, seat tracking, and public calendar visibility.',
      icon: CalendarCheck
    },
    {
      title: 'Easy Approval',
      desc: 'Streamlined role-based administrative workflow with 1-click approvals and reason-annotated rejections.',
      icon: ShieldCheck
    },
    {
      title: 'Reduced Conflicts',
      desc: 'Algorithmic overlap prevention guarantees zero double-bookings with smart alternative recommendations.',
      icon: AlertTriangle
    },
    {
      title: 'Notifications',
      desc: 'Live in-app alerts keep organizers, faculties, and students updated on submissions and schedule changes.',
      icon: BellRing
    }
  ];

  return (
    <section className="py-20 bg-brand-light/60 border-t border-brand-dark/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Wireframe Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-brand-dark/50">
            Core Advantages
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark mt-1">
            WHY USE THE PORTAL?
          </h2>
          <p className="text-sm text-brand-dark/65 mt-2">
            Engineered to resolve academic resource friction, eliminate double-bookings, and empower student-faculty collaboration.
          </p>
        </div>

        {/* 6 Wireframe Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="bg-white rounded-2xl border border-brand-dark/10 p-6 shadow-xs hover:shadow-md transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-playfair text-base sm:text-lg font-bold text-brand-dark flex items-center gap-2">
                    <span>{feat.title}</span>
                  </h3>
                  <p className="text-xs text-brand-dark/70 mt-1.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
