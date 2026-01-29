import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Search, Eye, RefreshCw, Mail, CheckCircle, XCircle, Clock, MousePointer, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const emailLogs = [
    { id: 'EMAIL-001', date: '28/01 14:35:22', recipient: 'joao@empresa.com', merchant: 'Loja do João', subject: '🎉 Bem-vindo ao...', type: 'Boas-vindas', status: 'opened', openedAt: '14:40' },
    { id: 'EMAIL-002', date: '28/01 14:30:15', recipient: 'maria@techstore.com', merchant: 'Tech Store', subject: '✅ KYC Aprovado', type: 'KYC Aprov.', status: 'opened', openedAt: '14:45' },
    { id: 'EMAIL-003', date: '28/01 14:25:00', recipient: 'carlos@modafash.com', merchant: 'Moda Fashion', subject: '💰 Saque proces...', type: 'Saque Proc.', status: 'delivered', openedAt: null },
    { id: 'EMAIL-004', date: '28/01 14:20:30', recipient: 'ana@invalido.xyz', merchant: 'Loja Ana', subject: '🎉 Bem-vindo ao...', type: 'Boas-vindas', status: 'bounced', openedAt: null, error: 'Invalid email address' },
    { id: 'EMAIL-005', date: '28/01 14:15:00', recipient: 'pedro@empresa.com', merchant: 'Empresa XYZ', subject: '⏰ Lembrete: Com...', type: 'Lembrete', status: 'clicked', openedAt: '14:18', clickedAt: '14:20' },
    { id: 'EMAIL-006', date: '28/01 14:10:00', recipient: 'lucas@test.com', merchant: 'Test Co', subject: '📄 Documentos...', type: 'Documentos', status: 'sent', openedAt: null },
];

const statusConfig = {
    sent: { label: 'Enviado', icon: Clock, color: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]' },
    delivered: { label: 'Entregue', icon: CheckCircle, color: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]' },
    opened: { label: 'Aberto', icon: Eye, color: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]' },
    clicked: { label: 'Clicado', icon: MousePointer, color: 'bg-[var(--color-info-bg)] text-[var(--color-info-text)]' },
    bounced: { label: 'Bounce', icon: XCircle, color: 'bg-[var(--color-error-bg)] text-[var(--color-error-text)]' },
    spam: { label: 'Spam', icon: AlertTriangle, color: 'bg-[var(--color-error-bg)] text-[var(--color-error-text)]' },
};

