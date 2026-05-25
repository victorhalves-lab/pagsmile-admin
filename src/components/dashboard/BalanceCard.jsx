import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Wallet, Clock, Lock, ArrowUpRight, Eye, EyeOff, FileText } from 'lucide-react';

/**
 * BalanceCard — DS oficial.
 * Hero card navy gradient (V8 BOLD #1 / dark variant) com:
 *  - eyebrow mono glow
 *  - número JetBrains Mono grande
 *  - 3 sub-cards glass para Disponível / A receber / Bloqueado
 *  - growth pill mono
 */
export default function BalanceCard({
  available = 0,
  pending = 0,
  blocked = 0,
  className,
}) {
  const [showValues, setShowValues] = useState(true);

  const fmt = (v) => {
    if (!showValues) return '••••••';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(v || 0);
  };

  const total = available + pending + blocked;

  const items = [
    {
      label: 'Disponível',
      value: available,
      icon: Wallet,
      tone: 'mint',
    },
    {
      label: 'A receber',
      value: pending,
      icon: Clock,
      tone: 'glow',
    },
    {
      label: 'Bloqueado',
      value: blocked,
      icon: Lock,
      tone: 'warn',
    },
  ];

  return (
    <div className={cn('ds-hero-card dark', className)}>
      {/* TOP ROW: eyebrow + actions */}
      <div className="relative flex items-center justify-between flex-wrap gap-3 mb-5">
        <div className="flex items-center gap-3">
          <span className="eyebrow">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--pag-glow-500)] shadow-[0_0_8px_var(--pag-glow-500)]" />
            Saldo total · tempo real
          </span>
          <button
            type="button"
            onClick={() => setShowValues(!showValues)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 grid place-items-center text-white/80 transition-colors"
            aria-label="alternar visibilidade"
          >
            {showValues ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-[var(--pag-glow-500)] hover:bg-[var(--pag-glow-600)] text-[var(--pag-blue-900)] font-bold h-9 px-4 shadow-[0_6px_18px_-4px_rgba(92,247,207,0.55)]"
          >
            <ArrowUpRight className="w-4 h-4 mr-1.5" strokeWidth={2.5} />
            Solicitar saque
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white font-medium h-9 px-3 bg-transparent backdrop-blur-sm"
          >
            <FileText className="w-4 h-4 mr-1.5" />
            Ver extrato
          </Button>
        </div>
      </div>

      {/* BIG VALUE */}
      <div className="relative mb-6">
        <div className="ds-num ds-num-xl on-dark">
          <span className="ccy">R$</span>
          {fmt(total).replace('R$', '').trim()}
        </div>
      </div>

      {/* 3 SUB-CARDS glass */}
      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/[0.16] p-4 transition-colors hover:bg-white/[0.12]"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={cn(
                  'w-9 h-9 rounded-xl grid place-items-center',
                  item.tone === 'mint' && 'bg-[var(--pag-mint-500)]/20 text-[var(--pag-glow-500)] border border-[var(--pag-mint-500)]/30',
                  item.tone === 'glow' && 'bg-[var(--pag-glow-500)]/16 text-[var(--pag-glow-500)] border border-[var(--pag-glow-500)]/30',
                  item.tone === 'warn' && 'bg-amber-400/14 text-amber-300 border border-amber-400/24'
                )}
              >
                <item.icon className="w-4 h-4" strokeWidth={2} />
              </div>
              <span
                className={cn(
                  'font-mono text-[10px] uppercase tracking-[0.14em] font-bold px-2 py-0.5 rounded-md border',
                  item.tone === 'mint' && 'bg-[var(--pag-glow-500)]/16 text-[var(--pag-glow-500)] border-[var(--pag-glow-500)]/30',
                  item.tone === 'glow' && 'bg-[var(--pag-glow-500)]/16 text-[var(--pag-glow-500)] border-[var(--pag-glow-500)]/30',
                  item.tone === 'warn' && 'bg-amber-400/14 text-amber-300 border-amber-400/24'
                )}
              >
                {item.label}
              </span>
            </div>
            <div className="ds-num ds-num-md on-dark">
              {fmt(item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}