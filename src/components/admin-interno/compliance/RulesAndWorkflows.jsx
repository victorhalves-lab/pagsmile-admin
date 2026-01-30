import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Edit, Trash2, Play, Pause, Settings, Zap, Mail, Bell,
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Copy, Save, Eye
} from 'lucide-react';

// Mock rules
const mockRules = [
  {
    id: 'R001',
    name: 'Aprovação Automática - Score Alto',
    description: 'Aprova automaticamente submissões com score Helena ≥ 85 e sem red flags',
    type: 'auto_approve',
    status: 'active',
    priority: 1,
    conditions: [
      { field: 'helena_score', operator: 'greater_than', value: '85' },
      { field: 'helena_red_flags', operator: 'equals', value: '0' },
    ],
    executions_count: 892,
    last_executed: '2024-01-28T14:30:00'
  },
  {
    id: 'R002',
    name: 'Rejeição Automática - Score Crítico',
    description: 'Rejeita automaticamente submissões com score Helena < 25',
    type: 'auto_reject',
    status: 'active',
    priority: 2,
    conditions: [
      { field: 'helena_score', operator: 'less_than', value: '25' },
    ],
    executions_count: 156,
    last_executed: '2024-01-28T12:15:00'
  },
  {
    id: 'R003',
    name: 'Encaminhamento Manual - PEP Detectado',
    description: 'Encaminha para análise manual se sócio é PEP',
    type: 'manual_review',
    status: 'active',
    priority: 3,
    conditions: [
      { field: 'is_pep', operator: 'equals', value: 'true' },
    ],
    executions_count: 45,
    last_executed: '2024-01-27T09:45:00'
  },
  {
    id: 'R004',
    name: 'Solicitação de Documentos - Endereço Antigo',
    description: 'Solicita novo comprovante se documento tem mais de 90 dias',
    type: 'request_documents',
    status: 'active',
    priority: 4,
    conditions: [
      { field: 'address_doc_age_days', operator: 'greater_than', value: '90' },
    ],
    executions_count: 78,
    last_executed: '2024-01-28T10:20:00'
  },
];

// Mock notification templates
const mockNotifications = [
  {
    id: 'N001',
    name: 'Aprovação de Cadastro',
    trigger: 'status_approved',
    channel: 'email',
    subject: 'Seu cadastro foi aprovado!',
    status: 'active'
  },
  {
    id: 'N002',
    name: 'Solicitação de Documentos',
    trigger: 'documents_requested',
    channel: 'email',
    subject: 'Documentos pendentes para seu cadastro',
    status: 'active'
  },
  {
    id: 'N003',
    name: 'Rejeição de Cadastro',
    trigger: 'status_rejected',
    channel: 'email',
    subject: 'Atualização sobre seu cadastro',
    status: 'active'
  },
];

const ruleTypes = [
  { value: 'auto_approve', label: 'Aprovação Automática', color: 'bg-green-100 text-green-700' },
  { value: 'auto_reject', label: 'Rejeição Automática', color: 'bg-red-100 text-red-700' },
  { value: 'manual_review', label: 'Encaminhar Manual', color: 'bg-amber-100 text-amber-700' },
  { value: 'request_documents', label: 'Solicitar Documentos', color: 'bg-blue-100 text-blue-700' },
  { value: 'notification', label: 'Enviar Notificação', color: 'bg-purple-100 text-purple-700' },
];

const conditionFields = [
  { value: 'helena_score', label: 'Score Helena' },
  { value: 'helena_red_flags', label: 'Quantidade de Red Flags' },
  { value: 'is_pep', label: 'É PEP' },
  { value: 'document_type', label: 'Tipo de Documento' },
  { value: 'business_type', label: 'Tipo de Empresa' },
  { value: 'mcc', label: 'MCC' },
  { value: 'revenue', label: 'Faturamento Mensal' },
  { value: 'address_doc_age_days', label: 'Idade do Comprovante de Endereço' },
];

const operators = [
  { value: 'equals', label: 'Igual a' },
  { value: 'not_equals', label: 'Diferente de' },
  { value: 'greater_than', label: 'Maior que' },
  { value: 'less_than', label: 'Menor que' },
  { value: 'contains', label: 'Contém' },
  { value: 'not_contains', label: 'Não contém' },
];

