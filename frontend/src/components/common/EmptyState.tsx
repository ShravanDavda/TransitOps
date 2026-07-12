import React, { ReactNode } from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Database className="w-12 h-12 text-slate-300 stroke-[1.5]" />,
  title = 'No records found',
  description = 'Try adjusting your filters, refining your search terms, or add a new record to get started.',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 animate-fade-in my-4">
      <div className="p-3 bg-white rounded-2xl shadow-xs border border-slate-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-800 font-display tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
