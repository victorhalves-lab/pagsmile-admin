import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, AlertTriangle, CheckCircle2, Plus, Activity, Rocket, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { mockShadowTests } from '@/components/orchestration/mockData';
import { EntityFormDrawer, ConfirmActionDrawer, DetailDrawer } from '@/components/common/drawers';
import { toast } from 'sonner';

export default function AdminIntShadowMode() {
  const [tests, setTests] = useState(mockShadowTests);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTest, setNewTest] = useState({ name: '', target: 'rule', shadow_target: '', traffic_pct: 10, duration_days: 7, notes: '' });

  const [divergencesOpen, setDivergencesOpen] = useState(null); // test
  const [promoteOpen, setPromoteOpen] = useState(null); // test
  const [promoting, setPromoting] = useState(false);

  const handleCreate = async () => {
    if (!newTest.name || !newTest.shadow_target) {
      toast.error('Nome e alvo shadow são obrigatórios');
      return;
    }
    setCreating(true);
    await new Promise((r) => setTimeout(r, 600));
    setTests((prev) => [
      ...prev,
      {
        id: `shadow_${Date.now()}`,
        name: newTest.name,
        status: 'running',
        requestsShadow: 0,
        errorsShadow: 0,
        latencyDeltaMs: 0,
        divergenceRate: 0,
      },
    ]);
    setCreating(false);
    setCreateOpen(false);
    setNewTest({ name: '', target: 'rule', shadow_target: '', traffic_pct: 10, duration_days: 7, notes: '' });
    toast.success(`Shadow test "${newTest.name}" iniciado · espelhamento ativo`);
  };

  const handlePromote = async () => {
    setPromoting(true);
    await new Promise((r) => setTimeout(r, 800));
    setTests((prev) => prev.map((t) => t.id === promoteOpen.id ? { ...t, status: 'promoted' } : t));
    setPromoting(false);
    const name = promoteOpen.name;
    setPromoteOpen(null);
    toast.success(`"${name}" promovido para produção 🚀`);
  };

  const mockDivergences = [
    { id: 'd1', timestamp: '14:32:21', request_id: 'req_abc123', prod_response: 'approved', shadow_response: 'declined', delta_latency: '+45ms', severity: 'high' },
    { id: 'd2', timestamp: '14:30:11', request_id: 'req_def456', prod_response: 'declined', shadow_response: 'approved', delta_latency: '-12ms', severity: 'high' },
    { id: 'd3', timestamp: '14:28:55', request_id: 'req_ghi789', prod_response: 'approved', shadow_response: 'approved', delta_latency: '+8ms', severity: 'low' },
    { id: 'd4', timestamp: '14:25:02', request_id: 'req_jkl012', prod_response: 'approved', shadow_response: 'approved', delta_latency: '+2ms', severity: 'low' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shadow Mode Testing"
        subtitle="Execute novas regras/adquirentes em paralelo (sem efeito real) para validar antes de produção"
        icon={EyeOff}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Orchestration' }]}
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo shadow test
          </Button>
        }
      />

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-blue-900 text-sm">Como funciona Shadow Mode</p>
            <p className="text-xs text-blue-700 mt-1">
              Em shadow mode, a regra/adquirente recebe uma <strong>cópia</strong> da requisição mas a resposta é descartada. 
              Comparamos divergências entre prod e shadow para detectar bugs antes de promover.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {tests.map((test) => {
          const okDivergence = test.divergenceRate < 0.05;
          const okErrors = test.requestsShadow > 0 ? test.errorsShadow / test.requestsShadow < 0.02 : true;
          const isHealthy = okDivergence && okErrors;

          return (
            <Card key={test.id} className={isHealthy ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-amber-500'}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-base">{test.name}</p>
                      <Badge className={
                        test.status === 'running' ? 'bg-emerald-100 text-emerald-700' :
                        test.status === 'promoted' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }>
                        {test.status}
                      </Badge>
                      {isHealthy ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Saudável
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Atenção
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setDivergencesOpen(test)}>
                      Ver divergências
                    </Button>
                    {isHealthy && test.status === 'running' && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setPromoteOpen(test)}>
                        Promover para prod
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Requests Shadow</p>
                    <p className="text-xl font-bold">{test.requestsShadow.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Erros Shadow</p>
                    <p className={`text-xl font-bold ${okErrors ? 'text-emerald-600' : 'text-red-600'}`}>{test.errorsShadow}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Δ Latência</p>
                    <p className={`text-xl font-bold ${test.latencyDeltaMs <= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {test.latencyDeltaMs > 0 ? '+' : ''}{test.latencyDeltaMs}ms
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Taxa Divergência</p>
                    <p className={`text-xl font-bold ${okDivergence ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {(test.divergenceRate * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Drawer: Novo shadow test */}
      <EntityFormDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo shadow test"
        description="Configure o que será espelhado em paralelo à produção"
        icon={Plus}
        size="md"
        submitting={creating}
        onSubmit={handleCreate}
        submitLabel="Iniciar shadow test"
        submitDisabled={!newTest.name || !newTest.shadow_target}
      >
        <div className="space-y-4">
          <div>
            <Label>Nome do teste *</Label>
            <Input
              placeholder="Ex: Adyen como fallback Visa"
              value={newTest.name}
              onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
            />
          </div>
          <div>
            <Label>O que espelhar?</Label>
            <Select value={newTest.target} onValueChange={(v) => setNewTest({ ...newTest, target: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rule">Regra de orquestração</SelectItem>
                <SelectItem value="acquirer">Adquirente alternativo</SelectItem>
                <SelectItem value="antifraud">Modelo antifraude</SelectItem>
                <SelectItem value="3ds">Configuração 3DS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Alvo shadow *</Label>
            <Input
              placeholder="Ex: Adyen-BR ou rule_v2_aggressive"
              value={newTest.shadow_target}
              onChange={(e) => setNewTest({ ...newTest, shadow_target: e.target.value })}
            />
            <p className="text-xs text-slate-500 mt-1">Identificador da regra/adquirente que receberá a cópia</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>% do tráfego</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={newTest.traffic_pct}
                onChange={(e) => setNewTest({ ...newTest, traffic_pct: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Duração (dias)</Label>
              <Input
                type="number"
                min={1}
                max={90}
                value={newTest.duration_days}
                onChange={(e) => setNewTest({ ...newTest, duration_days: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <Label>Notas (opcional)</Label>
            <Textarea
              placeholder="Hipótese de teste, owner, link do RFC..."
              value={newTest.notes}
              onChange={(e) => setNewTest({ ...newTest, notes: e.target.value })}
              className="min-h-[60px]"
            />
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
            💡 As respostas shadow são <strong>descartadas</strong> — clientes só recebem as respostas de produção. Sem risco operacional.
          </div>
        </div>
      </EntityFormDrawer>

      {/* Drawer: Ver divergências */}
      <DetailDrawer
        open={!!divergencesOpen}
        onOpenChange={(o) => !o && setDivergencesOpen(null)}
        title={divergencesOpen ? `Divergências · ${divergencesOpen.name}` : ''}
        subtitle="Casos onde produção e shadow responderam diferente"
        icon={Activity}
        size="lg"
        kpis={divergencesOpen ? [
          { label: 'Total de requests', value: divergencesOpen.requestsShadow.toLocaleString('pt-BR') },
          { label: 'Divergências', value: Math.round(divergencesOpen.requestsShadow * divergencesOpen.divergenceRate).toLocaleString('pt-BR'), color: 'text-amber-600' },
          { label: 'Taxa', value: `${(divergencesOpen.divergenceRate * 100).toFixed(2)}%`, color: divergencesOpen.divergenceRate < 0.05 ? 'text-emerald-600' : 'text-amber-600' },
        ] : []}
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500">Últimas divergências</p>
          {mockDivergences.map((d) => (
            <div key={d.id} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 text-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">{d.request_id}</span>
                <Badge className={d.severity === 'high' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}>
                  {d.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="capitalize">prod: {d.prod_response}</Badge>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <Badge variant="outline" className="capitalize">shadow: {d.shadow_response}</Badge>
              </div>
              <p className="text-[11px] text-slate-500">{d.timestamp} · Δ latência {d.delta_latency}</p>
            </div>
          ))}
        </div>
      </DetailDrawer>

      {/* Drawer: Promover para prod */}
      <ConfirmActionDrawer
        open={!!promoteOpen}
        onOpenChange={(o) => !o && setPromoteOpen(null)}
        title="Promover shadow para produção"
        description={promoteOpen ? `"${promoteOpen.name}" passará a responder em produção` : ''}
        icon={Rocket}
        tone="success"
        confirmLabel="Promover agora"
        submitting={promoting}
        onConfirm={handlePromote}
        size="md"
        checklist={promoteOpen ? [
          { label: `Taxa de divergência aceitável (${(promoteOpen.divergenceRate * 100).toFixed(2)}%)`, ok: promoteOpen.divergenceRate < 0.05 },
          { label: 'Erros abaixo de 2%', ok: promoteOpen.errorsShadow / Math.max(promoteOpen.requestsShadow, 1) < 0.02 },
          { label: 'Latência sem degradação significativa', ok: promoteOpen.latencyDeltaMs <= 50 },
          { label: 'Mínimo de 1.000 requests observados', ok: promoteOpen.requestsShadow >= 1000 },
        ] : []}
        infoBlock="Após promover, o shadow vira produção e o config anterior é arquivado. Você pode reverter em até 24h."
      />
    </div>
  );
}