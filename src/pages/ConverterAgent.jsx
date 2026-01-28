import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  TestTube2, 
  Settings,
  Play,
  Pause,
  CheckCircle,
  Target,
  BarChart3,
  Smartphone,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
};

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';

export default function ConverterAgent() {
  const [agentEnabled, setAgentEnabled] = useState(true);
  const [testTraffic, setTestTraffic] = useState(10);



  // Mock A/B tests
  const activeTests = [
    {
      id: 'test_1',
      name: 'Ordem de Métodos - Mobile',
      status: 'running',
      startDate: '2026-01-20',
      traffic: 15,
      variants: [
        { name: 'Controle (Pix → Cartão)', conversion: 68.5, participants: 450 },
        { name: 'Variante (Cartão → Pix)', conversion: 71.2, participants: 455 },
      ],
      winner: null,
      confidence: 89
    },
    {
      id: 'test_2',
      name: 'Desconto Pix Dinâmico',
      status: 'running',
      startDate: '2026-01-22',
      traffic: 10,
      variants: [
        { name: 'Controle (5% fixo)', conversion: 72.1, participants: 280 },
        { name: 'Variante (3-7% dinâmico)', conversion: 74.8, participants: 290 },
      ],
      winner: null,
      confidence: 76
    }
  ];

  const completedTests = [
    {
      id: 'test_completed_1',
      name: 'Layout Simplificado - Desktop',
      status: 'completed',
      winner: 'Variante',
      lift: 8.5,
      applied: true,
      impact: 12500
    },
    {
      id: 'test_completed_2',
      name: 'Campos Opcionais',
      status: 'completed',
      winner: 'Controle',
      lift: -2.1,
      applied: false,
      impact: 0
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Converter Agent"
        subtitle="Otimização inteligente de checkout e conversão"
        breadcrumbs={[
          { label: 'Agentes de IA', page: 'DIACopilot' },
          { label: 'Converter Agent', page: 'ConverterAgent' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={agentEnabled}
                onCheckedChange={setAgentEnabled}
              />
              <Label className="text-sm">
                {agentEnabled ? 'Ativo' : 'Inativo'}
              </Label>
            </div>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        }
      />

      {/* Status Card */}
      <div className={cn(
        "rounded-xl p-6 text-white",
        agentEnabled 
          ? "bg-gradient-to-br from-purple-500 to-indigo-600" 
          : "bg-gradient-to-br from-gray-400 to-gray-500"
      )}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Status do Agente</p>
            <p className="text-2xl font-bold">
              {agentEnabled ? 'Otimização Ativa' : 'Agente Desativado'}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Zap className="w-6 h-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-white/60 text-xs mb-1">Testes Ativos</p>
            <p className="text-lg font-semibold">{activeTests.length}</p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Lift Médio</p>
            <p className="text-lg font-semibold">+6.2%</p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Valor Gerado</p>
            <p className="text-lg font-semibold">{formatCurrency(45200)}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Conversão Atual"
          value={72.3}
          format="percentage"
          change={6.2}
          icon={Target}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Lift de Conversão"
          value={6.2}
          format="percentage"
          icon={TrendingUp}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Testes Ativos"
          value={activeTests.length}
          format="number"
          icon={TestTube2}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Valor Incremental"
          value={45200}
          format="currency"
          change={18.5}
          icon={DollarSign}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">
            Testes Ativos
            <Badge variant="secondary" className="ml-2">{activeTests.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">Histórico</TabsTrigger>
          <TabsTrigger value="config">Configuração</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeTests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <Badge className="bg-blue-100 text-blue-700">
                      <Play className="w-3 h-3 mr-1" />
                      Em execução
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Iniciado em {test.startDate} • {test.traffic}% do tráfego
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {test.variants.map((variant, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      "p-4 rounded-lg border-2",
                      idx === 1 && variant.conversion > test.variants[0].conversion
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-gray-200 bg-gray-50"
                    )}
                  >
                    <p className="text-sm font-medium text-gray-900 mb-2">{variant.name}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Conversão</span>
                        <span className="text-lg font-bold text-gray-900">{variant.conversion}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Participantes</span>
                        <span className="text-sm font-semibold">{variant.participants}</span>
                      </div>
                      {idx === 1 && (
                        <div className="pt-2 border-t">
                          <span className={cn(
                            "text-xs font-semibold",
                            variant.conversion > test.variants[0].conversion ? 'text-emerald-600' : 'text-red-600'
                          )}>
                            {variant.conversion > test.variants[0].conversion ? '+' : ''}
                            {(variant.conversion - test.variants[0].conversion).toFixed(1)}% vs controle
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Confiança Estatística</p>
                  <p className="text-xs text-gray-500">Mínimo 95% para declarar vencedor</p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={test.confidence} className="w-24 h-2" />
                  <span className={cn(
                    "text-sm font-bold",
                    test.confidence >= 95 ? 'text-emerald-600' : 'text-gray-600'
                  )}>
                    {test.confidence}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedTests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{test.name}</h3>
                    <Badge className={cn(
                      test.lift > 0 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-700"
                    )}>
                      {test.winner} venceu
                    </Badge>
                    {test.applied && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Aplicado
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Lift de Conversão</p>
                      <p className={cn(
                        "text-lg font-bold",
                        test.lift > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {test.lift > 0 ? '+' : ''}{test.lift}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Impacto Estimado</p>
                      <p className="text-lg font-bold text-gray-900">
                        {test.impact > 0 ? formatCurrency(test.impact) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p className="text-sm font-medium">
                        {test.applied ? 'Em produção' : 'Arquivado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Testes A/B Automáticos</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Habilitar Testes Automáticos</Label>
                  <p className="text-sm text-gray-500">Permitir que o agente execute testes</p>
                </div>
                <Switch checked={agentEnabled} onCheckedChange={setAgentEnabled} />
              </div>

              {agentEnabled && (
                <>
                  <Separator />

                  <div>
                    <Label>Tráfego para Testes (%)</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[testTraffic]}
                        onValueChange={(v) => setTestTraffic(v[0])}
                        max={50}
                        min={5}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold w-12">{testTraffic}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {testTraffic}% dos clientes verão variações de teste
                    </p>
                  </div>

                  <div>
                    <Label className="mb-3 block">Elementos Testáveis</Label>
                    <div className="space-y-2">
                      {[
                        { id: 'order', label: 'Ordem dos métodos de pagamento' },
                        { id: 'layout', label: 'Layout do checkout' },
                        { id: 'fields', label: 'Campos do formulário' },
                        { id: 'texts', label: 'Textos e CTAs' },
                        { id: 'colors', label: 'Cores e branding' },
                      ].map((element) => (
                        <div key={element.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <span className="text-sm">{element.label}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Auto-Aplicar Vencedor</p>
                      <p className="text-sm text-blue-700">Aplicar automaticamente quando confiança ≥ 95%</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Personalization */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Personalização</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Checkout por Dispositivo</p>
                    <p className="text-xs text-gray-500">Mobile vs Desktop</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Por Valor do Carrinho</p>
                    <p className="text-xs text-gray-500">Ajustar conforme ticket</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Por Tipo de Cliente</p>
                    <p className="text-xs text-gray-500">Novo vs Recorrente</p>
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}