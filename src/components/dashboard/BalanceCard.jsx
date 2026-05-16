import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MonoNumber } from '@/components/ui/mono-number';
import {
  Wallet, Clock, Lock, ArrowUpRight, Eye, EyeOff, FileText,
} from 'lucide-react';

/**
 * BalanceCard — V7. Navy hero strip com saldo total + breakdown.
 * Padrão consistente com GMVCardConsolidated / ChartCard.
 */
export default function BalanceCard({
  available = 0,
  pending = 0,
  blocked = 0,
  className,
}) {
  const [showValues, setShowValues] = useState(true);

  const fmt = (v) => {
    if (!showValues) return '•••••••';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
  };

  const total = available + pending + blocked;

  const items = [
    { label: 'Disponível', value: available, icon: Wallet, accent: 'text-emerald-300' },
    { label: 'A receber', value: pending, icon: Clock, accent: 'text-amber-300' },
    { label: 'Bloqueado', value: blocked, icon: Lock, accent: 'text-rose-300' },
  ];

  return (
    <div
      className={cn(
        'rounded-card-v7 p-6 text-white relative overflow-hidden',
        'bg-slate-900 dark:bg-slate-950 border border-slate-800',
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Total */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
            <Wallet className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] font-medium text-white/55">
                Saldo total
              </span>
              <button
                className="text-white/40 hover:text-white transition-colors"
                onClick={() => setShowValues(!showValues)}
                aria-label="alternar visibilidade"
              >
                {showValues ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <MonoNumber size="hero" className="text-white tracking-tight">
              {fmt(total)}
            </MonoNumber>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex items-center gap-3 lg:gap-6 flex-wrap lg:flex-nowrap">
          {items.map((item, i) => (
            <React.Fragment key={item.label}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/10">
                  <item.icon className={cn('w-4 h-4', item.accent)} />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] font-medium text-white/50">
                    {item.label}
                  </p>
                  <MonoNumber size="base" className="block font-semibold text-white mt-0.5">
                    {fmt(item.value)}
                  </MonoNumber>
                </div>
              </div>
              {i < items.length - 1 && <div className="hidden lg:block w-px h-10 bg-white/10" />}
            </React.Fragment>
          ))}
        </div>

        {/* Ações */}
        <div className="flex gap-2 lg:flex-shrink-0">
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-9 px-3">
            <ArrowUpRight className="w-4 h-4 mr-1.5" />
            Solicitar saque
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white font-medium h-9 px-3 bg-transparent">
            <FileText className="w-4 h-4 mr-1.5" />
            Ver extrato
          </Button>
        </div>
      </div>
    </div>
  );
}