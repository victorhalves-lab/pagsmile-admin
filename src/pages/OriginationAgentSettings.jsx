import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Bot,
  Settings,
  Zap,
  Shield,
  CheckCircle2,
  Clock,
  Users,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Brain,
  Eye,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
};

const mccCategories = [
  { value: '5411', label: 'Supermercados e Mercearias', risk: 'low' },
  { value: '5812', label: 'Restaurantes', risk: 'low' },
  { value: '5691', label: 'Vestuário', risk: 'low' },
  { value: '5732', label: 'Eletrônicos', risk: 'medium' },
  { value: '7995', label: 'Jogos e Apostas', risk: 'high' },
  { value: '5967', label: 'Produtos Digitais', risk: 'medium' },
  { value: '7273', label: 'Serviços de Namoro', risk: 'high' },
  { value: '5999', label: 'Varejo em Geral', risk: 'low' },
];

export default function OriginationAgentSettings() {
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['origination-agent-config'],
    queryFn: () => base44.entities.OriginationAgentConfig.list()
  });

  const config = configs[0] || {
    is_agent_enabled: true,
    auto_approval_enabled: false,
    auto_approval_min_score: 70,
    auto_approval_max_risk_score: 30,
    eligible_mccs: ['5411', '5812', '5691', '5999'],
    high_risk_mccs: ['7995', '7273'],
    auto_initial_limit_transaction: 1000,
    auto_initial_limit_daily: 5000,
    auto_initial_limit_monthly: 50000,
    sla_hours: 24,
    face_match_threshold: 80,
    liveness_required: true,
    validations_enabled: {
      cnpj: true,
      cpf: true,
      pep: true,
      sanctions: true,
      lawsuits: false,
      protests: false
    },
    total_onboardings_processed: 0,
    total_auto_approved: 0,
    total_escalated: 0,
    avg_onboarding_time_hours: 0
  };

  const updateConfigMutation = useMutation({
    mutationFn: async (data) => {
      if (configs[0]?.id) {
        return base44.entities.OriginationAgentConfig.update(configs[0].id, data);
      }
      return base44.entities.OriginationAgentConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['origination-agent-config'] });
      toast.success('Configurações salvas!');
    }
  });

  const handleToggleAgent = (enabled) => {
    updateConfigMutation.mutate({ ...config, is_agent_enabled: enabled });
  };

  const handleSaveConfig = (updates) => {
    updateConfigMutation.mutate({ ...config, ...updates });
  };

  const toggleMCC = (mcc, list) => {
    const currentList = config[list] || [];
    const newList = currentList.includes(mcc)
      ? currentList.filter(m => m !== mcc)
      : [...currentList, mcc];
    handleSaveConfig({ [list]: newList });
  };

  const toggleValidation = (key, enabled) => {
    handleSaveConfig({
      validations_enabled: {
        ...config.validations_enabled,
        [key]: enabled
      }
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Origination"
        subtitle="Configure o agente de IA para onboarding inteligente de subcontas"
        breadcrumbs={[
          { label: 'Subcontas', href: 'SubaccountsDashboard' },
          { label: 'Agent Origination' }
        ]}
      />

      {/* Agent Summary */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Bot className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-purple-900">Agent Origination</h3>
                <p className="text-sm text-purple-700">
                  Onboarding inteligente com validações automáticas e análise de risco
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge className={cn(
                "text-sm",
                config.is_agent_enabled 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-600"
              )}>
                {config.is_agent_enabled ? 'Ativo' : 'Inativo'}
              </Badge>
              <Switch
                checked={config.is_agent_enabled}
                onCheckedChange={handleToggleAgent}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-3 bg-white/60 rounded-lg">
              <p className="text-xs text-purple-600">Onboardings Processados</p>
              <p className="text-xl font-bold text-purple-900">{config.total_onboardings_processed}</p>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <p className="text-xs text-green-600">Auto-Aprovados</p>
              <p className="text-xl font-bold text-green-700">{config.total_auto_approved}</p>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <p className="text-xs text-orange-600">Escalados para Humano</p>
              <p className="text-xl font-bold text-orange-700">{config.total_escalated}</p>
            </div>
            <div className="p-3 bg-white/60 rounded-lg">
              <p className="text-xs text-blue-600">Tempo Médio</p>
              <p className="text-xl font-bold text-blue-700">{config.avg_onboarding_time_hours}h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="auto-approval">Auto-Aprovação</TabsTrigger>
          <TabsTrigger value="validations">Validações</TabsTrigger>
          <TabsTrigger value="mccs">MCCs</TabsTrigger>
          <TabsTrigger value="escalation">Escalação</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Limite Inicial por Transação</Label>
                  <Input
                    type="number"
                    value={config.auto_initial_limit_transaction}
                    onChange={(e) => handleSaveConfig({ auto_initial_limit_transaction: parseFloat(e.target.value) })}
                  />
                  <p className="text-xs text-gray-500">Limite para subcontas auto-aprovadas</p>
                </div>
                <div className="space-y-2">
                  <Label>Limite Diário Inicial</Label>
                  <Input
                    type="number"
                    value={config.auto_initial_limit_daily}
                    onChange={(e) => handleSaveConfig({ auto_initial_limit_daily: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Limite Mensal Inicial</Label>
                  <Input
                    type="number"
                    value={config.auto_initial_limit_monthly}
                    onChange={(e) => handleSaveConfig({ auto_initial_limit_monthly: parseFloat(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>SLA de Análise (horas)</Label>
                <Input
                  type="number"
                  value={config.sla_hours}
                  onChange={(e) => handleSaveConfig({ sla_hours: parseInt(e.target.value) })}
                  className="max-w-[200px]"
                />
                <p className="text-xs text-gray-500">
                  Tempo máximo para analisar casos escalados para humano
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Approval Tab */}
        <TabsContent value="auto-approval">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Regras de Auto-Aprovação
              </CardTitle>
              <CardDescription>
                Configure quando o agente pode aprovar automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <Label className="text-base text-green-900">Habilitar Auto-Aprovação</Label>
                  <p className="text-sm text-green-700">
                    Permitir aprovação sem revisão humana quando critérios forem atendidos
                  </p>
                </div>
                <Switch
                  checked={config.auto_approval_enabled}
                  onCheckedChange={(checked) => handleSaveConfig({ auto_approval_enabled: checked })}
                />
              </div>

              {config.auto_approval_enabled && (
                <>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Score Mínimo para Auto-Aprovação</Label>
                        <Badge variant="outline">{config.auto_approval_min_score}%</Badge>
                      </div>
                      <Slider
                        value={[config.auto_approval_min_score]}
                        onValueChange={([value]) => handleSaveConfig({ auto_approval_min_score: value })}
                        max={100}
                        min={50}
                        step={5}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Subcontas precisam ter score de confiança acima deste valor
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Score de Risco Máximo</Label>
                        <Badge variant="outline">{config.auto_approval_max_risk_score}%</Badge>
                      </div>
                      <Slider
                        value={[config.auto_approval_max_risk_score]}
                        onValueChange={([value]) => handleSaveConfig({ auto_approval_max_risk_score: value })}
                        max={50}
                        min={10}
                        step={5}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Subcontas com score de risco acima serão escaladas para humano
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Brain className="w-4 h-4" />
                    <AlertDescription>
                      O agente analisa CNPJ, CPF dos sócios, PEP, sanções, documentos e face match 
                      para calcular os scores de confiança e risco automaticamente.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validations Tab */}
        <TabsContent value="validations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Validações Automáticas
              </CardTitle>
              <CardDescription>
                Configure quais validações o agente deve executar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'cnpj', label: 'Validação de CNPJ', desc: 'Consulta na Receita Federal' },
                  { key: 'cpf', label: 'Validação de CPF', desc: 'Consulta CPF dos sócios' },
                  { key: 'pep', label: 'Verificação de PEP', desc: 'Pessoas Expostas Politicamente' },
                  { key: 'sanctions', label: 'Listas de Sanções', desc: 'OFAC, ONU e listas locais' },
                  { key: 'lawsuits', label: 'Processos Judiciais', desc: 'Consulta nos tribunais' },
                  { key: 'protests', label: 'Protestos', desc: 'Consulta em cartórios' },
                ].map(validation => (
                  <div 
                    key={validation.key}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <Label className="text-sm">{validation.label}</Label>
                      <p className="text-xs text-gray-500">{validation.desc}</p>
                    </div>
                    <Switch
                      checked={config.validations_enabled?.[validation.key]}
                      onCheckedChange={(checked) => toggleValidation(validation.key, checked)}
                    />
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Validação de Documentos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Threshold de Face Match (%)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[config.face_match_threshold]}
                        onValueChange={([value]) => handleSaveConfig({ face_match_threshold: value })}
                        max={100}
                        min={50}
                        step={5}
                        className="flex-1"
                      />
                      <Badge variant="outline">{config.face_match_threshold}%</Badge>
                    </div>
                    <p className="text-xs text-gray-500">
                      Similaridade mínima entre foto do documento e selfie
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Liveness Detection</Label>
                      <p className="text-xs text-gray-500">Detectar se selfie é de pessoa viva</p>
                    </div>
                    <Switch
                      checked={config.liveness_required}
                      onCheckedChange={(checked) => handleSaveConfig({ liveness_required: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MCCs Tab */}
        <TabsContent value="mccs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle2 className="w-5 h-5" />
                  MCCs Elegíveis para Auto-Aprovação
                </CardTitle>
                <CardDescription>
                  Categorias de negócio que podem ser auto-aprovadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mccCategories.filter(m => m.risk !== 'high').map(mcc => (
                    <div 
                      key={mcc.value}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <Checkbox
                        checked={(config.eligible_mccs || []).includes(mcc.value)}
                        onCheckedChange={() => toggleMCC(mcc.value, 'eligible_mccs')}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{mcc.value} - {mcc.label}</p>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        mcc.risk === 'low' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      )}>
                        {mcc.risk === 'low' ? 'Baixo Risco' : 'Médio Risco'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  MCCs de Alto Risco
                </CardTitle>
                <CardDescription>
                  Categorias que sempre precisam de revisão humana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mccCategories.filter(m => m.risk === 'high').map(mcc => (
                    <div 
                      key={mcc.value}
                      className="flex items-center gap-3 p-3 border border-red-200 bg-red-50 rounded-lg"
                    >
                      <Checkbox
                        checked={(config.high_risk_mccs || []).includes(mcc.value)}
                        onCheckedChange={() => toggleMCC(mcc.value, 'high_risk_mccs')}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{mcc.value} - {mcc.label}</p>
                      </div>
                      <Badge className="bg-red-100 text-red-700 text-xs">
                        Alto Risco
                      </Badge>
                    </div>
                  ))}
                </div>

                <Alert className="mt-4">
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    MCCs de alto risco como jogos, cripto e conteúdo adulto 
                    sempre passam por análise humana detalhada.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Escalation Tab */}
        <TabsContent value="escalation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Critérios de Escalação para Humano
              </CardTitle>
              <CardDescription>
                Quando o agente deve passar o caso para análise manual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Brain className="w-4 h-4" />
                <AlertDescription>
                  O agente sempre prepara um resumo detalhado para o analista com:
                  dados validados, score de risco, flags identificadas e recomendação.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {[
                  { label: 'Score de risco acima do threshold', enabled: true },
                  { label: 'MCC de alto risco', enabled: true },
                  { label: 'Documentos com baixa qualidade', enabled: true },
                  { label: 'Face match abaixo do threshold', enabled: true },
                  { label: 'Sócios PEP identificados', enabled: true },
                  { label: 'Empresa em lista de sanções', enabled: true },
                  { label: 'Inconsistências nos dados', enabled: true },
                  { label: 'Volume esperado acima do limite', enabled: false },
                ].map((criteria, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm">{criteria.label}</span>
                    <Badge className={cn(
                      criteria.enabled ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                    )}>
                      {criteria.enabled ? 'Escala' : 'Não escala'}
                    </Badge>
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