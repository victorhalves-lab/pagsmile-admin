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
      label: 'GMV Hoje',
      value: data.today || 0,
      change: data.todayChange || 0,
      subtitle: 'Atualizado em tempo real',
      cardBreakdown: { card: data.todayCard || 0, pix: data.todayPix || 0 },
      icon: Zap,
      iconBg: 'bg-gradient-to-br from-emerald-400 to-[#2bc196]',
      cardBg: 'bg-gradient-to-br from-emerald-50 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      accentColor: 'text-emerald-600'
    },
    {
      id: 'yesterday',
      label: 'GMV Ontem',
      value: data.yesterday || 0,
      change: data.yesterdayChange || 0,
      subtitle: 'Comparado com dia anterior',
      icon: Calendar,
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      cardBg: 'bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-blue-200 dark:border-blue-800',
      accentColor: 'text-blue-600'
    },
    {
      id: 'last7days',
      label: 'GMV Últimos 7 Dias',
      value: data.last7days || 0,
      change: data.last7daysChange || 0,
      subtitle: 'Incluindo hoje',
      showSparkline: true,
      icon: BarChart3,
      iconBg: 'bg-gradient-to-br from-violet-400 to-purple-600',
      cardBg: 'bg-gradient-to-br from-violet-50 via-white to-white dark:from-violet-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-violet-200 dark:border-violet-800',
      accentColor: 'text-violet-600'
    },
    {
      id: 'currentMonth',
      label: 'GMV Mês Atual',
      value: data.currentMonth || 0,
      change: data.currentMonthChange || 0,
      subtitle: `${data.monthProgress || 0}% do mês decorrido`,
      projection: data.monthProjection || 0,
      icon: Target,
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      cardBg: 'bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-amber-200 dark:border-amber-800',
      accentColor: 'text-amber-600'
    },
    {
      id: 'lastMonth',
      label: 'GMV Mês Anterior',
      value: data.lastMonth || 0,
      change: data.lastMonthChange || 0,
      subtitle: 'Mês completo',
      icon: CalendarDays,
      iconBg: 'bg-gradient-to-br from-slate-400 to-slate-600',
      cardBg: 'bg-gradient-to-br from-slate-50 via-white to-white dark:from-slate-800/50 dark:via-slate-900 dark:to-slate-900',
      borderColor: 'border-slate-200 dark:border-slate-700',
      accentColor: 'text-slate-600'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {gmvMetrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <TooltipProvider key={metric.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className={cn(
                  "cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative group",
                  metric.cardBg,
                  metric.borderColor,
                  "border-2"
                )}>
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent opacity-5 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                  
                  <CardContent className="p-5 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", metric.accentColor)}>
                          {metric.label}
                        </p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                          {formatCurrency(metric.value)}
                        </p>
                      </div>
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
                        metric.iconBg
                      )}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Change Indicator */}
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                        metric.change > 0 
                          ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300' 
                          : metric.change < 0 
                            ? 'text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300' 
                            : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
                      )}>
                        {metric.change > 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : metric.change < 0 ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : null}
                        {formatPercentage(metric.change)}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{metric.subtitle}</span>
                    </div>

                    {/* Projection */}
                    {metric.projection > 0 && (
                      <div className="mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Projeção: <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(metric.projection)}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Mini Sparkline */}
                    {metric.showSparkline && (
                      <div className="mt-4 h-8">
                        <div className="flex items-end justify-between h-full gap-1">
                          {[45, 52, 48, 61, 55, 67, 72].map((val, idx) => (
                            <div
                              key={idx}
                              className={cn(
                                "rounded-t-md flex-1 transition-all duration-300 group-hover:opacity-100",
                                idx === 6 ? "bg-gradient-to-t from-violet-500 to-violet-400 opacity-100" : "bg-violet-300 dark:bg-violet-600 opacity-60"
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
                  <div className="space-y-2 p-1">
                    <p className="text-xs font-bold text-white flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-[#2bc196]" /> Detalhamento:
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        Cartão: {formatCurrency(metric.cardBreakdown.card)}
                      </p>
                      <p className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2bc196]"></span>
                        Pix: {formatCurrency(metric.cardBreakdown.pix)}
                      </p>
                    </div>
                  </div>
                )}
                {!metric.cardBreakdown && (
                  <p className="text-xs text-slate-300">Clique para ver detalhes</p>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
}