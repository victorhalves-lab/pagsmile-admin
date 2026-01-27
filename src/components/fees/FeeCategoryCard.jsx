import React from 'react';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function FeeCategoryCard({
  title,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  iconColor = "text-blue-600",
  totalFee,
  feePercentage,
  totalVolume,
  trend,
  trendValue,
  chartData = [],
  chartColor = "#3B82F6",
  insight,
  formatCurrency,
  className
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColorClass = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-emerald-500' : 'text-gray-500';

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl", iconBgColor)}>
              <Icon className={cn("w-5 h-5", iconColor)} />
            </div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-medium", trendColorClass)}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trendValue}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Total de Tarifas</p>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(totalFee)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">% sobre Volume</p>
            <p className="text-xl font-bold text-gray-900">{feePercentage.toFixed(2)}%</p>
          </div>
        </div>

        {/* Volume Info */}
        <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-500">Volume Processado</span>
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalVolume)}</span>
        </div>

        {/* Mini Chart */}
        {chartData.length > 0 && (
          <div className="h-16 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={chartColor} 
                  strokeWidth={2}
                  fill={`url(#gradient-${title})`} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Copilot Insight */}
        {insight && (
          <div className="mt-3 p-3 bg-gradient-to-r from-primary/5 to-emerald-500/5 rounded-lg border border-primary/10">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">{insight}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}