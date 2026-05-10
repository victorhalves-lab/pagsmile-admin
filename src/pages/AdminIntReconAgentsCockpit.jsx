import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { RefreshCw, PlayCircle, Database, Loader2, Bot, FileText, Receipt } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import DivergenceCard from '@/components/recon/agents/DivergenceCard';
import ReconAgentChat from '@/components/recon/agents/ReconAgentChat';

export default function AdminIntReconAgentsCockpit() {
  const [selectedDiv, setSelectedDiv] = useState(null);
  const [agentTab, setAgentTab] = useState('investigator');
  const [chatPrompt, setChatPrompt] = useState('');
  const [running, setRunning] = useState(null);

  const { data: divergences = [], refetch: refetchDiv, isFetching: loadingDiv } = useQuery({
    queryKey: ['divergences'],
    queryFn: () => base44.entities.Divergence.list('-detected_at', 50),
  });

  const { data: adjustments = [], refetch: refetchAdj } = useQuery({
    queryKey: ['proposedAdjustments'],
    queryFn: () => base44.entities.ProposedAdjustment.list('-proposed_at', 50),
  });

  const { data: disputes = [], refetch: refetchDisputes } = useQuery({
    queryKey: ['acquirerDisputes'],
    queryFn: () => base44.entities.AcquirerDispute.list('-prepared_at', 50),
  });

  const refetchAll = () => { refetchDiv(); refetchAdj(); refetchDisputes(); };

  const runPipeline = async (fnName) => {
    setRunning(fnName);
    try {
      await base44.functions.invoke(fnName, {});
      refetchAll();
    } finally {
      setRunning(null);
    }
  };

  const sendToAgent = (agent, divergence) => {
    setAgentTab(agent);
    setSelectedDiv(divergence);
    const prompts = {
      investigator: `Investigue a Divergence ID="${divergence.id}". Leia os registros relacionados (Transaction, AcquirerRecord, BankMovement), identifique a causa raiz no formato "<quem> <fez o quê> porque <razão>", determine owner e proposed_action, e atualize a Divergence com status='investigated'.`,
      communicator: `A Divergence ID="${divergence.id}" já foi investigada. Com base no root_cause e proposed_action dela, crie ProposedAdjustment ou AcquirerDispute conforme apropriado, e marque a Divergence como 'proposed'.`,
      reviewer: `Revise a Divergence ID="${divergence.id}" e qualquer ProposedAdjustment ou AcquirerDispute associado. Atribua reviewer_score (0-100), escreva reviewer_notes em 2-3 frases, e atualize os registros.`,
    };
    setChatPrompt(prompts[agent]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cockpit de Reconciliação · Agentes IA"
        description="Acione Investigador, Comunicador e Reviewer sobre divergências reais do pipeline."
        icon={Bot}
      />

      {/* Pipeline controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4" /> Pipeline de Reconciliação
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => runPipeline('bank/syncBankMovements')} disabled={!!running}>
            {running === 'bank/syncBankMovements' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
            Sync Bank (mock)
          </Button>
          <Button size="sm" variant="outline" onClick={() => runPipeline('recon/testMatching')} disabled={!!running}>
            {running === 'recon/testMatching' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <PlayCircle className="w-3 h-3 mr-1" />}
            Dry-run Matching
          </Button>
          <Button size="sm" className="bg-[#2bc196] hover:bg-[#25a880]" onClick={() => runPipeline('recon/runMatching')} disabled={!!running}>
            {running === 'recon/runMatching' ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <PlayCircle className="w-3 h-3 mr-1" />}
            Run Matching (persiste)
          </Button>
          <Button size="sm" variant="ghost" onClick={refetchAll}>
            <RefreshCw className="w-3 h-3 mr-1" /> Atualizar
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Divergences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Divergências Detectadas</span>
              <Badge variant="outline">{divergences.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[700px] overflow-y-auto">
            {loadingDiv && <Loader2 className="w-4 h-4 animate-spin" />}
            {!loadingDiv && divergences.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-8">
                Nenhuma divergência. Execute o pipeline de matching primeiro.
              </p>
            )}
            {divergences.map((d) => (
              <DivergenceCard
                key={d.id}
                divergence={d}
                selected={selectedDiv?.id === d.id}
                onSelect={setSelectedDiv}
                onSendTo={sendToAgent}
              />
            ))}
          </CardContent>
        </Card>

        {/* Agent Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Conversa com Agente</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={agentTab} onValueChange={setAgentTab}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="investigator">Investigador</TabsTrigger>
                <TabsTrigger value="communicator">Comunicador</TabsTrigger>
                <TabsTrigger value="reviewer">Reviewer</TabsTrigger>
              </TabsList>
              <TabsContent value="investigator">
                <ReconAgentChat
                  agentName="investigator"
                  title="Investigador IA"
                  defaultPrompt={agentTab === 'investigator' ? chatPrompt : ''}
                />
              </TabsContent>
              <TabsContent value="communicator">
                <ReconAgentChat
                  agentName="communicator"
                  title="Comunicador IA"
                  defaultPrompt={agentTab === 'communicator' ? chatPrompt : ''}
                />
              </TabsContent>
              <TabsContent value="reviewer">
                <ReconAgentChat
                  agentName="reviewer"
                  title="Reviewer IA"
                  defaultPrompt={agentTab === 'reviewer' ? chatPrompt : ''}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Outputs dos agentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2"><Receipt className="w-4 h-4" /> ProposedAdjustments</span>
              <Badge variant="outline">{adjustments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {adjustments.length === 0 && <p className="text-xs text-slate-500">Nenhum ajuste proposto ainda.</p>}
            {adjustments.map((a) => (
              <div key={a.id} className="border rounded-lg p-3 text-xs bg-white">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="outline">{a.status}</Badge>
                  <span className="font-semibold">
                    {(a.amount_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="text-slate-600">D: {a.account_debit} → C: {a.account_credit}</div>
                <p className="mt-1 text-slate-700">{a.rationale}</p>
                {a.reviewer_score != null && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    Reviewer: <span className="font-semibold">{a.reviewer_score}/100</span> · {a.reviewer_notes}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> AcquirerDisputes</span>
              <Badge variant="outline">{disputes.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-96 overflow-y-auto">
            {disputes.length === 0 && <p className="text-xs text-slate-500">Nenhuma carta de contestação ainda.</p>}
            {disputes.map((d) => (
              <div key={d.id} className="border rounded-lg p-3 text-xs bg-white">
                <div className="flex justify-between items-center mb-1">
                  <Badge variant="outline">{d.dispute_type}</Badge>
                  <span className="font-semibold">
                    {(d.amount_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div className="text-slate-600">Adquirente: {d.acquirer_id} · Status: {d.status}</div>
                {d.letter_text && (
                  <details className="mt-1">
                    <summary className="cursor-pointer text-[#2bc196]">Ver carta</summary>
                    <pre className="mt-1 whitespace-pre-wrap text-slate-700 bg-slate-50 p-2 rounded">{d.letter_text}</pre>
                  </details>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}