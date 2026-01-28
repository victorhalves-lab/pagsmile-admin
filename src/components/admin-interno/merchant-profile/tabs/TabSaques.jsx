import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Download, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function TabSaques({ merchant }) {
    const pendingWithdrawals = [
        { id: 'SAQ-890', date: '28/01 10:00', amount: 8000, account: 'Itaú **89-0', status: 'pending' },
        { id: 'SAQ-889', date: '27/01 15:00', amount: 4000, account: 'Itaú **89-0', status: 'pending' },
    ];

    const withdrawalHistory = [
        { id: 'SAQ-888', date: '25/01/2026', amount: 15000, account: 'Itaú **89-0', status: 'processed' },
        { id: 'SAQ-887', date: '20/01/2026', amount: 20000, account: 'Itaú **89-0', status: 'processed' },
        { id: 'SAQ-886', date: '15/01/2026', amount: 25000, account: 'Itaú **89-0', status: 'processed' },
        { id: 'SAQ-885', date: '10/01/2026', amount: 5000, account: 'Itaú **89-0', status: 'rejected' },
        { id: 'SAQ-884', date: '05/01/2026', amount: 18000, account: 'Itaú **89-0', status: 'processed' },
    ];

    const stats = {
        pending: { count: 2, amount: 12000 },
        thisMonth: { count: 8, amount: 85000 },
        lastMonth: { count: 7, amount: 92000 },
        total: { count: 125, amount: 1245000 },
    };

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Pendentes</p>
                    <p className="text-xl font-bold text-yellow-600">{formatCurrency(stats.pending.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.pending.count} saques)</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Este mês</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.thisMonth.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.thisMonth.count} saques)</p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Mês anterior</p>
                    <p className="text-xl font-bold">{formatCurrency(stats.lastMonth.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.lastMonth.count} saques)</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Total histórico</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(stats.total.amount)}</p>
                    <p className="text-xs text-slate-500 mt-1">({stats.total.count} saques)</p>
                </div>
            </div>

            {/* Pending Withdrawals */}
            {pendingWithdrawals.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Saques Pendentes de Aprovação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-700">
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                        <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">Conta destino</th>
                                        <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                        <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingWithdrawals.map(w => (
                                        <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800">
                                            <td className="py-3 px-3 font-mono text-xs">{w.id}</td>
                                            <td className="py-3 px-3">{w.date}</td>
                                            <td className="py-3 px-3 text-right font-bold">{formatCurrency(w.amount)}</td>
                                            <td className="py-3 px-3">{w.account}</td>
                                            <td className="py-3 px-3">
                                                <Badge variant="outline" className="text-yellow-600 border-yellow-200">⏳ Pendente</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Button variant="ghost" size="sm" className="text-green-600" onClick={() => toast.success('Saque aprovado!')}>
                                                        <CheckCircle className="w-4 h-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success('Saque rejeitado!')}>
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => toast.success('Todos os saques aprovados!')}>
                                <CheckCircle className="w-4 h-4 mr-1" /> Aprovar todos
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 border-red-200" onClick={() => toast.success('Todos os saques rejeitados!')}>
                                <XCircle className="w-4 h-4 mr-1" /> Rejeitar todos
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Withdrawal History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Histórico de Saques</CardTitle>
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" /> Exportar
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Conta destino</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Comprov.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawalHistory.map(w => (
                                    <tr key={w.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-3 font-mono text-xs">{w.id}</td>
                                        <td className="py-3 px-3">{w.date}</td>
                                        <td className="py-3 px-3 text-right font-bold">{formatCurrency(w.amount)}</td>
                                        <td className="py-3 px-3">{w.account}</td>
                                        <td className="py-3 px-3">
                                            {w.status === 'processed' && <Badge variant="outline" className="text-green-600 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Processado</Badge>}
                                            {w.status === 'rejected' && <Badge variant="outline" className="text-red-600 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejeitado</Badge>}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            {w.status === 'processed' ? (
                                                <Button variant="ghost" size="sm"><FileText className="w-4 h-4" /></Button>
                                            ) : '-'}
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