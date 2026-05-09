import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, Brain, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MentorDerivedInsights({ totalCount = 0 }) {
  // Mock derived insights baseados no resultado filtrado
  const insights = [
    { icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', label: 'Aprovação atual', value: '94.2%', delta: '+1.8 p.p. vs hist.', trend: 'up' },
    { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', label: 'Chargeback ratio', value: '0.18%', delta: '+0.04 p.p.', trend: 'up_bad' },
    { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'Tempo médio proc.', value: '1.2s', delta: '-200ms vs ontem', trend: 'down_good' },
    { icon: TrendingDown, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20', label: 'Período vs anterior', value: '+12.4%', delta: 'TPV maior que semana anterior', trend: 'up' },
    { icon: Brain, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', label: 'Cluster fraude potencial', value: '3 grupos', delta: 'BIN 539XXX · 2h · R$50-90', trend: 'alert', highlight: true },
  ];

  return (
    <Card className="border-violet-200">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <p className="text-xs font-bold text-violet-900 dark:text-violet-200">Insights derivados Mentor sobre {totalCount.toLocaleString('pt-BR')} transações filtradas</p>
          <Badge className="text-[9px] bg-violet-200 text-violet-800 ml-auto">novo</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {insights.map((it, i) => (
            <div key={i} className={`p-2.5 rounded-lg border ${it.bg} ${it.highlight ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">{it.label}</p>
                <it.icon className={`w-3.5 h-3.5 ${it.color}`} />
              </div>
              <p className={`text-lg font-bold ${it.color}`}>{it.value}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">{it.delta}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}