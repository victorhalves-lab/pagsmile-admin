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
  Settings, 
  Shuffle,
  Zap,
  Target,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Smartphone,
  Monitor,
  Clock,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function ConverterAgentSettings() {
  const [settings, setSettings] = useState({
    // Global
    agentEnabled: true,
    autoApplyWinners: false,
    minSampleSize: 1000,
    confidenceLevel: 95,
    
    // A/B Tests
    maxConcurrentTests: 3,
    autoStopLosingVariants: true,
    minTestDuration: 7,
    
    // Personalization
    enableDynamicPersonalization: true,
    pixFirstMobile: true,
    simplifiedLayoutSlowNetwork: true,
    savedMethodReturning: true,
    
    // Notifications
    notifyTestComplete: true,
    notifySignificantLift: true,
    liftThreshold: 5,
    notifyConversionDrop: true,
    conversionDropThreshold: 10
  });

  const handleSave = () => {
    // Simulated save
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('ConverterAgent')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Shuffle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações do Converter Agent</h1>
            <p className="text-slate-500">Ajuste comportamentos, thresholds e automações</p>
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

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="experiments">Experimentos</TabsTrigger>
          <TabsTrigger value="personalization">Personalização</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Controle o comportamento geral do agente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Agente Ativo</Label>
                  <p className="text-sm text-slate-500">Habilita análises e otimizações automáticas</p>
                </div>
                <Switch 
                  checked={settings.agentEnabled}
                  onCheckedChange={(v) => setSettings({...settings, agentEnabled: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Aplicar Vencedores Automaticamente</Label>
                  <p className="text-sm text-slate-500">Implementa variantes vencedoras sem aprovação manual</p>
                </div>
                <Switch 
                  checked={settings.autoApplyWinners}
                  onCheckedChange={(v) => setSettings({...settings, autoApplyWinners: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Nível de Confiança Estatística</Label>
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
                <p className="text-xs text-slate-500">Maior confiança = menos falsos positivos, mas testes mais longos</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experiments Settings */}
        <TabsContent value="experiments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Experimentos A/B</CardTitle>
              <CardDescription>Defina regras para execução de testes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Máximo de Testes Simultâneos</Label>
                <Select 
                  value={String(settings.maxConcurrentTests)}
                  onValueChange={(v) => setSettings({...settings, maxConcurrentTests: Number(v)})}
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
                <Label>Tamanho Mínimo da Amostra</Label>
                <Input 
                  type="number"
                  value={settings.minSampleSize}
                  onChange={(e) => setSettings({...settings, minSampleSize: Number(e.target.value)})}
                />
                <p className="text-xs text-slate-500">Número mínimo de conversões antes de declarar vencedor</p>
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
                  <p className="text-sm text-slate-500">Encerra variantes com performance muito inferior</p>
                </div>
                <Switch 
                  checked={settings.autoStopLosingVariants}
                  onCheckedChange={(v) => setSettings({...settings, autoStopLosingVariants: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personalization Settings */}
        <TabsContent value="personalization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Personalização Dinâmica</CardTitle>
              <CardDescription>Configure ajustes automáticos baseados em contexto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">Personalização Dinâmica</Label>
                    <p className="text-sm text-slate-500">Habilita todas as regras abaixo</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.enableDynamicPersonalization}
                  onCheckedChange={(v) => setSettings({...settings, enableDynamicPersonalization: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">PIX Primeiro em Mobile</Label>
                    <p className="text-sm text-slate-500">Prioriza PIX para usuários mobile brasileiros</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">+12% conv.</Badge>
                  <Switch 
                    checked={settings.pixFirstMobile}
                    onCheckedChange={(v) => setSettings({...settings, pixFirstMobile: v})}
                    disabled={!settings.enableDynamicPersonalization}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">Layout Simplificado em Rede Lenta</Label>
                    <p className="text-sm text-slate-500">Reduz elementos para conexões lentas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">-45% abandono</Badge>
                  <Switch 
                    checked={settings.simplifiedLayoutSlowNetwork}
                    onCheckedChange={(v) => setSettings({...settings, simplifiedLayoutSlowNetwork: v})}
                    disabled={!settings.enableDynamicPersonalization}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">Método Salvo para Recorrentes</Label>
                    <p className="text-sm text-slate-500">Pré-seleciona último método usado</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">+25% veloc.</Badge>
                  <Switch 
                    checked={settings.savedMethodReturning}
                    onCheckedChange={(v) => setSettings({...settings, savedMethodReturning: v})}
                    disabled={!settings.enableDynamicPersonalization}
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
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Defina quando receber alertas do agente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <Label className="text-base">Teste Concluído</Label>
                    <p className="text-sm text-slate-500">Notificar quando um teste A/B finalizar</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyTestComplete}
                  onCheckedChange={(v) => setSettings({...settings, notifyTestComplete: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">Lift Significativo Detectado</Label>
                    <p className="text-sm text-slate-500">Quando uma variante supera o threshold</p>
                  </div>
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
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-base">Queda de Conversão</Label>
                    <p className="text-sm text-slate-500">Alerta quando conversão cair significativamente</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.conversionDropThreshold}
                    onChange={(e) => setSettings({...settings, conversionDropThreshold: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.notifyConversionDrop}
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <Switch 
                    checked={settings.notifyConversionDrop}
                    onCheckedChange={(v) => setSettings({...settings, notifyConversionDrop: v})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}