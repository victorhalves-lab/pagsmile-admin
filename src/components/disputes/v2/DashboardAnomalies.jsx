import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, AlertOctagon, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const anomalies = [
  { icon: TrendingUp, text: 'Ratio Visa subiu 0.15pp nas últimas 48h — investigar', impact: 'Alto', color: 'text-red-600' },
  { icon: AlertOctagon, text: 'BIN 4532XX teve 5 chargebacks hoje (média histórica: 0.3) — possível ataque', impact: 'Crítico', color: 'text-red-700' },
  { icon: Activity, text: 'Win rate caiu 5pp este mês no reason 4855 — revisar playbook', impact: 'Médio', color: 'text-amber-600' },
];

export default function DashboardAnomalies() {
  return (
    <Card className="border-amber-200 bg-amber-50/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Anomalias detectadas
          <Badge className="bg-amber-100 text-amber-700 border-0 text-[9px] ml-auto">{anomalies.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {anomalies.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-md bg-white">
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${a.color}`} />
              <p className="flex-1 text-slate-700">{a.text}</p>
              <Badge variant="outline" className="text-[9px] h-4">{a.impact}</Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}