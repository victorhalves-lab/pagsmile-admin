import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import PageHeader from '@/components/common/PageHeader';
import AgentDashboardSummary from '@/components/disputes/AgentDashboardSummary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  Settings,
  Zap,
  Bell,
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Save,
  RefreshCcw,
  Brain,
  Target,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';



export default function DisputeAgentSettings() {
  const queryClient = useQueryClient();

  const { data: agentConfigs = [], isLoading } = useQuery({
    queryKey: ['disputeAgentConfig'],
    queryFn: () => base44.entities.DisputeAgentConfig.list()
  });

  const { data: autoReimburseConfigs = [] } = useQuery({
    queryKey: ['auto-reimburse-config'],
    queryFn: () => base44.entities.AutoReimburseConfig.list()
  });

  const agentConfig = agentConfigs[0] || {
    is_agent_enabled: true,
    auto_action_probability_threshold: 70,
    max_value_for_auto_action: 500,
    auto_contest_enabled: false,
    require_human_review: true,
    notification_daily_summary: true,
    notification_push_enabled: true,
    escalation_value_threshold: 1000,
    total_disputes_managed: 0,
    total_won: 0,
    total_lost: 0,
    total_value_protected: 0,
    total_pre_cbs_prevented: 0
  };

  const autoConfig = autoReimburseConfigs[0] || {};

  const updateConfigMutation = useMutation({
    mutationFn: async (data) => {
      if (agentConfigs[0]?.id) {
        return base44.entities.DisputeAgentConfig.update(agentConfigs[0].id, data);
      }
      return base44.entities.DisputeAgentConfig.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disputeAgentConfig'] });
      toast.success('Configurações salvas com sucesso!');
    }
  });

  const updateAutoConfigMutation = useMutation({
    mutationFn: async (data) => {
      if (autoReimburseConfigs[0]?.id) {
        return base44.entities.AutoReimburseConfig.update(autoReimburseConfigs[0].id, data);
      }
      return base44.entities.AutoReimburseConfig.create({ name: 'Configuração Padrão', ...data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auto-reimburse-config'] });
      toast.success('Configurações de auto-reembolso salvas!');
    }
  });

  const handleToggleAgent = (enabled) => {
    updateConfigMutation.mutate({ ...agentConfig, is_agent_enabled: enabled });
  };

  const handleSaveConfig = (updates) => {
    updateConfigMutation.mutate({ ...agentConfig, ...updates });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispute Manager Agent"
        subtitle="Configure o agente de IA para gerenciamento automático de disputas"
        breadcrumbs={[
          { label: 'Agentes de IA' },
          { label: 'Dispute Manager' }
        ]}
      />

      {/* Agent Summary */}
      <AgentDashboardSummary 
        config={agentConfig}
        onToggleAgent={handleToggleAgent}
        isLoading={isLoading}
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="pre-cb">Pré-Chargebacks</TabsTrigger>
          <TabsTrigger value="learning">Aprendizado</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Defina os parâmetros básicos de funcionamento do agente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-base">Status do Agente</Label>
                  <p className="text-sm text-gray-500">Ativar ou desativar o agente de disputas</p>
                </div>
                <Switch 
                  checked={agentConfig.is_agent_enabled}
                  onCheckedChange={handleToggleAgent}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Threshold de Probabilidade para Auto-Ação</Label>
                    <Badge variant="outline">{agentConfig.auto_action_probability_threshold}%</Badge>
                  </div>
                  <Slider
                    value={[agentConfig.auto_action_probability_threshold || 70]}
                    onValueChange={([value]) => handleSaveConfig({ auto_action_probability_threshold: value })}
                    max={100}
                    min={30}
                    step={5}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O agente só tomará ações automáticas se a probabilidade de ganho for maior que este valor
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Valor Máximo para Auto-Ação</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={agentConfig.max_value_for_auto_action || 500}
                      onChange={(e) => handleSaveConfig({ max_value_for_auto_action: parseFloat(e.target.value) })}
                      className="max-w-[200px]"
                    />
                    <span className="text-gray-500 self-center">BRL</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Disputas acima deste valor sempre serão escaladas para revisão humana
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">Exigir Revisão Humana</Label>
                  <p className="text-sm text-gray-500">Todas as ações do agente precisam de aprovação</p>
                </div>
                <Switch 
                  checked={agentConfig.require_human_review}
                  onCheckedChange={(checked) => handleSaveConfig({ require_human_review: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Settings */}
        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Automação de Contestações
              </CardTitle>
              <CardDescription>
                Configure como o agente deve agir automaticamente em contestações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Brain className="w-4 h-4" />
                <AlertDescription>
                  O agente analisa cada disputa e recomenda a melhor ação com base em probabilidade de ganho, 
                  histórico de casos similares e evidências disponíveis.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base">Auto-Contestar</Label>
                    <p className="text-sm text-gray-500">
                      Contestar automaticamente quando probabilidade {'>'} {agentConfig.auto_action_probability_threshold}%
                    </p>
                  </div>
                  <Switch 
                    checked={agentConfig.auto_contest_enabled}
                    onCheckedChange={(checked) => handleSaveConfig({ auto_contest_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base">Auto-Aceitar Baixa Probabilidade</Label>
                    <p className="text-sm text-gray-500">
                      Aceitar automaticamente quando probabilidade {'<'} {agentConfig.low_probability_threshold || 20}%
                    </p>
                  </div>
                  <Switch 
                    checked={agentConfig.auto_accept_low_probability_enabled}
                    onCheckedChange={(checked) => handleSaveConfig({ auto_accept_low_probability_enabled: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Threshold de Baixa Probabilidade</Label>
                  <div className="flex gap-2 items-center">
                    <Slider
                      value={[agentConfig.low_probability_threshold || 20]}
                      onValueChange={([value]) => handleSaveConfig({ low_probability_threshold: value })}
                      max={50}
                      min={5}
                      step={5}
                      className="flex-1"
                    />
                    <Badge variant="outline">{agentConfig.low_probability_threshold || 20}%</Badge>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Critérios de Escalação para Humano</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Valor acima de</Label>
                    <Input
                      type="number"
                      value={agentConfig.escalation_value_threshold || 1000}
                      onChange={(e) => handleSaveConfig({ escalation_value_threshold: parseFloat(e.target.value) })}
                      className="max-w-[200px]"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Disputas com valor acima de {formatCurrency(agentConfig.escalation_value_threshold)} 
                    ou probabilidade entre 30-60% serão sempre escaladas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Configure como você quer ser notificado sobre as ações do agente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">E-mail para Cada Ação</Label>
                  <p className="text-sm text-gray-500">Receber e-mail sempre que o agente tomar uma ação</p>
                </div>
                <Switch 
                  checked={agentConfig.notification_email_each_action}
                  onCheckedChange={(checked) => handleSaveConfig({ notification_email_each_action: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">Resumo Diário por E-mail</Label>
                  <p className="text-sm text-gray-500">Receber um resumo diário das atividades do agente</p>
                </div>
                <Switch 
                  checked={agentConfig.notification_daily_summary}
                  onCheckedChange={(checked) => handleSaveConfig({ notification_daily_summary: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label className="text-base">Notificações Push</Label>
                  <p className="text-sm text-gray-500">Receber notificações push no navegador</p>
                </div>
                <Switch 
                  checked={agentConfig.notification_push_enabled}
                  onCheckedChange={(checked) => handleSaveConfig({ notification_push_enabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>E-mail para Notificações</Label>
                <Input
                  type="email"
                  value={agentConfig.notification_email || ''}
                  onChange={(e) => handleSaveConfig({ notification_email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pre-Chargeback Settings */}
        <TabsContent value="pre-cb">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Gestão de Pré-Chargebacks
              </CardTitle>
              <CardDescription>
                Configure o auto-reembolso inteligente para alertas Ethoca/Verifi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div>
                  <Label className="text-base text-purple-900">Auto-Reembolso Inteligente</Label>
                  <p className="text-sm text-purple-700">
                    O agente decide automaticamente se deve reembolsar pré-chargebacks
                  </p>
                </div>
                <Switch 
                  checked={autoConfig.is_enabled}
                  onCheckedChange={(checked) => updateAutoConfigMutation.mutate({ ...autoConfig, is_enabled: checked })}
                />
              </div>

              {autoConfig.is_enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Valor Máximo Global para Auto-Reembolso</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={autoConfig.value_threshold || 100}
                        onChange={(e) => updateAutoConfigMutation.mutate({ 
                          ...autoConfig, 
                          value_threshold: parseFloat(e.target.value) 
                        })}
                        className="max-w-[200px]"
                      />
                      <span className="text-gray-500 self-center">BRL</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Consideração do Histórico do Cliente</Label>
                    <Select
                      value={autoConfig.customer_history_consideration || 'none'}
                      onValueChange={(value) => updateAutoConfigMutation.mutate({ 
                        ...autoConfig, 
                        customer_history_consideration: value 
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Não considerar histórico</SelectItem>
                        <SelectItem value="new_customers_only">Auto-reembolsar apenas clientes novos</SelectItem>
                        <SelectItem value="exclude_good_standing">Não auto-reembolsar clientes em boa posição</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Clientes com bom histórico podem ter tratamento diferenciado
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base">Notificar Auto-Reembolsos</Label>
                      <p className="text-sm text-gray-500">Receber e-mail quando ocorrer auto-reembolso</p>
                    </div>
                    <Switch 
                      checked={autoConfig.notification_email_enabled}
                      onCheckedChange={(checked) => updateAutoConfigMutation.mutate({ 
                        ...autoConfig, 
                        notification_email_enabled: checked 
                      })}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Aprendizado Contínuo
              </CardTitle>
              <CardDescription>
                O agente aprende com os resultados para melhorar suas recomendações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Contestações Ganhas</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{agentConfig.total_won || 0}</p>
                  <p className="text-xs text-green-700">O agente aprende quais evidências funcionaram</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-900">Contestações Perdidas</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{agentConfig.total_lost || 0}</p>
                  <p className="text-xs text-red-700">O agente identifica padrões de perda</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Pré-CBs Prevenidos</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{agentConfig.total_pre_cbs_prevented || 0}</p>
                  <p className="text-xs text-purple-700">Alertas resolvidos antes de virar CB</p>
                </div>
              </div>

              <Alert>
                <TrendingUp className="w-4 h-4" />
                <AlertDescription>
                  <strong>Análise de Padrões:</strong> O agente identifica padrões problemáticos como BINs com alto índice de CB, 
                  produtos específicos, horários e regiões. Essas informações são usadas para sugestões de prevenção.
                </AlertDescription>
              </Alert>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-3">Sugestões de Prevenção Recentes</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">BIN 456789 com 5x mais chargebacks</p>
                      <p className="text-xs text-gray-500">Considere bloquear ou adicionar verificação extra</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                    <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">RC 13.1 (não recebido) em alta</p>
                      <p className="text-xs text-gray-500">Melhorar tracking de entrega no checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}