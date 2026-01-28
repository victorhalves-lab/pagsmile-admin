import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    TrendingUp, TrendingDown, DollarSign, CreditCard, Percent, Wallet, AlertTriangle,
    Clock, CheckCircle, XCircle, Mail, Settings, ArrowUpRight, ExternalLink
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

const formatCurrency = (value) => {
    if (value >= 1000000000) return `R$ ${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'slate', onClick }) => (
    <Card className={`cursor-pointer hover:shadow-md transition-shadow ${onClick ? 'hover:border-[#2bc196]' : ''}`} onClick={onClick}>
        <CardContent className="p-4">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-500 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                    {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
            </div>
            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{trendValue}</span>
                </div>
            )}
        </CardContent>
    </Card>
);

const AlertItem = ({ type, title, description, action, actionLink }) => {
    const config = {
        critical: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200' },
        warning: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200' },
        attention: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200' },
        info: { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200' },
    };
    const cfg = config[type] || config.info;
    const Icon = cfg.icon;

    return (
        <div className={`p-3 rounded-lg ${cfg.bg} border ${cfg.border}`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${cfg.color} mt-0.5`} />
                <div className="flex-1">
                    <p className={`font-medium text-sm ${cfg.color}`}>{title}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{description}</p>
                    {action && (
                        <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs">
                            {action} →
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const ActivityItem = ({ time, icon: Icon, color, title, subtitle }) => (
    <div className="flex items-start gap-3 py-2">
        <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="text-xs text-slate-400 whitespace-nowrap">{time}</span>
    </div>
);

export default function TabResumo({ merchant }) {
    const [period, setPeriod] = React.useState('month');

    const tpvData = [
        { name: 'Ago', value: 450000 },
        { name: 'Set', value: 520000 },
        { name: 'Out', value: 680000 },
        { name: 'Nov', value: 750000 },
        { name: 'Dez', value: 820000 },
        { name: 'Jan', value: merchant.tpv_month || 850000 },
    ];

    const alerts = [];
    if (merchant.cb_ratio > 0.8) {
        alerts.push({ type: 'critical', title: `CB Ratio próximo do limite (${merchant.cb_ratio}%)`, description: 'Limite: 1,0% | Ação: Monitorar', action: 'Ver detalhes' });
    }
    alerts.push({ type: 'attention', title: '3 documentos vencem em 15 dias', description: 'Ação: Solicitar atualização', action: 'Ver documentos' });
    if (Math.random() > 0.5) {
        alerts.push({ type: 'attention', title: 'Saque pendente há 2 dias', description: `Valor: ${formatCurrency(12000)} | Ação: Aprovar`, action: 'Aprovar saque' });
    }

    const activities = [
        { time: 'Hoje 14:32', icon: CreditCard, color: 'bg-green-500', title: 'Transação aprovada #TXN-12345', subtitle: 'R$ 299,00 - Visa 3x' },
        { time: 'Hoje 14:30', icon: CreditCard, color: 'bg-green-500', title: 'Transação aprovada #TXN-12344', subtitle: 'R$ 150,00 - PIX' },
        { time: 'Hoje 14:28', icon: XCircle, color: 'bg-red-500', title: 'Transação negada #TXN-12343', subtitle: 'R$ 500,00 - Mastercard' },
        { time: 'Hoje 10:15', icon: Wallet, color: 'bg-blue-500', title: 'Saque solicitado #SAQ-789', subtitle: 'R$ 12.000,00' },
        { time: 'Ontem 18:45', icon: Mail, color: 'bg-gray-500', title: 'E-mail enviado', subtitle: 'Atualização cadastral' },
        { time: 'Ontem 15:30', icon: Settings, color: 'bg-orange-500', title: 'Configuração alterada', subtitle: 'Taxa PIX (Admin: Carlos)' },
    ];

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    📊 Indicadores Principais
                </h3>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Hoje</SelectItem>
                        <SelectItem value="week">Últimos 7 dias</SelectItem>
                        <SelectItem value="month">Este mês</SelectItem>
                        <SelectItem value="last_month">Mês anterior</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <KPICard 
                    title="TPV" 
                    value={formatCurrency(merchant.tpv_month || 850000)}
                    icon={DollarSign}
                    color="green"
                    trend="up"
                    trendValue="+12%"
                />
                <KPICard 
                    title="Transações" 
                    value="1.234"
                    icon={CreditCard}
                    color="blue"
                    trend="up"
                    trendValue="+8%"
                />
                <KPICard 
                    title="Aprovação" 
                    value={`${merchant.approval_rate || 94.5}%`}
                    icon={Percent}
                    color="emerald"
                    trend="down"
                    trendValue="-0,5%"
                />
                <KPICard 
                    title="Saldo" 
                    value={formatCurrency(merchant.balance || 45678)}
                    icon={Wallet}
                    color="purple"
                />
                <KPICard 
                    title="CB Ratio" 
                    value={`${merchant.cb_ratio || 0.45}%`}
                    subtitle={merchant.cb_ratio > 0.8 ? '🟡 Atenção' : '🟢 OK'}
                    icon={AlertTriangle}
                    color={merchant.cb_ratio > 0.8 ? 'red' : 'slate'}
                />
            </div>

            {/* Alerts and Quick Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Alerts */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            ⚠️ Alertas e Pendências
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {alerts.length > 0 ? (
                            <>
                                {alerts.map((alert, idx) => (
                                    <AlertItem key={idx} {...alert} />
                                ))}
                                <Button variant="link" size="sm" className="p-0">Ver todos os alertas →</Button>
                            </>
                        ) : (
                            <p className="text-sm text-slate-500 text-center py-4">Nenhum alerta ativo</p>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            📋 Informações Rápidas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500">Status KYC</span>
                            <Badge variant="outline" className="text-green-600 border-green-200">✅ Aprovado</Badge>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500">Última transação</span>
                            <span className="text-sm font-medium">Há 2 horas</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500">Último saque</span>
                            <span className="text-sm font-medium">25/01/2026</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500">Conta bancária</span>
                            <Badge variant="outline" className="text-green-600 border-green-200">✅ Verificada</Badge>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500">Integração</span>
                            <span className="text-sm font-medium">API v2 ativa</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-sm text-slate-500">Webhook</span>
                            <Badge variant="outline" className="text-green-600 border-green-200">✅ Respondendo</Badge>
                        </div>
                        <div className="pt-2">
                            <p className="text-xs text-slate-400 mb-1">Contato principal:</p>
                            <p className="text-sm font-medium">João Silva - (11) 99999-1234</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 mb-1">Gerente de conta:</p>
                            <p className="text-sm font-medium">Maria Santos (Comercial)</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* TPV Chart */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        📈 Evolução do TPV (Últimos 6 meses)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={tpvData}>
                                <defs>
                                    <linearGradient id="colorTpv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2bc196" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2bc196" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`}
                                />
                                <Tooltip 
                                    formatter={(v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)}
                                    labelStyle={{ color: '#64748b' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#2bc196" 
                                    strokeWidth={2}
                                    fill="url(#colorTpv)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        🕐 Atividade Recente
                    </CardTitle>
                    <Button variant="link" size="sm">Ver mais →</Button>
                </CardHeader>
                <CardContent>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {activities.map((activity, idx) => (
                            <ActivityItem key={idx} {...activity} />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}