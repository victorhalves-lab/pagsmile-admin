import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowLeft, Sparkles, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageHeader from '@/components/common/PageHeader';
import DriftKPIBar from '@/components/mentor/sales-plans/drift/DriftKPIBar';
import DriftEvolutionChart from '@/components/mentor/sales-plans/drift/DriftEvolutionChart';
import DriftTable from '@/components/mentor/sales-plans/drift/DriftTable';
import { MOCK_DRIFT_DATA } from '@/components/mentor/mocks/driftMock';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntDriftMonitoring() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_DRIFT_DATA.filter((d) => {
      if (severityFilter !== 'all' && d.severity !== severityFilter) return false;
      if (projectFilter !== 'all' && d.project_name !== projectFilter) return false;
      return true;
    });
  }, [severityFilter, projectFilter]);

  const projects = [...new Set(MOCK_DRIFT_DATA.map((d) => d.project_name))];

  return (
    <div className="space-y-4 pb-12">
      <Button asChild variant="ghost" size="sm">
        <Link to={createPageUrl('AdminIntSalesPlans')}>
          <ArrowLeft className="w-4 h-4 mr-1" />Voltar para hub de planos
        </Link>
      </Button>

      <PageHeader
        title="Drift Monitoring"
        subtitle="Monitor contínuo de divergência entre planos configurados e tarifas efetivamente cobradas · alertas automáticos · sugestões de IA para resolução"
        icon={Activity}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Planos de Venda', page: 'AdminIntSalesPlans' },
          { label: 'Drift Monitoring', page: 'AdminIntDriftMonitoring' },
        ]}
        actions={
          <Button variant="outline" onClick={() => toast.success('Relatório de drift exportado para email')}>
            <Download className="w-4 h-4 mr-2" />Exportar relatório
          </Button>
        }
      />

      <Card className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-200">
        <CardContent className="p-3 flex items-start gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-violet-600 mt-0.5 shrink-0" />
          <div className="text-violet-900 dark:text-violet-200">
            <strong>Diferencial Mentor.</strong> Único monitor do mercado que mede <strong>drift por componente tarifário</strong> (MDR base, spread, antecipação, sobretaxas) cruzando com transações reais.
            Identifica vazamentos de receita causados por exceções não controladas, falhas de roteamento ou desvios não autorizados — com sugestão de IA para cada caso.
          </div>
        </CardContent>
      </Card>

      <DriftKPIBar drifts={MOCK_DRIFT_DATA} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <DriftEvolutionChart />
        <Card>
          <CardContent className="p-4 h-full flex flex-col">
            <p className="text-sm font-bold mb-2">🎯 Top 3 ações recomendadas pela IA</p>
            <div className="space-y-2 flex-1">
              <div className="p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 text-xs">
                <Badge severity="high" />
                <p className="font-semibold mt-1">Auditar engine de roteamento do Plano Recovery</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">22% dos merchants risco alto não estão recebendo o plano · perda projetada de R$ 234k/90d</p>
              </div>
              <div className="p-2 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 text-xs">
                <Badge severity="medium" />
                <p className="font-semibold mt-1">Revisar competitividade no México</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">Antecipação 0.24pp abaixo do plano · benchmark com STP/Conekta</p>
              </div>
              <div className="p-2 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-200 text-xs">
                <Badge severity="low" />
                <p className="font-semibold mt-1">Promover merchants top do plano padrão</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">3 merchants com exceções permanentes &gt;180 dias · candidatos a virar planos próprios</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Filtros:</span>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas severidades</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
          <Select value={projectFilter} onValueChange={setProjectFilter}>
            <SelectTrigger className="h-8 w-52 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos projetos</SelectItem>
              {projects.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-[10px] text-slate-500 ml-auto">{filtered.length} drift(s) encontrado(s)</span>
        </CardContent>
      </Card>

      <DriftTable drifts={filtered} />
    </div>
  );
}

// Badge interno para severidade
function Badge({ severity }) {
  const cfg = {
    high: { label: 'ALTA', color: 'bg-red-100 text-red-700' },
    medium: { label: 'MÉDIA', color: 'bg-amber-100 text-amber-700' },
    low: { label: 'BAIXA', color: 'bg-blue-100 text-blue-700' },
  }[severity];
  return <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${cfg?.color}`}>{cfg?.label}</span>;
}