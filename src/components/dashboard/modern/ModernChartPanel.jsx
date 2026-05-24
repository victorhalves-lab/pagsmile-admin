import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Painel de gráfico moderno dark · estilo print de referência
 * - Container dark com border sutil
 * - Label mono no canto superior esquerdo
 * - Indicador colorido no canto superior direito (R$ REAL, QTD TRANSAÇÕES, etc)
 * - Área de plot com label de horas embaixo (estilo timeline)
 */
export default function ModernChartPanel({
  label,
  indicator,           // { label: 'R$ REAL', color: '#00c194' }
  hours = ['03h', '05h', '07h', '09h', '11h', '13h', '15h', '17h', '19h', '21h', '23h'],
  children,
  className,
  height = 240,
}) {
  return (
    <div
      className={cn(
        'bg-[#161616] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden',
        className
      )}
    >
      {/* Header: label mono + indicador */}
      <div className="flex items-start justify-between mb-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-white/50">
          {label}
        </p>
        {indicator && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: indicator.color }}
            />
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-white/60">
              {indicator.label}
            </span>
          </div>
        )}
      </div>

      {/* Área do gráfico */}
      <div style={{ height }} className="flex flex-col">
        <div className="flex-1 min-h-0">{children}</div>

        {/* Hours bar */}
        <div className="flex justify-between mt-2 px-1">
          {hours.map((h) => (
            <span
              key={h}
              className="font-mono text-[9px] text-white/25 tabular-nums"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}