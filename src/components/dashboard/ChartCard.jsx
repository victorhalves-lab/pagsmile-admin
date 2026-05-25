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

/**
 * ChartCard — Pulse VF.
 * Container `.pvf-card` com `.pvf-section-h` no header.
 * Title em Inter bold + accent gradient mint→glow underline.
 */
export default function ChartCard({
  title,
  subtitle,
  children,
  className,
  action,
  periodSelector = false,
  selectedPeriod = '7d',
  onPeriodChange,
  headerRight,
}) {
  return (
    <div className={cn('pvf-card', className)}>
      {/* Header com pvf-section-h */}
      <div className="pvf-section-h" style={{ marginBottom: 16 }}>
        <div>
          {subtitle && (
            <div className="pvf-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ width: 18, height: 2, background: '#00C194', borderRadius: 99 }} />
              {subtitle}
            </div>
          )}
          <h2 style={{
            margin: 0,
            fontFamily: 'Inter, sans-serif',
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: '-0.018em',
            color: '#001124',
            lineHeight: 1.2,
          }}>
            {title}
          </h2>
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