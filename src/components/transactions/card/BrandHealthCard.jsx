import React from 'react';
import { CreditCard, TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Saúde por bandeira com sparkline 24h embutida.
 * Diferencia rapidamente Visa/Master/Elo/Amex e mostra trending.
 */
export default function BrandHealthCard() {
  const brands = [
    { name: 'Visa',       rate: 89.2, trend: +1.2, vol: 412840, sparkline: [85, 87, 86, 88, 90, 89, 87, 89, 91, 90, 89, 92] },
    { name: 'Master',     rate: 86.7, trend: -0.8, vol: 298120, sparkline: [88, 87, 89, 87, 86, 85, 84, 86, 87, 86, 87, 87] },
    { name: 'Elo',        rate: 82.1, trend: +0.4, vol: 87340,  sparkline: [80, 81, 82, 83, 81, 82, 84, 83, 82, 81, 82, 82] },
    { name: 'Amex',       rate: 91.5, trend: +2.1, vol: 41200,  sparkline: [88, 89, 90, 91, 92, 91, 92, 93, 91, 92, 91, 92] },
    { name: 'Hipercard',  rate: 78.4, trend: -2.4, vol: 18900,  sparkline: [82, 81, 80, 79, 78, 77, 78, 79, 78, 77, 78, 78] },
  ];

  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v);

  const Sparkline = ({ data, color }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * 60},${20 - ((v - min) / range) * 18}`).join(' ');
    return (
      <svg width="60" height="20" className="flex-shrink-0">
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      </svg>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-semibold">Saúde por bandeira</h4>
        </div>
        <span className="text-[10px] text-slate-500 uppercase tracking-wide">Últimas 24h</span>
      </div>
      <div className="space-y-2">
        {brands.map(b => {
          const isUp = b.trend >= 0;
          const color = b.rate >= 85 ? '#10b981' : b.rate >= 75 ? '#f59e0b' : '#ef4444';
          return (
            <TooltipProvider key={b.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                    <span className="w-20 text-xs font-medium">{b.name}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${b.rate}%`, backgroundColor: color }} />
                      </div>
                      <Sparkline data={b.sparkline} color={color} />
                    </div>
                    <div className="text-right w-20">
                      <p className="text-sm font-bold" style={{ color }}>{b.rate}%</p>
                      <p className={cn("text-[10px] flex items-center gap-0.5 justify-end", isUp ? "text-emerald-600" : "text-red-600")}>
                        {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                        {Math.abs(b.trend)}pp
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Volume: <strong>{formatCurrency(b.vol)}</strong></p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}