import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Eye, FileText, AlertTriangle, Clock, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const meds = [
    { id: 'MED-001', merchant: 'Loja do João', merchantId: '12345', amount: 500, reason: 'Fraude', bank: 'Nubank', deadline: '30/01/2026', status: 'open', urgent: true },
    { id: 'MED-002', merchant: 'Tech Store', merchantId: '12346', amount: 350, reason: 'Erro Op.', bank: 'Itaú', deadline: '31/01/2026', status: 'open', urgent: true },
    { id: 'MED-003', merchant: 'Moda Fashion', merchantId: '12347', amount: 200, reason: 'Fraude', bank: 'Bradesco', deadline: '02/02/2026', status: 'open', urgent: false },
    { id: 'MED-004', merchant: 'Loja do João', merchantId: '12345', amount: 150, reason: 'Fraude', bank: 'Santander', deadline: '-', status: 'in_contest' },
    { id: 'MED-005', merchant: 'Tech Store', merchantId: '12346', amount: 280, reason: 'Erro Op.', bank: 'BB', deadline: '-', status: 'won' },
    { id: 'MED-006', merchant: 'Moda Fashion', merchantId: '12347', amount: 420, reason: 'Fraude', bank: 'Caixa', deadline: '-', status: 'lost' },
];

const statusConfig = {
    open: { label: 'Aberto', color: 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)]' },
    in_contest: { label: 'Em Contestação', color: 'bg-[var(--color-info-bg)] text-[var(--color-info-text)]' },
    won: { label: 'Ganho', color: 'bg-[var(--color-success-bg)] text-[var(--color-success-text)]' },
    lost: { label: 'Perdido', color: 'bg-[var(--color-error-bg)] text-[var(--color-error-text)]' },
};

const urgentMeds = meds.filter(m => m.urgent && m.status === 'open');

