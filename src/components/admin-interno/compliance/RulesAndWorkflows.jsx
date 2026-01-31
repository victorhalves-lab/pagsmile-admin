import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import DecisionFlowVisualizer from '@/components/common/DecisionFlowVisualizer';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus, Edit, Trash2, Play, Pause, Settings, CheckCircle2, AlertTriangle,
  GitBranch, Filter, Bell, User
} from 'lucide-react';

const mockRules = [
  {
    id: 'rule_001',
    name: 'Auto-Aprovação Score Alto',
    description: 'Aprova automaticamente quando Helena Score >= 80',
    type: 'auto_approve',
    status: 'active',
    priority: 1,
    conditions: [
      { field: 'helena_score', operator: 'greater_than', value: '80' }
    ],
    actions: [
      { action_type: 'set_status', parameters: { status: 'ai_approved' } }
    ],
    executions_count: 892
  },
  {
    id: 'rule_002',
    name: 'Rejeição Automática Score Crítico',
    description: 'Rejeita automaticamente quando Helena Score < 30',
    type: 'auto_reject',
    status: 'active',
    priority: 1,
    conditions: [
      { field: 'helena_score', operator: 'less_than', value: '30' }
    ],
    actions: [
      { action_type: 'set_status', parameters: { status: 'ai_rejected' } }
    ],
    executions_count: 156
  },
  {
    id: 'rule_003',
    name: 'Análise Manual Faixa Intermediária',
    description: 'Encaminha para análise manual scores entre 30-80',
    type: 'manual_review',
    status: 'active',
    priority: 2,
    conditions: [
      { field: 'helena_score', operator: 'greater_than', value: '30' },
      { field: 'helena_score', operator: 'less_than', value: '80' }
    ],
    logic_operator: 'AND',
    actions: [
      { action_type: 'set_status', parameters: { status: 'manual_review' } },
      { action_type: 'send_notification', parameters: { template: 'manual_review_needed' } }
    ],
    executions_count: 199
  },
  {
    id: 'rule_004',
    name: 'Atribuição Automática para Analista Senior',
    description: 'Atribui casos com PEP para analistas seniores',
    type: 'manual_review',
    status: 'active',
    priority: 1,
    conditions: [
      { field: 'helena_red_flags', operator: 'contains', value: 'PEP detectado' }
    ],
    actions: [
      { action_type: 'assign_analyst', parameters: { role: 'senior_analyst' } },
      { action_type: 'add_flag', parameters: { flag: 'PEP_DETECTED' } }
    ],
    executions_count: 24
  }
];

