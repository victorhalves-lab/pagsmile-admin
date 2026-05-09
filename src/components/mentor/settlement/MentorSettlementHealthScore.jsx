import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const RISK_COLORS = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

export default function MentorSettlementHealthScore({ score, risks = [], suggestions = [] }) {
  const color = score >= 90 ? 'text-emerald-700' : score >= 70 ? 'text-amber-700' : 'text-red-700';
  const bg = score >= 90 ? 'from-emerald-50' : score >= 70 ? 'from-amber-50' : 'from-red-50';

  return (
    <Card className={`bg-gradient-to-br ${bg} to-white border-violet-200`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <p className="text-xs font-bold uppercase text-slate-700">Saúde Mentor</p>
          </div>
          <p className={cn('text-3xl font-black tabular-nums', color)}>{score}<span className="text-base text-slate-400">/100</span></p>
        </div>

        {risks.length > 0 && (
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Riscos identificados
            </p>
            <div className="space-y-1.5">
              {risks.map((r, i) => (
                <div key={i} className="bg-white border rounded p-2">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={cn('text-[9px]', RISK_COLORS[r.level])}>{r.level}</Badge>
                    <span className="text-[11px] font-bold text-slate-700">{r.description}</span>
                  </div>
                  <p className="text-[10px] text-emerald-700">→ {r.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {suggestions.length > 0 && (
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 flex items-center gap-1">
              <Lightbulb className="w-3 h-3" /> Sugestões proativas
            </p>
            <ul className="space-y-1">
              {suggestions.map((s, i) => (
                <li key={i} className="text-[11px] text-violet-900 bg-white border-l-2 border-violet-400 pl-2 py-1 rounded">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}