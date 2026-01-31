import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from 'react-i18next';
import DynamicKpiCard from '@/components/common/DynamicKpiCard';
import MetricImpactCard from '@/components/common/MetricImpactCard';
import SimulatedCheckoutIframe from '@/components/common/SimulatedCheckoutIframe';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import AgentChatInterface from '@/components/common/AgentChatInterface';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LifeBuoy, CreditCard, QrCode, Zap, TrendingUp, AlertTriangle, CheckCircle, Mail, MessageSquare, Clock, RefreshCw, DollarSign, Phone, Send } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner';

export default function RecoveryAgent() {
  const { t } = useTranslation();
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [pixDiscount, setPixDiscount] = useState([5]);
  const [retryEnabled, setRetryEnabled] = useState(true);

  const [liveRecoveryFeed, setLiveRecoveryFeed] = useState([]);
  const [simulatingLive, setSimulatingLive] = useState(false);

  const scenarios = [
    { id: 'nsf', label: 'Saldo Insuficiente (NSF)', impact: '35%', recovery: '60%' },
    { id: 'limit', label: 'Limite Excedido', impact: '25%', recovery: '45%' },
    { id: 'fraud_suspect', label: 'Suspeita de Fraude', impact: '20%', recovery: '70%' },
    { id: 'expired', label: 'Cartão Expirado', impact: '10%', recovery: '55%' },
    { id: 'timeout', label: 'Timeout/Erro Técnico', impact: '10%', recovery: '80%' },
    { id: 'abandon', label: 'Abandono de Checkout', impact: '40%', recovery: '35%' }
  ];

  const channelPerformance = [
    { channel: 'WhatsApp', sent: 1250, opened: 890, converted: 312, rate: 35 },
    { channel: 'Email', sent: 2100, opened: 630, converted: 126, rate: 20 },
    { channel: 'SMS', sent: 850, opened: 510, converted: 102, rate: 20 },
    { channel: 'Push', sent: 1800, opened: 720, converted: 108, rate: 15 }
  ];

  // Simular feed em tempo real
  useEffect(() => {
    if (simulatingLive) {
      const mockEvents = [
        { type: 'decline', customer: 'João S.', amount: 289, reason: 'NSF', action: 'PIX oferecido', status: 'pending' },
        { type: 'recovery', customer: 'Maria L.', amount: 450, reason: 'Limite', action: 'Split aceito', status: 'recovered' },
        { type: 'abandon', customer: 'Carlos M.', amount: 178, reason: 'Abandono', action: 'WhatsApp enviado', status: 'pending' },
        { type: 'recovery', customer: 'Ana P.', amount: 890, reason: 'Timeout', action: 'Retry sucesso', status: 'recovered' },
        { type: 'decline', customer: 'Pedro R.', amount: 345, reason: 'Fraude', action: 'Roteamento alternativo', status: 'processing' }
      ];

      const interval = setInterval(() => {
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        setLiveRecoveryFeed(prev => [{
          ...randomEvent,
          timestamp: new Date().toLocaleTimeString(),
          id: Date.now()
        }, ...prev].slice(0, 10));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [simulatingLive]);

  const recoveryData = [
    { month: 'Set', gmv: 18500, recovered: 8300 },
    { month: 'Out', gmv: 21200, recovered: 9800 },
    { month: 'Nov', gmv: 24800, recovered: 12400 },
    { month: 'Dez', gmv: 28300, recovered: 14200 },
    { month: 'Jan', gmv: 32100, recovered: 16500 }
  ];

  const handleScenarioSimulation = (scenario) => {
    setSelectedScenario(scenario);
    setScenarioModalOpen(true);
  };

  const renderScenarioAction = () => {
    const actions = {
      nsf: {
        title: "Ação: Oferecer PIX com Desconto",
        message: "Ops! Saldo insuficiente. Que tal pagar com PIX com 5% de desconto?",
        buttons: ["Pagar com PIX", "Usar Outro Cartão"]
      },
      limit: {
        title: "Ação: Sugerir Split em Dois Cartões",
        message: "Limite excedido. Que tal dividir o pagamento em dois cartões?",
        buttons: ["Dividir Pagamento", "Tentar Outro Cartão"]
      },
      fraud_suspect: {
        title: "Ação: Retry em Outro Adquirente",
        message: "Processando com outro parceiro... ⏳",
        buttons: []
      },
      expired: {
        title: "Ação: Account Updater",
        message: "Atualizando dados do cartão automaticamente...",
        buttons: ["Usar Carteira Digital"]
      },
      timeout: {
        title: "Ação: Retry Automático",
        message: "Tentando novamente em 3 segundos...",
        buttons: ["Tentar PIX"]
      }
    };

    const action = actions[selectedScenario] || actions.nsf;

    return (
      <div className="space-y-4">
        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-800 mb-2">{action.title}</p>
          <p className="text-sm text-amber-700">{action.message}</p>
        </div>

        {action.buttons.length > 0 && (
          <div className="space-y-2">
            {action.buttons.map((btn, idx) => (
              <Button
                key={idx}
                className="w-full"
                variant={idx === 0 ? "default" : "outline"}
                onClick={() => toast.success(`Ação "${btn}" simulada`)}
              >
                {btn}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agente Recuperador de Pagamento"
        subtitle="Real-Time Payment Recovery - Maximize conversão reduzindo perdas"
        icon={LifeBuoy}
        breadcrumbs={[
          { label: 'AI Agents' },
          { label: 'Recovery Agent' }
        ]}
      />

      <Tabs defaultValue="simulator">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator">Simulador</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="scenarios">Cenários</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-4">
          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricImpactCard
              metricName="GMV Recuperado"
              before={0}
              after={16.5}
              unit="k R$"
              description="Este mês"
              target={20}
            />
            <MetricImpactCard
              metricName="Taxa de Recovery"
              before={0}
              after={51}
              unit="%"
              description="De transações em risco"
              target={60}
            />
            <MetricImpactCard
              metricName="Tempo de Resposta"
              before={24}
              after={0.5}
              unit=" horas"
              description="Para ação de recovery"
              target={0.25}
            />
            <MetricImpactCard
              metricName="ROI do Agente"
              before={0}
              after={850}
              unit="%"
              description="Revenue vs custo"
              target={1000}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulador de Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Cenário de Perda</CardTitle>
                <CardDescription>Veja como o agente reage em tempo real</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select onValueChange={handleScenarioSimulation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cenário de perda" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map(s => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label} - Impacto: {s.impact}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="text-center text-sm text-slate-500">
                  Selecione um cenário para ver a ação do agente em tempo real
                </div>

                {/* Live Feed Toggle */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${simulatingLive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                      Feed em Tempo Real
                    </Label>
                    <Switch checked={simulatingLive} onCheckedChange={setSimulatingLive} />
                  </div>

                  {simulatingLive && liveRecoveryFeed.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-auto">
                      {liveRecoveryFeed.map((event) => (
                        <div key={event.id} className={`p-2 rounded-lg text-xs flex items-center justify-between ${
                          event.status === 'recovered' ? 'bg-green-50 border border-green-200' :
                          event.status === 'processing' ? 'bg-blue-50 border border-blue-200' :
                          'bg-amber-50 border border-amber-200'
                        }`}>
                          <div>
                            <span className="font-medium">{event.customer}</span>
                            <span className="text-slate-500 mx-1">•</span>
                            <span>R$ {event.amount}</span>
                            <span className="text-slate-500 mx-1">→</span>
                            <span className={event.status === 'recovered' ? 'text-green-600' : 'text-amber-600'}>
                              {event.action}
                            </span>
                          </div>
                          <span className="text-slate-400">{event.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* KPIs */}
            <div className="space-y-4">
              <DynamicKpiCard
                title="GMV Recuperado (Mês)"
                value="R$ 16.5k"
                trend="up"
                trendValue="+18%"
                icon={TrendingUp}
                color="primary"
              />
              <DynamicKpiCard
                title="Taxa de Recuperação"
                value="51%"
                description="De todas as tentativas em risco"
                icon={CheckCircle}
                color="blue"
              />

              {/* Channel Performance Mini */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Performance por Canal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {channelPerformance.map((ch) => (
                      <div key={ch.channel} className="flex items-center gap-2">
                        <span className="text-xs w-20">{ch.channel}</span>
                        <Progress value={ch.rate} className="flex-1 h-2" />
                        <span className="text-xs font-medium w-10">{ch.rate}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DynamicKpiCard
              title="GMV em Risco (Mês)"
              value="R$ 32.1k"
              description="25% das tentativas de pagamento"
              icon={AlertTriangle}
              color="amber"
            />
            <DynamicKpiCard
              title="GMV Recuperado"
              value="R$ 16.5k"
              description="51% de taxa de recuperação"
              icon={CheckCircle}
              color="primary"
            />
            <DynamicKpiCard
              title="Perdas Evitáveis"
              value="R$ 8.2k"
              description="Com otimização adicional"
              icon={Zap}
              color="blue"
            />
            <DynamicKpiCard
              title="Comunicações Enviadas"
              value="6.2k"
              description="Este mês"
              icon={Send}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={recoveryData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gmv" stroke="#94a3b8" name="GMV em Risco" />
                    <Line type="monotone" dataKey="recovered" stroke="#2bc196" strokeWidth={2} name="GMV Recuperado" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Canal de Comunicação</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={channelPerformance}>
                    <XAxis dataKey="channel" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="sent" fill="#94a3b8" name="Enviados" />
                    <Bar dataKey="converted" fill="#2bc196" name="Convertidos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Proactive Communication Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Exemplos de Comunicação Proativa
              </CardTitle>
              <CardDescription>Mensagens enviadas automaticamente pelo agente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-3 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">WhatsApp - NSF</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    "Oi João! 👋 Vi que houve um probleminha no pagamento. Que tal tentar com PIX? Te dou 5% de desconto! 💚"
                  </p>
                </div>
                <div className="border rounded-lg p-3 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Email - Abandono</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    "Seus itens ainda estão no carrinho! Complete seu pedido nos próximos 30min e ganhe frete grátis."
                  </p>
                </div>
                <div className="border rounded-lg p-3 bg-amber-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">SMS - Limite</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    "Limite excedido? Divida em 2 cartões ou pague metade agora e metade em 7 dias. Responda SIM."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Cenário de Perda</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scenarios.map(s => ({
                  name: s.label.split(' (')[0],
                  impacto: parseFloat(s.impact),
                  recuperacao: parseFloat(s.recovery)
                }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="impacto" fill="#94a3b8" name="% de Impacto" />
                  <Bar dataKey="recuperacao" fill="#2bc196" name="% de Recuperação" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map(scenario => (
              <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm">{scenario.label}</CardTitle>
                    <Badge variant="outline">{scenario.recovery} recovery</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Impacto: {scenario.impact} das perdas</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleScenarioSimulation(scenario.id)}
                    >
                      Simular Cenário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Estratégias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Ativar PIX com Desconto em Recusas NSF</Label>
                  <Switch checked={true} />
                </div>
                <p className="text-xs text-slate-500">Oferece PIX com desconto quando cartão é recusado por saldo</p>
              </div>

              <div className="space-y-2">
                <Label>Percentual de Desconto PIX: {pixDiscount}%</Label>
                <Slider 
                  value={pixDiscount} 
                  onValueChange={setPixDiscount}
                  min={0}
                  max={15}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Retry Automático para Timeouts</Label>
                  <Switch checked={retryEnabled} onCheckedChange={setRetryEnabled} />
                </div>
                <p className="text-xs text-slate-500">Tenta novamente automaticamente em caso de erro técnico</p>
              </div>

              <div className="space-y-2">
                <Label>Ordem de Métodos Alternativos</Label>
                <div className="space-y-2">
                  {['PIX', 'Outro Cartão', 'Boleto Parcelado'].map((method, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                      <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-sm">{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              <SimulatedActionButton
                actionLabel="Configurações salvas"
                icon={CheckCircle}
              >
                Salvar Configurações
              </SimulatedActionButton>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Scenario Simulation Modal */}
      <Dialog open={scenarioModalOpen} onOpenChange={setScenarioModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Simulação de Recuperação</DialogTitle>
          </DialogHeader>
          
          {selectedScenario && renderScenarioAction()}

          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-sm font-semibold text-green-700">
              ✅ Taxa estimada de recuperação: {scenarios.find(s => s.id === selectedScenario)?.recovery}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}