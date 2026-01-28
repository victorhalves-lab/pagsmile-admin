import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { ShieldAlert, Users, AlertTriangle, Eye, Zap, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const RiskGauge = ({ value, label, limit, color = "#10B981" }) => {
    const percentage = Math.min((value / limit) * 100, 100);
    return (
        <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-500 uppercase mb-2">{label}</span>
            <div className="relative w-32 h-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-slate-100 rounded-t-full" />
                <div 
                    className="absolute top-0 left-0 w-full h-full rounded-t-full transition-all duration-500 origin-bottom scale-0"
                    style={{ 
                        backgroundColor: value > limit ? '#EF4444' : value > limit * 0.7 ? '#F59E0B' : color,
                        transform: `rotate(${percentage * 1.8 - 180}deg)` 
                    }}
                />
            </div>
            <div className="mt-2 text-center">
                <span className="text-xl font-bold">{value}%</span>
                <span className="text-xs text-slate-400 block">Limite: {limit}%</span>
            </div>
        </div>
    );
};

export default function AdminIntRisk() {
    // Mock Data
    const riskTrend = [
        { month: 'Ago', ratio: 0.30 }, { month: 'Set', ratio: 0.35 }, { month: 'Out', ratio: 0.42 },
        { month: 'Nov', ratio: 0.55 }, { month: 'Dez', ratio: 0.70 }, { month: 'Jan', ratio: 0.85 }
    ];

    const riskDistribution = [
        { name: 'Baixo', value: 412, color: '#10B981' },
        { name: 'Moderado', value: 28, color: '#F59E0B' },
        { name: 'Alerta', value: 8, color: '#F97316' },
        { name: 'Crítico', value: 5, color: '#EF4444' },
        { name: 'Em Programa', value: 2, color: '#111827' }
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Risco & Antifraude"
                subtitle="Monitoramento e Prevenção"
                breadcrumbs={[{ label: 'Risco', page: 'AdminIntRisk' }]}
                actions={<Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>}
            />

            {/* Insight Banner */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-100 dark:border-orange-900 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-200 mb-1">💡 INSIGHTS DO DIA</h3>
                        <div className="space-y-1">
                            <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                                🚨 URGENTE: Merchant "Loja XYZ" atingiu ratio 0.85% Visa
                            </p>
                            <p className="text-sm text-orange-700 dark:text-orange-300 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-amber-500" />
                                ⚠️ 3 merchants na zona de alerta (ratio {'>'} 0.5%)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <KPICard title="Ratio CB Visa" value="0.42" suffix="%" icon={ShieldAlert} />
                <KPICard title="Ratio CB MC" value="0.38" suffix="%" icon={ShieldAlert} />
                <KPICard title="Em Programa" value="2" icon={Users} className="border-l-4 border-l-black" />
                <KPICard title="Pré-CBs Pend." value="18" icon={Zap} className="border-l-4 border-l-orange-500" />
                <KPICard title="CBs Abertos" value="45" icon={AlertCircle} className="border-l-4 border-l-red-500" />
                <KPICard title="Fraudes Mês" value="12" icon={AlertTriangle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle>Gauges de Risco (Consolidado)</CardTitle></CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-around">
                        <RiskGauge label="Visa CB" value={0.42} limit={0.9} />
                        <RiskGauge label="Mastercard CB" value={0.38} limit={1.0} />
                        <RiskGauge label="Visa Fraude" value={0.08} limit={0.75} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Merchants por Nível de Risco</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={riskDistribution} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader><CardTitle>Evolução do Ratio CB (12 Meses)</CardTitle></CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={riskTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="ratio" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} name="Ratio Médio" />
                                {/* Reference Line for VDMP Limit */}
                                <Line type="monotone" dataKey={() => 0.9} stroke="#94A3B8" strokeDasharray="5 5" dot={false} name="Limite VDMP" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}