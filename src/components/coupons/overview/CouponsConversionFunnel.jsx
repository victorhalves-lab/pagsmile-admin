import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter } from 'lucide-react';

/**
 * Funil "do cupom à conversão".
 */
export default function CouponsConversionFunnel({ coupons }) {
  const totalUsed = coupons.reduce((s, c) => s + c.times_used, 0);
  // Mock funnel
  const stages = [
    { label: 'Cupons emitidos', value: coupons.length * 50, color: '#a78bfa' },
    { label: 'Visualizados', value: Math.floor(coupons.length * 50 * 0.65), color: '#60a5fa' },
    { label: 'Aplicados ao carrinho', value: Math.floor(coupons.length * 50 * 0.42), color: '#34d399' },
    { label: 'Compras pagas', value: totalUsed, color: '#10b981' },
  ];

  const max = stages[0].value;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Funil de Conversão
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {stages.map((s, i) => {
          const pct = (s.value / max) * 100;
          const dropPct = i > 0 ? ((stages[i - 1].value - s.value) / stages[i - 1].value * 100).toFixed(0) : null;
          return (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium">{s.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{s.value.toLocaleString()}</span>
                  {dropPct != null && (
                    <span className="text-[10px] text-red-500">−{dropPct}%</span>
                  )}
                </div>
              </div>
              <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: s.color }}
                />
              </div>
            </div>
          );
        })}
        <p className="text-[10px] text-slate-500 mt-2">
          Conversão final: <strong>{((stages[3].value / stages[0].value) * 100).toFixed(1)}%</strong>
        </p>
      </CardContent>
    </Card>
  );
}