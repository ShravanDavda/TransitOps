import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', fullPage = false, text }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} rounded-full border-slate-200 animate-pulse`}></div>
        {/* Active Spinning Segment */}
        <div className={`${sizeClasses[size]} rounded-full border-brand-500 border-t-transparent animate-spin absolute top-0 left-0`}></div>
      </div>
      {text && (
        <span className="text-sm font-medium text-slate-500 tracking-wide font-display animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full flex items-center justify-center">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
};

export default Loader;
