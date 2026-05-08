import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { differenceInHours } from 'date-fns';
import { cn } from '@/lib/utils';
import { fmtBRLShort } from './utils';

const buckets = [
  { label: '<2h', max: 2, color: 'bg-red-100 border-red-300 text-red-800' },
  { label: '2-4h', max: 4, color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { label: '4-6h', max: 6, color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { label: '6-8h', max: 8, color: 'bg-emerald-100 border-emerald-300 text-emerald-800' },
];

export default function MedDeadlineHorizon({ meds = [] }) {
  const pending = meds.filter((m) => ['pending', 'analyzing'].includes(m.status));

  const getBucket = (m) => {
    if (!m.deadline_at) return null;
    const h = differenceInHours(new Date(m.deadline_at), new Date());
    if (h < 0) return null;
    if (h < 2) return 0;
    if (h < 4) return 1;
    if (h < 6) return 2;
    if (h < 8) return 3;
    return null;
  };

  const stats = buckets.map((b, i) => {
    const items = pending.filter((m) => getBucket(m) === i);
    return {
      ...b,
      count: items.length,
      value: items.reduce((s, m) => s + (m.requested_amount || 0), 0),
    };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Timer className="w-4 h-4 text-[#2bc196]" />
          Horizonte de prazos MED (próximas 8h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {stats.map((b, i) => (
            <div key={i} className={cn('p-2.5 rounded-lg border-2 text-center', b.color)}>
              <p className="text-[10px] uppercase font-bold opacity-70">{b.label}</p>
              <p className="text-2xl font-black mt-0.5">{b.count}</p>
              <p className="text-[10px] font-bold mt-0.5">{fmtBRLShort(b.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}