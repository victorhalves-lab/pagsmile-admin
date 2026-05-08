import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { fmtCurrency } from '@/components/subscriptions/utils';
import { cn } from '@/lib/utils';

export default function SaasMetricsKpiBar({ metrics }) {
  const items = [
    { label: 'MRR', value: fmtCurrency(metrics.mrr, { short: true }), tip: 'Monthly Recurring Revenue' },
    { label: 'ARR', value: fmtCurrency(metrics.arr, { short: true }), tip: 'Annual Recurring Revenue' },
    { label: 'Quick Ratio', value: metrics.quickRatio.toFixed(2), tip: '(New + Expansion) / Churn — saudável: >4', good: metrics.quickRatio >= 4 },
    { label: 'NRR', value: `${metrics.nrr}%`, tip: 'Net Revenue Retention — saudável: >100%', good: metrics.nrr >= 100 },
    { label: 'GRR', value: `${metrics.grr}%`, tip: 'Gross Revenue Retention', good: metrics.grr >= 90 },
    { label: 'Payback', value: `${metrics.payback}m`, tip: 'CAC Payback Period — saudável: <12m', good: metrics.payback < 12 },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {items.map((it) => (
          <Card key={it.label}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">{it.label}</p>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-slate-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent><p className="text-xs">{it.tip}</p></TooltipContent>
                </Tooltip>
              </div>
              <p className={cn('text-lg font-black mt-0.5', it.good === true && 'text-emerald-600', it.good === false && 'text-amber-600')}>
                {it.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}