import React from 'react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

export default function ChartCard({ 
  title, 
  subtitle,
  children, 
  className,
  action,
  periodSelector = false,
  selectedPeriod = '7d',
  onPeriodChange,
  headerRight
}) {
  return (
    <div className={cn(
      "bg-white rounded-xl border border-gray-100 p-5",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {periodSelector && (
            <Select value={selectedPeriod} onValueChange={onPeriodChange}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Últimas 24h</SelectItem>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          )}
          {headerRight}
          {action && (
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}