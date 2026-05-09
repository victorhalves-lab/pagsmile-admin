import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Plus, Sparkles, Save, Play, Pause, Rocket } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import FlowVisualEditor from '@/components/orchestration/FlowVisualEditor';
import { mockOrchestrationFlows } from '@/components/orchestration/mockData';
import { EntityFormDrawer, ConfirmActionDrawer } from '@/components/common/drawers';
import { toast } from 'sonner';

export default function AdminIntOrchestrationStudio() {
  const [flows, setFlows] = useState(mockOrchestrationFlows);
  const [selectedFlow, setSelectedFlow] = useState(mockOrchestrationFlows[0]);
  const [savedAt, setSavedAt] = useState(null);

  const [newFlowOpen, setNewFlowOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newFlow, setNewFlow] = useState({ name: '', description: '', strategy: 'bin_routing', traffic_pct: 100 });

  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const handleCreateFlow = async () => {
    if (!newFlow.name) {
      toast.error('Nome do fluxo é obrigatório');
      return;
    }
    setCreating(true);
    await new Promise((r) => setTimeout(r, 600));
    const created = {
      id: `flow_${Date.now()}`,
      name: newFlow.name,
      description: newFlow.description || 'Sem descrição',
      isActive: false,
      volume: 0,
      successRate: 0,
      nodes: [{ id: 'start', type: 'start', label: 'Início' }],
    };
    setFlows((prev) => [...prev, created]);
    setSelectedFlow(created);
    setCreating(false);
    setNewFlowOpen(false);
    setNewFlow({ name: '', description: '', strategy: 'bin_routing', traffic_pct: 100 });
    toast.success(`Fluxo "${created.name}" criado · status: pausado`);
  };

  const handlePublish = async () => {
    setPublishing(true);
    await new Promise((r) => setTimeout(r, 800));
    setSavedAt(new Date().toLocaleTimeString('pt-BR'));
    setPublishing(false);
    setPublishOpen(false);
    toast.success(`Fluxo "${selectedFlow.name}" publicado em produção 🚀`);
  };

  const toggleActive = (flow, value) => {
    setFlows((prev) => prev.map((f) => f.id === flow.id ? { ...f, isActive: value } : f));
    setSelectedFlow((prev) => prev?.id === flow.id ? { ...prev, isActive: value } : prev);
    toast.success(value ? `Fluxo "${flow.name}" ativado` : `Fluxo "${flow.name}" pausado`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orchestration Studio"
        subtitle="Editor visual de fluxos de orquestração de pagamento · BIN routing, fallback, smart retry"
        icon={GitBranch}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Transações', page: 'AdminIntTransactionsDashboard' }]}
        actions={
          <Button onClick={() => setPublishOpen(true)} disabled={!selectedFlow}>
            <Save className="w-4 h-4 mr-2" />
            Publicar fluxo
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sidebar: Fluxos */}
        <div className="space-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-sm">
                <span>Fluxos ({flows.length})</span>
                <Button size="sm" variant="outline" onClick={() => setNewFlowOpen(true)}>
                  <Plus className="w-3 h-3 mr-1" />
                  Novo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {flows.map((flow) => (
                <div
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedFlow?.id === flow.id ? 'border-[#2bc196] bg-[#2bc196]/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm">{flow.name}</p>
                    {flow.isActive ? (
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Pausado</Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{flow.description}</p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{flow.volume.toLocaleString('pt-BR')} txs</span>
                    <span className={`font-bold ${flow.successRate >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {flow.successRate}%
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Editor */}
        <div className="lg:col-span-2 space-y-4">
          {selectedFlow && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <div className="flex items-center gap-2">
                      <span>{selectedFlow.name}</span>
                      <Badge variant="outline" className="font-mono text-[10px]">{selectedFlow.id}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={selectedFlow.isActive} onCheckedChange={(v) => toggleActive(selectedFlow, v)} />
                      <Button size="sm" variant="outline" onClick={() => toggleActive(selectedFlow, !selectedFlow.isActive)}>
                        {selectedFlow.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Volume 30d</p>
                      <p className="text-lg font-bold">{selectedFlow.volume.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Taxa de sucesso</p>
                      <p className="text-lg font-bold text-emerald-600">{selectedFlow.successRate}%</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Nós</p>
                      <p className="text-lg font-bold">{selectedFlow.nodes.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <FlowVisualEditor
                initialNodes={selectedFlow.nodes}
                onChange={() => setSavedAt(null)}
              />
            </>
          )}
        </div>
      </div>

      <Card className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-violet-900 text-sm">PagSmile Copilot · Sugestão</p>
            <p className="text-xs text-violet-700 mt-1">
              O fluxo <strong>BIN-Based Routing</strong> tem variação de 9pp em conversão entre Cielo e Adyen para BINs Visa.
              Considere adicionar nó de teste A/B antes de roteamento definitivo.
            </p>
          </div>
        </CardContent>
      </Card>

      {savedAt && (
        <div className="text-xs text-emerald-700 text-right">Publicado às {savedAt}</div>
      )}

      {/* Drawer: Novo fluxo */}
      <EntityFormDrawer
        open={newFlowOpen}
        onOpenChange={setNewFlowOpen}
        title="Novo fluxo de orquestração"
        description="Crie um novo fluxo. Ele começa pausado para você editar antes de publicar"
        icon={Plus}
        size="md"
        submitting={creating}
        onSubmit={handleCreateFlow}
        submitLabel="Criar fluxo"
        submitDisabled={!newFlow.name}
      >
        <div className="space-y-4">
          <div>
            <Label>Nome do fluxo *</Label>
            <Input
              placeholder="Ex: Smart Retry Visa BR"
              value={newFlow.name}
              onChange={(e) => setNewFlow({ ...newFlow, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              placeholder="O que este fluxo resolve? Em quais cenários ele dispara?"
              value={newFlow.description}
              onChange={(e) => setNewFlow({ ...newFlow, description: e.target.value })}
              className="min-h-[60px]"
            />
          </div>
          <div>
            <Label>Estratégia base</Label>
            <Select value={newFlow.strategy} onValueChange={(v) => setNewFlow({ ...newFlow, strategy: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bin_routing">BIN Routing</SelectItem>
                <SelectItem value="fallback">Fallback automático</SelectItem>
                <SelectItem value="smart_retry">Smart Retry</SelectItem>
                <SelectItem value="ab_test">Teste A/B</SelectItem>
                <SelectItem value="custom">Customizado (do zero)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>% do tráfego inicial</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={newFlow.traffic_pct}
              onChange={(e) => setNewFlow({ ...newFlow, traffic_pct: parseInt(e.target.value) || 0 })}
            />
            <p className="text-xs text-slate-500 mt-1">Comece com % baixa e aumente após validar.</p>
          </div>
        </div>
      </EntityFormDrawer>

      {/* Drawer: Publicar fluxo */}
      <ConfirmActionDrawer
        open={publishOpen}
        onOpenChange={setPublishOpen}
        title="Publicar fluxo em produção"
        description={selectedFlow ? `"${selectedFlow.name}" passará a rotear transações reais` : ''}
        icon={Rocket}
        tone="success"
        confirmLabel="Publicar agora"
        submitting={publishing}
        onConfirm={handlePublish}
        size="md"
        checklist={selectedFlow ? [
          { label: `Fluxo possui ${selectedFlow.nodes.length} nós`, ok: selectedFlow.nodes.length >= 2, hint: selectedFlow.nodes.length < 2 ? 'Adicione ao menos 2 nós antes de publicar' : null },
          { label: 'Nó de início definido', ok: selectedFlow.nodes.some((n) => n.type === 'start') },
          { label: 'Sem ciclos infinitos', ok: true },
          { label: 'Validação de adquirentes alvo', ok: true },
        ] : []}
        infoBlock="Após publicar, o fluxo entra em produção imediatamente. Você pode pausar pelo switch a qualquer momento."
      />
    </div>
  );
}