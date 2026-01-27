import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { 
  RefreshCw, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Zap,
  Clock,
  Mail,
  MessageSquare,
  Smartphone,
  CreditCard,
  QrCode,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import PageHeader from '@/components/common/PageHeader';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import DataTable from '@/components/common/DataTable';

export default function RecoveryAgent() {
  const [config, setConfig] = useState({
    enabled: true,
    nsfStrategy: 'pix_discount',
    pixDiscount: 5,
    maxRetries: 3,
    retryInterval: 30,
    abandonmentEnabled: true,
    abandonmentDelay: 15,
    channels: ['email', 'sms', 'whatsapp'],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-created_date', 100),
  });

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  // Calculate recovery metrics
  const declined = transactions.filter(t => t.status === 'declined');
  const recoverable = declined.filter(t => 
    ['51', '54', '05'].includes(t.decline_code)
  );
  const recoverableValue = recoverable.reduce((sum, t) => sum + (t.amount || 0), 0);
  
  // Mock recovery data
  const recovered = 12;
  const recoveredValue = 8450.50;
  const recoveryRate = recoverable.length > 0 ? (recovered / recoverable.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payment Recovery Agent"
        subtitle="Recuperação inteligente de pagamentos falhos"
        breadcrumbs={[
          { label: 'Agentes de IA', page: 'DIACopilot' },
          { label: 'Recovery Agent', page: 'RecoveryAgent' }
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
          ? "bg-gradient-to-br from-emerald-500 to-teal-600" 
          : "bg-gradient-to-br from-gray-400 to-gray-500"
      )}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-white/80 text-sm mb-1">Status do Agente</p>
            <p className="text-2xl font-bold">
              {config.enabled ? 'Recuperação Ativa' : 'Agente Desativado'}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-lg">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>
        
        {config.enabled && (
          <p className="text-white/90 text-sm">
            O agente está monitorando transações em tempo real e executando estratégias de recuperação automaticamente.
          </p>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Valor Recuperado"
          value={recoveredValue}
          format="currency"
          change={25.5}
          icon={DollarSign}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />
        <KPICard
          title="Taxa de Recuperação"
          value={recoveryRate}
          format="percentage"
          change={8.2}
          icon={TrendingUp}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <KPICard
          title="Oportunidades"
          value={recoverable.length}
          format="number"
          icon={Zap}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <KPICard
          title="Valor Recuperável"
          value={recoverableValue}
          format="currency"
          icon={TrendingUp}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="strategies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="strategies">Estratégias</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-6">
          {/* NSF Strategy */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Cartão Recusado por Saldo Insuficiente (NSF)</h3>
            
            <div className="space-y-4">
              <div>
                <Label>Estratégia Principal</Label>
                <Select 
                  value={config.nsfStrategy} 
                  onValueChange={(v) => setConfig({ ...config, nsfStrategy: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix_discount">Oferecer Pix com desconto</SelectItem>
                    <SelectItem value="more_installments">Sugerir mais parcelas</SelectItem>
                    <SelectItem value="other_card">Solicitar outro cartão</SelectItem>
                    <SelectItem value="retry">Retry automático</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.nsfStrategy === 'pix_discount' && (
                <div>
                  <Label>Desconto Pix (%)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[config.pixDiscount]}
                      onValueChange={(v) => setConfig({ ...config, pixDiscount: v[0] })}
                      max={15}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="text-sm font-semibold w-12">{config.pixDiscount}%</span>
                  </div>
                </div>
              )}

              <div>
                <Label>Máximo de Tentativas de Retry</Label>
                <Select 
                  value={String(config.maxRetries)} 
                  onValueChange={(v) => setConfig({ ...config, maxRetries: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={String(n)}>{n} tentativa{n > 1 ? 's' : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Intervalo entre Retries (minutos)</Label>
                <Select 
                  value={String(config.retryInterval)} 
                  onValueChange={(v) => setConfig({ ...config, retryInterval: parseInt(v) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Abandonment Strategy */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Abandono de Checkout</h3>
              <Switch
                checked={config.abandonmentEnabled}
                onCheckedChange={(v) => setConfig({ ...config, abandonmentEnabled: v })}
              />
            </div>

            {config.abandonmentEnabled && (
              <div className="space-y-4">
                <div>
                  <Label>Tempo para Ação (minutos após abandono)</Label>
                  <Select 
                    value={String(config.abandonmentDelay)} 
                    onValueChange={(v) => setConfig({ ...config, abandonmentDelay: parseInt(v) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Canais de Comunicação</Label>
                  <div className="space-y-2">
                    {[
                      { id: 'email', label: 'E-mail', icon: Mail },
                      { id: 'sms', label: 'SMS', icon: Smartphone },
                      { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
                    ].map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <div key={channel.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{channel.label}</span>
                          </div>
                          <Switch
                            checked={config.channels.includes(channel.id)}
                            onCheckedChange={(checked) => {
                              setConfig({
                                ...config,
                                channels: checked
                                  ? [...config.channels, channel.id]
                                  : config.channels.filter(c => c !== channel.id)
                              });
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Chart */}
          <ChartCard
            title="Evolução da Recuperação"
            subtitle="Valor recuperado ao longo do tempo"
          >
            <div className="h-64 flex items-center justify-center text-gray-500">
              Gráfico de evolução (implementar com dados reais)
            </div>
          </ChartCard>

          {/* Recovery by Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Recuperação por Tipo</h3>
              <div className="space-y-3">
                {[
                  { label: 'NSF → Pix', count: 8, value: 4200, rate: 45 },
                  { label: 'NSF → Mais Parcelas', count: 3, value: 2100, rate: 35 },
                  { label: 'Limite → Parcelamento', count: 2, value: 1500, rate: 28 },
                  { label: 'Abandono → E-mail', count: 4, value: 650, rate: 18 },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.count} recuperações</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">{formatCurrency(item.value)}</p>
                      <p className="text-xs text-gray-500">{item.rate}% taxa</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Melhor Estratégia</h3>
              <div className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <QrCode className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-900">Pix com Desconto</p>
                      <p className="text-xs text-emerald-700">Para recusas NSF</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-emerald-700">Taxa de Sucesso</p>
                      <p className="text-lg font-bold text-emerald-900">45%</p>
                    </div>
                    <div>
                      <p className="text-xs text-emerald-700">Valor Médio</p>
                      <p className="text-lg font-bold text-emerald-900">{formatCurrency(525)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600">
                  ✓ Recomendação do DIA: Esta estratégia tem a melhor conversão para seu perfil de clientes
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-emerald-900">Oportunidades de Recuperação</p>
                <p className="text-sm text-emerald-700">{recoverable.length} transações recuperáveis identificadas</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-emerald-200">
              <span className="text-emerald-800">Valor potencial</span>
              <span className="text-2xl font-bold text-emerald-600">{formatCurrency(recoverableValue)}</span>
            </div>
          </div>

          {/* Recoverable Transactions */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Transações Recuperáveis</h3>
            <div className="space-y-2">
              {recoverable.slice(0, 10).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.customer_name || 'Cliente'}</p>
                      <p className="text-xs text-gray-500">
                        {tx.decline_reason || 'Saldo insuficiente'} • {tx.transaction_id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(tx.amount)}</p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-[#00D26A]">
                      Recuperar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}