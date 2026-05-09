import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertTriangle, Users } from 'lucide-react';
import { fmt } from '@/components/mentor/mocks/channelParametersMock';

/**
 * Simula impacto financeiro estimado da mudança nos parâmetros — F1507
 */
export default function ChannelParametersImpactSimulator({ parameter, draft }) {
  if (!parameter || !draft) return null;

  const changes = [];

  if (draft.spread_anticipation != null && draft.spread_anticipation !== parameter.spread_anticipation) {
    const delta = draft.spread_anticipation - (parameter.spread_anticipation || 0);
    const monthlyImpact = (delta / 100) * (parameter.monthly_anticipation_volume || 0);
    changes.push({
      label: 'Spread antecipação',
      before: `${(parameter.spread_anticipation ?? 0).toFixed(2)}%`,
      after: `${draft.spread_anticipation.toFixed(2)}%`,
      monthlyImpact,
      isIncrease: delta > 0,
      adoptionRisk: delta > 0 ? `~${Math.abs(delta * 5).toFixed(1)}% redução adoção esperada` : null,
    });
  }

  if (draft.spread_process_price != null && draft.spread_process_price !== parameter.spread_process_price) {
    const delta = draft.spread_process_price - parameter.spread_process_price;
    const txMonthlyEstimate = (parameter.monthly_tpv || 0) / 100;
    const monthlyImpact = delta * txMonthlyEstimate;
    changes.push({
      label: 'Spread processamento',
      before: `R$ ${parameter.spread_process_price.toFixed(2)}/tx`,
      after: `R$ ${draft.spread_process_price.toFixed(2)}/tx`,
      monthlyImpact,
      isIncrease: delta > 0,
      adoptionRisk: null,
    });
  }

  if (draft.min_credit_due_days != null && draft.min_credit_due_days !== parameter.min_credit_due_days) {
    const delta = draft.min_credit_due_days - parameter.min_credit_due_days;
    changes.push({
      label: 'Prazo crédito',
      before: `D+${parameter.min_credit_due_days}`,
      after: `D+${draft.min_credit_due_days}`,
      monthlyImpact: 0,
      isIncrease: delta > 0,
      adoptionRisk: delta > 0 ? 'Reduz competitividade — possível churn' : 'Melhora competitividade — capital adicional necessário',
    });
  }

  if (draft.anticipation_enabled !== parameter.anticipation_enabled) {
    changes.push({
      label: 'Antecipação',
      before: parameter.anticipation_enabled ? 'Habilitada' : 'Desabilitada',
      after: draft.anticipation_enabled ? 'Habilitada' : 'Desabilitada',
      monthlyImpact: draft.anticipation_enabled
        ? ((parameter.spread_anticipation || draft.spread_anticipation || 0) / 100) * (parameter.monthly_tpv * 0.15)
        : -((parameter.spread_anticipation || 0) / 100) * (parameter.monthly_anticipation_volume || 0),
      isIncrease: draft.anticipation_enabled,
      adoptionRisk: !draft.anticipation_enabled ? 'Lojistas perdem capacidade — possível churn' : null,
    });
  }

  if (changes.length === 0) {
    return (
      <Card className="bg-slate-50 dark:bg-slate-900">
        <CardContent className="p-3 text-center text-xs text-slate-500">
          Nenhuma mudança detectada — simulação aparecerá conforme você editar.
        </CardContent>
      </Card>
    );
  }

  const totalImpact = changes.reduce((s, c) => s + (c.monthlyImpact || 0), 0);

  return (
    <Card className="border-blue-200 bg-blue-50/40 dark:bg-blue-900/10">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-blue-900 dark:text-blue-200">Simulação de impacto financeiro estimado</p>
          <div className="flex items-center gap-2 text-xs text-blue-800 dark:text-blue-300">
            <Users className="w-3.5 h-3.5" />
            {parameter.affected_merchants.toLocaleString('pt-BR')} lojistas afetados
          </div>
        </div>

        <div className="space-y-2">
          {changes.map((c, i) => (
            <div key={i} className="flex items-start justify-between gap-3 text-xs p-2 rounded bg-white dark:bg-slate-900 border border-blue-100">
              <div className="flex-1">
                <p className="font-semibold">{c.label}</p>
                <p className="text-slate-500">
                  <span className="line-through">{c.before}</span> → <strong className={c.isIncrease ? 'text-emerald-600' : 'text-red-600'}>{c.after}</strong>
                </p>
                {c.adoptionRisk && (
                  <p className="flex items-center gap-1 text-[10px] text-amber-700 mt-1">
                    <AlertTriangle className="w-3 h-3" />
                    {c.adoptionRisk}
                  </p>
                )}
              </div>
              {c.monthlyImpact !== 0 && (
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Impacto/mês</p>
                  <p className={`font-bold flex items-center gap-1 ${c.monthlyImpact > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {c.monthlyImpact > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {fmt(Math.abs(c.monthlyImpact))}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-blue-200 flex items-center justify-between">
          <p className="text-xs font-semibold text-blue-900 dark:text-blue-200">Impacto total estimado/mês</p>
          <p className={`text-lg font-bold ${totalImpact >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {totalImpact >= 0 ? '+' : ''}
            {fmt(totalImpact)}
          </p>
        </div>

        <p className="text-[10px] text-slate-500 italic">
          Estimativa baseada em volume histórico dos últimos 30 dias e elasticidade observada do canal.
        </p>
      </CardContent>
    </Card>
  );
}