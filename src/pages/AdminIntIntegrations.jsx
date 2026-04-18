import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SideDrawer from '@/components/common/SideDrawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, RefreshCw, Plus, Building2, Shield, Landmark, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const integrations = {
    acquirers: [
        { name: 'Cielo', code: '1234567890', env: 'Produção', status: 'active', lastTransaction: '28/01/2026 14:35', uptime: 99.98 },
        { name: 'Rede', code: '0987654321', env: 'Produção', status: 'active', lastTransaction: '28/01/2026 14:30', uptime: 99.95 },
        { name: 'Stone', code: '5555555555', env: 'Sandbox', status: 'inactive', lastTransaction: '-', uptime: 0 },
    ],
    antifraud: [
        { name: 'ClearSale', account: 'PagSmile_Prod', mode: 'Total Guarantee', status: 'active', sla: 98.5, avgScore: 72 },
        { name: 'Konduto', account: 'pagsmile_api', mode: 'Score Only', status: 'active', sla: 99.2, avgScore: 68 },
    ],
    banking: [
        { name: 'Banco do Brasil', account: '12345-6 / Ag: 1234-5', psp: 'Direto', status: 'active', keys: 3, lastTransaction: '28/01/2026 14:32' },
        { name: 'Itaú', account: '98765-4 / Ag: 4321-0', psp: 'Direto', status: 'active', keys: 2, lastTransaction: '28/01/2026 14:28' },
    ],
    notifications: [
        { name: 'SendGrid', type: 'E-mail', status: 'active', sent24h: 1234 },
        { name: 'Twilio', type: 'SMS', status: 'active', sent24h: 89 },
        { name: 'Slack', type: 'Alertas', status: 'active', channels: 5 },
    ],
};

const statusConfig = {
    active: { label: '✅ Ativo', color: 'bg-green-100 text-green-700' },
    inactive: { label: '⚫ Inativo', color: 'bg-slate-100 text-slate-700' },
    error: { label: '❌ Erro', color: 'bg-red-100 text-red-700' },
};

export default function AdminIntIntegrations() {
    const [configModal, setConfigModal] = useState(null);
    const [newIntegrationModal, setNewIntegrationModal] = useState(false);

    const IntegrationCard = ({ integration, icon: Icon, type }) => (
        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{integration.name}</h3>
                        <Badge className={`${statusConfig[integration.status].color} border-0 text-xs`}>
                            {statusConfig[integration.status].label}
                        </Badge>
                    </div>
                    {type === 'acquirer' && (
                        <p className="text-sm text-slate-500">EC: {integration.code} | Ambiente: {integration.env}</p>
                    )}
                    {type === 'antifraud' && (
                        <p className="text-sm text-slate-500">Conta: {integration.account} | Modo: {integration.mode}</p>
                    )}
                    {type === 'banking' && (
                        <p className="text-sm text-slate-500">Conta: {integration.account} | PSP: {integration.psp}</p>
                    )}
                    {type === 'notification' && (
                        <p className="text-sm text-slate-500">Tipo: {integration.type}</p>
                    )}
                    {integration.lastTransaction && (
                        <p className="text-xs text-slate-400">Última transação: {integration.lastTransaction}</p>
                    )}
                    {integration.uptime > 0 && (
                        <p className="text-xs text-slate-400">Uptime: {integration.uptime}%</p>
                    )}
                    {integration.sla && (
                        <p className="text-xs text-slate-400">SLA: {integration.sla}% &lt; 2s | Score médio: {integration.avgScore}/100</p>
                    )}
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setConfigModal(integration.name)}>
                    <Settings className="w-4 h-4 mr-1" /> Configurar
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success(`Teste de ${integration.name} OK!`)}>
                    <RefreshCw className="w-4 h-4 mr-1" /> Testar
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Integrações"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Integrações' }]}
                actionElement={
                    <Button onClick={() => setNewIntegrationModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Nova Integração
                    </Button>
                }
            />

            {/* Acquirers */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="w-5 h-5" /> Adquirentes
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {integrations.acquirers.map((int, idx) => (
                        <IntegrationCard key={idx} integration={int} icon={Building2} type="acquirer" />
                    ))}
                </CardContent>
            </Card>

            {/* Antifraud */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Antifraude
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {integrations.antifraud.map((int, idx) => (
                        <IntegrationCard key={idx} integration={int} icon={Shield} type="antifraud" />
                    ))}
                </CardContent>
            </Card>

            {/* Banking */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Landmark className="w-5 h-5" /> PIX / Bancos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {integrations.banking.map((int, idx) => (
                        <IntegrationCard key={idx} integration={int} icon={Landmark} type="banking" />
                    ))}
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="w-5 h-5" /> Notificações
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {integrations.notifications.map((int, idx) => (
                        <IntegrationCard key={idx} integration={int} icon={int.type === 'E-mail' ? Mail : MessageSquare} type="notification" />
                    ))}
                </CardContent>
            </Card>

            {/* Config Side Drawer */}
            <SideDrawer
                open={!!configModal}
                onOpenChange={() => setConfigModal(null)}
                title={`Configurar ${configModal}`}
                icon={Settings}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setConfigModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Configuração salva!'); setConfigModal(null); }}>
                            💾 Salvar
                        </Button>
                    </div>
                }
            >
                <p className="text-sm text-slate-500">Formulário de configuração seria exibido aqui.</p>
            </SideDrawer>

            {/* New Integration Side Drawer */}
            <SideDrawer
                open={newIntegrationModal}
                onOpenChange={setNewIntegrationModal}
                title="Nova Integração"
                description="Conecte um novo provedor ao sistema"
                icon={Plus}
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setNewIntegrationModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Integração configurada!'); setNewIntegrationModal(false); }}>
                            <Plus className="w-4 h-4 mr-2" /> Adicionar Integração
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div>
                        <Label>Tipo de Integração *</Label>
                        <Select>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="acquirer">Adquirente</SelectItem>
                                <SelectItem value="antifraud">Antifraude</SelectItem>
                                <SelectItem value="banking">Banking/PSP</SelectItem>
                                <SelectItem value="notification">Notificação</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Nome do Provedor *</Label>
                        <Input className="mt-1" placeholder="Ex: Cielo, Stone, ClearSale..." />
                    </div>
                    <div>
                        <Label>Ambiente</Label>
                        <Select defaultValue="sandbox">
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sandbox">Sandbox</SelectItem>
                                <SelectItem value="production">Produção</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>API Endpoint</Label>
                        <Input className="mt-1" placeholder="https://api.provedor.com" />
                    </div>
                    <div>
                        <Label>API Key / Merchant ID</Label>
                        <Input className="mt-1" type="password" placeholder="sk_live_..." />
                    </div>
                </div>
            </SideDrawer>
        </div>
    );
}