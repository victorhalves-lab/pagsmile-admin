import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  CreditCard,
  QrCode,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Zap,
  Settings,
  Target,
  BarChart3,
  Sparkles,
  ChevronRight,
  Eye,
  MousePointer,
  Shuffle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  Globe,
  Wifi,
  WifiOff,
  Users,
  ShoppingCart,
  Percent
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend, FunnelChart, Funnel, LabelList, Cell } from 'recharts';
import AgentChatInterface from '@/components/agents/AgentChatInterface';
import AgentFloatingButton from '@/components/agents/AgentFloatingButton';
import { processConverterAgentMessage, converterAgentQuickPrompts } from '@/components/agents/ConverterAgentChatLogic';

export default function ConverterAgent() {
  // Control states
  const [layout, setLayout] = useState('1-step');
  const [methodsOrder, setMethodsOrder] = useState(['pix', 'credit', 'debit']);
  const [hideOptionalFields, setHideOptionalFields] = useState(false);
  const [showInstallments, setShowInstallments] = useState(true);
  const [pixDiscount, setPixDiscount] = useState([5]);
  const [buttonText, setButtonText] = useState('Pagar Agora');
  const [networkSpeed, setNetworkSpeed] = useState('fast');
  const [deviceType, setDeviceType] = useState('mobile');
  
  // Metrics
  const [conversionRate, setConversionRate] = useState(72);
  const [abandonRate, setAbandonRate] = useState(28);
  const [liftPercentage, setLiftPercentage] = useState(0);
  
  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nlScenarioInput, setNlScenarioInput] = useState('');

  // Calculate metrics based on controls
  useEffect(() => {
    let baseConversion = 68;
    let lift = 0;

    // Layout impact
    if (layout === '1-step') {
      baseConversion += 3;
      lift += 3;
    }

    // Methods order impact
    if (methodsOrder[0] === 'pix') {
      baseConversion += 5;
      lift += 5;
    }

    // Hide optional fields impact
    if (hideOptionalFields) {
      baseConversion += 2;
      lift += 2;
    }

    // PIX discount impact
    if (pixDiscount[0] > 0) {
      baseConversion += Math.min(pixDiscount[0] * 0.5, 4);
      lift += Math.min(pixDiscount[0] * 0.5, 4);
    }

    // Network speed impact
    if (networkSpeed === 'slow') {
      baseConversion -= 8;
    }

    // Device type impact
    if (deviceType === 'desktop') {
      baseConversion += 4;
    } else if (deviceType === 'tablet') {
      baseConversion += 2;
    }

    setConversionRate(Math.min(Math.round(baseConversion), 95));
    setAbandonRate(100 - Math.min(Math.round(baseConversion), 95));
    setLiftPercentage(Math.round(lift));
  }, [layout, methodsOrder, hideOptionalFields, pixDiscount, networkSpeed, deviceType]);

  // KPIs
  const kpis = {
    currentConversion: '74.2%',
    conversionChange: '+6.8%',
    abandonRate: '25.8%',
    abandonChange: '-5.2%',
    avgCheckoutTime: '47s',
    timeChange: '-38s',
    incrementalRevenue: 'R$ 42.350',
    revenueChange: '+18%'
  };

  // A/B Test Results
  const abTestResults = [
    { variant: 'Controle (2-steps)', conversion: 68, sessions: 12450, status: 'baseline' },
    { variant: 'PIX First', conversion: 76, sessions: 12380, status: 'winner', lift: '+11.8%' },
    { variant: '1-Step Layout', conversion: 74, sessions: 12290, status: 'positive', lift: '+8.8%' },
    { variant: 'Campos Reduzidos', conversion: 72, sessions: 12510, status: 'positive', lift: '+5.9%' }
  ];

  // Funnel data
  const funnelData = [
    { name: 'Início Checkout', value: 10000, rate: '100%' },
    { name: 'Seleção Método', value: 8500, rate: '85%' },
    { name: 'Preenchimento', value: 7200, rate: '72%' },
    { name: 'Confirmação', value: 6800, rate: '68%' },
    { name: 'Pagamento', value: 7420, rate: '74.2%' }
  ];

  // Device performance
  const deviceData = [
    { device: 'Mobile', icon: Smartphone, share: 68, conversion: 72, trend: 'up' },
    { device: 'Desktop', icon: Monitor, share: 28, conversion: 82, trend: 'stable' },
    { device: 'Tablet', icon: Tablet, share: 4, conversion: 76, trend: 'up' }
  ];

  // Dynamic personalization rules
  const personalizationRules = [
    { condition: 'Mobile BR', action: 'PIX primeiro', impact: '+12%', active: true },
    { condition: 'Desktop B2B', action: 'Cartão corporativo', impact: '+8%', active: true },
    { condition: 'Rede lenta', action: 'Layout simplificado', impact: '-45% abandono', active: true },
    { condition: 'Cliente recorrente', action: 'Método salvo', impact: '+25% velocidade', active: true },
    { condition: 'Ticket > R$ 500', action: 'Parcelamento destacado', impact: '+18%', active: false }
  ];

  const moveMethodUp = (index) => {
    if (index === 0) return;
    const newOrder = [...methodsOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setMethodsOrder(newOrder);
  };

  const getMethodLabel = (method) => {
    const labels = { pix: 'PIX', credit: 'Crédito', debit: 'Débito' };
    return labels[method] || method;
  };

  const getMethodIcon = (method) => {
    if (method === 'pix') return QrCode;
    return CreditCard;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Shuffle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Converter Agent</h1>
            <p className="text-slate-500 dark:text-slate-400">Otimizador de Checkout e Conversão</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <TrendingUp className="w-3 h-3 mr-1" />
            +{liftPercentage}% lift atual
          </Badge>
          <Link to={createPageUrl('ConverterAgentSettings')}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-green-600">Taxa de Conversão</span>
            <Badge className="bg-green-500 text-white text-xs">{kpis.conversionChange}</Badge>
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">{kpis.currentConversion}</p>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-red-600">Taxa de Abandono</span>
            <Badge className="bg-green-500 text-white text-xs">{kpis.abandonChange}</Badge>
          </div>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">{kpis.abandonRate}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-500">Tempo Médio</span>
            <Badge variant="outline" className="text-xs border-green-500 text-green-600">{kpis.timeChange}</Badge>
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{kpis.avgCheckoutTime}</p>
        </Card>

        <Card className="p-4 bg-[#2bc196]/10 border-[#2bc196]/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#2bc196]">Revenue Incremental</span>
            <Badge className="bg-[#2bc196] text-white text-xs">{kpis.revenueChange}</Badge>
          </div>
          <p className="text-2xl font-bold text-[#2bc196]">{kpis.incrementalRevenue}</p>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="simulator">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator">Simulador Interativo</TabsTrigger>
          <TabsTrigger value="ab-tests">Resultados A/B</TabsTrigger>
          <TabsTrigger value="insights">Insights de UX</TabsTrigger>
          <TabsTrigger value="rules">Personalização</TabsTrigger>
        </TabsList>

        {/* Simulator Tab */}
        <TabsContent value="simulator" className="space-y-6">
          {/* Natural Language Scenario Input */}
          <Card className="border-blue-500/20 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Descrever Cenário de Checkout em Linguagem Natural
              </CardTitle>
              <CardDescription>Descreva como quer configurar o checkout e veja o impacto estimado na conversão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Textarea
                  placeholder="Ex: Simule um checkout para produtos de alto valor com parcelamento em até 12x sem juros, PIX com 5% de desconto e frete grátis para compras acima de R$ 200..."
                  value={nlScenarioInput}
                  onChange={(e) => setNlScenarioInput(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    disabled={!nlScenarioInput.trim()}
                    onClick={() => {
                      alert(`IA analisou: "${nlScenarioInput}"\n\nImpacto Estimado:\n• Conversão: +14.2%\n• MRR Adicional: R$ 32.450/mês\n• Abandono: -8.5%\n\nCenário otimizado para alto ticket com benefícios claros!`);
                      setNlScenarioInput('');
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Simular com IA
                  </Button>
                  <Button variant="outline" onClick={() => setNlScenarioInput('')}>
                    Limpar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Controls Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Ou Use Controles de Otimização
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Layout */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Layout do Checkout</Label>
                    <RadioGroup value={layout} onValueChange={setLayout}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-step" id="1step" />
                        <Label htmlFor="1step" className="text-sm">1-Step (tudo na mesma tela)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2-steps" id="2steps" />
                        <Label htmlFor="2steps" className="text-sm">2-Steps (dados → pagamento)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Methods Order */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Ordem dos Métodos de Pagamento</Label>
                    <div className="space-y-2">
                      {methodsOrder.map((method, idx) => {
                        const MethodIcon = getMethodIcon(method);
                        return (
                          <div 
                            key={method}
                            className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-move"
                            onClick={() => moveMethodUp(idx)}
                          >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0 ? 'bg-[#2bc196] text-white' : 'bg-slate-200 text-slate-600'
                            }`}>
                              {idx + 1}
                            </span>
                            <MethodIcon className="w-4 h-4 text-slate-500" />
                            <span className="text-sm">{getMethodLabel(method)}</span>
                            {idx === 0 && (
                              <Badge className="ml-auto bg-[#2bc196] text-white text-[10px]">Destaque</Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-500">Clique para mover para cima</p>
                  </div>

                  {/* PIX Discount */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Desconto PIX: {pixDiscount}%</Label>
                    <Slider 
                      value={pixDiscount} 
                      onValueChange={setPixDiscount}
                      min={0}
                      max={15}
                      step={1}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Ocultar campos opcionais</Label>
                      <Switch checked={hideOptionalFields} onCheckedChange={setHideOptionalFields} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Mostrar parcelamento</Label>
                      <Switch checked={showInstallments} onCheckedChange={setShowInstallments} />
                    </div>
                  </div>

                  {/* Simulation Presets */}
                  <div className="pt-4 border-t space-y-2">
                    <Label className="text-xs font-medium">Simular Contexto</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={deviceType === 'mobile' ? 'border-blue-500 bg-blue-50' : ''}
                        onClick={() => setDeviceType('mobile')}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={deviceType === 'desktop' ? 'border-blue-500 bg-blue-50' : ''}
                        onClick={() => setDeviceType('desktop')}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={deviceType === 'tablet' ? 'border-blue-500 bg-blue-50' : ''}
                        onClick={() => setDeviceType('tablet')}
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={networkSpeed === 'fast' ? 'border-green-500 bg-green-50' : ''}
                        onClick={() => setNetworkSpeed('fast')}
                      >
                        <Wifi className="w-4 h-4 mr-1" />
                        <span className="text-xs">Rápida</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={networkSpeed === 'slow' ? 'border-amber-500 bg-amber-50' : ''}
                        onClick={() => setNetworkSpeed('slow')}
                      >
                        <WifiOff className="w-4 h-4 mr-1" />
                        <span className="text-xs">Lenta</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Checkout Preview */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview do Checkout
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {deviceType === 'mobile' && <Smartphone className="w-4 h-4 text-blue-600" />}
                      {deviceType === 'desktop' && <Monitor className="w-4 h-4 text-purple-600" />}
                      {deviceType === 'tablet' && <Tablet className="w-4 h-4 text-amber-600" />}
                      {networkSpeed === 'slow' && <WifiOff className="w-4 h-4 text-amber-500" />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Simulated Checkout */}
                  <div className={`border-2 border-dashed rounded-xl p-4 bg-slate-50 dark:bg-slate-800 ${
                    deviceType === 'mobile' ? 'max-w-sm mx-auto' : ''
                  }`}>
                    <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
                      {/* Header */}
                      <div className="bg-[#2bc196] text-white p-4 text-center">
                        <p className="font-semibold">Finalizar Compra</p>
                        <p className="text-sm opacity-90">Total: R$ 150,00</p>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-4">
                        {/* Payment Methods */}
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Escolha como pagar
                          </p>
                          {methodsOrder.map((method, idx) => {
                            const MethodIcon = getMethodIcon(method);
                            const isFirst = idx === 0;
                            return (
                              <div 
                                key={method}
                                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  isFirst 
                                    ? 'border-[#2bc196] bg-[#2bc196]/5' 
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <MethodIcon className={`w-5 h-5 ${isFirst ? 'text-[#2bc196]' : 'text-slate-400'}`} />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{getMethodLabel(method)}</p>
                                    {method === 'pix' && pixDiscount[0] > 0 && (
                                      <p className="text-xs text-green-600">
                                        {pixDiscount[0]}% de desconto • R$ {(150 * (1 - pixDiscount[0]/100)).toFixed(2)}
                                      </p>
                                    )}
                                    {method === 'credit' && showInstallments && (
                                      <p className="text-xs text-slate-500">Até 12x sem juros</p>
                                    )}
                                  </div>
                                  {isFirst && (
                                    <Badge className="bg-[#2bc196] text-white text-[10px]">
                                      Recomendado
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Form fields if 1-step */}
                        {layout === '1-step' && (
                          <div className="space-y-3 pt-2 border-t">
                            <div className="space-y-1">
                              <Label className="text-xs">Email</Label>
                              <div className="h-9 bg-slate-100 rounded-md" />
                            </div>
                            {!hideOptionalFields && (
                              <div className="space-y-1">
                                <Label className="text-xs text-slate-400">Telefone (opcional)</Label>
                                <div className="h-9 bg-slate-100 rounded-md" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* CTA Button */}
                        <Button className="w-full bg-[#2bc196] hover:bg-[#2bc196]/90 h-12 text-base font-semibold">
                          {buttonText}
                        </Button>
                      </div>
                    </div>

                    {/* Network indicator */}
                    {networkSpeed === 'slow' && (
                      <div className="mt-3 p-2 bg-amber-50 rounded-lg text-center">
                        <p className="text-xs text-amber-600">
                          ⚠️ Simulando rede lenta - Layout simplificado ativado
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Conversion Metrics */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{conversionRate}%</p>
                      <p className="text-xs text-green-600">Taxa de Conversão</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{abandonRate}%</p>
                      <p className="text-xs text-red-600">Taxa de Abandono</p>
                    </div>
                    <div className="text-center p-3 bg-[#2bc196]/10 rounded-lg">
                      <p className="text-2xl font-bold text-[#2bc196]">+{liftPercentage}%</p>
                      <p className="text-xs text-[#2bc196]">Lift Estimado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* A/B Tests Tab */}
        <TabsContent value="ab-tests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resultados de Experimentos A/B</CardTitle>
              <CardDescription>Comparação de variantes testadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTestResults.map((test, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      test.status === 'winner'
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                        : test.status === 'positive'
                        ? 'border-blue-200 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {test.status === 'winner' && (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{test.variant}</p>
                          <p className="text-sm text-slate-500">{test.sessions.toLocaleString()} sessões</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{test.conversion}%</p>
                        {test.lift && (
                          <Badge className={test.status === 'winner' ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-700'}>
                            {test.lift}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={test.conversion} className="mt-3 h-2" />
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <p className="font-semibold text-green-700">Recomendação do Converter Agent</p>
                </div>
                <p className="text-sm text-green-600">
                  Implementar variante "PIX First" como padrão. Estimativa de aumento de receita: <strong>R$ 23.450/mês</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Device Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Performance por Dispositivo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceData.map((device) => (
                  <div key={device.device} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <device.icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{device.device}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-500">{device.share}% tráfego</span>
                          <Badge className="bg-green-100 text-green-700">{device.conversion}%</Badge>
                        </div>
                      </div>
                      <Progress value={device.conversion} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Abandonment Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Funil de Abandono</CardTitle>
                <CardDescription>Onde os clientes estão saindo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {funnelData.map((step, idx) => (
                    <div key={step.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{step.name}</span>
                        <span className="font-medium">{step.rate}</span>
                      </div>
                      <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#2bc196] to-[#5cf7cf] rounded-lg flex items-center justify-end pr-3"
                          style={{ width: `${(step.value / funnelData[0].value) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-white">
                            {step.value.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  Insights de UX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700 mb-1">✅ Maior impacto</p>
                  <p className="text-sm text-green-600">
                    PIX como primeiro método aumentou conversão em 12% em mobile
                  </p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-700 mb-1">⚠️ Oportunidade</p>
                  <p className="text-sm text-amber-600">
                    Mobile tem 68% do tráfego mas menor conversão. Priorize otimização.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-700 mb-1">💡 Sugestão</p>
                  <p className="text-sm text-blue-600">
                    Remover campo telefone reduziu abandono em 5.2% na etapa de preenchimento
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Personalization Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Personalização Dinâmica</CardTitle>
              <CardDescription>Ajustes automáticos baseados em contexto do cliente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personalizationRules.map((rule, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      rule.active 
                        ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' 
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        rule.active ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{rule.condition}</p>
                        <p className="text-sm text-slate-500">{rule.action}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={rule.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}>
                        {rule.impact}
                      </Badge>
                      <Switch checked={rule.active} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Agent Chat Interface */}
      <AgentChatInterface
        agentName="converter_agent"
        agentDisplayName="Converter Agent"
        agentDescription="Otimizador de checkout e conversão"
        quickPrompts={converterAgentQuickPrompts}
        onProcessMessage={processConverterAgentMessage}
        welcomeMessage="Olá! 👋 Sou o Converter Agent, especialista em otimização de checkout. Posso ajudar a criar testes A/B, analisar conversão e criar regras de personalização. Como posso ajudar?"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        accentColor="#3b82f6"
      />

      {/* Floating Button */}
      <AgentFloatingButton
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        agentName="Converter Agent"
        accentColor="#3b82f6"
      />
    </div>
  );
}