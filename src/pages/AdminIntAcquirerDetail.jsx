import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building, Edit, Download, ExternalLink, AlertTriangle, CheckCircle2, FileText, Users, TrendingUp, Calendar, Mail } from 'lucide-react';
import { ACQUIRERS, ACQUIRER_MDR_MATRIX, fmtMoney, fmtNumber, fmtPct } from '@/components/catalogs/catalogMocks';
import CatalogStatusBadge from '@/components/catalogs/CatalogStatusBadge';
import MetricChip from '@/components/catalogs/MetricChip';

const TYPE_LABEL = { full_acquirer: 'Full Acquirer', sub_acquirer: 'Sub-acquirer' };

export default function AdminIntAcquirerDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'acq_cielo';
  const acq = useMemo(() => ACQUIRERS.find(a => a.id === id) || ACQUIRERS[0], [id]);
  const matrix = ACQUIRER_MDR_MATRIX[acq.id] || ACQUIRER_MDR_MATRIX.acq_cielo;

  return (
    <div className="space-y-6">
      <PageHeader
        title={acq.name}
        subtitle={`${TYPE_LABEL[acq.type]} • ${acq.country}`}
        icon={Building}
        breadcrumbs={[
          { label: 'Catálogos', page: 'AdminIntAcquirers' },
          { label: 'Adquirentes', page: 'AdminIntAcquirers' },
          { label: acq.name, page: 'AdminIntAcquirerDetail' }
        ]}
        actions={
          <>
            <Button variant="outline" className="gap-2"><Download className="w-4 h-4" />Dossiê PDF</Button>
            <Button className="gap-2"><Edit className="w-4 h-4" />Editar</Button>
          </>
        }
      />

      {/* Cabeçalho com identificação */}
      <Card>
        <CardContent className="p-6 flex flex-col lg:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-200 dark:bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img src={acq.logo} alt={acq.name} className="max-w-full max-h-full object-contain p-2" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-black">{acq.name}</h2>
              <CatalogStatusBadge status={acq.status} />
              <Badge variant="outline" className="font-mono text-xs">{acq.id}</Badge>
              <Badge variant="secondary">{TYPE_LABEL[acq.type]}</Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{acq.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Contrato: {acq.contract.start} → {acq.contract.end || 'Indefinido'}</span>
              {acq.contract.alert && <Badge variant="destructive" className="text-[10px]"><AlertTriangle className="w-3 h-3 mr-1" />Vencendo</Badge>}
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />Gestor: {acq.commercial_manager.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricChip label="TPV/mês" value={fmtMoney(acq.tpv_monthly)} color="emerald" icon={TrendingUp} />
        <MetricChip label="Receita PagSmile" value={fmtMoney(acq.revenue_monthly)} color="purple" />
        <MetricChip label="Lojistas" value={fmtNumber(acq.merchants_linked)} color="blue" icon={Users} />
        <MetricChip label="Aprovação" value={acq.approval_rate ? fmtPct(acq.approval_rate, 1) : '—'} color={acq.approval_rate >= 95 ? 'emerald' : 'amber'} />
        <MetricChip label="Chargeback" value={acq.chargeback_rate ? fmtPct(acq.chargeback_rate, 2) : '—'} color={acq.chargeback_rate <= 0.2 ? 'emerald' : 'amber'} />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="capabilities" className="space-y-4">
        <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1 flex flex-wrap h-auto">
          <TabsTrigger value="capabilities">Capacidades Técnicas</TabsTrigger>
          <TabsTrigger value="commercial">Comercial e Contratual</TabsTrigger>
          <TabsTrigger value="mdr">MDR Mínimo (Matriz)</TabsTrigger>
          <TabsTrigger value="metrics">Métricas Operacionais</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Capacidades */}
        <TabsContent value="capabilities" className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div>
                <h3 className="font-bold mb-3">Bandeiras processáveis</h3>
                <div className="flex flex-wrap gap-2">
                  {acq.brands.map(b => <Badge key={b} variant="outline" className="capitalize">{b}</Badge>)}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-3">Canais suportados</h3>
                <div className="flex flex-wrap gap-2">
                  {acq.channels.map(c => <Badge key={c} variant="secondary" className="uppercase">{c}</Badge>)}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-3">Modalidades</h3>
                <div className="flex flex-wrap gap-2">
                  {acq.modalities.map(m => <Badge key={m} variant="outline">{m}</Badge>)}
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <CapabilityCard label="3DS" value={acq.supports_3ds ? `Suportado (v${acq.ds_version})` : 'Não suportado'} ok={acq.supports_3ds} />
                <CapabilityCard label="Tokenização" value={acq.supports_tokenization ? 'Suportado' : 'Não suportado'} ok={acq.supports_tokenization} />
                <CapabilityCard label="Antecipação" value={acq.supports_anticipation ? 'Nativa' : 'Não suportada'} ok={acq.supports_anticipation} />
                <CapabilityCard label="Webhook" value={acq.supports_webhook ? 'Tempo real' : 'Polling apenas'} ok={acq.supports_webhook} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comercial */}
        <TabsContent value="commercial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold flex items-center gap-2"><FileText className="w-4 h-4" />Contrato vigente</h3>
                <Field label="Início" value={acq.contract.start} />
                <Field label="Fim" value={acq.contract.end || 'Indefinido'} />
                <Field label="Alerta de vencimento" value={acq.contract.alert ? 'Próximos 90 dias' : 'OK'} alert={acq.contract.alert} />
                <Button variant="outline" size="sm" className="gap-2"><ExternalLink className="w-3 h-3" />Ver contrato</Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold">Pricing & Spread</h3>
                <Field label="Spread médio aplicado pela PagSmile" value={fmtPct(acq.spread_avg, 2)} />
                <Field label="SLA médio de credenciamento" value={acq.sla_credentialing_days ? `${acq.sla_credentialing_days} dias` : '—'} />
                <Field label="Gestor de conta" value={`${acq.commercial_manager.name} (${acq.commercial_manager.email})`} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MDR Mínimo */}
        <TabsContent value="mdr" className="space-y-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 text-left font-semibold">Bandeira</th>
                    <th className="p-3 text-left font-semibold">Modalidade</th>
                    <th className="p-3 text-left font-semibold">Parcelas</th>
                    <th className="p-3 text-right font-semibold">Custo do adquirente</th>
                    <th className="p-3 text-right font-semibold">MDR mínimo PagSmile</th>
                    <th className="p-3 text-right font-semibold">Margem</th>
                    <th className="p-3 text-right font-semibold">Benchmark mercado</th>
                    <th className="p-3 text-center font-semibold">Planos no mín.</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => {
                    const margin = row.our_min - row.acquirer_cost;
                    const tight = row.plans_at_min >= 3;
                    return (
                      <tr key={i} className={`border-b border-slate-100 dark:border-slate-800 ${tight ? 'bg-amber-50/40 dark:bg-amber-900/10' : ''}`}>
                        <td className="p-3 font-medium">{row.brand}</td>
                        <td className="p-3">{row.modality}</td>
                        <td className="p-3 text-slate-500">{row.installments}</td>
                        <td className="p-3 text-right font-mono">{fmtPct(row.acquirer_cost, 2)}</td>
                        <td className="p-3 text-right font-mono font-bold">{fmtPct(row.our_min, 2)}</td>
                        <td className="p-3 text-right font-mono"><span className={margin >= 0.5 ? 'text-emerald-600' : 'text-amber-600'}>{fmtPct(margin, 2)}</span></td>
                        <td className="p-3 text-right font-mono text-slate-500">{fmtPct(row.market_avg, 2)}</td>
                        <td className="p-3 text-center">
                          {tight ? <Badge variant="destructive" className="text-[10px]"><AlertTriangle className="w-3 h-3 mr-1" />{row.plans_at_min}</Badge> : <Badge variant="outline" className="text-[10px]">{row.plans_at_min}</Badge>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
          <p className="text-xs text-slate-500">As células destacadas em amarelo possuem 3+ planos comerciais já no MDR mínimo — sem espaço para descontos adicionais.</p>
        </TabsContent>

        {/* Métricas */}
        <TabsContent value="metrics">
          <Card>
            <CardContent className="p-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartPlaceholder title="TPV mensal — últimos 12 meses" />
                <ChartPlaceholder title="Taxa de aprovação — últimos 12 meses" />
                <ChartPlaceholder title="Chargeback — últimos 12 meses" />
                <ChartPlaceholder title="Distribuição por canal" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="history">
          <Card>
            <CardContent className="p-5 space-y-3">
              <HistoryItem date="12/03/2026" who="Marcelo Andrade" desc="Spread aumentado de 0,40% para 0,42% após renegociação anual" />
              <HistoryItem date="01/01/2026" who="Operações" desc="Habilitada capacidade de 3DS 2.0 em todos os canais" />
              <HistoryItem date="15/11/2025" who="Comercial" desc="Adicionada bandeira Amex ao escopo do contrato" />
              <HistoryItem date="20/06/2025" who="Compliance" desc="Atualização de programa de monitoramento (VAMP threshold ajustado)" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Cross-references */}
      <Card>
        <CardContent className="p-5 flex flex-wrap gap-3">
          <Link to={createPageUrl('AdminIntFeePlans')}>
            <Button variant="outline" className="gap-2"><FileText className="w-4 h-4" />Planos vinculados</Button>
          </Link>
          <Link to={createPageUrl('AdminIntMerchantsList')}>
            <Button variant="outline" className="gap-2"><Users className="w-4 h-4" />Lojistas vinculados ({fmtNumber(acq.merchants_linked)})</Button>
          </Link>
        </CardContent>
      </Card>
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

function Field({ label, value, alert }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${alert ? 'text-amber-600' : ''}`}>{value}</span>
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

function ChartPlaceholder({ title }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-6 border border-dashed border-slate-200 dark:border-slate-700 text-center">
      <p className="text-sm font-semibold mb-2">{title}</p>
      <div className="h-32 flex items-end justify-around gap-1 mt-3">
        {[0.6, 0.7, 0.5, 0.8, 0.9, 0.7, 0.85, 0.9, 0.95, 0.88, 0.92, 0.96].map((h, i) => (
          <div key={i} className="bg-[#2bc196]/40 rounded-t" style={{ height: `${h * 100}%`, width: '6%' }} />
        ))}
      </div>
    </div>
  );
}