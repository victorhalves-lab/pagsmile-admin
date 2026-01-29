import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Building2,
    ArrowLeft,
    Download,
    Users,
    CreditCard,
    QrCode,
    Percent,
    PiggyBank,
    Store,
    ArrowRight,
    Eye,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Legend
} from 'recharts';

const formatCurrency = (value) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatPercent = (value) => `${(value || 0).toFixed(2)}%`;

export default function AdminIntClientSplitDetail() {
    const navigate = useNavigate();
    const [period, setPeriod] = useState('month');
    const [activeTab, setActiveTab] = useState('overview');

    // Get client ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const clientId = urlParams.get('id');

    const { data: client } = useQuery({
        queryKey: ['client-detail', clientId],
        queryFn: () => base44.entities.Subaccount.filter({ id: clientId }),
        enabled: !!clientId
    });

    const { data: subSellers = [] } = useQuery({
        queryKey: ['sub-sellers', clientId],
        queryFn: () => base44.entities.SubSeller.filter({ parent_subaccount_id: clientId }),
        enabled: !!clientId
    });

    const { data: transactions = [] } = useQuery({
        queryKey: ['client-transactions', clientId],
        queryFn: () => base44.entities.Transaction.filter({ subaccount_id: clientId }, '-created_at', 100),
        enabled: !!clientId
    });

    const clientData = client?.[0] || {};

    // Generate mock financial summary
    const financialSummary = useMemo(() => {
        const gmv = clientData.total_volume || 450000;
        const mdrRevenue = gmv * 0.032;
        const anticipationRevenue = gmv * 0.002;
        const fixedFeeRevenue = 1500;
        const antifraudRevenue = 800;
        const totalRevenue = mdrRevenue + anticipationRevenue + fixedFeeRevenue + antifraudRevenue;

        const mdrCost = mdrRevenue * 0.65;
        const pixCost = gmv * 0.001;
        const operationalCost = 200;
        const totalCost = mdrCost + pixCost + operationalCost;

        const netSpread = totalRevenue - totalCost;
        const margin = (netSpread / gmv) * 100;
        const repasse = gmv - mdrRevenue - fixedFeeRevenue;

        return {
            gmv,
            repasse,
            mdrRevenue,
            anticipationRevenue,
            fixedFeeRevenue,
            antifraudRevenue,
            totalRevenue,
            mdrCost,
            pixCost,
            operationalCost,
            totalCost,
            netSpread,
            margin
        };
    }, [clientData]);

    // Mock sub-sellers data
    const subSellersData = useMemo(() => {
        if (subSellers.length > 0) return subSellers;
        
        return [
            { id: 1, business_name: 'Loja Centro', document: '12.345.678/0001-01', volume: 85000, received: 82450, split: 97 },
            { id: 2, business_name: 'Loja Shopping', document: '12.345.678/0002-02', volume: 125000, received: 121250, split: 97 },
            { id: 3, business_name: 'Loja Online', document: '12.345.678/0003-03', volume: 95000, received: 90250, split: 95 },
            { id: 4, business_name: 'Franquia Norte', document: '12.345.678/0004-04', volume: 65000, received: 62400, split: 96 },
            { id: 5, business_name: 'Franquia Sul', document: '12.345.678/0005-05', volume: 80000, received: 76800, split: 96 },
        ];
    }, [subSellers]);

    // Mock transaction splits
    const transactionSplits = useMemo(() => {
        return [
            { id: 'TXN-001', date: '2026-01-29 14:32', amount: 299, method: 'card', repasse: 289.53, mdr: 9.57, antecip: 0.30, fixedFee: 0.15, cost: 6.22, spread: 3.80 },
            { id: 'TXN-002', date: '2026-01-29 14:28', amount: 150, method: 'pix', repasse: 145.50, mdr: 4.50, antecip: 0, fixedFee: 0.10, cost: 2.93, spread: 1.67 },
            { id: 'TXN-003', date: '2026-01-29 14:15', amount: 450, method: 'card', repasse: 435.60, mdr: 14.40, antecip: 0.45, fixedFee: 0.15, cost: 9.36, spread: 5.64 },
            { id: 'TXN-004', date: '2026-01-29 13:55', amount: 89, method: 'pix', repasse: 86.33, mdr: 2.67, antecip: 0, fixedFee: 0.10, cost: 1.74, spread: 1.03 },
            { id: 'TXN-005', date: '2026-01-29 13:42', amount: 1250, method: 'card', repasse: 1210.00, mdr: 40.00, antecip: 1.25, fixedFee: 0.15, cost: 26.00, spread: 15.40 },
        ];
    }, [transactions]);

    // Trend data
    const trendData = [
        { month: 'Set', gmv: 380000, spread: 4200 },
        { month: 'Out', gmv: 410000, spread: 4650 },
        { month: 'Nov', gmv: 425000, spread: 4800 },
        { month: 'Dez', gmv: 465000, spread: 5300 },
        { month: 'Jan', gmv: financialSummary.gmv, spread: financialSummary.netSpread },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title={
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <span>Splits e Ganhos: {clientData.business_name || 'Cliente'}</span>
                    </div>
                }
                subtitle={clientData.document || 'Carregando...'}
                breadcrumbs={[
                    { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
                    { label: 'Rentabilidade', page: 'AdminIntClientProfitability' },
                    { label: 'Detalhes do Cliente' }
                ]}
                actions={
                    <div className="flex items-center gap-3">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="week">Esta semana</SelectItem>
                                <SelectItem value="month">Este mês</SelectItem>
                                <SelectItem value="quarter">Este trimestre</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline" onClick={() => navigate(createPageUrl(`AdminIntMerchantProfile?id=${clientId}`))}>
                            <Building2 className="w-4 h-4 mr-2" />
                            Ver Perfil
                        </Button>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                }
            />

            {/* Financial Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 mb-1">GMV</p>
                        <p className="text-xl font-bold">{formatCurrency(financialSummary.gmv)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 mb-1">Repasse ao Cliente</p>
                        <p className="text-xl font-bold text-blue-600">{formatCurrency(financialSummary.repasse)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 mb-1">Receitas PagSmile</p>
                        <p className="text-xl font-bold text-green-600">{formatCurrency(financialSummary.totalRevenue)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 mb-1">Custos PagSmile</p>
                        <p className="text-xl font-bold text-red-600">{formatCurrency(financialSummary.totalCost)}</p>
                    </CardContent>
                </Card>
                <Card className="border-[#2bc196] bg-[#2bc196]/5">
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 mb-1">Spread Líquido</p>
                        <p className="text-xl font-bold text-[#2bc196]">{formatCurrency(financialSummary.netSpread)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-xs text-slate-500 mb-1">Margem</p>
                        <p className="text-xl font-bold text-purple-600">{formatPercent(financialSummary.margin)}</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="subsellers">Sub-sellers ({subSellersData.length})</TabsTrigger>
                    <TabsTrigger value="transactions">Transações Detalhadas</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    {/* Revenue/Cost Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                    Composição das Receitas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                        <span className="text-sm font-medium text-blue-700">Receita MDR</span>
                                        <span className="font-bold text-blue-700">{formatCurrency(financialSummary.mdrRevenue)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <span className="text-sm font-medium text-purple-700">Receita Antecipação</span>
                                        <span className="font-bold text-purple-700">{formatCurrency(financialSummary.anticipationRevenue)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                                        <span className="text-sm font-medium text-amber-700">Taxas Fixas</span>
                                        <span className="font-bold text-amber-700">{formatCurrency(financialSummary.fixedFeeRevenue)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700">Anti-fraude</span>
                                        <span className="font-bold text-slate-700">{formatCurrency(financialSummary.antifraudRevenue)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-100 rounded-lg border-2 border-green-200">
                                        <span className="text-sm font-semibold text-green-800">Total Receitas</span>
                                        <span className="font-bold text-green-800 text-lg">{formatCurrency(financialSummary.totalRevenue)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                    Composição dos Custos
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <span className="text-sm font-medium text-red-700">MDR Adquirentes</span>
                                        <span className="font-bold text-red-700">{formatCurrency(financialSummary.mdrCost)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <span className="text-sm font-medium text-orange-700">Custo Pix</span>
                                        <span className="font-bold text-orange-700">{formatCurrency(financialSummary.pixCost)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700">Custos Operacionais</span>
                                        <span className="font-bold text-slate-700">{formatCurrency(financialSummary.operationalCost)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-100 rounded-lg border-2 border-red-200">
                                        <span className="text-sm font-semibold text-red-800">Total Custos</span>
                                        <span className="font-bold text-red-800 text-lg">{formatCurrency(financialSummary.totalCost)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Tendência de Spread ao Longo do Tempo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[250px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={trendData}>
                                        <defs>
                                            <linearGradient id="colorSpread" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2bc196" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#2bc196" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis yAxisId="left" tickFormatter={(v) => formatCurrency(v)} />
                                        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => formatCurrency(v)} />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Area yAxisId="left" type="monotone" dataKey="gmv" stroke="#3b82f6" fill="#dbeafe" name="GMV" />
                                        <Area yAxisId="right" type="monotone" dataKey="spread" stroke="#2bc196" fill="url(#colorSpread)" name="Spread" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Sub-sellers Tab */}
                <TabsContent value="subsellers" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                        <Store className="w-5 h-5 text-indigo-600" />
                                        Sub-sellers do Cliente
                                    </CardTitle>
                                    <CardDescription>Visibilidade da cadeia de split</CardDescription>
                                </div>
                                <Badge variant="secondary">{subSellersData.length} sub-sellers</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Sub-seller</TableHead>
                                            <TableHead className="text-right">Volume Processado</TableHead>
                                            <TableHead className="text-right">Repassado ao Sub-seller</TableHead>
                                            <TableHead className="text-right">Retido pelo Cliente</TableHead>
                                            <TableHead className="text-right">% Split</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {subSellersData.map((seller) => {
                                            const retained = seller.volume - seller.received;
                                            return (
                                                <TableRow key={seller.id}>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                                                                <Store className="w-4 h-4 text-indigo-600" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-sm">{seller.business_name}</p>
                                                                <p className="text-xs text-slate-500">{seller.document}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">{formatCurrency(seller.volume)}</TableCell>
                                                    <TableCell className="text-right text-green-600">{formatCurrency(seller.received)}</TableCell>
                                                    <TableCell className="text-right font-bold text-[#2bc196]">{formatCurrency(retained)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="outline">{seller.split}%</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                            {subSellersData.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    <Store className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                                    <p>Este cliente não possui sub-sellers</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="space-y-6 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Histórico Detalhado de Splits por Transação
                            </CardTitle>
                            <CardDescription>Análise granular de cada transação e seus splits</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>ID / Data</TableHead>
                                            <TableHead>Método</TableHead>
                                            <TableHead className="text-right">Valor Original</TableHead>
                                            <TableHead className="text-right">Repasse</TableHead>
                                            <TableHead className="text-right">MDR</TableHead>
                                            <TableHead className="text-right">Antecip.</TableHead>
                                            <TableHead className="text-right">Taxa Fixa</TableHead>
                                            <TableHead className="text-right">Custo PS</TableHead>
                                            <TableHead className="text-right">Spread</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactionSplits.map((txn) => (
                                            <TableRow key={txn.id} className="hover:bg-slate-50">
                                                <TableCell>
                                                    <div>
                                                        <p className="font-mono text-sm font-medium">{txn.id}</p>
                                                        <p className="text-xs text-slate-500">{txn.date}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="gap-1">
                                                        {txn.method === 'card' ? (
                                                            <>
                                                                <CreditCard className="w-3 h-3" />
                                                                Cartão
                                                            </>
                                                        ) : (
                                                            <>
                                                                <QrCode className="w-3 h-3" />
                                                                Pix
                                                            </>
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-bold">{formatCurrency(txn.amount)}</TableCell>
                                                <TableCell className="text-right text-blue-600">{formatCurrency(txn.repasse)}</TableCell>
                                                <TableCell className="text-right text-green-600 text-sm">+{formatCurrency(txn.mdr)}</TableCell>
                                                <TableCell className="text-right text-purple-600 text-sm">
                                                    {txn.antecip > 0 ? `+${formatCurrency(txn.antecip)}` : '-'}
                                                </TableCell>
                                                <TableCell className="text-right text-amber-600 text-sm">+{formatCurrency(txn.fixedFee)}</TableCell>
                                                <TableCell className="text-right text-red-600 text-sm">-{formatCurrency(txn.cost)}</TableCell>
                                                <TableCell className="text-right">
                                                    <span className="font-bold text-[#2bc196]">{formatCurrency(txn.spread)}</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}