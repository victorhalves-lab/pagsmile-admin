import React from 'react';
import { ArrowUpRight, Wallet, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * PIX Out — controle de liquidez.
 * Mostra saldo disponível para envios, limite diário/mensal, próximos PIX OUT agendados.
 * DIFERENCIAL — Stripe nem tem essa modalidade no BR.
 */
export default function PixOutLiquidityCard() {
  const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

  const balance = 487320;
  const dailyLimit = 1000000;
  const dailyUsed = 312000;
  const monthlyLimit = 15000000;
  const monthlyUsed = 4200000;

  const dailyPct = (dailyUsed / dailyLimit) * 100;
  const monthlyPct = (monthlyUsed / monthlyLimit) * 100;

  const upcoming = [
    { time: 'Hoje 14:30', amount: 12500, recipient: 'Fornecedor ABC' },
    { time: 'Hoje 16:00', amount: 8900,  recipient: 'Folha de pagamento' },
    { time: 'Amanhã 09:00', amount: 35000, recipient: 'Repasse comissão' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <ArrowUpRight className="w-4 h-4 text-red-600" />
        <h4 className="text-sm font-semibold">PIX Out — Liquidez</h4>
      </div>

      <div className="rounded-lg bg-gradient-to-br from-slate-900 to-slate-700 p-3 text-white mb-3">
        <p className="text-[10px] uppercase tracking-wider opacity-70 flex items-center gap-1">
          <Wallet className="w-3 h-3" />
          Saldo disponível para envio
        </p>
        <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
      </div>

      <div className="space-y-2 mb-3">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Limite diário</span>
            <span className="font-medium">{formatCurrency(dailyUsed)} / {formatCurrency(dailyLimit)}</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", dailyPct > 80 ? "bg-red-500" : dailyPct > 60 ? "bg-amber-500" : "bg-emerald-500")}
                 style={{ width: `${dailyPct}%` }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-500">Limite mensal</span>
            <span className="font-medium">{formatCurrency(monthlyUsed)} / {formatCurrency(monthlyLimit)}</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={cn("h-full rounded-full", monthlyPct > 80 ? "bg-red-500" : monthlyPct > 60 ? "bg-amber-500" : "bg-emerald-500")}
                 style={{ width: `${monthlyPct}%` }} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Próximos PIX OUT</p>
          <Button variant="ghost" size="sm" className="text-xs h-6" onClick={() => toast.info('Agenda PIX aberta')}>
            Ver agenda
          </Button>
        </div>
        <div className="space-y-1.5">
          {upcoming.map((u, i) => (
            <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-medium">{u.recipient}</p>
                <p className="text-[10px] text-slate-500">{u.time}</p>
              </div>
              <span className="font-semibold text-red-600">{formatCurrency(u.amount)}</span>
            </div>
          ))}
        </div>
      </div>

      {dailyPct > 75 && (
        <div className="mt-3 flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <p>Você usou {dailyPct.toFixed(0)}% do limite diário. Solicite aumento se necessário.</p>
        </div>
      )}
    </div>
  );
}