export default function RulesAndWorkflows() {
  const [rules, setRules] = useState(mockRules);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isNotificationEditorOpen, setIsNotificationEditorOpen] = useState(false);

  const getRuleTypeBadge = (type) => {
    const config = ruleTypes.find(t => t.value === type);
    return <Badge className={`${config?.color || 'bg-slate-100'} border-0`}>{config?.label || type}</Badge>;
  };

  const toggleRuleStatus = (ruleId) => {
    setRules(rules.map(r => 
      r.id === ruleId ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r
    ));
  };

  const openRuleEditor = (rule = null) => {
    setSelectedRule(rule);
    setIsRuleEditorOpen(true);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="rules" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="rules">Regras</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Regras de Automação</h3>
              <p className="text-sm text-slate-500">Configure regras para automação do processo de compliance</p>
            </div>
            <Button onClick={() => openRuleEditor()} className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Regra
            </Button>
          </div>

          {/* Rules Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{rules.length}</p>
                  <p className="text-xs text-slate-500">Total de Regras</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {rules.filter(r => r.status === 'active').length}
                  </p>
                  <p className="text-xs text-slate-500">Ativas</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    {rules.reduce((acc, r) => acc + r.executions_count, 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">Execuções Totais</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-4 pb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">98.5%</p>
                  <p className="text-xs text-slate-500">Taxa de Sucesso</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rules List */}
          <div className="space-y-3">
            {rules.map((rule) => (
              <Card key={rule.id} className={rule.status === 'inactive' ? 'opacity-60' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-mono">#{rule.priority}</span>
                        <Switch
                          checked={rule.status === 'active'}
                          onCheckedChange={() => toggleRuleStatus(rule.id)}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{rule.name}</h4>
                          {getRuleTypeBadge(rule.type)}
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{rule.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="font-medium">{rule.executions_count.toLocaleString()}</p>
                        <p className="text-slate-500">execuções</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => openRuleEditor(rule)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Conditions Preview */}
                  <div className="mt-3 pt-3 border-t flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">Condições:</span>
                    {rule.conditions.map((cond, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs font-mono">
                        {conditionFields.find(f => f.value === cond.field)?.label || cond.field}
                        {' '}
                        {operators.find(o => o.value === cond.operator)?.label || cond.operator}
                        {' '}
                        {cond.value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Templates de Notificação</h3>
              <p className="text-sm text-slate-500">Configure e-mails e notificações automáticas</p>
            </div>
            <Button onClick={() => setIsNotificationEditorOpen(true)} className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Plus className="w-4 h-4 mr-2" />
              Novo Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notifications.map((notif) => (
              <Card key={notif.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {notif.name}
                    </CardTitle>
                    <Badge className={notif.status === 'active' ? 'bg-green-100 text-green-700 border-0' : 'bg-slate-100 text-slate-700 border-0'}>
                      {notif.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-slate-500">Gatilho:</span>
                      <Badge variant="outline" className="text-xs">{notif.trigger}</Badge>
                    </div>
                    <div className="p-2 bg-slate-50 rounded text-xs">
                      <p className="text-slate-500">Assunto:</p>
                      <p className="font-medium">{notif.subject}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Thresholds Tab */}
        <TabsContent value="thresholds" className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Configuração de Thresholds</h3>
            <p className="text-sm text-slate-500">Defina os limites globais para o processo de compliance</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Aprovação Automática
                </CardTitle>
                <CardDescription>Score mínimo para aprovação automática pela Helena</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Score mínimo:</label>
                  <Input type="number" defaultValue="85" className="max-w-[150px]" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Exigir zero red flags</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Exigir documentação completa</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Rejeição Automática
                </CardTitle>
                <CardDescription>Score máximo para rejeição automática pela Helena</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Score máximo:</label>
                  <Input type="number" defaultValue="25" className="max-w-[150px]" />
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Rejeitar se CNPJ irregular</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked />
                  <span className="text-sm">Rejeitar se documento adulterado</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Faixa de Análise Manual
                </CardTitle>
                <CardDescription>Submissões nesta faixa de score serão encaminhadas para revisão humana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="flex-1">
                    <div className="h-8 bg-gradient-to-r from-red-500 via-amber-500 to-green-500 rounded-lg relative">
                      <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white" />
                      <div className="absolute left-[85%] top-0 bottom-0 w-px bg-white" />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-500">
                      <span>0</span>
                      <span>25 (Rejeição Auto)</span>
                      <span>85 (Aprovação Auto)</span>
                      <span>100</span>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-2xl font-bold text-amber-600">26-84</p>
                    <p className="text-xs text-amber-700">Análise Manual</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Rule Editor Modal */}
      <Dialog open={isRuleEditorOpen} onOpenChange={setIsRuleEditorOpen}>
        <DialogContent className="max-w-2xl">
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
                <Input placeholder="Ex: Aprovação Automática" defaultValue={selectedRule?.name || ''} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select defaultValue={selectedRule?.type || 'auto_approve'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ruleTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <Textarea 
                placeholder="Descreva o objetivo desta regra..."
                defaultValue={selectedRule?.description || ''}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Condições</label>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Condição
                </Button>
              </div>
              
              <div className="space-y-2">
                {(selectedRule?.conditions || [{ field: '', operator: '', value: '' }]).map((cond, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 border rounded-lg bg-slate-50">
                    <Select defaultValue={cond.field}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Campo" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditionFields.map(field => (
                          <SelectItem key={field.value} value={field.value}>{field.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue={cond.operator}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Operador" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map(op => (
                          <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input placeholder="Valor" defaultValue={cond.value} className="flex-1" />
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prioridade</label>
                <Input type="number" defaultValue={selectedRule?.priority || 1} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select defaultValue={selectedRule?.status || 'active'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRuleEditorOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-[#2bc196] hover:bg-[#239b7a]">
              <Save className="w-4 h-4 mr-2" />
              Salvar Regra
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}