import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Eye, Mail, Plus, FileText, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const invoices = [
    { id: 'FAT-001', dueDate: '05/02/2026', merchant: 'Loja do João', merchantId: '12345', value: 299, type: 'monthly', status: 'open' },
    { id: 'FAT-002', dueDate: '05/02/2026', merchant: 'Tech Store', merchantId: '12346', value: 599, type: 'monthly', status: 'open' },
    { id: 'FAT-003', dueDate: '28/01/2026', merchant: 'Maria Store', merchantId: '12347', value: 150, type: 'extra', status: 'overdue' },
    { id: 'FAT-004', dueDate: '25/01/2026', merchant: 'Pet Shop', merchantId: '12348', value: 299, type: 'monthly', status: 'paid' },
];

const statusConfig = {
    draft: { label: 'Rascunho', color: 'bg-slate-100 text-slate-700' },
    open: { label: 'Aberta', color: 'bg-yellow-100 text-yellow-700' },
    overdue: { label: 'Vencida', color: 'bg-red-100 text-red-700' },
    paid: { label: 'Paga', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Cancelada', color: 'bg-slate-100 text-slate-700' },
};

const typeLabels = {
    monthly: 'Mensalidade',
    setup: 'Setup',
    extra: 'Avulsa',
    fine: 'Multa',
    excess: 'Excedente',
};

export default function AdminIntInvoices() {
    const [newInvoiceModal, setNewInvoiceModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredInvoices = statusFilter === 'all' ? invoices : invoices.filter(i => i.status === statusFilter);
    
    const stats = {
        open: { count: invoices.filter(i => i.status === 'open').length, value: invoices.filter(i => i.status === 'open').reduce((s, i) => s + i.value, 0) },
        overdue: { count: invoices.filter(i => i.status === 'overdue').length, value: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.value, 0) },
        paid: { count: invoices.filter(i => i.status === 'paid').length, value: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.value, 0) },
        upcoming: { count: 32, value: 78000 },
        defaultRate: 3.2,
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Faturas e Cobranças"
                breadcrumbs={[{ label: 'Financeiro' }, { label: 'Faturas' }]}
                actionElement={
                    <Button onClick={() => setNewInvoiceModal(true)}>
                        <Plus className="w-4 h-4 mr-2" /> Nova Fatura
                    </Button>
                }
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Em Aberto</p>
                    <p className="text-xl font-bold text-yellow-700">{formatCurrency(stats.open.value)}</p>
                    <p className="text-xs text-slate-500">{stats.open.count} faturas</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Vencidas</p>
                    <p className="text-xl font-bold text-red-700">{formatCurrency(stats.overdue.value)}</p>
                    <p className="text-xs text-slate-500">{stats.overdue.count} faturas</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Pagas (Mês)</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(stats.paid.value)}</p>
                    <p className="text-xs text-slate-500">{stats.paid.count} faturas</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">A Vencer</p>
                    <p className="text-xl font-bold text-blue-700">{formatCurrency(stats.upcoming.value)}</p>
                    <p className="text-xs text-slate-500">{stats.upcoming.count} faturas</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Inadimplência</p>
                    <p className="text-xl font-bold">{stats.defaultRate}%</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="open">Em Aberto</SelectItem>
                                <SelectItem value="overdue">Vencidas</SelectItem>
                                <SelectItem value="paid">Pagas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="thismonth">
                            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="thismonth">Este mês</SelectItem>
                                <SelectItem value="lastmonth">Mês passado</SelectItem>
                                <SelectItem value="90d">Últimos 90 dias</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Table */}
            <Card>
                <CardContent className="pt-4">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">ID</th>
                                    <th className="text-left py-2 px-3">Vencimento</th>
                                    <th className="text-left py-2 px-3">Merchant</th>
                                    <th className="text-right py-2 px-3">Valor</th>
                                    <th className="text-left py-2 px-3">Tipo</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                    <th className="text-center py-2 px-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-mono text-xs">{inv.id}</td>
                                        <td className="py-3 px-3">{inv.dueDate}</td>
                                        <td className="py-3 px-3">
                                            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + inv.merchantId} className="text-blue-600 hover:underline">
                                                {inv.merchant}
                                            </Link>
                                        </td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(inv.value)}</td>
                                        <td className="py-3 px-3">{typeLabels[inv.type]}</td>
                                        <td className="py-3 px-3">
                                            <Badge className={`${statusConfig[inv.status].color} border-0`}>
                                                {statusConfig[inv.status].label}
                                            </Badge>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                {(inv.status === 'open' || inv.status === 'overdue') && (
                                                    <Button variant="ghost" size="sm" onClick={() => toast.success('Cobrança enviada!')}>
                                                        <Mail className="w-4 h-4" />
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

            {/* New Invoice Modal */}
            <Dialog open={newInvoiceModal} onOpenChange={setNewInvoiceModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5" /> Nova Fatura
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label>Merchant</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12345">Loja do João</SelectItem>
                                    <SelectItem value="12346">Tech Store</SelectItem>
                                    <SelectItem value="12347">Maria Store</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Tipo</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="monthly">Mensalidade</SelectItem>
                                    <SelectItem value="setup">Taxa de Setup</SelectItem>
                                    <SelectItem value="extra">Cobrança Avulsa</SelectItem>
                                    <SelectItem value="fine">Multa</SelectItem>
                                    <SelectItem value="excess">Excedente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Valor</Label>
                            <Input type="number" className="mt-1" placeholder="R$ 0,00" />
                        </div>
                        <div>
                            <Label>Vencimento</Label>
                            <Input type="date" className="mt-1" />
                        </div>
                        <div>
                            <Label>Descrição</Label>
                            <Input className="mt-1" placeholder="Descrição da fatura" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setNewInvoiceModal(false)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Fatura criada!'); setNewInvoiceModal(false); }}>
                            Criar Fatura
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}