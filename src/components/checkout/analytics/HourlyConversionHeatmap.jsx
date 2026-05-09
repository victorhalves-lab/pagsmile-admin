import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Mock heatmap data: 7 days x 24 hours, value 0-100 (conversion %)
const generate = () => {
  const data = [];
  for (let d = 0; d < 7; d++) {
    const row = [];
    for (let h = 0; h < 24; h++) {
      let base = 6;
      if (h >= 19 && h <= 22) base = 18; // peak evening
      if (h >= 12 && h <= 14) base = 12; // lunch
      if (h >= 0 && h <= 6) base = 2; // night
      if (d === 0 || d === 6) base *= 0.8; // weekends
      base += (Math.random() - 0.5) * 4;
      row.push(Math.max(0, base));
    }
    data.push(row);
  }
  return data;
};

const DATA = generate();

const getColor = (v) => {
  if (v < 3) return 'bg-slate-100';
  if (v < 6) return 'bg-emerald-100';
  if (v < 10) return 'bg-emerald-200';
  if (v < 14) return 'bg-emerald-400';
  if (v < 18) return 'bg-emerald-500';
  return 'bg-emerald-600';
};

export default function HourlyConversionHeatmap() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Heatmap: Hora × Dia da semana</CardTitle>
        <p className="text-xs text-slate-500">Quando seus clientes mais convertem</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Hour labels */}
            <div className="flex gap-0.5 ml-8 mb-1">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="w-[18px] text-center text-[9px] text-slate-400 font-mono">
                  {i % 3 === 0 ? i : ''}
                </div>
              ))}
            </div>
            {/* Rows */}
            {DAYS.map((day, d) => (
              <div key={d} className="flex items-center gap-0.5 mb-0.5">
                <div className="w-7 text-[10px] font-bold text-slate-600">{day}</div>
                <div className="ml-1 flex gap-0.5">
                  {DATA[d].map((v, h) => (
                    <div
                      key={h}
                      className={cn(
                        'w-[18px] h-5 rounded-sm cursor-pointer hover:ring-2 hover:ring-[#2bc196] hover:z-10 relative group',
                        getColor(v)
                      )}
                      title={`${day} ${h}h: ${v.toFixed(1)}%`}
                    >
                      <div className="hidden group-hover:block absolute z-20 top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded whitespace-nowrap">
                        {day} {h}h: {v.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <span>Menor</span>
            <div className="flex gap-0.5">
              {['bg-slate-100', 'bg-emerald-100', 'bg-emerald-200', 'bg-emerald-400', 'bg-emerald-500', 'bg-emerald-600'].map((c, i) => (
                <div key={i} className={cn('w-4 h-4 rounded-sm', c)} />
              ))}
            </div>
            <span>Maior</span>
          </div>
          <p className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-semibold">
            💡 Pico: Sex 21h (18.4% conversão) — agende campanhas para esses horários
          </p>
        </div>
      </CardContent>
    </Card>
  );
}