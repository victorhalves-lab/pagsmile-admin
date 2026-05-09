import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { FileText, Receipt, ArrowDownUp } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Quick Actions complementares (não substitui as 4 ações originais do Hero).
 * Adiciona Pagar Boleto + Comprovantes + Transferir como ações úteis BaaS básico.
 */
export default function QuickActionsExtended() {
  const actions = [
    {
      icon: FileText,
      label: 'Pagar Boleto',
      sublabel: 'Em breve',
      page: 'IBHome',
      gradient: 'from-violet-500 to-violet-600',
      bgLight: 'bg-violet-50',
      textColor: 'text-violet-600',
      comingSoon: true,
    },
    {
      icon: Receipt,
      label: 'Comprovantes',
      sublabel: 'Central de PDFs',
      page: 'IBProofs',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: ArrowDownUp,
      label: 'Extrato',
      sublabel: 'Movimentações',
      page: 'IBExtract',
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div>
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        Outras Ações
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          const Wrapper = action.comingSoon ? 'div' : Link;
          const wrapperProps = action.comingSoon ? {} : { to: createPageUrl(action.page) };
          return (
            <Wrapper key={idx} {...wrapperProps}>
              <div className={cn(
                "p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden bg-white dark:bg-slate-900",
                action.comingSoon && "opacity-70 cursor-not-allowed hover:translate-y-0"
              )}>
                {action.comingSoon && (
                  <span className="absolute top-2 right-2 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase">
                    Em breve
                  </span>
                )}
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md mb-3", action.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-semibold text-sm text-slate-800 dark:text-white">{action.label}</p>
                <p className="text-[11px] text-slate-500">{action.sublabel}</p>
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
}