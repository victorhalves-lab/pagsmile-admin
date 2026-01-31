import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from 'react-i18next';
import AgentChatInterface from '@/components/common/AgentChatInterface';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import DynamicKpiCard from '@/components/common/DynamicKpiCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, AlertTriangle, Zap, Link2, Settings } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DIACopilot() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('chat');

  const quickPrompts = [
    "Como foi meu dia ontem?",
    "Minha aprovação caiu, por quê?",
    "Quanto deixei de vender por falha de pagamento?",
    "Sugira mix PIX x Cartão",
    "Criar link de pagamento de R$ 350",
    "Quais chargebacks precisam de atenção?",
    "Analisar custo por adquirente",
    "Me ajuda a preparar o Dia das Mães",
    "Explicar linha do extrato",
    "O que posso fazer para melhorar minha operação?"
  ];

  const handleDIAMessage = (text) => {
    // Simular respostas baseadas em perguntas específicas
    
    if (text.toLowerCase().includes("como foi meu dia") || text.toLowerCase().includes("ontem")) {
      const mockData = [
        { hora: '00h', vendas: 12 },
        { hora: '04h', vendas: 5 },
        { hora: '08h', vendas: 45 },
        { hora: '12h', vendas: 89 },
        { hora: '16h', vendas: 67 },
        { hora: '20h', vendas: 34 }
      ];

      return {
        role: 'assistant',
        content: `📊 **Resumo do seu dia ontem**\n\n**Vendas**: R$ 24.580\n**Aprovação**: 87%\n**Principais motivos de recusa**: Saldo insuficiente (35%), Limite excedido (25%)\n\n**Oportunidades da semana**:\n• R$ 8.2k recuperáveis com Recovery Agent\n• 3% de melhoria possível ajustando rotas`,
        richContent: (
          <div className="space-y-3">
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={mockData}>
                <XAxis dataKey="hora" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="vendas" stroke="#2bc196" fill="#2bc196" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
            <SimulatedActionButton 
              actionLabel="Análise detalhada configurada"
              variant="outline" 
              size="sm"
              className="w-full"
            >
              Ver Análise Detalhada
            </SimulatedActionButton>
          </div>
        )
      };
    }

    if (text.toLowerCase().includes("aprovação caiu") || text.toLowerCase().includes("por qu")) {
      return {
        role: 'assistant',
        content: `🔍 **Análise de Queda de Aprovação**\n\nSua taxa caiu de **92% para 87%** ontem.\n\n**Causas identificadas**:\n• Emissor Bradesco apresentou instabilidade (-15% aprovação)\n• Aumento de transações fora do horário comercial\n• Adquirente Stone com mais timeouts que o normal\n\n**Recomendações**:\n1. Re-rotear temporariamente transações Bradesco para Itaú\n2. Ativar retry automático para timeouts`,
        richContent: (
          <div className="space-y-2">
            <SimulatedActionButton 
              actionLabel="Rota reconfigurada"
              icon={Settings}
              size="sm"
            >
              Reequilibrar Rotas Automaticamente
            </SimulatedActionButton>
          </div>
        )
      };
    }

    if (text.toLowerCase().includes("deixei de vender") || text.toLowerCase().includes("falha")) {
      return {
        role: 'assistant',
        content: `💸 **Dinheiro Deixado na Mesa**\n\nNos últimos 30 dias, você perdeu aproximadamente **R$ 42.300** em vendas devido a falhas de pagamento.\n\n**Breakdown**:\n• Recusas: R$ 28.400\n• Abandono de checkout: R$ 9.800\n• Erros técnicos: R$ 4.100\n\n**Boa notícia**: Com o Agente Recuperador, podemos resgatar ~60% disso (R$ 25.380).`,
        richContent: (
          <SimulatedActionButton 
            actionLabel="Campanha de Recovery configurada"
            icon={Zap}
          >
            Configurar Campanha de Recuperação
          </SimulatedActionButton>
        )
      };
    }

    if (text.toLowerCase().includes("link de pagamento")) {
      const valueMatch = text.match(/R?\$?\s?(\d+)/);
      const value = valueMatch ? valueMatch[1] : "350";
      
      return {
        role: 'assistant',
        content: `✅ **Link de Pagamento Criado**\n\nValor: R$ ${value}\n\nSeu link está pronto para compartilhar:`,
        richContent: (
          <div className="space-y-2">
            <div className="bg-slate-100 border border-slate-200 rounded-lg p-3">
              <p className="font-mono text-xs text-slate-600 break-all">
                https://pagsmile.com/pay/abc123xyz
              </p>
            </div>
            <SimulatedActionButton 
              actionLabel="Link copiado"
              variant="outline"
              size="sm"
              icon={Link2}
            >
              Copiar Link
            </SimulatedActionButton>
          </div>
        )
      };
    }

    // Resposta genérica
    return {
      role: 'assistant',
      content: `Entendi sua pergunta sobre "${text}".\n\nComo seu copiloto, posso te ajudar com:\n\n• Análises de performance e diagnósticos\n• Configurações da plataforma\n• Criação de links e campanhas\n• Identificação de oportunidades\n• Explicações de conceitos de pagamento\n\nTente uma das sugestões acima ou faça uma pergunta específica!`
    };
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="DIA Merchant Copilot"
        subtitle="Seu copiloto inteligente para otimizar vendas e uso da plataforma"
        icon={Sparkles}
        breadcrumbs={[
          { label: 'AI Agents', href: '#' },
          { label: 'DIA Copilot' }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat Interativo</TabsTrigger>
          <TabsTrigger value="examples">25 Exemplos de Uso</TabsTrigger>
          <TabsTrigger value="capabilities">Capacidades</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px]">
            <AgentChatInterface
              agentName="DIA"
              quickPrompts={quickPrompts}
              onSendMessage={handleDIAMessage}
              placeholder="Pergunte ao DIA sobre suas vendas, configurações ou oportunidades..."
            />
          </Card>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickPrompts.map((prompt, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                setActiveTab('chat');
              }}>
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-[#2bc196]">{idx + 1}</Badge>
                    <CardTitle className="text-sm">{prompt}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-slate-500">
                    Clique para testar este cenário no chat
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="capabilities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DynamicKpiCard
              title="Dados Transacionais"
              value="100%"
              description="Vendas, aprovação, recusas, ticket médio, chargeback, mix PIX/Cartão"
              icon={TrendingUp}
              color="primary"
            />
            <DynamicKpiCard
              title="Dados de Custo"
              value="100%"
              description="MDR efetivo, custo de rotas, chargeback, adquirentes"
              icon={TrendingUp}
              color="blue"
            />
            <DynamicKpiCard
              title="Sinais de Outros Agentes"
              value="4"
              description="Recuperador, Disputas, NOC/Infra, Converter"
              icon={Zap}
              color="purple"
            />
            <DynamicKpiCard
              title="Ações Automatizáveis"
              value="10+"
              description="Criar links, ajustar rotas, ativar recovery, configurações"
              icon={Settings}
              color="amber"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2bc196]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#2bc196]">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Interpreta a Intenção</p>
                  <p className="text-xs text-slate-500">Entende se você quer dados, diagnóstico, ação ou configuração</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2bc196]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#2bc196]">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Consulta Dados & Modelos</p>
                  <p className="text-xs text-slate-500">Vision/DIA, modelos de ML, APIs de configuração</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#2bc196]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#2bc196]">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Devolve Resposta Rica</p>
                  <p className="text-xs text-slate-500">Texto, visualizações, botões de ação, rastreabilidade</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}