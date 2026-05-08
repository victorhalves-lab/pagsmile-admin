import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function LastPurchaseCell({ date }) {
  if (!date) {
    return <span className="text-xs text-slate-400 italic">Nunca comprou</span>;
  }

  const days = differenceInDays(new Date(), new Date(date));

  let label, color;
  if (days === 0) { label = 'Hoje'; color = 'text-emerald-600 bg-emerald-50'; }
  else if (days === 1) { label = 'Ontem'; color = 'text-emerald-600 bg-emerald-50'; }
  else if (days <= 7) { label = `${days} dias`; color = 'text-emerald-600 bg-emerald-50'; }
  else if (days <= 30) { label = `${days} dias`; color = 'text-blue-600 bg-blue-50'; }
  else if (days <= 90) { label = `${days} dias`; color = 'text-yellow-600 bg-yellow-50'; }
  else if (days <= 365) { label = `${Math.floor(days / 30)} meses`; color = 'text-orange-600 bg-orange-50'; }
  else { label = `${Math.floor(days / 365)} ano${Math.floor(days / 365) > 1 ? 's' : ''}`; color = 'text-red-600 bg-red-50'; }

  return (
    <div className="flex items-center gap-1.5">
      <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1', color)}>
        <Clock className="w-3 h-3" />
        {label}
      </span>
    </div>
  );
}