import React from 'react';
import { Footprints, Eye, ShoppingCart, CreditCard, CheckCircle2, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Jornada COMPLETA do cliente até esta transação.
 * Mostra: visitou site → adicionou ao carrinho → iniciou checkout → tentou pagar.
 * Diferencial — fecha o gap entre marketing/CRM e pagamento.
 */
export default function CustomerJourneyCard() {
  const steps = [
    { icon: Eye, label: 'Visitou produto', when: 'há 2 dias', detail: 'Origem: Instagram Ads', tone: 'slate' },
    { icon: ShoppingCart, label: 'Adicionou ao carrinho', when: 'há 1 dia', detail: 'Carrinho de R$ 247,00', tone: 'blue' },
    { icon: MousePointer, label: 'Iniciou checkout', when: 'há 4h', detail: 'Abandonou na tela de pagamento', tone: 'amber' },
    { icon: CreditCard, label: 'Tentou pagar (Visa ****4242)', when: 'agora', detail: 'Esta transação', tone: 'emerald', current: true },
    { icon: CheckCircle2, label: 'Aguardando confirmação', when: '—', detail: 'Próximo passo', tone: 'slate', future: true },
  ];

  const tones = {
    slate: 'bg-slate-100 text-slate-500 dark:bg-slate-800',
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Footprints className="w-4 h-4 text-emerald-600" />
        <h4 className="text-sm font-semibold">Jornada do cliente</h4>
      </div>

      <div className="space-y-0">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  tones[s.tone],
                  s.current && "ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900",
                  s.future && "opacity-40"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && <div className={cn("w-0.5 flex-1 my-1", s.future ? "bg-slate-200 dark:bg-slate-700 opacity-40" : "bg-slate-200 dark:bg-slate-700")} />}
              </div>
              <div className={cn("pb-4", isLast && "pb-0", s.future && "opacity-50")}>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold">{s.label}</p>
                  {s.current && (
                    <span className="text-[9px] uppercase font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      Atual
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500">{s.detail}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{s.when}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}