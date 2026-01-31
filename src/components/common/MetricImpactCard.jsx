import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MetricImpactCard({ 
  metricName,
  before,
  after,
  unit = "",
  description,
  target,
  className
}) {
  const improvement = after - before;
  const isPositive = improvement > 0;
  const percentChange = before !== 0 ? ((improvement / before) * 100).toFixed(1) : 0;

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-600">
          {metricName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Before & After */}
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-xs text-slate-500 mb-1">Antes</p>
              <p className="text-2xl font-bold text-slate-400">
                {before}{unit}
              </p>
            </div>
            
            <div className={cn(
              "mx-4 p-2 rounded-full",
              isPositive ? "bg-green-100" : "bg-red-100"
            )}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5 text-green-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
            
            <div className="text-center flex-1">
              <p className="text-xs text-slate-500 mb-1">Depois</p>
              <p className={cn(
                "text-2xl font-bold",
                isPositive ? "text-green-600" : "text-red-600"
              )}>
                {after}{unit}
              </p>
            </div>
          </div>

          {/* Impact Badge */}
          <div className={cn(
            "text-center py-2 px-3 rounded-lg",
            isPositive ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          )}>
            <p className={cn(
              "text-sm font-bold",
              isPositive ? "text-green-700" : "text-red-700"
            )}>
              {isPositive ? '+' : ''}{percentChange}% {isPositive ? 'de melhoria' : 'de queda'}
            </p>
          </div>

          {description && (
            <p className="text-xs text-slate-500 text-center">
              {description}
            </p>
          )}

          {target && (
            <div className="flex items-center gap-2 text-xs text-slate-600 justify-center">
              <Target className="w-3 h-3" />
              <span>Meta: {target}{unit}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}