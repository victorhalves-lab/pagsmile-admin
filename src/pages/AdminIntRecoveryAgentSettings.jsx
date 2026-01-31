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
  RefreshCw,
  Mail,
  MessageSquare,
  Bell,
  Clock,
  DollarSign,
  Zap,
  Target,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntRecoveryAgentSettings() {
  const [settings, setSettings] = useState({
    // Global
    agentEnabled: true,
    autoRetryEnabled: true,
    maxRetryAttempts: 3,
    retryIntervalMinutes: 30,
    
    // Channels
    smsEnabled: true,
    emailEnabled: true,
    whatsappEnabled: true,
    pushEnabled: false,
    
    // Thresholds
    minValueForRecovery: 50,
    maxValueForAutoRecovery: 5000,
    priorityHighValueThreshold: 1000,
    
    // Timing
    firstAttemptDelayMinutes: 15,
    escalationAfterHours: 24,
    maxRecoveryWindowDays: 7,
    
    // Notifications
    notifyRecoverySuccess: true,
    notifyEscalation: true,
    dailySummaryEnabled: true,
    summaryTime: "09:00"
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminIntRecoveryAgent')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações do Recovery Agent</h1>
            <p className="text-slate-500">Parâmetros globais de recuperação de pagamentos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave} className="bg-amber-600 hover:bg-amber-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Controle o comportamento global do agente de recuperação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Agente Ativo</Label>
                  <p className="text-sm text-slate-500">Habilita recuperação automática de pagamentos</p>
                </div>
                <Switch 
                  checked={settings.agentEnabled}
                  onCheckedChange={(v) => setSettings({...settings, agentEnabled: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Retry Automático</Label>
                  <p className="text-sm text-slate-500">Tenta reprocessar pagamentos automaticamente</p>
                </div>
                <Switch 
                  checked={settings.autoRetryEnabled}
                  onCheckedChange={(v) => setSettings({...settings, autoRetryEnabled: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Máximo de Tentativas de Retry</Label>
                <Slider 
                  value={[settings.maxRetryAttempts]}
                  onValueChange={([v]) => setSettings({...settings, maxRetryAttempts: v})}
                  min={1}
                  max={5}
                  step={1}
                />
                <p className="text-sm">{settings.maxRetryAttempts} tentativas</p>
              </div>

              <div className="space-y-3">
                <Label>Intervalo entre Retries (minutos)</Label>
                <Select 
                  value={String(settings.retryIntervalMinutes)}
                  onValueChange={(v) => setSettings({...settings, retryIntervalMinutes: Number(v)})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Settings */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Comunicação</CardTitle>
              <CardDescription>Defina quais canais o agente pode utilizar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                  <div>
                    <Label className="text-base">SMS</Label>
                    <p className="text-sm text-slate-500">Taxa de abertura: 98%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">Recomendado</Badge>
                  <Switch 
                    checked={settings.smsEnabled}
                    onCheckedChange={(v) => setSettings({...settings, smsEnabled: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">E-mail</Label>
                    <p className="text-sm text-slate-500">Taxa de abertura: 45%</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.emailEnabled}
                  onCheckedChange={(v) => setSettings({...settings, emailEnabled: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <div>
                    <Label className="text-base">WhatsApp</Label>
                    <p className="text-sm text-slate-500">Taxa de abertura: 95%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-700">Recomendado</Badge>
                  <Switch 
                    checked={settings.whatsappEnabled}
                    onCheckedChange={(v) => setSettings({...settings, whatsappEnabled: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label className="text-base">Push Notification</Label>
                    <p className="text-sm text-slate-500">Requer app do merchant</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.pushEnabled}
                  onCheckedChange={(v) => setSettings({...settings, pushEnabled: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thresholds Settings */}
        <TabsContent value="thresholds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thresholds de Valor</CardTitle>
              <CardDescription>Defina limites para ações automáticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Valor Mínimo para Recuperação</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.minValueForRecovery}
                    onChange={(e) => setSettings({...settings, minValueForRecovery: Number(e.target.value)})}
                    className="w-32"
                  />
                </div>
                <p className="text-xs text-slate-500">Transações abaixo deste valor não entrarão no fluxo de recuperação</p>
              </div>

              <div className="space-y-3">
                <Label>Valor Máximo para Recuperação Automática</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.maxValueForAutoRecovery}
                    onChange={(e) => setSettings({...settings, maxValueForAutoRecovery: Number(e.target.value)})}
                    className="w-32"
                  />
                </div>
                <p className="text-xs text-slate-500">Acima deste valor, requer aprovação manual</p>
              </div>

              <div className="space-y-3">
                <Label>Threshold de Alta Prioridade</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.priorityHighValueThreshold}
                    onChange={(e) => setSettings({...settings, priorityHighValueThreshold: Number(e.target.value)})}
                    className="w-32"
                  />
                </div>
                <p className="text-xs text-slate-500">Transações acima são marcadas como alta prioridade</p>
              </div>

              <div className="space-y-3">
                <Label>Janela Máxima de Recuperação (dias)</Label>
                <Slider 
                  value={[settings.maxRecoveryWindowDays]}
                  onValueChange={([v]) => setSettings({...settings, maxRecoveryWindowDays: v})}
                  min={1}
                  max={14}
                  step={1}
                />
                <p className="text-sm">{settings.maxRecoveryWindowDays} dias</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações Internas</CardTitle>
              <CardDescription>Configure alertas para a equipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-green-600" />
                  <div>
                    <Label className="text-base">Recuperação Bem-Sucedida</Label>
                    <p className="text-sm text-slate-500">Notificar quando um pagamento for recuperado</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyRecoverySuccess}
                  onCheckedChange={(v) => setSettings({...settings, notifyRecoverySuccess: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <Label className="text-base">Escalonamentos</Label>
                    <p className="text-sm text-slate-500">Alertar quando caso for escalonado</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyEscalation}
                  onCheckedChange={(v) => setSettings({...settings, notifyEscalation: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">Resumo Diário</Label>
                    <p className="text-sm text-slate-500">Enviar resumo de recuperações por e-mail</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="time"
                    value={settings.summaryTime}
                    onChange={(e) => setSettings({...settings, summaryTime: e.target.value})}
                    className="w-28"
                    disabled={!settings.dailySummaryEnabled}
                  />
                  <Switch 
                    checked={settings.dailySummaryEnabled}
                    onCheckedChange={(v) => setSettings({...settings, dailySummaryEnabled: v})}
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