import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save,
  RotateCcw,
  ArrowLeft,
  Shuffle,
  Zap,
  Target,
  AlertTriangle,
  Bell,
  Smartphone,
  Monitor,
  Clock,
  TrendingUp,
  Users,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntConverterAgentSettings() {
  const [settings, setSettings] = useState({
    // Global
    agentEnabled: true,
    autoApplyWinners: false,
    minSampleSize: 1000,
    confidenceLevel: 95,
    
    // A/B Tests - Global
    maxConcurrentTestsPerMerchant: 2,
    maxGlobalConcurrentTests: 50,
    autoStopLosingVariants: true,
    minTestDuration: 7,
    
    // Personalization - Global Defaults
    enableDynamicPersonalization: true,
    allowMerchantOverride: true,
    
    // Default Rules
    pixFirstMobileDefault: true,
    simplifiedLayoutSlowNetworkDefault: true,
    savedMethodReturningDefault: true,
    
    // Monitoring
    monitorConversionDrop: true,
    conversionDropThreshold: 10,
    monitorAbandonmentSpike: true,
    abandonmentSpikeThreshold: 15,
    
    // Notifications
    notifyTestComplete: true,
    notifySignificantLift: true,
    liftThreshold: 5,
    notifyConversionDrop: true,
    weeklyDigestEnabled: true
  });

  const handleSave = () => {
    alert('Configurações globais do Converter Agent salvas!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminIntConverterAgent')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shuffle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações Globais - Converter Agent</h1>
            <p className="text-slate-500">Parâmetros que afetam todos os merchants</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="global">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="experiments">Experimentos</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Global Settings */}
        <TabsContent value="global" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Globais</CardTitle>
              <CardDescription>Controle o comportamento do agente para toda a plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Agente Ativo Globalmente</Label>
                  <p className="text-sm text-slate-500">Habilita otimizações para todos os merchants</p>
                </div>
                <Switch 
                  checked={settings.agentEnabled}
                  onCheckedChange={(v) => setSettings({...settings, agentEnabled: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Aplicar Vencedores Automaticamente</Label>
                  <p className="text-sm text-slate-500">Implementa variantes vencedoras sem aprovação</p>
                </div>
                <Switch 
                  checked={settings.autoApplyWinners}
                  onCheckedChange={(v) => setSettings({...settings, autoApplyWinners: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Permitir Override por Merchant</Label>
                  <p className="text-sm text-slate-500">Merchants podem customizar suas próprias regras</p>
                </div>
                <Switch 
                  checked={settings.allowMerchantOverride}
                  onCheckedChange={(v) => setSettings({...settings, allowMerchantOverride: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Nível de Confiança Estatística Padrão</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[settings.confidenceLevel]}
                    onValueChange={([v]) => setSettings({...settings, confidenceLevel: v})}
                    min={90}
                    max={99}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-16 text-right">{settings.confidenceLevel}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regras de Personalização Padrão</CardTitle>
              <CardDescription>Valores default aplicados a novos merchants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">PIX Primeiro em Mobile</Label>
                    <p className="text-sm text-slate-500">Valor padrão para novos merchants</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.pixFirstMobileDefault}
                  onCheckedChange={(v) => setSettings({...settings, pixFirstMobileDefault: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">Layout Simplificado em Rede Lenta</Label>
                    <p className="text-sm text-slate-500">Valor padrão para novos merchants</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.simplifiedLayoutSlowNetworkDefault}
                  onCheckedChange={(v) => setSettings({...settings, simplifiedLayoutSlowNetworkDefault: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">Método Salvo para Recorrentes</Label>
                    <p className="text-sm text-slate-500">Valor padrão para novos merchants</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.savedMethodReturningDefault}
                  onCheckedChange={(v) => setSettings({...settings, savedMethodReturningDefault: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experiments Settings */}
        <TabsContent value="experiments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Limites de Experimentos</CardTitle>
              <CardDescription>Controle a quantidade de testes simultâneos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Máximo de Testes por Merchant</Label>
                <Select 
                  value={String(settings.maxConcurrentTestsPerMerchant)}
                  onValueChange={(v) => setSettings({...settings, maxConcurrentTestsPerMerchant: Number(v)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 teste</SelectItem>
                    <SelectItem value="2">2 testes</SelectItem>
                    <SelectItem value="3">3 testes</SelectItem>
                    <SelectItem value="5">5 testes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Máximo de Testes Globais Simultâneos</Label>
                <Input 
                  type="number"
                  value={settings.maxGlobalConcurrentTests}
                  onChange={(e) => setSettings({...settings, maxGlobalConcurrentTests: Number(e.target.value)})}
                />
                <p className="text-xs text-slate-500">Limite total de testes A/B em toda a plataforma</p>
              </div>

              <div className="space-y-3">
                <Label>Tamanho Mínimo da Amostra</Label>
                <Input 
                  type="number"
                  value={settings.minSampleSize}
                  onChange={(e) => setSettings({...settings, minSampleSize: Number(e.target.value)})}
                />
              </div>

              <div className="space-y-3">
                <Label>Duração Mínima do Teste (dias)</Label>
                <Slider 
                  value={[settings.minTestDuration]}
                  onValueChange={([v]) => setSettings({...settings, minTestDuration: v})}
                  min={3}
                  max={30}
                  step={1}
                />
                <p className="text-sm">{settings.minTestDuration} dias</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Parar Variantes Perdedoras</Label>
                  <p className="text-sm text-slate-500">Encerra variantes com performance inferior</p>
                </div>
                <Switch 
                  checked={settings.autoStopLosingVariants}
                  onCheckedChange={(v) => setSettings({...settings, autoStopLosingVariants: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Settings */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoramento de Performance</CardTitle>
              <CardDescription>Alertas automáticos para problemas de conversão</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Monitorar Queda de Conversão</Label>
                  <p className="text-sm text-slate-500">Alertar quando conversão cair significativamente</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.conversionDropThreshold}
                    onChange={(e) => setSettings({...settings, conversionDropThreshold: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.monitorConversionDrop}
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <Switch 
                    checked={settings.monitorConversionDrop}
                    onCheckedChange={(v) => setSettings({...settings, monitorConversionDrop: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Monitorar Pico de Abandono</Label>
                  <p className="text-sm text-slate-500">Alertar quando abandono aumentar</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.abandonmentSpikeThreshold}
                    onChange={(e) => setSettings({...settings, abandonmentSpikeThreshold: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.monitorAbandonmentSpike}
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <Switch 
                    checked={settings.monitorAbandonmentSpike}
                    onCheckedChange={(v) => setSettings({...settings, monitorAbandonmentSpike: v})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações da Equipe</CardTitle>
              <CardDescription>Alertas para o time interno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Teste Concluído</Label>
                  <p className="text-sm text-slate-500">Notificar quando testes finalizarem</p>
                </div>
                <Switch 
                  checked={settings.notifyTestComplete}
                  onCheckedChange={(v) => setSettings({...settings, notifyTestComplete: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Lift Significativo</Label>
                  <p className="text-sm text-slate-500">Quando uma variante supera threshold</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.liftThreshold}
                    onChange={(e) => setSettings({...settings, liftThreshold: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.notifySignificantLift}
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <Switch 
                    checked={settings.notifySignificantLift}
                    onCheckedChange={(v) => setSettings({...settings, notifySignificantLift: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Queda de Conversão</Label>
                  <p className="text-sm text-slate-500">Alertar problemas em merchants</p>
                </div>
                <Switch 
                  checked={settings.notifyConversionDrop}
                  onCheckedChange={(v) => setSettings({...settings, notifyConversionDrop: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Digest Semanal</Label>
                  <p className="text-sm text-slate-500">Resumo de performance dos experimentos</p>
                </div>
                <Switch 
                  checked={settings.weeklyDigestEnabled}
                  onCheckedChange={(v) => setSettings({...settings, weeklyDigestEnabled: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}