import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const movements = [
    { date: '28/01', desc: 'Liquidação #LIQ-12345', type: 'credit', value: 15000, balance: 42000 },
    { date: '27/01', desc: 'Saque #SAQ-789', type: 'debit', value: 20000, balance: 27000 },
    { date: '27/01', desc: 'Liquidação #LIQ-12344', type: 'credit', value: 12000, balance: 47000 },
    { date: '26/01', desc: 'Chargeback #CB-456', type: 'debit', value: 500, balance: 35000 },
    { date: '26/01', desc: 'Antecipação #ANT-123', type: 'credit', value: 8000, balance: 35500 },
    { date: '25/01', desc: 'Taxa mensal - Janeiro', type: 'debit', value: 299, balance: 27500 },
    { date: '25/01', desc: 'Liquidação #LIQ-12343', type: 'credit', value: 9800, balance: 27799 },
];

const typeLabels = {
    SETTLEMENT: { label: 'Liquidação', color: 'text-green-600' },
    WITHDRAWAL: { label: 'Saque', color: 'text-red-600' },
    ANTICIPATION: { label: 'Antecipação', color: 'text-green-600' },
    CHARGEBACK: { label: 'Chargeback', color: 'text-red-600' },
    FEE: { label: 'Taxa', color: 'text-red-600' },
    ADJUSTMENT_CREDIT: { label: 'Ajuste (C)', color: 'text-green-600' },
    ADJUSTMENT_DEBIT: { label: 'Ajuste (D)', color: 'text-red-600' },
};

export default function AdminIntStatements() {
    const [selectedMerchant, setSelectedMerchant] = useState('');

    const summary = {
        entries: 125430,
        exits: 98750,
        initialBalance: 15320,
        finalBalance: 42000,
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Extratos"
                breadcrumbs={[{ label: 'Financeiro' }, { label: 'Extratos' }]}
            />

            {/* Merchant Selector */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Selecionar Merchant</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="Buscar merchant..." 
                                className="pl-10"
                                value={selectedMerchant}
                                onChange={(e) => setSelectedMerchant(e.target.value)}
                            />
                        </div>
                        <Select>
                            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12345">Loja do João</SelectItem>
                                <SelectItem value="12346">Tech Store</SelectItem>
                                <SelectItem value="12347">Maria Store</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Merchant Statement */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">MERCHANT: Loja do João (ID: 12345)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Period Filter */}
                    <div className="flex flex-wrap gap-3 items-center">
                        <div>
                            <Label className="text-xs">De</Label>
                            <Input type="date" className="w-[150px] mt-1" defaultValue="2026-01-01" />
                        </div>
                        <div>
                            <Label className="text-xs">Até</Label>
                            <Input type="date" className="w-[150px] mt-1" defaultValue="2026-01-28" />
                        </div>
                        <Select>
                            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="credit">Créditos</SelectItem>
                                <SelectItem value="debit">Débitos</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button>Gerar Extrato</Button>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Entradas</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(summary.entries)}</p>
                        </div>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Saídas</p>
                            <p className="text-xl font-bold text-red-600">{formatCurrency(summary.exits)}</p>
                        </div>
                        <div className="p-4 bg-slate-50 border rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Saldo Inicial</p>
                            <p className="text-xl font-bold">{formatCurrency(summary.initialBalance)}</p>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                            <p className="text-xs text-slate-500 mb-1">Saldo Final</p>
                            <p className="text-xl font-bold text-blue-600">{formatCurrency(summary.finalBalance)}</p>
                        </div>
                    </div>

                    {/* Movements Table */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Movimentações</h4>
                            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                        </div>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-slate-50">
                                        <th className="text-left py-2 px-3">Data</th>
                                        <th className="text-left py-2 px-3">Descrição</th>
                                        <th className="text-right py-2 px-3">Valor</th>
                                        <th className="text-right py-2 px-3">Saldo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.map((m, idx) => (
                                        <tr key={idx} className="border-b hover:bg-slate-50">
                                            <td className="py-3 px-3">{m.date}</td>
                                            <td className="py-3 px-3">{m.desc}</td>
                                            <td className={`py-3 px-3 text-right font-medium ${m.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                <span className="flex items-center justify-end gap-1">
                                                    {m.type === 'credit' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                                    {m.type === 'credit' ? '+' : '-'}{formatCurrency(m.value)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right font-medium">{formatCurrency(m.balance)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}