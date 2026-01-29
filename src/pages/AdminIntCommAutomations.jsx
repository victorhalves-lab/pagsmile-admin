import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Mail, Pause, Play, Edit, Eye, Clock, Zap } from 'lucide-react';
import { toast } from 'sonner';

const summaryStats = { total: 45, active: 38, paused: 5, draft: 2, dispatches: 12456 };

const automationCategories = {
    onboarding: {
        label: '📂 ONBOARDING',
        items: [
            { id: 1, name: 'Boas-vindas', trigger: 'merchant.created', delay: 'Imediato', template: 'TPL-001', dispatches: 1234, openRate: 58.1, status: 'active' },
            { id: 2, name: 'Link KYC Enviado', trigger: 'kyc.link_sent', delay: 'Imediato', template: 'TPL-002', dispatches: 1234, openRate: 52.3, status: 'active' },
            { id: 3, name: 'Lembrete KYC (3 dias)', trigger: 'kyc.pending + 3 dias', delay: 'Condição: KYC não completado', template: 'TPL-003', dispatches: 456, openRate: 42.3, status: 'active' },
            { id: 4, name: 'Lembrete KYC - Último Aviso (6 dias)', trigger: 'kyc.pending + 6 dias', delay: 'Condição: KYC não completado', template: 'TPL-004', dispatches: 189, openRate: 38.7, status: 'active' },
            { id: 5, name: 'KYC Aprovado', trigger: 'kyc.approved', delay: 'Imediato', template: 'TPL-005', dispatches: 892, openRate: 62.3, status: 'active' },
            { id: 6, name: 'KYC Reprovado', trigger: 'kyc.rejected', delay: 'Imediato', template: 'TPL-006', dispatches: 78, openRate: 45.2, status: 'active' },
            { id: 7, name: 'Merchant Ativado', trigger: 'merchant.activated', delay: 'Imediato', template: 'TPL-007', dispatches: 756, openRate: 55.2, status: 'active' },
            { id: 8, name: 'Credenciais API', trigger: 'merchant.activated', delay: '+30 minutos', template: 'TPL-008', dispatches: 756, openRate: 48.9, status: 'active' },
        ]
    },
    transactional: {
        label: '📂 TRANSACIONAL',
        items: [
            { id: 20, name: 'Primeira Transação', trigger: 'transaction.first', delay: 'Imediato', template: 'TPL-020', dispatches: 623, openRate: 51.2, status: 'active' },
        ]
    },
    financial: {
        label: '📂 FINANCEIRO',
        items: [
            { id: 30, name: 'Saque Solicitado', trigger: 'withdrawal.requested', delay: 'Imediato', template: 'TPL-030', dispatches: 456, openRate: 48.5, status: 'active' },
            { id: 31, name: 'Saque Processado', trigger: 'withdrawal.processed', delay: 'Imediato', template: 'TPL-031', dispatches: 2345, openRate: 55.8, status: 'active' },
        ]
    },
    risk: {
        label: '📂 RISCO E COMPLIANCE',
        items: [
            { id: 40, name: 'Chargeback Recebido', trigger: 'chargeback.received', delay: 'Imediato', template: 'TPL-040', dispatches: 234, openRate: 72.1, status: 'active' },
            { id: 41, name: 'Documento Expirando', trigger: 'document.expiring', delay: '-7 dias', template: 'TPL-045', dispatches: 89, openRate: 45.3, status: 'paused' },
        ]
    }
};

const eventOptions = [
    { group: 'MERCHANT', options: [
        { value: 'merchant.created', label: 'Merchant cadastrado' },
        { value: 'merchant.activated', label: 'Merchant ativado' },
        { value: 'merchant.suspended', label: 'Merchant suspenso' },
    ]},
    { group: 'KYC', options: [
        { value: 'kyc.link_sent', label: 'Link de KYC enviado' },
        { value: 'kyc.approved', label: 'KYC aprovado' },
        { value: 'kyc.rejected', label: 'KYC reprovado' },
        { value: 'kyc.pending', label: 'KYC pendente (para lembretes)' },
    ]},
    { group: 'TRANSAÇÃO', options: [
        { value: 'transaction.first', label: 'Primeira transação do merchant' },
        { value: 'transaction.approved', label: 'Transação aprovada' },
    ]},
    { group: 'FINANCEIRO', options: [
        { value: 'withdrawal.requested', label: 'Saque solicitado' },
        { value: 'withdrawal.processed', label: 'Saque processado' },
    ]},
    { group: 'RISCO', options: [
        { value: 'chargeback.received', label: 'Chargeback recebido' },
        { value: 'document.expiring', label: 'Documento expirando' },
    ]},
];

