import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OnboardingFunnel({ subaccounts = [] }) {
  const total = subaccounts.length;
  const docsSubmitted = subaccounts.filter(s => 
    !['draft'].includes(s.status)
  ).length;
  const approved = subaccounts.filter(s => 
    ['active', 'suspended'].includes(s.status)
  ).length;
  const transacted = subaccounts.filter(s => 
    s.status === 'active' && (s.total_transactions || 0) > 0
  ).length;

  const stages = [
    { 
      label: 'Iniciaram Onboarding', 
      value: total, 
      pct: 100, 
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      label: 'Submeteram Docs', 
      value: docsSubmitted, 
      pct: total > 0 ? (docsSubmitted / total) * 100 : 0,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    { 
      label: 'Aprovados', 
      value: approved, 
      pct: total > 0 ? (approved / total) * 100 : 0,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    { 
      label: 'Primeira Venda', 
      value: transacted, 
      pct: total > 0 ? (transacted / total) * 100 : 0,
      color: 'bg-green-600',
      lightColor: 'bg-green-50 text-green-700 border-green-200'
    },
  ];

  // Calculate drop-off between stages
  const dropoffs = stages.slice(1).map((stage, i) => {
    const prev = stages[i].value;
    const current = stage.value;
    const dropoff = prev > 0 ? ((prev - current) / prev) * 100 : 0;
    return dropoff;
  });

  const biggestDropoff = Math.max(...dropoffs);
  const biggestDropoffIndex = dropoffs.indexOf(biggestDropoff);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Funil de Onboarding</CardTitle>
          {biggestDropoff > 30 && (
            <Badge variant="destructive" className="gap-1">
              <TrendingDown className="w-3 h-3" />
              Maior queda: {biggestDropoff.toFixed(0)}% em "{stages[biggestDropoffIndex + 1].label}"
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stages.map((stage, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">{stage.label}</span>
                  <Badge variant="outline" className={cn("text-xs", stage.lightColor)}>
                    {stage.value}
                  </Badge>
                </div>
                <span className="text-sm font-bold text-slate-900">{stage.pct.toFixed(1)}%</span>
              </div>
              <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                <div 
                  className={cn("absolute inset-y-0 left-0 rounded-lg transition-all", stage.color)}
                  style={{ width: `${stage.pct}%` }}
                />
              </div>
              {idx < stages.length - 1 && dropoffs[idx] > 0 && (
                <div className="flex items-center justify-center my-1">
                  <div className={cn(
                    "flex items-center gap-1 text-xs",
                    dropoffs[idx] > 30 ? "text-red-600 font-semibold" : "text-slate-500"
                  )}>
                    <ArrowRight className="w-3 h-3" />
                    -{dropoffs[idx].toFixed(0)}% drop
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500">Conversão Total</p>
            <p className="text-lg font-bold text-emerald-600">
              {total > 0 ? ((transacted / total) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Tempo Médio Total</p>
            <p className="text-lg font-bold text-slate-900">~5 dias</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}