import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

const insights = [
  { type: 'opportunity', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', text: 'Lojista usando intensivamente o produto (15 antecipações nos últimos 30 dias) — oportunidade Customer Success oferecer migração para antecipação automática' },
  { type: 'risk', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50', text: 'Detectado 1 recebível em chargeback dentro do conjunto antecipado — pode afetar liquidação' },
  { type: 'tip', icon: Lightbulb, color: 'text-blue-600', bg: 'bg-blue-50', text: 'Próxima janela ótima de antecipação estimada em 7 dias (recebíveis com prazo médio menor)' },
];

export default function AnticipationInsightsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`p-3 rounded-lg ${item.bg} flex gap-2 text-sm`}>
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.color}`} />
              <span className="text-slate-700 dark:text-slate-200">{item.text}</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}