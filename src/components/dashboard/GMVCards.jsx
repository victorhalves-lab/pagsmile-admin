import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
              <div className={cn(
                "bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all cursor-pointer",
                metric.highlight && "ring-2 ring-[#00D26A]/20"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {formatCurrency(metric.value)}
                    </p>
                  </div>
                </div>

                {/* Change Indicator */}
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-semibold",
                    metric.change > 0 ? 'text-emerald-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-500'
                  )}>
                    {metric.change > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : metric.change < 0 ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {formatPercentage(metric.change)}
                  </span>
                  <span className="text-xs text-gray-400">{metric.subtitle}</span>
                </div>

                {/* Projection */}
                {metric.projection && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Projeção do mês: <span className="font-semibold text-gray-700">{formatCurrency(metric.projection)}</span>
                    </p>
                  </div>
                )}

                {/* Mini Sparkline */}
                {metric.showSparkline && (
                  <div className="mt-3 h-8">
                    <div className="flex items-end justify-between h-full gap-0.5">
                      {[45, 52, 48, 61, 55, 67, 72].map((val, idx) => (
                        <div
                          key={idx}
                          className="bg-[#00D26A]/30 rounded-t flex-1"
                          style={{ height: `${(val / 72) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {metric.cardBreakdown && (
                <div className="space-y-1">
                  <p className="text-xs">Breakdown:</p>
                  <p className="text-xs">Cartão: {formatCurrency(metric.cardBreakdown.card)}</p>
                  <p className="text-xs">Pix: {formatCurrency(metric.cardBreakdown.pix)}</p>
                </div>
              )}
              {!metric.cardBreakdown && (
                <p className="text-xs">Click para ver detalhes</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}