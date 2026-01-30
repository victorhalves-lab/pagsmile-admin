import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Mail, Pause, Play, Edit, Eye, Clock, Zap, Send, CheckCircle2, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const summaryStats = { total: 45, active: 38, paused: 5, draft: 2, dispatches: 12456 };

const automationCategories = {
  onboarding: {
    label: 'Onboarding',
    icon: '🚀',
    items: [
      { id: 1, name: 'Boas-vindas', trigger: 'merchant.created', delay: 'Imediato', template: 'TPL-001', dispatches: 1234, openRate: 58.1, status: 'active' },
      { id: 2, name: 'Link KYC Enviado', trigger: 'kyc.link_sent', delay: 'Imediato', template: 'TPL-002', dispatches: 1234, openRate: 52.3, status: 'active' },
      { id: 3, name: 'Lembrete KYC (3 dias)', trigger: 'kyc.pending + 3 dias', delay: 'Condição: KYC não completado', template: 'TPL-003', dispatches: 456, openRate: 42.3, status: 'active' },
      { id: 4, name: 'KYC Aprovado', trigger: 'kyc.approved', delay: 'Imediato', template: 'TPL-005', dispatches: 892, openRate: 62.3, status: 'active' },
      { id: 5, name: 'KYC Reprovado', trigger: 'kyc.rejected', delay: 'Imediato', template: 'TPL-006', dispatches: 78, openRate: 45.2, status: 'active' },
      { id: 6, name: 'Merchant Ativado', trigger: 'merchant.activated', delay: 'Imediato', template: 'TPL-007', dispatches: 756, openRate: 55.2, status: 'active' },
    ]
  },
  transactional: {
    label: 'Transacional',
    icon: '💳',
    items: [
      { id: 20, name: 'Primeira Transação', trigger: 'transaction.first', delay: 'Imediato', template: 'TPL-020', dispatches: 623, openRate: 51.2, status: 'active' },
    ]
  },
  financial: {
    label: 'Financeiro',
    icon: '💰',
    items: [
      { id: 30, name: 'Saque Solicitado', trigger: 'withdrawal.requested', delay: 'Imediato', template: 'TPL-030', dispatches: 456, openRate: 48.5, status: 'active' },
      { id: 31, name: 'Saque Processado', trigger: 'withdrawal.processed', delay: 'Imediato', template: 'TPL-031', dispatches: 2345, openRate: 55.8, status: 'active' },
    ]
  },
  risk: {
    label: 'Risco e Compliance',
    icon: '🛡️',
    items: [
      { id: 40, name: 'Chargeback Recebido', trigger: 'chargeback.received', delay: 'Imediato', template: 'TPL-040', dispatches: 234, openRate: 72.1, status: 'active' },
      { id: 41, name: 'Documento Expirando', trigger: 'document.expiring', delay: '-7 dias', template: 'TPL-045', dispatches: 89, openRate: 45.3, status: 'paused' },
    ]
  }
};

const eventOptions = [
  { group: 'Merchant', options: [
    { value: 'merchant.created', label: 'Merchant cadastrado' },
    { value: 'merchant.activated', label: 'Merchant ativado' },
    { value: 'merchant.suspended', label: 'Merchant suspenso' },
  ]},
  { group: 'KYC', options: [
    { value: 'kyc.link_sent', label: 'Link de KYC enviado' },
    { value: 'kyc.approved', label: 'KYC aprovado' },
    { value: 'kyc.rejected', label: 'KYC reprovado' },
  ]},
  { group: 'Transação', options: [
    { value: 'transaction.first', label: 'Primeira transação' },
    { value: 'transaction.approved', label: 'Transação aprovada' },
  ]},
  { group: 'Financeiro', options: [
    { value: 'withdrawal.requested', label: 'Saque solicitado' },
    { value: 'withdrawal.processed', label: 'Saque processado' },
  ]},
];

