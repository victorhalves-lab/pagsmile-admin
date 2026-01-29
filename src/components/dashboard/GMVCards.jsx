import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';

export default function GMVCards({ data = {}, loading = false }) {
  const formatCurrency = (value) => {
    if (loading) return '---';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(value || 0);
  };

  const formatPercentage = (value) => {
    const formatted = Math.abs(value).toFixed(1);
    return value >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const gmvMetrics = [
    {
      id: 'today',
      label: 'GMV Hoje',
      value: data.today || 0,
      change: data.todayChange || 0,
      subtitle: 'Atualizado em tempo real',
      cardBreakdown: { card: data.todayCard || 0, pix: data.todayPix || 0 }
    },
    {
      id: 'yesterday',
      label: 'GMV Ontem',
      value: data.yesterday || 0,
      change: data.yesterdayChange || 0,
      subtitle: 'Comparado com dia anterior',
      highlight: false
    },
    {
      id: 'last7days',
      label: 'GMV Últimos 7 Dias',
      value: data.last7days || 0,
      change: data.last7daysChange || 0,
      subtitle: 'Incluindo hoje',
      showSparkline: true
    },
    {
      id: 'currentMonth',
      label: 'GMV Mês Atual',
      value: data.currentMonth || 0,
      change: data.currentMonthChange || 0,
      subtitle: `${data.monthProgress || 0}% do mês decorrido`,
      projection: data.monthProjection || 0
    },
    {
      id: 'lastMonth',
      label: 'GMV Mês Anterior',
      value: data.lastMonth || 0,
      change: data.lastMonthChange || 0,
      subtitle: 'Mês completo',
      highlight: false
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {gmvMetrics.map((metric) => (
        <TooltipProvider key={metric.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Card className={cn(
                "cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-[var(--color-card-bg)] border-[var(--color-card-border)]",
                metric.highlight && "ring-2 ring-[#2bc196]/20"
              )}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                        {metric.label}
                      </p>
                      <p className="text-2xl font-black text-[var(--color-text-primary)] mt-2 tracking-tight">
                        {formatCurrency(metric.value)}
                      </p>
                    </div>
                  </div>

                  {/* Change Indicator */}
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-md",
                      metric.change > 0 ? 'text-[var(--color-success)] bg-[var(--color-success-bg)]' : metric.change < 0 ? 'text-[var(--color-error)] bg-[var(--color-error-bg)]' : 'text-[var(--color-text-tertiary)] bg-[var(--color-bg-secondary)]'
                    )}>
                      {metric.change > 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : metric.change < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : null}
                      {formatPercentage(metric.change)}
                    </span>
                    <span className="text-xs text-[var(--color-text-tertiary)] font-medium">{metric.subtitle}</span>
                  </div>

                  {/* Projection */}
                  {metric.projection && (
                    <div className="mt-3 pt-2 border-t border-[var(--color-border-light)]">
                      <p className="text-xs text-[var(--color-text-tertiary)]">
                        Projeção: <span className="font-bold text-[var(--color-text-secondary)]">{formatCurrency(metric.projection)}</span>
                      </p>
                    </div>
                  )}

                  {/* Mini Sparkline */}
                  {metric.showSparkline && (
                    <div className="mt-4 h-6 opacity-50">
                      <div className="flex items-end justify-between h-full gap-1">
                        {[45, 52, 48, 61, 55, 67, 72].map((val, idx) => (
                          <div
                            key={idx}
                            className="bg-[#2bc196] rounded-t-sm flex-1 opacity-80"
                            style={{ height: `${(val / 72) * 100}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              {metric.cardBreakdown && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold">Detalhamento:</p>
                  <p className="text-xs text-slate-300">Cartão: {formatCurrency(metric.cardBreakdown.card)}</p>
                  <p className="text-xs text-slate-300">Pix: {formatCurrency(metric.cardBreakdown.pix)}</p>
                </div>
              )}
              {!metric.cardBreakdown && (
                <p className="text-xs">Clique para ver detalhes</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}