import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, FileText, Zap, ArrowUpFromLine, Calendar, Edit } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
const formatPercent = (v) => `${v.toFixed(2)}%`;

const creditCardRates = [
    { brand: 'Visa', '1x': 2.99, '2_6x': 3.49, '7_12x': 3.99, '13x': 4.49, intl: 4.99 },
    { brand: 'Mastercard', '1x': 2.99, '2_6x': 3.49, '7_12x': 3.99, '13x': 4.49, intl: 4.99 },
    { brand: 'Elo', '1x': 3.29, '2_6x': 3.79, '7_12x': 4.29, '13x': 4.79, intl: 5.29 },
    { brand: 'Amex', '1x': 3.99, '2_6x': 4.49, '7_12x': 4.99, '13x': 5.49, intl: 5.99 },
    { brand: 'Hipercard', '1x': 3.49, '2_6x': 3.99, '7_12x': 4.49, '13x': 4.99, intl: 5.49 },
];

export default function AdminIntGlobalRates() {
    const [editModal, setEditModal] = useState(null);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Taxas Globais"
                breadcrumbs={[{ label: 'Administração' }, { label: 'Taxas' }]}
            />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                ⚠️ Estas são as taxas padrão aplicadas a novos merchants. Merchants existentes podem ter taxas personalizadas configuradas em seus perfis.
            </div>

            {/* Credit Card MDR */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Cartão de Crédito - MDR Padrão
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('credit')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">Bandeira</th>
                                    <th className="text-center py-2 px-3">1x</th>
                                    <th className="text-center py-2 px-3">2-6x</th>
                                    <th className="text-center py-2 px-3">7-12x</th>
                                    <th className="text-center py-2 px-3">13+x</th>
                                    <th className="text-center py-2 px-3">Internacional</th>
                                </tr>
                            </thead>
                            <tbody>
                                {creditCardRates.map((row, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-medium">{row.brand}</td>
                                        <td className="py-3 px-3 text-center">{formatPercent(row['1x'])}</td>
                                        <td className="py-3 px-3 text-center">{formatPercent(row['2_6x'])}</td>
                                        <td className="py-3 px-3 text-center">{formatPercent(row['7_12x'])}</td>
                                        <td className="py-3 px-3 text-center">{formatPercent(row['13x'])}</td>
                                        <td className="py-3 px-3 text-center">{formatPercent(row.intl)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Debit Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="w-5 h-5" /> Cartão de Débito - MDR Padrão
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('debit')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa única (todas as bandeiras):</span> <strong>1,99%</strong></div>
                        <div><span className="text-slate-500">Internacional:</span> <strong>2,99%</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* PIX */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Smartphone className="w-5 h-5" /> PIX
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('pix')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa por transação:</span> <strong>0,99%</strong></div>
                        <div><span className="text-slate-500">Taxa mínima:</span> <strong>{formatCurrency(0)}</strong></div>
                        <div><span className="text-slate-500">Taxa máxima:</span> <strong>{formatCurrency(50)}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Boleto */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Boleto
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('boleto')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa por boleto emitido:</span> <strong>{formatCurrency(0)}</strong></div>
                        <div><span className="text-slate-500">Taxa por boleto pago:</span> <strong>{formatCurrency(2.90)}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Anticipation */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Zap className="w-5 h-5" /> Antecipação
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('anticipation')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="text-sm">
                        <span className="text-slate-500">Taxa de antecipação:</span> <strong>1,99% ao mês (pró-rata)</strong>
                    </div>
                </CardContent>
            </Card>

            {/* Withdrawal */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <ArrowUpFromLine className="w-5 h-5" /> Saque
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('withdrawal')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div><span className="text-slate-500">Taxa por saque (TED):</span> <strong>{formatCurrency(5)}</strong></div>
                        <div><span className="text-slate-500">Taxa por saque (PIX):</span> <strong>{formatCurrency(0)}</strong></div>
                        <div><span className="text-slate-500">Saque mínimo:</span> <strong>{formatCurrency(100)}</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Settlement */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Liquidação Padrão
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setEditModal('settlement')}>
                        <Edit className="w-4 h-4 mr-1" /> Editar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                        <div><span className="text-slate-500">Cartão de crédito:</span> <strong>D+30</strong></div>
                        <div><span className="text-slate-500">Cartão de débito:</span> <strong>D+1</strong></div>
                        <div><span className="text-slate-500">PIX:</span> <strong>D+1</strong></div>
                        <div><span className="text-slate-500">Boleto:</span> <strong>D+1</strong></div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={!!editModal} onOpenChange={() => setEditModal(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Taxas</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-slate-500">Formulário de edição de taxas seria exibido aqui.</p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditModal(null)}>Cancelar</Button>
                        <Button onClick={() => { toast.success('Taxas atualizadas!'); setEditModal(null); }}>
                            💾 Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}