export default function AdminIntCommAutomations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [newAutomationModal, setNewAutomationModal] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  const AutomationCard = ({ automation }) => (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-[#2bc196]/50 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            automation.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30'
          )}>
            <Mail className={cn(
              "w-4 h-4",
              automation.status === 'active' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            )} />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white">{automation.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Template: {automation.template}</p>
          </div>
        </div>
        <Badge 
          variant="outline"
          className={cn(
            "text-xs",
            automation.status === 'active' 
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
              : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
          )}
        >
          {automation.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
          {automation.status === 'active' ? 'Ativa' : 'Pausada'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-4 py-3 border-t border-b border-slate-100 dark:border-slate-800 mb-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Gatilho</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{automation.trigger}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Disparos (30d)</p>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{automation.dispatches.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Taxa de Abertura</p>
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{automation.openRate}%</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" className="h-8">
          <Edit className="w-3.5 h-3.5 mr-1.5" /> Editar
        </Button>
        <Button variant="outline" size="sm" className="h-8">
          {automation.status === 'active' 
            ? <><Pause className="w-3.5 h-3.5 mr-1.5" /> Pausar</> 
            : <><Play className="w-3.5 h-3.5 mr-1.5" /> Ativar</>
          }
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Régua de E-mails"
        subtitle="Automações de comunicação por e-mail"
        icon={Zap}
        breadcrumbs={[
          { label: 'Admin Interno', page: 'AdminIntDashboard' },
          { label: 'Comunicação', page: 'AdminIntCommDashboard' },
          { label: 'Automações' }
        ]}
        actions={
          <Button onClick={() => setNewAutomationModal(true)}>
            <Plus className="w-4 h-4 mr-2" /> Nova Automação
          </Button>
        }
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-slate-900 dark:text-white">{summaryStats.total}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{summaryStats.active}</p>
            <p className="text-sm text-emerald-600/70 dark:text-emerald-400/70">Ativas</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{summaryStats.paused}</p>
            <p className="text-sm text-amber-600/70 dark:text-amber-400/70">Pausadas</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-slate-400">{summaryStats.draft}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Rascunhos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{summaryStats.dispatches.toLocaleString()}</p>
            <p className="text-sm text-blue-600/70 dark:text-blue-400/70">Disparos (30d)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Buscar automação..." 
                className="pl-10" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                <SelectItem value="onboarding">Onboarding</SelectItem>
                <SelectItem value="transactional">Transacional</SelectItem>
                <SelectItem value="financial">Financeiro</SelectItem>
                <SelectItem value="risk">Risco</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="paused">Pausadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Automation Categories */}
      {Object.entries(automationCategories).map(([key, category]) => (
        <Card key={key}>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <span className="text-lg">{category.icon}</span>
              {category.label}
            </CardTitle>
            <CardDescription>{category.items.length} automações configuradas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.items.map(automation => (
                <AutomationCard key={automation.id} automation={automation} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* New Automation Modal */}
      <Dialog open={newAutomationModal} onOpenChange={setNewAutomationModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2bc196]" />
              Nova Automação
            </DialogTitle>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="trigger">Gatilho</TabsTrigger>
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="config">Configurações</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 mt-4">
              <div>
                <Label>Nome da automação *</Label>
                <Input className="mt-1.5" placeholder="Ex: Boas-vindas ao cadastro" />
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea className="mt-1.5" placeholder="E-mail enviado automaticamente quando..." />
              </div>
              <div>
                <Label>Categoria *</Label>
                <Select>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="transactional">Transacional</SelectItem>
                    <SelectItem value="financial">Financeiro</SelectItem>
                    <SelectItem value="risk">Risco e Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="trigger" className="space-y-4 mt-4">
              <div>
                <Label>Evento gatilho *</Label>
                <Select>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione o evento..." /></SelectTrigger>
                  <SelectContent>
                    {eventOptions.map(group => (
                      <React.Fragment key={group.group}>
                        <SelectItem value={`_group_${group.group}`} disabled className="font-semibold text-slate-900 dark:text-white">
                          {group.group}
                        </SelectItem>
                        {group.options.map(opt => (
                          <SelectItem key={opt.value} value={opt.value} className="pl-6">{opt.label}</SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delay (atraso no envio)</Label>
                <div className="space-y-3 mt-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="delay" defaultChecked className="text-[#2bc196]" /> 
                    <span className="text-sm">Imediato</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="delay" className="text-[#2bc196]" /> 
                    <span className="text-sm">Aguardar:</span>
                    <Input className="w-20 h-8" placeholder="30" /> 
                    <Select>
                      <SelectTrigger className="w-28 h-8"><SelectValue placeholder="minutos" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">minutos</SelectItem>
                        <SelectItem value="hours">horas</SelectItem>
                        <SelectItem value="days">dias</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="template" className="space-y-4 mt-4">
              <div>
                <Label>Template de e-mail *</Label>
                <Select>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Selecione o template..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TPL-001">TPL-001 - Boas-vindas ao PagSmile</SelectItem>
                    <SelectItem value="TPL-002">TPL-002 - Link para completar KYC</SelectItem>
                    <SelectItem value="TPL-005">TPL-005 - KYC Aprovado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" /> Preview do template
              </Button>
            </TabsContent>

            <TabsContent value="config" className="space-y-4 mt-4">
              <div>
                <Label>Remetente</Label>
                <Select>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="noreply@pagsmile.com" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noreply">noreply@pagsmile.com</SelectItem>
                    <SelectItem value="suporte">suporte@pagsmile.com</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox defaultChecked /> 
                  <span className="text-sm">Habilitar tracking de abertura</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox defaultChecked /> 
                  <span className="text-sm">Habilitar tracking de cliques</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox /> 
                  <span className="text-sm">Ativar automação imediatamente após salvar</span>
                </label>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setNewAutomationModal(false)}>Cancelar</Button>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" /> Enviar Teste
            </Button>
            <Button onClick={() => { toast.success('Automação criada com sucesso!'); setNewAutomationModal(false); }}>
              Salvar Automação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}