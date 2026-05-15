import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  TrendingUp, TrendingDown, Users, ShieldAlert, Trophy, Globe2,
  Layers, Activity, BarChart3, Target, Sparkles, Gavel,
} from 'lucide-react';
import {
  COHORT_DATA, HOURLY_WEEKDAY_HEATMAP, TOP_BINS, CHARGEBACK_DISTRIBUTION,
  FRAUD_INSIGHTS, DISPUTE_DEFENSE, CARD_DECLINE_REASONS,
} from './analyticsMockData';

const fmtCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v || 0);
const fmtInt = (v) => new Intl.NumberFormat('pt-BR').format(v || 0);

const cohortColor = (v) => {
  if (v === null || v === undefined) return 'bg-slate-50 dark:bg-slate-800/30 text-slate-300';
  if (v >= 70) return 'bg-emerald-500 text-white';
  if (v >= 50) return 'bg-emerald-300 text-emerald-900';
  if (v >= 40) return 'bg-yellow-300 text-yellow-900';
  if (v >= 30) return 'bg-orange-300 text-orange-900';
  return 'bg-red-300 text-red-900';
};

const heatColor = (rate) => {
  if (rate >= 90) return 'bg-emerald-500';
  if (rate >= 85) return 'bg-emerald-400';
  if (rate >= 80) return 'bg-yellow-300';
  if (rate >= 75) return 'bg-orange-300';
  return 'bg-red-400';
};

