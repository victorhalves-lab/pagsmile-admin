import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const reasons = [
  { reason: 'Saldo insuficiente', count: 142, pct: 38, recovery: 65 },
  { reason: 'Cartão recusado', count: 98, pct: 26, recovery: 35 },
  { reason: 'Cartão expirado', count: 56, pct: 15, recovery: 88 },
  { reason: 'Antifraude', count: 42, pct: 11, recovery: 18 },
  { reason: 'Outros', count: 38, pct: 10, recovery: 22 },
];

export default function RecurrenceFailureBreakdown() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Motivos de falha & taxa de recovery</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {reasons.map((r, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <p className="w-40 font-medium">{r.reason}</p>
              <div className="flex-1"><Progress value={r.pct} className="h-1.5" /></div>
              <span className="text-slate-500 w-16 text-right">{r.count} ({r.pct}%)</span>
              <Badge variant="outline" className={`text-[9px] ${r.recovery > 60 ? 'text-emerald-700 border-emerald-300' : r.recovery > 30 ? 'text-amber-700 border-amber-300' : 'text-red-700 border-red-300'}`}>
                {r.recovery}% recovery
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}