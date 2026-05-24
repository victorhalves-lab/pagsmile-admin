import React from 'react';
import { TrendUp, TrendDown } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

/**
 * EditorialKpi · Pagsmile 2026
 * KPI card no estilo editorial fintech:
 * - Label mono uppercase tiny
 * - Número HUGE em JetBrains Mono tabular
 * - Variação em chip discreto (sem emoji)
 * - Variant "hero" usa gradient navy→verde-escuro com texto branco
 */
export default function EditorialKpi({
  label,
  value,
  change,           // ex: +12.5 ou -3.2 (em %)
  changeLabel,      // ex: "vs ontem"
  hint,             // texto pequeno abaixo do número
  variant = 'default', // 'default' | 'hero' | 'highlight'
  icon: Icon,
  className,
}) {
  const isPositive = typeof change === 'number' && change >= 0;
  const TrendIcon = isPositive ? TrendUp : TrendDown;

  const variantStyles = {
    default:
      'bg-white dark:bg-[#163838] border border-slate-200 dark:border-white/[0.06] text-pag-navy-900 dark:text-white',
    hero:
      'border border-[#00c194]/20 text-white',
    highlight:
      'bg-[#00c194]/8 dark:bg-[#00c194]/12 border border-[#00c194]/30 text-pag-navy-900 dark:text-white',
  };

  const heroStyle =
    variant === 'hero'
      ? {
          background:
            'linear-gradient(135deg, #002443 0%, #0f2b2b 100%)',
        }
      : {};

  return (
    <div
      className={cn(
        'rounded-2xl p-5 transition-all relative overflow-hidden',
        variantStyles[variant],
        className
      )}
      style={heroStyle}
    >
      {/* Header: label + ícone */}
      <div className="flex items-start justify-between mb-4">
        <p
          className={cn(
            'font-mono text-[10px] uppercase tracking-[0.18em] font-bold',
            variant === 'hero' ? 'text-[#5cf7cf]' : 'text-[#7a9b97]'
          )}
        >
          {label}
        </p>
        {Icon && (
          <Icon
            className={cn(
              'w-5 h-5',
              variant === 'hero' ? 'text-[#5cf7cf]/70' : 'text-[#00c194]'
            )}
            weight="duotone"
          />
        )}
      </div>

      {/* Valor principal */}
      <div className="num-large mb-2 leading-none">
        {value}
      </div>

      {/* Mudança + label */}
      {typeof change === 'number' && (
        <div className="flex items-center gap-2 mt-2">
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold',
              isPositive
                ? 'bg-[#00c194]/10 text-[#00c194]'
                : 'bg-red-500/10 text-red-500'
            )}
          >
            <TrendIcon className="w-3 h-3" weight="bold" />
            {isPositive ? '+' : ''}
            {change.toFixed(1)}%
          </span>
          {changeLabel && (
            <span
              className={cn(
                'font-mono text-[10px] uppercase tracking-wider',
                variant === 'hero' ? 'text-white/50' : 'text-[#7a9b97]'
              )}
            >
              {changeLabel}
            </span>
          )}
        </div>
      )}

      {hint && (
        <p
          className={cn(
            'text-xs mt-2',
            variant === 'hero' ? 'text-white/60' : 'text-slate-500 dark:text-slate-400'
          )}
        >
          {hint}
        </p>
      )}
    </div>
  );
}