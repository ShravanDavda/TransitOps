import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Automatic dismissal after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, toasts, removeToast }}>
      {children}
      
      {/* Toast Overlay Portal Container */}
      <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-3 max-w-md w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <ToastItemComponent key={t.id} item={t} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

interface ToastItemComponentProps {
  item: ToastItem;
  onClose: (id: string) => void;
}

const ToastItemComponent: React.FC<ToastItemComponentProps> = ({ item, onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 stroke-[2.2]" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 stroke-[2.2]" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 stroke-[2.2]" />,
    info: <Info className="w-5 h-5 text-brand-600 stroke-[2.2]" />
  };

  const colors = {
    success: 'bg-emerald-50 border-emerald-100 text-slate-800 shadow-emerald-500/5',
    error: 'bg-rose-50 border-rose-100 text-slate-800 shadow-rose-500/5',
    warning: 'bg-amber-50 border-amber-100 text-slate-800 shadow-amber-500/5',
    info: 'bg-brand-50 border-indigo-100 text-slate-800 shadow-brand-500/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -5 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl border shadow-lg ${colors[item.type]} relative overflow-hidden`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[item.type]}</div>
      <div className="flex-1 text-xs font-medium leading-relaxed font-sans">{item.message}</div>
      <button
        onClick={() => onClose(item.id)}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Dynamic Progress indicator bar at the bottom */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 3.5, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-0.75 
          ${item.type === 'success' ? 'bg-emerald-500' : ''}
          ${item.type === 'error' ? 'bg-rose-500' : ''}
          ${item.type === 'warning' ? 'bg-amber-500' : ''}
          ${item.type === 'info' ? 'bg-brand-500' : ''}
        `}
      />
    </motion.div>
  );
};
