import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Bot, Database, RefreshCw, Loader2, DollarSign, Zap } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import PipelineRunRow from '@/components/recon/observability/PipelineRunRow';
import AgentRunRow from '@/components/recon/observability/AgentRunRow';

export default function AdminIntReconObservability() {
  const [tab, setTab] = useState('agents');
  const [agentFilter, setAgentFilter] = useState('all');

  const { data: pipelineRuns = [], refetch: refetchPipe, isFetching: loadingPipe } = useQuery({
    queryKey: ['recon.observability.pipelineRuns'],
    queryFn: () => base44.entities.PipelineRun.list('-started_at', 100),
  });

  const { data: agentRuns = [], refetch: refetchAgents, isFetching: loadingAgents } = useQuery({
    queryKey: ['recon.observability.agentRuns'],
    queryFn: () => base44.entities.AgentRun.list('-started_at', 100),
  });

  const refetchAll = () => { refetchPipe(); refetchAgents(); };

  const filteredAgentRuns = useMemo(
    () => agentFilter === 'all' ? agentRuns : agentRuns.filter((r) => r.agent === agentFilter),
    [agentRuns, agentFilter]
  );

  const kpis = useMemo(() => {
    const successPipe = pipelineRuns.filter((r) => r.status === 'success').length;
    const failedPipe = pipelineRuns.filter((r) => r.status === 'failed').length;
    const successAg = agentRuns.filter((r) => r.status === 'success').length;
    const failedAg = agentRuns.filter((r) => r.status === 'failed').length;
    const totalCost = agentRuns.reduce((s, r) => s + (r.cost_cents || 0), 0);
    const totalTokens = agentRuns.reduce((s, r) => s + (r.tokens_in || 0) + (r.tokens_out || 0), 0);
    const matches = pipelineRuns.reduce((s, r) => s + (r.matches_made || 0), 0);
    const divergences = pipelineRuns.reduce((s, r) => s + (r.divergences_created || 0), 0);

    const successTotal = successPipe + successAg;
    const failedTotal = failedPipe + failedAg;
    const successRate = (successTotal + failedTotal) > 0
      ? Math.round((successTotal / (successTotal + failedTotal)) * 100) : 100;

    return { successRate, totalCost, totalTokens, matches, divergences };
  }, [pipelineRuns, agentRuns]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Observabilidade · Reconciliação"
        description="Auditoria de execuções do pipeline e dos agentes IA, com custos e desempenho."
        icon={Activity}
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi label="Success rate" value={`${kpis.successRate}%`} icon={Zap} color="emerald" />
        <Kpi label="Custo total agentes" value={`R$ ${(kpis.totalCost / 100).toFixed(4)}`} icon={DollarSign} color="blue" />
        <Kpi label="Tokens totais" value={kpis.totalTokens.toLocaleString('pt-BR')} icon={Bot} color="purple" />
        <Kpi label="Matches" value={kpis.matches} icon={Database} color="emerald" />
        <Kpi label="Divergências" value={kpis.divergences} icon={Activity} color="amber" />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">Histórico de execuções</CardTitle>
          <Button size="sm" variant="ghost" onClick={refetchAll}>
            <RefreshCw className="w-3 h-3 mr-1" /> Atualizar
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="agents" className="gap-2">
                <Bot className="w-3.5 h-3.5" /> Agentes
                <Badge variant="outline" className="ml-1">{agentRuns.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="gap-2">
                <Database className="w-3.5 h-3.5" /> Pipeline
                <Badge variant="outline" className="ml-1">{pipelineRuns.length}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="agents" className="mt-4">
              <div className="flex gap-2 mb-3">
                {['all', 'investigator', 'communicator', 'reviewer'].map((a) => (
                  <Button
                    key={a}
                    size="sm"
                    variant={agentFilter === a ? 'default' : 'outline'}
                    className={`h-7 text-xs ${agentFilter === a ? 'bg-[#2bc196] hover:bg-[#25a880]' : ''}`}
                    onClick={() => setAgentFilter(a)}
                  >
                    {a}
                  </Button>
                ))}
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loadingAgents && <Loader2 className="w-4 h-4 animate-spin" />}
                {!loadingAgents && filteredAgentRuns.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">Sem execuções registradas.</p>
                )}
                {filteredAgentRuns.map((r) => <AgentRunRow key={r.id} run={r} />)}
              </div>
            </TabsContent>

            <TabsContent value="pipeline" className="mt-4">
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loadingPipe && <Loader2 className="w-4 h-4 animate-spin" />}
                {!loadingPipe && pipelineRuns.length === 0 && (
                  <p className="text-sm text-slate-500 text-center py-8">Sem execuções registradas.</p>
                )}
                {pipelineRuns.map((r) => <PipelineRunRow key={r.id} run={r} />)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, color }) {
  const palette = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  }[color];
  return (
    <div className={`border rounded-lg p-3 ${palette}`}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider opacity-80">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <div className="text-lg font-bold mt-1">{value}</div>
    </div>
  );
}