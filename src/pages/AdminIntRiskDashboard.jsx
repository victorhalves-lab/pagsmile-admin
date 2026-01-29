import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, TrendingUp, TrendingDown, Shield, CreditCard, Banknote, Eye, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

const cbRatioData = [
    { month: 'Ago', value: 0.42 },
    { month: 'Set', value: 0.55 },
    { month: 'Out', value: 0.78 },
    { month: 'Nov', value: 0.65 },
    { month: 'Dez', value: 0.52 },
    { month: 'Jan', value: 0.45 },
];

const criticalAlerts = [
    { type: 'error', message: 'CB Ratio da Loja do João atingiu 0,95% (limite: 1%)', time: 'há 2 horas' },
    { type: 'error', message: 'Aumento de 150% em negações no merchant Tech Store', time: 'há 4 horas' },
    { type: 'warning', message: '5 MEDs pendentes de resposta com prazo < 3 dias', time: 'há 1 dia' },
];

const topMerchantsByCB = [
    { name: 'Loja do João', cbRatio: 0.95, cbs: 12, tpv: 126000, status: 'alert' },
    { name: 'Tech Store', cbRatio: 0.78, cbs: 8, tpv: 89000, status: 'attention' },
    { name: 'Moda Fashion', cbRatio: 0.65, cbs: 5, tpv: 45000, status: 'attention' },
    { name: 'Eletrônicos Plus', cbRatio: 0.52, cbs: 4, tpv: 67000, status: 'ok' },
    { name: 'Casa & Jardim', cbRatio: 0.48, cbs: 3, tpv: 34000, status: 'ok' },
];

