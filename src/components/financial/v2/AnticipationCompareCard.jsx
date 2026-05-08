import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Clock, Landmark, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

/**
 * Card comparativo Antecipar vs Aguardar vs Empréstimo.
 * Diferencial educativo — nenhum PSP brasileiro mostra isso.
 */
export default function AnticipationCompareCard({ amount = 10000, anticipationRate = 1.99, daysToWait = 15 }) {
  const anticipationCost = (amount * anticipationRate) / 100;
  const loanRate = 4.5; // Mock: taxa típica de capital de giro PJ
  const loanCost = (amount * loanRate * (daysToWait / 30)) / 100;

  const options = [
    {
      key: 'anticipate',
      label: 'Antecipar agora',
      icon: Zap,
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      ribbon: 'Recomendado',
      cost: anticipationCost,
      net: amount - anticipationCost,
      time: 'Imediato (1h)',
      pros: ['Caixa hoje', 'Sem dívida', 'Sem compromisso'],
    },
    {
      key: 'wait',
      label: 'Aguardar liquidação',
      icon: Clock,
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      cost: 0,
      net: amount,
      time: `${daysToWait} dias`,
      pros: ['Custo zero', 'Sem fee'],
    },
    {
      key: 'loan',
      label: 'Empréstimo bancário',
      icon: Landmark,
      iconBg: 'bg-slate-100',
      iconText: 'text-slate-600',
      cost: loanCost,
      net: amount - loanCost,
      time: '3-5 dias úteis',
      pros: ['Mantém recebível', 'Pode rolar'],
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-purple-500" />
          Comparativo: o que fazer com {formatCurrency(amount)}?
        </CardTitle>
        <p className="text-xs text-slate-500 mt-1">
          Receberia em {daysToWait} dias se aguardasse. Veja as 3 opções:
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <div
                key={opt.key}
                className={cn(
                  'relative p-4 rounded-lg border-2 transition-all',
                  opt.ribbon
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                )}
              >
                {opt.ribbon && (
                  <span className="absolute -top-2 left-3 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded uppercase tracking-wide">
                    {opt.ribbon}
                  </span>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-md ${opt.iconBg}`}>
                    <Icon className={`w-4 h-4 ${opt.iconText}`} />
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800">{opt.label}</h4>
                </div>

                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Custo</span>
                    <span className={opt.cost > 0 ? 'text-red-600 font-medium' : 'text-emerald-600 font-medium'}>
                      {opt.cost > 0 ? `-${formatCurrency(opt.cost)}` : 'R$ 0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Você recebe</span>
                    <span className="font-bold text-slate-800">{formatCurrency(opt.net)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tempo</span>
                    <span className="text-slate-700 text-xs">{opt.time}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  {opt.pros.map((pro) => (
                    <div key={pro} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {pro}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}