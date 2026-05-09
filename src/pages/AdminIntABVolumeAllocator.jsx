import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { TestTube, Play, AlertTriangle, CheckCircle2, Plus } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { EntityFormDrawer, ConfirmActionDrawer } from '@/components/common/drawers';
import { toast } from 'sonner';

const MOCK_TESTS = [
  {
    id: 'ab_001',
    name: 'Cielo vs Adyen — BIN Visa BR',
    status: 'running',
    variant_a: { name: 'Cielo', traffic: 50, conv_rate: 87.4, volume: 12450 },
    variant_b: { name: 'Adyen', traffic: 50, conv_rate: 89.1, volume: 12380 },
    confidence: 92,
    started_at: '2 dias',
  },
  {
    id: 'ab_002',
    name: '3DS Frictionless vs Challenge',
    status: 'paused',
    variant_a: { name: 'Frictionless', traffic: 70, conv_rate: 91.2, volume: 8420 },
    variant_b: { name: 'Challenge', traffic: 30, conv_rate: 84.6, volume: 3610 },
    confidence: 99,
    started_at: '5 dias',
  },
];

export default function AdminIntABVolumeAllocator() {
  const [tests, setTests] = useState(MOCK_TESTS);
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [starting, setStarting] = useState(false);

  const [newTest, setNewTest] = useState({
    name: '', hypothesis: '', variant_a: '', variant_b: '', split: 50,
    target_segment: 'all', min_volume: 1000, max_duration: 14,
  });

  const handleCreate = async () => {
    if (!newTest.name || !newTest.variant_a || !newTest.variant_b) {
      toast.error('Nome e variantes A/B são obrigatórios');
      return;
    }
    setCreating(true);
    await new Promise((r) => setTimeout(r, 600));
    const created = {
      id: `ab_${Date.now()}`,
      name: newTest.name,
      status: 'running',
      variant_a: { name: newTest.variant_a, traffic: newTest.split, conv_rate: 0, volume: 0 },
      variant_b: { name: newTest.variant_b, traffic: 100 - newTest.split, conv_rate: 0, volume: 0 },
      confidence: 0,
      started_at: 'agora',
    };
    setTests((prev) => [created, ...prev]);
    setCreating(false);
    setCreateOpen(false);
    setNewTest({ name: '', hypothesis: '', variant_a: '', variant_b: '', split: 50, target_segment: 'all', min_volume: 1000, max_duration: 14 });
    toast.success(`Teste A/B "${created.name}" iniciado`);
  };

  const handleStartAll = async () => {
    setStarting(true);
    await new Promise((r) => setTimeout(r, 600));
    setTests((prev) => prev.map((t) => t.status === 'paused' ? { ...t, status: 'running' } : t));
    setStarting(false);
    setStartOpen(false);
    toast.success('Todos os testes pausados foram retomados');
  };

  const pausedCount = tests.filter((t) => t.status === 'paused').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="A/B Volume Allocator"
        subtitle="Aloque % de tráfego entre variantes para testar adquirentes, regras e configurações com significância estatística"
        icon={TestTube}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Orchestration' }]}
        actions={
          <div className="flex gap-2">
            {pausedCount > 0 && (
              <Button variant="outline" onClick={() => setStartOpen(true)}>
                <Play className="w-4 h-4 mr-2" />
                Iniciar testes agora ({pausedCount})
              </Button>
            )}
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Novo teste A/B
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase">Testes ativos</p>
            <p className="text-2xl font-bold text-emerald-600">{tests.filter((t) => t.status === 'running').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase">Pausados</p>
            <p className="text-2xl font-bold text-amber-600">{pausedCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-slate-500 uppercase">Volume total alocado</p>
            <p className="text-2xl font-bold">37.260</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {tests.map((test) => {
          const winner = test.variant_b.conv_rate > test.variant_a.conv_rate ? 'B' : 'A';
          const significant = test.confidence >= 95;
          return (
            <Card key={test.id} className={significant ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-slate-300'}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold">{test.name}</p>
                    <p className="text-xs text-slate-500">há {test.started_at}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={test.status === 'running' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                      {test.status}
                    </Badge>
                    {significant && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {test.confidence}% confiança
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['variant_a', 'variant_b'].map((key) => {
                    const v = test[key];
                    const isWinner = (key === 'variant_a' && winner === 'A') || (key === 'variant_b' && winner === 'B');
                    return (
                      <div key={key} className={`rounded-lg p-3 border ${isWinner && significant ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-sm">{v.name}</p>
                          <Badge variant="outline" className="text-[10px]">{v.traffic}%</Badge>
                        </div>
                        <p className={`text-2xl font-bold mt-2 ${isWinner && significant ? 'text-emerald-700' : ''}`}>
                          {v.conv_rate.toFixed(1)}%
                        </p>
                        <p className="text-xs text-slate-500">{v.volume.toLocaleString('pt-BR')} requests</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Drawer: Novo teste A/B */}
      <EntityFormDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Novo teste A/B"
        description="Defina hipótese, variantes e segmento alvo"
        icon={Plus}
        size="md"
        submitting={creating}
        onSubmit={handleCreate}
        submitLabel="Iniciar teste"
        submitDisabled={!newTest.name || !newTest.variant_a || !newTest.variant_b}
      >
        <div className="space-y-4">
          <div>
            <Label>Nome do teste *</Label>
            <Input
              placeholder="Ex: Cielo vs Adyen — Visa Mastercard"
              value={newTest.name}
              onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Hipótese</Label>
            <Textarea
              placeholder="Ex: Adyen converte mais do que Cielo para BINs internacionais"
              value={newTest.hypothesis}
              onChange={(e) => setNewTest({ ...newTest, hypothesis: e.target.value })}
              className="min-h-[60px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Variante A *</Label>
              <Input placeholder="Ex: Cielo" value={newTest.variant_a} onChange={(e) => setNewTest({ ...newTest, variant_a: e.target.value })} />
            </div>
            <div>
              <Label>Variante B *</Label>
              <Input placeholder="Ex: Adyen" value={newTest.variant_b} onChange={(e) => setNewTest({ ...newTest, variant_b: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Split de tráfego: A {newTest.split}% / B {100 - newTest.split}%</Label>
            <Slider
              value={[newTest.split]}
              onValueChange={(v) => setNewTest({ ...newTest, split: v[0] })}
              min={10}
              max={90}
              step={5}
              className="mt-2"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Segmento alvo</Label>
              <Select value={newTest.target_segment} onValueChange={(v) => setNewTest({ ...newTest, target_segment: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo tráfego</SelectItem>
                  <SelectItem value="bin_visa">Apenas Visa</SelectItem>
                  <SelectItem value="bin_master">Apenas Mastercard</SelectItem>
                  <SelectItem value="high_ticket">Ticket alto (≥ R$ 500)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Duração máx. (dias)</Label>
              <Input
                type="number"
                value={newTest.max_duration}
                onChange={(e) => setNewTest({ ...newTest, max_duration: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div>
            <Label>Volume mínimo por variante</Label>
            <Input
              type="number"
              value={newTest.min_volume}
              onChange={(e) => setNewTest({ ...newTest, min_volume: parseInt(e.target.value) || 0 })}
            />
            <p className="text-xs text-slate-500 mt-1">Necessário para significância estatística (recomendado ≥ 1.000).</p>
          </div>
        </div>
      </EntityFormDrawer>

      {/* Drawer: Iniciar testes pausados */}
      <ConfirmActionDrawer
        open={startOpen}
        onOpenChange={setStartOpen}
        title="Iniciar testes pausados agora"
        description={`${pausedCount} teste(s) serão retomados imediatamente`}
        icon={Play}
        tone="success"
        confirmLabel="Retomar todos"
        submitting={starting}
        onConfirm={handleStartAll}
        size="md"
        checklist={[
          { label: `${pausedCount} testes prontos para retomar`, ok: pausedCount > 0 },
          { label: 'Sem conflitos de segmento detectados', ok: true },
          { label: 'Capacity do canal disponível', ok: true },
        ]}
        infoBlock="Os testes voltarão a coletar dados imediatamente. Você pode pausá-los individualmente depois."
      />
    </div>
  );
}