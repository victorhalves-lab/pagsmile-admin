import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles, ArrowRight, TrendingUp, AlertCircle, Lightbulb, ShieldAlert,
} from 'lucide-react';
import { calcRoi } from '../utils';

/**
 * Zona "Próximas ações sugeridas" no topo do detail.
 * Transforma a tela de info-pesada em acionável.
 */
export default function CouponNextActions({ coupon }) {
  const roi = calcRoi(coupon);
  const usagePct = coupon.usage_limit_total
    ? (coupon.times_used / coupon.usage_limit_total) * 100
    : null;

  const actions = [];

  if (usagePct != null && usagePct >= 80) {
    actions.push({
      icon: TrendingUp,
      color: 'emerald',
      title: 'Cupom esgotando rápido',
      desc: `Já em ${usagePct.toFixed(0)}% do limite. Demanda alta — escalonar?`,
      cta: 'Aumentar limite',
    });
  }
  if (roi >= 8 && coupon.status === 'active') {
    actions.push({
      icon: Sparkles,
      color: 'blue',
      title: 'ROI excelente — replicar?',
      desc: `${roi.toFixed(1)}x de retorno. Criar variante para A/B test ou estender campanha.`,
      cta: 'Criar variante',
    });
  }
  if (roi < 3 && coupon.times_used > 10) {
    actions.push({
      icon: AlertCircle,
      color: 'amber',
      title: 'ROI abaixo do esperado',
      desc: `Apenas ${roi.toFixed(1)}x. Testar outra audiência ou reduzir desconto.`,
      cta: 'Otimizar',
    });
  }
  if (coupon.status === 'active' && coupon.times_used === 0) {
    actions.push({
      icon: ShieldAlert,
      color: 'red',
      title: 'Cupom ativo sem uso',
      desc: 'Possível problema de divulgação. Verificar canais ou pausar.',
      cta: 'Diagnosticar',
    });
  }
  if (actions.length === 0) {
    actions.push({
      icon: Lightbulb,
      color: 'slate',
      title: 'Performance dentro do esperado',
      desc: 'Continue monitorando. Sem ação crítica recomendada.',
      cta: null,
    });
  }

  const colors = {
    emerald: 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10',
    blue: 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-900/10',
    amber: 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-900/10',
    red: 'border-l-red-500 bg-red-50/50 dark:bg-red-900/10',
    slate: 'border-l-slate-400 bg-slate-50/50 dark:bg-slate-900/10',
  };

  const iconColors = {
    emerald: 'text-emerald-600',
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    red: 'text-red-600',
    slate: 'text-slate-500',
  };

  return (
    <Card className="border-[#2bc196]/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2bc196]" />
          Próximas ações sugeridas
          <Badge className="bg-[#2bc196]/10 text-[#2bc196] text-[9px] border-0">IA</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className={`p-3 border-l-4 rounded-r-lg flex items-start gap-3 ${colors[a.color]}`}>
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColors[a.color]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{a.title}</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{a.desc}</p>
              </div>
              {a.cta && (
                <Button size="sm" variant="ghost" className="h-7 text-[10px] gap-1 flex-shrink-0">
                  {a.cta}
                  <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}