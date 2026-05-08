import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ArrowUpFromLine, Zap, Clock } from 'lucide-react';
import { addDays, format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { fmtBRL } from './utils';

// Payouts Timeline — Gantt visual de saques+antecipações (Stripe inspired)
export default function PayoutsTimeline({ withdrawals = [], anticipations = [] }) {
  const today = new Date();
  const horizon = 14;

  const events = useMemo(() => {
    const fromW = withdrawals.map(w => ({
      id: w.id,
      kind: 'withdrawal',
      date: w.scheduled_date || w.created_date,
      amount: w.amount,
      label: `Saque ${w.bank_name || 'PIX'}`,
      status: w.status,
    }));
    const fromA = anticipations.map(a => ({
      id: a.id,
      kind: 'anticipation',
      date: a.created_date,
      amount: a.amount,
      label: 'Antecipação programada',
      status: a.status,
    }));

    // Mock fallback if empty
    if (fromW.length === 0 && fromA.length === 0) {
      return [
        { id: 'w1', kind: 'withdrawal', date: addDays(today, 1).toISOString(), amount: 5000, label: 'Saque Itaú', status: 'processing' },
        { id: 'a1', kind: 'anticipation', date: addDays(today, 3).toISOString(), amount: 12500, label: 'Antecipação 8 parcelas', status: 'completed' },
        { id: 'w2', kind: 'withdrawal', date: addDays(today, 5).toISOString(), amount: 3200, label: 'Saque Bradesco', status: 'pending' },
        { id: 'w3', kind: 'withdrawal', date: addDays(today, 10).toISOString(), amount: 8000, label: 'Saque programado', status: 'pending' },
      ];
    }
    return [...fromW, ...fromA].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [withdrawals, anticipations, today]);

  const getDayPosition = (date) => {
    const d = differenceInDays(new Date(date), today);
    return Math.max(0, Math.min(100, (d / horizon) * 100));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-indigo-600" />
            <CardTitle className="text-base">Compromissos Financeiros</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px]">Próximos {horizon}d</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Timeline scale */}
        <div className="relative h-6 mb-1">
          <div className="absolute inset-x-0 top-1/2 h-px bg-slate-200" />
          {[0, 7, 14].map(d => {
            const date = addDays(today, d);
            return (
              <div
                key={d}
                className="absolute top-0 -translate-x-1/2 text-[10px] text-slate-500"
                style={{ left: `${(d / horizon) * 100}%` }}
              >
                <div className="h-2 w-px bg-slate-300 mx-auto mb-0.5" />
                {d === 0 ? 'Hoje' : format(date, 'dd/MM')}
              </div>
            );
          })}
        </div>

        {/* Events */}
        <div className="space-y-2">
          {events.slice(0, 6).map(ev => {
            const days = differenceInDays(new Date(ev.date), today);
            if (days > horizon || days < 0) return null;
            const Icon = ev.kind === 'anticipation' ? Zap : ArrowUpFromLine;
            const color = ev.kind === 'anticipation' ? 'bg-purple-500' : 'bg-blue-500';
            return (
              <div key={ev.id} className="relative">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-white flex-shrink-0`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="text-xs font-medium truncate">{ev.label}</span>
                    <span className="text-xs font-bold whitespace-nowrap ml-2">{fmtBRL(ev.amount)}</span>
                  </div>
                </div>
                <div className="ml-8 relative h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full ${color} rounded-full`}
                    style={{ left: `${getDayPosition(ev.date)}%`, width: '4px' }}
                  />
                </div>
                <div className="ml-8 mt-0.5 text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {format(new Date(ev.date), "d 'de' MMM", { locale: ptBR })} • em {days}d
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}