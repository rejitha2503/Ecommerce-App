import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertOctagon, HelpCircle, X, Sparkles, Bell } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warn' | 'error';
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  themeMode: 'LIGHT' | 'DARK';
}

export default function ToastContainer({
  toasts,
  onDismiss,
  themeMode
}: ToastContainerProps) {
  const isDark = themeMode === 'DARK';

  return (
    <div className="fixed bottom-5 right-5 z-55 flex flex-col gap-2.5 max-w-[90vw] sm:w-[360px] pointer-events-none select-none">
      <AnimatePresence>
        {toasts.map(t => (
          <ToastCard 
            key={t.id} 
            toast={t} 
            onDismiss={onDismiss} 
            isDark={isDark} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Single Card instance with inner timeout countdown progress bar
function ToastCard({
  toast,
  onDismiss,
  isDark
}: {
  key?: string;
  toast: ToastItem;
  onDismiss: (id: string) => void;
  isDark: boolean;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      bgBorder: isDark ? 'bg-slate-900 border-emerald-500/30' : 'bg-white border-emerald-250',
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
      progressBg: 'bg-emerald-500',
      badge: 'Success'
    },
    info: {
      bgBorder: isDark ? 'bg-slate-900 border-indigo-500/30' : 'bg-white border-indigo-250',
      icon: HelpCircle,
      iconColor: 'text-indigo-500',
      progressBg: 'bg-indigo-500',
      badge: 'Details'
    },
    warn: {
      bgBorder: isDark ? 'bg-slate-900 border-amber-500/30' : 'bg-white border-amber-250',
      icon: AlertOctagon,
      iconColor: 'text-amber-500',
      progressBg: 'bg-amber-400',
      badge: 'Warning'
    },
    error: {
      bgBorder: isDark ? 'bg-slate-900 border-rose-500/30' : 'bg-white border-rose-250',
      icon: AlertOctagon,
      iconColor: 'text-rose-500',
      progressBg: 'bg-rose-500',
      badge: 'Alert'
    }
  };

  const current = config[toast.type] || config.info;
  const Icon = current.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, x: 50 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`pointer-events-auto relative p-4 rounded-2xl border shadow-xl flex gap-3 text-left overflow-hidden ${current.bgBorder}`}
    >
      {/* Icon header holder */}
      <div className={`p-2 rounded-xl shrink-0 h-max ${isDark ? 'bg-slate-950/40' : 'bg-slate-50'}`}>
        <Icon className={`w-5 h-5 ${current.iconColor} animate-fade-in`} />
      </div>

      {/* Title Details message */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-1.5">
          <span className="font-extrabold text-[12.5px] leading-tight text-slate-900 dark:text-white font-sora block">
            {toast.title}
          </span>
          <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.25 rounded ${isDark ? 'bg-slate-950/80 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
            {current.badge}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 pb-1 leading-relaxed antialiased">
          {toast.message}
        </p>
      </div>

      {/* Manual closing button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-650 dark:hover:text-slate-205 transition p-0.5 rounded cursor-pointer"
        title="Dismiss Toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Expiry Progress Bar Animation */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-1 ${current.progressBg}`}
      />
    </motion.div>
  );
}
