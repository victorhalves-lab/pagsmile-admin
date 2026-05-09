import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  MousePointerClick, Download, Activity, Microscope, GitCompareArrows,
  TrendingUp, FileText, Bell, Mail,
} from 'lucide-react';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';

import SmartInsightsBar from '@/components/checkout/analytics/SmartInsightsBar';
import FullCheckoutFunnel from '@/components/checkout/analytics/FullCheckoutFunnel';
import AnalyticsDecomposition from '@/components/checkout/analytics/AnalyticsDecomposition';
import CheckoutHealthScore from '@/components/checkout/CheckoutHealthScore';
import CheckoutKpiBarEnhanced from '@/components/checkout/analytics/CheckoutKpiBarEnhanced';
import CheckoutDiagnosticTab from '@/components/checkout/analytics/CheckoutDiagnosticTab';
import CheckoutCompareTab from '@/components/checkout/analytics/CheckoutCompareTab';
import EnhancedFunnelStep from '@/components/checkout/analytics/EnhancedFunnelStep';
import HourlyConversionHeatmap from '@/components/checkout/analytics/HourlyConversionHeatmap';

import StoryModeCard from '@/components/analytics/shared/StoryModeCard';
import InsightBanner from '@/components/analytics/shared/InsightBanner';
import GlobalFiltersBar from '@/components/analytics/shared/GlobalFiltersBar';
import PeriodCompareToggle from '@/components/analytics/shared/PeriodCompareToggle';
import SavedViewsManager from '@/components/analytics/shared/SavedViewsManager';

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function CheckoutAnalytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30d');
  const [method, setMethod] = useState('all');
  const [country, setCountry] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [breakdown, setBreakdown] = useState('none');

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

  const activeFilters = [period !== '30d', method !== 'all', country !== 'all', compareMode].filter(Boolean).length;

  const storyParagraphs = [
    'Sua taxa de conversão atingiu 12.4% este mês — um aumento de 2.1pp vs. o mês anterior, posicionando-se 5pp acima da mediana do setor de e-commerce (9.8%).',
    'O principal driver foi a redução do abandono no campo CPF (que caiu de 52% para 47%) após você implementar a sugestão do Converter Agent na semana passada.',
    'Identifiquei que o pico de conversão acontece às sextas-feiras às 21h (18.4%) — vale agendar campanhas de remarketing para esses horários.',
    'Atenção: ainda há R$ 24.700/mês de receita não capturada por causa de 3 oportunidades no funil. Veja a aba "Diagnóstico".',
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Analytics de Checkout"
        subtitle="Inteligência de conversão com IA — Helena diagnostica e recomenda"
        breadcrumbs={[
          { label: 'Checkout', page: 'CheckoutBuilder' },
          { label: 'Analytics' },
        ]}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <SavedViewsManager
              storageKey="checkout_analytics_views"
              currentState={{ period, method, country, compareMode, breakdown }}
              onLoadView={(s) => {
                setPeriod(s.period); setMethod(s.method); setCountry(s.country);
                setCompareMode(s.compareMode); setBreakdown(s.breakdown);
              }}
            />
            <Button variant="outline" size="sm" onClick={() => toast.success('Relatório PDF gerado')}>
              <FileText className="w-3.5 h-3.5 mr-1" /> Board Pack
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Schedule criado')}>
              <Mail className="w-3.5 h-3.5 mr-1" /> Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('Alerta criado')}>
              <Bell className="w-3.5 h-3.5 mr-1" /> Alerta
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success('CSV exportado')}>
              <Download className="w-3.5 h-3.5 mr-1" /> Exportar
            </Button>
          </div>
        }
      />

      {/* Insight banner do dia */}
      <InsightBanner
        type="opportunity"
        title="Insight do dia"
        message="Sua conversão aos sábados está 18% abaixo do potencial. Recomendo ativar campanhas de remarketing com cupom — impacto estimado: +R$ 8.400/mês."
        actionLabel="Criar campanha"
        onAction={() => navigate(createPageUrl('CouponForm'))}
      />

      {/* Story Mode IA */}
      <StoryModeCard
        title="📖 O que aconteceu este mês no seu checkout"
        paragraphs={storyParagraphs}
        highlights={[
          { label: 'Conversão', value: '12.4%', context: '+2.1pp vs mês passado', color: 'text-emerald-600' },
          { label: 'Receita', value: 'R$ 380K', context: '+15% vs mês passado', color: 'text-blue-600' },
          { label: 'Oportunidade', value: '+R$ 24.7K', context: 'recuperável com Diagnóstico', color: 'text-purple-600' },
        ]}
      />

      {/* Filtros Globais */}
      <GlobalFiltersBar
        period={period}
        onPeriodChange={setPeriod}
        method={method}
        onMethodChange={setMethod}
        country={country}
        onCountryChange={setCountry}
        activeFilters={activeFilters}
        onClearAll={() => { setPeriod('30d'); setMethod('all'); setCountry('all'); setCompareMode(false); }}
        extraActions={<PeriodCompareToggle active={compareMode} onToggle={() => setCompareMode(!compareMode)} />}
      />

      {/* Smart Insights existente + Health Score */}
      <SmartInsightsBar />
      <CheckoutHealthScore score={78} />

      {/* KPIs aprimorados (sparkline + benchmark + drill-down) */}
      <CheckoutKpiBarEnhanced formatCurrency={formatCurrency} />

      {/* Tabs principais */}
      <Tabs defaultValue="overview" className="space-y-3">
        <TabsList className="bg-white dark:bg-slate-900 border h-9">
          <TabsTrigger value="overview" className="text-xs gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="funnel" className="text-xs gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Funil Detalhado
          </TabsTrigger>
          <TabsTrigger value="diagnostic" className="text-xs gap-1.5">
            <Microscope className="w-3.5 h-3.5" /> Diagnóstico
          </TabsTrigger>
          <TabsTrigger value="compare" className="text-xs gap-1.5">
            <GitCompareArrows className="w-3.5 h-3.5" /> Compare
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-3">
          {/* Funil completo de 10 etapas (existente) */}
          <FullCheckoutFunnel />

          {/* Decomposição por dimensão (existente) */}
          <AnalyticsDecomposition />

          {/* Funil semanal (mantido) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MousePointerClick className="w-4 h-4" />
                Tráfego semanal por etapa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                    <Bar dataKey="visitas" fill="#94a3b8" name="Visitas" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="iniciados" fill="#6366f1" name="Iniciados" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="concluidos" fill="#00D26A" name="Concluídos" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Heatmap hora x dia */}
          <HourlyConversionHeatmap />

          {/* Pies lado a lado */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Motivos de Abandono</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={abandonmentReasons} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                        {abandonmentReasons.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-1.5">
                  {abandonmentReasons.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: r.color }} />
                        <span>{r.name}</span>
                      </div>
                      <span className="font-medium">{r.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Métodos de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={paymentMethodsData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                        {paymentMethodsData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-1.5">
                  {paymentMethodsData.map((m, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }} />
                        <span>{m.name}</span>
                      </div>
                      <span className="font-medium">{m.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FUNNEL DETAILED */}
        <TabsContent value="funnel" className="space-y-3">
          <EnhancedFunnelStep breakdown={breakdown} onBreakdownChange={setBreakdown} />
          <HourlyConversionHeatmap />
        </TabsContent>

        {/* DIAGNOSTIC */}
        <TabsContent value="diagnostic" className="space-y-3">
          <CheckoutDiagnosticTab />
        </TabsContent>

        {/* COMPARE */}
        <TabsContent value="compare" className="space-y-3">
          <CheckoutCompareTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}