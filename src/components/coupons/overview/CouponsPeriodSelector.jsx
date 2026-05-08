import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const periods = [
  { id: '7d', label: '7d' },
  { id: '30d', label: '30d' },
  { id: '90d', label: '90d' },
  { id: 'ytd', label: 'YTD' },
  { id: 'all', label: 'Tudo' },
];

export default function CouponsPeriodSelector({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <Calendar className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
      {periods.map((p) => (
        <Button
          key={p.id}
          size="sm"
          variant={value === p.id ? 'default' : 'ghost'}
          className={cn(
            'h-7 px-2 text-xs',
            value === p.id ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm' : ''
          )}
          onClick={() => onChange(p.id)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}