import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  QrCode, Clock, Zap, TrendingUp, TrendingDown, Building2, Repeat,
  Fingerprint, RotateCcw, Target, AlertCircle, Sparkles,
} from 'lucide-react';
import {
  PIX_KPIS, PIX_FLOW_DISTRIBUTION, PIX_TIMING_BUCKETS, PIX_BANK_DISTRIBUTION,
  PIX_VALUE_RANGES, PIX_MANDATES, PIX_REFUND_REASONS, PIX_HOURLY_CONVERSION,
} from './analyticsMockData';

const fmtCurrency = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact', maximumFractionDigits: 1 }).format(v || 0);
const fmtInt = (v) => new Intl.NumberFormat('pt-BR').format(v || 0);

const KpiTile = ({ icon: Icon, label, value, sub, change, colorClass }) => {
  const positive = (change || 0) >= 0;
  return (
    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between mb-1">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        {typeof change === 'number' && (
          <span className={cn(
            'inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded',
            positive ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/50' : 'text-red-700 bg-red-100 dark:bg-red-900/50'
          )}>
            {positive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
      <p className={cn('text-lg font-bold mt-0.5 dark:text-white', colorClass || 'text-slate-900')}>{value}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
};

const convColor = (r) => (r >= 75 ? 'text-emerald-600' : r >= 65 ? 'text-yellow-600' : 'text-red-600');
const convBar   = (r) => (r >= 75 ? '[&>div]:bg-emerald-500' : r >= 65 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500');

export default function PixPerformanceFull() {
  const peak = PIX_HOURLY_CONVERSION.reduce((m, h) => (h.rate > m.rate ? h : m), PIX_HOURLY_CONVERSION[0]);
  const trough = PIX_HOURLY_CONVERSION.reduce((m, h) => (h.rate < m.rate ? h : m), PIX_HOURLY_CONVERSION[0]);

  return (
    <div className="space-y-4">
      {/* ===== ROW 1 — KPIs ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <KpiTile icon={Target}      label="Conversão"        value={`${PIX_KPIS.conversionRate}%`}     change={PIX_KPIS.conversionRateChange} colorClass="text-teal-600" />
        <KpiTile icon={QrCode}      label="QRs Gerados"     value={fmtInt(PIX_KPIS.totalGenerated)}    sub={`${fmtInt(PIX_KPIS.totalPaid)} pagos`} />
        <KpiTile icon={Clock}       label="Tempo Médio"     value={PIX_KPIS.avgPaymentTime}            sub={`Mediana ${PIX_KPIS.medianPaymentTime}`} />
        <KpiTile icon={Zap}         label="Volume"           value={fmtCurrency(PIX_KPIS.totalVolume)} sub={`Ticket ${fmtCurrency(PIX_KPIS.avgTicket)}`} />
        <KpiTile icon={AlertCircle} label="Expirados"        value={`${((PIX_KPIS.totalExpired / PIX_KPIS.totalGenerated) * 100).toFixed(1)}%`} sub={`${fmtInt(PIX_KPIS.totalExpired)} QRs`} colorClass="text-amber-600" />
        <KpiTile icon={RotateCcw}   label="Devoluções"       value={`${PIX_KPIS.refundRate}%`}          sub="Sobre pagos" colorClass="text-slate-700" />
      </div>

      {/* ===== ROW 2 — Distribuição por Fluxo PIX (Manual / Automático / Biometria) ===== */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-violet-500" />
                Distribuição por Fluxo PIX
              </h3>
              <p className="text-xs text-slate-500">Manual vs. Automático (PIX recorrente) vs. Biometria (Open Finance)</p>
            </div>
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 border-0 text-[10px]">
              Open Finance ativo
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {PIX_FLOW_DISTRIBUTION.map((f) => {
              const color = f.flow === 'manual' ? 'teal' : f.flow === 'automatic' ? 'blue' : 'violet';
              const bg = f.flow === 'manual' ? 'from-teal-500/10' : f.flow === 'automatic' ? 'from-blue-500/10' : 'from-violet-500/10';
              const icon = f.flow === 'manual' ? QrCode : f.flow === 'automatic' ? Repeat : Fingerprint;
              const Icon = icon;
              return (
                <div key={f.flow} className={cn('p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br to-transparent', bg)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn('w-4 h-4', `text-${color}-600`)} />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{f.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{f.share}%</p>
                  <p className="text-[10px] text-slate-500 mb-3">do volume PIX · {fmtCurrency(f.volume)}</p>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Conversão</span>
                      <span className={cn('font-bold', convColor(f.conversion))}>{f.conversion}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tempo médio</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200">{f.avgTime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-500">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span>Insight: <strong className="text-violet-700">PIX Biometria converte +28pp acima do manual</strong> — considere migrar checkouts elegíveis.</span>
          </div>
        </CardContent>
      </Card>

      {/* ===== ROW 3 — Tempo até pagamento + Por Faixa de Valor ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Tempo até Pagamento
            </h3>
            <div className="space-y-2">
              {PIX_TIMING_BUCKETS.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-200 font-medium">{b.label}</span>
                    <span className="text-slate-900 dark:text-white font-bold">{fmtInt(b.count)} <span className="text-slate-400 font-normal">({b.share}%)</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={cn(
                      'h-full',
                      b.color === 'emerald' && 'bg-emerald-500',
                      b.color === 'blue' && 'bg-blue-500',
                      b.color === 'yellow' && 'bg-yellow-500',
                      b.color === 'amber' && 'bg-amber-500',
                      b.color === 'red' && 'bg-red-500',
                    )} style={{ width: `${b.share}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                <p className="text-[10px] text-slate-500">{`< 5 min`}</p>
                <p className="font-bold text-emerald-600">82.4%</p>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-[10px] text-slate-500">{`> 15 min (abandono)`}</p>
                <p className="font-bold text-red-600">6.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Conversão por Faixa de Valor</h3>
            <div className="space-y-2.5">
              {PIX_VALUE_RANGES.map((v) => (
                <div key={v.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{v.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">{fmtInt(v.count)} QRs</span>
                      <span className={cn('font-bold w-10 text-right', convColor(v.conversion))}>{v.conversion}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={v.conversion} className={cn('flex-1 h-1.5', convBar(v.conversion))} />
                    <span className="text-[10px] text-red-500 w-12 text-right">{v.expired}% exp.</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              Valores acima de R$ 5k têm <strong className="text-red-600">36% de expiração</strong> — alerta de fricção
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== ROW 4 — Banco Pagador + Mandates Open Finance ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              Distribuição por Banco Pagador
            </h3>
            <div className="space-y-2">
              {PIX_BANK_DISTRIBUTION.map((b) => (
                <div key={b.bank} className="flex items-center gap-3 text-xs">
                  <span className="w-24 truncate font-semibold text-slate-700 dark:text-slate-200">{b.bank}</span>
                  <Progress value={b.share * 2.5} className="flex-1 h-1.5 [&>div]:bg-teal-500" />
                  <span className="w-12 text-right text-slate-500">{b.share}%</span>
                  <span className={cn('w-12 text-right font-bold', convColor(b.conversion))}>{b.conversion}%</span>
                  <span className="w-16 text-right text-[10px] text-slate-400">{fmtCurrency(b.volume)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-gradient-to-br from-violet-50 to-white dark:from-violet-900/20 dark:to-slate-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Repeat className="w-4 h-4 text-violet-600" />
                Mandates PIX Automático
              </h3>
              <Badge className="bg-violet-200 text-violet-800 dark:bg-violet-900/60 border-0 text-[10px]">Open Finance</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-violet-200/50">
                <p className="text-[10px] text-slate-500">Ativos</p>
                <p className="text-xl font-bold text-violet-700 dark:text-violet-300">{fmtInt(PIX_MANDATES.active)}</p>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-amber-200/50">
                <p className="text-[10px] text-slate-500">Expirando ≤ 30d</p>
                <p className="text-xl font-bold text-amber-600">{fmtInt(PIX_MANDATES.expiringSoon)}</p>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-red-200/50">
                <p className="text-[10px] text-slate-500">Revogados</p>
                <p className="text-xl font-bold text-red-600">{fmtInt(PIX_MANDATES.revoked)}</p>
              </div>
              <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200">
                <p className="text-[10px] text-slate-500">Taxa de falha</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{PIX_MANDATES.failureRate}%</p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/40">
              <p className="text-[10px] text-violet-700 dark:text-violet-200">Volume recorrente mensal</p>
              <p className="text-lg font-bold text-violet-900 dark:text-violet-100">{fmtCurrency(PIX_MANDATES.monthlyRecurringVolume)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== ROW 5 — Conversão por Hora + Devoluções ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Conversão por Hora do Dia</h3>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-emerald-600">Pico: {peak.hour}h · {peak.rate.toFixed(1)}%</span>
                <span className="text-red-500">Vale: {trough.hour}h · {trough.rate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-end gap-0.5 h-32">
              {PIX_HOURLY_CONVERSION.map((h) => {
                const barHeight = ((h.rate - 55) / 25) * 100;
                const color = h.rate >= 75 ? 'bg-teal-500' : h.rate >= 65 ? 'bg-yellow-400' : 'bg-red-400';
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

        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-slate-400" />
              Motivos de Devolução
            </h3>
            <div className="space-y-2">
              {PIX_REFUND_REASONS.map((r) => (
                <div key={r.reason}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-700 dark:text-slate-200 truncate pr-2">{r.reason}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{fmtInt(r.count)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={r.share} className="flex-1 h-1 [&>div]:bg-slate-400" />
                    <span className="text-[10px] text-slate-500 w-10 text-right">{r.share}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}