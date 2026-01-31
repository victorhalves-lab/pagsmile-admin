import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from 'react-i18next';
import DynamicKpiCard from '@/components/common/DynamicKpiCard';
import SimulatedCheckoutIframe from '@/components/common/SimulatedCheckoutIframe';
import SimulatedActionButton from '@/components/common/SimulatedActionButton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LifeBuoy, CreditCard, QrCode, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';

export default function RecoveryAgent() {
  const { t } = useTranslation();
  const [scenarioModalOpen, setScenarioModalOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [pixDiscount, setPixDiscount] = useState([5]);
  const [retryEnabled, setRetryEnabled] = useState(true);

  const scenarios = [
    { id: 'nsf', label: 'Saldo Insuficiente (NSF)', impact: '35%', recovery: '60%' },
    { id: 'limit', label: 'Limite Excedido', impact: '25%', recovery: '45%' },
    { id: 'fraud_suspect', label: 'Suspeita de Fraude', impact: '20%', recovery: '70%' },
    { id: 'expired', label: 'Cartão Expirado', impact: '10%', recovery: '55%' },
    { id: 'timeout', label: 'Timeout/Erro Técnico', impact: '10%', recovery: '80%' }
  ];

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulador de Checkout */}
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Cenário de Perda</CardTitle>
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
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Recovery</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recoveryData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="gmv" stroke="#94a3b8" name="GMV em Risco" />
                  <Line type="monotone" dataKey="recovered" stroke="#2bc196" strokeWidth={2} name="GMV Recuperado" />
                </LineChart>
              </ResponsiveContainer>
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