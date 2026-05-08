import React from 'react';
import { Clock, Zap, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Recomendação prescritiva de retry: quando, como, com que probabilidade.
 * DIFERENCIAL — Stripe só tem "Smart Retries" automático, sem explicar nem deixar editar.
 */
export default function RetryRecommendationCard() {
  const recs = [
    {
      reason: 'Erro do emissor (cód 91)',
      count: 47,
      delay: '2h',
      successProb: 68,
      method: 'Cartão',
      action: 'Reprocessar via Cielo',
    },
    {
      reason: 'NSF (cód 51)',
      count: 23,
      delay: '24h-72h',
      successProb: 28,
      method: 'PIX',
      action: 'Oferecer PIX (5% off)',
    },
    {
      reason: 'Limite excedido',
      count: 18,
      delay: '5 dias',
      successProb: 35,
      method: 'Parcelado',
      action: 'Sugerir 3x sem juros',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/10 dark:to-blue-900/10 rounded-xl border border-emerald-200 dark:border-emerald-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-semibold">Recomendações prescritivas de retry</h4>
        </div>
        <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
          IA
        </span>
      </div>

      <div className="space-y-2">
        {recs.map((r, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-100 dark:border-slate-700">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="text-xs font-semibold">{r.reason}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  <strong className="text-slate-700 dark:text-slate-300">{r.count}</strong> transações elegíveis
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span className="text-sm font-bold text-emerald-600">{r.successProb}%</span>
                </div>
                <p className="text-[10px] text-slate-500">prob. sucesso</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-[10px] text-slate-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Esperar {r.delay}
                </span>
                <span>→ {r.method}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                onClick={() => toast.success(`Aplicando: ${r.action}`)}
              >
                {r.action}
                <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}