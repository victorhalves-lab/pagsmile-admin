import React from 'react';
import { Sparkles, TrendingDown, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const anomalies = [
  { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100', text: 'Churn no plano Basic +35% nos últimos 7 dias', impact: 'Alto' },
  { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', text: 'Taxa de retry caiu 8pp em cartões Visa', impact: 'Médio' },
];

export default function SubscriptionsAnomalies() {
  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <p className="text-xs font-bold text-purple-900">Anomalias detectadas pela IA</p>
          <Badge className="bg-purple-100 text-purple-700 border-0 text-[9px]">{anomalies.length}</Badge>
        </div>
        <div className="space-y-1.5">
          {anomalies.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className={`w-6 h-6 rounded ${a.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-3 h-3 ${a.color}`} />
                </div>
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