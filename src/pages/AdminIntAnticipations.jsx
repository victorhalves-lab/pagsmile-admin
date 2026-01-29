import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, Check, X, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const anticipations = [
    { id: 'ANT-001', date: '28/01/2026', merchant: 'Loja do João', merchantId: '12345', gross: 200000, fee: 3900, net: 196100, rate: 1.95, status: 'requested' },
    { id: 'ANT-002', date: '28/01/2026', merchant: 'Tech Store', merchantId: '12346', gross: 150000, fee: 2925, net: 147075, rate: 1.95, status: 'requested' },
    { id: 'ANT-003', date: '28/01/2026', merchant: 'Maria Store', merchantId: '12347', gross: 80000, fee: 1560, net: 78440, rate: 1.95, status: 'requested' },
    { id: 'ANT-004', date: '27/01/2026', merchant: 'Pet Shop', merchantId: '12348', gross: 45000, fee: 877, net: 44123, rate: 1.95, status: 'processed' },
];

const statusConfig = {
    requested: { label: 'Solicitada', color: 'bg-yellow-100 text-yellow-700' },
    approved: { label: 'Aprovada', color: 'bg-blue-100 text-blue-700' },
    processed: { label: 'Processada', color: 'bg-green-100 text-green-700' },
    rejected: { label: 'Rejeitada', color: 'bg-red-100 text-red-700' },
};

export default function AdminIntAnticipations() {
    const [tab, setTab] = useState('requests');

    const stats = {
        available: 5200000,
        anticipatedToday: 1800000,
        pending: { count: 3, value: 450000 },
        revenue: 36000,
        avgRate: 1.95,
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Antecipação"
                breadcrumbs={[{ label: 'Financeiro' }, { label: 'Antecipação' }]}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Disponível p/ Antecip.</p>
                    <p className="text-xl font-bold text-blue-700">{formatCurrency(stats.available)}</p>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Antecipado (Hoje)</p>
                    <p className="text-xl font-bold text-green-700">{formatCurrency(stats.anticipatedToday)}</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Pendentes</p>
                    <p className="text-xl font-bold text-yellow-700">{stats.pending.count}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(stats.pending.value)}</p>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Receita (Mês)</p>
                    <p className="text-xl font-bold text-purple-700">{formatCurrency(stats.revenue)}</p>
                </div>
                <div className="p-4 bg-white border rounded-lg text-center">
                    <p className="text-xs text-slate-500 mb-1">Taxa Média</p>
                    <p className="text-xl font-bold">{stats.avgRate}% a.m.</p>
                </div>
            </div>

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="requests">📋 Solicitações</TabsTrigger>
                    <TabsTrigger value="agenda">📅 Agenda Antecipável</TabsTrigger>
                    <TabsTrigger value="history">📜 Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="requests">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Solicitações Pendentes</CardTitle>
                            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">ID</th>
                                            <th className="text-left py-2 px-3">Data</th>
                                            <th className="text-left py-2 px-3">Merchant</th>
                                            <th className="text-right py-2 px-3">Valor</th>
                                            <th className="text-right py-2 px-3">Taxa</th>
                                            <th className="text-right py-2 px-3">Líquido</th>
                                            <th className="text-left py-2 px-3">Status</th>
                                            <th className="text-center py-2 px-3">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anticipations.map(a => (
                                            <tr key={a.id} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3 font-mono text-xs">{a.id}</td>
                                                <td className="py-3 px-3">{a.date}</td>
                                                <td className="py-3 px-3">
                                                    <Link to={createPageUrl('AdminIntMerchantProfile') + '?id=' + a.merchantId} className="text-blue-600 hover:underline">
                                                        {a.merchant}
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(a.gross)}</td>
                                                <td className="py-3 px-3 text-right text-red-600">{formatCurrency(a.fee)}</td>
                                                <td className="py-3 px-3 text-right font-medium text-green-600">{formatCurrency(a.net)}</td>
                                                <td className="py-3 px-3">
                                                    <Badge className={`${statusConfig[a.status].color} border-0`}>
                                                        {statusConfig[a.status].label}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-3 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                                        {a.status === 'requested' && (
                                                            <>
                                                                <Button variant="ghost" size="sm" className="text-green-600" onClick={() => toast.success('Antecipação aprovada!')}>
                                                                    <Check className="w-4 h-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.error('Antecipação rejeitada')}>
                                                                    <X className="w-4 h-4" />
                                                                </Button>
                                                            </>
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
                </TabsContent>

                <TabsContent value="agenda">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Calendar className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                            <p className="text-slate-500">Visualização da agenda de recebíveis antecipáveis por merchant</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-base">Histórico de Antecipações</CardTitle>
                            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2 px-3">ID</th>
                                            <th className="text-left py-2 px-3">Data</th>
                                            <th className="text-left py-2 px-3">Merchant</th>
                                            <th className="text-right py-2 px-3">Valor</th>
                                            <th className="text-right py-2 px-3">Taxa</th>
                                            <th className="text-left py-2 px-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {anticipations.filter(a => a.status === 'processed').map(a => (
                                            <tr key={a.id} className="border-b hover:bg-slate-50">
                                                <td className="py-3 px-3 font-mono text-xs">{a.id}</td>
                                                <td className="py-3 px-3">{a.date}</td>
                                                <td className="py-3 px-3">{a.merchant}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(a.gross)}</td>
                                                <td className="py-3 px-3 text-right">{formatCurrency(a.fee)}</td>
                                                <td className="py-3 px-3">
                                                    <Badge className="bg-green-100 text-green-700 border-0">Processada</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}