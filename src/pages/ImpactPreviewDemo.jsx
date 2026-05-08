import React, { useState } from 'react';
import { Sparkles, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import PageHeader from '@/components/common/PageHeader';
import DiaInsightCard from '@/components/common/DiaInsightCard';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

// Baseline simulado (estado atual)
const BASELINE = {
  scoreThreshold: 80,
  pixDiscount: 0,
  installmentsFree: 3,
  autoRefund: false,
  approvalRate: 89.4,
  conversionRate: 4.2,
  fraudRate: 0.08,
  avgTicket: 287,
};

export default function ImpactPreviewDemo() {
  const { toast } = useToast();
  const [scoreThreshold, setScoreThreshold] = useState(BASELINE.scoreThreshold);
  const [pixDiscount, setPixDiscount] = useState(BASELINE.pixDiscount);
  const [installmentsFree, setInstallmentsFree] = useState(BASELINE.installmentsFree);
  const [autoRefund, setAutoRefund] = useState(BASELINE.autoRefund);

  // Modelo de impacto (heurístico, só pra demo)
  const newApproval = +(BASELINE.approvalRate + (BASELINE.scoreThreshold - scoreThreshold) * 0.08).toFixed(2);
  const newFraud = +(BASELINE.fraudRate + (BASELINE.scoreThreshold - scoreThreshold) * 0.0015).toFixed(3);
  const newConversion = +(BASELINE.conversionRate + pixDiscount * 0.12 + (installmentsFree - 3) * 0.05).toFixed(2);
  const monthlyTransactions = 32_000;
  const newRevenue = Math.round(monthlyTransactions * newConversion / 100 * BASELINE.avgTicket);
  const baselineRevenue = Math.round(monthlyTransactions * BASELINE.conversionRate / 100 * BASELINE.avgTicket);
  const revenueDelta = newRevenue - baselineRevenue;

  const reset = () => {
    setScoreThreshold(BASELINE.scoreThreshold);
    setPixDiscount(BASELINE.pixDiscount);
    setInstallmentsFree(BASELINE.installmentsFree);
    setAutoRefund(BASELINE.autoRefund);
  };

  const dirty = scoreThreshold !== BASELINE.scoreThreshold || pixDiscount !== BASELINE.pixDiscount || installmentsFree !== BASELINE.installmentsFree || autoRefund !== BASELINE.autoRefund;

  const Comparator = ({ label, baseline, current, suffix = '', invert = false, format = 'number' }) => {
    const diff = current - baseline;
    const positive = invert ? diff < 0 : diff > 0;
    const negative = invert ? diff > 0 : diff < 0;
    const fmt = (v) => format === 'currency' ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }) : `${v}${suffix}`;
    return (
      <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-bold">{fmt(current)}</span>
            <span className="text-xs text-slate-400">de {fmt(baseline)}</span>
          </div>
        </div>
        {diff !== 0 && (
          <Badge className={cn('gap-1', positive && 'bg-emerald-500/10 text-emerald-600', negative && 'bg-red-500/10 text-red-600')}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {diff > 0 ? '+' : ''}{format === 'currency' ? fmt(diff) : `${diff.toFixed(format === 'number' ? 1 : 2)}${suffix}`}
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Preview de impacto" subtitle="Veja o efeito antes de salvar — modelo determinístico" icon={Sparkles} sparkles
        actions={
          <div className="flex items-center gap-2">
            {dirty && <Button variant="outline" size="sm" onClick={reset} className="gap-2"><RotateCcw className="w-4 h-4" /> Restaurar</Button>}
            <Button size="sm" onClick={() => { toast({ title: 'Configurações salvas', description: 'Mudanças aplicadas.' }); reset(); }} disabled={!dirty} className="bg-[#2bc196] hover:bg-[#25a880] gap-2">
              <Save className="w-4 h-4" /> Salvar
            </Button>
          </div>
        } />

      <DiaInsightCard variant="info" title="Como funciona o Preview de Impacto"
        description="Você ajusta as configurações abaixo (regras antifraude, descontos, parcelamento). À direita você vê em tempo real o impacto estimado nas métricas-chave do seu negócio. Nada é salvo até você clicar em 'Salvar'." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Configurações</h3>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Score antifraude (threshold)</label>
              <Badge variant="outline">{scoreThreshold}</Badge>
            </div>
            <p className="text-xs text-slate-500">Score acima do threshold é bloqueado. Menor = mais permissivo.</p>
            <Slider value={[scoreThreshold]} onValueChange={(v) => setScoreThreshold(v[0])} min={40} max={100} step={5} />
            <div className="flex justify-between text-[10px] text-slate-400"><span>Permissivo</span><span>Rigoroso</span></div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Desconto PIX</label>
              <Badge variant="outline">{pixDiscount}%</Badge>
            </div>
            <p className="text-xs text-slate-500">Quanto desconto oferecer para pagamento via PIX.</p>
            <Slider value={[pixDiscount]} onValueChange={(v) => setPixDiscount(v[0])} min={0} max={15} step={1} />
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Parcelas sem juros</label>
              <Badge variant="outline">até {installmentsFree}x</Badge>
            </div>
            <p className="text-xs text-slate-500">Quantidade máxima de parcelas sem juros.</p>
            <Slider value={[installmentsFree]} onValueChange={(v) => setInstallmentsFree(v[0])} min={1} max={12} step={1} />
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Auto-reembolso de pré-CB</p>
              <p className="text-xs text-slate-500">Reembolsa automaticamente para evitar chargebacks.</p>
            </div>
            <Switch checked={autoRefund} onCheckedChange={setAutoRefund} />
          </div>
        </div>

        {/* Impact preview */}
        <div className="space-y-5 lg:sticky lg:top-20 self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Impacto previsto (mensal)</h3>
            <Badge className="bg-violet-500/10 text-violet-600 border-violet-500/30 gap-1">
              <Sparkles className="w-3 h-3" /> Modelo determinístico
            </Badge>
          </div>

          <div className="rounded-2xl border border-[#2bc196]/30 bg-gradient-to-br from-[#2bc196]/10 to-transparent p-6">
            <p className="text-xs font-semibold text-[#2bc196] uppercase tracking-wider mb-1">Receita estimada</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{newRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</span>
              {revenueDelta !== 0 && (
                <Badge className={cn('gap-1 text-sm', revenueDelta > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600')}>
                  {revenueDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {revenueDelta > 0 ? '+' : ''}{revenueDelta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                </Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">vs baseline {baselineRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}</p>
          </div>

          <div className="space-y-2">
            <Comparator label="Taxa de aprovação" baseline={BASELINE.approvalRate} current={newApproval} suffix="%" />
            <Comparator label="Taxa de conversão checkout" baseline={BASELINE.conversionRate} current={newConversion} suffix="%" />
            <Comparator label="Taxa de fraude" baseline={BASELINE.fraudRate} current={newFraud} suffix="%" invert />
          </div>

          {scoreThreshold < 60 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Risco de fraude elevado</p>
                <p className="text-xs text-amber-600/80 mt-0.5">Score abaixo de 60 aumenta risco de chargeback. Monitorar VDMP/ECM.</p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 p-4 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-[#2bc196] flex-shrink-0 mt-0.5" />
            <span>Ao salvar, mudanças entram em vigor imediatamente e ficam registradas no Audit Trail. Você pode reverter a qualquer momento.</span>
          </div>
        </div>
      </div>
    </div>
  );
}