import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const mockForecasts = [
  { brand: 'Visa', current: 0.48, in30d: 0.55, in60d: 0.62, in90d: 0.68, threshold: 0.9, daysToThreshold: 78, trend: 'up' },
  { brand: 'Mastercard', current: 0.52, in30d: 0.58, in60d: 0.64, in90d: 0.70, threshold: 1.0, daysToThreshold: 95, trend: 'up' },
  { brand: 'Visa Fraud (VFMP)', current: 0.32, in30d: 0.30, in60d: 0.28, in90d: 0.25, threshold: 0.75, daysToThreshold: null, trend: 'down' },
  { brand: 'MC Fraud (EFM)', current: 0.18, in30d: 0.20, in60d: 0.22, in90d: 0.25, threshold: 0.5, daysToThreshold: 180, trend: 'up' },
];

export default function RatioForecastCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          Forecast de Ratios — Próximos 90 dias
          <Badge variant="outline" className="text-[10px] ml-auto bg-purple-50 text-purple-700 border-purple-200">
            IA preditiva
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mockForecasts.map((f, i) => {
            const TrendIcon = f.trend === 'up' ? TrendingUp : TrendingDown;
            const isCritical = f.daysToThreshold !== null && f.daysToThreshold < 60;
            return (
              <div key={i} className={cn(
                'p-3 rounded-lg border',
                isCritical ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'
              )}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold">{f.brand}</p>
                  <TrendIcon className={cn(
                    'w-3.5 h-3.5',
                    f.trend === 'up' ? 'text-red-600' : 'text-emerald-600'
                  )} />
                </div>
                <div className="grid grid-cols-4 gap-1 text-center mb-2">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">Hoje</p>
                    <p className="text-sm font-black">{f.current.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">+30d</p>
                    <p className="text-sm font-bold text-slate-700">{f.in30d.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">+60d</p>
                    <p className="text-sm font-bold text-slate-700">{f.in60d.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-slate-400">+90d</p>
                    <p className="text-sm font-bold text-slate-700">{f.in90d.toFixed(2)}%</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Threshold: <span className="font-bold">{f.threshold}%</span></span>
                  {f.daysToThreshold !== null && (
                    <span className={cn(
                      'font-bold flex items-center gap-1',
                      isCritical ? 'text-red-700' : 'text-amber-700'
                    )}>
                      {isCritical && <AlertTriangle className="w-3 h-3" />}
                      Atinge em ~{f.daysToThreshold}d
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}