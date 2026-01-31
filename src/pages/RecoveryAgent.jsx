import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  CreditCard,
  QrCode,
  Smartphone,
  Mail,
  MessageSquare,
  Bell,
  Clock,
  Zap,
  Play,
  Settings,
  Target,
  BarChart3,
  Sparkles,
  Phone,
  Send,
  ChevronRight,
  Loader2,
  WalletCards,
  Split,
  RotateCcw,
  Percent
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import { processRecoveryAgentMessage, recoveryAgentQuickPrompts } from '@/components/agents/RecoveryAgentChatLogic';

export default function RecoveryAgent() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [recoveryResult, setRecoveryResult] = useState(null);
  const [liveMode, setLiveMode] = useState(false);
  const [liveFeed, setLiveFeed] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nlScenarioInput, setNlScenarioInput] = useState('');

  // KPIs
  const kpis = {
    gmvAtRisk: 'R$ 127.450',
    gmvRecovered: 'R$ 68.230',
    recoveryRate: '53.5%',
    avgResponseTime: '0.8s',
    avoidableLosses: 'R$ 32.180',
    communicationsSent: 4250
  };

  // Scenarios with detailed actions
  const scenarios = [
    {
      id: 'nsf',
      name: 'Saldo Insuficiente',
      description: 'Cliente não tem saldo suficiente no cartão',
      icon: WalletCards,
      color: 'amber',
      impact: '35%',
      recoveryRate: '62%',
      actions: [
        { type: 'primary', label: 'Oferecer PIX com 5% desconto', icon: QrCode },
        { type: 'secondary', label: 'Sugerir outro cartão', icon: CreditCard },
        { type: 'fallback', label: 'Enviar link por WhatsApp', icon: MessageSquare }
      ],
      checkoutAction: {
        title: 'Ops! Saldo insuficiente',
        message: 'Que tal pagar com PIX e ganhar 5% de desconto?',
        primaryButton: 'Pagar com PIX (R$ 142,50)',
        secondaryButton: 'Usar Outro Cartão'
      }
    },
    {
      id: 'limit',
      name: 'Limite Excedido',
      description: 'Valor da compra excede o limite disponível',
      icon: AlertTriangle,
      color: 'red',
      impact: '25%',
      recoveryRate: '48%',
      actions: [
        { type: 'primary', label: 'Dividir em 2 cartões', icon: Split },
        { type: 'secondary', label: 'Parcelar valor', icon: CreditCard },
        { type: 'fallback', label: 'Oferecer PIX', icon: QrCode }
      ],
      checkoutAction: {
        title: 'Limite excedido neste cartão',
        message: 'Divida o pagamento em dois cartões para concluir a compra.',
        primaryButton: 'Dividir Pagamento',
        secondaryButton: 'Pagar Metade Agora'
      }
    },
    {
      id: 'pix_pending',
      name: 'PIX Não Finalizado',
      description: 'Cliente gerou QR Code mas não pagou',
      icon: QrCode,
      color: 'blue',
      impact: '20%',
      recoveryRate: '71%',
      actions: [
        { type: 'primary', label: 'Enviar lembrete WhatsApp', icon: MessageSquare },
        { type: 'secondary', label: 'Estender prazo do QR', icon: Clock },
        { type: 'fallback', label: 'Oferecer cartão', icon: CreditCard }
      ],
      checkoutAction: {
        title: 'Seu PIX ainda está aberto!',
        message: 'O QR Code expira em 15 minutos. Escaneie agora para garantir sua compra.',
        primaryButton: 'Ver QR Code Novamente',
        secondaryButton: 'Pagar com Cartão'
      }
    },
    {
      id: 'abandon',
      name: 'Abandono de Checkout',
      description: 'Cliente saiu antes de concluir',
      icon: XCircle,
      color: 'slate',
      impact: '40%',
      recoveryRate: '35%',
      actions: [
        { type: 'primary', label: 'Email de recuperação', icon: Mail },
        { type: 'secondary', label: 'Push notification', icon: Bell },
        { type: 'fallback', label: 'WhatsApp com desconto', icon: MessageSquare }
      ],
      checkoutAction: {
        title: 'Você esqueceu algo!',
        message: 'Seus itens ainda estão no carrinho. Finalize em até 30min e ganhe frete grátis!',
        primaryButton: 'Finalizar Compra',
        secondaryButton: 'Ver Carrinho'
      }
    },
    {
      id: 'timeout',
      name: 'Erro Técnico / Timeout',
      description: 'Falha na comunicação com adquirente',
      icon: RotateCcw,
      color: 'purple',
      impact: '10%',
      recoveryRate: '85%',
      actions: [
        { type: 'primary', label: 'Retry automático', icon: RefreshCw },
        { type: 'secondary', label: 'Roteamento alternativo', icon: ArrowRight },
        { type: 'fallback', label: 'Oferecer PIX', icon: QrCode }
      ],
      checkoutAction: {
        title: 'Processando novamente...',
        message: 'Detectamos uma instabilidade. Tentando novamente automaticamente.',
        primaryButton: 'Aguarde...',
        secondaryButton: 'Tentar com PIX'
      }
    }
  ];

  // Channel performance data
  const channelData = [
    { channel: 'WhatsApp', sent: 1250, converted: 438, rate: 35 },
    { channel: 'Email', sent: 2100, converted: 420, rate: 20 },
    { channel: 'SMS', sent: 850, converted: 170, rate: 20 },
    { channel: 'Push', sent: 950, converted: 143, rate: 15 }
  ];

  // Recovery evolution
  const recoveryEvolution = [
    { month: 'Set', atRisk: 85, recovered: 42 },
    { month: 'Out', atRisk: 92, recovered: 48 },
    { month: 'Nov', atRisk: 105, recovered: 55 },
    { month: 'Dez', atRisk: 118, recovered: 62 },
    { month: 'Jan', atRisk: 127, recovered: 68 }
  ];

  // Live feed simulation
  useEffect(() => {
    if (liveMode) {
      const events = [
        { customer: 'João S.', amount: 289, scenario: 'NSF', action: 'PIX oferecido', status: 'pending' },
        { customer: 'Maria L.', amount: 450, scenario: 'Limite', action: 'Split aceito', status: 'recovered' },
        { customer: 'Carlos M.', amount: 178, scenario: 'Abandono', action: 'WhatsApp enviado', status: 'pending' },
        { customer: 'Ana P.', amount: 890, scenario: 'Timeout', action: 'Retry sucesso', status: 'recovered' },
        { customer: 'Pedro R.', amount: 345, scenario: 'PIX Pendente', action: 'Lembrete enviado', status: 'pending' }
      ];

      const interval = setInterval(() => {
        const event = events[Math.floor(Math.random() * events.length)];
        setLiveFeed(prev => [{
          ...event,
          id: Date.now(),
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 8));
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [liveMode]);

  // Run scenario simulation
  const runSimulation = (scenario) => {
    setSelectedScenario(scenario);
    setIsSimulating(true);
    setSimulationStep(0);
    setRecoveryResult(null);

    // Simulate step by step
    const steps = [
      { step: 1, label: 'Detectando falha...', delay: 800 },
      { step: 2, label: 'Analisando contexto...', delay: 1000 },
      { step: 3, label: 'Selecionando ação...', delay: 800 },
      { step: 4, label: 'Executando recuperação...', delay: 1200 }
    ];

    let currentStep = 0;
    const runStep = () => {
      if (currentStep < steps.length) {
        setSimulationStep(currentStep + 1);
        currentStep++;
        setTimeout(runStep, steps[currentStep - 1]?.delay || 800);
      } else {
        // Simulation complete
        const success = Math.random() < parseFloat(scenario.recoveryRate) / 100;
        setRecoveryResult(success ? 'recovered' : 'failed');
        setIsSimulating(false);
      }
    };

    setTimeout(runStep, 500);
  };

  const getColorClass = (color) => {
    const colors = {
      amber: 'bg-amber-100 text-amber-700 border-amber-200',
      red: 'bg-red-100 text-red-700 border-red-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/25">
            <RefreshCw className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Recovery Agent</h1>
            <p className="text-slate-500 dark:text-slate-400">Agente Recuperador de Pagamentos em Tempo Real</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className={`w-2 h-2 rounded-full ${liveMode ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="text-sm font-medium text-orange-600">
              {liveMode ? 'Monitorando em tempo real' : 'Modo simulação'}
            </span>
          </div>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-amber-600">GMV em Risco</span>
          </div>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{kpis.gmvAtRisk}</p>
        </Card>

        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600">GMV Recuperado</span>
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{kpis.gmvRecovered}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Taxa Recovery</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.recoveryRate}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Tempo Resposta</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.avgResponseTime}</p>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs text-red-600">Perdas Evitáveis</span>
          </div>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{kpis.avoidableLosses}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-500">Comunicações</span>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.communicationsSent.toLocaleString()}</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="simulator">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator">Simulador Interativo</TabsTrigger>
          <TabsTrigger value="scenarios">Cenários de Recuperação</TabsTrigger>
          <TabsTrigger value="communications">Comunicações</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="space-y-6">
          {/* Natural Language Scenario Input */}
          <Card className="border-orange-500/20 bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-900/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                Descrever Cenário em Linguagem Natural
              </CardTitle>
              <CardDescription>Descreva um cenário de falha e a IA sugerirá a melhor estratégia de recuperação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder="Ex: Simule uma transação de R$ 500 que falhou por saldo insuficiente de um cliente novo que está tentando comprar pela primeira vez..."
                  value={nlScenarioInput}
                  onChange={(e) => setNlScenarioInput(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    disabled={!nlScenarioInput.trim()}
                    onClick={() => {
                      alert(`IA analisou: "${nlScenarioInput}"\n\nRecomendação: Enviar WhatsApp com oferta de PIX (5% desconto). Taxa estimada: 58% de sucesso.`);
                      setNlScenarioInput('');
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analisar com IA
                  </Button>
                  <Button variant="outline" onClick={() => setNlScenarioInput('')}>
                    Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario Selection */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Ou Selecione um Cenário</CardTitle>
                  <CardDescription>Simule como o agente reage a cada tipo de falha</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {scenarios.map((scenario) => (
                    <button
                      key={scenario.id}
                      onClick={() => runSimulation(scenario)}
                      disabled={isSimulating}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                        selectedScenario?.id === scenario.id
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'
                      } ${isSimulating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(scenario.color)}`}>
                          <scenario.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-900 dark:text-white">{scenario.name}</p>
                          <p className="text-xs text-slate-500">{scenario.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {scenario.recoveryRate}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Simulation Display */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="w-5 h-5 text-orange-500" />
                    Simulação de Recuperação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedScenario ? (
                    <div className="h-80 flex items-center justify-center text-center">
                      <div>
                        <RefreshCw className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
                          Selecione um cenário para simular
                        </p>
                        <p className="text-sm text-slate-500">
                          Veja como o agente reage em tempo real
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Progress Steps */}
                      <div className="flex items-center justify-between mb-6">
                        {['Detectar', 'Analisar', 'Selecionar', 'Executar'].map((step, idx) => (
                          <div key={step} className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              simulationStep > idx
                                ? 'bg-green-500 text-white'
                                : simulationStep === idx + 1
                                ? 'bg-orange-500 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-500'
                            }`}>
                              {simulationStep > idx ? '✓' : idx + 1}
                            </div>
                            {idx < 3 && (
                              <div className={`w-16 h-1 mx-2 ${
                                simulationStep > idx ? 'bg-green-500' : 'bg-slate-200'
                              }`} />
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Checkout Action Preview */}
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 dark:bg-slate-800">
                        <div className="text-center mb-4">
                          <span className="text-xs text-slate-500 uppercase tracking-wider">Preview do Checkout</span>
                        </div>
                        
                        <div className={`max-w-sm mx-auto bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 border ${
                          isSimulating ? 'animate-pulse' : ''
                        }`}>
                          <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${getColorClass(selectedScenario.color)}`}>
                            <selectedScenario.icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-semibold text-center text-slate-900 dark:text-white mb-2">
                            {selectedScenario.checkoutAction.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 text-center mb-4">
                            {selectedScenario.checkoutAction.message}
                          </p>
                          
                          <div className="space-y-2">
                            <Button className="w-full bg-[#2bc196] hover:bg-[#2bc196]/90" disabled={isSimulating}>
                              {isSimulating ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              ) : null}
                              {selectedScenario.checkoutAction.primaryButton}
                            </Button>
                            <Button variant="outline" className="w-full" disabled={isSimulating}>
                              {selectedScenario.checkoutAction.secondaryButton}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Result */}
                      {recoveryResult && (
                        <div className={`p-4 rounded-lg border-2 ${
                          recoveryResult === 'recovered'
                            ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-300 bg-red-50 dark:bg-red-900/20'
                        }`}>
                          <div className="flex items-center gap-3">
                            {recoveryResult === 'recovered' ? (
                              <CheckCircle2 className="w-8 h-8 text-green-600" />
                            ) : (
                              <XCircle className="w-8 h-8 text-red-600" />
                            )}
                            <div>
                              <p className={`font-semibold ${
                                recoveryResult === 'recovered' ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {recoveryResult === 'recovered'
                                  ? '✅ Pagamento Recuperado!'
                                  : '❌ Recuperação não concluída'}
                              </p>
                              <p className="text-sm text-slate-600">
                                {recoveryResult === 'recovered'
                                  ? 'O cliente concluiu o pagamento com o método alternativo.'
                                  : 'Cliente não respondeu. Comunicação proativa será enviada.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions List */}
                      <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Ações Disponíveis</h4>
                        <div className="grid grid-cols-3 gap-3">
                          {selectedScenario.actions.map((action, idx) => (
                            <div 
                              key={idx}
                              className={`p-3 rounded-lg border text-center ${
                                action.type === 'primary'
                                  ? 'border-[#2bc196] bg-[#2bc196]/5'
                                  : action.type === 'secondary'
                                  ? 'border-blue-200 bg-blue-50'
                                  : 'border-slate-200 bg-slate-50'
                              }`}
                            >
                              <action.icon className={`w-6 h-6 mx-auto mb-2 ${
                                action.type === 'primary' ? 'text-[#2bc196]' : 
                                action.type === 'secondary' ? 'text-blue-600' : 'text-slate-500'
                              }`} />
                              <p className="text-xs font-medium">{action.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Live Feed */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${liveMode ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                  <CardTitle className="text-sm">Feed de Recuperações em Tempo Real</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Ativar</Label>
                  <Switch checked={liveMode} onCheckedChange={setLiveMode} />
                </div>
              </div>
            </CardHeader>
            {liveMode && liveFeed.length > 0 && (
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {liveFeed.map((event) => (
                    <div 
                      key={event.id}
                      className={`flex items-center justify-between p-3 rounded-lg text-sm ${
                        event.status === 'recovered'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {event.status === 'recovered' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-600" />
                        )}
                        <div>
                          <span className="font-medium">{event.customer}</span>
                          <span className="text-slate-500 mx-2">•</span>
                          <span className="text-slate-600">R$ {event.amount}</span>
                          <span className="text-slate-500 mx-2">→</span>
                          <span className={event.status === 'recovered' ? 'text-green-600' : 'text-amber-600'}>
                            {event.action}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{event.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Cenário de Falha</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scenarios.map(s => ({
                  name: s.name,
                  impacto: parseFloat(s.impact),
                  recuperacao: parseFloat(s.recoveryRate)
                }))}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="impacto" fill="#94a3b8" name="% Impacto nas Perdas" />
                  <Bar dataKey="recuperacao" fill="#2bc196" name="% Taxa de Recuperação" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClass(scenario.color)}`}>
                      <scenario.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm">{scenario.name}</CardTitle>
                      <CardDescription className="text-xs">{scenario.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Impacto nas perdas:</span>
                      <span className="font-medium">{scenario.impact}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Taxa de recuperação:</span>
                      <Badge className="bg-green-100 text-green-700">{scenario.recoveryRate}</Badge>
                    </div>
                    <Progress value={parseFloat(scenario.recoveryRate)} className="h-2" />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => runSimulation(scenario)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Simular Cenário
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Communications Tab */}
        <TabsContent value="communications" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={channelData}>
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

            <Card>
              <CardHeader>
                <CardTitle>Exemplos de Mensagens</CardTitle>
                <CardDescription>Comunicações enviadas automaticamente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-medium text-green-700">WhatsApp - Saldo Insuficiente</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    "Oi João! 👋 Vi que houve um probleminha no pagamento. Que tal tentar com PIX? Te dou 5% de desconto! 💚"
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">Email - Abandono de Carrinho</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    "Seus itens ainda estão no carrinho! Complete seu pedido nos próximos 30min e ganhe frete grátis."
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">SMS - PIX Pendente</span>
                  </div>
                  <p className="text-sm text-slate-700">
                    "Seu PIX expira em 10min! Acesse o link para finalizar: [link]. Responda AJUDA para suporte."
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Recuperação (R$ mil)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recoveryEvolution}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="atRisk" stroke="#94a3b8" strokeWidth={2} name="GMV em Risco" />
                  <Line type="monotone" dataKey="recovered" stroke="#2bc196" strokeWidth={3} name="GMV Recuperado" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Agent Chat Interface */}
      <AgentChatInterface
        agentName="recovery_agent"
        agentDisplayName="Recovery Agent"
        agentDescription="Assistente de recuperação de pagamentos"
        quickPrompts={recoveryAgentQuickPrompts}
        onProcessMessage={processRecoveryAgentMessage}
        welcomeMessage="Olá! 👋 Sou o Recovery Agent, seu assistente para recuperação de pagamentos. Posso ajudar a analisar transações, sugerir comunicações e maximizar sua taxa de recuperação. Como posso ajudar?"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        accentColor="#f97316"
      />

      {/* Floating Button */}
      <AgentFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        agentName="Recovery Agent"
        accentColor="#f97316"
      />
    </div>
  );
}