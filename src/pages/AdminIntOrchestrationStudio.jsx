import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GitBranch, Plus, Sparkles, Activity, TrendingUp, Save, Play, Pause } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import FlowVisualEditor from '@/components/orchestration/FlowVisualEditor';
import { mockOrchestrationFlows } from '@/components/orchestration/mockData';

export default function AdminIntOrchestrationStudio() {
  const [selectedFlow, setSelectedFlow] = useState(mockOrchestrationFlows[0]);
  const [savedAt, setSavedAt] = useState(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orchestration Studio"
        subtitle="Editor visual de fluxos de orquestração de pagamento · BIN routing, fallback, smart retry"
        icon={GitBranch}
        breadcrumbs={[{ label: 'Admin Interno', page: 'AdminIntDashboard' }, { label: 'Transações', page: 'AdminIntTransactionsDashboard' }]}
        actions={
          <Button onClick={() => setSavedAt(new Date().toLocaleTimeString('pt-BR'))}>
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
                <span>Fluxos ({mockOrchestrationFlows.length})</span>
                <Button size="sm" variant="outline">
                  <Plus className="w-3 h-3 mr-1" />
                  Novo
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              {mockOrchestrationFlows.map((flow) => (
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
                      <Switch checked={selectedFlow.isActive} />
                      <Button size="sm" variant="outline">
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
    </div>
  );
}