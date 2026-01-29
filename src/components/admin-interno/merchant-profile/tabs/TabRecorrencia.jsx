import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Eye, Repeat } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const statusConfig = {
    active: { label: 'Ativa', color: 'bg-green-100 text-green-700 border-green-200', icon: '🟢' },
    trial: { label: 'Trial', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🔵' },
    due: { label: 'Vencendo', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '🟡' },
    overdue: { label: 'Inadimplente', color: 'bg-red-100 text-red-700 border-red-200', icon: '🔴' },
    paused: { label: 'Pausada', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🟠' },
    cancelled: { label: 'Cancelada', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '⚫' },
};

export default function TabRecorrencia({ merchant }) {
    const stats = { active: 234, mrr: 45600, churn: 2.3, overdue: 5, dueNext7d: 89 };

    const subscriptions = [
        { id: 'SUB-001', customer: 'João Silva', plan: 'Premium', amount: 99.90, nextCharge: '2026-02-01', status: 'active' },
        { id: 'SUB-002', customer: 'Maria Santos', plan: 'Básico', amount: 29.90, nextCharge: '2026-02-03', status: 'active' },
        { id: 'SUB-003', customer: 'Carlos Oliveira', plan: 'Pro', amount: 199.90, nextCharge: '2026-01-28', status: 'due' },
        { id: 'SUB-004', customer: 'Ana Paula', plan: 'Premium', amount: 99.90, nextCharge: '2026-01-15', status: 'overdue' },
        { id: 'SUB-005', customer: 'Pedro Souza', plan: 'Básico', amount: 29.90, nextCharge: '-', status: 'cancelled' },
    ];

    const plans = [
        { name: 'Básico', amount: 29.90, frequency: 'Mensal', subscribers: 120, status: 'active' },
        { name: 'Premium', amount: 99.90, frequency: 'Mensal', subscribers: 89, status: 'active' },
        { name: 'Pro', amount: 199.90, frequency: 'Mensal', subscribers: 25, status: 'active' },
        { name: 'Anual', amount: 999.00, frequency: 'Anual', subscribers: 15, status: 'active' },
    ];

    const mrrData = [
        { month: 'Ago', mrr: 20000 },
        { month: 'Set', mrr: 25000 },
        { month: 'Out', mrr: 30000 },
        { month: 'Nov', mrr: 35000 },
        { month: 'Dez', mrr: 40000 },
        { month: 'Jan', mrr: stats.mrr },
    ];

    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Ativas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">MRR</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(stats.mrr)}</p>
                </div>
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Churn (30d)</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.churn}%</p>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Inadimplentes</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                    <p className="text-sm text-slate-500 mb-1">Próx. 7 dias</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.dueNext7d}</p>
                </div>
            </div>

            {/* MRR Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📈 Evolução do MRR (Últimos 6 meses)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mrrData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
                                <Tooltip formatter={(v) => formatCurrency(v)} />
                                <Line type="monotone" dataKey="mrr" stroke="#2bc196" strokeWidth={2} dot={{ fill: '#2bc196', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-3">
                        <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Ativas</SelectItem>
                                <SelectItem value="overdue">Inadimplentes</SelectItem>
                                <SelectItem value="cancelled">Canceladas</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select><SelectTrigger className="w-[140px]"><SelectValue placeholder="Plano" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {plans.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Button variant="outline" className="ml-auto"><Download className="w-4 h-4 mr-1" /> Exportar</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Subscriptions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Assinaturas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Cliente</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Plano</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Próx. Cobrança</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subscriptions.map(sub => {
                                    const status = statusConfig[sub.status];
                                    return (
                                        <tr key={sub.id} className="border-b hover:bg-slate-50">
                                            <td className="py-3 px-3 font-mono text-xs">{sub.id}</td>
                                            <td className="py-3 px-3">{sub.customer}</td>
                                            <td className="py-3 px-3">{sub.plan}</td>
                                            <td className="py-3 px-3 text-right font-medium">{formatCurrency(sub.amount)}</td>
                                            <td className="py-3 px-3">{sub.nextCharge !== '-' ? new Date(sub.nextCharge).toLocaleDateString('pt-BR') : '-'}</td>
                                            <td className="py-3 px-3">
                                                <Badge className={`${status.color} border`}>{status.icon} {status.label}</Badge>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Plans */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Planos Configurados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Plano</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Frequência</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Assinantes</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {plans.map((plan, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3 font-medium">{plan.name}</td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(plan.amount)}</td>
                                        <td className="py-3 px-3">{plan.frequency}</td>
                                        <td className="py-3 px-3 text-center font-medium">{plan.subscribers}</td>
                                        <td className="py-3 px-3">
                                            <Badge className="bg-green-100 text-green-700 border-0">✅ Ativo</Badge>
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