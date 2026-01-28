import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, Download, ChevronLeft, ChevronRight, TrendingUp, Lock, Unlock, PlusCircle, MinusCircle, Zap } from 'lucide-react';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function TabFinanceiro({ merchant }) {
    const [selectedReceivables, setSelectedReceivables] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const receivables = [
        { date: '29/01/2026', gross: 15000, fee: 525, net: 14475, status: 'scheduled' },
        { date: '30/01/2026', gross: 22500, fee: 787.50, net: 21712.50, status: 'scheduled' },
        { date: '31/01/2026', gross: 18000, fee: 630, net: 17370, status: 'scheduled' },
        { date: '01/02/2026', gross: 12000, fee: 420, net: 11580, status: 'scheduled' },
        { date: '05/02/2026', gross: 21932, fee: 767.62, net: 21164.38, status: 'scheduled' },
    ];

    const movements = [
        { date: '28/01/2026', description: 'Liquidação #LIQ-12345', amount: 15000, type: 'credit' },
        { date: '27/01/2026', description: 'Saque #SAQ-789', amount: -10000, type: 'debit' },
        { date: '27/01/2026', description: 'Taxa de saque', amount: -5, type: 'debit' },
        { date: '26/01/2026', description: 'Liquidação #LIQ-12344', amount: 12000, type: 'credit' },
        { date: '25/01/2026', description: 'Chargeback #CB-456', amount: -299, type: 'debit' },
        { date: '25/01/2026', description: 'Estorno #REF-123', amount: -150, type: 'debit' },
    ];

    let runningBalance = merchant.balance || 45678;
    const balances = movements.map(m => {
        const balance = runningBalance;
        runningBalance -= m.amount;
        return balance;
    }).reverse();

    return (
        <div className="space-y-6">
            {/* Balances */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Disponível</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(merchant.balance || 45678)}</p>
                    <Button size="sm" variant="outline" className="mt-2 w-full text-xs">Sacar</Button>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Bloqueado</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(5000)}</p>
                    <Button size="sm" variant="outline" className="mt-2 w-full text-xs">Ver</Button>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">A Liquidar</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(89432)}</p>
                    <Button size="sm" variant="outline" className="mt-2 w-full text-xs">Ver agenda</Button>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Retenção</p>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(8900)}</p>
                    <Button size="sm" variant="outline" className="mt-2 w-full text-xs">Ver</Button>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Total</p>
                    <p className="text-xl font-bold">{formatCurrency(149010)}</p>
                    <p className="text-xs text-slate-400 mt-1">Atualizado: 28/01 14:35</p>
                </div>
            </div>

            {/* Receivables Schedule */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        📅 Agenda de Recebíveis
                    </CardTitle>
                    <Button size="sm" disabled={selectedReceivables.length === 0}>
                        <Zap className="w-4 h-4 mr-1" /> Antecipar Selecionados
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Select defaultValue="jan2026">
                            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jan2026">Janeiro 2026</SelectItem>
                                <SelectItem value="fev2026">Fevereiro 2026</SelectItem>
                                <SelectItem value="mar2026">Março 2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-2"><Checkbox /></th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Bruto</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Taxa</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Líquido</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receivables.map((rec, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-2">
                                            <Checkbox 
                                                checked={selectedReceivables.includes(idx)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedReceivables(checked ? [...selectedReceivables, idx] : selectedReceivables.filter(i => i !== idx));
                                                }}
                                            />
                                        </td>
                                        <td className="py-3 px-3">{rec.date}</td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(rec.gross)}</td>
                                        <td className="py-3 px-3 text-right text-red-600">{formatCurrency(rec.fee)}</td>
                                        <td className="py-3 px-3 text-right font-bold">{formatCurrency(rec.net)}</td>
                                        <td className="py-3 px-3">
                                            <Badge variant="outline" className="text-blue-600 border-blue-200">📅 Agendado</Badge>
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <Button variant="ghost" size="sm"><Zap className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-sm text-slate-600 mt-3">Total do período: <span className="font-bold">{formatCurrency(receivables.reduce((sum, r) => sum + r.net, 0))}</span> (líquido)</p>
                </CardContent>
            </Card>

            {/* Statement */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        📜 Extrato de Movimentações
                    </CardTitle>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" /> Exportar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Descrição</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.map((mov, idx) => (
                                    <tr key={idx} className="border-b border-slate-100 dark:border-slate-800">
                                        <td className="py-3 px-3">{mov.date}</td>
                                        <td className="py-3 px-3">{mov.description}</td>
                                        <td className={`py-3 px-3 text-right font-medium ${mov.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {mov.type === 'credit' ? '+' : ''}{formatCurrency(mov.amount)}
                                        </td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(balances[idx])}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-sm text-slate-600">Mostrando 1-20 de 156 movimentações</span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm"><ChevronLeft className="w-4 h-4 mr-1" /> Anterior</Button>
                            <span className="text-sm text-slate-600">1 de 8</span>
                            <Button variant="outline" size="sm">Próxima <ChevronRight className="w-4 h-4 ml-1" /></Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Financial Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        ⚡ Ações Financeiras
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <Button variant="outline" className="justify-start">
                            <Wallet className="w-4 h-4 mr-2" /> Solicitar Saque
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Zap className="w-4 h-4 mr-2" /> Antecipar Recebíveis
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Download className="w-4 h-4 mr-2" /> Gerar Relatório
                        </Button>
                        <Button variant="outline" className="justify-start text-red-600 border-red-200 hover:bg-red-50">
                            <Lock className="w-4 h-4 mr-2" /> Bloquear Saldo
                        </Button>
                        <Button variant="outline" className="justify-start text-green-600 border-green-200 hover:bg-green-50">
                            <Unlock className="w-4 h-4 mr-2" /> Desbloquear Saldo
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <PlusCircle className="w-4 h-4 mr-2" /> Ajuste Manual
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}