export default function AdminIntCommLogs() {
    const [period, setPeriod] = useState('7d');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchRecipient, setSearchRecipient] = useState('');
    const [searchMerchant, setSearchMerchant] = useState('');
    const [detailModal, setDetailModal] = useState(null);

    return (
        <div className="space-y-6 bg-[var(--color-bg-page)] min-h-screen">
            <PageHeader 
                title="Histórico de E-mails"
                breadcrumbs={[{ label: 'Comunicação', page: 'AdminIntCommDashboard' }, { label: 'Logs' }]}
                actions={
                    <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" /> Exportar
                    </Button>
                }
            />

            {/* Filters */}
            <Card className="bg-[var(--color-card-bg)] border-[var(--color-card-border)]">
                <CardContent className="pt-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <Label className="text-xs text-[var(--color-text-tertiary)]">Período</Label>
                            <Select value={period} onValueChange={setPeriod}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="today">Hoje</SelectItem>
                                    <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                    <SelectItem value="30d">Últimos 30 dias</SelectItem>
                                    <SelectItem value="90d">Últimos 90 dias</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs">Tipo</Label>
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="onboarding">Onboarding</SelectItem>
                                    <SelectItem value="transactional">Transacional</SelectItem>
                                    <SelectItem value="financial">Financeiro</SelectItem>
                                    <SelectItem value="risk">Risco</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs">Status</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="delivered">Entregues</SelectItem>
                                    <SelectItem value="opened">Abertos</SelectItem>
                                    <SelectItem value="clicked">Clicados</SelectItem>
                                    <SelectItem value="bounced">Bounces</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label className="text-xs">Destinatário</Label>
                            <Input className="mt-1" placeholder="email@..." value={searchRecipient} onChange={(e) => setSearchRecipient(e.target.value)} />
                        </div>
                        <div>
                            <Label className="text-xs">Merchant</Label>
                            <Input className="mt-1" placeholder="Nome..." value={searchMerchant} onChange={(e) => setSearchMerchant(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button><Search className="w-4 h-4 mr-2" /> Filtrar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Email List */}
            <Card className="bg-[var(--color-card-bg)] border-[var(--color-card-border)]">
                <CardHeader>
                    <CardTitle className="text-base text-[var(--color-text-primary)]">📋 E-mails Enviados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {emailLogs.map(email => {
                            const status = statusConfig[email.status];
                            const StatusIcon = status.icon;
                            return (
                                <div key={email.id} className="border border-[var(--color-border-default)] rounded-lg p-3 hover:bg-[var(--color-bg-hover)] bg-[var(--color-bg-primary)]">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-sm text-[var(--color-text-tertiary)]">{email.date}</span>
                                                <span className="font-medium text-[var(--color-text-primary)]">{email.recipient}</span>
                                                <Badge variant="outline" className="text-xs border-[var(--color-border-default)] text-[var(--color-text-secondary)]">{email.type}</Badge>
                                            </div>
                                            <p className="text-sm text-[var(--color-text-secondary)]">{email.subject}</p>
                                            <p className="text-xs text-[var(--color-text-tertiary)]">Merchant: {email.merchant}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <Badge className={cn(status.color, "border-0")}>
                                                    <StatusIcon className="w-3 h-3 mr-1" />
                                                    {status.label}
                                                </Badge>
                                                {email.openedAt && <p className="text-xs text-[var(--color-text-tertiary)] mt-1">👁️ {email.openedAt}</p>}
                                                {email.clickedAt && <p className="text-xs text-[var(--color-text-tertiary)]">🔗 {email.clickedAt}</p>}
                                            </div>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="sm" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]" onClick={() => setDetailModal(email)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                {email.status !== 'bounced' && (
                                                    <Button variant="ghost" size="sm" className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]" onClick={() => toast.success('E-mail reenviado!')}>
                                                        <RefreshCw className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border-light)]">
                        <p className="text-sm text-[var(--color-text-tertiary)]">Mostrando 1-50 de 12.456</p>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="border-[var(--color-border-default)] text-[var(--color-text-secondary)]">◄ Anterior</Button>
                            <Button variant="outline" size="sm" className="border-[var(--color-border-default)] text-[var(--color-text-secondary)]">Página 1 de 250</Button>
                            <Button variant="outline" size="sm" className="border-[var(--color-border-default)] text-[var(--color-text-secondary)]">Próxima ►</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes do E-mail</DialogTitle>
                    </DialogHeader>
                    {detailModal && (
                        <Tabs defaultValue="info">
                            <TabsList>
                                <TabsTrigger value="info">Informações</TabsTrigger>
                                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-slate-500">ID</Label>
                                        <p className="font-mono">{detailModal.id}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500">Data/Hora</Label>
                                        <p>28/01/2026 {detailModal.date.split(' ')[1]}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500">Tipo</Label>
                                        <p>{detailModal.type}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500">Template</Label>
                                        <p>TPL-001</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-slate-500">Remetente</Label>
                                        <p>noreply@pagsmile.com</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500">Destinatário</Label>
                                        <p>{detailModal.recipient}</p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-slate-500">Merchant</Label>
                                        <p>{detailModal.merchant}</p>
                                    </div>
                                </div>
                                <hr />
                                <div>
                                    <Label className="text-xs text-slate-500">Assunto</Label>
                                    <p>{detailModal.subject}</p>
                                </div>
                                <hr />
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-xs text-slate-500">Status atual</Label>
                                        <Badge className={`${statusConfig[detailModal.status].color} border-0`}>
                                            {statusConfig[detailModal.status].label}
                                        </Badge>
                                    </div>
                                    {detailModal.openedAt && (
                                        <div>
                                            <Label className="text-xs text-slate-500">Aberto em</Label>
                                            <p>28/01/2026 {detailModal.openedAt}</p>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="content" className="mt-4">
                                <div className="border rounded-lg p-4 bg-slate-50 text-center text-slate-500">
                                    Preview do conteúdo do e-mail
                                </div>
                            </TabsContent>

                            <TabsContent value="timeline" className="mt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <span className="text-sm">14:35:22 - Enviado para fila</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                                        <span className="text-sm">14:35:23 - Processado pelo provedor (Amazon SES)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="text-sm">14:35:24 - Entregue ao servidor de destino</span>
                                    </div>
                                    {detailModal.openedAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-sm">{detailModal.openedAt} - Primeira abertura</span>
                                        </div>
                                    )}
                                    {detailModal.clickedAt && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                                            <span className="text-sm">{detailModal.clickedAt} - Clique em link</span>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailModal(null)}>Fechar</Button>
                        <Button variant="outline"><Eye className="w-4 h-4 mr-2" /> Ver conteúdo</Button>
                        <Button onClick={() => { toast.success('E-mail reenviado!'); setDetailModal(null); }}>
                            <RefreshCw className="w-4 h-4 mr-2" /> Reenviar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}