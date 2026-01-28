import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function KPICard({ 
  title, 
  value, 
  change, 
  changeLabel = "vs mês anterior", 
  icon: Icon, 
  trendData,
  className,
  valueClassName,
  positiveIsBad = false
}) {
  const isPositive = change > 0;
  const isNeutral = change === 0;
  const isNegative = change < 0;

  // Determine colors based on positiveIsBad logic
  // If positiveIsBad is true (e.g. churn, cost), then positive change is red, negative is green
  let trendColor = "text-slate-500";
  let TrendIcon = Minus;
  
  if (isPositive) {
    trendColor = positiveIsBad ? "text-red-500" : "text-emerald-500";
    TrendIcon = ArrowUp;
  } else if (isNegative) {
    trendColor = positiveIsBad ? "text-emerald-500" : "text-red-500";
    TrendIcon = ArrowDown;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          {Icon && (
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2 mb-1">
          <h3 className={cn("text-2xl font-bold text-slate-900 dark:text-white", valueClassName)}>
            {value}
          </h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn("flex items-center text-xs font-medium", trendColor)}>
              <TrendIcon className="w-3 h-3 mr-1" />
              {Math.abs(change)}%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {changeLabel}
            </span>
          </div>
          
          {trendData && (
            <div className="h-8 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke={isPositive ? (positiveIsBad ? "#ef4444" : "#10b981") : (positiveIsBad ? "#10b981" : "#ef4444")} 
                    fill={isPositive ? (positiveIsBad ? "#fee2e2" : "#d1fae5") : (positiveIsBad ? "#d1fae5" : "#fee2e2")} 
                    strokeWidth={1.5}
                  />
                  <Tooltip cursor={false} content={<></>} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}