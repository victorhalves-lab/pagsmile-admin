import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  PowerOff,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { CLASSIFICATION_META } from '@/components/mentor/mocks/splitRiskOpportunityMock';
import { cn } from '@/lib/utils';

const ICONS = { TrendingDown, TrendingUp, AlertTriangle, AlertCircle, PowerOff };

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

const SEVERITY_BADGE = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  low: 'bg-blue-100 text-blue-700 border-blue-300',
};

const SEVERITY_LABEL = { high: 'Alta', medium: 'Média', low: 'Baixa' };

/**
 * Card individual de split classificado · Mentor F2860-F2871.
 * Apresenta diagnóstico, ações sugeridas e impacto estimado.
 */
export default function MentorSplitOpportunityCard({ split }) {
  const meta = CLASSIFICATION_META[split.classification];
  const Icon = ICONS[meta.icon] || AlertCircle;
  const isOpportunity = split.estimated_impact > 0;
  const isRisk = split.estimated_impact < 0;

  return (
    <Card className={cn('border-l-4', `border-l-${meta.color}-500`)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className={cn('rounded-lg p-1.5', `bg-${meta.color}-100 text-${meta.color}-700`)}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{split.split_name}</p>
              <code className="font-mono text-[10px] text-slate-500">{split.split_id}</code>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={cn('text-[10px]', `bg-${meta.color}-100 text-${meta.color}-700`)}>{meta.label}</Badge>
            <Badge variant="outline" className={cn('text-[9px]', SEVERITY_BADGE[split.severity])}>
              Severidade {SEVERITY_LABEL[split.severity]}
            </Badge>
          </div>
        </div>

        {/* Métricas em linha */}
        <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg p-2">
          <div>
            <p className="text-[9px] uppercase text-slate-500">TPV 30d</p>
            <p className="font-bold text-slate-700">{formatCurrency(split.tpv_30d)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500">Tendência</p>
            <p
              className={cn(
                'font-bold',
                split.tpv_trend_pct >= 0 ? 'text-emerald-600' : 'text-red-600'
              )}
            >
              {split.tpv_trend_pct >= 0 ? '+' : ''}
              {split.tpv_trend_pct.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase text-slate-500">Health</p>
            <p
              className={cn(
                'font-bold',
                split.health_score >= 70
                  ? 'text-emerald-600'
                  : split.health_score >= 40
                  ? 'text-amber-600'
                  : 'text-red-600'
              )}
            >
              {split.health_score}/100
            </p>
          </div>
        </div>

        {/* Diagnóstico */}
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-2 text-xs">
          <p className="text-[10px] uppercase font-bold text-violet-700 mb-1">Diagnóstico Mentor</p>
          <p className="text-slate-700">{split.diagnosis}</p>
        </div>

        {/* Ações sugeridas */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            <p className="text-[10px] uppercase font-bold text-slate-600">Ações sugeridas</p>
          </div>
          <ul className="space-y-1">
            {split.suggested_actions.map((action, i) => (
              <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                <span className="text-violet-500 mt-0.5">▸</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer: impacto + CTA */}
        <div className="flex items-center justify-between pt-2 border-t flex-wrap gap-2">
          {split.estimated_impact !== 0 && (
            <div>
              <p className="text-[9px] uppercase text-slate-500">Impacto estimado mensal</p>
              <p
                className={cn(
                  'text-sm font-black',
                  isOpportunity && 'text-emerald-700',
                  isRisk && 'text-red-700'
                )}
              >
                {isOpportunity ? '+' : ''}
                {formatCurrency(split.estimated_impact)}
              </p>
            </div>
          )}
          <Link to={createPageUrl('SplitDetail360')} className="ml-auto">
            <Button size="sm" variant="outline" className="border-violet-300 text-violet-700 hover:bg-violet-50">
              Abrir Ficha 360 <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}