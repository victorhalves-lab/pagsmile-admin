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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Users,
    Building2,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    ChevronRight,
    BarChart3,
    PieChart,
    Wallet,
    Percent,
    Store
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart as RePieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

const formatCurrency = (value) => {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatPercent = (value) => `${(value || 0).toFixed(2)}%`;

const COLORS = ['#2bc196', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#14b8a6'];

export default function AdminIntClientProfitability() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [spreadFilter, setSpreadFilter] = useState('all');
    const [volumeFilter, setVolumeFilter] = useState('all');
    const [sortBy, setSortBy] = useState('spread_desc');
    const [period, setPeriod] = useState('month');

    const { data: subaccounts = [], isLoading } = useQuery({
        queryKey: ['subaccounts-profitability'],
        queryFn: () => base44.entities.Subaccount.filter({ status: 'active' })
    });

    // Generate profitability data for each client
    const clientsData = useMemo(() => {
        return subaccounts.map((sub, idx) => {
            // Simulate financial data for each client
            const gmv = (sub.total_volume || Math.random() * 500000 + 50000);
            const mdrRate = 2.5 + Math.random() * 1.5; // 2.5% - 4%
            const mdrRevenue = gmv * (mdrRate / 100);
            const anticipationRevenue = gmv * 0.003 * Math.random(); // 0-0.3%
            const fixedFeeRevenue = (sub.total_transactions || Math.floor(gmv / 150)) * 0.15;
            const antifraudRevenue = (sub.total_transactions || Math.floor(gmv / 150)) * 0.05;
            
            const totalRevenue = mdrRevenue + anticipationRevenue + fixedFeeRevenue + antifraudRevenue;
            
            const mdrCost = mdrRevenue * 0.65; // 65% goes to acquirers
            const pixCost = gmv * 0.001; // 0.1% Pix cost
            const antifraudCost = antifraudRevenue * 0.6;
            const operationalCost = gmv * 0.0005;
            
            const totalCost = mdrCost + pixCost + antifraudCost + operationalCost;
            const netSpread = totalRevenue - totalCost;
            const margin = (netSpread / gmv) * 100;

            const repasse = gmv - mdrRevenue - fixedFeeRevenue;

            return {
                id: sub.id,
                business_name: sub.business_name,
                document: sub.document,
                status: sub.status,
                mcc: sub.mcc,
                gmv,
                repasse,
                mdrRevenue,
                anticipationRevenue,
                fixedFeeRevenue,
                antifraudRevenue,
                totalRevenue,
                totalCost,
                netSpread,
                margin,
                subSellersCount: Math.floor(Math.random() * 10),
                transactions: sub.total_transactions || Math.floor(gmv / 150),
                avgTicket: gmv / (sub.total_transactions || Math.floor(gmv / 150))
            };
        });
    }, [subaccounts]);

    // Filter and sort clients
    const filteredClients = useMemo(() => {
        let result = [...clientsData];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(c => 
                c.business_name?.toLowerCase().includes(term) ||
                c.document?.includes(term)
            );
        }

        // Spread filter
        if (spreadFilter === 'negative') {
            result = result.filter(c => c.netSpread < 0);
        } else if (spreadFilter === 'low') {
            result = result.filter(c => c.netSpread >= 0 && c.netSpread < 1000);
        } else if (spreadFilter === 'medium') {
            result = result.filter(c => c.netSpread >= 1000 && c.netSpread < 10000);
        } else if (spreadFilter === 'high') {
            result = result.filter(c => c.netSpread >= 10000);
        }

        // Volume filter
        if (volumeFilter === 'small') {
            result = result.filter(c => c.gmv < 100000);
        } else if (volumeFilter === 'medium') {
            result = result.filter(c => c.gmv >= 100000 && c.gmv < 500000);
        } else if (volumeFilter === 'large') {
            result = result.filter(c => c.gmv >= 500000);
        }

        // Sort
        switch (sortBy) {
            case 'spread_desc':
                result.sort((a, b) => b.netSpread - a.netSpread);
                break;
            case 'spread_asc':
                result.sort((a, b) => a.netSpread - b.netSpread);
                break;
            case 'volume_desc':
                result.sort((a, b) => b.gmv - a.gmv);
                break;
            case 'volume_asc':
                result.sort((a, b) => a.gmv - b.gmv);
                break;
            case 'margin_desc':
                result.sort((a, b) => b.margin - a.margin);
                break;
        }

        return result;
    }, [clientsData, searchTerm, spreadFilter, volumeFilter, sortBy]);

    // Summary stats
    const summaryStats = useMemo(() => {
        const totalGMV = clientsData.reduce((sum, c) => sum + c.gmv, 0);
        const totalSpread = clientsData.reduce((sum, c) => sum + c.netSpread, 0);
        const avgSpread = clientsData.length > 0 ? totalSpread / clientsData.length : 0;
        const negativeClients = clientsData.filter(c => c.netSpread < 0).length;
        const topClient = clientsData.reduce((max, c) => c.netSpread > max.netSpread ? c : max, { netSpread: 0 });

        return { totalGMV, totalSpread, avgSpread, negativeClients, topClient };
    }, [clientsData]);

    // Top 10 clients for chart
    const top10Clients = useMemo(() => {
        return [...clientsData]
            .sort((a, b) => b.netSpread - a.netSpread)
            .slice(0, 10)
            .map(c => ({
                name: c.business_name?.slice(0, 15) + (c.business_name?.length > 15 ? '...' : ''),
                spread: c.netSpread,
                margin: c.margin
            }));
    }, [clientsData]);

    // Spread distribution
    const spreadDistribution = useMemo(() => {
        const ranges = [
            { name: 'Negativo', min: -Infinity, max: 0, count: 0, value: 0 },
            { name: '0-1K', min: 0, max: 1000, count: 0, value: 0 },
            { name: '1K-5K', min: 1000, max: 5000, count: 0, value: 0 },
            { name: '5K-10K', min: 5000, max: 10000, count: 0, value: 0 },
            { name: '10K-50K', min: 10000, max: 50000, count: 0, value: 0 },
            { name: '50K+', min: 50000, max: Infinity, count: 0, value: 0 },
        ];

        clientsData.forEach(c => {
            const range = ranges.find(r => c.netSpread >= r.min && c.netSpread < r.max);
            if (range) {
                range.count++;
                range.value += c.netSpread;
            }
        });

        return ranges;
    }, [clientsData]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Rentabilidade por Cliente"
                subtitle="Análise de spread e ganhos por subconta"
                breadcrumbs={[
                    { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
                    { label: 'Rentabilidade por Cliente' }
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
                                <SelectItem value="year">Este ano</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                }
            />

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Clientes Ativos</p>
                                <p className="text-2xl font-bold">{clientsData.length}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-blue-100">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">GMV Total</p>
                                <p className="text-2xl font-bold">{formatCurrency(summaryStats.totalGMV)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-green-100">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-[#2bc196] bg-[#2bc196]/5">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Spread Total</p>
                                <p className="text-2xl font-bold text-[#2bc196]">{formatCurrency(summaryStats.totalSpread)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-[#2bc196]/20">
                                <TrendingUp className="w-5 h-5 text-[#2bc196]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Spread Médio</p>
                                <p className="text-2xl font-bold">{formatCurrency(summaryStats.avgSpread)}</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-purple-100">
                                <Percent className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className={summaryStats.negativeClients > 0 ? "border-red-200 bg-red-50" : ""}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Spread Negativo</p>
                                <p className="text-2xl font-bold text-red-600">{summaryStats.negativeClients}</p>
                                <p className="text-xs text-red-500">clientes</p>
                            </div>
                            <div className="p-2.5 rounded-xl bg-red-100">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 10 Clients */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[#2bc196]" />
                            Top 10 Clientes por Spread
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={top10Clients} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
                                    <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="spread" fill="#2bc196" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Spread Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-blue-600" />
                            Distribuição de Spread
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RePieChart>
                                    <Pie
                                        data={spreadDistribution.filter(r => r.count > 0)}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={90}
                                        paddingAngle={2}
                                        label={({ name, count }) => `${name}: ${count}`}
                                    >
                                        {spreadDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name, props) => [`${value} clientes`, props.payload.name]} />
                                    <Legend />
                                </RePieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex-1 min-w-[200px] max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Buscar por nome ou CNPJ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <Select value={spreadFilter} onValueChange={setSpreadFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Spread" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todo Spread</SelectItem>
                                <SelectItem value="negative">Negativo</SelectItem>
                                <SelectItem value="low">0 - R$ 1K</SelectItem>
                                <SelectItem value="medium">R$ 1K - R$ 10K</SelectItem>
                                <SelectItem value="high">&gt; R$ 10K</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={volumeFilter} onValueChange={setVolumeFilter}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Volume" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todo Volume</SelectItem>
                                <SelectItem value="small">&lt; R$ 100K</SelectItem>
                                <SelectItem value="medium">R$ 100K - R$ 500K</SelectItem>
                                <SelectItem value="large">&gt; R$ 500K</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spread_desc">Maior Spread</SelectItem>
                                <SelectItem value="spread_asc">Menor Spread</SelectItem>
                                <SelectItem value="volume_desc">Maior Volume</SelectItem>
                                <SelectItem value="volume_asc">Menor Volume</SelectItem>
                                <SelectItem value="margin_desc">Maior Margem %</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-800">
                                    <TableHead>Cliente</TableHead>
                                    <TableHead className="text-right">GMV</TableHead>
                                    <TableHead className="text-right">Repasse</TableHead>
                                    <TableHead className="text-right">Receita MDR</TableHead>
                                    <TableHead className="text-right">Receita Antecip.</TableHead>
                                    <TableHead className="text-right">Taxas Fixas</TableHead>
                                    <TableHead className="text-right">Total Receitas</TableHead>
                                    <TableHead className="text-right">Custos</TableHead>
                                    <TableHead className="text-right">Spread Líquido</TableHead>
                                    <TableHead className="text-right">Margem</TableHead>
                                    <TableHead className="text-center">Sub-sellers</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClients.slice(0, 50).map((client) => (
                                    <TableRow key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                                                    <Building2 className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{client.business_name}</p>
                                                    <p className="text-xs text-slate-500">{client.document}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(client.gmv)}</TableCell>
                                        <TableCell className="text-right text-slate-600">{formatCurrency(client.repasse)}</TableCell>
                                        <TableCell className="text-right text-green-600">{formatCurrency(client.mdrRevenue)}</TableCell>
                                        <TableCell className="text-right text-purple-600">{formatCurrency(client.anticipationRevenue)}</TableCell>
                                        <TableCell className="text-right text-blue-600">{formatCurrency(client.fixedFeeRevenue)}</TableCell>
                                        <TableCell className="text-right font-medium text-green-600">{formatCurrency(client.totalRevenue)}</TableCell>
                                        <TableCell className="text-right text-red-600">{formatCurrency(client.totalCost)}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={cn(
                                                "font-bold",
                                                client.netSpread >= 0 ? "text-[#2bc196]" : "text-red-600"
                                            )}>
                                                {formatCurrency(client.netSpread)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="outline" className={cn(
                                                client.margin >= 0.5 ? "text-green-600 border-green-200" :
                                                client.margin >= 0 ? "text-yellow-600 border-yellow-200" :
                                                "text-red-600 border-red-200"
                                            )}>
                                                {formatPercent(client.margin)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {client.subSellersCount > 0 ? (
                                                <Badge variant="secondary">{client.subSellersCount}</Badge>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => navigate(createPageUrl(`AdminIntClientSplitDetail?id=${client.id}`))}>
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        Ver Splits Detalhados
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => navigate(createPageUrl(`AdminIntMerchantProfile?id=${client.id}`))}>
                                                        <Building2 className="w-4 h-4 mr-2" />
                                                        Perfil do Merchant
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {filteredClients.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                            <p>Nenhum cliente encontrado</p>
                        </div>
                    )}
                    {filteredClients.length > 50 && (
                        <div className="p-4 text-center border-t">
                            <p className="text-sm text-slate-500">
                                Mostrando 50 de {filteredClients.length} clientes. Use os filtros para refinar.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}