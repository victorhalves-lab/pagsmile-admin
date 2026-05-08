import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame } from 'lucide-react';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { fmtCompact } from './utils';

// Receivables heatmap — Mercado Pago inspired (calendário mensal de $)
export default function ReceivablesHeatmap({ receivables = [] }) {
  const today = new Date();

  const heatmap = useMemo(() => {
    const start = startOfMonth(today);
    const end = endOfMonth(today);
    const days = eachDayOfInterval({ start, end });

    const dayMap = {};
    receivables.forEach(r => {
      if (!r.settlement_date) return;
      const k = format(new Date(r.settlement_date), 'yyyy-MM-dd');
      dayMap[k] = (dayMap[k] || 0) + (r.net_amount || 0);
    });

    // Mock fallback if empty
    if (Object.keys(dayMap).length === 0) {
      days.forEach(d => {
        const dow = d.getDay();
        if (dow === 0 || dow === 6) {
          dayMap[format(d, 'yyyy-MM-dd')] = Math.random() * 2000 + 500;
        } else {
          dayMap[format(d, 'yyyy-MM-dd')] = Math.random() * 12000 + 2000;
        }
      });
    }

    const values = Object.values(dayMap).filter(v => v > 0);
    const max = values.length > 0 ? Math.max(...values) : 1;
    return { days, dayMap, max };
  }, [receivables, today]);

  const getIntensity = (val) => {
    if (!val) return 0;
    return Math.min(1, val / heatmap.max);
  };

  const intensityColor = (i) => {
    if (i === 0) return 'bg-slate-50';
    if (i < 0.25) return 'bg-blue-100';
    if (i < 0.5) return 'bg-blue-200';
    if (i < 0.75) return 'bg-blue-400';
    return 'bg-blue-600 text-white';
  };

  // Pad start to align with weekday
  const firstDow = heatmap.days[0]?.getDay() || 0;
  const padding = Array(firstDow).fill(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" />
            <CardTitle className="text-base">Mapa de Calor — Recebíveis do Mês</CardTitle>
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full font-bold">{format(today, 'MMMM yyyy')}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-[10px] text-center text-slate-500 font-medium mb-1">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {padding.map((_, i) => <div key={`p-${i}`} />)}
          {heatmap.days.map(d => {
            const k = format(d, 'yyyy-MM-dd');
            const val = heatmap.dayMap[k] || 0;
            const intensity = getIntensity(val);
            const isToday = format(d, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
            return (
              <div
                key={k}
                className={`aspect-square rounded flex flex-col items-center justify-center text-[9px] cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${intensityColor(intensity)} ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                title={`${format(d, 'dd/MM')} — ${fmtCompact(val)}`}
              >
                <span className="font-bold">{format(d, 'd')}</span>
                {val > 0 && <span className="text-[8px] opacity-80">{fmtCompact(val).replace('R$', '')}</span>}
              </div>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t text-[10px] text-slate-500">
          <span>Menos</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded bg-slate-50" />
            <div className="w-3 h-3 rounded bg-blue-100" />
            <div className="w-3 h-3 rounded bg-blue-200" />
            <div className="w-3 h-3 rounded bg-blue-400" />
            <div className="w-3 h-3 rounded bg-blue-600" />
          </div>
          <span>Mais</span>
        </div>
      </CardContent>
    </Card>
  );
}