import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', disabled, required, type = 'text', icon, rightElement, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-700 tracking-wide flex items-center justify-between">
            <span>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </label>
        )}
        <div className="relative w-full flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            disabled={disabled}
            className={`w-full ${icon ? 'pl-10' : 'px-3.5'} ${rightElement ? 'pr-11' : 'px-3.5'} py-2.5 bg-white text-sm text-slate-900 border rounded-lg transition-all duration-200 outline-hidden
              placeholder:text-slate-400
              ${disabled ? 'bg-slate-50 text-slate-400 border-slate-200 pointer-events-none' : ''}
              ${error 
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' 
                : 'border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-50'
              }
              ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-2 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <span className="text-xs text-red-600 font-medium tracking-wide flex items-center animate-fade-in">
            {error}
          </span>
        )}
        {!error && helperText && (
          <span className="text-xs text-slate-400 tracking-wide">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
