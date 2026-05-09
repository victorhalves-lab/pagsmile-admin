import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, AlertCircle, TrendingUp, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

const PRIORITY_CONFIG = {
  high: { color: 'border-l-red-500 bg-red-50 dark:bg-red-900/10', badge: 'bg-red-100 text-red-700' },
  medium: { color: 'border-l-amber-500 bg-amber-50 dark:bg-amber-900/10', badge: 'bg-amber-100 text-amber-700' },
  low: { color: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10', badge: 'bg-blue-100 text-blue-700' },
};

const TYPE_ICONS = {
  consolidation: Layers,
  risk: AlertCircle,
  opportunity: TrendingUp,
};

function HealthScore({ score, factors = [] }) {
  const color = score >= 85 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
  const bg = score >= 85 ? 'bg-emerald-50 dark:bg-emerald-900/20' : score >= 60 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20';

  return (
    <div className={cn('rounded-lg p-4 border', bg)}>
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-slate-200 dark:text-slate-700" />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${(score / 100) * 175.93} 175.93`}
              className={color}
              strokeLinecap="round"
            />
          </svg>
          <div className={cn('absolute inset-0 flex items-center justify-center font-bold text-xl', color)}>{score}</div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
            <Heart className="w-3 h-3" /> Score de Saúde
          </p>
          <p className={cn('text-sm font-bold', color)}>
            {score >= 85 ? 'Saudável' : score >= 60 ? 'Atenção' : 'Crítico'}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            {score >= 85
              ? 'Split em ótimas condições operacionais'
              : score >= 60
                ? 'Alguns indicadores merecem revisão'
                : 'Investigação urgente recomendada'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        {factors.map((f, i) => (
          <div key={i} className="flex items-center justify-between bg-white/70 dark:bg-slate-900/40 rounded px-2 py-1">
            <span className="text-slate-600 dark:text-slate-400">{f.label}</span>
            <span
              className={cn(
                'font-bold',
                f.impact === 'positive' && 'text-emerald-700',
                f.impact === 'negative' && 'text-red-700',
                f.impact === 'neutral' && 'text-slate-700'
              )}
            >
              {f.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MentorSplitDerivedInsights({ healthScore, healthFactors, suggestions = [] }) {
  return (
    <Card className="bg-gradient-to-br from-violet-50/60 to-indigo-50/60 dark:from-violet-900/10 dark:to-indigo-900/10 border-violet-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          Insights & Otimizações
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <HealthScore score={healthScore} factors={healthFactors} />

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold text-slate-500">Sugestões algorítmicas</p>
            {suggestions.map((s, i) => {
              const cfg = PRIORITY_CONFIG[s.priority] || PRIORITY_CONFIG.low;
              const Icon = TYPE_ICONS[s.type] || Sparkles;
              return (
                <div key={i} className={cn('rounded-lg p-3 border-l-4', cfg.color)}>
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-slate-700 dark:text-slate-300 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{s.title}</p>
                        <Badge className={cn('text-[9px]', cfg.badge)}>{s.priority}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">{s.description}</p>
                      <p className="text-[10px] text-violet-700 dark:text-violet-300 font-semibold mt-1">→ {s.impact}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}