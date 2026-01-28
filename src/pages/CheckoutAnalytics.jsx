import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  CreditCard,
  Users,
  MousePointerClick,
  ArrowRight,
  Download
} from 'lucide-react';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};

export default function CheckoutAnalytics() {
  const [period, setPeriod] = useState('7d');

  // Dados mockados para demonstração
  const conversionData = [
    { name: 'Seg', visitas: 1200, iniciados: 480, concluidos: 144 },
    { name: 'Ter', visitas: 1350, iniciados: 540, concluidos: 189 },
    { name: 'Qua', visitas: 1100, iniciados: 385, concluidos: 116 },
    { name: 'Qui', visitas: 1450, iniciados: 580, concluidos: 203 },
    { name: 'Sex', visitas: 1600, iniciados: 720, concluidos: 288 },
    { name: 'Sáb', visitas: 980, iniciados: 343, concluidos: 103 },
    { name: 'Dom', visitas: 750, iniciados: 263, concluidos: 79 },
  ];

  const abandonmentReasons = [
    { name: 'Frete muito caro', value: 35, color: '#ef4444' },
    { name: 'Processo longo', value: 25, color: '#f97316' },
    { name: 'Falta de confiança', value: 20, color: '#eab308' },
    { name: 'Erro no pagamento', value: 12, color: '#22c55e' },
    { name: 'Outros', value: 8, color: '#6b7280' },
  ];

  const paymentMethodsData = [
    { name: 'Cartão Crédito', value: 55, color: '#6366f1' },
    { name: 'Pix', value: 35, color: '#00D26A' },
    { name: 'Boleto', value: 10, color: '#f59e0b' },
  ];

  const kpis = [
    {
      title: 'Taxa de Conversão',
      value: '12.4%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp
    },
    {
      title: 'Abandono de Carrinho',
      value: '68.2%',
      change: '-3.5%',
      trend: 'down',
      icon: ShoppingCart
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(247.50),
      change: '+8.3%',
      trend: 'up',
      icon: CreditCard
    },
    {
      title: 'Visitantes Únicos',
      value: '8.4K',
      change: '+15.2%',
      trend: 'up',
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics de Checkout"
        subtitle="Acompanhe a performance e otimize suas conversões"
        breadcrumbs={[
          { label: 'Checkout', page: 'CheckoutBuilder' },
          { label: 'Analytics' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="90d">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{kpi.title}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  <div className={`flex items-center gap-1 mt-1 text-sm ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {kpi.change}
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointerClick className="w-5 h-5" />
            Funil de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="visitas" fill="#94a3b8" name="Visitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="iniciados" fill="#6366f1" name="Checkouts Iniciados" radius={[4, 4, 0, 0]} />
                <Bar dataKey="concluidos" fill="#00D26A" name="Concluídos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos lado a lado */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Motivos de Abandono */}
        <Card>
          <CardHeader>
            <CardTitle>Motivos de Abandono</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={abandonmentReasons}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {abandonmentReasons.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {abandonmentReasons.map((reason, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: reason.color }}
                    />
                    <span>{reason.name}</span>
                  </div>
                  <span className="font-medium">{reason.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pagamento */}
        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {paymentMethodsData.map((method, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: method.color }}
                    />
                    <span>{method.name}</span>
                  </div>
                  <span className="font-medium">{method.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}