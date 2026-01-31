import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import DynamicKpiCard from '@/components/common/DynamicKpiCard';
import SimulatedCheckoutIframe from '@/components/common/SimulatedCheckoutIframe';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Shuffle, TrendingUp, MousePointerClick, Eye, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ConverterAgent() {
  const [layout, setLayout] = useState('1-step');
  const [methodsOrder, setMethodsOrder] = useState(['pix', 'credit', 'debit']);
  const [hideOptionalFields, setHideOptionalFields] = useState(false);
  const [conversionRate, setConversionRate] = useState(72);

  const abTestData = [
    { variant: '1-step', conversion: 78 },
    { variant: '2-steps', conversion: 72 },
    { variant: 'PIX first', conversion: 80 },
    { variant: 'Card first', conversion: 74 }
  ];

  const abandonmentData = [
    { step: 'Método Pagto', rate: 15 },
    { step: 'Form Cartão', rate: 8 },
    { step: '3DS', rate: 5 },
    { step: 'Loading', rate: 3 }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DynamicKpiCard
              title="Taxa de Conversão"
              value={conversionRate + "%"}
              trend="up"
              trendValue="+8%"
              icon={TrendingUp}
              color="primary"
            />
            <DynamicKpiCard
              title="Taxa de Abandono"
              value="28%"
              trend="down"
              trendValue="-5%"
              icon={MousePointerClick}
              color="blue"
            />
            <DynamicKpiCard
              title="Receita Incrementada"
              value="R$ 18.4k"
              description="Devido às otimizações"
              icon={Zap}
              color="amber"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resultados de Experimentos A/B</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={abTestData}>
                  <XAxis dataKey="variant" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="conversion" fill="#2bc196" name="Taxa de Conversão %" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-700">
                  🏆 Recomendação do Agente: Layout "PIX first" com 80% de conversão
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hotspots de Abandono</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={abandonmentData} layout="horizontal">
                  <XAxis type="number" domain={[0, 20]} />
                  <YAxis dataKey="step" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#ef4444" name="% Abandono" />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                <div className="flex items-start gap-2 text-xs">
                  <Eye className="w-4 h-4 text-[#2bc196] mt-0.5" />
                  <div>
                    <p className="font-semibold">Insight Principal:</p>
                    <p className="text-slate-600">15% abandonam na escolha de método de pagamento. Simplificar para 2-3 opções pode reduzir isso para 8%.</p>
                  </div>
                </div>
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