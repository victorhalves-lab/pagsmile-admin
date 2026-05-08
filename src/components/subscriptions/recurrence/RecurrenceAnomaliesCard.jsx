import React from 'react';
import { Sparkles, TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const anomalies = [
  { icon: TrendingDown, text: 'Approval rate em recorrência caiu 6pp na última hora (Visa)', impact: 'Alto' },
  { icon: AlertCircle, text: '3 falhas consecutivas detectadas para BIN 411111 — possível rule update do banco', impact: 'Médio' },
];

export default function RecurrenceAnomaliesCard() {
  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <p className="text-xs font-bold text-amber-900">Anomalias em recorrência</p>
        </div>
        <div className="space-y-1.5">
          {anomalies.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <Icon className="w-3 h-3 text-amber-600 flex-shrink-0" />
                <p className="flex-1 text-slate-700 dark:text-slate-300">{a.text}</p>
                <Badge variant="outline" className="text-[9px] h-4">{a.impact}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}