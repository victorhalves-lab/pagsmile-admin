import React from 'react';
import { cn } from '@/lib/utils';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  CalendarDays, 
  BarChart3, 
  Target,
  Sparkles,
  Zap
} from 'lucide-react';
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
      label: 'GMV HOJE',
      value: data.today || 0,
      change: data.todayChange || 0,
      subtitle: 'Tempo real',
      cardBreakdown: { card: data.todayCard || 0, pix: data.todayPix || 0 },
      icon: Zap,
      accentColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      iconColor: 'text-emerald-500'
    },
    {
      id: 'yesterday',
      label: 'GMV ONTEM',
      value: data.yesterday || 0,
      change: data.yesterdayChange || 0,
      subtitle: 'vs anterior',
      icon: Calendar,
      accentColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-500'
    },
    {
      id: 'last7days',
      label: 'GMV 7 DIAS',
      value: data.last7days || 0,
      change: data.last7daysChange || 0,
      subtitle: 'Incluindo hoje',
      showSparkline: true,
      icon: BarChart3,
      accentColor: 'text-violet-600',
      bgColor: 'bg-violet-50 dark:bg-violet-950/30',
      borderColor: 'border-violet-200 dark:border-violet-800',
      iconColor: 'text-violet-500'
    },
    {
      id: 'currentMonth',
      label: 'GMV MÊS ATUAL',
      value: data.currentMonth || 0,
      change: data.currentMonthChange || 0,
      subtitle: `${data.monthProgress || 0}% do mês`,
      projection: data.monthProjection || 0,
      icon: Target,
      accentColor: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-800',
      iconColor: 'text-amber-500'
    },
    {
      id: 'lastMonth',
      label: 'GMV MÊS ANTERIOR',
      value: data.lastMonth || 0,
      change: data.lastMonthChange || 0,
      subtitle: 'Completo',
      icon: CalendarDays,
      accentColor: 'text-slate-600',
      bgColor: 'bg-slate-50 dark:bg-slate-800/50',
      borderColor: 'border-slate-200 dark:border-slate-700',
      iconColor: 'text-slate-500'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {gmvMetrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <TooltipProvider key={metric.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className={cn(
                  "cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden",
                  metric.bgColor,
                  metric.borderColor,
                  "border"
                )}>
                  <CardContent className="p-4">
                    {/* Header with label and icon */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn("text-[10px] font-bold tracking-wider", metric.accentColor)}>
                        {metric.label}
                      </span>
                      <IconComponent className={cn("w-4 h-4", metric.iconColor)} />
                    </div>

                    {/* Value */}
                    <p className="text-xl font-bold text-slate-800 dark:text-white mb-2 truncate">
                      {formatCurrency(metric.value)}
                    </p>

                    {/* Change + Subtitle */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={cn(
                        "inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded",
                        metric.change > 0 
                          ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50' 
                          : metric.change < 0 
                            ? 'text-red-700 bg-red-100 dark:bg-red-900/50' 
                            : 'text-slate-600 bg-slate-100 dark:bg-slate-700'
                      )}>
                        {metric.change > 0 ? (
                          <TrendingUp className="w-2.5 h-2.5" />
                        ) : metric.change < 0 ? (
                          <TrendingDown className="w-2.5 h-2.5" />
                        ) : null}
                        {formatPercentage(metric.change)}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate">{metric.subtitle}</span>
                    </div>

                    {/* Projection */}
                    {metric.projection > 0 && (
                      <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-600">
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                          Proj: <span className="font-semibold text-amber-600">{formatCurrency(metric.projection)}</span>
                        </p>
                      </div>
                    )}

                    {/* Mini Sparkline */}
                    {metric.showSparkline && (
                      <div className="mt-2 h-6">
                        <div className="flex items-end justify-between h-full gap-0.5">
                          {[45, 52, 48, 61, 55, 67, 72].map((val, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "rounded-sm flex-1",
                                idx === 6 ? "bg-violet-500" : "bg-violet-300 dark:bg-violet-600"
                              )}
                              style={{ height: `${(val / 72) * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 border-slate-700">
                {metric.cardBreakdown && (
                  <div className="space-y-1.5 p-1">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <DollarSign className="w-3 h-3 text-[#2bc196]" /> Detalhamento
                    </p>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      Cartão: {formatCurrency(metric.cardBreakdown.card)}
                    </p>
                    <p className="text-xs text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2bc196]" />
                      Pix: {formatCurrency(metric.cardBreakdown.pix)}
                    </p>
                  </div>
                )}
                {!metric.cardBreakdown && (
                  <p className="text-xs text-slate-300">Clique para detalhes</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}