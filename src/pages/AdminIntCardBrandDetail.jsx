import React, { useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard, Edit, Download, AlertTriangle, ShieldAlert, TrendingUp } from 'lucide-react';
import { CARD_BRANDS, fmtMoney, fmtNumber, fmtPct } from '@/components/catalogs/catalogMocks';
import CatalogStatusBadge from '@/components/catalogs/CatalogStatusBadge';
import MetricChip from '@/components/catalogs/MetricChip';

const TYPE_LABEL = { credit: 'Crédito', debit: 'Débito', prepaid: 'Pré-pago', voucher: 'Voucher' };

export default function AdminIntCardBrandDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'brand_visa';
  const brand = useMemo(() => CARD_BRANDS.find(b => b.id === id) || CARD_BRANDS[0], [id]);

  const dangerLevel = brand.current_chargeback_pct >= brand.chargeback_threshold_pct
    ? 'high'
    : brand.current_chargeback_pct >= brand.chargeback_threshold_pct * 0.7
      ? 'warning'
      : 'ok';

  const interchangeBreakdown = brand.interchange_avg + brand.scheme_fee_avg + brand.acquirer_fee_avg;

  return (
    <div className="space-y-6">
      <PageHeader
        title={brand.name}
        subtitle={`${TYPE_LABEL[brand.type]} • ${brand.coverage}`}
        icon={CreditCard}
        breadcrumbs={[
          { label: 'Catálogos', page: 'AdminIntAcquirers' },
          { label: 'Bandeiras', page: 'AdminIntCardBrands' },
          { label: brand.name, page: 'AdminIntCardBrandDetail' }
        ]}
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Dossiê PDF</Button>
            <Button className="gap-2"><Edit className="w-4 h-4" />Editar</Button>
          </>
        }
      />

      {/* Cabeçalho */}
      <Card>
        <CardContent className="p-6 flex flex-col lg:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-200 dark:bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain p-2" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black">{brand.name}</h2>
              <CatalogStatusBadge status={brand.status} />
              <Badge variant="outline">{TYPE_LABEL[brand.type]}</Badge>
              <Badge variant="secondary">{brand.coverage}</Badge>
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${brand.health_score >= 90 ? 'bg-emerald-100 text-emerald-700' : brand.health_score >= 80 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} title="Health score">
                {brand.health_score}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{brand.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Alerta crítico de programa */}
      {dangerLevel !== 'ok' && (
        <Card className={dangerLevel === 'high' ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-amber-300 bg-amber-50 dark:bg-amber-900/20'}>
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldAlert className={`w-6 h-6 flex-shrink-0 ${dangerLevel === 'high' ? 'text-red-600' : 'text-amber-600'}`} />
            <div className="flex-1">
              <p className={`font-semibold ${dangerLevel === 'high' ? 'text-red-800' : 'text-amber-800'} dark:text-amber-200`}>
                {dangerLevel === 'high' ? 'Threshold de chargeback excedido' : 'Próximo do threshold do programa'}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Chargeback atual: <strong>{fmtPct(brand.current_chargeback_pct, 2)}</strong> • Threshold: <strong>{fmtPct(brand.chargeback_threshold_pct, 2)}</strong> • Programas: {brand.monitoring_programs.join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricChip label="TPV/mês" value={fmtMoney(brand.tpv_monthly)} color="emerald" icon={TrendingUp} />
        <MetricChip label="Transações/mês" value={fmtNumber(brand.transactions_monthly)} color="blue" />
        <MetricChip label="Aprovação" value={fmtPct(brand.approval_rate, 1)} color={brand.approval_rate >= 95 ? 'emerald' : 'amber'} />
        <MetricChip label="Chargeback" value={fmtPct(brand.current_chargeback_pct, 2)} color={dangerLevel === 'high' ? 'red' : dangerLevel === 'warning' ? 'amber' : 'emerald'} />
        <MetricChip label="Cancelamento" value={fmtPct(brand.cancellation_rate, 2)} color="slate" />
      </div>

      <Tabs defaultValue="capabilities">
        <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1 flex flex-wrap h-auto">
          <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
          <TabsTrigger value="programs">Programas & Regras</TabsTrigger>
          <TabsTrigger value="pricing">Estrutura de Pricing</TabsTrigger>
          <TabsTrigger value="distribution">Distribuição</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="capabilities" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-5 grid grid-cols-2 lg:grid-cols-4 gap-3">
              <CapabilityCard label="NFC" value={brand.supports_nfc ? brand.nfc_version : 'Não suporta'} ok={brand.supports_nfc} />
              <CapabilityCard label="3DS" value={brand.supports_3ds ? `v${brand.ds_version}` : 'Não suporta'} ok={brand.supports_3ds} />
              <CapabilityCard label="Tokenização" value={brand.supports_tokenization ? 'Suportada' : 'Não suporta'} ok={brand.supports_tokenization} />
              <CapabilityCard label="Parcelas máx." value={brand.supports_installments ? `${brand.max_installments}x` : 'Sem parcela'} ok={brand.supports_installments} />
            </CardContent>
          </Card>
          {brand.vetoed_mccs.length > 0 && (
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" />MCCs vetados pela bandeira</h3>
                <div className="flex flex-wrap gap-2">
                  {brand.vetoed_mccs.map(m => <Badge key={m} variant="destructive" className="font-mono">{m}</Badge>)}
                </div>
                <p className="text-xs text-slate-500 mt-3">Lojistas com esses MCCs não podem usar a bandeira por política da própria rede.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="programs" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold">Programas de monitoramento vigentes</h3>
              {brand.monitoring_programs.length > 0 ? brand.monitoring_programs.map(p => (
                <div key={p} className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">{p}</Badge>
                    <span className="text-xs text-slate-500">Threshold alerta: {fmtPct(brand.chargeback_threshold_pct, 2)} • Alta: {fmtPct(brand.chargeback_threshold_high_pct, 2)}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${dangerLevel === 'high' ? 'bg-red-500' : dangerLevel === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min((brand.current_chargeback_pct / brand.chargeback_threshold_high_pct) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Atual: <strong>{fmtPct(brand.current_chargeback_pct, 2)}</strong></p>
                </div>
              )) : <p className="text-sm text-slate-500">Sem programas de monitoramento ativos para esta bandeira.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <h3 className="font-bold">Composição do MDR (média)</h3>
              <p className="text-xs text-slate-500">Exemplo de breakdown de uma transação típica de crédito.</p>
              <div className="space-y-2 mt-3">
                <PricingBar label="Intercâmbio (emissor)" pct={(brand.interchange_avg / interchangeBreakdown) * 100} value={fmtPct(brand.interchange_avg, 2)} color="bg-blue-500" />
                <PricingBar label="Scheme fee (bandeira)" pct={(brand.scheme_fee_avg / interchangeBreakdown) * 100} value={fmtPct(brand.scheme_fee_avg, 2)} color="bg-purple-500" />
                <PricingBar label="Acquirer fee (adquirente)" pct={(brand.acquirer_fee_avg / interchangeBreakdown) * 100} value={fmtPct(brand.acquirer_fee_avg, 2)} color="bg-emerald-500" />
              </div>
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="font-semibold">MDR base total</span>
                <span className="font-bold text-lg">{fmtPct(interchangeBreakdown, 2)}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold mb-3">Distribuição por canal</h3>
                <DistributionList items={brand.channel_distribution} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-bold mb-3">Distribuição por modalidade</h3>
                <DistributionList items={brand.modality_distribution} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <HistoryItem date="08/04/2026" who="Compliance" desc="Threshold VAMP ajustado conforme nova diretiva da bandeira" />
              <HistoryItem date="15/02/2026" who="Operações" desc="Habilitada tokenização avançada (token-on-file)" />
              <HistoryItem date="01/01/2026" who="Comercial" desc="Reajuste anual de scheme fee aplicado" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CapabilityCard({ label, value, ok }) {
  return (
    <div className={`p-3 rounded-lg border ${ok ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20' : 'bg-slate-50 border-slate-200 dark:bg-slate-800/50'}`}>
      <p className="text-[10px] uppercase font-semibold text-slate-500">{label}</p>
      <p className={`text-sm font-bold mt-1 ${ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-600'}`}>{value}</p>
    </div>
  );
}

function PricingBar({ label, pct, value, color }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span>{label}</span>
        <span className="font-mono font-semibold">{value} ({pct.toFixed(0)}%)</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
        <div className={`${color} h-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DistributionList({ items }) {
  return (
    <div className="space-y-2">
      {Object.entries(items).map(([k, v]) => (
        <div key={k}>
          <div className="flex justify-between text-xs mb-1">
            <span className="capitalize">{k.replace('_', ' ')}</span>
            <span className="font-mono font-semibold">{v}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="bg-[#2bc196] h-full" style={{ width: `${v}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HistoryItem({ date, who, desc }) {
  return (
    <div className="flex gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="w-2 h-2 rounded-full bg-[#2bc196] mt-2 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm">{desc}</p>
        <p className="text-xs text-slate-500 mt-1">{date} • {who}</p>
      </div>
    </div>
  );
}