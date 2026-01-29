import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Mail, Send, Eye, MousePointer, AlertTriangle, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

const kpis = [
    { label: 'Enviados', value: '12.456', icon: Send, change: '+15%', changeType: 'up' },
    { label: 'Entregues', value: '12.180', subValue: '97,8%', icon: Mail, change: '+0,3pp', changeType: 'up' },
    { label: 'Abertos', value: '4.872', subValue: '40,0%', icon: Eye, change: '+2,1pp', changeType: 'up' },
    { label: 'Clicados', value: '1.218', subValue: '25,0%', icon: MousePointer, change: '-1,5pp', changeType: 'down' },
    { label: 'Bounces', value: '276', subValue: '2,2%', icon: AlertTriangle, change: '-0,5pp', changeType: 'down', isNegative: true },
];

const volumeData = [
    { week: 'Sem 1', value: 380 },
    { week: 'Sem 2', value: 420 },
    { week: 'Sem 3', value: 390 },
    { week: 'Sem 4', value: 450 },
];

const emailTypeData = [
    { name: 'Onboarding', value: 35, count: 4360, color: '#3B82F6' },
    { name: 'Transacional', value: 28, count: 3488, color: '#10B981' },
    { name: 'Financeiro', value: 22, count: 2740, color: '#8B5CF6' },
    { name: 'Risco/CB', value: 10, count: 1246, color: '#F59E0B' },
    { name: 'Sistema', value: 5, count: 622, color: '#6B7280' },
];

const topTemplates = [
    { name: 'KYC Aprovado', rate: 62.3 },
    { name: 'Boas-vindas', rate: 58.1 },
    { name: 'Saque Processado', rate: 55.8 },
    { name: 'Primeira Transação', rate: 51.2 },
    { name: 'Credenciais API', rate: 48.9 },
];

const problems = [
    { type: 'error', message: '156 bounces de domínio @empresa.com' },
    { type: 'warning', message: 'Email marketing@pagsmile.com com SPF' },
    { type: 'warning', message: '23 e-mails em fila há > 1h' },
];

const topAutomations = [
    { name: 'Boas-vindas (Cadastro)', sent: 1234, delivery: 98.2, open: 58.1, status: 'active' },
    { name: 'Lembrete KYC (3 dias)', sent: 456, delivery: 97.5, open: 42.3, status: 'active' },
    { name: 'KYC Aprovado', sent: 892, delivery: 99.1, open: 62.3, status: 'active' },
    { name: 'Merchant Ativado', sent: 756, delivery: 98.8, open: 55.2, status: 'active' },
    { name: 'Saque Processado', sent: 2345, delivery: 97.9, open: 55.8, status: 'active' },
];

export default function AdminIntCommDashboard() {
    const [period, setPeriod] = useState('30d');

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Dashboard de Comunicação"
                breadcrumbs={[{ label: 'Comunicação' }]}
                actions={
                    <Select value={period} onValueChange={setPeriod}>
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 dias</SelectItem>
                            <SelectItem value="30d">30 dias</SelectItem>
                            <SelectItem value="90d">90 dias</SelectItem>
                        </SelectContent>
                    </Select>
                }
            />

            {/* KPIs */}
            <div className="grid grid-cols-5 gap-4">
                {kpis.map((kpi, idx) => (
                    <Card key={idx}>
                        <CardContent className="pt-4">
                            <div className="flex items-center justify-between mb-2">
                                <kpi.icon className={`w-5 h-5 ${kpi.isNegative ? 'text-red-500' : 'text-blue-500'}`} />
                                <Badge className={`${kpi.changeType === 'up' && !kpi.isNegative ? 'bg-green-100 text-green-700' : kpi.changeType === 'down' && kpi.isNegative ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} border-0 text-xs`}>
                                    {kpi.changeType === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                    {kpi.change}
                                </Badge>
                            </div>
                            <p className="text-2xl font-bold">{kpi.value}</p>
                            {kpi.subValue && <p className="text-sm text-slate-500">{kpi.subValue}</p>}
                            <p className="text-xs text-slate-400 mt-1">{kpi.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Volume Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">📈 Volume de Envio (Últimos 30d)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={volumeData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="week" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Email Type Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">📧 Por Tipo de E-mail</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {emailTypeData.map((type, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-24 text-sm">{type.name}</div>
                                    <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full" 
                                            style={{ width: `${type.value}%`, backgroundColor: type.color }}
                                        />
                                    </div>
                                    <div className="w-24 text-sm text-right">{type.value}% ({type.count.toLocaleString()})</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Top Templates */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">🎯 Top 5 Templates (Abertura)</CardTitle>
                        <Link to={createPageUrl('AdminIntCommTemplates')}>
                            <Button variant="ghost" size="sm">Ver todos →</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {topTemplates.map((tpl, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                                    <span className="text-sm">{idx + 1}. {tpl.name}</span>
                                    <Badge className="bg-green-100 text-green-700 border-0">{tpl.rate}%</Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Problems */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">⚠️ Problemas Recentes</CardTitle>
                        <Link to={createPageUrl('AdminIntCommLogs')}>
                            <Button variant="ghost" size="sm">Ver todos →</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {problems.map((problem, idx) => (
                                <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg ${problem.type === 'error' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                                    <span>{problem.type === 'error' ? '🔴' : '🟡'}</span>
                                    <span className="text-sm">{problem.message}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Automations */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">📊 Automações Mais Ativas (Últimos 30 dias)</CardTitle>
                    <Link to={createPageUrl('AdminIntCommAutomations')}>
                        <Button variant="ghost" size="sm">Ver todas →</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-3">Automação</th>
                                <th className="text-right py-2 px-3">Enviados</th>
                                <th className="text-right py-2 px-3">Entrega</th>
                                <th className="text-right py-2 px-3">Abertura</th>
                                <th className="text-center py-2 px-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topAutomations.map((auto, idx) => (
                                <tr key={idx} className="border-b hover:bg-slate-50">
                                    <td className="py-3 px-3">{auto.name}</td>
                                    <td className="py-3 px-3 text-right">{auto.sent.toLocaleString()}</td>
                                    <td className="py-3 px-3 text-right">{auto.delivery}%</td>
                                    <td className="py-3 px-3 text-right">{auto.open}%</td>
                                    <td className="py-3 px-3 text-center">
                                        <Badge className="bg-green-100 text-green-700 border-0">✅ Ativa</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
}