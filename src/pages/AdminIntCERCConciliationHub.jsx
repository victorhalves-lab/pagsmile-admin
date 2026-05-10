import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Play, Download, FileText, History, AlertTriangle, Sparkles } from 'lucide-react';
import CERCKpiBar from '@/components/regulatory/cerc/CERCKpiBar.jsx';
import CERCConcordanceChart from '@/components/regulatory/cerc/CERCConcordanceChart.jsx';
import CERCConciliationsTable from '@/components/regulatory/cerc/CERCConciliationsTable.jsx';
import CERCDivergencesPanel from '@/components/regulatory/cerc/CERCDivergencesPanel.jsx';
import { CERC_KPIS, MOCK_CONCILIATIONS, MOCK_DIVERGENCES } from '@/components/regulatory/mocks/urMock';
import { toast } from 'sonner';

export default function AdminIntCERCConciliationHub() {
  const [filters, setFilters] = useState({ method: 'all', status: 'all' });

  const filtered = useMemo(() => {
    return MOCK_CONCILIATIONS.filter((c) => {
      if (filters.method !== 'all' && c.method !== filters.method) return false;
      if (filters.status !== 'all' && c.status !== filters.status) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Conciliação CERC"
        subtitle="Monitoramento de conformidade regulatória e divergências"
        icon={ShieldCheck}
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Conciliação CERC' },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Histórico exportado')}>
              <Download className="w-4 h-4 mr-2" /> Exportar histórico
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => toast.success('Conciliação manual disparada')}>
              <Play className="w-4 h-4 mr-2" /> Disparar conciliação manual
            </Button>
          </div>
        }
      />

      {CERC_KPIS.divergences_critical > 0 && (
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-3 flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-900">
              <strong>{CERC_KPIS.divergences_critical} divergências críticas</strong> aguardando tratativa — SLA 24-48h para evitar autuação BCB.
            </span>
          </CardContent>
        </Card>
      )}

      <CERCKpiBar kpis={CERC_KPIS} />

      <Tabs defaultValue="overview">
        <TabsList className="bg-white dark:bg-slate-900 border p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-xs">Visão geral</TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <History className="w-3 h-3 mr-1" />Histórico ({MOCK_CONCILIATIONS.length})
          </TabsTrigger>
          <TabsTrigger value="divergences" className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />Divergências ({MOCK_DIVERGENCES.filter((d) => d.status !== 'resolved').length})
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />Sugestões IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <CERCConcordanceChart />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">SLA de regularização</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>Críticas (24h)</span><span className="font-bold text-red-600">{CERC_KPIS.avg_sla_hours}h média</span></div>
                  <div className="flex justify-between"><span>Médias (72h)</span><span className="font-bold text-amber-600">42h média</span></div>
                  <div className="flex justify-between"><span>Menores (168h)</span><span className="font-bold text-blue-600">96h média</span></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Distribuição por severidade</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center"><Badge className="bg-red-100 text-red-700">Críticas</Badge><strong>{CERC_KPIS.divergences_critical}</strong></div>
                  <div className="flex justify-between items-center"><Badge className="bg-amber-100 text-amber-700">Médias</Badge><strong>{CERC_KPIS.divergences_medium}</strong></div>
                  <div className="flex justify-between items-center"><Badge className="bg-blue-100 text-blue-700">Menores</Badge><strong>{CERC_KPIS.divergences_minor}</strong></div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Próxima conciliação</CardTitle></CardHeader>
              <CardContent>
                <p className="text-xs text-slate-500">Automática agendada para</p>
                <p className="text-lg font-bold">Hoje 23:00</p>
                <p className="text-[10px] text-slate-500">Frequência: diária · Escopo: todas as URs do dia</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-3">
          <Card>
            <CardContent className="p-3 flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium">Filtros:</span>
              <Button size="sm" variant={filters.method === 'all' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setFilters({ ...filters, method: 'all' })}>Todos métodos</Button>
              <Button size="sm" variant={filters.method === 'automatic' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setFilters({ ...filters, method: 'automatic' })}>Automáticas</Button>
              <Button size="sm" variant={filters.method === 'manual' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setFilters({ ...filters, method: 'manual' })}>Manuais</Button>
              <span className="mx-2">·</span>
              <Button size="sm" variant={filters.status === 'all' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setFilters({ ...filters, status: 'all' })}>Todos status</Button>
              <Button size="sm" variant={filters.status === 'with_divergences' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setFilters({ ...filters, status: 'with_divergences' })}>Com divergências</Button>
              <Button size="sm" variant={filters.status === 'failed' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setFilters({ ...filters, status: 'failed' })}>Falhadas</Button>
            </CardContent>
          </Card>
          <CERCConciliationsTable items={filtered} onViewDetail={(c) => toast.info(`Detalhe da conciliação ${c.id}`)} />
        </TabsContent>

        <TabsContent value="divergences" className="mt-4">
          <CERCDivergencesPanel divergences={MOCK_DIVERGENCES} />
        </TabsContent>

        <TabsContent value="suggestions" className="mt-4 space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600" /> Sugestões da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="p-3 border rounded-lg flex items-start gap-3">
                <Badge className="bg-red-100 text-red-700 text-[9px]">Alta</Badge>
                <div className="flex-1">
                  <p className="text-xs font-bold">Aumento de divergências em adquirente Stone</p>
                  <p className="text-[11px] text-slate-600">Investigar mudança recente na integração — divergências aumentaram 4x nos últimos 7 dias em URs Stone.</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success('Investigação iniciada')}>Investigar</Button>
              </div>
              <div className="p-3 border rounded-lg flex items-start gap-3">
                <Badge className="bg-amber-100 text-amber-700 text-[9px]">Média</Badge>
                <div className="flex-1">
                  <p className="text-xs font-bold">Concentração em tipo "valor divergente"</p>
                  <p className="text-[11px] text-slate-600">73% das divergências são de valor — revisar lógica de mapeamento de centavos no payload CERC.</p>
                </div>
                <Button size="sm" variant="outline">Revisar</Button>
              </div>
              <div className="p-3 border rounded-lg flex items-start gap-3">
                <Badge className="bg-blue-100 text-blue-700 text-[9px]">Info</Badge>
                <div className="flex-1">
                  <p className="text-xs font-bold">Lojista Mega Lojas com divergências recorrentes</p>
                  <p className="text-[11px] text-slate-600">Investigar problema de cadastro específico — 8 divergências em URs deste lojista nos últimos 14 dias.</p>
                </div>
                <Button size="sm" variant="outline">Analisar lojista</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}