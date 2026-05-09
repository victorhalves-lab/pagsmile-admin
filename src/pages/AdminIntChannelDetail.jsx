import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Layers, Edit, Users, ShieldCheck, TrendingUp } from 'lucide-react';
import { CHANNELS, fmtMoney, fmtNumber, fmtPct } from '@/components/catalogs/catalogMocks';
import CatalogStatusBadge from '@/components/catalogs/CatalogStatusBadge';
import MetricChip from '@/components/catalogs/MetricChip';

const TYPE_LABEL = { presencial: 'Presencial', online: 'Online', instantaneo: 'Instantâneo' };
const TYPE_COLOR = {
  presencial: 'bg-blue-50 text-blue-700 border-blue-200',
  online: 'bg-purple-50 text-purple-700 border-purple-200',
  instantaneo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const ANTIFRAUD_DEFAULTS = [
  { name: '3DS obrigatório acima de R$ 500', source: 'default', enabled: true },
  { name: 'Bloqueio de IPs em países de alto risco', source: 'custom', enabled: true },
  { name: 'Análise device fingerprint', source: 'default', enabled: true },
  { name: 'Velocity check (>5 tentativas em 60s)', source: 'default', enabled: true },
  { name: 'Verificação CVV obrigatória', source: 'default', enabled: true },
  { name: 'Limite máximo de R$ 10.000 sem revisão', source: 'custom', enabled: false },
];

const RISK_THRESHOLDS = [
  { brand: 'Visa', threshold: 'R$ 500', mode: '3DS opcional' },
  { brand: 'Mastercard', threshold: 'R$ 500', mode: '3DS opcional' },
  { brand: 'Elo', threshold: 'R$ 300', mode: '3DS obrigatório' },
  { brand: 'Hipercard', threshold: 'R$ 300', mode: '3DS obrigatório' },
  { brand: 'Amex', threshold: 'R$ 1.000', mode: 'Frictionless' },
];

export default function AdminIntChannelDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'ch_pos';
  const ch = useMemo(() => CHANNELS.find(c => c.id === id) || CHANNELS[0], [id]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={ch.name}
        subtitle={`${TYPE_LABEL[ch.type]} • ${ch.brands_supported} bandeiras suportadas`}
        icon={Layers}
        breadcrumbs={[
          { label: 'Catálogos', page: 'AdminIntAcquirers' },
          { label: 'Canais', page: 'AdminIntChannels' },
          { label: ch.name, page: 'AdminIntChannelDetail' }
        ]}
        actions={<Button className="gap-2"><Edit className="w-4 h-4" />Editar configurações</Button>}
      />

      {/* Cabeçalho */}
      <Card>
        <CardContent className="p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-black">{ch.name}</h2>
            <CatalogStatusBadge status={ch.status} />
            <Badge variant="outline" className={TYPE_COLOR[ch.type]}>{TYPE_LABEL[ch.type]}</Badge>
            <Badge variant="outline" className="font-mono text-xs">{ch.id}</Badge>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{ch.description}</p>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <MetricChip label="TPV/mês" value={fmtMoney(ch.tpv_monthly)} color="emerald" icon={TrendingUp} />
        <MetricChip label="Transações/mês" value={fmtNumber(ch.transactions_monthly)} color="blue" />
        <MetricChip label="Lojistas usando" value={fmtNumber(ch.merchants_using)} color="purple" icon={Users} />
        <MetricChip label="Aprovação" value={fmtPct(ch.approval_rate, 1)} color={ch.approval_rate >= 95 ? 'emerald' : 'amber'} />
        <MetricChip label="Chargeback" value={fmtPct(ch.chargeback_rate, 2)} color={ch.chargeback_rate <= 0.2 ? 'emerald' : 'amber'} />
      </div>

      <Tabs defaultValue="capabilities">
        <TabsList className="bg-slate-100 dark:bg-slate-800/50 p-1 flex flex-wrap h-auto">
          <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
          <TabsTrigger value="acquirers">Adquirentes</TabsTrigger>
          <TabsTrigger value="antifraud">Antifraude</TabsTrigger>
          <TabsTrigger value="risk">Threshold por Bandeira</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="capabilities" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-bold">Recursos suportados</h3>
              <div className="flex flex-wrap gap-2">
                {ch.capabilities.map(c => (
                  <Badge key={c} variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 capitalize">
                    {c.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acquirers" className="mt-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-bold mb-3">Adquirentes que processam este canal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {ch.acquirers.map(a => (
                  <Link key={a} to={createPageUrl('AdminIntAcquirers')} className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#2bc196] transition flex items-center justify-between">
                    <span className="font-medium">{a}</span>
                    <Badge variant="secondary" className="text-[10px]">Ativo</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="antifraud" className="mt-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2"><ShieldCheck className="w-4 h-4" />Regras antifraude aplicadas</h3>
                <Badge variant="outline">{ch.antifraud_rules} regras ativas</Badge>
              </div>
              <div className="space-y-2">
                {ANTIFRAUD_DEFAULTS.map((r, i) => (
                  <div key={i} className={`p-3 rounded-lg border flex items-center justify-between ${r.enabled ? 'border-slate-200 dark:border-slate-700' : 'border-slate-100 dark:border-slate-800 opacity-60'}`}>
                    <div>
                      <p className="text-sm font-medium">{r.name}</p>
                      <Badge variant="outline" className="text-[9px] mt-1">{r.source === 'default' ? 'Default do tipo de canal' : 'Customização específica'}</Badge>
                    </div>
                    <Badge variant={r.enabled ? 'default' : 'secondary'} className="text-[10px]">{r.enabled ? 'Ativa' : 'Inativa'}</Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
                💡 Mudanças em regras antifraude geram <strong>simulação de impacto</strong> antes de salvar e <strong>rollback automático</strong> se aprovação cair mais de 10pp nas primeiras horas.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk" className="mt-4">
          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 text-left font-semibold">Bandeira</th>
                    <th className="p-3 text-left font-semibold">Threshold de risco</th>
                    <th className="p-3 text-left font-semibold">Modo de autenticação</th>
                  </tr>
                </thead>
                <tbody>
                  {RISK_THRESHOLDS.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="p-3 font-medium">{r.brand}</td>
                      <td className="p-3 font-mono">{r.threshold}</td>
                      <td className="p-3"><Badge variant="outline" className="text-[10px]">{r.mode}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-5 space-y-3">
              <HistoryItem date="22/04/2026" who="Risco" desc="Threshold da Visa ajustado de R$ 1000 para R$ 500" />
              <HistoryItem date="10/03/2026" who="Operações" desc="Adicionada regra customizada de bloqueio por país" />
              <HistoryItem date="01/01/2026" who="Operações" desc="Migração para 3DS 2.0 em todos os adquirentes vinculados" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardContent className="p-5 flex flex-wrap gap-3">
          <Link to={createPageUrl('AdminIntMerchantsList')}>
            <Button variant="outline" className="gap-2"><Users className="w-4 h-4" />Lojistas usando ({fmtNumber(ch.merchants_using)})</Button>
          </Link>
        </CardContent>
      </Card>
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