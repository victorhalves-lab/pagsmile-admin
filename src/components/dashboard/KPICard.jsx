import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp, Sparkles } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export default function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  loading, 
  prefix = "R$ ", 
  suffix = "",
  trend = "neutral",
  chartData = [],
  color = "emerald", // emerald, blue, violet, amber, red
  className 
}) {
  const colorClasses = {
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-50 via-white to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900',
      border: 'border-emerald-200 dark:border-emerald-800',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-[#2bc196]',
      iconShadow: 'shadow-emerald-500/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      chartStroke: '#2bc196',
      chartFill: 'rgba(43, 193, 150, 0.1)'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-slate-900 dark:to-slate-900',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
      iconShadow: 'shadow-blue-500/30',
      text: 'text-blue-600 dark:text-blue-400',
      chartStroke: '#3b82f6',
      chartFill: 'rgba(59, 130, 246, 0.1)'
    },
    violet: {
      bg: 'bg-gradient-to-br from-violet-50 via-white to-white dark:from-violet-950/30 dark:via-slate-900 dark:to-slate-900',
      border: 'border-violet-200 dark:border-violet-800',
      iconBg: 'bg-gradient-to-br from-violet-400 to-purple-600',
      iconShadow: 'shadow-violet-500/30',
      text: 'text-violet-600 dark:text-violet-400',
      chartStroke: '#8b5cf6',
      chartFill: 'rgba(139, 92, 246, 0.1)'
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 via-white to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900',
      border: 'border-amber-200 dark:border-amber-800',
      iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
      iconShadow: 'shadow-amber-500/30',
      text: 'text-amber-600 dark:text-amber-400',
      chartStroke: '#f59e0b',
      chartFill: 'rgba(245, 158, 11, 0.1)'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 via-white to-white dark:from-red-950/30 dark:via-slate-900 dark:to-slate-900',
      border: 'border-red-200 dark:border-red-800',
      iconBg: 'bg-gradient-to-br from-red-400 to-red-600',
      iconShadow: 'shadow-red-500/30',
      text: 'text-red-600 dark:text-red-400',
      chartStroke: '#ef4444',
      chartFill: 'rgba(239, 68, 68, 0.1)'
    }
  };

  const colors = colorClasses[color] || colorClasses.emerald;

  if (loading) {
    return (
      <Card className="h-full border-2 border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = change > 0;
  const isNegative = change < 0;

  const data = chartData.length > 0 ? chartData : [
    { v: 40 }, { v: 30 }, { v: 45 }, { v: 50 }, { v: 65 }, { v: 60 }, { v: 70 }
  ];

  return (
    <Card className={cn(
      "overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 relative",
      colors.bg,
      colors.border,
      className
    )}>
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-current opacity-5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <CardContent className="p-6 relative">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <p className={cn("text-xs font-bold uppercase tracking-wider", colors.text)}>{title}</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}{suffix}
              </h3>
            </div>
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300",
            colors.iconBg,
            colors.iconShadow
          )}>
            {Icon && <Icon className="w-6 h-6 text-white" />}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold",
            isPositive 
              ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300' 
              : isNegative 
                ? 'text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300' 
                : 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
          )}>
            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
            <span>{Math.abs(change)}%</span>
            <span className="font-medium opacity-70 ml-1 hidden sm:inline">vs anterior</span>
          </div>

          <div className="w-24 h-12 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${title}-${color}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.chartStroke} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={colors.chartStroke} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke={colors.chartStroke}
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill={`url(#gradient-${title}-${color})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}