import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { cn } from '@/lib/utils';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { PulseCard, PulsePill } from '@/components/pulse';

export default function ReceivablesBreakdown({ data = {} }) {
  const fmt = (v) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL', maximumFractionDigits: 0,
    }).format(v || 0);

  const buckets = [
    { id: 'd1', label: 'D+1', sub: 'Próximas 24h', value: data.d1 ?? 18420, tone: 'mint', bar: '#2bc196' },
    { id: 'd7', label: 'D+7', sub: 'Esta semana', value: data.d7 ?? 47830, tone: 'info', bar: '#3b82f6' },
    { id: 'd30', label: 'D+30', sub: 'Próximos 30 dias', value: data.d30 ?? 125640, tone: 'purple', bar: '#8b5cf6' },
    { id: 'd30p', label: 'D+30+', sub: 'Mais de 30 dias', value: data.d30p ?? 38990, tone: 'amber', bar: '#f5b942' },
  ];

  const total = buckets.reduce((s, b) => s + (b.value || 0), 0);

  return (
    <PulseCard
      title={
        <>
          <Calendar className="w-4 h-4 text-[#2bc196]" />
          A receber
          <span className="text-[11.5px] font-medium text-[#5a5a5a] ml-1">
            · total <span className="pulse-mono font-bold text-[#282828]">{fmt(total)}</span>
          </span>
        </>
      }
      right={
        <Link
          to={createPageUrl('ReceivablesAgenda')}
          className="text-[11px] font-semibold text-[#18866a] hover:underline inline-flex items-center gap-0.5"
        >
          Ver agenda <ChevronRight className="w-3 h-3" />
        </Link>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {buckets.map((b) => {
          const pct = total > 0 ? (b.value / total) * 100 : 0;
          return (
            <Link
              key={b.id}
              to={`${createPageUrl('ReceivablesAgenda')}?bucket=${b.id}`}
              className={cn('pulse-kpi is-compact transition-all hover:-translate-y-0.5', `is-glow-${b.tone}`)}
            >
              <div className="flex items-center justify-between">
                <PulsePill tone={b.tone} size="xs">{b.label}</PulsePill>
                <Clock className="w-3.5 h-3.5 text-[#888]" />
              </div>
              <p className="pulse-mono font-bold text-[#282828] text-[18px] leading-tight">
                {fmt(b.value)}
              </p>
              <p className="text-[10.5px] text-[#888]">{b.sub}</p>
              <div className="h-1 bg-[#ededed] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: b.bar }}
                />
              </div>
              <p className="pulse-mono text-[10px] text-[#888]">{pct.toFixed(0)}% do total</p>
            </Link>
          );
        })}
      </div>
    </PulseCard>
  );
}