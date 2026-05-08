import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Sparkles, ArrowRight, UserPlus, ShoppingBag, Repeat, Crown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomerJourneyMap({ customer }) {
  const stages = [
    { id: 'lead', label: 'Lead', icon: UserPlus, achieved: !!customer.email },
    { id: 'first_purchase', label: '1ª Compra', icon: ShoppingBag, achieved: !!customer.first_purchase_date },
    { id: 'recurring', label: 'Recorrente', icon: Repeat, achieved: (customer.total_purchases || 0) >= 2 },
    { id: 'engaged', label: 'Engajado', icon: Heart, achieved: (customer.total_purchases || 0) >= 5 },
    { id: 'vip', label: 'VIP', icon: Crown, achieved: customer.segment === 'vip' || (customer.total_spent || 0) > 5000 },
  ];

  const achievedCount = stages.filter(s => s.achieved).length;
  const currentStage = stages[Math.max(0, achievedCount - 1)];
  const nextStage = stages[achievedCount];

  // What's needed for next stage
  let nextActionText = '';
  if (nextStage) {
    if (nextStage.id === 'first_purchase') nextActionText = 'Aguardando primeira compra';
    else if (nextStage.id === 'recurring') nextActionText = 'Mais 1 compra para se tornar Recorrente';
    else if (nextStage.id === 'engaged') nextActionText = `Mais ${5 - (customer.total_purchases || 0)} compras para Engajado`;
    else if (nextStage.id === 'vip') {
      const spentDelta = 5000 - (customer.total_spent || 0);
      nextActionText = spentDelta > 0
        ? `Falta R$ ${spentDelta.toFixed(0)} em compras para VIP`
        : 'Pronto para promoção VIP';
    }
  }

  return (
    <Card className="p-5 bg-gradient-to-r from-slate-50 to-white border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-bold text-slate-900">Customer Journey Map</p>
          <p className="text-[11px] text-slate-500">Estágio atual: <span className="font-medium text-purple-700">{currentStage?.label}</span></p>
        </div>
        {nextStage && (
          <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200 gap-1">
            <Sparkles className="w-3 h-3" />
            Próximo: {nextStage.label}
          </Badge>
        )}
      </div>

      {/* Stage progression */}
      <div className="flex items-center justify-between gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isCurrent = idx === achievedCount - 1;
          const isPast = idx < achievedCount - 1;
          const isNext = idx === achievedCount;
          const isLast = idx === stages.length - 1;

          return (
            <React.Fragment key={stage.id}>
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center mb-1.5 border-2 transition-all',
                  isPast && 'bg-emerald-100 text-emerald-700 border-emerald-300',
                  isCurrent && 'bg-purple-100 text-purple-700 border-purple-400 ring-4 ring-purple-100 scale-110',
                  isNext && 'bg-white text-slate-400 border-slate-300 border-dashed animate-pulse',
                  !isPast && !isCurrent && !isNext && 'bg-slate-50 text-slate-400 border-slate-200'
                )}>
                  {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <p className={cn(
                  'text-[10px] font-medium text-center',
                  isCurrent ? 'text-purple-700 font-bold' :
                  isPast ? 'text-emerald-700' : 'text-slate-400'
                )}>
                  {stage.label}
                </p>
              </div>
              {!isLast && (
                <div className={cn(
                  'flex-1 h-0.5 mb-6 transition-all',
                  isPast ? 'bg-emerald-300' : 'bg-slate-200'
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Next milestone */}
      {nextStage && nextActionText && (
        <div className="mt-4 p-3 bg-purple-50 border border-purple-100 rounded-lg flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-purple-600" />
          <p className="text-xs text-purple-900 flex-1">
            <strong>Próximo passo:</strong> {nextActionText}
          </p>
        </div>
      )}
    </Card>
  );
}