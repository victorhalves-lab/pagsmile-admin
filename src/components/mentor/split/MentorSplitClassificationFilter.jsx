import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, AlertTriangle, AlertCircle, PowerOff, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CLASSIFICATION_META } from '@/components/mentor/mocks/splitRiskOpportunityMock';

const ICONS = { TrendingDown, TrendingUp, AlertTriangle, AlertCircle, PowerOff };

/**
 * Filtro chips por classificação · Mentor F2934-F2935.
 * Mostra contagem em cada categoria + filtro ativo.
 */
export default function MentorSplitClassificationFilter({ splits = [], activeFilter, onChange }) {
  const counts = Object.keys(CLASSIFICATION_META).reduce((acc, key) => {
    acc[key] = splits.filter((s) => s.classification === key).length;
    return acc;
  }, {});

  const total = splits.length;

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Classificação automática Mentor</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onChange(null)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition',
              !activeFilter
                ? 'bg-violet-600 text-white border-violet-700 font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'
            )}
          >
            Todos <Badge className="bg-white/20 text-current text-[10px]">{total}</Badge>
          </button>
          {Object.entries(CLASSIFICATION_META).map(([key, meta]) => {
            const Icon = ICONS[meta.icon] || AlertCircle;
            const count = counts[key];
            const active = activeFilter === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                disabled={count === 0}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs transition disabled:opacity-40',
                  active
                    ? `bg-${meta.color}-600 text-white border-${meta.color}-700 font-bold`
                    : `bg-${meta.color}-50 border-${meta.color}-200 text-${meta.color}-700 hover:bg-${meta.color}-100`
                )}
              >
                <Icon className="w-3 h-3" />
                {meta.label}
                <Badge className={cn('text-[10px]', active ? 'bg-white/20' : 'bg-white')}>
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}