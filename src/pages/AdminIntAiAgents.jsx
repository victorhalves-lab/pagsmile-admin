import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Activity, Brain, ShieldCheck, Target, MessageSquare } from 'lucide-react';

const AgentCard = ({ name, role, status, metrics, icon: Icon, color }) => (
    <Card className="hover:shadow-lg transition-all">
        <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">{name}</CardTitle>
                        <p className="text-sm text-slate-500">{role}</p>
                    </div>
                </div>
                <Badge variant={status === 'active' ? 'default' : 'secondary'} className={status === 'active' ? 'bg-green-100 text-green-700' : ''}>
                    {status === 'active' ? '🟢 ON' : '⚫ OFF'}
                </Badge>
            </div>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
                {metrics.map((m, i) => (
                    <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-500">{m.label}</span>
                        <span className="font-semibold">{m.value}</span>
                    </div>
                ))}
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm" className="flex-1">Configurar</Button>
                <Button variant="outline" size="sm" className="flex-1">Logs</Button>
            </div>
        </CardContent>
    </Card>
);

export default function AdminIntAiAgents() {
    return (
        <div className="space-y-6">
            <PageHeader 
                title="Agentes IA" 
                subtitle="Gestão e Monitoramento de Inteligência Artificial"
                breadcrumbs={[{ label: 'Administração', page: '#' }, { label: 'Agentes IA', page: 'AdminIntAiAgents' }]}
            />

            {/* Overall Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">3</p><p className="text-xs text-slate-500">Agentes Ativos</p></CardContent></Card>
                <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">856</p><p className="text-xs text-slate-500">Análises Hoje</p></CardContent></Card>
                <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-green-600">98%</p><p className="text-xs text-slate-500">Taxa Sucesso</p></CardContent></Card>
                <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">1.2s</p><p className="text-xs text-slate-500">Tempo Médio</p></CardContent></Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AgentCard 
                    name="PRISCILA" 
                    role="Pricing Intelligence" 
                    status="active" 
                    icon={Target}
                    color="bg-purple-500"
                    metrics={[
                        { label: 'Análises hoje', value: '45' },
                        { label: 'Precisão', value: '94%' },
                        { label: 'Leads qualificados', value: '38' }
                    ]}
                />
                <AgentCard 
                    name="HELENA" 
                    role="KYC Analysis" 
                    status="active" 
                    icon={ShieldCheck}
                    color="bg-blue-500"
                    metrics={[
                        { label: 'Análises hoje', value: '28' },
                        { label: 'Auto-aprovação', value: '72%' },
                        { label: 'Tempo médio', value: '4.5s' }
                    ]}
                />
                <AgentCard 
                    name="DIA" 
                    role="Copiloto Inteligente" 
                    status="active" 
                    icon={Brain}
                    color="bg-emerald-500"
                    metrics={[
                        { label: 'Interações hoje', value: '783' },
                        { label: 'Satisfação', value: '4.5/5' },
                        { label: 'Insights gerados', value: '156' }
                    ]}
                />
            </div>
        </div>
    );
}