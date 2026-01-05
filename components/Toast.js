'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

// Toast Context
const ToastContext = createContext(null);

// Toast types config
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    textColor: 'text-emerald-800',
  },
  error: {
    icon: AlertCircle,
    bg: 'bg-red-50',
    border: 'border-red-200',
    iconColor: 'text-red-600',
    textColor: 'text-red-800',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-800',
  },
};

// Individual Toast Component
const ToastItem = ({ id, message, type = 'info', onRemove }) => {
  const config = TOAST_CONFIG[type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${config.bg} ${config.border} animate-slide-up max-w-sm`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      <p className={`text-sm font-medium flex-1 ${config.textColor}`}>{message}</p>
      <button
        onClick={() => onRemove(id)}
        className={`p-1 rounded-full hover:bg-white/50 transition-colors ${config.iconColor}`}
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 z-[200] space-y-2 px-4 w-full max-w-md"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);

  return { toasts, addToast, removeToast, success, error, info };
}

// Export context for potential future use
export { ToastContext };
