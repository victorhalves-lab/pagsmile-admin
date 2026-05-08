import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Floating bar that appears when items are selected.
 * actions: [{ label, icon, onClick, variant }]
 */
export default function BulkActionsBar({ count = 0, actions = [], onClear, className }) {
  if (!count) return null;
  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-2xl border border-slate-700 animate-in slide-in-from-bottom-4',
        className
      )}
    >
      <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
        <span className="inline-flex items-center justify-center min-w-7 h-7 rounded-full bg-[#2bc196] text-white text-xs font-bold px-2">
          {count}
        </span>
        <span className="text-sm text-slate-300">selecionado{count > 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-1">
        {actions.map((a, i) => (
          <Button
            key={i}
            size="sm"
            variant={a.variant === 'destructive' ? 'destructive' : 'ghost'}
            onClick={a.onClick}
            className={cn(
              'h-8 gap-1.5',
              a.variant !== 'destructive' && 'text-white hover:bg-white/10'
            )}
          >
            {a.icon && <a.icon className="w-4 h-4" />}
            {a.label}
          </Button>
        ))}
      </div>
      <button
        onClick={onClear}
        className="ml-2 p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}