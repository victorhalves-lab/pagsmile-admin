import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const SEVERITY = {
  high: { icon: AlertTriangle, color: 'text-red-600 bg-red-50 dark:bg-red-500/10' },
  medium: { icon: AlertCircle, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10' },
  low: { icon: Info, color: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
};

export default function HelenaInsightsAlerts({ insights = [] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          Insights da Helena IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights.map((ins) => {
          const cfg = SEVERITY[ins.severity] || SEVERITY.low;
          const Icon = cfg.icon;
          return (
            <div key={ins.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cfg.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{ins.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ins.description}</p>
              </div>
              <Button size="sm" variant="ghost" className="text-xs h-7">{ins.action}</Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}