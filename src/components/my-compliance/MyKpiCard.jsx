import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function MyKpiCard({ label, value, sub, icon: Icon, accent = 'slate', warn }) {
  const accents = {
    slate: 'text-slate-700',
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600'
  };
  return (
    <Card className={cn(warn && 'border-amber-200 bg-amber-50/30')}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
            <div className={cn('text-2xl font-black mt-1', accents[accent])}>{value}</div>
            {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
          </div>
          {Icon && <Icon className={cn('w-5 h-5', accents[accent])} />}
        </div>
      </CardContent>
    </Card>
  );
}