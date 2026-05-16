import React from 'react';
import { Button } from '@/components/ui/button';
import { MonoNumber } from '@/components/ui/mono-number';
import { Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

/**
 * AnticipationContextCard — V7. Recomendação de ação concreta.
 * Padrão consistente com GMVCardConsolidated / ChartCard.
 */
export default function AnticipationContextCard({
  receivableAmount = 212880,
  feePercentage = 1.99,
  netAmount,
}) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
    }).format(v || 0);

  const fee = (receivableAmount * feePercentage) / 100;
  const net = netAmount ?? receivableAmount - fee;

  return (
    <div className="rounded-card-v7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-v7-card p-5 h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
            <Zap className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] font-medium text-emerald-700 dark:text-emerald-400">
              Antecipação
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Disponível agora</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400">
          Elegível
        </span>
      </div>

      {/* Valor */}
      <div>
        <p className="text-[11px] text-slate-500 mb-1">Você pode antecipar até</p>
        <MonoNumber size="hero" className="text-slate-900 dark:text-white tracking-tight">
          {fmt(receivableAmount)}
        </MonoNumber>
      </div>

      {/* Métricas */}
      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-3 border-t border-slate-100 dark:border-slate-800">
        <span>
          Taxa{' '}
          <MonoNumber size="xs" className="font-semibold text-slate-900 dark:text-white">
            {feePercentage.toFixed(2)}%
          </MonoNumber>
        </span>
        <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
        <span>
          Você recebe{' '}
          <MonoNumber size="xs" className="font-semibold text-emerald-700 dark:text-emerald-400">
            {fmt(net)}
          </MonoNumber>{' '}
          hoje
        </span>
      </div>

      {/* CTA */}
      <Link to={createPageUrl('Anticipation')} className="block mt-auto">
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-9 w-full">
          Antecipar agora
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </Link>
    </div>
  );
}