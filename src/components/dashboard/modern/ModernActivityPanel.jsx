import React from 'react';
import { Link } from 'react-router-dom';
import { CaretRight, Clock, ArrowUpRight, ArrowDownLeft } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

/**
 * Painel "Últimas Operações" moderno dark
 * - Header com título mono + link "ver tudo"
 * - Lista de operações OU empty state com ícone clock
 */
export default function ModernActivityPanel({
  title = 'Últimas Operações',
  subtitle = 'Atividade recente da plataforma',
  items = [],
  emptyLabel = 'Nenhuma operação recente',
  seeAllHref,
  className,
}) {
  return (
    <div className={cn('flex flex-col gap-3 h-full', className)}>
      {/* Header */}
      <div>
        <Link
          to={seeAllHref || '#'}
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.18em] font-bold text-white hover:text-[#00c194] transition-colors"
        >
          {title}
          <CaretRight className="w-3 h-3" weight="bold" />
        </Link>
        <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>
      </div>

      {/* Lista ou empty */}
      <div className="bg-[#161616] border border-white/[0.06] rounded-2xl p-5 flex-1 min-h-[200px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-white/30" weight="duotone" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] font-semibold text-white/40">
              {emptyLabel}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 6).map((item, idx) => {
              const isIn = item.direction === 'in' || item.amount > 0;
              const Icon = isIn ? ArrowDownLeft : ArrowUpRight;
              return (
                <div
                  key={item.id || idx}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
                      isIn ? 'bg-[#00c194]/15' : 'bg-red-500/15'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4',
                        isIn ? 'text-[#00c194]' : 'text-red-400'
                      )}
                      weight="bold"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {item.label}
                    </p>
                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                      {item.subtitle}
                    </p>
                  </div>
                  <p
                    className={cn(
                      'font-mono text-sm font-bold tabular-nums',
                      isIn ? 'text-[#00c194]' : 'text-white/70'
                    )}
                  >
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}