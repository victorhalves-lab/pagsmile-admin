import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Users, CheckCircle, AlertTriangle, DollarSign, Store, Activity, AlertCircle } from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { base44 } from '@/api/base44Client';

const InsightBanner = () => (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200 mb-1">
                    💡 INSIGHTS DO DIA SOBRE A BASE DE MERCHANTS
                </h3>
                <div className="space-y-1">
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                        Top 3 merchants cresceram 45% no TPV - considere upgrade taxas
                    </p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        5 merchants com ratio CB {'>'} 0.5% - monitorar proximidade VDMP
                    </p>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-blue-500" />
                        R$ 2.3M em saldo parado há {'>'} 7 dias - verificar liquidações
                    </p>
                </div>
            </div>
            <Button variant="outline" size="sm" className="bg-white dark:bg-slate-800 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                Ver Análise Completa
            </Button>
        </div>
    </div>
);

export default function AdminIntMerchants() {
    // Mock Data
    const dataDistribution = [
        { name: 'Ativo', value: 398, color: '#10B981' },
        { name: 'Inativo', value: 46, color: '#94A3B8' },
        { name: 'Suspenso', value: 8, color: '#F59E0B' },
        { name: 'Bloqueado', value: 4, color: '#EF4444' },
    ];

    const dataTopMerchants = [
        { name: 'Empresa A', value: 8500000 },
        { name: 'Empresa B', value: 6200000 },
        { name: 'Empresa C', value: 4800000 },
        { name: 'Empresa D', value: 3100000 },
        { name: 'Empresa E', value: 2900000 },
    ];

    const dataMCC = [
        { name: 'Supermercados', value: 45, color: '#3B82F6' },
        { name: 'Restaurantes', value: 38, color: '#8B5CF6' },
        { name: 'Varejo', value: 52, color: '#EC4899' },
        { name: 'Software', value: 68, color: '#10B981' },
        { name: 'Outros', value: 253, color: '#64748B' },
    ];

    const dataMargin = [
        { name: 'SaaS', value: 1.25 },
        { name: 'E-commerce', value: 0.95 },
        { name: 'Varejo', value: 0.78 },
        { name: 'Serviços', value: 1.10 },
        { name: 'Infoprod', value: 1.45 },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Merchants"
                subtitle="Dashboard de Clientes Ativos"
                breadcrumbs={[
                    { label: 'Admin Interno', page: 'AdminIntDashboard' },
                    { label: 'Merchants', page: 'AdminIntMerchants' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline">🗓️ Este mês</Button>
                        <Button variant="ghost" size="icon"><Activity className="w-4 h-4" /></Button>
                    </div>
                }
            />

            <InsightBanner />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <KPICard
                    title="Total Merchants"
                    value="456"
                    icon={Store}
                    className="bg-white dark:bg-slate-800"
                />
                <KPICard
                    title="Ativos Mês"
                    value="398"
                    change={5.2}
                    icon={CheckCircle}
                    trend="up"
                />
                <KPICard
                    title="Suspensos/Bloq"
                    value="12"
                    change={-2.1}
                    icon={AlertCircle}
                    trend="down"
                    prefix=""
                    suffix=""
                    className="border-l-4 border-l-red-500"
                />
                <KPICard
                    title="TPV Mês"
                    value="85M"
                    change={18}
                    prefix="R$ "
                    icon={DollarSign}
                    trend="up"
                />
                <KPICard
                    title="Receita Mês"
                    value="2.5M"
                    change={22}
                    prefix="R$ "
                    icon={DollarSign}
                    trend="up"
                />
                <KPICard
                    title="Novos Mês"
                    value="23"
                    suffix="/30"
                    icon={Users}
                    className="border-l-4 border-l-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição por Status</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {dataDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => [value, 'Merchants']}
                                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top 5 por TPV (Mês)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataTopMerchants} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value) => [`R$ ${(value/1000000).toFixed(1)}M`, 'TPV']}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" fill="#00D26A" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Distribuição por MCC</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataMCC}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    dataKey="value"
                                >
                                    {dataMCC.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Margem Média por Segmento (%)</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataMargin} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis unit="%" />
                                <Tooltip />
                                <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}