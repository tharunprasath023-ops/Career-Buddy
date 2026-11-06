import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-300 text-emerald-950'
                : toast.type === 'error'
                ? 'bg-rose-50/95 border-rose-300 text-rose-950'
                : 'bg-indigo-50/95 border-indigo-300 text-indigo-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              )}
              <p className="text-xs sm:text-sm font-semibold leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
