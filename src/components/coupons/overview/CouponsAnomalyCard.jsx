import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

/**
 * Card de anomalias + recomendações IA cross-cupons.
 */
export default function CouponsAnomalyCard({ coupons }) {
  const insights = [
    {
      type: 'opportunity',
      icon: TrendingUp,
      color: 'emerald',
      title: 'Cupom BEMVINDO10 batendo meta',
      desc: '187 usos em 90 dias (74% do limite). Demanda forte — escalonar limite para 1000?',
      action: 'Escalonar',
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      color: 'amber',
      title: '3 cupons criados sem uso há 30+ dias',
      desc: 'DESATIVADO10, FLASH-X, TESTE2026 com < 5% utilização. Desperdício de planejamento.',
      action: 'Revisar',
    },
    {
      type: 'recommendation',
      icon: Lightbulb,
      color: 'blue',
      title: 'Próxima campanha sugerida: Recuperação',
      desc: 'Você não tem cupom ativo para abandono de carrinho. Perde ~R$ 12k/mês em recuperação possível.',
      action: 'Criar agora',
    },
  ];

  const colors = {
    emerald: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10',
    amber: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10',
    blue: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
  };

  const iconColors = {
    emerald: 'text-emerald-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
  };

  return (
    <Card className="border-[#2bc196]/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2bc196]" />
          Insights e Anomalias
          <Badge className="bg-[#2bc196]/10 text-[#2bc196] text-[9px] border-0">IA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((ins, i) => {
          const Icon = ins.icon;
          return (
            <div
              key={i}
              className={`p-3 border-l-4 rounded-r-lg ${colors[ins.color]}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColors[ins.color]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold">{ins.title}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{ins.desc}</p>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1">
                  {ins.action}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}