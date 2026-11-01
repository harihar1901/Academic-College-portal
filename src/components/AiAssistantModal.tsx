import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Users, 
  Calendar, 
  Clock,
  Cpu
} from 'lucide-react';
import { usePortal, timeToMinutes } from '../context/PortalContext';
import { CampusResource, AcademicEvent } from '../types';

interface AiAssistantModalProps {
  onClose: () => void;
  onBookResource: (resource: CampusResource, prefillDate?: string, prefillStart?: string, prefillEnd?: string) => void;
  onSelectEvent: (event: AcademicEvent) => void;
}

interface ParsedAiQuery {
  targetCapacity?: number;
  resourceKeyword?: string;
  facilitiesNeeded: string[];
  date?: string;
  startTime?: string;
  endTime?: string;
  isEventSearch?: boolean;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  onClose,
  onBookResource,
  onSelectEvent
}) => {
  const { resources, events, bookings, checkConflict } = usePortal();
  
  const [query, setQuery] = useState<string>('I need a hall for 120 students on 28 September from 10 AM to 1 PM with a projector');
  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const [parsedCriteria, setParsedCriteria] = useState<ParsedAiQuery | null>(null);

  // Quick suggestion chips
  const sampleQueries = [
    'I need a hall for 120 students on 28 September from 10 AM to 1 PM with a projector',
    'Find computer lab with GPUs for 50 students',
    'Auditorium for 400 participants with stage lighting',
    'Find workshops on artificial intelligence'
  ];

  // Natural language query interpretation algorithm
  const parseQuery = (text: string): ParsedAiQuery => {
    const lower = text.toLowerCase();
    
    // Check if searching for events
    if (lower.includes('workshop') || lower.includes('symposium') || lower.includes('event') || lower.includes('hackathon') || lower.includes('seminar')) {
      return { isEventSearch: true, facilitiesNeeded: [] };
    }

    // Capacity extraction
    const capMatch = lower.match(/(\d+)\s*(students|people|seats|attendees|participants)?/);
    const targetCapacity = capMatch ? parseInt(capMatch[1], 10) : undefined;

    // Facility extraction
    const facilitiesNeeded: string[] = [];
    if (lower.includes('projector')) facilitiesNeeded.push('Projector');
    if (lower.includes('smart board')) facilitiesNeeded.push('Smart Board');
    if (lower.includes('mic') || lower.includes('microphone')) facilitiesNeeded.push('Microphone');
    if (lower.includes('gpu') || lower.includes('workstation')) facilitiesNeeded.push('GPU');
    if (lower.includes('ac') || lower.includes('air condition')) facilitiesNeeded.push('Air Conditioning');

    // Date extraction
    let date = '2026-09-28';
    if (lower.includes('october') || lower.includes('oct')) {
      date = '2026-10-05';
    }

    // Time window extraction
    let startTime = '10:00';
    let endTime = '13:00';
    if (lower.includes('2 pm') || lower.includes('2pm') || lower.includes('14:00')) {
      startTime = '14:00';
      endTime = '16:00';
    }

    return {
      targetCapacity,
      facilitiesNeeded,
      date,
      startTime,
      endTime
    };
  };

  const handleRunSearch = (customText?: string) => {
    const textToUse = customText !== undefined ? customText : query;
    if (!textToUse.trim()) return;

    const parsed = parseQuery(textToUse);
    setParsedCriteria(parsed);
    setHasSearched(true);
  };

  // Compute matched resources
  const criteria = parsedCriteria || parseQuery(query);

  const matchedResources = resources.map(res => {
    const capacityOk = !criteria.targetCapacity || res.capacity >= criteria.targetCapacity;
    const facilitiesOk = criteria.facilitiesNeeded.every(req => 
      res.facilities.some(f => f.toLowerCase().includes(req.toLowerCase()))
    );

    // Conflict check
    const conflictResult = criteria.date && criteria.startTime && criteria.endTime
      ? checkConflict(res.id, criteria.date, criteria.startTime, criteria.endTime)
      : { hasConflict: false, message: 'Available' };

    let compatibilityScore = 100;
    if (!capacityOk) compatibilityScore -= 40;
    if (!facilitiesOk) compatibilityScore -= 20;
    if (conflictResult.hasConflict) compatibilityScore -= 50;

    return {
      resource: res,
      capacityOk,
      facilitiesOk,
      hasConflict: conflictResult.hasConflict,
      conflictMessage: conflictResult.message,
      score: compatibilityScore
    };
  }).sort((a, b) => b.score - a.score);

  // If query is for events
  const matchedEvents = events.filter(e => 
    query.toLowerCase().includes(e.category.toLowerCase()) ||
    e.title.toLowerCase().includes('ai') ||
    e.title.toLowerCase().includes('intelligence')
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm overflow-y-auto animate-fade-down">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-brand-dark/10 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 sm:p-8 bg-brand-cream border-b border-brand-dark/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-dark text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-green" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-brand-green">
                  Campus Intelligence Layer
                </span>
              </div>
              <h2 className="font-playfair text-2xl font-bold text-brand-dark">
                AI Resource &amp; Event Discovery
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-brand-dark/10 text-brand-dark/60 hover:text-brand-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-6 sm:p-8 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-brand-green absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. I need a hall for 150 students next Monday from 10 AM to 1 PM with a projector"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunSearch()}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl border border-brand-dark/20 bg-brand-cream/40 text-xs sm:text-sm font-medium text-brand-dark focus:outline-none focus:border-brand-green shadow-inner"
            />
            <button
              onClick={() => handleRunSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-brand-dark text-white rounded-xl text-xs font-semibold hover:bg-brand-green transition-colors uppercase tracking-wider shadow-xs"
            >
              Analyze
            </button>
          </div>

          {/* Quick Query Sample Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-brand-dark/50">
              Try sample prompts:
            </div>
            <div className="flex flex-wrap gap-2">
              {sampleQueries.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(s);
                    handleRunSearch(s);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-brand-light/70 hover:bg-brand-cream text-brand-dark text-xs border border-brand-dark/10 transition-colors text-left font-medium"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Interpretation Breakdown */}
          {criteria && !criteria.isEventSearch && (
            <div className="p-3.5 rounded-xl bg-brand-cream/80 border border-brand-dark/10 flex flex-wrap items-center gap-4 text-xs text-brand-dark">
              <span className="font-bold text-brand-green uppercase text-[10px] tracking-wider">
                Parsed Intent:
              </span>
              {criteria.targetCapacity && (
                <span>👥 Min Capacity: <strong>{criteria.targetCapacity}</strong></span>
              )}
              {criteria.facilitiesNeeded.length > 0 && (
                <span>⚡ Needs: <strong>{criteria.facilitiesNeeded.join(', ')}</strong></span>
              )}
              {criteria.date && (
                <span>📅 Date: <strong>{criteria.date}</strong></span>
              )}
              {criteria.startTime && criteria.endTime && (
                <span>⏰ Window: <strong>{criteria.startTime} – {criteria.endTime}</strong></span>
              )}
            </div>
          )}

          {/* Results Display */}
          <div className="pt-2">
            <h3 className="font-playfair text-lg font-bold text-brand-dark mb-3">
              {criteria.isEventSearch ? 'Matching Academic Events' : 'AI Resource Evaluation Results'}
            </h3>

            {criteria.isEventSearch ? (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {matchedEvents.map(evt => (
                  <div 
                    key={evt.id}
                    className="p-4 rounded-2xl border border-brand-dark/10 bg-white hover:border-brand-green transition-all flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-green">
                        {evt.category} • {evt.department}
                      </span>
                      <h4 className="font-playfair font-bold text-brand-dark text-sm sm:text-base">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-brand-dark/60 mt-0.5">
                        📅 {evt.date} ({evt.startTime}) at {evt.venueName}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectEvent(evt);
                      }}
                      className="px-4 py-2 bg-brand-dark hover:bg-brand-green text-white text-xs font-semibold rounded-xl uppercase tracking-wider"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {matchedResources.map(({ resource, capacityOk, facilitiesOk, hasConflict, conflictMessage }) => {
                  const isTopChoice = capacityOk && facilitiesOk && !hasConflict;

                  return (
                    <div
                      key={resource.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isTopChoice
                          ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
                          : hasConflict
                          ? 'border-red-200 bg-red-50/20'
                          : 'border-brand-dark/10 bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-playfair font-bold text-brand-dark text-sm sm:text-base">
                            {resource.name}
                          </h4>
                          {isTopChoice && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase">
                              Best Match
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-brand-dark/70">
                          <span>👥 Capacity: <strong>{resource.capacity}</strong></span>
                          <span>📍 {resource.location}</span>
                        </div>

                        {/* Status checks */}
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          <span className={`flex items-center gap-1 font-medium ${capacityOk ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {capacityOk ? '✓ Capacity sufficient' : '✗ Capacity insufficient'}
                          </span>
                          <span className="text-brand-dark/30">•</span>
                          <span className={`flex items-center gap-1 font-medium ${!hasConflict ? 'text-emerald-700' : 'text-red-700'}`}>
                            {!hasConflict ? `✓ ${criteria.startTime || '10 AM'}–${criteria.endTime || '1 PM'}: Available` : '✗ Time slot occupied'}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex sm:flex-col items-end gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onBookResource(resource, criteria.date, criteria.startTime, criteria.endTime);
                          }}
                          disabled={hasConflict}
                          className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                            hasConflict
                              ? 'bg-brand-dark/20 text-brand-dark/40 cursor-not-allowed'
                              : 'bg-brand-dark hover:bg-brand-green text-white shadow-xs'
                          }`}
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
