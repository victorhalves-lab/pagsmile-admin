import React from 'react';
import { cn } from '@/lib/utils';

/**
 * KPI Card moderno · estilo dark fintech 2026
 *
 * Variantes:
 *   - "filled"  → fundo verde sólido (#00c194), texto branco — destaque máximo
 *   - "dark"    → dark surface com borda sutil — neutro
 *   - "filled-dark" → verde escuro Pagsmile (#0f2b2b) → menos vibrante mas ainda destaque
 *   - "outline" → transparente com borda verde — alternativa elegante
 *
 * Layout: ícone topo + label mono uppercase + número HUGE
 */
export default function ModernKpiCard({
  label,
  value,
  hint,
  icon: Icon,
  variant = 'dark',
  trend,         // { value: 12.5, direction: 'up' | 'down' }
  onClick,
  className,
}) {
  const variants = {
    filled: {
      bg: 'bg-[#00c194]',
      label: 'text-white/80',
      value: 'text-white',
      hint: 'text-white/70',
      iconBg: 'bg-white/15',
      iconColor: 'text-white',
      glow: 'shadow-[0_8px_40px_-12px_rgba(0,193,148,0.55)]',
    },
    'filled-dark': {
      bg: 'bg-[#0f2b2b]',
      label: 'text-[#00c194]',
      value: 'text-white',
      hint: 'text-white/50',
      iconBg: 'bg-[#00c194]/15',
      iconColor: 'text-[#00c194]',
      glow: '',
    },
    dark: {
      bg: 'bg-[#161616] border border-white/[0.06]',
      label: 'text-white/40',
      value: 'text-white',
      hint: 'text-white/40',
      iconBg: 'bg-white/[0.04]',
      iconColor: 'text-white/50',
      glow: '',
    },
    outline: {
      bg: 'bg-transparent border border-[#00c194]/30',
      label: 'text-[#00c194]',
      value: 'text-white',
      hint: 'text-white/50',
      iconBg: 'bg-[#00c194]/10',
      iconColor: 'text-[#00c194]',
      glow: '',
    },
  };

  const v = variants[variant] || variants.dark;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-2xl p-5 text-left transition-all hover:scale-[1.01] hover:brightness-110 w-full',
        v.bg,
        v.glow,
        className
      )}
    >
      {/* Ícone topo centralizado/circular como no print */}
      {Icon && (
        <div className="flex justify-center mb-4">
          <div
            className={cn(
              'w-11 h-11 rounded-full flex items-center justify-center',
              v.iconBg
            )}
          >
            <Icon className={cn('w-5 h-5', v.iconColor)} weight="duotone" />
          </div>
        </div>
      )}

      {/* Label mono uppercase */}
      <p
        className={cn(
          'text-center font-mono text-[10px] uppercase tracking-[0.18em] font-semibold mb-2',
          v.label
        )}
      >
        {label}
      </p>

      {/* Número HUGE */}
      <p
        className={cn(
          'text-center font-mono font-bold text-[32px] leading-none tracking-tight tabular-nums',
          v.value
        )}
      >
        {value}
      </p>

      {/* Hint + trend */}
      {(hint || trend) && (
        <div className="flex items-center justify-center gap-2 mt-3">
          {trend && (
            <span
              className={cn(
                'font-mono text-[11px] font-bold tabular-nums',
                trend.direction === 'up' ? 'text-[#5cf7cf]' : 'text-red-400'
              )}
            >
              {trend.direction === 'up' ? '▲' : '▼'} {Math.abs(trend.value).toFixed(1)}%
            </span>
          )}
          {hint && <span className={cn('text-xs', v.hint)}>{hint}</span>}
        </div>
      )}
    </button>
  );
}