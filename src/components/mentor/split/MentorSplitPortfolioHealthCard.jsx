import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

const formatCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

/**
 * Card de saúde global da carteira de splits · Mentor F2929-F2933.
 * Mostra health score ponderado, projeção de receita e gauge visual.
 */
export default function MentorSplitPortfolioHealthCard({ stats }) {
  const { weighted_health_score, total_owner_revenue_30d, predicted_revenue_next_30d, predicted_delta_pct } = stats;

  // Determinar nível
  const level =
    weighted_health_score >= 80 ? 'healthy' : weighted_health_score >= 60 ? 'attention' : 'risk';
  const levelColor = {
    healthy: { bg: 'from-emerald-50 to-teal-50', text: 'text-emerald-700', badge: 'bg-emerald-600 text-white' },
    attention: { bg: 'from-amber-50 to-orange-50', text: 'text-amber-700', badge: 'bg-amber-600 text-white' },
    risk: { bg: 'from-red-50 to-rose-50', text: 'text-red-700', badge: 'bg-red-600 text-white' },
  }[level];
  const levelLabel = { healthy: 'SAUDÁVEL', attention: 'ATENÇÃO', risk: 'CRÍTICO' }[level];

  const isPredictionPositive = predicted_delta_pct >= 0;

  return (
    <Card className={`bg-gradient-to-br ${levelColor.bg} border-2`}>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <h3 className="text-sm font-bold text-violet-700">
              Mentor · Saúde da Carteira de Splits
            </h3>
            <Badge className="bg-violet-100 text-violet-700 text-[9px]">inédito no mercado</Badge>
          </div>
          <Badge className={levelColor.badge}>{levelLabel}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          {/* Health Gauge */}
          <div className="text-center">
            <div className="relative inline-block">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" stroke="rgba(0,0,0,0.08)" strokeWidth="10" fill="none" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${(weighted_health_score / 100) * 326.7} 326.7`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className={levelColor.text}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Activity className={`w-4 h-4 ${levelColor.text}`} />
                <p className={`text-3xl font-black ${levelColor.text}`}>{weighted_health_score}</p>
                <p className="text-[9px] text-slate-500 uppercase">/ 100</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Health score ponderado por TPV</p>
          </div>

          {/* Receita atual */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border">
            <p className="text-[10px] uppercase font-bold text-slate-500">Receita owner · 30d</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
              {formatCurrency(total_owner_revenue_30d)}
            </p>
            <p className="text-[10px] text-slate-500">{stats.active_splits} splits ativos · {stats.total_splits} no total</p>
          </div>

          {/* Projeção próximos 30d */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-3 border">
            <p className="text-[10px] uppercase font-bold text-slate-500">Projeção · próximos 30d</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-black text-slate-800 dark:text-slate-100">
                {formatCurrency(predicted_revenue_next_30d)}
              </p>
              {isPredictionPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
            </div>
            <Badge
              className={
                isPredictionPositive ? 'bg-emerald-100 text-emerald-700 text-[10px]' : 'bg-red-100 text-red-700 text-[10px]'
              }
            >
              {isPredictionPositive ? '+' : ''}
              {predicted_delta_pct.toFixed(1)}% vs últimos 30d
            </Badge>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 italic text-center">
          * Projeção via modelo Mentor com base em TPV histórico, sazonalidade da vertical e tendências por bandeira.
        </p>
      </CardContent>
    </Card>
  );
}