import React from 'react';
import { Card } from '@/components/ui/card';
import { TPV_BY_REGION } from './mocks/tpvMock';

export default function TPVRegionalHeatmap() {
  const max = Math.max(...TPV_BY_REGION.map(r => r.tpv));
  
  return (
    <Card className="p-4">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-3">🗺️ Distribuição Regional (Heatmap)</h3>
      <div className="space-y-2">
        {TPV_BY_REGION.map(r => {
          const intensity = r.tpv / max;
          const bgColor = `rgba(6, 182, 212, ${0.15 + intensity * 0.7})`;
          return (
            <div key={r.state} className="flex items-center gap-3">
              <div className="w-12 text-sm font-bold text-slate-700">{r.state}</div>
              <div className="flex-1 relative h-7 rounded-md overflow-hidden bg-slate-100">
                <div className="absolute inset-y-0 left-0 transition-all" style={{ width: `${intensity * 100}%`, backgroundColor: bgColor }}></div>
                <div className="absolute inset-0 flex items-center justify-between px-2 text-xs">
                  <span className="font-mono font-semibold text-slate-700">R$ {(r.tpv / 1_000_000).toFixed(1)}M</span>
                  <span className="text-slate-500">{r.share}% · {r.merchants} lojistas</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}