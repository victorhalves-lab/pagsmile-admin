import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { Activity, DollarSign, CreditCard, AlertTriangle, TrendingUp, Filter, RefreshCw, Smartphone } from 'lucide-react';

const InsightBanner = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    💡 INSIGHTS DO DIA
                </h3>
                <div className="space-y-1">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        TPV 18% acima da média para este horário - tendência positiva
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Taxa de recusa do BIN 4111XX subiu 15% - verificar emissor
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-indigo-500" />
                        Ticket médio aumentou 8% vs ontem
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default function AdminIntTransactionsDashboard() {
    const hourlyData = [
        { hour: '00', value: 120 }, { hour: '04', value: 80 }, { hour: '08', value: 450 },
        { hour: '12', value: 1200 }, { hour: '16', value: 1500 }, { hour: '20', value: 900 },
        { hour: '23', value: 300 }
    ];

    const methodsData = [
        { name: 'Cartão', value: 68, color: '#3B82F6' },
        { name: 'Pix', value: 32, color: '#10B981' }
    ];

    const approvalData = [
        { name: 'Visa', value: 89 },
        { name: 'Mastercard', value: 88 },
        { name: 'Elo', value: 85 },
        { name: 'Amex', value: 82 },
        { name: 'Pix', value: 98 }
    ];

    const declineReasons = [
        { name: 'Saldo Insuficiente', value: 35 },
        { name: 'Cartão Inválido', value: 18 },
        { name: 'Senha Incorreta', value: 12 },
        { name: 'Fraude', value: 8 },
        { name: 'Limite', value: 7 }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Dashboard de Transações"
                subtitle="Visão em Tempo Real do Processamento"
                breadcrumbs={[
                    { label: 'Financeiro', page: '#' },
                    { label: 'Dashboard', page: 'AdminIntTransactionsDashboard' }
                ]}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">🗓️ Hoje</Button>
                        <Button variant="ghost" size="icon"><RefreshCw className="w-4 h-4" /></Button>
                    </div>
                }
            />

            <InsightBanner />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <KPICard title="TPV Hoje" value="2.8M" prefix="R$ " change={18} trend="up" icon={DollarSign} />
                <KPICard title="Transações" value="18.5k" change={12} trend="up" icon={Activity} />
                <KPICard title="Aprovação" value="87.3" suffix="%" change={0.5} trend="up" icon={CreditCard} />
                <KPICard title="Recusadas" value="2.4k" suffix="" change={-2} trend="down" className="border-l-4 border-l-red-500" icon={AlertTriangle} />
                <KPICard title="Estornos" value="125" change={5} trend="up" className="border-l-4 border-l-purple-500" icon={RefreshCw} />
                <KPICard title="Ticket Médio" value="151" prefix="R$ " change={8} trend="up" icon={DollarSign} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Transações por Hora</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="hour" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Mix de Métodos</CardTitle></CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={methodsData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {methodsData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 pl-4 space-y-4">
                            <div>
                                <h4 className="text-sm font-semibold flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-500" /> Cartão</h4>
                                <div className="text-xs text-slate-500 mt-1">
                                    Visa: 45% • MC: 38% • Outros: 17%
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold flex items-center gap-2"><Smartphone className="w-4 h-4 text-green-500" /> Pix</h4>
                                <div className="text-xs text-slate-500 mt-1">
                                    Conversão: 92% (Excelente)
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Aprovação por Bandeira (%)</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={approvalData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#64748B', fontSize: 12 }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Top Motivos de Recusa</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={declineReasons} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={20} label={{ position: 'right', fill: '#64748B', fontSize: 12, formatter: (val) => `${val}%` }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}