import React, { useState } from 'react';
import { 
  Search, 
  Cpu, 
  ShieldCheck, 
  QrCode, 
  BarChart3, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import DepthCarousel, { DepthCarouselItem } from './DepthCarousel';

export const HowItWorks: React.FC = () => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      code: 'STAGE_01',
      number: '01',
      tag: 'DISCOVERY & QUERY',
      title: 'Auditorium & Lab Cataloging',
      summary: 'Explore university facilities with capacity filters, equipment criteria, or natural language AI requests.',
      details: [
        'Multi-department inventory: science labs, lecture halls, open amphitheaters',
        'Equipment auditing: 4K laser projectors, directional mics, VR pods',
        'Direct synchronization with the university semester timetable'
      ],
      icon: Search,
      badge: 'Zero Guesswork',
      stat: '6+ Facilities Online',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80'
    },
    {
      code: 'STAGE_02',
      number: '02',
      tag: 'COLLISION ENGINE',
      title: 'Real-Time Schedule Deconfliction',
      summary: 'Every reservation is parsed against existing schedules in milliseconds to guarantee zero overlap.',
      details: [
        'Sub-millisecond timeline overlap verification across confirmed reservations',
        'Automated buffer period insertion for facility sanitization & setup',
        'Instant recommendations for adjacent open hours if a conflict exists'
      ],
      icon: Cpu,
      badge: 'Zero Collisions',
      stat: '100% Conflict Free',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=900&q=80'
    },
    {
      code: 'STAGE_03',
      number: '03',
      tag: 'GOVERNANCE',
      title: 'Administrative Approval Protocol',
      summary: 'Facility requests route dynamically to department coordinators with 1-click approvals and reasoned logs.',
      details: [
        'Role-based authorization: Students, Faculty Fellows, and Campus Deans',
        'Audit-ready record with timestamp and institutional signature',
        'Real-time notifications sent straight to your personal dashboard'
      ],
      icon: ShieldCheck,
      badge: 'Institutional Audit',
      stat: '< 2 Hr Turnaround',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80'
    },
    {
      code: 'STAGE_04',
      number: '04',
      tag: 'PASS ISSUANCE',
      title: 'Digital Credential & Turnstile Clearance',
      summary: 'Once approved, an encrypted QR pass is minted with instant calendar export and security gate clearance.',
      details: [
        'Scannable turnstile verification token stored in your dashboard',
        '1-click calendar sync with Google Calendar, Apple iCal, and Outlook',
        'Automated seat reservation confirmation for attendees'
      ],
      icon: QrCode,
      badge: 'Instant Dispatch',
      stat: 'Live Turnstile Sync',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80'
    },
    {
      code: 'STAGE_05',
      number: '05',
      tag: 'INTELLIGENCE',
      title: 'Utilization Analytics & Energy Sync',
      summary: 'Automated logging of facility utilization, attendance rates, and automated HVAC/lighting schedule links.',
      details: [
        'Post-event occupancy telemetry and turnstile headcount auditing',
        'Smart energy power-down for unoccupied rooms',
        'Dean-level quarterly space utilization reports'
      ],
      icon: BarChart3,
      badge: 'Data Driven',
      stat: '98.4% Efficiency',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80'
    }
  ];

  const carouselItems: DepthCarouselItem[] = stages.map(s => ({
    image: s.image,
    alt: s.title,
    number: s.number,
    tag: s.tag,
    title: s.title,
    summary: s.summary,
    badge: s.badge
  }));

  const current = stages[activeStage] || stages[0];
  const CurrentIcon = current.icon;

  return (
    <section id="how-it-works" className="py-24 bg-brand-cream border-b border-brand-dark/10 scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Editorial Architecture Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-dark/5 text-brand-dark text-[11px] font-mono tracking-widest uppercase font-semibold mb-3">
              <Layers className="w-3.5 h-3.5 text-brand-green" />
              <span>Operational Blueprint // 05 Architectural Stages</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-dark">
              HOW THE PORTAL OPERATES
            </h2>
            <p className="text-base sm:text-lg text-brand-dark/75 mt-2.5 max-w-2xl font-normal leading-relaxed">
              Engineered to replace fragmented email chains and double-booked halls with an auditable, real-time university scheduling protocol.
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-3 font-mono text-xs text-brand-dark/60 bg-white/80 px-4 py-2.5 rounded-xl border border-brand-dark/10 shadow-xs">
            <Clock className="w-4 h-4 text-brand-green" />
            <span>Interactive 3D Carousel: Drag or use arrows to navigate</span>
          </div>
        </div>

        {/* Stage Navigation Quick-Selectors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {stages.map((stg, idx) => (
            <button
              key={stg.code}
              onClick={() => setActiveStage(idx)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-semibold whitespace-nowrap transition-all border ${
                activeStage === idx
                  ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                  : 'bg-white/70 text-brand-dark/70 border-brand-dark/10 hover:border-brand-dark/30 hover:bg-white'
              }`}
            >
              <span className="text-brand-green mr-1.5">{stg.number}.</span>
              <span>{stg.title.split(' ')[0]} {stg.title.split(' ')[1] || ''}</span>
            </button>
          ))}
        </div>

        {/* 3D Depth Carousel Container */}
        <div className="relative w-full h-[460px] sm:h-[500px] mb-12 rounded-3xl bg-gradient-to-b from-[#18221a] to-[#0f1711] p-4 sm:p-8 shadow-2xl overflow-hidden border border-brand-dark/20">
          <div className="absolute top-4 left-6 z-20 flex items-center gap-2 text-[11px] font-mono text-white/50 uppercase tracking-widest pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Depth View // 3D Spatial Pipeline</span>
          </div>
          
          <DepthCarousel
            items={carouselItems}
            cardWidth={330}
            cardHeight={410}
            radius={22}
            tint="#0d140e"
            depth={230}
            spread={100}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.18}
            blur={5}
            duration={700}
            autoplay={false}
            loop={true}
            showControls={true}
            showIndicators={true}
            onChange={(idx) => setActiveStage(idx)}
          />
        </div>

        {/* Live Synchronized Stage Detail Inspector Panel */}
        <div className="bg-white rounded-3xl border border-brand-dark/10 p-6 sm:p-10 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Stage Deep Dive */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-brand-light text-brand-dark font-mono text-xs font-bold border border-brand-dark/10">
                  {current.code}
                </span>
                <span className="px-3 py-1 rounded-full bg-brand-green/10 text-brand-green font-mono text-xs font-bold">
                  {current.badge}
                </span>
                <span className="text-xs font-mono text-brand-dark/50 ml-auto hidden sm:inline">
                  Stage {activeStage + 1} of {stages.length}
                </span>
              </div>

              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                  {current.title}
                </h3>
                <p className="text-base text-brand-dark/75 mt-2 leading-relaxed">
                  {current.summary}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-mono uppercase tracking-wider text-brand-dark/50 font-bold">
                  Institutional Verification Protocol:
                </p>
                <div className="space-y-2.5">
                  {current.details.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-brand-dark/80 font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setActiveStage((activeStage + 1) % stages.length)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-dark text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-green transition-all"
                >
                  <span>Next: {stages[(activeStage + 1) % stages.length].title.split(' ')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="text-xs font-mono text-brand-dark/60">
                  Operational Standard: <strong className="text-brand-dark font-bold">{current.stat}</strong>
                </div>
              </div>
            </div>

            {/* Right: Live Schematic Mock Console */}
            <div className="lg:col-span-5 bg-brand-cream/80 rounded-2xl border border-brand-dark/10 p-6 flex flex-col justify-between min-h-[300px]">
              <div className="flex items-center justify-between pb-4 border-b border-brand-dark/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-dark">
                    Console Engine Telemetry
                  </span>
                </div>
                <span className="text-[10px] font-mono text-brand-green font-bold bg-white px-2 py-0.5 rounded border border-brand-dark/10">
                  ONLINE // STAGE {current.number}
                </span>
              </div>

              {/* Dynamic Schematic Output */}
              <div className="my-6 space-y-3 font-mono text-xs">
                {activeStage === 0 && (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-brand-dark/10 flex items-center justify-between">
                      <span>Query: "Auditorium &gt; 250 capacity"</span>
                      <span className="text-emerald-700 font-bold">MATCH FOUND</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-brand-dark/10 flex items-center justify-between">
                      <span>Gear: 4K Laser Projection</span>
                      <span className="text-brand-dark/60">INSTALLED</span>
                    </div>
                    <div className="p-2.5 bg-brand-light rounded-lg text-[11px] text-brand-dark/70">
                      → Newton Hall &amp; Turing Amphitheatre ready for reservation
                    </div>
                  </div>
                )}

                {activeStage === 1 && (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-brand-dark/10 flex items-center justify-between">
                      <span>09:00 - 11:00 AM Slot</span>
                      <span className="text-emerald-700 font-bold">AVAILABLE [FREE]</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-red-200 bg-red-50/50 flex items-center justify-between text-red-900">
                      <span>11:00 - 01:00 PM Slot</span>
                      <span className="text-red-600 font-bold">CONFLICT DETECTED</span>
                    </div>
                    <div className="p-2.5 bg-brand-light rounded-lg text-[11px] text-brand-dark/70">
                      Collision engine locks overlapping intervals to prevent double-booking.
                    </div>
                  </div>
                )}

                {activeStage === 2 && (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-brand-dark/10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-brand-dark">Dean of Science</span>
                        <span className="text-emerald-700 font-bold">APPROVED</span>
                      </div>
                      <span className="text-[11px] text-brand-dark/60">Hash: 8f2a...c01e • 10:42 AM</span>
                    </div>
                    <div className="p-2.5 bg-brand-light rounded-lg text-[11px] text-brand-dark/70">
                      Full digital audit trail generated for facilities management.
                    </div>
                  </div>
                )}

                {activeStage === 3 && (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-brand-dark/10 flex items-center gap-4">
                      <div className="w-14 h-14 bg-brand-dark rounded-lg flex items-center justify-center text-white shrink-0">
                        <QrCode className="w-8 h-8 text-brand-light" />
                      </div>
                      <div>
                        <div className="font-bold text-brand-dark text-xs">ENTRY PASS MINTED</div>
                        <div className="text-[11px] text-brand-dark/60">Newton Hall • Row A-12</div>
                        <div className="text-[10px] text-emerald-700 font-bold">TURNSTILE CLEAR</div>
                      </div>
                    </div>
                    <div className="p-2.5 bg-brand-light rounded-lg text-[11px] text-brand-dark/70">
                      Calendar invite (.ics) and mobile ticket dispatched immediately.
                    </div>
                  </div>
                )}

                {activeStage === 4 && (
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-brand-dark/10 flex items-center justify-between">
                      <span>Facility Attendance</span>
                      <span className="text-emerald-700 font-bold">96.8% Quorum</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-brand-dark/10 flex items-center justify-between">
                      <span>HVAC / Lighting Eco-Mode</span>
                      <span className="text-brand-dark/70">ENGAGED</span>
                    </div>
                    <div className="p-2.5 bg-brand-light rounded-lg text-[11px] text-brand-dark/70">
                      Semester utilization logged to Provost operational dashboard.
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-brand-dark/10 flex items-center justify-between text-[11px] font-mono text-brand-dark/60">
                <span>Latency: 12ms</span>
                <span>Security: Campus Kerberos / OAuth</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
