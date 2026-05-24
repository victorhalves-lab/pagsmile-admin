import React from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

/**
 * Hero do dashboard moderno · estilo dark fintech 2026
 * - Greeting "Seja Bem-Vindo" com palavra-destaque
 * - Subtítulo discreto
 * - Pills HOJE/SEMANA/MÊS no canto direito
 * - Search inline
 */
const periods = [
  { key: '24h', label: 'Hoje' },
  { key: '7d', label: 'Semana' },
  { key: '30d', label: 'Mês' },
];

export default function ModernDashboardHero({
  userName = 'B4kpay',
  period,
  onPeriodChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar por ID, Nome ou E2E',
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      {/* Esquerda: greeting */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
          Seja Bem-<span className="text-[#00c194]">Vindo</span>
        </h1>
        <p className="text-sm text-white/50 mt-1">
          {userName} · intermediações de pagamentos
        </p>
      </div>

      {/* Direita: pills + search */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Period pills */}
        <div className="inline-flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-full p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => onPeriodChange?.(p.key)}
              className={cn(
                'px-5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all',
                period === p.key
                  ? 'bg-[#00c194] text-white shadow-[0_0_24px_-6px_rgba(0,193,148,0.6)]'
                  : 'text-white/60 hover:text-white'
              )}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlass
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
            weight="bold"
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="bg-white/[0.04] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 w-[280px] focus:outline-none focus:border-[#00c194]/40 focus:bg-white/[0.06] transition-all"
          />
        </div>
      </div>
    </div>
  );
}