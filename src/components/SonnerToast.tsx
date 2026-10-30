import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X, Send } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'info' | 'sync';
  actionLabel?: string;
  onAction?: () => void;
}

interface SonnerToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const SonnerToastContainer: React.FC<SonnerToastProps> = ({ toasts, onDismiss }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (toasts.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none"
      style={{ perspective: 1000 }}
    >
      <div className="relative flex flex-col items-end gap-2 pointer-events-auto">
        {toasts.map((toast, index) => {
          // Emil Kowalski's signature stacked depth calculation
          const reversedIndex = toasts.length - 1 - index;
          const isLatest = reversedIndex === 0;

          const translateY = isHovered
            ? 0
            : -reversedIndex * 12;
          const scale = isHovered ? 1 : 1 - reversedIndex * 0.05;
          const opacity = isHovered ? 1 : reversedIndex > 2 ? 0 : 1 - reversedIndex * 0.15;
          const zIndex = 50 - reversedIndex;

          return (
            <div
              key={toast.id}
              style={{
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                zIndex,
                transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="w-80 sm:w-88 p-3.5 rounded-xl bg-white/95 dark:bg-[#1A1A19]/95 backdrop-blur-md border border-black/[0.08] dark:border-white/[0.1] shadow-craft-lg flex items-start gap-3 transition-shadow hover:shadow-craft-modal group"
            >
              {/* Icon */}
              <div className="mt-0.5 shrink-0">
                {toast.type === 'success' && (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 size={13} strokeWidth={2.5} />
                  </div>
                )}
                {toast.type === 'error' && (
                  <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
                    <AlertCircle size={13} strokeWidth={2.5} />
                  </div>
                )}
                {toast.type === 'info' && (
                  <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Sparkles size={13} strokeWidth={2.5} />
                  </div>
                )}
                {toast.type === 'sync' && (
                  <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Send size={11} strokeWidth={2.5} />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 pr-1">
                <h5 className="text-xs font-semibold text-stone-900 dark:text-zinc-100 leading-snug">
                  {toast.title}
                </h5>
                {toast.description && (
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 mt-0.5 leading-normal">
                    {toast.description}
                  </p>
                )}
                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={toast.onAction}
                    className="mt-2 text-[11px] font-semibold text-stone-900 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {toast.actionLabel}
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => onDismiss(toast.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 hover:bg-stone-100 dark:hover:bg-zinc-800 transition"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
