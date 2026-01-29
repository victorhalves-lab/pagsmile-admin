import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Building2, Clock, Shield, BarChart3, Bell, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminIntSettings() {
    const [editModal, setEditModal] = useState(null);

    const companyData = {
        legalName: 'PAGSMILE BRASIL PAGAMENTOS LTDA',
        tradeName: 'PagSmile',
        document: '12.345.678/0001-90',
        stateRegistration: '123.456.789.000',
        address: 'Av. Paulista, 1000 - Cj. 100, Bela Vista - São Paulo/SP - CEP 01310-100',
        phone: '(11) 3000-0000',
        email: 'contato@pagsmile.com',
        website: 'https://pagsmile.com',
    };

    const operationData = {
        timezone: 'America/Sao_Paulo (BRT -3)',
        currency: 'BRL - Real Brasileiro',
        dateFormat: 'DD/MM/AAAA',
        timeFormat: '24 horas',
        decimalSeparator: 'Vírgula (1.234,56)',
        operationHours: '00:00 às 23:59 (24h)',
        holidays: 'Feriados nacionais + estaduais de SP',
    };

    const securityData = {
        require2fa: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        lockoutDuration: 15,
        passwordMinLength: 12,
        passwordExpiry: 90,
        passwordHistory: 5,
        ipRestriction: 'Todos (sem restrição)',
    };

    const limitsData = {
        minTransaction: 1,
        maxTransaction: 100000,
        minPix: 0.01,
        maxPix: 100000,
        minBoleto: 5,
        maxBoleto: 50000,
        dailyLimitCpf: 50000,
        monthlyLimitCpf: 200000,
    };

    const notificationsData = {
        alertEmail: 'alertas@pagsmile.com',
        supportEmail: 'suporte@pagsmile.com',
        financeEmail: 'financeiro@pagsmile.com',
        slackChannel: '#alertas-operacao',
        webhookUrl: 'https://hooks.pagsmile.com/alerts',
    };

    const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

    const Section = ({ title, icon: Icon, data, fields, onEdit }) => (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="w-5 h-5" /> {title}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-1" /> Editar
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    {fields.map((field, idx) => (
                        <div key={idx} className={field.fullWidth ? 'col-span-2' : ''}>
                            <span className="text-slate-500">{field.label}:</span>
                            <span className="ml-2 font-medium">{field.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Configurações Gerais"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Configurações' }]}
            />

            <Section 
                title="Dados da Empresa" 
                icon={Building2}
                onEdit={() => setEditModal('company')}
                fields={[
                    { label: 'Razão Social', value: companyData.legalName },
                    { label: 'Nome Fantasia', value: companyData.tradeName },
                    { label: 'CNPJ', value: companyData.document },
                    { label: 'Inscrição Estadual', value: companyData.stateRegistration },
                    { label: 'Endereço', value: companyData.address, fullWidth: true },
                    { label: 'Telefone', value: companyData.phone },
                    { label: 'E-mail', value: companyData.email },
                    { label: 'Website', value: companyData.website },
                ]}
            />

            <Section 
                title="Operação" 
                icon={Clock}
                onEdit={() => setEditModal('operation')}
                fields={[
                    { label: 'Fuso horário', value: operationData.timezone },
                    { label: 'Moeda padrão', value: operationData.currency },
                    { label: 'Formato de data', value: operationData.dateFormat },
                    { label: 'Formato de hora', value: operationData.timeFormat },
                    { label: 'Separador decimal', value: operationData.decimalSeparator },
                    { label: 'Horário de operação', value: operationData.operationHours },
                    { label: 'Dias não úteis automáticos', value: operationData.holidays, fullWidth: true },
                ]}
            />

            <Section 
                title="Segurança" 
                icon={Shield}
                onEdit={() => setEditModal('security')}
                fields={[
                    { label: '2FA obrigatório', value: securityData.require2fa ? '✅ Sim (para todos os perfis)' : '❌ Não' },
                    { label: 'Expiração de sessão', value: `${securityData.sessionTimeout} minutos de inatividade` },
                    { label: 'Tentativas de login', value: `${securityData.maxLoginAttempts} (depois bloqueia por ${securityData.lockoutDuration} minutos)` },
                    { label: 'Política de senha', value: `Mín. ${securityData.passwordMinLength} caracteres, maiúscula, número, especial` },
                    { label: 'Expiração de senha', value: `${securityData.passwordExpiry} dias` },
                    { label: 'Histórico de senhas', value: `Últimas ${securityData.passwordHistory} não podem ser reutilizadas` },
                    { label: 'IPs permitidos', value: securityData.ipRestriction, fullWidth: true },
                ]}
            />

            <Section 
                title="Limites Globais" 
                icon={BarChart3}
                onEdit={() => setEditModal('limits')}
                fields={[
                    { label: 'Transação mínima', value: formatCurrency(limitsData.minTransaction) },
                    { label: 'Transação máxima', value: formatCurrency(limitsData.maxTransaction) },
                    { label: 'PIX mínimo', value: formatCurrency(limitsData.minPix) },
                    { label: 'PIX máximo', value: formatCurrency(limitsData.maxPix) },
                    { label: 'Boleto mínimo', value: formatCurrency(limitsData.minBoleto) },
                    { label: 'Boleto máximo', value: formatCurrency(limitsData.maxBoleto) },
                    { label: 'Limite diário por CPF', value: formatCurrency(limitsData.dailyLimitCpf) },
                    { label: 'Limite mensal por CPF', value: formatCurrency(limitsData.monthlyLimitCpf) },
                ]}
            />

            <Section 
                title="Notificações do Sistema" 
                icon={Bell}
                onEdit={() => setEditModal('notifications')}
                fields={[
                    { label: 'E-mail de alertas', value: notificationsData.alertEmail },
                    { label: 'E-mail de suporte', value: notificationsData.supportEmail },
                    { label: 'E-mail financeiro', value: notificationsData.financeEmail },
                    { label: 'Notificações Slack', value: notificationsData.slackChannel },
                    { label: 'Webhook de alertas', value: notificationsData.webhookUrl, fullWidth: true },
                ]}
            />

            {/* Edit Modal */}
            <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Editar {editModal === 'company' ? 'Dados da Empresa' : editModal === 'operation' ? 'Operação' : editModal === 'security' ? 'Segurança' : editModal === 'limits' ? 'Limites Globais' : 'Notificações'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-slate-500">Formulário de edição seria exibido aqui com os campos correspondentes.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Configurações salvas!'); setEditModal(null); }}>
                            💾 Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}