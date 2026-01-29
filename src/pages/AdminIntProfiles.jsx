import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Eye, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner';

const systemProfiles = [
    { id: 'admin', name: 'Admin', level: 5, description: 'Acesso total ao sistema', users: 3, system: true },
    { id: 'manager', name: 'Gerente', level: 4, description: 'Gestão operacional, aprovações e configurações', users: 8, system: true },
    { id: 'analyst', name: 'Analista', level: 3, description: 'Análise de transações, risco e ações operacionais', users: 15, system: true },
    { id: 'operator', name: 'Operador', level: 2, description: 'Operações básicas e suporte ao cliente', users: 12, system: true },
    { id: 'viewer', name: 'Visualizador', level: 1, description: 'Apenas visualização, sem permissão de ação', users: 7, system: true },
];

const permissionsData = {
    dashboard: {
        label: 'Dashboard',
        permissions: [
            { key: 'access', label: 'Acessar dashboard' },
            { key: 'view_indicators', label: 'Ver indicadores' },
            { key: 'view_charts', label: 'Ver gráficos' },
            { key: 'export', label: 'Exportar dashboard' },
        ]
    },
    merchants: {
        label: 'Merchants',
        permissions: [
            { key: 'list', label: 'Listar merchants' },
            { key: 'view', label: 'Ver detalhes do merchant' },
            { key: 'view_transactions', label: 'Ver transações do merchant' },
            { key: 'view_financial', label: 'Ver dados financeiros' },
            { key: 'create', label: 'Criar merchant' },
            { key: 'edit', label: 'Editar merchant' },
            { key: 'suspend', label: 'Suspender merchant' },
            { key: 'change_rates', label: 'Alterar taxas' },
            { key: 'approve_docs', label: 'Aprovar documentos' },
            { key: 'manage_chargebacks', label: 'Gerenciar chargebacks' },
        ]
    },
    transactions: {
        label: 'Transações',
        permissions: [
            { key: 'list', label: 'Listar transações' },
            { key: 'view', label: 'Ver detalhes' },
            { key: 'search', label: 'Busca avançada' },
            { key: 'export', label: 'Exportar' },
            { key: 'refund', label: 'Estornar' },
            { key: 'capture', label: 'Capturar' },
            { key: 'cancel', label: 'Cancelar' },
            { key: 'resend_webhook', label: 'Reenviar webhook' },
            { key: 'view_sensitive', label: 'Ver dados sensíveis (BIN completo)' },
        ]
    },
    financial: {
        label: 'Financeiro',
        permissions: [
            { key: 'view_balances', label: 'Ver saldos' },
            { key: 'view_settlements', label: 'Ver liquidações' },
            { key: 'view_withdrawals', label: 'Ver saques' },
            { key: 'approve_withdrawals', label: 'Aprovar saques' },
            { key: 'execute_withdrawals', label: 'Executar saques' },
            { key: 'manual_adjustments', label: 'Ajustes manuais' },
            { key: 'view_statements', label: 'Ver extratos' },
            { key: 'export_reports', label: 'Exportar relatórios' },
        ]
    },
    risk: {
        label: 'Risco',
        permissions: [
            { key: 'view_dashboard', label: 'Ver dashboard de risco' },
            { key: 'analyze_fraud', label: 'Analisar fraudes' },
            { key: 'block_transaction', label: 'Bloquear transação' },
            { key: 'approve_pending', label: 'Aprovar transação em análise' },
            { key: 'manage_chargebacks', label: 'Gerenciar chargebacks' },
            { key: 'manage_meds', label: 'Gerenciar MEDs' },
            { key: 'create_rules', label: 'Criar regras de risco' },
            { key: 'edit_lists', label: 'Editar listas de controle' },
            { key: 'configure_alerts', label: 'Configurar alertas' },
        ]
    },
    config: {
        label: 'Configurações',
        permissions: [
            { key: 'access', label: 'Acessar configurações' },
            { key: 'manage_users', label: 'Gerenciar usuários' },
            { key: 'manage_profiles', label: 'Gerenciar perfis' },
            { key: 'change_params', label: 'Alterar parâmetros' },
        ]
    },
};

const profilePermissions = {
    analyst: {
        dashboard: ['access', 'view_indicators', 'view_charts'],
        merchants: ['list', 'view', 'view_transactions', 'view_financial', 'approve_docs', 'manage_chargebacks'],
        transactions: ['list', 'view', 'search', 'export', 'refund', 'capture', 'cancel', 'resend_webhook'],
        financial: ['view_balances', 'view_settlements', 'view_withdrawals', 'view_statements', 'export_reports'],
        risk: ['view_dashboard', 'analyze_fraud', 'block_transaction', 'approve_pending', 'manage_chargebacks', 'manage_meds', 'edit_lists'],
        config: [],
    }
};

export default function AdminIntProfiles() {
    const [viewModal, setViewModal] = useState(null);
    const [newProfileModal, setNewProfileModal] = useState(false);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Perfis e Permissões"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Perfis' }]}
                actionElement={
                    <Button onClick={() => setNewProfileModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Perfil
                    </Button>
                }
            />

            {/* System Profiles */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Perfis do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {systemProfiles.map(profile => (
                        <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{profile.name}</h3>
                                        <Badge variant="outline" className="text-xs">Nível {profile.level}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500">{profile.description}</p>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> Perfil do sistema - Não editável
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-500">Usuários: {profile.users}</span>
                                <Button variant="outline" size="sm" onClick={() => setViewModal(profile.id)}>
                                    <Eye className="w-4 h-4 mr-1" /> Ver detalhes
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Custom Profiles */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Perfis Customizados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500">
                        <p>Nenhum perfil customizado criado.</p>
                        <Button variant="outline" className="mt-4" onClick={() => setNewProfileModal(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Criar perfil customizado
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* View Permissions Modal */}
            <Dialog open={!!viewModal} onOpenChange={() => setViewModal(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            Permissões do Perfil: {systemProfiles.find(p => p.id === viewModal)?.name?.toUpperCase()}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {Object.entries(permissionsData).map(([module, data]) => {
                            const allowed = profilePermissions.analyst?.[module] || [];
                            return (
                                <div key={module} className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">MÓDULO: {data.label.toUpperCase()}</h4>
                                    <div className="space-y-2">
                                        {data.permissions.map(perm => (
                                            <label key={perm.key} className="flex items-center gap-2 text-sm">
                                                <Checkbox checked={allowed.includes(perm.key)} disabled />
                                                {perm.label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewModal(null)}>Fechar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* New Profile Modal */}
            <Dialog open={newProfileModal} onOpenChange={setNewProfileModal}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Novo Perfil Customizado</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Nome do perfil *</Label>
                            <Input className="mt-1" placeholder="Ex: Analista Sênior" />
                        </div>
                        <div>
                            <Label>Descrição</Label>
                            <Textarea className="mt-1" placeholder="Descreva as responsabilidades deste perfil..." />
                        </div>
                        <div>
                            <Label>Baseado em</Label>
                            <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                                <option value="">Selecione um perfil base...</option>
                                {systemProfiles.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-500 mt-1">As permissões do perfil base serão copiadas para edição</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewProfileModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Perfil criado! Configure as permissões.'); setNewProfileModal(false); }}>
                            Criar e Configurar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}