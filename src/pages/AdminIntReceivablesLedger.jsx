import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Receipt, Download, RefreshCw, Database, AlertTriangle, BarChart3, ListFilter, Building2, Sparkles } from 'lucide-react';
import ReceivablesKpiBar from '@/components/financial/receivables/ReceivablesKpiBar.jsx';
import ReceivablesAdvancedFilters from '@/components/financial/receivables/ReceivablesAdvancedFilters.jsx';
import ReceivablesTable from '@/components/financial/receivables/ReceivablesTable.jsx';
import ReceivablesTimelineChart from '@/components/financial/receivables/ReceivablesTimelineChart.jsx';
import ReceivablesAnomaliesPanel from '@/components/financial/receivables/ReceivablesAnomaliesPanel.jsx';
import ReceivablesBulkBar from '@/components/financial/receivables/ReceivablesBulkBar.jsx';
import { MOCK_RECEIVABLES, RECEIVABLES_KPIS, TOP_BLOCK_REASONS, RECEIVABLE_STATUS, formatCurrency } from '@/components/financial/receivables/mocks/receivablesLedgerMock';
import { toast } from 'sonner';

const DEFAULT_FILTERS = { search: '', status: 'all', brand: 'all', cerc_status: 'all', date_from: '', date_to: '', merchant: '' };

