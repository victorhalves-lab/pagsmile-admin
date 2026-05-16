import React from 'react';
import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonoNumber } from '@/components/ui/mono-number';

/**
 * Análise detalhada de recusas por bandeira do cartão.
 * V7: card branco com shadow canônica, sem gradientes.
 */
const BRANDS = [
  { brand: 'Visa', total: 5240, declined: 472, rate: 9.0, topReason: 'Saldo Insuficiente', delta: -1.2 },
  { brand: 'Mastercard', total: 4180, declined: 502, rate: 12.0, topReason: 'Fraude', delta: +0.8 },
  { brand: 'Elo', total: 1820, declined: 273, rate: 15.0, topReason: 'Cartão Inválido', delta: +2.1 },
  { brand: 'Amex', total: 612, declined: 110, rate: 18.0, topReason: 'Não Autorizado', delta: +3.5 },
  { brand: 'Hipercard', total: 384, declined: 84, rate: 21.9, topReason: 'Timeout Emissor', delta: +4.8 },
];

const BRAND_ACCENT = {
  visa: 'text-sky-700',
  mastercard: 'text-rose-700',
  elo: 'text-amber-700',
  amex: 'text-emerald-700',
  hipercard: 'text-slate-700',
};

export default function DeclineByBrand() {
  return (
    <div className="rounded-[14px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-v7-card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-slate-600 dark:text-slate-300" strokeWidth={1.75} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Recusas por Bandeira</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 mt-0.5">
              Performance · últimos 30 dias
            </p>
          </div>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 px-2 py-1 rounded-full">
          5 bandeiras
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500">
              <th className="text-left px-5 py-2.5 font-medium">Bandeira</th>
              <th className="text-right px-3 py-2.5 font-medium">Tentativas</th>
              <th className="text-right px-3 py-2.5 font-medium">Recusadas</th>
              <th className="text-right px-3 py-2.5 font-medium">Taxa</th>
              <th className="text-right px-3 py-2.5 font-medium">Δ vs mês</th>
              <th className="text-left px-5 py-2.5 font-medium">Motivo principal</th>
            </tr>
          </thead>
          <tbody>
            {BRANDS.map((b) => {
              const accent = BRAND_ACCENT[b.brand.toLowerCase()] || 'text-slate-700';
              const isWorse = b.delta > 0;
              return (
                <tr
                  key={b.brand}
                  className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-5 py-3">
                    <span className={cn('font-semibold', accent, 'dark:text-slate-200')}>{b.brand}</span>
                  </td>
                  <td className="text-right px-3 py-3">
                    <MonoNumber size="sm" className="text-slate-700 dark:text-slate-300">
                      {b.total.toLocaleString('pt-BR')}
                    </MonoNumber>
                  </td>
                  <td className="text-right px-3 py-3">
                    <MonoNumber size="sm" className="text-slate-700 dark:text-slate-300">
                      {b.declined.toLocaleString('pt-BR')}
                    </MonoNumber>
                  </td>
                  <td className="text-right px-3 py-3">
                    <span
                      className={cn(
                        'inline-block font-mono tabular-nums text-xs font-semibold px-2 py-0.5 rounded border',
                        b.rate > 20
                          ? 'text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/30 dark:text-rose-400'
                          : b.rate > 12
                          ? 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30 dark:text-amber-400'
                          : 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-400'
                      )}
                    >
                      {b.rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-right px-3 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 font-mono text-[11px] tabular-nums font-semibold',
                        isWorse
                          ? 'text-rose-700 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      )}
                    >
                      {isWorse ? (
                        <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                      ) : (
                        <TrendingDown className="w-3 h-3" strokeWidth={2.5} />
                      )}
                      {isWorse ? '+' : ''}
                      {b.delta.toFixed(1)}pp
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400 text-xs">{b.topReason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}