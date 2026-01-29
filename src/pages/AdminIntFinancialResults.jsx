import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    QrCode,
    Percent,
    PiggyBank,
    AlertTriangle,
    ShieldCheck,
    ArrowDownRight,
    ArrowUpRight,
    Download,
    RefreshCw,
    FileText,
    Calculator,
    Wallet,
    BarChart3,
    PieChart as PieChartIcon,
    ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
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
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line
} from 'recharts';

const formatCurrency = (value) => {
    if (value >= 1000000000) return `R$ ${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const formatPercent = (value) => `${(value || 0).toFixed(2)}%`;

const COLORS = ['#2bc196', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'slate', highlight = false }) => (
    <Card className={cn(highlight && "border-[#2bc196] bg-[#2bc196]/5")}>
        <CardContent className="p-4">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-slate-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
                </div>
                <div className={cn("p-2.5 rounded-xl", `bg-${color}-100 dark:bg-${color}-900/30`)}>
                    <Icon className={cn("w-5 h-5", `text-${color}-600`)} />
                </div>
            </div>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1 mt-3 text-sm font-medium",
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                )}>
                    {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span>{trendValue}</span>
                    <span className="text-slate-400 font-normal ml-1">vs mês anterior</span>
                </div>
            )}
        </CardContent>
    </Card>
);

export default function AdminIntFinancialResults() {
    const [period, setPeriod] = useState('month');
    const [paymentMethod, setPaymentMethod] = useState('all');

    // Mock data for financial results
    const financialData = useMemo(() => {
        // Revenue breakdown
        const revenueByType = [
            { name: 'MDR Cartão', value: 2850000, cost: 1900000, color: '#3b82f6' },
            { name: 'MDR Pix', value: 1250000, cost: 450000, color: '#2bc196' },
            { name: 'Antecipação', value: 680000, cost: 320000, color: '#8b5cf6' },
            { name: 'Taxa Fixa', value: 420000, cost: 50000, color: '#f59e0b' },
            { name: 'Anti-fraude', value: 180000, cost: 120000, color: '#ef4444' },
            { name: 'Outras', value: 95000, cost: 30000, color: '#06b6d4' },
        ];

        const totalRevenue = revenueByType.reduce((sum, r) => sum + r.value, 0);
        const totalCost = revenueByType.reduce((sum, r) => sum + r.cost, 0);
        const netRevenue = totalRevenue - totalCost;

        // Cost breakdown
        const costBreakdown = [
            { name: 'MDR Adquirentes', value: 1900000, category: 'mdr' },
            { name: 'Liquidação Pix', value: 450000, category: 'pix' },
            { name: 'Custo Antecipação', value: 320000, category: 'anticipation' },
            { name: 'Anti-fraude', value: 120000, category: 'antifraud' },
            { name: 'Chargebacks Perdidos', value: 85000, category: 'chargeback' },
            { name: 'Custos Operacionais', value: 50000, category: 'operational' },
        ];

        // Monthly trend
        const monthlyTrend = [
            { month: 'Ago', revenue: 4800000, cost: 2600000, net: 2200000, margin: 45.8 },
            { month: 'Set', revenue: 5100000, cost: 2750000, net: 2350000, margin: 46.1 },
            { month: 'Out', revenue: 5350000, cost: 2850000, net: 2500000, margin: 46.7 },
            { month: 'Nov', revenue: 5200000, cost: 2800000, net: 2400000, margin: 46.2 },
            { month: 'Dez', revenue: 5650000, cost: 3000000, net: 2650000, margin: 46.9 },
            { month: 'Jan', revenue: totalRevenue, cost: totalCost, net: netRevenue, margin: ((netRevenue / totalRevenue) * 100) },
        ];

        // Pre-chargeback results
        const preChargebackData = {
            alertsReceived: 245,
            alertsEthoca: 142,
            alertsVerifi: 103,
            valueAtRisk: 185000,
            reimbursed: 165,
            contested: 45,
            ignored: 35,
            costOfAlerts: 12500,
            chargebacksAvoided: 165,
            valueAvoided: 125000,
            roi: ((125000 - 12500) / 12500 * 100)
        };

        // GMV breakdown by method
        const gmvByMethod = [
            { name: 'Cartão Crédito', value: 45000000, percentage: 55 },
            { name: 'Cartão Débito', value: 12000000, percentage: 14.7 },
            { name: 'Pix', value: 22000000, percentage: 26.9 },
            { name: 'Boleto', value: 2800000, percentage: 3.4 },
        ];

        const totalGMV = gmvByMethod.reduce((sum, g) => sum + g.value, 0);

        return {
            gmv: totalGMV,
            totalRevenue,
            totalCost,
            netRevenue,
            margin: (netRevenue / totalRevenue) * 100,
            marginOnGMV: (netRevenue / totalGMV) * 100,
            revenueByType,
            costBreakdown,
            monthlyTrend,
            preChargebackData,
            gmvByMethod
        };
    }, [period, paymentMethod]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Resultados Financeiros"
                subtitle="Análise P&L completa da operação PagSmile"
                breadcrumbs={[
                    { label: 'Financeiro', page: 'AdminIntFinancialDashboard' },
                    { label: 'Resultados Financeiros' }
                ]}
                actions={
                    <div className="flex items-center gap-3">
                        <Select value={period} onValueChange={setPeriod}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Hoje</SelectItem>
                                <SelectItem value="week">Esta semana</SelectItem>
                                <SelectItem value="month">Este mês</SelectItem>
                                <SelectItem value="quarter">Este trimestre</SelectItem>
                                <SelectItem value="year">Este ano</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os métodos</SelectItem>
                                <SelectItem value="card">Cartão</SelectItem>
                                <SelectItem value="pix">Pix</SelectItem>
                                <SelectItem value="boleto">Boleto</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                }
            />

            {/* Main KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <KPICard
                    title="GMV Total"
                    value={formatCurrency(financialData.gmv)}
                    subtitle="Volume processado"
                    icon={DollarSign}
                    color="blue"
                    trend="up"
                    trendValue="+12.5%"
                />
                <KPICard
                    title="Receita Bruta"
                    value={formatCurrency(financialData.totalRevenue)}
                    subtitle="Todas as receitas"
                    icon={TrendingUp}
                    color="green"
                    trend="up"
                    trendValue="+8.3%"
                />
                <KPICard
                    title="Custos Totais"
                    value={formatCurrency(financialData.totalCost)}
                    subtitle="Parceiros + Operacional"
                    icon={TrendingDown}
                    color="red"
                    trend="up"
                    trendValue="+6.1%"
                />
                <KPICard
                    title="Receita Líquida"
                    value={formatCurrency(financialData.netRevenue)}
                    subtitle="Receita - Custos"
                    icon={PiggyBank}
                    color="emerald"
                    trend="up"
                    trendValue="+11.2%"
                    highlight
                />
                <KPICard
                    title="Margem Líquida"
                    value={formatPercent(financialData.margin)}
                    subtitle={`${formatPercent(financialData.marginOnGMV)} sobre GMV`}
                    icon={Percent}
                    color="purple"
                    trend="up"
                    trendValue="+0.5pp"
                />
            </div>

            {/* Revenue and Cost Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Breakdown de Receitas
                        </CardTitle>
                        <CardDescription>Composição das receitas por tipo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={financialData.revenueByType}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                    >
                                        {financialData.revenueByType.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {financialData.revenueByType.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-slate-600">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">{formatCurrency(item.value)}</span>
                                        <span className="text-slate-400">
                                            ({((item.value / financialData.totalRevenue) * 100).toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Cost Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <TrendingDown className="w-5 h-5 text-red-600" />
                            Breakdown de Custos
                        </CardTitle>
                        <CardDescription>Composição dos custos por categoria</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financialData.costBreakdown} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                    <XAxis type="number" tickFormatter={(v) => formatCurrency(v)} />
                                    <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500">Total de Custos</span>
                                <span className="text-lg font-bold text-red-600">{formatCurrency(financialData.totalCost)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pre-Chargeback Results */}
            <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <ShieldCheck className="w-5 h-5 text-orange-600" />
                        Resultado de Pré-Chargebacks (Alertas)
                    </CardTitle>
                    <CardDescription>Performance dos alertas Ethoca e Verifi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="text-xs text-slate-500">Alertas Recebidos</p>
                            <p className="text-xl font-bold">{financialData.preChargebackData.alertsReceived}</p>
                            <div className="flex gap-2 mt-1 text-xs text-slate-400">
                                <span>Ethoca: {financialData.preChargebackData.alertsEthoca}</span>
                                <span>|</span>
                                <span>Verifi: {financialData.preChargebackData.alertsVerifi}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="text-xs text-slate-500">Valor em Risco</p>
                            <p className="text-xl font-bold text-orange-600">{formatCurrency(financialData.preChargebackData.valueAtRisk)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="text-xs text-slate-500">Reembolsados</p>
                            <p className="text-xl font-bold text-green-600">{financialData.preChargebackData.reimbursed}</p>
                            <p className="text-xs text-green-600 mt-1">CBs evitados</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="text-xs text-slate-500">Valor Economizado</p>
                            <p className="text-xl font-bold text-green-600">{formatCurrency(financialData.preChargebackData.valueAvoided)}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg border">
                            <p className="text-xs text-slate-500">Custo dos Alertas</p>
                            <p className="text-xl font-bold text-red-600">{formatCurrency(financialData.preChargebackData.costOfAlerts)}</p>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-lg border border-emerald-200">
                            <p className="text-xs text-emerald-700">ROI Pré-Chargeback</p>
                            <p className="text-xl font-bold text-emerald-700">{formatPercent(financialData.preChargebackData.roi)}</p>
                            <p className="text-xs text-emerald-600 mt-1">Retorno sobre investimento</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Trend Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Evolução Mensal
                    </CardTitle>
                    <CardDescription>Receita, Custo e Margem ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={financialData.monthlyTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2bc196" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2bc196" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} domain={[40, 50]} />
                                <Tooltip 
                                    formatter={(value, name) => {
                                        if (name === 'margin') return [`${value.toFixed(1)}%`, 'Margem'];
                                        return [formatCurrency(value), name === 'revenue' ? 'Receita' : name === 'cost' ? 'Custo' : 'Líquido'];
                                    }}
                                />
                                <Legend />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#2bc196" fill="url(#colorRevenue)" name="Receita" />
                                <Area yAxisId="left" type="monotone" dataKey="cost" stroke="#ef4444" fill="url(#colorCost)" name="Custo" />
                                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6' }} name="Margem %" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* GMV by Method */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        Volume por Método de Pagamento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {financialData.gmvByMethod.map((method, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    {method.name.includes('Pix') ? (
                                        <QrCode className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <CreditCard className="w-5 h-5 text-blue-600" />
                                    )}
                                    <span className="text-sm font-medium">{method.name}</span>
                                </div>
                                <p className="text-xl font-bold">{formatCurrency(method.value)}</p>
                                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-[#2bc196] to-[#3b82f6]"
                                        style={{ width: `${method.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{method.percentage}% do total</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}