import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GitCompare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const SENSITIVITY_COLORS = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-amber-500 bg-amber-50',
  low: 'border-l-blue-500 bg-blue-50',
};

const SENSITIVITY_LABELS = {
  high: { label: 'Alta', color: 'bg-red-100 text-red-700' },
  medium: { label: 'Média', color: 'bg-amber-100 text-amber-700' },
  low: { label: 'Baixa', color: 'bg-blue-100 text-blue-700' },
};

/**
 * Diff antes/depois com classificação de sensibilidade · Mentor F2911-F2912.
 * Cada mudança colorida pelo nível de risco contratual.
 */
export default function MentorSplitChangeDiffViewer({ changes = [] }) {
  if (changes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-sm text-slate-500">
          Nenhuma mudança detectada · ajuste a configuração proposta para ver o diff aqui.
        </CardContent>
      </Card>
    );
  }

  const grouped = {
    high: changes.filter((c) => c.level === 'high'),
    medium: changes.filter((c) => c.level === 'medium'),
    low: changes.filter((c) => c.level === 'low'),
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
          <GitCompare className="w-4 h-4 text-violet-600" />
          Diff Visual · {changes.length} mudança(s) detectada(s)
        </CardTitle>
        <div className="flex gap-2 flex-wrap pt-1">
          {grouped.high.length > 0 && (
            <Badge className={SENSITIVITY_LABELS.high.color}>{grouped.high.length} alta</Badge>
          )}
          {grouped.medium.length > 0 && (
            <Badge className={SENSITIVITY_LABELS.medium.color}>{grouped.medium.length} média</Badge>
          )}
          {grouped.low.length > 0 && (
            <Badge className={SENSITIVITY_LABELS.low.color}>{grouped.low.length} baixa</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {changes.map((c, i) => (
          <div
            key={i}
            className={cn('rounded-lg p-3 border-l-4', SENSITIVITY_COLORS[c.level])}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{c.label}</p>
              <Badge className={cn('text-[10px]', SENSITIVITY_LABELS[c.level].color)}>
                Sensibilidade {SENSITIVITY_LABELS[c.level].label.toLowerCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="bg-white px-2 py-1 rounded line-through text-slate-500 font-mono text-[11px]">
                {c.from || '—'}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="bg-white px-2 py-1 rounded text-emerald-700 font-bold font-mono text-[11px]">
                {c.to || '—'}
              </span>
            </div>
            {c.requires_notice && (
              <p className="text-[10px] text-red-600 font-semibold mt-1.5">
                ⚠️ Mudança exige aviso prévio contratual
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}