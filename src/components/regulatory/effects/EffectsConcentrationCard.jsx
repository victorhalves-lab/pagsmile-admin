import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency, EFFECT_TYPES } from '../mocks/urMock';

export default function EffectsConcentrationCard({ effects }) {
  const concentration = useMemo(() => {
    const map = {};
    effects.forEach((e) => {
      const key = e.counterparty?.id;
      if (!map[key]) map[key] = { name: e.counterparty.name, type: e.counterparty.type, count: 0, value: 0 };
      map[key].count += 1;
      map[key].value += e.value_affected;
    });
    return Object.values(map).sort((a, b) => b.value - a.value).slice(0, 8);
  }, [effects]);

  const totalValue = effects.reduce((s, e) => s + e.value_affected, 0);
  const top1Pct = totalValue > 0 ? (concentration[0]?.value / totalValue * 100).toFixed(1) : 0;
  const isHighConcentration = top1Pct > 30;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Concentração por Contraparte (Top 8)</span>
          {isHighConcentration && (
            <Badge className="bg-amber-100 text-amber-700 text-[9px] border-amber-300">
              <AlertTriangle className="w-2.5 h-2.5 mr-0.5" /> Concentração alta
            </Badge>
          )}
        </CardTitle>
        <p className="text-[10px] text-slate-500">
          Top contraparte concentra <strong>{top1Pct}%</strong> do valor afetado
        </p>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {concentration.map((c, i) => {
          const pct = totalValue > 0 ? (c.value / totalValue * 100) : 0;
          return (
            <div key={i} className="space-y-0.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="truncate flex-1 font-medium">
                  {i + 1}. {c.name}
                  <Badge variant="outline" className="ml-1 text-[9px]">{c.type}</Badge>
                </span>
                <span className="font-bold ml-2">{formatCurrency(c.value)}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${i === 0 && isHighConcentration ? 'bg-amber-500' : 'bg-violet-500'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-[9px] text-slate-500">{c.count} efeitos · {pct.toFixed(1)}%</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}