export default function AdminIntCommAutomations() {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [newAutomationModal, setNewAutomationModal] = useState(false);
    const [activeTab, setActiveTab] = useState('info');

    const AutomationCard = ({ automation }) => (
        <div className="border rounded-lg p-4 hover:bg-slate-50">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{automation.name}</span>
                </div>
                <Badge className={automation.status === 'active' ? 'bg-green-100 text-green-700 border-0' : 'bg-yellow-100 text-yellow-700 border-0'}>
                    {automation.status === 'active' ? '✅ Ativa' : '⏸️ Pausada'}
                </Badge>
            </div>
            <div className="text-sm text-slate-500 space-y-1">
                <p><Zap className="w-3 h-3 inline mr-1" /> Gatilho: {automation.trigger} | Delay: {automation.delay}</p>
                <p>Template: {automation.template} | Disparos (30d): {automation.dispatches.toLocaleString()} | Abertura: {automation.openRate}%</p>
            </div>
            <div className="flex justify-end gap-2 mt-3">
                <Button variant="outline" size="sm"><Edit className="w-3 h-3 mr-1" /> Editar</Button>
                <Button variant="outline" size="sm">
                    {automation.status === 'active' ? <><Pause className="w-3 h-3 mr-1" /> Pausar</> : <><Play className="w-3 h-3 mr-1" /> Ativar</>}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Régua de E-mails - Automações"
                breadcrumbs={[{ label: 'Comunicação', page: 'AdminIntCommDashboard' }, { label: 'Régua de E-mails' }]}
                actions={
                    <Button onClick={() => setNewAutomationModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Nova Automação
                    </Button>
                }
            />

            {/* Summary */}
            <Card>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-5 gap-4 text-center">
                        <div><p className="text-2xl font-bold">{summaryStats.total}</p><p className="text-sm text-slate-500">Total</p></div>
                        <div><p className="text-2xl font-bold text-green-600">{summaryStats.active}</p><p className="text-sm text-slate-500">Ativas</p></div>
                        <div><p className="text-2xl font-bold text-yellow-600">{summaryStats.paused}</p><p className="text-sm text-slate-500">Pausadas</p></div>
                        <div><p className="text-2xl font-bold text-slate-400">{summaryStats.draft}</p><p className="text-sm text-slate-500">Rascunhos</p></div>
                        <div><p className="text-2xl font-bold text-blue-600">{summaryStats.dispatches.toLocaleString()}</p><p className="text-sm text-slate-500">Disparos (30d)</p></div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input placeholder="Buscar automação..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="onboarding">Onboarding</SelectItem>
                                <SelectItem value="transactional">Transacional</SelectItem>
                                <SelectItem value="financial">Financeiro</SelectItem>
                                <SelectItem value="risk">Risco</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
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
                    <CardHeader>
                        <CardTitle className="text-base">{category.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {category.items.map(automation => (
                            <AutomationCard key={automation.id} automation={automation} />
                        ))}
                    </CardContent>
                </Card>
            ))}

            {/* New Automation Modal */}
            <Dialog open={newAutomationModal} onOpenChange={setNewAutomationModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Nova Automação</DialogTitle>
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
                                <Input className="mt-1" placeholder="Ex: Boas-vindas ao cadastro" />
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Textarea className="mt-1" placeholder="E-mail enviado automaticamente quando..." />
                            </div>
                            <div>
                                <Label>Categoria *</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="onboarding">Onboarding</SelectItem>
                                        <SelectItem value="transactional">Transacional</SelectItem>
                                        <SelectItem value="financial">Financeiro</SelectItem>
                                        <SelectItem value="risk">Risco e Compliance</SelectItem>
                                        <SelectItem value="system">Sistema</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="trigger" className="space-y-4 mt-4">
                            <div>
                                <Label>Evento *</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o evento..." /></SelectTrigger>
                                    <SelectContent>
                                        {eventOptions.map(group => (
                                            <React.Fragment key={group.group}>
                                                <SelectItem value={`_group_${group.group}`} disabled className="font-semibold">📂 {group.group}</SelectItem>
                                                {group.options.map(opt => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Delay (atraso no envio)</Label>
                                <div className="space-y-2 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="delay" defaultChecked /> Imediato
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="delay" /> Aguardar: <Input className="w-20 h-8" placeholder="30" /> 
                                        <Select><SelectTrigger className="w-24 h-8"><SelectValue placeholder="minutos" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="minutes">minutos</SelectItem>
                                                <SelectItem value="hours">horas</SelectItem>
                                                <SelectItem value="days">dias</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <Label>Condições (opcional)</Label>
                                <div className="space-y-2 mt-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <Checkbox /> Não enviar se merchant estiver suspenso
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <Checkbox /> Não enviar fora do horário comercial (9h-18h)
                                    </label>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="template" className="space-y-4 mt-4">
                            <div>
                                <Label>Template de e-mail *</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione o template..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="TPL-001">TPL-001 - Boas-vindas ao PagSmile</SelectItem>
                                        <SelectItem value="TPL-002">TPL-002 - Link para completar KYC</SelectItem>
                                        <SelectItem value="TPL-005">TPL-005 - KYC Aprovado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="outline"><Eye className="w-4 h-4 mr-2" /> Preview do template</Button>
                        </TabsContent>

                        <TabsContent value="config" className="space-y-4 mt-4">
                            <div>
                                <Label>Remetente</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="noreply@pagsmile.com" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="noreply">noreply@pagsmile.com</SelectItem>
                                        <SelectItem value="suporte">suporte@pagsmile.com</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox defaultChecked /> Habilitar tracking de abertura
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox defaultChecked /> Habilitar tracking de cliques
                                </label>
                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox /> Ativar automação imediatamente após salvar
                                </label>
                            </div>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewAutomationModal(false)}>Cancelar</Button>
                        <Button variant="outline"><Mail className="w-4 h-4 mr-2" /> Enviar Teste</Button>
                        <Button onClick={() => { toast.success('Automação criada!'); setNewAutomationModal(false); }}>
                            💾 Salvar Automação
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}