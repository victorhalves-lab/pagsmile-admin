import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Eye, FileText, Settings, Lock, XCircle, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { toast } from 'sonner';

const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

const getRiskColor = (score) => {
    if (score >= 70) return { bg: 'bg-green-100', text: 'text-green-600', label: 'BAIXO RISCO', color: '#22c55e' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-600', label: 'MÉDIO RISCO', color: '#eab308' };
    return { bg: 'bg-red-100', text: 'text-red-600', label: 'ALTO RISCO', color: '#ef4444' };
};

const getCBRatioColor = (ratio) => {
    if (ratio < 0.5) return 'text-green-600';
    if (ratio < 0.8) return 'text-yellow-600';
    return 'text-red-600';
};

export default function TabRisco({ merchant }) {
    const [period, setPeriod] = React.useState('30d');
    
    const riskScore = 72;
    const cbRatio = merchant.cb_ratio || 0.45;
    const riskConfig = getRiskColor(riskScore);

    const cbRatioData = [
        { month: 'Ago', ratio: 0.32 },
        { month: 'Set', ratio: 0.35 },
        { month: 'Out', ratio: 0.58 },
        { month: 'Nov', ratio: 0.62 },
        { month: 'Dez', ratio: 0.48 },
        { month: 'Jan', ratio: cbRatio },
    ];

    const chargebacks = [
        { id: 'CB-12345', date: '27/01/2026', amount: 299, reason: 'Não reconhecida', status: 'open' },
        { id: 'CB-12344', date: '25/01/2026', amount: 150, reason: 'Produto não recebido', status: 'open' },
        { id: 'CB-12343', date: '20/01/2026', amount: 500, reason: 'Fraude', status: 'lost' },
        { id: 'CB-12342', date: '15/01/2026', amount: 89.90, reason: 'Não reconhecida', status: 'won' },
        { id: 'CB-12341', date: '10/01/2026', amount: 199, reason: 'Cancelamento', status: 'won' },
    ];

    const alerts = [
        { 
            type: 'attention',
            title: 'Aumento de 50% no volume de transações nos últimos 7 dias',
            detected: '26/01/2026',
            action: 'Monitorar comportamento'
        },
        { 
            type: 'attention',
            title: '2 chargebacks recebidos esta semana (acima da média)',
            detected: '27/01/2026',
            action: 'Verificar transações contestadas'
        },
    ];

    const riskFactors = [
        { name: 'Chargeback Ratio: 0,45%', weight: 40, points: 32 },
        { name: 'Tempo de operação: 10 meses', weight: 20, points: 15 },
        { name: 'Volume consistente: Sim', weight: 15, points: 12 },
        { name: 'KYC completo: Sim', weight: 15, points: 12 },
        { name: 'Histórico de fraudes: Nenhum', weight: 10, points: 10 },
    ];

    return (
        <div className="space-y-6">
            {/* Risk Score */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        🎯 Score de Risco do Merchant
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">SCORE</p>
                                <p className="text-5xl font-bold">{riskScore} <span className="text-2xl text-slate-400">/ 100</span></p>
                            </div>
                            <div className="text-right">
                                <Badge className={`${riskConfig.bg} ${riskConfig.text} border-0 text-base px-4 py-1`}>
                                    {riskConfig.label}
                                </Badge>
                                <p className="text-xs text-slate-500 mt-2">Última atualização: 28/01/2026 14:00</p>
                            </div>
                        </div>
                        
                        <div className="relative pt-2">
                            <Progress value={riskScore} className="h-3" />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>0<br/>Alto Risco</span>
                                <span>50<br/>Médio Risco</span>
                                <span>100<br/>Baixo Risco</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-3">Fatores que compõem o score:</h4>
                        <div className="space-y-2">
                            {riskFactors.map((factor, idx) => (
                                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">• {factor.name} <span className="text-slate-400">(peso {factor.weight}%)</span></span>
                                    <span className="font-medium text-green-600">+{factor.points} pontos</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Risk Metrics */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">📊 Métricas de Risco</h3>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Últimos 7 dias</SelectItem>
                        <SelectItem value="30d">Últimos 30 dias</SelectItem>
                        <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`p-4 border rounded-lg ${cbRatio > 0.8 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <p className="text-sm text-slate-500 mb-1">CB Ratio</p>
                    <p className={`text-2xl font-bold ${getCBRatioColor(cbRatio)}`}>{cbRatio}%</p>
                    <p className="text-xs text-slate-500 mt-1">{cbRatio > 0.8 ? '🔴 Alerta' : '🟢 OK'} (limite 1%)</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Chargebacks</p>
                    <p className="text-2xl font-bold text-orange-600">5</p>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(1245)}</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Fraudes</p>
                    <p className="text-2xl font-bold text-red-600">0</p>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(0)}</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Estornos</p>
                    <p className="text-2xl font-bold text-purple-600">12</p>
                    <p className="text-xs text-slate-500 mt-1">{formatCurrency(2890)} (0,9%)</p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Alertas</p>
                    <p className="text-2xl font-bold text-yellow-600">2</p>
                    <p className="text-xs text-slate-500 mt-1">🟡 Atenção</p>
                </div>
            </div>

            {/* Active Alerts */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        ⚠️ Alertas Ativos
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {alerts.map((alert, idx) => (
                        <div key={idx} className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-yellow-800 dark:text-yellow-400">{alert.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Detectado em: {alert.detected}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Ação recomendada: {alert.action}</p>
                                    <div className="flex gap-2 mt-3">
                                        <Button variant="outline" size="sm" onClick={() => toast.success('Alerta dispensado')}>Dispensar</Button>
                                        <Button size="sm">Investigar</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* CB Ratio Evolution */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        📈 Evolução do Chargeback Ratio (Últimos 6 meses)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={cbRatioData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis 
                                    domain={[0, 1.2]} 
                                    tickFormatter={(v) => `${v.toFixed(1)}%`}
                                />
                                <Tooltip 
                                    formatter={(v) => `${v.toFixed(2)}%`}
                                    labelStyle={{ color: '#64748b' }}
                                />
                                <ReferenceLine y={1.0} stroke="#ef4444" strokeDasharray="5 5" label="Limite" />
                                <Line type="monotone" dataKey="ratio" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Chargebacks */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        💳 Chargebacks Recentes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">ID</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Data</th>
                                    <th className="text-right py-2 px-3 font-medium text-slate-500">Valor</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Motivo</th>
                                    <th className="text-left py-2 px-3 font-medium text-slate-500">Status</th>
                                    <th className="text-center py-2 px-3 font-medium text-slate-500">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chargebacks.map(cb => (
                                    <tr key={cb.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="py-3 px-3 font-mono text-xs">{cb.id}</td>
                                        <td className="py-3 px-3">{cb.date}</td>
                                        <td className="py-3 px-3 text-right font-medium">{formatCurrency(cb.amount)}</td>
                                        <td className="py-3 px-3">{cb.reason}</td>
                                        <td className="py-3 px-3">
                                            {cb.status === 'open' && <Badge variant="outline" className="text-yellow-600 border-yellow-200">🟡 Aberto</Badge>}
                                            {cb.status === 'lost' && <Badge variant="outline" className="text-red-600 border-red-200">🔴 Perdido</Badge>}
                                            {cb.status === 'won' && <Badge variant="outline" className="text-green-600 border-green-200">🟢 Ganho</Badge>}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Button variant="link" size="sm" className="mt-3">Ver todos os chargebacks →</Button>
                </CardContent>
            </Card>

            {/* Risk Actions */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        ⚡ Ações de Risco
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <Button variant="outline" className="justify-start">
                            <Shield className="w-4 h-4 mr-2" /> Análise Completa
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <FileText className="w-4 h-4 mr-2" /> Relatório de Risco
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <Settings className="w-4 h-4 mr-2" /> Configurar Alertas
                        </Button>
                        <Button variant="outline" className="justify-start text-red-600 border-red-200 hover:bg-red-50">
                            <XCircle className="w-4 h-4 mr-2" /> Suspender por Risco
                        </Button>
                        <Button variant="outline" className="justify-start text-orange-600 border-orange-200 hover:bg-orange-50">
                            <Lock className="w-4 h-4 mr-2" /> Aumentar Retenção
                        </Button>
                        <Button variant="outline" className="justify-start">
                            <FileText className="w-4 h-4 mr-2" /> Solicitar Documentos
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}