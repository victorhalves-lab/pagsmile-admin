import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

export default function PaymentLinksInsightsPanel({ links = [] }) {
  const insights = [
    {
      icon: TrendingUp,
      color: 'emerald',
      title: 'Conversão melhorou +8% esta semana',
      desc: 'Top fator: PIX-first nos 3 links com maior tráfego.',
      cta: 'Aplicar a outros 5 links',
    },
    {
      icon: AlertTriangle,
      color: 'red',
      title: '3 links ativos sem venda há 7 dias',
      desc: '"Promo Maio", "Curso Beta", "Webinar Live". Possível causa: descrição vazia.',
      cta: 'Ver problemas',
    },
    {
      icon: Lightbulb,
      color: 'amber',
      title: 'Mobile: 68% do tráfego, 22% das vendas',
      desc: 'Otimizar checkout mobile pode aumentar receita em ~R$ 12k/mês.',
      cta: 'Ver sugestões',
    },
    {
      icon: Sparkles,
      color: 'blue',
      title: 'Top performer: "Curso XYZ"',
      desc: 'R$ 18k em 30d, 22% conversão. Replicar fórmula nos 4 cursos similares.',
      cta: 'Duplicar fórmula',
    },
  ];

  const colorMap = {
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20',
    red: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20',
    amber: 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20',
    blue: 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20',
  };

  return (
    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-50/40 to-transparent dark:from-blue-900/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          Insights cross-link da DIA
          <Badge className="bg-blue-500 text-white text-[9px] ml-1">IA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div key={i} className={`p-3 rounded-lg border ${colorMap[ins.color]} flex items-start gap-3`}>
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{ins.title}</p>
                <p className="text-xs opacity-80 mt-0.5">{ins.desc}</p>
              </div>
              <Button size="sm" variant="ghost" className="h-7 text-xs flex-shrink-0">
                {ins.cta} <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}