import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export default function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  loading, 
  prefix = "R$ ", 
  suffix = "",
  trend = "neutral", // up, down, neutral
  chartData = [], // Array of numbers for sparkline
  className 
}) {
  if (loading) {
    return (
      <Card className="h-full border-slate-100 shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = change > 0;
  const isNegative = change < 0;
  
  const trendColor = isPositive ? "text-emerald-600 bg-emerald-50" : isNegative ? "text-red-600 bg-red-50" : "text-slate-600 bg-slate-50";
  const trendIcon = isPositive ? <ArrowUpRight className="w-3 h-3" /> : isNegative ? <ArrowDownRight className="w-3 h-3" /> : <Minus className="w-3 h-3" />;

  // Generate fake sparkline data if none provided
  const data = chartData.length > 0 ? chartData : [
    { v: 40 }, { v: 30 }, { v: 45 }, { v: 50 }, { v: 65 }, { v: 60 }, { v: 70 }
  ];

  return (
    <Card className={cn("overflow-hidden group hover:shadow-xl transition-all duration-300 border-slate-100", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {prefix}{typeof value === 'number' ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}{suffix}
              </h3>
            </div>
          </div>
          <div className={cn(
            "p-2.5 rounded-xl transition-colors duration-300 group-hover:scale-110",
            "bg-slate-50 text-slate-500 group-hover:bg-[#00D26A]/10 group-hover:text-[#00D26A]"
          )}>
            {Icon && <Icon className="w-5 h-5" />}
          </div>
        </div>

        <div className="mt-4 flex items-end justify-between h-10">
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold w-fit",
            trendColor
          )}>
            {trendIcon}
            <span>{Math.abs(change)}%</span>
            <span className="font-normal opacity-70 ml-1">vs mês anterior</span>
          </div>

          <div className="w-24 h-10 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D26A" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D26A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="v" 
                  stroke="#00D26A" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill={`url(#gradient-${title})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}