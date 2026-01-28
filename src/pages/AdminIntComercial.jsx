import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, Filter, Plus, FileText, Users, BarChart3, 
  ArrowRight, Download, Bot, MoreVertical, LayoutDashboard 
} from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import KPICard from '@/components/admin-interno/dashboard/shared/KPICard';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

// Componentes de gráfico placeholder (serão refinados)
const LeadsByOriginChart = () => {
  const data = [
    { name: 'Site PagSmile', value: 45 },
    { name: 'Indicação', value: 32 },
    { name: 'Self-Service', value: 28 },
    { name: 'Evento', value: 18 },
    { name: 'Parceiro', value: 15 },
    { name: 'LinkedIn', value: 12 },
    { name: 'Outros', value: 6 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const SalesPerformanceChart = () => {
  const data = [
    { name: 'João Silva', real: 8, meta: 7 },
    { name: 'Maria Santos', real: 6, meta: 7 },
    { name: 'Pedro Lima', real: 5, meta: 6 },
    { name: 'Ana Costa', real: 3, meta: 6 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
        <Tooltip />
        <Bar dataKey="real" fill="#10b981" name="Realizado" radius={[0, 4, 4, 0]} barSize={10} />
        <Bar dataKey="meta" fill="#e2e8f0" name="Meta" radius={[0, 4, 4, 0]} barSize={10} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function AdminIntComercial() {
  const [period, setPeriod] = useState('this_month');

  // Mock data para KPIs
  const kpis = {
    leads_new: { value: 156, change: 23 },
    proposals_pending: { value: 24, change: 0, subValue: 'R$ 2.1M' },
    activation_goal: { value: '22/26', change: 85, isPercentage: true },
    conversion_rate: { value: '14.1%', change: 2.3 },
    avg_ticket: { value: 'R$ 180k', change: 15 }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Dashboard Comercial
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Visão geral de performance, pipeline e metas.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="this_week">Esta Semana</SelectItem>
              <SelectItem value="this_month">Este Mês</SelectItem>
              <SelectItem value="last_month">Mês Passado</SelectItem>
              <SelectItem value="this_quarter">Este Trimestre</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* DIA Insights Banner */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-900/30 border-indigo-100 dark:border-indigo-800">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                Insights DIA Comercial
                <Badge variant="secondary" className="bg-white/50 text-indigo-700 hover:bg-white">3 Novos</Badge>
              </h3>
              <Button variant="link" size="sm" className="text-indigo-600 h-auto p-0">Ver todos</Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                Lead "Empresa XYZ" com TPV de R$ 2M está parado há 5 dias
              </div>
              <div className="flex items-center gap-2 text-sm text-indigo-800 dark:text-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                Meta de ativações 85% alcançada, 4 dias para fechar
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Leads Novos (Mês)" value={kpis.leads_new.value} change={kpis.leads_new.change} icon={Users} />
        <KPICard title="Propostas Pendentes" value={kpis.proposals_pending.value} subValue={kpis.proposals_pending.subValue} icon={FileText} />
        <KPICard title="Meta Ativação" value={kpis.activation_goal.value} subValue="85% atingido" icon={BarChart3} />
        <KPICard title="Taxa Conversão" value={kpis.conversion_rate.value} change={kpis.conversion_rate.change} icon={Filter} />
        <KPICard title="Ticket Médio" value={kpis.avg_ticket.value} change={kpis.avg_ticket.change} icon={BarChart3} />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Performance de Vendedores</h3>
            <SalesPerformanceChart />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Leads por Origem</h3>
            <LeadsByOriginChart />
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-6">Funil de Vendas (Mês Atual)</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
            {[
              { label: 'Leads', value: 156, rate: '100%' },
              { label: 'Qualificados', value: 98, rate: '63%' },
              { label: 'Proposta', value: 67, rate: '43%' },
              { label: 'Enviadas', value: 52, rate: '33%' },
              { label: 'Aceitas', value: 28, rate: '18%' },
              { label: 'Ativados', value: 22, rate: '14%' }
            ].map((step, idx, arr) => (
              <div key={idx} className="flex-1 flex flex-col items-center relative w-full">
                <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 w-full text-center border-b-4 border-primary/20 hover:border-primary transition-colors">
                  <span className="text-xs text-slate-500 uppercase font-bold">{step.label}</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white my-1">{step.value}</div>
                  <Badge variant="outline" className="text-xs">{step.rate}</Badge>
                </div>
                {idx < arr.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-slate-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-sm text-slate-500">
            Pipeline Total: <span className="font-semibold text-slate-900 dark:text-slate-100">R$ 4.5M GMV/mês</span> potencial
          </div>
        </CardContent>
      </Card>
    </div>
  );
}