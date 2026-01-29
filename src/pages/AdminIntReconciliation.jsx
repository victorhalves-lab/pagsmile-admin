import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, AlertTriangle } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function AdminIntReconciliation() {
    const stats = {
        reconciled: 12340,
        pending: 103,
        divergent: 12,
        total: 12455,
        reconciledValue: 2543890,
    };

    const divergences = [
        { id: 'DIV-001', txId: 'TXN-12345', acquirer: 'Cielo', txValue: 100, liquidValue: 99.50, diff: 0.50 },
        { id: 'DIV-002', txId: 'TXN-12400', acquirer: 'Rede', txValue: 250, liquidValue: null, diff: 250 },
        { id: 'DIV-003', txId: null, acquirer: 'Stone', txValue: null, liquidValue: 75, diff: 75 },
    ];

    const reconciledPercentage = (stats.reconciled / stats.total * 100).toFixed(1);
    const pendingPercentage = (stats.pending / stats.total * 100).toFixed(1);
    const divergentPercentage = (stats.divergent / stats.total * 100).toFixed(1);

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Conciliação"
                breadcrumbs={[
                    { label: 'Transações' },
                    { label: 'Conciliação' }
                ]}
            />

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Conciliadas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.reconciled.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{reconciledPercentage}%</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{pendingPercentage}%</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Divergentes</p>
                    <p className="text-2xl font-bold text-red-600">{stats.divergent.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{divergentPercentage}%</p>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Total</p>
                    <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Valor Conciliado</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(stats.reconciledValue)}</p>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="divergent" className="w-full">
                <TabsList>
                    <TabsTrigger value="reconciled">Conciliadas</TabsTrigger>
                    <TabsTrigger value="pending">Pendentes</TabsTrigger>
                    <TabsTrigger value="divergent">
                        Divergências
                        {stats.divergent > 0 && <Badge variant="destructive" className="ml-2">{stats.divergent}</Badge>}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="divergent">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Divergências Encontradas
                            </CardTitle>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" /> Exportar
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3 font-medium text-slate-500">ID Div.</th>
                                            <th className="text-left py-2 px-3 font-medium text-slate-500">Transação</th>
                                            <th className="text-left py-2 px-3 font-medium text-slate-500">Adquirente</th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-500">Valor TXN</th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-500">Valor Liquidado</th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-500">Diferença</th>
                                            <th className="text-center py-2 px-3 font-medium text-slate-500">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {divergences.map(div => (
                                            <tr key={div.id} className="border-b hover:bg-red-50">
                                                <td className="py-3 px-3 font-mono text-xs">{div.id}</td>
                                                <td className="py-3 px-3 font-mono text-xs">{div.txId || '-'}</td>
                                                <td className="py-3 px-3">{div.acquirer}</td>
                                                <td className="py-3 px-3 text-right">{div.txValue ? formatCurrency(div.txValue) : '-'}</td>
                                                <td className="py-3 px-3 text-right">{div.liquidValue ? formatCurrency(div.liquidValue) : '-'}</td>
                                                <td className="py-3 px-3 text-right font-bold text-red-600">{formatCurrency(div.diff)}</td>
                                                <td className="py-3 px-3 text-center">
                                                    <Button size="sm" variant="outline">Resolver</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="reconciled">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">{stats.reconciled.toLocaleString()} transações conciliadas com sucesso</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">{stats.pending.toLocaleString()} transações aguardando arquivo de liquidação</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}