export default function AdminIntReceivablesLedger() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState([]);

  const filtered = useMemo(() => {
    return MOCK_RECEIVABLES.filter(r => {
      if (filters.status !== 'all' && r.status !== filters.status) return false;
      if (filters.brand !== 'all' && r.brand !== filters.brand) return false;
      if (filters.cerc_status !== 'all' && r.cerc_status !== filters.cerc_status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return r.id.includes(q) || r.nsu.includes(q) || r.arn.toLowerCase().includes(q) ||
          r.merchant.name.toLowerCase().includes(q) || r.transaction_id.includes(q);
      }
      return true;
    });
  }, [filters]);

  // Agrupado por lojista
  const byMerchant = useMemo(() => {
    const acc = {};
    filtered.forEach(r => {
      if (!acc[r.merchant.id]) {
        acc[r.merchant.id] = { merchant: r.merchant, receivables: [], total_gross: 0, total_net: 0, by_status: {} };
      }
      acc[r.merchant.id].receivables.push(r);
      acc[r.merchant.id].total_gross += r.gross_value;
      acc[r.merchant.id].total_net += r.net_value;
      acc[r.merchant.id].by_status[r.status] = (acc[r.merchant.id].by_status[r.status] || 0) + 1;
    });
    return Object.values(acc).sort((a, b) => b.total_net - a.total_net);
  }, [filtered]);

  const cercDivergences = filtered.filter(r => r.cerc_status === 'divergence');
  const cercPending = filtered.filter(r => r.cerc_status === 'pending_registration');

  const handleToggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleToggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(r => r.id));
  };

  const totalSelectedValue = filtered.filter(r => selected.includes(r.id)).reduce((s, r) => s + r.net_value, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Receivables Ledger"
        subtitle="Hub central de recebíveis com governança, CERC e anomalias"
        icon={Receipt}
        breadcrumbs={[
          { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
          { label: 'Recebíveis' }
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => toast.success('Sync com bandeira iniciado')}>
              <RefreshCw className="w-4 h-4 mr-2" /> Sync bandeira
            </Button>
            <Button onClick={() => toast.success('Export CSV iniciado')}>
              <Download className="w-4 h-4 mr-2" /> Exportar
            </Button>
          </div>
        }
      />

      <Card className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-xs text-violet-900 dark:text-violet-200">
            <strong>Recebível ≠ Transação ≠ Liquidação.</strong> Aqui você vê o direito a receber bruto gerado pelas transações aprovadas,
            seu vencimento natural, status CERC, blocos e cessões. Operações em massa são auditáveis e geram trilha imutável.
          </div>
        </CardContent>
      </Card>

      <ReceivablesBulkBar count={selected.length} totalValue={totalSelectedValue} onClear={() => setSelected([])} />

      <ReceivablesKpiBar kpis={RECEIVABLES_KPIS} />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white dark:bg-slate-900 border p-1 h-auto flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="text-xs gap-1.5"><BarChart3 className="w-3.5 h-3.5" />Visão Geral</TabsTrigger>
          <TabsTrigger value="list" className="text-xs gap-1.5"><ListFilter className="w-3.5 h-3.5" />Lista detalhada</TabsTrigger>
          <TabsTrigger value="by_merchant" className="text-xs gap-1.5"><Building2 className="w-3.5 h-3.5" />Por lojista</TabsTrigger>
          <TabsTrigger value="cerc" className="text-xs gap-1.5"><Database className="w-3.5 h-3.5" />Conciliação CERC</TabsTrigger>
          <TabsTrigger value="anomalies" className="text-xs gap-1.5"><AlertTriangle className="w-3.5 h-3.5" />Health & Anomalias</TabsTrigger>
        </TabsList>

        {/* VISÃO GERAL */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <ReceivablesTimelineChart />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top motivos de bloqueio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {TOP_BLOCK_REASONS.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs border-b pb-1.5 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{r.reason}</p>
                      <p className="text-[10px] text-slate-500">{r.count} recebíveis</p>
                    </div>
                    <p className="font-bold text-red-600">{formatCurrency(r.value)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <ReceivablesAnomaliesPanel />
        </TabsContent>

        {/* LISTA DETALHADA */}
        <TabsContent value="list" className="mt-4 space-y-3">
          <ReceivablesAdvancedFilters filters={filters} onChange={setFilters} />
          <p className="text-xs text-slate-500">{filtered.length} recebíveis encontrados</p>
          <ReceivablesTable
            items={filtered.slice(0, 50)}
            selected={selected}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onViewDetail={(r) => toast.info(`Detalhe: ${r.id}`)}
            onBlock={(r) => toast.success(`Recebível ${r.id} bloqueado · motivo registrado`)}
            onUnblock={(r) => toast.success(`Recebível ${r.id} desbloqueado`)}
          />
        </TabsContent>

        {/* POR LOJISTA */}
        <TabsContent value="by_merchant" className="mt-4 space-y-3">
          <ReceivablesAdvancedFilters filters={filters} onChange={setFilters} />
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800 border-b">
                    <tr>
                      <th className="text-left p-3 font-semibold">Lojista</th>
                      <th className="text-right p-3 font-semibold">Recebíveis</th>
                      <th className="text-right p-3 font-semibold">Bruto total</th>
                      <th className="text-right p-3 font-semibold">Líquido total</th>
                      <th className="text-center p-3 font-semibold">Distribuição por status</th>
                      <th className="text-center p-3 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byMerchant.map((m) => (
                      <tr key={m.merchant.id} className="border-b hover:bg-slate-50">
                        <td className="p-3">
                          <p className="font-bold">{m.merchant.name}</p>
                          <p className="text-[10px] text-slate-400">{m.merchant.cnpj}</p>
                        </td>
                        <td className="p-3 text-right font-bold">{m.receivables.length}</td>
                        <td className="p-3 text-right">{formatCurrency(m.total_gross)}</td>
                        <td className="p-3 text-right font-bold text-emerald-700">{formatCurrency(m.total_net)}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {Object.entries(m.by_status).map(([k, v]) => (
                              <Badge key={k} className={`${RECEIVABLE_STATUS[k]?.color} text-[9px]`}>
                                {RECEIVABLE_STATUS[k]?.label}: {v}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <Button size="sm" variant="outline" onClick={() => toast.info('Drill no perfil do lojista')}>
                            Drill →
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CERC */}
        <TabsContent value="cerc" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                  Divergências CERC ({cercDivergences.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 mb-3">
                  Recebíveis cujo registro na CERC não bate com o valor real. Requer re-sincronização.
                </p>
                <Button className="w-full" onClick={() => toast.success('Re-sync iniciado para todas as divergências')}>
                  <RefreshCw className="w-4 h-4 mr-2" /> Re-sincronizar todos
                </Button>
              </CardContent>
            </Card>
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                  <Database className="w-4 h-4" />
                  Pendentes de registro ({cercPending.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 mb-3">
                  Recebíveis ainda não registrados na CERC. Recomenda-se registro até D+1.
                </p>
                <Button variant="outline" className="w-full" onClick={() => toast.success('Registro CERC enfileirado')}>
                  <Database className="w-4 h-4 mr-2" /> Registrar todos
                </Button>
              </CardContent>
            </Card>
          </div>
          <ReceivablesTable
            items={[...cercDivergences, ...cercPending].slice(0, 30)}
            selected={selected}
            onToggle={handleToggle}
            onToggleAll={handleToggleAll}
            onViewDetail={(r) => toast.info(`Detalhe: ${r.id}`)}
          />
        </TabsContent>

        {/* ANOMALIAS */}
        <TabsContent value="anomalies" className="mt-4 space-y-4">
          <ReceivablesAnomaliesPanel />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configurar regras de detecção</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 mb-3">
                A IA monitora padrões e gera anomalias automaticamente. Você pode configurar thresholds e canais de notificação.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded text-xs">
                  <span>Taxa de chargeback &gt; 5% por lojista</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Ativa</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded text-xs">
                  <span>Divergência CERC em &gt; 10 recebíveis simultâneos</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Ativa</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded text-xs">
                  <span>Atraso de liquidação &gt; 1 dia (recorrente)</span>
                  <Badge className="bg-emerald-100 text-emerald-700">Ativa</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}