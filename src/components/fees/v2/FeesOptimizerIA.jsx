import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingDown, ArrowRight, Lightbulb, Target, Zap } from 'lucide-react';

const RECOMMENDATIONS = [
  { id: 'pix-incentive', icon: Zap, title: 'Incentive PIX em vez de Crédito Parcelado', insight: '32% das suas vendas estão em parcelado 7-12x (custo 4.49%). Se 50% migrar para PIX (0.99%):', savings: 4280, confidence: 92, effort: 'Baixo', color: 'emerald' },
  { id: 'tier-upgrade', icon: Target, title: 'Upgrade para Plano Pro', insight: 'Seu volume mensal R$ 95k está perto do Tier Pro (R$ 100k). Faltam R$ 5k para -0.2pp em todas fees:', savings: 1900, confidence: 100, effort: 'Nenhum', color: 'blue' },
  { id: 'acquirer-mix', icon: TrendingDown, title: 'Otimize roteamento entre adquirentes', insight: 'Stone tem MDR 2.85% para Visa (vs Cielo 3.0%). Sistema pode rotear automaticamente:', savings: 1200, confidence: 85, effort: 'Nenhum', color: 'purple' },
  { id: 'chargeback-3ds', icon: Lightbulb, title: 'Habilite 3DS para reduzir chargebacks', insight: '30 chargebacks este mês × R$ 30 multa = R$ 900. 3DS reduz fraude em ~70%:', savings: 630, confidence: 78, effort: 'Médio', color: 'amber' },
];

const COLOR_MAP = {
  emerald: { bg: 'bg-emerald-50 border-emerald-200', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-900' },
  blue: { bg: 'bg-blue-50 border-blue-200', icon: 'bg-blue-100 text-blue-600', text: 'text-blue-900' },
  purple: { bg: 'bg-purple-50 border-purple-200', icon: 'bg-purple-100 text-purple-600', text: 'text-purple-900' },
  amber: { bg: 'bg-amber-50 border-amber-200', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-900' },
};

export default function FeesOptimizerIA() {
  const totalSavings = RECOMMENDATIONS.reduce((s, r) => s + r.savings, 0);

  return (
    <div className="space-y-3">
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-emerald-500/10">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-900">Cost Optimizer IA · Helena Analítica</p>
                <p className="text-xs text-slate-600">4 oportunidades de economia identificadas</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase">Economia mensal potencial</p>
              <p className="text-3xl font-bold text-emerald-600">R$ {totalSavings.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-slate-500">≈ R$ {(totalSavings * 12).toLocaleString('pt-BR')}/ano</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {RECOMMENDATIONS.map((r) => {
          const c = COLOR_MAP[r.color];
          const Icon = r.icon;
          return (
            <Card key={r.id} className={`border-2 ${c.bg}`}>
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${c.icon} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`text-sm font-bold ${c.text}`}>{r.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">{r.insight}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-base font-bold text-emerald-600">+R$ {r.savings.toLocaleString('pt-BR')}</p>
                        <p className="text-[9px] text-slate-500">/mês</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">Confiança:</span>
                        <Progress value={r.confidence} className="w-16 h-1" />
                        <span className="text-[10px] font-bold text-slate-700">{r.confidence}%</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">Esforço: {r.effort}</Badge>
                      <Button size="sm" variant="ghost" className="ml-auto h-6 text-[10px]">
                        Aplicar <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}