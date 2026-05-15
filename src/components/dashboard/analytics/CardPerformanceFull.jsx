import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CreditCard, TrendingUp, TrendingDown, ShieldCheck, RotateCw,
  AlertTriangle, Target, Activity, Building2, BarChart3, Zap,
} from 'lucide-react';
import {
  CARD_KPIS, CARD_BRANDS, CARD_INSTALLMENTS, CARD_VALUE_RANGES,
  CARD_DECLINE_REASONS, CARD_ISSUER_PERFORMANCE, CARD_HOURLY_APPROVAL,
  CARD_RETRY_FUNNEL,
} from './analyticsMockData';

const fmtCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v || 0);
const fmtInt = (v) => new Intl.NumberFormat('pt-BR').format(v || 0);

const TrendBadge = ({ value, inverted = false }) => {
  const positive = inverted ? value < 0 : value >= 0;
  const Icon = value >= 0 ? TrendingUp : TrendingDown;
  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded',
      positive ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50' : 'text-red-700 bg-red-100 dark:bg-red-900/50'
    )}>
      <Icon className="w-2.5 h-2.5" />
      {Math.abs(value).toFixed(value < 1 && value > -1 ? 2 : 1)}{Math.abs(value) < 1 ? 'pp' : '%'}
    </span>
  );
};

