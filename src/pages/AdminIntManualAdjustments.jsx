import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Plus, Download, BarChart3, Clock, History, Undo2, FileText, Sparkles, Shield } from 'lucide-react';
import AdjustmentsKpiBar from '@/components/financial/adjustments/AdjustmentsKpiBar.jsx';
import AdjustmentsTable from '@/components/financial/adjustments/AdjustmentsTable.jsx';
import AdjustmentsFilters from '@/components/financial/adjustments/AdjustmentsFilters.jsx';
import AdjustmentDetailDrawer from '@/components/financial/adjustments/AdjustmentDetailDrawer.jsx';
import CreateAdjustmentWizard from '@/components/financial/adjustments/CreateAdjustmentWizard.jsx';
import AdjustmentsParetoChart from '@/components/financial/adjustments/AdjustmentsParetoChart.jsx';
import { MOCK_ADJUSTMENTS, ADJUSTMENTS_KPIS, formatCurrency } from '@/components/financial/adjustments/mocks/manualAdjustmentsMock';
import { toast } from 'sonner';

const DEFAULT_FILTERS = { search: '', type: 'all', status: 'all', reason: 'all', date_from: '', date_to: '' };

export default function AdminIntManualAdjustments() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [detail, setDetail] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_ADJUSTMENTS.filter(a => {
      if (filters.type !== 'all' && a.type !== filters.type) return false;
      if (filters.status !== 'all' && a.status !== filters.status) return false;
      if (filters.reason !== 'all' && a.reason !== filters.reason) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return a.id.includes(q) || a.merchant.name.toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [filters]);

  const pending = MOCK_ADJUSTMENTS.filter(a => a.status === 'pending_approval');
  const reversed = MOCK_ADJUSTMENTS.filter(a => a.status === 'reversed');

  const handleView = (adj) => {
    setDetail(adj);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ajustes Manuais Financeiros"
        subtitle="Créditos e débitos com aprovação 4-eyes, evidências e trilha auditável"
        icon={Wallet}
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Ajustes Manuais' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Export auditoria gerado')}>
              <Download className="w-4 h-4 mr-2" /> Export auditoria
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700" onClick={() => setWizardOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Novo ajuste
            </Button>
          </div>
        }
      />

      <Card className="bg-gradient-to-r from-violet-50 to-pink-50 dark:from-violet-900/20 dark:to-pink-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-xs text-violet-900 dark:text-violet-200">
            <strong>Operação crítica de governança financeira.</strong> Ajustes acima de R$ 1.000 exigem aprovação dual (4-eyes).
            Toda evidência fica registrada em trilha imutável. Estornos geram ajustes opostos (não deletam).
          </div>
        </CardContent>
      </Card>

      <AdjustmentsKpiBar kpis={ADJUSTMENTS_KPIS} />

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="bg-white dark:bg-slate-900 border p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="create" className="text-xs gap-1.5"><Plus className="w-3.5 h-3.5" />Criar ajuste</TabsTrigger>
          <TabsTrigger value="pending" className="text-xs gap-1.5">
            <Clock className="w-3.5 h-3.5" />Pendentes
            {pending.length > 0 && <Badge className="bg-amber-500 text-white h-4 ml-1 text-[9px]">{pending.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs gap-1.5"><History className="w-3.5 h-3.5" />Histórico</TabsTrigger>
          <TabsTrigger value="reversals" className="text-xs gap-1.5"><Undo2 className="w-3.5 h-3.5" />Estornos</TabsTrigger>
          <TabsTrigger value="by_reason" className="text-xs gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Por motivo</TabsTrigger>
        </TabsList>

        {/* CRIAR */}
        <TabsContent value="create" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Plus className="w-12 h-12 text-violet-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-2">Criar novo ajuste manual</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-4">
                Wizard guiado em 4 passos: lojista → tipo & valor → motivo & evidência → revisão & aprovação.
                Ajustes &gt; R$ 1.000 entram em fila de aprovação L2.
              </p>
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700" onClick={() => setWizardOpen(true)}>
                <Plus className="w-4 h-4 mr-2" /> Iniciar wizard
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-bold">4-eyes obrigatório</p>
                <p className="text-[10px] text-slate-500 mt-1">Valores acima de R$ 1.000 requerem 2º aprovador</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold">Evidências anexáveis</p>
                <p className="text-[10px] text-slate-500 mt-1">Motivos categorizados pedem PDF/print obrigatórios</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <History className="w-6 h-6 text-violet-600 mx-auto mb-2" />
                <p className="text-xs font-bold">Trilha imutável</p>
                <p className="text-[10px] text-slate-500 mt-1">Todo passo fica registrado para auditoria BACEN</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PENDENTES */}
        <TabsContent value="pending" className="mt-4 space-y-3">
          <Card className="border-amber-200 bg-amber-50/30">
            <CardContent className="p-3 flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-700 mt-0.5" />
              <div className="text-xs text-amber-900">
                <strong>{pending.length} ajustes</strong> aguardando 2º aprovador.
                SLA padrão: 24h. Após esse prazo, o solicitante é notificado e o caso é escalado.
              </div>
            </CardContent>
          </Card>
          <AdjustmentsFilters filters={filters} onChange={setFilters} />
          <AdjustmentsTable
            items={pending}
            onView={handleView}
            onApprove={(a) => toast.success(`Ajuste ${a.id} aprovado e executado`)}
            onReject={(a) => toast.error(`Ajuste ${a.id} rejeitado`)}
          />
        </TabsContent>

        {/* HISTÓRICO */}
        <TabsContent value="history" className="mt-4 space-y-3">
          <AdjustmentsFilters filters={filters} onChange={setFilters} />
          <p className="text-xs text-slate-500">{filtered.length} ajustes encontrados</p>
          <AdjustmentsTable
            items={filtered.slice(0, 50)}
            onView={handleView}
            onReverse={(a) => toast.info(`Solicitando estorno de ${a.id}`)}
          />
        </TabsContent>

        {/* ESTORNOS */}
        <TabsContent value="reversals" className="mt-4 space-y-3">
          <Card className="border-violet-200 bg-violet-50/30">
            <CardContent className="p-3 flex items-start gap-2">
              <Undo2 className="w-4 h-4 text-violet-700 mt-0.5" />
              <div className="text-xs text-violet-900">
                Estornos geram ajustes opostos auditáveis (nunca deletam o original).
                Total: <strong>{reversed.length} ajustes estornados</strong> · {formatCurrency(reversed.reduce((s, a) => s + a.amount, 0))}
              </div>
            </CardContent>
          </Card>
          <AdjustmentsTable items={reversed} onView={handleView} />
        </TabsContent>

        {/* POR MOTIVO */}
        <TabsContent value="by_reason" className="mt-4">
          <AdjustmentsParetoChart />
        </TabsContent>
      </Tabs>

      <AdjustmentDetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} adjustment={detail} />
      <CreateAdjustmentWizard open={wizardOpen} onOpenChange={setWizardOpen} />
    </div>
  );
}