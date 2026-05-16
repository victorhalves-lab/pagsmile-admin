import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PulsePill } from '@/components/pulse';
import {
  Wallet, Clock, Lock, ArrowUpRight, Eye, EyeOff, FileText,
} from 'lucide-react';

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
    { label: 'Disponível', value: available, icon: Wallet, accent: 'text-[#5cf7cf]' },
    { label: 'A receber', value: pending, icon: Clock, accent: 'text-[#f5b942]' },
    { label: 'Bloqueado', value: blocked, icon: Lock, accent: 'text-[#ff6b6b]' },
  ];

  return (
    <div
      className={cn(
        'rounded-[14px] p-6 text-white relative overflow-hidden',
        'bg-[#002443] border border-[#003459]',
        className
      )}
      style={{
        backgroundImage:
          'radial-gradient(800px 200px at 100% 0%, rgba(92,247,207,0.08), transparent 60%)',
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <Wallet className="w-5 h-5 text-[#2bc196]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="pulse-eyebrow !text-white/55">SALDO TOTAL</span>
              <PulsePill tone="mint" size="xs" dot pulse>LIVE</PulsePill>
              <button
                className="text-white/40 hover:text-white transition-colors"
                onClick={() => setShowValues(!showValues)}
                aria-label="alternar visibilidade"
              >
                {showValues ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="pulse-mono font-bold tracking-tight text-[36px] leading-none">
              {fmt(total)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6 flex-wrap lg:flex-nowrap">
          {items.map((item, i) => (
            <React.Fragment key={item.label}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center border border-white/10">
                  <item.icon className={cn('w-4 h-4', item.accent)} />
                </div>
                <div>
                  <p className="pulse-eyebrow !text-white/50 !text-[9.5px]">{item.label}</p>
                  <p className="pulse-mono text-base font-bold mt-0.5">{fmt(item.value)}</p>
                </div>
              </div>
              {i < items.length - 1 && <div className="hidden lg:block w-px h-10 bg-white/10" />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex gap-2 lg:flex-shrink-0">
          <Button size="sm" className="bg-[#2bc196] hover:bg-[#20a780] text-white font-semibold h-10 px-4">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Solicitar saque
          </Button>
          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white font-medium h-10 px-4 bg-transparent">
            <FileText className="w-4 h-4 mr-2" />
            Ver extrato
          </Button>
        </div>
      </div>
    </div>
  );
}