export default function AdminIntMEDsList() {
    const stats = {
        medRate: 0.02,
        open: { count: 8, value: 2100 },
        inContest: { count: 5, value: 1500 },
        won: { count: 13, percentage: 72, value: 3200 },
        lost: { count: 5, percentage: 28, value: 1000 },
    };

    return (
        <div className="space-y-6 bg-[var(--color-bg-page)] min-h-screen">
            <PageHeader 
                title="Gestão de MEDs (PIX)"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'MEDs' }]}
            />

            {/* Stats */}
            <Card className="bg-[var(--color-card-bg)] border-[var(--color-card-border)]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2 text-[var(--color-text-primary)]">
                        <Banknote className="w-5 h-5" /> Resumo Geral
                    </CardTitle>
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 dias</SelectItem>
                            <SelectItem value="30d">30 dias</SelectItem>
                            <SelectItem value="90d">90 dias</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                        <div className="p-3 bg-[var(--color-success-bg)] border border-[var(--color-success-border)] rounded-lg text-center">
                            <p className="text-2xl font-bold text-[var(--color-success)]">{stats.medRate}%</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">MED Rate</p>
                            <Badge className="bg-[var(--color-success-bg)] text-[var(--color-success-text)] border-0 mt-1">🟢 OK</Badge>
                        </div>
                        <div className="p-3 bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)] rounded-lg text-center">
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.open.count}</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">Abertos</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">{formatCurrency(stats.open.value)}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-info-bg)] border border-[var(--color-info-border)] rounded-lg text-center">
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.inContest.count}</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">Em Contestação</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">{formatCurrency(stats.inContest.value)}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-success-bg)] border border-[var(--color-success-border)] rounded-lg text-center">
                            <p className="text-2xl font-bold text-[var(--color-success)]">{stats.won.count} ({stats.won.percentage}%)</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">Ganhos</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">{formatCurrency(stats.won.value)}</p>
                        </div>
                        <div className="p-3 bg-[var(--color-error-bg)] border border-[var(--color-error-border)] rounded-lg text-center">
                            <p className="text-2xl font-bold text-[var(--color-error)]">{stats.lost.count} ({stats.lost.percentage}%)</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">Perdidos</p>
                            <p className="text-xs text-[var(--color-text-tertiary)]">{formatCurrency(stats.lost.value)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Urgent MEDs */}
            {urgentMeds.length > 0 && (
                <Card className="border-[var(--color-error-border)] bg-[var(--color-error-bg)]">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-[var(--color-error-text)]">
                            <AlertTriangle className="w-5 h-5 text-[var(--color-error)]" />
                            Prazos Urgentes (7 dias - Regulamentação BACEN)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {urgentMeds.map(med => (
                            <div key={med.id} className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-default)]">
                                <div className="flex items-center gap-3">
                                    <span className="text-[var(--color-error)]">🔴</span>
                                    <span className="font-mono text-sm text-[var(--color-text-secondary)]">{med.id}</span>
                                    <span className="text-sm text-[var(--color-text-primary)]">{med.merchant}</span>
                                    <span className="font-medium text-[var(--color-text-primary)]">{formatCurrency(med.amount)}</span>
                                    <Badge variant="outline" className="text-xs border-[var(--color-border-default)] text-[var(--color-text-secondary)]">{med.bank}</Badge>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-[var(--color-error)] font-medium flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> Prazo: {med.deadline}
                                    </span>
                                    <Button size="sm" onClick={() => toast.info('Abrindo contestação...')}>
                                        <FileText className="w-4 h-4 mr-1" /> Contestar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Filters */}
            <Card className="bg-[var(--color-card-bg)] border-[var(--color-card-border)]">
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select defaultValue="30d">
                            <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7d">7 dias</SelectItem>
                                <SelectItem value="30d">30 dias</SelectItem>
                                <SelectItem value="90d">90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos Status</SelectItem>
                                <SelectItem value="open">Abertos</SelectItem>
                                <SelectItem value="in_contest">Em Contestação</SelectItem>
                                <SelectItem value="won">Ganhos</SelectItem>
                                <SelectItem value="lost">Perdidos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">🔍 Filtrar</Button>
                        <Button variant="outline"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* MEDs List */}
            <Card className="bg-[var(--color-card-bg)] border-[var(--color-card-border)]">
                <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border-light)]">
                                    <th className="text-left py-2 px-3 text-[var(--color-text-tertiary)]">ID</th>
                                    <th className="text-left py-2 px-3 text-[var(--color-text-tertiary)]">Merchant</th>
                                    <th className="text-right py-2 px-3 text-[var(--color-text-tertiary)]">Valor</th>
                                    <th className="text-left py-2 px-3 text-[var(--color-text-tertiary)]">Motivo</th>
                                    <th className="text-left py-2 px-3 text-[var(--color-text-tertiary)]">Banco</th>
                                    <th className="text-left py-2 px-3 text-[var(--color-text-tertiary)]">Prazo</th>
                                    <th className="text-left py-2 px-3 text-[var(--color-text-tertiary)]">Status</th>
                                    <th className="text-center py-2 px-3 text-[var(--color-text-tertiary)]">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {meds.map(med => (
                                    <tr key={med.id} className="border-b border-[var(--color-border-light)] hover:bg-[var(--color-bg-hover)]">
                                        <td className="py-3 px-3 font-mono text-xs text-[var(--color-text-secondary)]">{med.id}</td>
                                        <td className="py-3 px-3">
                                            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + med.merchantId} className="text-[var(--color-text-link)] hover:underline">
                                                {med.merchant}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-3 text-right font-medium text-[var(--color-text-primary)]">{formatCurrency(med.amount)}</td>
                                        <td className="py-3 px-3 text-[var(--color-text-secondary)]">{med.reason}</td>
                                        <td className="py-3 px-3 text-[var(--color-text-secondary)]">{med.bank}</td>
                                        <td className="py-3 px-3">
                                            {med.deadline !== '-' ? (
                                                <span className={cn("flex items-center gap-1", med.urgent && 'text-[var(--color-error)] font-medium')}>
                                                    {med.urgent && '🔴'} {med.deadline}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-3">
                                            <Badge className={`${statusConfig[med.status].color} border-0`}>
                                                {statusConfig[med.status].label}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                {med.status === 'open' && (
                                                    <Button variant="ghost" size="sm" onClick={() => toast.info('Abrindo contestação...')}>
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}