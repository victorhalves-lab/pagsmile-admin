import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  Sparkles, 
  Users, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Settings,
  FileText,
  AlertCircle,
  Target,
  Zap,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
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

export default function OriginationAgent() {
  const [config, setConfig] = useState({
    enabled: true,
    autoApprovalEnabled: true,
    minScore: 75,
    maxInitialLimit: 50000,
  });

  const { data: subaccounts = [] } = useQuery({
    queryKey: ['subaccounts'],
    queryFn: () => base44.entities.Subaccount.list('-created_date', 100),
  });



  // Calculate metrics
  const processed = subaccounts.length;
  const autoApproved = subaccounts.filter(s => s.onboarding_completed && s.status === 'active').length;
  const autoApprovalRate = processed > 0 ? (autoApproved / processed) * 100 : 0;
  const avgOnboardingTime = 4.2; // Mock: hours
  const funnelConversion = 68.5; // Mock: %

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Origination"
        subtitle="Onboarding inteligente de subcontas"
        breadcrumbs={[
          { label: 'Agentes de IA', page: 'DIACopilot' },
          { label: 'Origination Agent', page: 'OriginationAgent' }
        ]}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={config.enabled}
                onCheckedChange={(v) => setConfig({ ...config, enabled: v })}
              />
              <Label className="text-sm">
                {config.enabled ? 'Ativo' : 'Inativo'}
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
        config.enabled 
          ? "bg-gradient-to-br from-blue-500 to-indigo-600" 
          : "bg-gradient-to-br from-gray-400 to-gray-500"
      )}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Status do Agente</p>
            <p className="text-2xl font-bold">
              {config.enabled ? 'Onboarding Ativo' : 'Agente Desativado'}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
        
        {config.enabled && (
          <p className="text-white/90 text-sm">
            O agente está processando novos cadastros, validando documentos e aprovando sellers automaticamente conforme critérios configurados.
          </p>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Onboardings Processados"
          value={processed}
          format="number"
          change={45.2}
          icon={Users}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Taxa de Auto-Aprovação"
          value={autoApprovalRate}
          format="percentage"
          change={12.5}
          icon={Zap}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Tempo Médio"
          value={`${avgOnboardingTime}h`}
          format="text"
          icon={Clock}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Conversão do Funil"
          value={funnelConversion}
          format="percentage"
          change={8.3}
          icon={Target}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="auto_approval" className="space-y-6">
        <TabsList>
          <TabsTrigger value="auto_approval">Auto-Aprovação</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="communication">Comunicação</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="auto_approval" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Configuração de Auto-Aprovação</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Habilitar Auto-Aprovação</Label>
                  <p className="text-sm text-gray-500">Aprovar sellers sem revisão humana</p>
                </div>
                <Switch 
                  checked={config.autoApprovalEnabled}
                  onCheckedChange={(v) => setConfig({ ...config, autoApprovalEnabled: v })}
                />
              </div>

              {config.autoApprovalEnabled && (
                <>
                  <div>
                    <Label>Score Mínimo para Auto-Aprovação</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Slider
                        value={[config.minScore]}
                        onValueChange={(v) => setConfig({ ...config, minScore: v[0] })}
                        max={100}
                        min={50}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold w-12">{config.minScore}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Sellers com score {'>='} {config.minScore} serão aprovados automaticamente
                    </p>
                  </div>

                  <div>
                    <Label>Limite Inicial Máximo (R$)</Label>
                    <Input
                      type="number"
                      value={config.maxInitialLimit}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        maxInitialLimit: parseFloat(e.target.value) || 0 
                      })}
                      placeholder="50000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Limite máximo para contas auto-aprovadas
                    </p>
                  </div>

                  <div>
                    <Label className="mb-3 block">Segmentos Elegíveis (MCC)</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'E-commerce',
                        'Serviços Digitais',
                        'Alimentação',
                        'Varejo',
                        'Educação',
                        'Saúde'
                      ].map((segment) => (
                        <div key={segment} className="flex items-center gap-2 p-2 border border-gray-200 rounded">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm">{segment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Validação de Documentos</h3>
            
            <div className="space-y-3">
              {[
                { doc: 'CNPJ/CPF', validation: 'OCR + Receita Federal', enabled: true },
                { doc: 'Contrato Social', validation: 'OCR + Análise de dados', enabled: true },
                { doc: 'Comprovante de Endereço', validation: 'OCR + Validação de CEP', enabled: true },
                { doc: 'Documento de Identidade', validation: 'OCR + Biometria facial', enabled: false },
                { doc: 'Comprovante Bancário', validation: 'OCR + Titularidade', enabled: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.doc}</p>
                    <p className="text-xs text-gray-500">{item.validation}</p>
                  </div>
                  <Switch defaultChecked={item.enabled} />
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Comunicação com Seller</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Status em Tempo Real</p>
                  <p className="text-sm text-gray-500">Seller acompanha progresso do cadastro</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Notificações de Pendência</p>
                  <p className="text-sm text-gray-500">Avisar sobre documentos faltantes</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Explicação de Rejeição</p>
                  <p className="text-sm text-gray-500">Se rejeitado, explicar motivo detalhadamente</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Funil de Onboarding</h3>
              <div className="space-y-4">
                {[
                  { stage: 'Cadastro Iniciado', count: 100, percentage: 100 },
                  { stage: 'Dados Preenchidos', count: 92, percentage: 92 },
                  { stage: 'Documentos Enviados', count: 85, percentage: 85 },
                  { stage: 'Validação Concluída', count: 78, percentage: 78 },
                  { stage: 'Aprovado', count: 68, percentage: 68 },
                ].map((stage, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{stage.stage}</span>
                      <span className="text-sm font-semibold">{stage.count}</span>
                    </div>
                    <Progress value={stage.percentage} className="h-2" />
                    {idx > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {(100 - (stage.count / 100) * 100).toFixed(0)}% de drop
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">Auto-Aprovações</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">{autoApprovalRate.toFixed(0)}%</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    {autoApproved} de {processed} aprovados sem revisão manual
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Tempo Médio</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{avgOnboardingTime}h</p>
                  <p className="text-xs text-blue-700 mt-1">
                    82% mais rápido que processo manual
                  </p>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Conversão</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{funnelConversion}%</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Sellers que completam o cadastro
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Insights do Agente</h3>
                <p className="text-sm text-blue-700">Padrões identificados no onboarding</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  ✓ Sellers que enviam documentos em PDF têm 92% de aprovação vs 78% para fotos
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  ✓ MCCs de serviços digitais têm score médio 15% mais alto
                </p>
              </div>
              <div className="bg-white/60 rounded-lg p-3">
                <p className="text-sm text-gray-900">
                  ✓ Completar cadastro em menos de 1 hora aumenta taxa de ativação em 35%
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}