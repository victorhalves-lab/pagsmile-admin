import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';

const reasons = [
  { reason: 'Preço muito alto', pct: 28, trend: 'up', delta: 3, quote: '"Achei caro pelo que oferece"' },
  { reason: 'Não está usando', pct: 22, trend: 'down', delta: -2, quote: '"Não consegui usar como esperava"' },
  { reason: 'Problemas técnicos', pct: 18, trend: 'up', delta: 5, quote: '"Sistema lento, instável"' },
  { reason: 'Foi para concorrente', pct: 15, trend: 'up', delta: 1, quote: '"Encontrei opção melhor"' },
  { reason: 'Faltam funcionalidades', pct: 10, trend: 'stable', delta: 0, quote: '"Não tem feature X"' },
  { reason: 'Outros', pct: 7, trend: 'down', delta: -1, quote: '—' },
];

export default function ChurnReasonsAdvanced() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Motivos de churn (com IA + voice of customer)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {reasons.map((r, i) => (
            <div key={i} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold">{r.reason}</p>
                  {r.trend === 'up' && <Badge className="bg-red-100 text-red-700 border-0 text-[9px]"><TrendingUp className="w-2.5 h-2.5 mr-0.5" />+{r.delta}pp</Badge>}
                  {r.trend === 'down' && <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px]"><TrendingDown className="w-2.5 h-2.5 mr-0.5" />{r.delta}pp</Badge>}
                  {r.trend === 'stable' && <Badge variant="outline" className="text-[9px]">estável</Badge>}
                </div>
                <span className="font-bold">{r.pct}%</span>
              </div>
              <Progress value={r.pct} className="h-1.5" />
              <p className="text-[10px] text-slate-500 italic mt-1">{r.quote}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}