export default function RulesAndWorkflows() {
  const [rules, setRules] = useState(mockRules);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [visualizerOpen, setVisualizerOpen] = useState(false);

  const typeConfig = {
    auto_approve: { label: 'Auto-Aprovação', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
    auto_reject: { label: 'Auto-Rejeição', color: 'bg-red-100 text-red-700', icon: AlertTriangle },
    manual_review: { label: 'Análise Manual', color: 'bg-amber-100 text-amber-700', icon: User },
    request_documents: { label: 'Solicitar Docs', color: 'bg-blue-100 text-blue-700', icon: Filter },
    notification: { label: 'Notificação', color: 'bg-purple-100 text-purple-700', icon: Bell }
  };

  const openEditor = (rule = null) => {
    setSelectedRule(rule);
    setEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Regras de Compliance</h3>
          <p className="text-sm text-slate-500">Automatize decisões com regras configuráveis</p>
        </div>
        <Button onClick={() => openEditor()} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Regra
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {rules.filter(r => r.type === 'auto_approve').length}
              </p>
              <p className="text-xs text-slate-600">Auto-Aprovação</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {rules.filter(r => r.type === 'auto_reject').length}
              </p>
              <p className="text-xs text-slate-600">Auto-Rejeição</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {rules.filter(r => r.type === 'manual_review').length}
              </p>
              <p className="text-xs text-slate-600">Revisão Manual</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {rules.filter(r => r.status === 'active').length}
              </p>
              <p className="text-xs text-slate-600">Regras Ativas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => {
          const config = typeConfig[rule.type];
          const Icon = config.icon;
          
          return (
            <Card key={rule.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{rule.name}</h4>
                        <Badge className={config.color}>{config.label}</Badge>
                        <Badge variant="outline" className="text-xs">Prioridade {rule.priority}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{rule.description}</p>
                      
                      {/* Conditions Preview */}
                      <div className="flex items-center gap-2 text-xs">
                        <GitBranch className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-500">
                          {rule.conditions.length} condição(ões) • {rule.actions.length} ação(ões)
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs ml-2"
                          onClick={() => {
                            setSelectedRule(rule);
                            setVisualizerOpen(true);
                          }}
                        >
                          Ver Fluxo
                        </Button>
                      </div>

                      {/* Execution Stats */}
                      <div className="mt-2 text-xs text-slate-500">
                        Executada {rule.executions_count.toLocaleString()} vezes
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditor(rule)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={rule.status === 'active' ? 'text-amber-600' : 'text-green-600'}
                    >
                      {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Flow Visualizer Modal */}
      <Dialog open={visualizerOpen} onOpenChange={setVisualizerOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fluxo de Decisão: {selectedRule?.name}</DialogTitle>
          </DialogHeader>
          <DecisionFlowVisualizer 
            rule={{
              condition: selectedRule?.conditions.map(c => `${c.field} ${c.operator} ${c.value}`).join(' AND '),
              action: selectedRule?.actions[0]?.action_type
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Rule Editor Modal */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRule ? `Editar Regra: ${selectedRule.name}` : 'Nova Regra'}
            </DialogTitle>
            <DialogDescription>
              Configure as condições e ações da regra
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Regra</label>
                <Input placeholder="Ex: Auto-aprovação score alto" defaultValue={selectedRule?.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select defaultValue={selectedRule?.type || 'auto_approve'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto_approve">Auto-Aprovação</SelectItem>
                    <SelectItem value="auto_reject">Auto-Rejeição</SelectItem>
                    <SelectItem value="manual_review">Análise Manual</SelectItem>
                    <SelectItem value="request_documents">Solicitar Documentos</SelectItem>
                    <SelectItem value="notification">Notificação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea placeholder="Descreva o propósito da regra..." defaultValue={selectedRule?.description} />
            </div>

            <Card className="border-blue-200 bg-blue-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Condições</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Select defaultValue="helena_score">
                    <SelectTrigger>
                      <SelectValue placeholder="Campo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="helena_score">Helena Score</SelectItem>
                      <SelectItem value="helena_red_flags">Red Flags</SelectItem>
                      <SelectItem value="document_count">Qtd Documentos</SelectItem>
                      <SelectItem value="time_in_queue">Tempo na Fila</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="greater_than">
                    <SelectTrigger>
                      <SelectValue placeholder="Operador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Igual a</SelectItem>
                      <SelectItem value="not_equals">Diferente de</SelectItem>
                      <SelectItem value="greater_than">Maior que</SelectItem>
                      <SelectItem value="less_than">Menor que</SelectItem>
                      <SelectItem value="contains">Contém</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input placeholder="Valor" defaultValue="80" />
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Plus className="w-3 h-3" />
                  Adicionar Condição
                </Button>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select defaultValue="set_status">
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de ação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="set_status">Alterar Status</SelectItem>
                    <SelectItem value="send_notification">Enviar Notificação</SelectItem>
                    <SelectItem value="assign_analyst">Atribuir Analista</SelectItem>
                    <SelectItem value="request_document">Solicitar Documento</SelectItem>
                    <SelectItem value="add_flag">Adicionar Flag</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Plus className="w-3 h-3" />
                  Adicionar Ação
                </Button>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancelar
            </Button>
            <SimulatedActionButton
              actionLabel="Regra salva com sucesso"
              icon={CheckCircle2}
              onSimulatedAction={() => setEditorOpen(false)}
            >
              Salvar Regra
            </SimulatedActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}