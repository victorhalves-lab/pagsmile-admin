import React from 'react';
import { cn } from '@/lib/utils';

/**
 * EditorialHeading · Pagsmile 2026
 * Headline ALL CAPS Inter Extrabold com palavra-destaque verde médio.
 *
 * Uso: <EditorialHeading text="PAINEL EXECUTIVO" accentIndex={1} />
 *      → renderiza "PAINEL EXECUTIVO" com "EXECUTIVO" em verde
 *
 * Ou: <EditorialHeading text={["MINHA", "CONTA"]} accentIndex={1} />
 *      → controle explícito das palavras
 */
export default function EditorialHeading({
  text,
  accentIndex = 1,
  size = 'lg',
  subtitle,
  eyebrow,
  className,
}) {
  const words = Array.isArray(text) ? text : String(text).split(/\s+/);

  const sizeMap = {
    sm: 'text-[18px] tracking-[-0.015em]',
    md: 'text-[22px] tracking-[-0.018em]',
    lg: 'text-[28px] sm:text-[32px] tracking-[-0.025em]',
    xl: 'text-[36px] sm:text-[44px] tracking-[-0.03em]',
  };

  return (
    <div className={cn('min-w-0', className)}>
      {eyebrow && (
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold text-[#00c194] mb-2">
          {eyebrow}
        </p>
      )}
      <h1
        className={cn(
          'font-extrabold uppercase leading-[1.05] text-pag-navy-900 dark:text-white',
          sizeMap[size]
        )}
      >
        {words.map((w, i) => (
          <React.Fragment key={i}>
            <span className={i === accentIndex ? 'text-[#00c194]' : ''}>
              {w}
            </span>
            {i < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </h1>
      {subtitle && (
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#7a9b97] dark:text-[#7a9b97] mt-2 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
}