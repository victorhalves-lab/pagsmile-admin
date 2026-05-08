import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

/**
 * Horizontal chip-based filter row. Single or multi select.
 * options: [{ value, label, icon, count, color }]
 */
export default function QuickFilters({ options = [], value, onChange, multi = false, className }) {
  const isActive = (v) => (multi ? (value || []).includes(v) : value === v);

  const handle = (v) => {
    if (multi) {
      const set = new Set(value || []);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      onChange(Array.from(set));
    } else {
      onChange(value === v ? null : v);
    }
  };

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = isActive(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => handle(opt.value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
              active
                ? 'bg-[#2bc196] text-white border-[#2bc196] shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#2bc196]/40 hover:bg-[#2bc196]/5'
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <Badge
                variant="secondary"
                className={cn(
                  'h-4 px-1.5 text-[10px] rounded-full ml-0.5',
                  active ? 'bg-white/20 text-white border-0' : 'bg-slate-100 dark:bg-slate-700'
                )}
              >
                {opt.count}
              </Badge>
            )}
            {active && <X className="w-3 h-3 ml-0.5" />}
          </button>
        );
      })}
    </div>
  );
}