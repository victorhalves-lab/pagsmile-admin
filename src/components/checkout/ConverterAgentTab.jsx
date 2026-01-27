import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  FlaskConical, 
  Lightbulb,
  Play,
  Pause,
  BarChart3,
  MousePointer,
  Clock,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap
} from 'lucide-react';

export default function ConverterAgentTab({ checkoutId }) {
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [abTestsEnabled, setAbTestsEnabled] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('dashboard');

  // Mock data
  const metrics = {
    conversionRate: 3.2,
    conversionRateChange: +0.4,
    lift: 12.5,
    incrementalValue: 45680,
    activeTests: 3,
    appliedOptimizations: 8
  };

  const activeTests = [
    { id: 1, name: 'Ordem de Métodos', element: 'payment_methods', variants: 2, traffic: 20, days: 5, confidence: 78, status: 'running' },
    { id: 2, name: 'Texto do Botão', element: 'pay_button', variants: 3, traffic: 15, days: 3, confidence: 45, status: 'running' },
    { id: 3, name: 'Layout Mobile', element: 'layout', variants: 2, traffic: 25, days: 7, confidence: 92, status: 'winner' },
  ];

  const suggestions = [
    { id: 1, title: 'Simplificar campo CPF', description: 'O campo CPF tem 15% de abandono. Considere usar máscara automática.', impact: 'high', effort: 'low' },
    { id: 2, title: 'Adicionar desconto Pix', description: 'Checkouts similares aumentaram conversão em 8% com desconto Pix.', impact: 'medium', effort: 'low' },
    { id: 3, title: 'Reduzir campos obrigatórios', description: '3 campos opcionais estão marcados como obrigatórios.', impact: 'medium', effort: 'medium' },
  ];

  const funnelData = [
    { step: 'Iniciou Checkout', value: 10000, percentage: 100 },
    { step: 'Preencheu Dados', value: 7500, percentage: 75 },
    { step: 'Escolheu Método', value: 5200, percentage: 52 },
    { step: 'Clicou Pagar', value: 3800, percentage: 38 },
    { step: 'Pagamento Aprovado', value: 3200, percentage: 32 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Converter Agent</h2>
            <p className="text-gray-500">Otimização automática de conversão por IA</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={agentEnabled ? 'default' : 'secondary'} className={agentEnabled ? 'bg-green-500' : ''}>
            {agentEnabled ? 'Ativo' : 'Inativo'}
          </Badge>
          <Switch checked={agentEnabled} onCheckedChange={setAgentEnabled} />
        </div>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tests">Testes A/B</TabsTrigger>
          <TabsTrigger value="funnel">Análise de Funil</TabsTrigger>
          <TabsTrigger value="suggestions">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Taxa de Conversão</p>
                    <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                    <p className="text-sm text-green-600">+{metrics.conversionRateChange}% vs anterior</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Target className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Lift de Conversão</p>
                    <p className="text-2xl font-bold">+{metrics.lift}%</p>
                    <p className="text-sm text-gray-400">vs baseline</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Valor Incremental</p>
                    <p className="text-2xl font-bold">R$ {(metrics.incrementalValue / 1000).toFixed(1)}k</p>
                    <p className="text-sm text-gray-400">estimado</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Testes Ativos</p>
                    <p className="text-2xl font-bold">{metrics.activeTests}</p>
                    <p className="text-sm text-gray-400">{metrics.appliedOptimizations} otimizações aplicadas</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <FlaskConical className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Testes A/B Automáticos</CardTitle>
                <CardDescription>Permitir que o agente crie e execute testes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Habilitar Testes A/B</Label>
                  <Switch checked={abTestsEnabled} onCheckedChange={setAbTestsEnabled} />
                </div>
                
                {abTestsEnabled && (
                  <>
                    <div>
                      <Label className="text-xs text-gray-500">Tráfego de Teste: 20%</Label>
                      <Slider defaultValue={[20]} min={5} max={50} step={5} className="mt-2" />
                    </div>
                    
                    <div>
                      <Label className="text-xs text-gray-500 mb-2 block">Elementos Testáveis</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Ordem de métodos', 'Layout', 'Textos', 'Cores', 'Campos', 'Etapas'].map(el => (
                          <div key={el} className="flex items-center space-x-2">
                            <Checkbox defaultChecked id={el} />
                            <Label htmlFor={el} className="text-sm">{el}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personalização Inteligente</CardTitle>
                <CardDescription>Adaptar checkout automaticamente por contexto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <Label className="text-sm">Por Dispositivo</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <Label className="text-sm">Por Valor do Carrinho</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <Label className="text-sm">Por Tipo de Cliente</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <Label className="text-sm">Ordem de Métodos Inteligente</Label>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests" className="mt-6 space-y-6">
          {/* Active Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Testes em Execução</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTests.map(test => (
                  <div key={test.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{test.name}</h4>
                        <Badge variant="outline">{test.element}</Badge>
                        {test.status === 'winner' && (
                          <Badge className="bg-green-500">Vencedor encontrado</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          {test.status === 'running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="outline" size="sm">Ver detalhes</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Variantes</p>
                        <p className="font-medium">{test.variants}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tráfego</p>
                        <p className="font-medium">{test.traffic}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Dias rodando</p>
                        <p className="font-medium">{test.days}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Confiança</p>
                        <div className="flex items-center gap-2">
                          <Progress value={test.confidence} className="flex-1 h-2" />
                          <span className="font-medium">{test.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Funil de Conversão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {funnelData.map((step, index) => (
                  <div key={step.step} className="flex items-center gap-4">
                    <div className="w-40 text-sm font-medium">{step.step}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00D26A] to-[#00A854] flex items-center justify-end pr-3"
                          style={{ width: `${step.percentage}%` }}
                        >
                          <span className="text-white text-sm font-medium">{step.percentage}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-24 text-right text-sm text-gray-500">
                      {step.value.toLocaleString()}
                    </div>
                    {index > 0 && (
                      <div className="w-20 text-right text-sm text-red-500">
                        -{(funnelData[index - 1].percentage - step.percentage)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MousePointer className="w-5 h-5" />
                  Drop-off por Campo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { field: 'CPF', abandonment: 15, time: '12s', errors: 23 },
                    { field: 'Telefone', abandonment: 8, time: '8s', errors: 5 },
                    { field: 'CEP', abandonment: 6, time: '15s', errors: 12 },
                    { field: 'Cartão', abandonment: 12, time: '25s', errors: 45 },
                  ].map(item => (
                    <div key={item.field} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.field}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-red-500">{item.abandonment}% abandono</span>
                        <span className="text-gray-500">{item.time} tempo médio</span>
                        <span className="text-orange-500">{item.errors} erros</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Tempo por Etapa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { step: 'Dados Pessoais', avg: '45s', median: '38s' },
                    { step: 'Endereço', avg: '32s', median: '28s' },
                    { step: 'Pagamento', avg: '58s', median: '52s' },
                  ].map(item => (
                    <div key={item.step} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">{item.step}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Média: {item.avg}</span>
                        <span className="text-gray-500">Mediana: {item.median}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Recomendações do Agente
              </CardTitle>
              <CardDescription>Insights automáticos baseados em análise de dados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map(suggestion => (
                  <div key={suggestion.id} className="p-4 border rounded-lg hover:border-[#00D26A] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{suggestion.title}</h4>
                          <Badge variant={suggestion.impact === 'high' ? 'default' : 'secondary'} className={suggestion.impact === 'high' ? 'bg-green-500' : ''}>
                            {suggestion.impact === 'high' ? 'Alto impacto' : 'Médio impacto'}
                          </Badge>
                          <Badge variant="outline">
                            {suggestion.effort === 'low' ? 'Fácil' : 'Médio esforço'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{suggestion.description}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button size="sm" variant="outline">Criar Teste A/B</Button>
                        <Button size="sm" className="bg-[#00D26A] hover:bg-[#00B85C]">
                          <Zap className="w-4 h-4 mr-1" />
                          Aplicar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}