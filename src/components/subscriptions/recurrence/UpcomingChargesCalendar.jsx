import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fmtCurrency } from '@/components/subscriptions/utils';
import { cn } from '@/lib/utils';

export default function UpcomingChargesCalendar() {
  const days = Array.from({ length: 14 }).map((_, i) => {
    const date = addDays(new Date(), i);
    const charges = Math.floor(Math.random() * 25) + 5;
    const total = charges * (200 + Math.random() * 150);
    return { date, charges, total };
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Próximas cobranças (14 dias)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => (
            <div key={i} className={cn('p-2 rounded border text-center hover:bg-slate-50 cursor-pointer', i === 0 && 'border-[#2bc196] bg-emerald-50/50')}>
              <p className="text-[10px] text-slate-500">{format(d.date, 'dd/MM', { locale: ptBR })}</p>
              <p className="text-[10px] text-slate-400">{format(d.date, 'EEE', { locale: ptBR })}</p>
              <p className="text-xs font-bold mt-1">{d.charges}</p>
              <p className="text-[10px] text-emerald-600 font-medium">{fmtCurrency(d.total, { short: true })}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}