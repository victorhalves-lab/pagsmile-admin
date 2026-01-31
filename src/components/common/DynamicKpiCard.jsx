import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DynamicKpiCard({
  title,
  value,
  prefix = "",
  suffix = "",
  trend,
  trendValue,
  description,
  icon: Icon,
  color = "primary",
  actionLabel,
  onActionClick,
  className
}) {
  const colorClasses = {
    primary: "text-[#2bc196] bg-[#2bc196]/10 border-[#2bc196]/20",
    purple: "text-purple-600 bg-purple-100 border-purple-200",
    blue: "text-blue-600 bg-blue-100 border-blue-200",
    red: "text-red-600 bg-red-100 border-red-200",
    amber: "text-amber-600 bg-amber-100 border-amber-200"
  };

  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-slate-500';
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </CardTitle>
          {Icon && <Icon className={cn("w-5 h-5 flex-shrink-0", colorClasses[color].split(' ')[0])} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-white truncate">
              {prefix}{value}{suffix}
            </p>
            {TrendIcon && trendValue && (
              <div className={cn("flex items-center gap-1 text-sm font-medium", trendColor)}>
                <TrendIcon className="w-4 h-4" />
                {trendValue}
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">
              {description}
            </p>
          )}

          {actionLabel && onActionClick && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 gap-2"
              onClick={onActionClick}
            >
              {actionLabel}
              <ArrowRight className="w-3 h-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}