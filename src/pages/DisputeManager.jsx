import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Shield, 
  Brain, 
  TrendingUp, 
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  Target,
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn, formatCurrency } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import StatusBadge from '@/components/common/StatusBadge';

export default function DisputeManager() {
  const [agentConfig, setAgentConfig] = useState({
    enabled: true,
    autoAnalysis: true,
    autoRecommendation: true,
    contestThreshold: 60,
    autoRefundThreshold: 200,
    autoRefundEnabled: false,
  });

  const { data: disputes = [] } = useQuery({
    queryKey: ['disputes'],
    queryFn: () => base44.entities.Dispute.list('-created_date', 100),
  });



  // Calculate metrics
  const managed = disputes.length;
  const won = disputes.filter(d => d.status === 'won');
  const lost = disputes.filter(d => d.status === 'lost');
  const winRate = (won.length + lost.length) > 0 ? (won.length / (won.length + lost.length)) * 100 : 0;
  const valueProtected = won.reduce((sum, d) => sum + (d.amount || 0), 0);
  const avgWinProb = disputes.length > 0 
    ? disputes.reduce((sum, d) => sum + (d.win_probability || 50), 0) / disputes.length 
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispute & Chargeback Manager"
        subtitle="Gestão inteligente de disputas com IA"
        breadcrumbs={[
          { label: 'Agentes de IA', page: 'DIACopilot' },
          { label: 'Dispute Manager', page: 'DisputeManager' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={agentConfig.enabled}
                onCheckedChange={(v) => setAgentConfig({ ...agentConfig, enabled: v })}
              />
              <Label className="text-sm">
                {agentConfig.enabled ? 'Ativo' : 'Inativo'}
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
        agentConfig.enabled 
          ? "bg-gradient-to-br from-red-500 to-orange-600" 
          : "bg-gradient-to-br from-gray-400 to-gray-500"
      )}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Status do Agente</p>
            <p className="text-2xl font-bold">
              {agentConfig.enabled ? 'Gestão Ativa' : 'Agente Desativado'}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Shield className="w-6 h-6" />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-white/60 text-xs mb-1">Disputas Gerenciadas</p>
            <p className="text-lg font-semibold">{managed}</p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Win Rate</p>
            <p className="text-lg font-semibold">{winRate.toFixed(0)}%</p>
          </div>
          <div>
            <p className="text-white/60 text-xs mb-1">Valor Protegido</p>
            <p className="text-lg font-semibold">{formatCurrency(valueProtected)}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Disputas Gerenciadas"
          value={managed}
          format="number"
          change={12.5}
          icon={Shield}
          iconBg="bg-red-100"
          iconColor="text-red-600"
        />
        <KPICard
          title="Win Rate"
          value={winRate}
          format="percentage"
          change={5.2}
          icon={TrendingUp}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Valor Protegido"
          value={valueProtected}
          format="currency"
          change={22.3}
          icon={DollarSign}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Prob. Média de Vitória"
          value={avgWinProb}
          format="percentage"
          icon={Target}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="config" className="space-y-6">
        <TabsList>
          <TabsTrigger value="config">Configuração</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="learning">Aprendizado</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          {/* Auto Analysis */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Análise Automática</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Análise Automática de Chargebacks</Label>
                  <p className="text-sm text-gray-500">Calcular probabilidade de vitória automaticamente</p>
                </div>
                <Switch 
                  checked={agentConfig.autoAnalysis}
                  onCheckedChange={(v) => setAgentConfig({ ...agentConfig, autoAnalysis: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Recomendação Automática</Label>
                  <p className="text-sm text-gray-500">Sugerir contestar ou aceitar</p>
                </div>
                <Switch 
                  checked={agentConfig.autoRecommendation}
                  onCheckedChange={(v) => setAgentConfig({ ...agentConfig, autoRecommendation: v })}
                />
              </div>

              {agentConfig.autoRecommendation && (
                <div>
                  <Label>Threshold para Contestação (%)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[agentConfig.contestThreshold]}
                      onValueChange={(v) => setAgentConfig({ ...agentConfig, contestThreshold: v[0] })}
                      max={90}
                      min={40}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{agentConfig.contestThreshold}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Contestar apenas se probabilidade de vitória {'>'} {agentConfig.contestThreshold}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Pre-Chargebacks */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Pré-Chargebacks (Alertas)</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Reembolso Automático de Alertas</Label>
                  <p className="text-sm text-gray-500">Para valores baixos, reembolsar automaticamente</p>
                </div>
                <Switch 
                  checked={agentConfig.autoRefundEnabled}
                  onCheckedChange={(v) => setAgentConfig({ ...agentConfig, autoRefundEnabled: v })}
                />
              </div>

              {agentConfig.autoRefundEnabled && (
                <div>
                  <Label>Valor Máximo para Auto-Reembolso (R$)</Label>
                  <Input
                    type="number"
                    value={agentConfig.autoRefundThreshold}
                    onChange={(e) => setAgentConfig({ 
                      ...agentConfig, 
                      autoRefundThreshold: parseFloat(e.target.value) || 0 
                    })}
                    placeholder="200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Alertas com valor até {formatCurrency(agentConfig.autoRefundThreshold)} serão reembolsados automaticamente
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Disputas por Resultado</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Vencidas</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-600">{won.length}</p>
                    <p className="text-xs text-emerald-700">{formatCurrency(valueProtected)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-900">Perdidas</span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{lost.length}</p>
                    <p className="text-xs text-red-700">
                      {formatCurrency(lost.reduce((s, d) => s + (d.amount || 0), 0))}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Em Andamento</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    {disputes.filter(d => d.status === 'open' || d.status === 'under_review').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Métricas do Agente</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Tempo Médio de Resposta</span>
                    <span className="font-semibold">4.2 horas</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Meta: {'<'} 6 horas</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Taxa de Auto-Resolução</span>
                    <span className="font-semibold">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">Sem intervenção humana</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Economia de Tempo</span>
                    <span className="font-semibold">32 horas/mês</span>
                  </div>
                  <p className="text-xs text-emerald-600">vs processo manual</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-900">Insights do Agente</h3>
                <p className="text-sm text-purple-700">Padrões identificados pela IA</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  ✓ Disputas com reason code 4837 têm 85% de vitória quando enviamos comprovante de entrega
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  ✓ Chargebacks às sextas-feiras têm 30% menos chance de vitória
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  ✓ Transações acima de R$ 500 devem incluir assinatura digital nas evidências
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Aprendizado Contínuo</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Aprender com Resultados</p>
                  <p className="text-sm text-gray-500">Melhorar recomendações baseado em histórico</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Identificar Padrões</p>
                  <p className="text-sm text-gray-500">Detectar tendências em disputas</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Padrões Aprendidos</h4>
                <div className="space-y-2">
                  {[
                    { pattern: 'Reason Code 4837', winRate: 85, sample: 23 },
                    { pattern: 'BIN 123456', winRate: 72, sample: 15 },
                    { pattern: 'Valor > R$ 1.000', winRate: 68, sample: 31 },
                    { pattern: 'Cliente recorrente', winRate: 91, sample: 12 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{item.pattern}</p>
                        <p className="text-xs text-gray-500">{item.sample} casos analisados</p>
                      </div>
                      <Badge className={cn(
                        item.winRate >= 80 ? "bg-emerald-100 text-emerald-700" :
                        item.winRate >= 60 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                      )}>
                        {item.winRate}% vitória
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}