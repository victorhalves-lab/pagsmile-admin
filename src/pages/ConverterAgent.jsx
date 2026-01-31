import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DynamicKpiCard from '@/components/common/DynamicKpiCard';
import MetricImpactCard from '@/components/common/MetricImpactCard';
import SimulatedCheckoutIframe from '@/components/common/SimulatedCheckoutIframe';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shuffle, TrendingUp, MousePointerClick, Eye, Zap, Smartphone, Monitor, Globe, Clock, Target, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts';

export default function ConverterAgent() {
  const [layout, setLayout] = useState('1-step');
  const [methodsOrder, setMethodsOrder] = useState(['pix', 'credit', 'debit']);
  const [hideOptionalFields, setHideOptionalFields] = useState(false);
  const [conversionRate, setConversionRate] = useState(72);

  const abTestData = [
    { variant: '1-step', conversion: 78, lift: '+3%' },
    { variant: '2-steps', conversion: 72, lift: 'baseline' },
    { variant: 'PIX first', conversion: 80, lift: '+8%' },
    { variant: 'Card first', conversion: 74, lift: '+2%' }
  ];

  const abandonmentData = [
    { step: 'Método Pagto', rate: 15, improved: 8 },
    { step: 'Form Cartão', rate: 8, improved: 5 },
    { step: '3DS', rate: 5, improved: 3 },
    { step: 'Loading', rate: 3, improved: 1 }
  ];

  const deviceData = [
    { device: 'Mobile', share: 68, conversion: 72 },
    { device: 'Desktop', share: 28, conversion: 85 },
    { device: 'Tablet', share: 4, conversion: 78 }
  ];

  const dynamicRules = [
    { condition: 'Mobile BR', action: 'PIX primeiro', impact: '+12% conversão' },
    { condition: 'Desktop B2B', action: 'Cartão corporativo destacado', impact: '+8% ticket' },
    { condition: 'Rede lenta', action: 'Layout simplificado', impact: '-45% abandono' },
    { condition: 'Retorno', action: 'Método salvo pré-selecionado', impact: '+25% velocidade' },
    { condition: 'Alto valor', action: 'Parcelamento destacado', impact: '+18% conversão' }
  ];

  const handleMethodReorder = (newOrder) => {
    setMethodsOrder(newOrder);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agente Converter"
        subtitle="Otimizador de Checkout e Conversão - Maximize conclusões de pagamento"
        icon={Shuffle}
        breadcrumbs={[
          { label: 'AI Agents' },
          { label: 'Converter Agent' }
        ]}
      />

      <Tabs defaultValue="simulator">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulator">Simulador</TabsTrigger>
          <TabsTrigger value="experiments">A/B Tests</TabsTrigger>
          <TabsTrigger value="insights">Insights de UX</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="simulator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Checkout Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Prévia do Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimulatedCheckoutIframe
                    layout={layout}
                    methodsOrder={methodsOrder}
                    hideOptionalFields={hideOptionalFields}
                    onConversionRateUpdate={setConversionRate}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Configurações de Teste</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Layout do Checkout</Label>
                    <RadioGroup value={layout} onValueChange={setLayout}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-step" id="1step" />
                        <Label htmlFor="1step">1-Step (Tudo na mesma tela)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2-steps" id="2steps" />
                        <Label htmlFor="2steps">2-Steps (Dados → Pagamento)</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Ordem de Métodos de Pagamento</Label>
                    <div className="space-y-2">
                      {methodsOrder.map((method, idx) => (
                        <div key={method} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                          <span className="w-6 h-6 rounded-full bg-[#2bc196] text-white flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-sm capitalize">{method === 'pix' ? 'PIX' : method === 'credit' ? 'Crédito' : 'Débito'}</span>
                          {idx === 0 && (
                            <Badge className="ml-auto bg-[#2bc196]">Recomendado</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Esconder Campos Opcionais</Label>
                    <Switch checked={hideOptionalFields} onCheckedChange={setHideOptionalFields} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="experiments" className="space-y-4">
          {/* Impact Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricImpactCard
              metricName="Taxa de Conversão"
              before={65}
              after={80}
              unit="%"
              description="Com otimização dinâmica"
              target={85}
            />
            <MetricImpactCard
              metricName="Taxa de Abandono"
              before={35}
              after={20}
              unit="%"
              description="Redução significativa"
              target={15}
            />
            <MetricImpactCard
              metricName="Tempo de Checkout"
              before={180}
              after={45}
              unit="s"
              description="Experiência mais rápida"
              target={30}
            />
            <MetricImpactCard
              metricName="Revenue Incremental"
              before={0}
              after={18.4}
              unit="k R$"
              description="Este mês"
              target={25}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resultados de Experimentos A/B</CardTitle>
                <CardDescription>Comparação de variantes testadas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={abTestData}>
                    <XAxis dataKey="variant" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="conversion" fill="#2bc196" name="Taxa de Conversão %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">
                    🏆 Recomendação do Agente: Layout "PIX first" com 80% de conversão (+8% lift)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Dispositivo</CardTitle>
                <CardDescription>Conversão segmentada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((d) => (
                    <div key={d.device} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {d.device === 'Mobile' && <Smartphone className="w-4 h-4 text-blue-600" />}
                          {d.device === 'Desktop' && <Monitor className="w-4 h-4 text-purple-600" />}
                          {d.device === 'Tablet' && <Globe className="w-4 h-4 text-amber-600" />}
                          <span className="text-sm font-medium">{d.device}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-500">{d.share}% tráfego</span>
                          <Badge className="bg-green-100 text-green-700">{d.conversion}% conv.</Badge>
                        </div>
                      </div>
                      <Progress value={d.conversion} className="h-2" />
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-700">
                    💡 <strong>Insight:</strong> Mobile tem menor conversão mas maior volume. Priorize otimização mobile.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hotspots de Abandono</CardTitle>
                <CardDescription>Antes vs Depois das otimizações</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={abandonmentData} layout="vertical">
                    <XAxis type="number" domain={[0, 20]} />
                    <YAxis dataKey="step" type="category" width={100} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rate" fill="#ef4444" name="Antes" />
                    <Bar dataKey="improved" fill="#2bc196" name="Depois" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start gap-2 text-xs">
                    <Eye className="w-4 h-4 text-[#2bc196] mt-0.5" />
                    <div>
                      <p className="font-semibold">Insight Principal:</p>
                      <p className="text-slate-600">Abandono na escolha de método caiu de 15% para 8% com simplificação.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regras de Personalização Dinâmica</CardTitle>
                <CardDescription>Ajustes automáticos baseados em contexto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dynamicRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Target className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{rule.condition}</p>
                          <p className="text-xs text-slate-500">{rule.action}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">{rule.impact}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Simulator with Dynamic Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-600" />
                Simulador de Checkout Dinâmico
              </CardTitle>
              <CardDescription>Veja como o checkout se adapta em tempo real</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => {
                  setLayout('1-step');
                  setMethodsOrder(['pix', 'credit', 'debit']);
                }}>
                  <Smartphone className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium">Simular Mobile BR</span>
                  <span className="text-xs text-slate-500">PIX first, 1-step</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => {
                  setLayout('2-steps');
                  setMethodsOrder(['credit', 'debit', 'pix']);
                }}>
                  <Monitor className="w-6 h-6 text-purple-600" />
                  <span className="text-sm font-medium">Simular Desktop B2B</span>
                  <span className="text-xs text-slate-500">Card first, 2-steps</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" onClick={() => {
                  setLayout('1-step');
                  setHideOptionalFields(true);
                }}>
                  <Clock className="w-6 h-6 text-amber-600" />
                  <span className="text-sm font-medium">Simular Rede Lenta</span>
                  <span className="text-xs text-slate-500">Layout simplificado</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Experimentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Modelo de Experimentação</Label>
                <RadioGroup defaultValue="bandit">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ab" id="ab" />
                    <Label htmlFor="ab">A/B Testing Clássico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="abn" id="abn" />
                    <Label htmlFor="abn">A/B/n Testing (múltiplas variantes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bandit" id="bandit" />
                    <Label htmlFor="bandit">Multi-Armed Bandit (recomendado)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Regras de Personalização</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm">Mobile BR → PIX primeiro</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm">Desktop B2B → Cartão corporativo</span>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm">Rede lenta → Layout simplificado</span>
                    <Switch checked={true} />
                  </div>
                </div>
              </div>

              <SimulatedActionButton
                actionLabel="Experimentos configurados"
                icon={Zap}
              >
                Aplicar Configurações
              </SimulatedActionButton>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}