const KpiTile = ({ icon: Icon, label, value, sub, change, inverted, colorClass = 'text-slate-900' }) => (
  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
    <div className="flex items-center justify-between mb-1">
      <Icon className="w-3.5 h-3.5 text-slate-400" />
      {typeof change === 'number' && <TrendBadge value={change} inverted={inverted} />}
    </div>
    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
    <p className={cn('text-lg font-bold mt-0.5 dark:text-white', colorClass)}>{value}</p>
    {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

const rateColor = (r) => (r >= 88 ? 'text-emerald-600' : r >= 82 ? 'text-yellow-600' : 'text-red-600');
const rateBar   = (r) => (r >= 88 ? '[&>div]:bg-emerald-500' : r >= 82 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500');

export default function CardPerformanceFull() {
  const peak = CARD_HOURLY_APPROVAL.reduce((max, h) => (h.rate > max.rate ? h : max), CARD_HOURLY_APPROVAL[0]);
  const trough = CARD_HOURLY_APPROVAL.reduce((min, h) => (h.rate < min.rate ? h : min), CARD_HOURLY_APPROVAL[0]);

  return (
    <div className="space-y-4">
      {/* ===== ROW 1 — KPIs do topo ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <KpiTile icon={Target}        label="Aprovação"     value={`${CARD_KPIS.approvalRate}%`}      sub={`Meta ${CARD_KPIS.approvalRateTarget}%`} change={CARD_KPIS.approvalRateChange} />
        <KpiTile icon={CreditCard}    label="Tentativas"    value={fmtInt(CARD_KPIS.totalAttempts)}    sub={`${fmtInt(CARD_KPIS.totalApproved)} aprov.`} />
        <KpiTile icon={Activity}      label="Volume"        value={fmtCurrency(CARD_KPIS.totalVolume)} change={CARD_KPIS.totalVolumeChange} />
        <KpiTile icon={BarChart3}     label="Ticket Médio"  value={fmtCurrency(CARD_KPIS.avgTicket)}   change={CARD_KPIS.avgTicketChange} />
        <KpiTile icon={ShieldCheck}   label="3DS Cobertura" value={`${CARD_KPIS.threeDsUsage}%`}        sub={`+${CARD_KPIS.threeDsLiftPp}pp aprov.`} colorClass="text-blue-600" />
        <KpiTile icon={AlertTriangle} label="Chargeback"    value={`${CARD_KPIS.chargebackRate}%`}      change={CARD_KPIS.chargebackRateChange} inverted colorClass="text-amber-600" />
      </div>

      {/* ===== ROW 2 — Aprovação por Bandeira (rica) ===== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Aprovação por Bandeira</h3>
              <p className="text-xs text-slate-500">Volume, mix débito/crédito e taxa de aprovação</p>
            </div>
            <Badge variant="outline" className="text-[10px]">6 bandeiras</Badge>
          </div>

          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left py-2 font-semibold">Bandeira</th>
                  <th className="text-right py-2 font-semibold">Tentativas</th>
                  <th className="text-right py-2 font-semibold">Aprovados</th>
                  <th className="text-right py-2 font-semibold">Recusados</th>
                  <th className="text-right py-2 font-semibold">Volume</th>
                  <th className="text-right py-2 font-semibold">Débito/Crédito</th>
                  <th className="text-right py-2 font-semibold w-32">Taxa Aprov.</th>
                </tr>
              </thead>
              <tbody>
                {CARD_BRANDS.map((b) => (
                  <tr key={b.brand} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-5 rounded bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-[8px] font-black text-slate-600 dark:text-slate-300">
                          {b.label.substring(0, 4).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">{b.label}</span>
                        <span className="text-[10px] text-slate-400">({b.share}%)</span>
                      </div>
                    </td>
                    <td className="text-right py-2.5 text-slate-700 dark:text-slate-300">{fmtInt(b.count)}</td>
                    <td className="text-right py-2.5 text-emerald-600 font-semibold">{fmtInt(b.approved)}</td>
                    <td className="text-right py-2.5 text-red-500">{fmtInt(b.declined)}</td>
                    <td className="text-right py-2.5 text-slate-900 dark:text-white font-semibold">{fmtCurrency(b.volume)}</td>
                    <td className="text-right py-2.5">
                      <div className="inline-flex items-center gap-1">
                        <span className="text-[10px] text-blue-600">{b.debit}%</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-[10px] text-violet-600">{b.credit}%</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2 justify-end">
                        <Progress value={b.approvalRate} className={cn('h-1.5 w-16', rateBar(b.approvalRate))} />
                        <span className={cn('font-bold w-10 text-right', rateColor(b.approvalRate))}>{b.approvalRate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ===== ROW 3 — Parcelamento + Faixa de Valor ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Aprovação por Parcelamento</h3>
            <div className="space-y-3">
              {CARD_INSTALLMENTS.map((i) => (
                <div key={i.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{i.label}</span>
                      <span className="ml-2 text-[10px] text-slate-400">{fmtInt(i.count)} tx · {fmtCurrency(i.volume)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">MDR {i.mdr}%</span>
                      <span className={cn('font-bold', rateColor(i.approvalRate))}>{i.approvalRate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={i.approvalRate} className={cn('flex-1 h-1.5', rateBar(i.approvalRate))} />
                    <span className="text-[10px] text-slate-400 w-10 text-right">{i.share}%</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[10px] text-slate-500">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>Insight: parcelamentos 11x-12x têm <strong className="text-red-600">79.4%</strong> de aprovação — considere capping em 10x.</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Aprovação por Faixa de Valor</h3>
            <div className="space-y-3">
              {CARD_VALUE_RANGES.map((v) => (
                <div key={v.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{v.label}</span>
                      <span className="ml-2 text-[10px] text-slate-400">{fmtInt(v.count)} tx · ticket {fmtCurrency(v.avg)}</span>
                    </div>
                    <span className={cn('font-bold', rateColor(v.approvalRate))}>{v.approvalRate}%</span>
                  </div>
                  <Progress value={v.approvalRate} className={cn('h-1.5', rateBar(v.approvalRate))} />
                  <p className="text-[10px] text-slate-400">Principal motivo de recusa: <span className="font-mono text-slate-600 dark:text-slate-300">{v.declineMain}</span></p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== ROW 4 — Análise de Recusas + Retry Intelligence ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Análise de Recusas</h3>
              <Badge variant="outline" className="text-[10px]">{fmtInt(CARD_KPIS.totalDeclined)} recusas</Badge>
            </div>
            <div className="space-y-2">
              {CARD_DECLINE_REASONS.map((d) => (
                <div key={d.code} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="w-10 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">{d.code}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{d.reason}</p>
                    <p className="text-[10px] text-slate-500">{fmtInt(d.count)} tx · {d.share}% do total</p>
                  </div>
                  {d.recoverable ? (
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 text-[10px] border-0">Recuperável</Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px]">Definitivo</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-emerald-600" />
                Retry Intelligence
              </h3>
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 border-0 text-[10px]">
                +{fmtCurrency(CARD_RETRY_FUNNEL.recoveredVolume)} recuperado
              </Badge>
            </div>

            {/* Funil */}
            <div className="space-y-2">
              {[
                { label: 'Recusas no período', value: CARD_RETRY_FUNNEL.declined, pct: 100, color: 'bg-slate-400' },
                { label: 'Elegíveis para retry', value: CARD_RETRY_FUNNEL.eligibleForRetry, pct: (CARD_RETRY_FUNNEL.eligibleForRetry / CARD_RETRY_FUNNEL.declined) * 100, color: 'bg-blue-400' },
                { label: 'Re-tentadas', value: CARD_RETRY_FUNNEL.retried, pct: (CARD_RETRY_FUNNEL.retried / CARD_RETRY_FUNNEL.declined) * 100, color: 'bg-indigo-400' },
                { label: 'Recuperadas com sucesso', value: CARD_RETRY_FUNNEL.recovered, pct: (CARD_RETRY_FUNNEL.recovered / CARD_RETRY_FUNNEL.declined) * 100, color: 'bg-emerald-500' },
              ].map((step) => (
                <div key={step.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-200">{step.label}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{fmtInt(step.value)} <span className="text-slate-400 font-normal">({step.pct.toFixed(0)}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={cn('h-full', step.color)} style={{ width: `${step.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-[10px] text-slate-500">Taxa de recuperação</p>
                <p className="text-base font-bold text-emerald-600">{CARD_KPIS.retryRecoveredRate}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500">Tentativas médias</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{CARD_RETRY_FUNNEL.avgAttempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== ROW 5 — Performance por Emissor + Aprovação por Hora ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Performance por Emissor
            </h3>
            <div className="space-y-2">
              {CARD_ISSUER_PERFORMANCE.map((i) => (
                <div key={i.issuer} className="flex items-center gap-3 text-xs">
                  <span className="w-28 truncate font-semibold text-slate-700 dark:text-slate-200">{i.issuer}</span>
                  <Progress value={i.approvalRate} className={cn('flex-1 h-1.5', rateBar(i.approvalRate))} />
                  <span className={cn('w-12 text-right font-bold', rateColor(i.approvalRate))}>{i.approvalRate}%</span>
                  <span className="w-14 text-right text-[10px] text-emerald-600">+{i.retryLift}pp retry</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Aprovação por Hora do Dia</h3>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-emerald-600">Pico: {peak.hour}h · {peak.rate.toFixed(1)}%</span>
                <span className="text-red-500">Vale: {trough.hour}h · {trough.rate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-end gap-0.5 h-32">
              {CARD_HOURLY_APPROVAL.map((h) => {
                const barHeight = ((h.rate - 70) / 25) * 100;
                const color = h.rate >= 88 ? 'bg-emerald-500' : h.rate >= 82 ? 'bg-yellow-400' : 'bg-red-400';
                return (
                  <div key={h.hour} className="flex-1 flex flex-col items-center justify-end group relative">
                    <div className={cn('w-full rounded-t transition-all hover:opacity-80', color)} style={{ height: `${barHeight}%` }} />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-slate-900 text-white text-[10px] rounded px-1.5 py-0.5 whitespace-nowrap">
                      {h.hour}h: {h.rate.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-slate-400">
              <span>00h</span><span>06h</span><span>12h</span><span>18h</span><span>23h</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}