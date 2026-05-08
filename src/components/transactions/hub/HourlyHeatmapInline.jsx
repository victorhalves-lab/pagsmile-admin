import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

/**
 * Heatmap horário inline (24h × 7 dias) — colapsável.
 * Mostra concentração de transações por horário.
 */
export default function HourlyHeatmapInline() {
  const [open, setOpen] = useState(false);

  // Mock: 7 dias × 24 horas, valores 0-100
  const data = Array.from({ length: 7 }, (_, d) =>
    Array.from({ length: 24 }, (_, h) => {
      // padrão típico: pico 12h-22h, mais movimento dias úteis
      const baseHour = h >= 9 && h <= 22 ? 50 + Math.sin((h - 9) / 13 * Math.PI) * 40 : 10;
      const weekday = d >= 1 && d <= 5 ? 1.2 : 0.7;
      return Math.max(0, Math.min(100, Math.round(baseHour * weekday + (Math.random() * 20 - 10))));
    })
  );

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const colorFor = (v) => {
    if (v < 15) return 'bg-slate-100 dark:bg-slate-800';
    if (v < 30) return 'bg-emerald-100 dark:bg-emerald-900/30';
    if (v < 50) return 'bg-emerald-300 dark:bg-emerald-700/50';
    if (v < 70) return 'bg-emerald-500 dark:bg-emerald-600';
    return 'bg-emerald-700 dark:bg-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
      <button
        className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-xl"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#2bc196]" />
          <span className="text-sm font-medium">Heatmap de transações por horário</span>
          <span className="text-xs text-slate-500">— últimos 7 dias × 24h</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 overflow-x-auto">
          <TooltipProvider>
            <div className="inline-block min-w-full">
              <div className="flex gap-1 mb-1 ml-9">
                {Array.from({ length: 24 }, (_, h) => (
                  <div key={h} className="w-5 text-[9px] text-slate-400 text-center">
                    {h % 3 === 0 ? `${h}h` : ''}
                  </div>
                ))}
              </div>
              {data.map((row, d) => (
                <div key={d} className="flex items-center gap-1 mb-0.5">
                  <span className="w-8 text-[10px] text-slate-500 font-medium">{days[d]}</span>
                  {row.map((v, h) => (
                    <Tooltip key={h}>
                      <TooltipTrigger>
                        <div className={cn("w-5 h-5 rounded-sm cursor-pointer hover:ring-2 hover:ring-[#2bc196]", colorFor(v))} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{days[d]} {h}h: <strong>{v}</strong> transações</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2 ml-9">
                <span className="text-[10px] text-slate-400">menos</span>
                {[0, 20, 40, 60, 90].map(v => <div key={v} className={cn("w-3 h-3 rounded-sm", colorFor(v))} />)}
                <span className="text-[10px] text-slate-400">mais</span>
              </div>
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}