import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import AgentChatInterface from '@/components/common/AgentChatInterface';
import SimulatedReportModal from '@/components/common/SimulatedReportModal';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import DynamicKpiCard from '@/components/common/DynamicKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, BarChart3, Database, Cpu, Users } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function AdminIntPagSmileCopilot() {
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState('QBR');

  const quickPrompts = [
    "Quais são os 50 merchants que mais geraram margem nos últimos 90 dias?",
    "Mostre-me merchants com alto GMV e margem negativa",
    "Desenha a matriz margem x risco da carteira",
    "Quais merchants pararam de transacionar nos últimos 60 dias?",
    "Sugira 30 merchants para CS entrar em contato essa semana",
    "Qual foi o impacto da mudança de roteamento?",
    "Gere um resumo trimestral para investidores"
  ];

  const riskMarginData = [
    { x: 20, y: 15, z: 5000, name: 'Segmento A', color: '#2bc196' },
    { x: 45, y: 8, z: 12000, name: 'Segmento B', color: '#f59e0b' },
    { x: 70, y: 3, z: 8000, name: 'Segmento C', color: '#ef4444' },
    { x: 30, y: 18, z: 15000, name: 'Segmento D', color: '#3b82f6' },
    { x: 55, y: 12, z: 9500, name: 'Segmento E', color: '#8b5cf6' }
  ];

  const handleMessage = (text) => {
    if (text.toLowerCase().includes("margem") && text.toLowerCase().includes("50")) {
      return {
        role: 'assistant',
        content: `📊 **Top 50 Merchants por Margem Absoluta (90 dias)**\n\nTotal de margem gerada: **R$ 2.8M**\n\nDestaques:\n• TechStore: R$ 185k\n• Fashion Brasil: R$ 142k\n• Digital Services: R$ 128k\n\n*Lista completa disponível para download.*`,
        richContent: (
          <SimulatedActionButton 
            actionLabel="Relatório exportado"
            variant="outline"
            size="sm"
            icon={FileText}
          >
            Exportar Lista Completa
          </SimulatedActionButton>
        )
      };
    }

    if (text.toLowerCase().includes("matriz") || text.toLowerCase().includes("risco")) {
      return {
        role: 'assistant',
        content: `📈 **Matriz Margem x Risco da Carteira**\n\n**Quadrantes identificados**:\n• Alta Margem + Baixo Risco: 45 merchants (queridos 💚)\n• Alta Margem + Alto Risco: 12 merchants (atenção ⚠️)\n• Baixa Margem + Baixo Risco: 38 merchants\n• Baixa Margem + Alto Risco: 8 merchants (tóxicos ⛔)`,
        richContent: (
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <XAxis type="number" dataKey="x" name="Risco" unit="%" tick={{ fontSize: 10 }} />
              <YAxis type="number" dataKey="y" name="Margem" unit="%" tick={{ fontSize: 10 }} />
              <ZAxis type="number" dataKey="z" range={[100, 1000]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter data={riskMarginData}>
                {riskMarginData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        )
      };
    }

    if (text.toLowerCase().includes("investidores") || text.toLowerCase().includes("relatório")) {
      setTimeout(() => {
        setReportType('investor');
        setReportModalOpen(true);
      }, 1500);
      
      return {
        role: 'assistant',
        content: `📄 **Gerando Relatório para Investidores**\n\nEstou compilando:\n• Crescimento de GMV\n• Análise de margem por segmento\n• Qualidade da carteira\n• Projeções para próximo trimestre\n\n*Aguarde um momento...*`
      };
    }

    return {
      role: 'assistant',
      content: `Entendi sua pergunta sobre "${text}".\n\nComo Copiloto Interno, posso ajudar a equipe PagSmile com:\n\n• Radiografia de carteira\n• Análises de margem e risco\n• Priorização de ações de CS e produto\n• Geração de relatórios executivos\n• Detecção de oportunidades de upsell\n\nTente uma das sugestões ou faça uma pergunta estratégica!`
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="PagSmile Copilot"
        subtitle="Copiloto de gestão e estratégia para times internos"
        icon={Brain}
        breadcrumbs={[
          { label: 'Admin Interno' },
          { label: 'AI Agents' },
          { label: 'PagSmile Copilot' }
        ]}
      />

      <Tabs defaultValue="chat">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat Estratégico</TabsTrigger>
          <TabsTrigger value="insights">Insights Dashboard</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px]">
            <AgentChatInterface
              agentName="PagSmile Copilot"
              quickPrompts={quickPrompts}
              onSendMessage={handleMessage}
              placeholder="Pergunte sobre carteira, margem, risco, oportunidades..."
              accentColor="purple"
            />
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DynamicKpiCard
              title="Top Merchant por Margem"
              value="R$ 185k"
              description="TechStore - Últimos 90 dias"
              icon={BarChart3}
              color="primary"
            />
            <DynamicKpiCard
              title="Merchants 'Tóxicos'"
              value="8"
              description="Alto GMV + Margem Negativa"
              icon={AlertTriangle}
              color="red"
            />
            <DynamicKpiCard
              title="Oportunidades Upsell"
              value="34"
              description="Perfil ideal para crédito"
              icon={Users}
              color="blue"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mapa de Risco vs Margem</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <XAxis type="number" dataKey="x" name="Risco" unit="%" />
                  <YAxis type="number" dataKey="y" name="Margem" unit="%" />
                  <ZAxis type="number" dataKey="z" range={[100, 1000]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={riskMarginData}>
                    {riskMarginData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inputs Considerados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2">
                  <Database className="w-4 h-4 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Data Warehouse</p>
                    <p className="text-xs text-slate-500">Dados transacionais de toda a base</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Cpu className="w-4 h-4 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm font-medium">Modelos de ML</p>
                    <p className="text-xs text-slate-500">Risco, churn, LTV, predição GMV</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outputs Gerados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setReportType('QBR');
                    setReportModalOpen(true);
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Gerar QBR (Quarterly Business Review)
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setReportType('portfolio');
                    setReportModalOpen(true);
                  }}
                >
                  <BarChart3 className="w-4 h-4" />
                  Gerar Sumário de Carteira
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setReportType('investor');
                    setReportModalOpen(true);
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Gerar Apresentação para Investidores
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SimulatedReportModal
        open={reportModalOpen}
        onOpenChange={setReportModalOpen}
        reportType={reportType}
      />
    </div>
  );
}