import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
    ShieldAlert, Users, AlertTriangle, Eye, Zap, AlertCircle, TrendingUp, TrendingDown,
    ArrowUpRight, ArrowDownRight, Shield, CreditCard, Building2, ChevronRight, Sparkles,
    Clock, CheckCircle2, XCircle, RefreshCw, FileText, Ban
} from 'lucide-react';
import { cn } from '@/lib/utils';

const KPICard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = "emerald", alert }) => {
    const colorClasses = {
        emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-800" },
        blue: { bg: "bg-blue-50 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400", border: "border-blue-100 dark:border-blue-800" },
        red: { bg: "bg-red-50 dark:bg-red-900/20", icon: "text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-800" },
        amber: { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-100 dark:border-amber-800" },
        purple: { bg: "bg-purple-50 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800" },
    };
    const colors = colorClasses[color];

    return (
        <div className={cn("p-4 rounded-xl border bg-white dark:bg-slate-900", colors.border, alert && "ring-2 ring-red-500/20")}>
            <div className="flex items-start justify-between mb-2">
                <div className={cn("p-2 rounded-lg", colors.bg)}>
                    <Icon className={cn("w-4 h-4", colors.icon)} />
                </div>
                {trend && (
                    <div className={cn("flex items-center gap-0.5 text-xs font-medium", trend === 'up' ? 'text-red-500' : 'text-emerald-600')}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">{title}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
            {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
    );
};

const RiskGauge = ({ value, label, limit, sublabel }) => {
    const percentage = Math.min((value / limit) * 100, 100);
    const isAlert = value > limit * 0.8;
    const isWarning = value > limit * 0.6;
    const gaugeColor = isAlert ? '#EF4444' : isWarning ? '#F59E0B' : '#10B981';
    
    return (
        <div className="flex flex-col items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[10px] font-semibold text-slate-500 uppercase mb-3">{label}</span>
            <div className="relative w-28 h-14">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#E2E8F0" strokeWidth="8" strokeLinecap="round" />
                    <path 
                        d="M 10 50 A 40 40 0 0 1 90 50" 
                        fill="none" 
                        stroke={gaugeColor} 
                        strokeWidth="8" 
                        strokeLinecap="round"
                        strokeDasharray={`${percentage * 1.26} 126`}
                        className="transition-all duration-500"
                    />
                </svg>
            </div>
            <div className="mt-1 text-center">
                <span className={cn("text-xl font-bold", isAlert ? "text-red-600" : isWarning ? "text-amber-600" : "text-emerald-600")}>{value}%</span>
                <span className="text-[10px] text-slate-400 block">Limite: {limit}%</span>
            </div>
            {sublabel && <span className="text-[10px] text-slate-500 mt-1">{sublabel}</span>}
        </div>
    );
};

export default function AdminIntRisk() {
    const riskTrend = [
        { month: 'Ago', visa: 0.30, mc: 0.25 }, { month: 'Set', visa: 0.35, mc: 0.28 }, 
        { month: 'Out', visa: 0.42, mc: 0.32 }, { month: 'Nov', visa: 0.55, mc: 0.40 }, 
        { month: 'Dez', visa: 0.70, mc: 0.52 }, { month: 'Jan', visa: 0.85, mc: 0.62 }
    ];

    const riskDistribution = [
        { name: 'Baixo', value: 412, color: '#10B981' },
        { name: 'Moderado', value: 28, color: '#F59E0B' },
        { name: 'Alerta', value: 8, color: '#F97316' },
        { name: 'Crítico', value: 5, color: '#EF4444' },
        { name: 'Em Programa', value: 2, color: '#111827' }
    ];

    const alertMerchants = [
        { name: 'Loja XYZ', ratio: 0.85, brand: 'Visa', trend: 'up', status: 'critical' },
        { name: 'Tech Store', ratio: 0.72, brand: 'Visa', trend: 'up', status: 'alert' },
        { name: 'Fashion Hub', ratio: 0.58, brand: 'Mastercard', trend: 'stable', status: 'warning' },
    ];

    return (
        <div className="space-y-5 min-h-screen">
            <PageHeader 
                title="Risco & Antifraude"
                subtitle="Monitoramento de chargebacks e prevenção a fraudes"
                breadcrumbs={[{ label: 'Risco' }]}
                actions={
                    <div className="flex items-center gap-2">
                        <Link to={createPageUrl('AdminIntChargebacksList')}>
                            <Button variant="outline" size="sm" className="gap-1.5">
                                <FileText className="w-4 h-4" /> Chargebacks
                            </Button>
                        </Link>
                        <Button size="sm" className="gap-1.5 bg-[#2bc196] hover:bg-[#239b7a]">
                            <RefreshCw className="w-4 h-4" /> Atualizar
                        </Button>
                    </div>
                }
            />

            {/* Alert Banner */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800">
                <CardContent className="py-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm text-red-900 dark:text-red-200">Alertas Críticos</h3>
                            <p className="text-xs text-red-700 dark:text-red-300">Ação imediata requerida</p>
                        </div>
                        <Badge className="ml-auto bg-red-600 text-white">3 alertas</Badge>
                    </div>
                    <div className="space-y-2">
                        {alertMerchants.map((m, i) => (
                            <div key={i} className={cn(
                                "flex items-center justify-between p-2.5 rounded-lg border",
                                m.status === 'critical' ? "bg-red-100/50 border-red-200" : 
                                m.status === 'alert' ? "bg-orange-100/50 border-orange-200" : "bg-amber-100/50 border-amber-200"
                            )}>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-slate-600" />
                                    <span className="text-sm font-medium text-slate-900">{m.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className="text-[10px]">{m.brand}</Badge>
                                    <span className={cn(
                                        "text-sm font-bold",
                                        m.ratio > 0.8 ? "text-red-600" : m.ratio > 0.6 ? "text-orange-600" : "text-amber-600"
                                    )}>{m.ratio}%</span>
                                    {m.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-red-500" />}
                                    <Link to={createPageUrl('AdminIntMerchantProfile')}>
                                        <Button size="sm" variant="ghost" className="h-7">
                                            <Eye className="w-3 h-3 mr-1" /> Ver
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <KPICard title="Ratio CB Visa" value="0.42%" icon={CreditCard} color="amber" trend="up" trendValue="+0.12%" subtitle="Limite: 0.9%" alert />
                <KPICard title="Ratio CB MC" value="0.38%" icon={CreditCard} color="emerald" trend="down" trendValue="-0.05%" subtitle="Limite: 1.0%" />
                <KPICard title="Em Programa" value="2" icon={Ban} color="red" subtitle="VDMP/VCMP" />
                <KPICard title="Pré-CBs" value="18" icon={Clock} color="amber" subtitle="Pendentes" />
                <KPICard title="CBs Abertos" value="45" icon={AlertCircle} color="red" subtitle="R$ 127.5K" />
                <KPICard title="Fraudes Detectadas" value="12" icon={Shield} color="purple" subtitle="Este mês" />
            </div>

            {/* Gauges + Distribution */}
            <div className="grid lg:grid-cols-2 gap-4">
                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#2bc196]" />
                            Indicadores de Risco Consolidado
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                            <RiskGauge label="Visa CB" value={0.42} limit={0.9} sublabel="VDMP" />
                            <RiskGauge label="MC CB" value={0.38} limit={1.0} sublabel="ECP" />
                            <RiskGauge label="Visa Fraude" value={0.08} limit={0.75} sublabel="VFMP" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple-500" />
                            Merchants por Nível de Risco
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskDistribution} layout="vertical" margin={{ left: 10, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20} label={{ position: 'right', fontSize: 11, fill: '#64748B' }}>
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Trend Chart */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            Evolução do Ratio de Chargeback (6 meses)
                        </CardTitle>
                        <div className="flex items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-blue-500 rounded" />
                                <span className="text-slate-500">Visa</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-orange-500 rounded" />
                                <span className="text-slate-500">Mastercard</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-0.5 bg-red-300 rounded" style={{ borderStyle: 'dashed' }} />
                                <span className="text-slate-500">Limite VDMP</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={riskTrend}>
                            <defs>
                                <linearGradient id="colorVisa" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorMC" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 1]} tickFormatter={(v) => `${v}%`} />
                            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => `${v}%`} />
                            <Area type="monotone" dataKey="visa" stroke="#3B82F6" strokeWidth={2} fill="url(#colorVisa)" name="Visa" />
                            <Area type="monotone" dataKey="mc" stroke="#F97316" strokeWidth={2} fill="url(#colorMC)" name="Mastercard" />
                            <Line type="monotone" dataKey={() => 0.9} stroke="#EF4444" strokeDasharray="5 5" dot={false} strokeWidth={1.5} />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Quick Links */}
            <div className="grid md:grid-cols-4 gap-3">
                <Link to={createPageUrl('AdminIntChargebacksList')}>
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-[#2bc196]/30 transition-all cursor-pointer group">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900 dark:text-white group-hover:text-[#2bc196]">Chargebacks</p>
                                <p className="text-xs text-slate-500">45 abertos</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2bc196]" />
                        </CardContent>
                    </Card>
                </Link>
                <Link to={createPageUrl('AdminIntPreChargebacks')}>
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-[#2bc196]/30 transition-all cursor-pointer group">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                <Clock className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900 dark:text-white group-hover:text-[#2bc196]">Pré-Chargebacks</p>
                                <p className="text-xs text-slate-500">18 pendentes</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2bc196]" />
                        </CardContent>
                    </Card>
                </Link>
                <Link to={createPageUrl('AdminIntAntifraud')}>
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-[#2bc196]/30 transition-all cursor-pointer group">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                <Shield className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900 dark:text-white group-hover:text-[#2bc196]">Antifraude</p>
                                <p className="text-xs text-slate-500">Regras e bloqueios</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2bc196]" />
                        </CardContent>
                    </Card>
                </Link>
                <Link to={createPageUrl('AdminIntBlockages')}>
                    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md hover:border-[#2bc196]/30 transition-all cursor-pointer group">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                                <Ban className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm text-slate-900 dark:text-white group-hover:text-[#2bc196]">Bloqueios</p>
                                <p className="text-xs text-slate-500">Listas de controle</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#2bc196]" />
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    );
}