import React from 'react';
import { Clock, AlertTriangle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { computeUrgency } from './utils';

const colorMap = {
  red: 'bg-red-50 text-red-700 border-red-200 animate-pulse',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  slate: 'bg-slate-50 text-slate-500 border-slate-200',
};

export default function UrgencyPill({ item }) {
  const u = computeUrgency(item);
  const Icon = u.level === 'critical' ? AlertCircle : u.level === 'high' ? AlertTriangle : Clock;
  return (
    <Badge variant="outline" className={cn('text-[10px] font-bold gap-1', colorMap[u.color] || colorMap.slate)}>
      <Icon className="w-3 h-3" />
      {u.label}
    </Badge>
  );
}