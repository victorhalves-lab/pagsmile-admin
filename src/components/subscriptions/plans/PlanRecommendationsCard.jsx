import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const recos = [
  { text: 'Plano "Basic" tem churn 35% acima do esperado — considere ajustar preço ou benefícios', priority: 'Alto' },
  { text: '12 clientes do "Starter" usam +80% das features — candidatos a upgrade para "Pro"', priority: 'Médio' },
  { text: 'Adicionar plano anual com 15% desconto pode aumentar LTV em ~28%', priority: 'Médio' },
];

export default function PlanRecommendationsCard() {
  return (
    <Card className="border-purple-200 bg-purple-50/30">
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <p className="text-xs font-bold text-purple-900">Recomendações IA</p>
          <Badge className="bg-purple-100 text-purple-700 border-0 text-[9px]">{recos.length}</Badge>
        </div>
        <div className="space-y-1.5">
          {recos.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <ArrowRight className="w-3 h-3 text-purple-500 flex-shrink-0" />
              <p className="flex-1 text-slate-700 dark:text-slate-300">{r.text}</p>
              <Badge variant="outline" className="text-[9px] h-4">{r.priority}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}