import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Eye, PlusCircle, MinusCircle, Lock, Unlock, Search, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const balances = [
    { merchantId: '12345', merchant: 'Loja do João', available: 75000, blocked: 5000, toSettle: 45000, total: 125000 },
    { merchantId: '12346', merchant: 'Tech Store', available: 120000, blocked: 0, toSettle: 89000, total: 209000 },
    { merchantId: '12347', merchant: 'Maria Store', available: 15000, blocked: 10000, toSettle: 23000, total: 48000 },
    { merchantId: '12348', merchant: 'Pet Shop', available: -2000, blocked: 0, toSettle: 8000, total: 6000 },
];

export default function AdminIntBalanceManagement() {
    const [adjustModal, setAdjustModal] = useState(null);
    const [blockModal, setBlockModal] = useState(null);
    const [adjustType, setAdjustType] = useState('credit');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBalances = balances.filter(b => 
        b.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.merchantId.includes(searchTerm)
    );

    const stats = {
        totalAvailable: balances.reduce((s, b) => s + Math.max(0, b.available), 0),
        totalBlocked: balances.reduce((s, b) => s + b.blocked, 0),
        totalToSettle: balances.reduce((s, b) => s + b.toSettle, 0),
        negative: { count: balances.filter(b => b.available < 0).length, value: Math.abs(balances.filter(b => b.available < 0).reduce((s, b) => s + b.available, 0)) },
        merchantsWithBalance: balances.filter(b => b.available > 0).length,
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Gestão de Saldos"
                breadcrumbs={[{ label: 'Financeiro' }, { label: 'Gestão de Saldos' }]}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Total Disponível</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(stats.totalAvailable)}</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Bloqueado</p>
                    <p className="text-xl font-bold text-orange-700">{formatCurrency(stats.totalBlocked)}</p>
                    <p className="text-xs text-slate-500">{balances.filter(b => b.blocked > 0).length} merchants</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">A Liquidar</p>
                    <p className="text-xl font-bold text-blue-700">{formatCurrency(stats.totalToSettle)}</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Negativo</p>
                    <p className="text-xl font-bold text-red-700">{formatCurrency(stats.negative.value)}</p>
                    <p className="text-xs text-slate-500">{stats.negative.count} merchants</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Merchants c/ Saldo</p>
                    <p className="text-xl font-bold">{stats.merchantsWithBalance} de {balances.length}</p>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <Select defaultValue="all">
                            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="positive">Com saldo</SelectItem>
                                <SelectItem value="negative">Saldo negativo</SelectItem>
                                <SelectItem value="blocked">Com bloqueio</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Buscar merchant..." 
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
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
                                    <th className="text-left py-2 px-3">Merchant</th>
                                    <th className="text-right py-2 px-3">Disponível</th>
                                    <th className="text-right py-2 px-3">Bloqueado</th>
                                    <th className="text-right py-2 px-3">A Liquidar</th>
                                    <th className="text-right py-2 px-3">Total</th>
                                    <th className="text-center py-2 px-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBalances.map(b => (
                                    <tr key={b.merchantId} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3">
                                            <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + b.merchantId} className="text-blue-600 hover:underline">
                                                {b.merchant}
                                            </Link>
                                        </td>
                                        <td className={`py-3 px-3 text-right font-medium ${b.available < 0 ? 'text-red-600' : ''}`}>
                                            {formatCurrency(b.available)}
                                        </td>
                                        <td className="py-3 px-3 text-right text-orange-600">
                                            {b.blocked > 0 ? formatCurrency(b.blocked) : '-'}
                                        </td>
                                        <td className="py-3 px-3 text-right text-blue-600">{formatCurrency(b.toSettle)}</td>
                                        <td className="py-3 px-3 text-right font-bold">{formatCurrency(b.total)}</td>
                                        <td className="py-3 px-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => setAdjustModal(b)}>
                                                    <PlusCircle className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => setBlockModal(b)}>
                                                    <Lock className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Adjust Modal */}
            <Dialog open={!!adjustModal} onOpenChange={() => setAdjustModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajuste de Saldo</DialogTitle>
                    </DialogHeader>
                    {adjustModal && (
                        <div className="space-y-4">
                            <p className="text-sm">Merchant: <strong>{adjustModal.merchant}</strong> (ID: {adjustModal.merchantId})</p>
                            <p className="text-sm">Saldo atual: <strong>{formatCurrency(adjustModal.available)}</strong></p>

                            <div>
                                <Label>Tipo de Ajuste</Label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="adjustType" value="credit" checked={adjustType === 'credit'} onChange={(e) => setAdjustType(e.target.value)} />
                                        Crédito (adicionar)
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input type="radio" name="adjustType" value="debit" checked={adjustType === 'debit'} onChange={(e) => setAdjustType(e.target.value)} />
                                        Débito (remover)
                                    </label>
                                </div>
                            </div>

                            <div>
                                <Label>Valor</Label>
                                <Input type="number" className="mt-1" placeholder="R$ 0,00" />
                            </div>

                            <div>
                                <Label>Motivo</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="correction">Correção de erro operacional</SelectItem>
                                        <SelectItem value="bonus">Bonificação comercial</SelectItem>
                                        <SelectItem value="refund">Devolução de taxa indevida</SelectItem>
                                        <SelectItem value="fee">Cobrança de taxa pendente</SelectItem>
                                        <SelectItem value="reconciliation">Ajuste de conciliação</SelectItem>
                                        <SelectItem value="other">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Observações</Label>
                                <Textarea className="mt-1" placeholder="Detalhes adicionais..." />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded p-3 text-sm text-amber-700">
                                <AlertTriangle className="w-4 h-4 inline mr-2" />
                                Este ajuste será registrado em auditoria com seu nome de usuário.
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAdjustModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Ajuste realizado!'); setAdjustModal(null); }}>
                            Confirmar Ajuste
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Block Modal */}
            <Dialog open={!!blockModal} onOpenChange={() => setBlockModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5" /> Bloquear Saldo
                        </DialogTitle>
                    </DialogHeader>
                    {blockModal && (
                        <div className="space-y-4">
                            <p className="text-sm">Merchant: <strong>{blockModal.merchant}</strong></p>
                            <p className="text-sm">Saldo disponível: <strong>{formatCurrency(blockModal.available)}</strong></p>

                            <div>
                                <Label>Valor a bloquear</Label>
                                <Input type="number" className="mt-1" placeholder="R$ 0,00" />
                            </div>

                            <div>
                                <Label>Motivo do bloqueio</Label>
                                <Select>
                                    <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="chargeback">Reserva para chargeback</SelectItem>
                                        <SelectItem value="fraud">Suspeita de fraude</SelectItem>
                                        <SelectItem value="compliance">Análise de compliance</SelectItem>
                                        <SelectItem value="legal">Ordem judicial</SelectItem>
                                        <SelectItem value="other">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Observações</Label>
                                <Textarea className="mt-1" placeholder="Detalhes adicionais..." />
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setBlockModal(null)}>Cancelar</Button>
                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => { toast.success('Saldo bloqueado!'); setBlockModal(null); }}>
                            Confirmar Bloqueio
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}