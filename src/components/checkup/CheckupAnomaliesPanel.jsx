import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertOctagon, Sparkles } from 'lucide-react';
import { CHECKUP_ANOMALIES } from './mocks/checkupMock';

export default function CheckupAnomaliesPanel() {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-purple-600" />
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">Anomalias Detectadas (IA)</h3>
        <Badge variant="secondary">{CHECKUP_ANOMALIES.length}</Badge>
      </div>
      <div className="space-y-2">
        {CHECKUP_ANOMALIES.map(anom => {
          const Icon = anom.severity === 'critical' ? AlertOctagon : AlertTriangle;
          const colorClass = anom.severity === 'critical' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' :
                             anom.severity === 'high' ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' :
                             'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20';
          const iconColor = anom.severity === 'critical' ? 'text-red-600' : anom.severity === 'high' ? 'text-orange-600' : 'text-yellow-600';
          return (
            <div key={anom.id} className={`p-3 rounded-lg border ${colorClass}`}>
              <div className="flex items-start gap-2">
                <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-0.5`} />
                <div className="flex-1">
                  <div className="font-medium text-sm text-slate-800 dark:text-slate-100">{anom.title}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">{anom.description}</div>
                  <div className="text-xs italic text-slate-500 dark:text-slate-400 mt-1">💡 {anom.suggestion}</div>
                </div>
                <Badge variant="outline" className="text-xs">{anom.related_count}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}