export default function AdvancedAnalyticsFull() {
  return (
    <div className="space-y-4">
      {/* ===== ROW 1 — Cohort de Retenção ===== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-violet-600" />
                Cohort de Retenção de Clientes
              </h3>
              <p className="text-xs text-slate-500">% de clientes que voltam a transacionar nos meses subsequentes</p>
            </div>
            <Badge variant="outline" className="text-[10px]">Últimos 6 meses</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500">
                  <th className="text-left p-2 font-semibold">Cohort</th>
                  <th className="text-right p-2 font-semibold">Clientes</th>
                  <th className="text-center p-2 font-semibold">M0</th>
                  <th className="text-center p-2 font-semibold">M+1</th>
                  <th className="text-center p-2 font-semibold">M+2</th>
                  <th className="text-center p-2 font-semibold">M+3</th>
                  <th className="text-center p-2 font-semibold">M+4</th>
                  <th className="text-center p-2 font-semibold">M+5</th>
                </tr>
              </thead>
              <tbody>
                {COHORT_DATA.map((c) => (
                  <tr key={c.cohort}>
                    <td className="p-1.5 font-semibold text-slate-900 dark:text-white">{c.cohort}</td>
                    <td className="p-1.5 text-right text-slate-500">{fmtInt(c.size)}</td>
                    {['m0', 'm1', 'm2', 'm3', 'm4', 'm5'].map((m) => (
                      <td key={m} className="p-0.5">
                        <div className={cn('rounded text-center py-1.5 text-[11px] font-bold', cohortColor(c[m]))}>
                          {c[m] !== null && c[m] !== undefined ? `${c[m]}%` : '—'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span>Insight: cohort de <strong className="text-violet-700">Abr/26 retém 74% em M+1</strong> — melhor performance dos últimos 6 meses.</span>
          </div>
        </CardContent>
      </Card>

      {/* ===== ROW 2 — Heatmap Hora x Dia ===== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Heatmap de Aprovação · Dia × Hora
              </h3>
              <p className="text-xs text-slate-500">Taxa de aprovação combinada (cartão + PIX) por hora e dia da semana</p>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-slate-500">Pior</span>
              <div className="flex gap-0.5">
                {['bg-red-400', 'bg-orange-300', 'bg-yellow-300', 'bg-emerald-400', 'bg-emerald-500'].map((c) => (
                  <div key={c} className={cn('w-3 h-3 rounded-sm', c)} />
                ))}
              </div>
              <span className="text-slate-500">Melhor</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[680px]">
              {/* hour labels */}
              <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5 mb-1">
                <div />
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="text-[9px] text-slate-400 text-center">{i % 3 === 0 ? `${i}h` : ''}</div>
                ))}
              </div>
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div key={day} className="grid grid-cols-[40px_repeat(24,1fr)] gap-0.5 mb-0.5">
                  <div className="text-[10px] font-semibold text-slate-600 dark:text-slate-300 self-center">{day}</div>
                  {HOURLY_WEEKDAY_HEATMAP.filter((c) => c.day === day).map((cell) => (
                    <div
                      key={`${day}-${cell.hour}`}
                      className={cn('h-5 rounded-sm group relative cursor-pointer transition-transform hover:scale-110', heatColor(cell.rate))}
                      title={`${day} ${cell.hour}h: ${cell.rate.toFixed(1)}% · ${cell.volume} tx`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== ROW 3 — Top BINs + Análise de Recusas (resumo) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                Top BINs por Performance
              </h3>
              <Badge variant="outline" className="text-[10px]">8 BINs principais</Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100 dark:border-slate-800">
                    <th className="text-left py-2 font-semibold">BIN</th>
                    <th className="text-left py-2 font-semibold">Emissor</th>
                    <th className="text-left py-2 font-semibold">Bandeira</th>
                    <th className="text-left py-2 font-semibold">Tier</th>
                    <th className="text-right py-2 font-semibold">Transações</th>
                    <th className="text-right py-2 font-semibold">Aprovação</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_BINS.map((b) => (
                    <tr key={b.bin} className="border-b border-slate-50 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="py-2 font-mono text-slate-900 dark:text-white">{b.bin}</td>
                      <td className="py-2 text-slate-700 dark:text-slate-200">{b.issuer}</td>
                      <td className="py-2 text-slate-500">{b.brand}</td>
                      <td className="py-2">
                        <Badge variant="outline" className="text-[10px]">{b.tier}</Badge>
                      </td>
                      <td className="py-2 text-right text-slate-700 dark:text-slate-200">{fmtInt(b.count)}</td>
                      <td className={cn(
                        'py-2 text-right font-bold',
                        b.approvalRate >= 90 ? 'text-emerald-600' : b.approvalRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                      )}>{b.approvalRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-red-500" />
              Análise de Recusas (Pareto)
            </h3>
            <p className="text-[10px] text-slate-500 mb-3">Concentração — 80% das recusas em poucas causas</p>
            <div className="space-y-2">
              {CARD_DECLINE_REASONS.slice(0, 5).map((d, idx) => {
                const cumulative = CARD_DECLINE_REASONS.slice(0, idx + 1).reduce((sum, r) => sum + r.share, 0);
                return (
                  <div key={d.code} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="truncate flex-1 text-slate-700 dark:text-slate-200">{d.reason}</span>
                      <span className="font-bold text-slate-900 dark:text-white ml-2">{d.share}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <div className="absolute h-full bg-red-300" style={{ width: `${cumulative}%`, opacity: 0.3 }} />
                      <div className="absolute h-full bg-red-500" style={{ width: `${d.share}%` }} />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5">acumulado {cumulative.toFixed(1)}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== ROW 4 — Fraude + Defesa de Disputas ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Inteligência Antifraude
              </h3>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 border-0 text-[10px]">
                {fmtCurrency(FRAUD_INSIGHTS.preventedLossBRL)} prevenido
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-500">Taxa de fraude</p>
                <p className="text-lg font-bold text-red-600">{FRAUD_INSIGHTS.fraudRate}%</p>
                <p className="text-[10px] text-emerald-600">{FRAUD_INSIGHTS.fraudRateChange}pp vs período</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-500">Sinalizadas</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{FRAUD_INSIGHTS.flagged}</p>
                <p className="text-[10px] text-slate-500">{FRAUD_INSIGHTS.trueFraud} confirmadas</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <p className="text-[10px] text-slate-500">Falsos positivos</p>
                <p className="text-lg font-bold text-amber-600">{FRAUD_INSIGHTS.falsePositives}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-[10px] text-slate-500">Falsos negativos</p>
                <p className="text-lg font-bold text-red-600">{FRAUD_INSIGHTS.falseNegatives}</p>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2 flex items-center gap-1">
              <Globe2 className="w-3 h-3" />
              Top países por risco
            </p>
            <div className="space-y-1.5">
              {FRAUD_INSIGHTS.topCountries.map((c) => (
                <div key={c.country} className="flex items-center justify-between text-xs">
                  <span className="text-slate-700 dark:text-slate-200">{c.country}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">{fmtInt(c.count)} tx</span>
                    <span className={cn(
                      'font-bold w-12 text-right',
                      c.fraudRate >= 2 ? 'text-red-600' : c.fraudRate >= 1 ? 'text-amber-600' : 'text-emerald-600'
                    )}>{c.fraudRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Gavel className="w-4 h-4 text-indigo-600" />
                Defesa de Disputas
              </h3>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 border-0 text-[10px]">
                Win rate {DISPUTE_DEFENSE.winRate}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-center">
                <p className="text-[10px] text-slate-500">Ganhas</p>
                <p className="text-lg font-bold text-emerald-600">{DISPUTE_DEFENSE.totalWon}</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-center">
                <p className="text-[10px] text-slate-500">Perdidas</p>
                <p className="text-lg font-bold text-red-600">{DISPUTE_DEFENSE.totalLost}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                <p className="text-[10px] text-slate-500">Pendentes</p>
                <p className="text-lg font-bold text-amber-600">{DISPUTE_DEFENSE.totalPending}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                <p className="text-[10px] text-slate-500">Valor em risco</p>
                <p className="text-sm font-bold text-amber-600">{fmtCurrency(DISPUTE_DEFENSE.amountAtRisk)}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-[10px] text-slate-500">Recuperado</p>
                <p className="text-sm font-bold text-emerald-600">{fmtCurrency(DISPUTE_DEFENSE.amountRecovered)}</p>
              </div>
            </div>

            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Distribuição de Chargebacks</p>
            <div className="space-y-1.5">
              {CHARGEBACK_DISTRIBUTION.slice(0, 5).map((c) => (
                <div key={c.reason}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-slate-700 dark:text-slate-200 truncate pr-2">{c.reason}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[10px]">{c.count}</span>
                      <span className={cn(
                        'font-bold w-10 text-right',
                        c.recoveryRate >= 50 ? 'text-emerald-600' : c.recoveryRate >= 25 ? 'text-amber-600' : 'text-red-600'
                      )}>{c.recoveryRate}% rec.</span>
                    </div>
                  </div>
                  <Progress value={c.share * 2.5} className="h-1 [&>div]:bg-indigo-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}