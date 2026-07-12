import React from 'react';

export type StatusType = 
  | 'Available' | 'On Trip' | 'In Maintenance' | 'Out of Service' // Vehicles
  | 'Off Duty' | 'Suspended' // Drivers
  | 'Draft' | 'Scheduled' | 'Dispatched' | 'In Transit' | 'Completed' | 'Cancelled' // Trips
  | 'In Progress' | 'Overdue'; // Maintenance

interface StatusBadgeProps {
  status: StatusType | string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  // Normalize mapping (handling capitalization safely)
  const normalized = status.trim();

  // Define semantic styles (bg, text, dot)
  const styles: Record<string, { bg: string; text: string; dot: string }> = {
    // Green
    Available: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    Completed: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    
    // Blue / Indigo
    Scheduled: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
    Dispatched: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    'In Transit': { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    'On Trip': { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
    
    // Amber / Yellow
    'In Maintenance': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    'In Progress': { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
    
    // Red / Danger
    Suspended: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
    Cancelled: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
    Overdue: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', dot: 'bg-rose-500' },
    
    // Gray / Inactive
    'Out of Service': { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
    'Off Duty': { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
    Draft: { bg: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' }
  };

  const currentStyle = styles[normalized] || {
    bg: 'bg-slate-50 border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${currentStyle.bg} ${currentStyle.text} tracking-wide shadow-2xs`}>
      <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.dot} animate-pulse`} />
      {normalized}
    </span>
  );
};

export default StatusBadge;
