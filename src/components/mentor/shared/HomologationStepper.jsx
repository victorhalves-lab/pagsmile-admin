import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, Circle } from 'lucide-react';

export default function HomologationStepper({ steps = [], title = 'Homologação' }) {
  const done = steps.filter((s) => s.status === 'done').length;
  const pct = steps.length ? Math.round((done / steps.length) * 100) : 0;

  return (
    <Card className="border-blue-200 bg-blue-50/40 dark:bg-blue-900/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm font-bold text-blue-700">{pct}%</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              {s.status === 'done' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> :
                s.status === 'in_progress' ? <Loader2 className="w-4 h-4 text-blue-600 animate-spin" /> :
                <Circle className="w-4 h-4 text-slate-400" />}
              <span className={s.status === 'done' ? 'line-through text-slate-500' : 'font-medium'}>{i + 1}. {s.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}