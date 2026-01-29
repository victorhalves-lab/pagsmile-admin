import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles } from 'lucide-react';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(v);

const tpvEvolution = [
    { month: 'Fev', value: 18000000 },
    { month: 'Mar', value: 22000000 },
    { month: 'Abr', value: 25000000 },
    { month: 'Mai', value: 28000000 },
    { month: 'Jun', value: 32000000 },
    { month: 'Jul', value: 35000000 },
    { month: 'Ago', value: 38000000 },
    { month: 'Set', value: 42000000 },
    { month: 'Out', value: 44000000 },
    { month: 'Nov', value: 46000000 },
    { month: 'Dez', value: 47000000 },
    { month: 'Jan', value: 48500000 },
];

const methodsData = [
    { name: 'Crédito', value: 58, color: '#3B82F6' },
    { name: 'PIX', value: 25, color: '#10B981' },
    { name: 'Débito', value: 12, color: '#8B5CF6' },
    { name: 'Boleto', value: 5, color: '#F59E0B' },
];

const topMerchants = [
    { name: 'Loja do João', tpv: 4200000, pct: 8.7 },
    { name: 'Tech Store', tpv: 3800000, pct: 7.8 },
    { name: 'Moda Fashion', tpv: 3100000, pct: 6.4 },
    { name: 'Eletrônicos', tpv: 2900000, pct: 6.0 },
    { name: 'Casa & Jardim', tpv: 2500000, pct: 5.2 },
    { name: 'Pet Shop', tpv: 2200000, pct: 4.5 },
    { name: 'Esportes', tpv: 1900000, pct: 3.9 },
    { name: 'Beleza', tpv: 1700000, pct: 3.5 },
    { name: 'Livros', tpv: 1500000, pct: 3.1 },
    { name: 'Infantil', tpv: 1300000, pct: 2.7 },
];

const approvalByMethod = [
    { method: 'Crédito', rate: 91.2 },
    { method: 'Débito', rate: 94.5 },
    { method: 'PIX', rate: 99.2 },
    { method: 'Boleto', rate: 72.3 },
];

export default function AdminIntAnalytics() {
    const [period, setPeriod] = useState('30d');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Analytics e Business Intelligence"
                breadcrumbs={[{ label: 'Relatórios' }, { label: 'Analytics' }]}
            />

            <div className="flex items-center justify-between">
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">7 dias</SelectItem>
                        <SelectItem value="30d">30 dias</SelectItem>
                        <SelectItem value="90d">90 dias</SelectItem>
                        <SelectItem value="12m">12 meses</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="transactions">Transações</TabsTrigger>
                    <TabsTrigger value="merchants">Merchants</TabsTrigger>
                    <TabsTrigger value="risk">Risco</TabsTrigger>
                    <TabsTrigger value="trends">Tendências</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* TPV Evolution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">📈 Evolução do TPV (Últimos 12 meses)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={tpvEvolution}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(v) => formatCurrency(v)} />
                                        <Tooltip formatter={(v) => formatCurrency(v)} />
                                        <Area type="monotone" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-lg font-semibold">TPV atual: {formatCurrency(48500000)}</span>
                                <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> +12% vs mês anterior
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Methods Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">💳 Distribuição por Método</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={methodsData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name, value}) => `${name}: ${value}%`}>
                                                {methodsData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Merchants */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">🏪 Top 10 Merchants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 max-h-56 overflow-y-auto">
                                    {topMerchants.map((m, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-500 w-5">{idx + 1}.</span>
                                                <span className="font-medium">{m.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold">{formatCurrency(m.tpv)}</span>
                                                <Badge variant="outline" className="text-xs">{m.pct}%</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Approval Rate */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">📊 Taxa de Aprovação</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={approvalByMethod} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                            <YAxis type="category" dataKey="method" width={80} />
                                            <Tooltip formatter={(v) => `${v}%`} />
                                            <Bar dataKey="rate" fill="#10B981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <p className="text-center text-slate-500 mt-2">Média: <strong>92,3%</strong></p>
                            </CardContent>
                        </Card>

                        {/* Risk Indicators */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">🛡️ Indicadores de Risco</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <span>CB Ratio:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">0,45%</span>
                                            <Badge className="bg-green-100 text-green-700 border-0">🟢 OK</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <span>Fraud Rate:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">0,08%</span>
                                            <Badge className="bg-green-100 text-green-700 border-0">🟢 OK</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <span>MED Rate:</span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">0,02%</span>
                                            <Badge className="bg-green-100 text-green-700 border-0">🟢 OK</Badge>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 mt-4">
                                        <div className="text-center p-2 border rounded-lg">
                                            <p className="text-sm text-slate-500">Win Rate CB</p>
                                            <p className="text-xl font-bold">68%</p>
                                        </div>
                                        <div className="text-center p-2 border rounded-lg">
                                            <p className="text-sm text-slate-500">Win Rate MED</p>
                                            <p className="text-xl font-bold">72%</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 text-center">Merchants em alerta: <strong>3</strong></p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Predictions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500" /> Previsões e Tendências
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-slate-500 mb-1">TPV previsto (próx. 30d)</p>
                                    <p className="text-xl font-bold text-blue-700">{formatCurrency(52000000)}</p>
                                    <Badge className="bg-green-100 text-green-700 border-0 mt-2">+7,2%</Badge>
                                </div>
                                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                    <p className="text-sm text-slate-500 mb-1">Novos merchants estimados</p>
                                    <p className="text-xl font-bold text-purple-700">15-20</p>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-slate-500 mb-1">CB Ratio esperado</p>
                                    <p className="text-xl font-bold text-green-700">0,42%</p>
                                    <Badge className="bg-green-100 text-green-700 border-0 mt-2 flex items-center gap-1 w-fit">
                                        <TrendingDown className="w-3 h-3" /> tendência de queda
                                    </Badge>
                                </div>
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-amber-800">Atenção</p>
                                    <p className="text-sm text-amber-700">Sazonalidade de Carnaval pode aumentar fraudes em 15%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transactions">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Dashboard de transações detalhado</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="merchants">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Dashboard de análise de merchants</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="risk">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Dashboard de análise de risco</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-slate-500">Dashboard de análise preditiva</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}