export default function AdminIntRiskDashboard() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Dashboard de Risco"
                breadcrumbs={[{ label: 'Risco e Compliance' }, { label: 'Dashboard' }]}
                actionElement={
                    <Select defaultValue="30d">
                        <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7d">7 dias</SelectItem>
                            <SelectItem value="30d">30 dias</SelectItem>
                            <SelectItem value="90d">90 dias</SelectItem>
                        </SelectContent>
                    </Select>
                }
            />

            {/* Critical Alerts */}
            <Card className="border-red-200 bg-red-50/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        Alertas Críticos ({criticalAlerts.length})
                    </CardTitle>
                    <Link to={createPageUrl('AdminIntRiskAlerts')}>
                        <Button variant="ghost" size="sm">Ver todos <ChevronRight className="w-4 h-4 ml-1" /></Button>
                    </Link>
                </CardHeader>
                <CardContent className="space-y-2">
                    {criticalAlerts.map((alert, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-3 rounded-lg ${alert.type === 'error' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                            <div className="flex items-center gap-2">
                                <span className={`text-lg ${alert.type === 'error' ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {alert.type === 'error' ? '🔴' : '🟡'}
                                </span>
                                <span className="text-sm">{alert.message}</span>
                            </div>
                            <span className="text-xs text-slate-500">{alert.time}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Main KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="border-green-200">
                    <CardContent className="pt-4">
                        <p className="text-xs text-slate-500 mb-1">CB Ratio</p>
                        <p className="text-2xl font-bold">0,45%</p>
                        <div className="flex items-center justify-between mt-1">
                            <Badge className="bg-green-100 text-green-700 border-0">🟢 OK</Badge>
                            <span className="text-xs text-slate-500">Meta: &lt;1%</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                            <TrendingDown className="w-3 h-3" /> -0,05pp
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200">
                    <CardContent className="pt-4">
                        <p className="text-xs text-slate-500 mb-1">Fraud Rate</p>
                        <p className="text-2xl font-bold">0,08%</p>
                        <div className="flex items-center justify-between mt-1">
                            <Badge className="bg-green-100 text-green-700 border-0">🟢 OK</Badge>
                            <span className="text-xs text-slate-500">Meta: &lt;0,1%</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                            → 0,00pp
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200">
                    <CardContent className="pt-4">
                        <p className="text-xs text-slate-500 mb-1">MED Rate</p>
                        <p className="text-2xl font-bold">0,02%</p>
                        <div className="flex items-center justify-between mt-1">
                            <Badge className="bg-green-100 text-green-700 border-0">🟢 OK</Badge>
                            <span className="text-xs text-slate-500">Meta: &lt;0,1%</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                            <TrendingUp className="w-3 h-3" /> +0,01pp
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-green-200">
                    <CardContent className="pt-4">
                        <p className="text-xs text-slate-500 mb-1">Aprovação</p>
                        <p className="text-2xl font-bold">92,3%</p>
                        <div className="flex items-center justify-between mt-1">
                            <Badge className="bg-green-100 text-green-700 border-0">🟢 Bom</Badge>
                            <span className="text-xs text-slate-500">Meta: &gt;90%</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                            <TrendingUp className="w-3 h-3" /> +1,2pp
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-4">
                        <p className="text-xs text-slate-500 mb-1">Negação</p>
                        <p className="text-2xl font-bold">7,7%</p>
                        <div className="flex items-center justify-between mt-1">
                            <Badge className="bg-slate-100 text-slate-700 border-0">Normal</Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CB Ratio Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📈 Evolução do CB Ratio (Últimos 6 meses)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={cbRatioData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 1.2]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 12 }} />
                            <Tooltip formatter={(v) => `${v}%`} />
                            <ReferenceLine y={1} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'Limite 1%', fill: '#ef4444', fontSize: 10 }} />
                            <Line type="monotone" dataKey="value" stroke="#2bc196" strokeWidth={2} dot={{ fill: '#2bc196' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chargebacks */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Chargebacks
                        </CardTitle>
                        <Link to={createPageUrl('AdminIntChargebacksList')}>
                            <Button variant="ghost" size="sm">Ver chargebacks <ChevronRight className="w-4 h-4 ml-1" /></Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Abertos:</span><span className="font-medium">15 ({formatCurrency(4500)})</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Em defesa:</span><span className="font-medium">23 ({formatCurrency(7800)})</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Este mês:</span><span className="font-medium">45 ({formatCurrency(12300)})</span></div>
                        <div className="flex justify-between pt-2 border-t"><span className="text-sm text-slate-500">Win rate (90d):</span><span className="font-bold text-green-600">68%</span></div>
                    </CardContent>
                </Card>

                {/* MEDs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Banknote className="w-5 h-5" /> MEDs (PIX)
                        </CardTitle>
                        <Link to={createPageUrl('AdminIntMEDsList')}>
                            <Button variant="ghost" size="sm">Ver MEDs <ChevronRight className="w-4 h-4 ml-1" /></Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Abertos:</span><span className="font-medium">8 ({formatCurrency(2100)})</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Em contestação:</span><span className="font-medium">5 ({formatCurrency(1500)})</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Este mês:</span><span className="font-medium">18 ({formatCurrency(4200)})</span></div>
                        <div className="flex justify-between pt-2 border-t"><span className="text-sm text-slate-500">Win rate (90d):</span><span className="font-bold text-green-600">72%</span></div>
                    </CardContent>
                </Card>

                {/* Frauds */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Shield className="w-5 h-5" /> Fraudes Detectadas
                        </CardTitle>
                        <Link to={createPageUrl('AdminIntFraudMonitoring')}>
                            <Button variant="ghost" size="sm">Ver fraudes <ChevronRight className="w-4 h-4 ml-1" /></Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Hoje:</span><span className="font-medium">12 ({formatCurrency(3400)})</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Esta semana:</span><span className="font-medium">45 ({formatCurrency(15200)})</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">Este mês:</span><span className="font-medium">156 ({formatCurrency(48900)})</span></div>
                        <div className="flex justify-between pt-2 border-t"><span className="text-sm text-slate-500">Bloqueadas:</span><span className="font-bold text-green-600">89% das tentativas</span></div>
                    </CardContent>
                </Card>

                {/* Merchants at Risk */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Eye className="w-5 h-5" /> Merchants em Risco
                        </CardTitle>
                        <Link to={createPageUrl('AdminIntMerchantsList')}>
                            <Button variant="ghost" size="sm">Ver merchants <ChevronRight className="w-4 h-4 ml-1" /></Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between"><span className="text-sm text-slate-500">🔴 Alto risco:</span><span className="font-bold text-red-600">3</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">🟡 Médio risco:</span><span className="font-bold text-yellow-600">8</span></div>
                        <div className="flex justify-between"><span className="text-sm text-slate-500">🟢 Baixo risco:</span><span className="font-bold text-green-600">234</span></div>
                        <div className="flex justify-between pt-2 border-t"><span className="text-sm text-slate-500">Em monitoramento:</span><span className="font-medium">15</span></div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Merchants by CB */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">📋 Top 5 Merchants por CB Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-2 px-3">#</th>
                                    <th className="text-left py-2 px-3">Merchant</th>
                                    <th className="text-right py-2 px-3">CB Ratio</th>
                                    <th className="text-right py-2 px-3">CBs/mês</th>
                                    <th className="text-right py-2 px-3">TPV/mês</th>
                                    <th className="text-left py-2 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topMerchantsByCB.map((m, idx) => (
                                    <tr key={idx} className="border-b hover:bg-slate-50">
                                        <td className="py-3 px-3">{idx + 1}</td>
                                        <td className="py-3 px-3 font-medium">{m.name}</td>
                                        <td className="py-3 px-3 text-right font-bold">{m.cbRatio}%</td>
                                        <td className="py-3 px-3 text-right">{m.cbs}</td>
                                        <td className="py-3 px-3 text-right">{formatCurrency(m.tpv)}</td>
                                        <td className="py-3 px-3">
                                            <Badge className={`border-0 ${
                                                m.status === 'alert' ? 'bg-red-100 text-red-700' :
                                                m.status === 'attention' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {m.status === 'alert' ? '🔴 Alerta' : m.status === 'attention' ? '🟡 Atenção' : '🟢 OK'}
                                            </Badge>
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