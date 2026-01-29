import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Eye, Check, X, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const withdrawals = [
    { id: 'SAQ-001', date: '28/01 14:32', merchant: 'Loja do João', merchantId: '12345', amount: 50000, fee: 5, status: 'pending', balance: 75430 },
    { id: 'SAQ-002', date: '28/01 14:15', merchant: 'Tech Store', merchantId: '12346', amount: 120000, fee: 5, status: 'pending', balance: 145000 },
    { id: 'SAQ-003', date: '28/01 13:45', merchant: 'Maria Store', merchantId: '12347', amount: 25000, fee: 5, status: 'processed', balance: 32000 },
    { id: 'SAQ-004', date: '28/01 13:00', merchant: 'Pet Shop', merchantId: '12348', amount: 8000, fee: 5, status: 'rejected', balance: 5000 },
];

const statusConfig = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    approved: { label: 'Aprovado', color: 'bg-blue-100 text-blue-700', icon: Check },
    processing: { label: 'Processando', color: 'bg-blue-100 text-blue-700', icon: Clock },
    processed: { label: 'Processado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { label: 'Rejeitado', color: 'bg-red-100 text-red-700', icon: X },
};

export default function AdminIntWithdrawals() {
    const [selected, setSelected] = useState([]);
    const [detailModal, setDetailModal] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [statusFilter, setStatusFilter] = useState('pending');

    const toggleSelect = (id) => {
        setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const filteredWithdrawals = statusFilter === 'all' ? withdrawals : withdrawals.filter(w => w.status === statusFilter);
    const stats = {
        pending: { count: withdrawals.filter(w => w.status === 'pending').length, value: withdrawals.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0) },
        approved: { count: withdrawals.filter(w => w.status === 'approved').length, value: withdrawals.filter(w => w.status === 'approved').reduce((s, w) => s + w.amount, 0) },
        processed: { count: withdrawals.filter(w => w.status === 'processed').length, value: withdrawals.filter(w => w.status === 'processed').reduce((s, w) => s + w.amount, 0) },
        rejected: { count: withdrawals.filter(w => w.status === 'rejected').length, value: withdrawals.filter(w => w.status === 'rejected').reduce((s, w) => s + w.amount, 0) },
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Saques"
                breadcrumbs={[{ label: 'Financeiro' }, { label: 'Saques' }]}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Pendentes</p>
                    <p className="text-xl font-bold text-yellow-700">{stats.pending.count}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(stats.pending.value)}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Aprovados</p>
                    <p className="text-xl font-bold text-blue-700">{stats.approved.count}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(stats.approved.value)}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Processados</p>
                    <p className="text-xl font-bold text-green-700">{stats.processed.count}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(stats.processed.value)}</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Rejeitados</p>
                    <p className="text-xl font-bold text-red-700">{stats.rejected.count}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(stats.rejected.value)}</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Total (Hoje)</p>
                    <p className="text-xl font-bold">{formatCurrency(withdrawals.reduce((s, w) => s + w.amount, 0))}</p>
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
                                <SelectItem value="pending">Pendentes</SelectItem>
                                <SelectItem value="approved">Aprovados</SelectItem>
                                <SelectItem value="processed">Processados</SelectItem>
                                <SelectItem value="rejected">Rejeitados</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="today">
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hoje</SelectItem>
                                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                                <SelectItem value="30d">Últimos 30 dias</SelectItem>
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
                                    <th className="text-left py-2 px-3 w-10">
                                        <Checkbox />
                                    </th>
                                    <th className="text-left py-2 px-3">ID</th>
                                    <th className="text-left py-2 px-3">Data/Hora</th>
                                    <th className="text-left py-2 px-3">Merchant</th>
                                    <th className="text-right py-2 px-3">Valor</th>
                                    <th className="text-right py-2 px-3">Taxa</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                    <th className="text-center py-2 px-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWithdrawals.map(w => {
                                    const StatusIcon = statusConfig[w.status].icon;
                                    return (
                                        <tr key={w.id} className="border-b hover:bg-slate-50">
                                            <td className="py-3 px-3">
                                                <Checkbox 
                                                    checked={selected.includes(w.id)} 
                                                    onCheckedChange={() => toggleSelect(w.id)}
                                                    disabled={w.status !== 'pending'}
                                                />
                                            </td>
                                            <td className="py-3 px-3 font-mono text-xs">{w.id}</td>
                                            <td className="py-3 px-3">{w.date}</td>
                                            <td className="py-3 px-3">
                                                <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + w.merchantId} className="text-blue-600 hover:underline">
                                                    {w.merchant}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-3 text-right font-medium">{formatCurrency(w.amount)}</td>
                                            <td className="py-3 px-3 text-right text-slate-500">{formatCurrency(w.fee)}</td>
                                            <td className="py-3 px-3">
                                                <Badge className={`${statusConfig[w.status].color} border-0`}>
                                                    <StatusIcon className="w-3 h-3 mr-1" /> {statusConfig[w.status].label}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="sm" onClick={() => setDetailModal(w)}>
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {w.status === 'pending' && (
                                                        <>
                                                            <Button variant="ghost" size="sm" className="text-green-600" onClick={() => { toast.success('Saque aprovado!'); }}>
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setRejectModal(w)}>
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {selected.length > 0 && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                            <span className="text-sm">Selecionados: <strong>{selected.length}</strong></span>
                            <Button onClick={() => { toast.success('Saques aprovados em lote!'); setSelected([]); }}>
                                <Check className="w-4 h-4 mr-2" /> Aprovar em Lote
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Detail Modal */}
            <Dialog open={!!detailModal} onOpenChange={() => setDetailModal(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Saque #{detailModal?.id}</DialogTitle>
                    </DialogHeader>
                    {detailModal && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Status:</span>
                                <Badge className={`${statusConfig[detailModal.status].color} border-0`}>
                                    {statusConfig[detailModal.status].label}
                                </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm">Dados do Saque</CardTitle></CardHeader>
                                    <CardContent className="text-sm space-y-1">
                                        <div><span className="text-slate-500">ID:</span> {detailModal.id}</div>
                                        <div><span className="text-slate-500">Valor:</span> <strong>{formatCurrency(detailModal.amount)}</strong></div>
                                        <div><span className="text-slate-500">Taxa:</span> {formatCurrency(detailModal.fee)}</div>
                                        <div><span className="text-slate-500">Líquido:</span> <strong>{formatCurrency(detailModal.amount - detailModal.fee)}</strong></div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2"><CardTitle className="text-sm">Saldo do Merchant</CardTitle></CardHeader>
                                    <CardContent className="text-sm space-y-1">
                                        <div><span className="text-slate-500">Disponível:</span> {formatCurrency(detailModal.balance)}</div>
                                        <div><span className="text-slate-500">Após saque:</span> {formatCurrency(detailModal.balance - detailModal.amount)}</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <Card>
                                <CardHeader className="pb-2"><CardTitle className="text-sm">Validações</CardTitle></CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Saldo disponível suficiente</div>
                                    <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Dentro do limite diário</div>
                                    <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Conta bancária verificada</div>
                                    <div className="flex items-center gap-2 text-green-600 text-sm"><CheckCircle className="w-4 h-4" /> Sem bloqueios ativos</div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                    <DialogFooter>
                        {detailModal?.status === 'pending' && (
                            <>
                                <Button variant="outline" className="text-red-600" onClick={() => { setDetailModal(null); setRejectModal(detailModal); }}>
                                    <X className="w-4 h-4 mr-2" /> Rejeitar
                                </Button>
                                <Button onClick={() => { toast.success('Saque aprovado!'); setDetailModal(null); }}>
                                    <Check className="w-4 h-4 mr-2" /> Aprovar Saque
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={!!rejectModal} onOpenChange={() => setRejectModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" /> Rejeitar Saque
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm">Saque: <strong>{rejectModal?.id}</strong> - {formatCurrency(rejectModal?.amount)}</p>
                        <div>
                            <Label>Motivo da rejeição (obrigatório)</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="balance">Saldo insuficiente</SelectItem>
                                    <SelectItem value="limit">Limite excedido</SelectItem>
                                    <SelectItem value="account">Conta bancária inválida</SelectItem>
                                    <SelectItem value="blocked">Merchant bloqueado</SelectItem>
                                    <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Observações</Label>
                            <Textarea className="mt-1" placeholder="Detalhes adicionais..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectModal(null)}>Cancelar</Button>
                        <Button className="bg-red-600 hover:bg-red-700" onClick={() => { toast.success('Saque rejeitado'); setRejectModal(null); }}>
                            Confirmar Rejeição
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}