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
  Gavel,
  Zap,
  Target,
  AlertTriangle,
  Bell,
  DollarSign,
  Clock,
  FileText,
  Shield,
  Users,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntDisputeManagerSettings() {
  const [settings, setSettings] = useState({
    // Global
    agentEnabled: true,
    autoContestHighProbability: true,
    minWinProbabilityForAutoContest: 85,
    
    // Auto-accept rules - Global
    enableAutoAcceptGlobal: true,
    globalAutoAcceptMaxValue: 100,
    autoAcceptIfNoEvidence: false,
    
    // Escalation - Global
    escalateHighValue: true,
    globalHighValueThreshold: 10000,
    escalateToComplianceAbove: 50000,
    
    // SLA
    slaResponseHours: 48,
    slaEscalationHours: 24,
    autoAssignAnalyst: true,
    
    // Ratio Monitoring
    monitorChargebackRatio: true,
    ratioAlertThreshold: 1.0,
    ratioCriticalThreshold: 1.5,
    autoBlockAboveCritical: false,
    
    // Notifications
    notifyNewDispute: true,
    notifyHighValue: true,
    highValueNotificationThreshold: 5000,
    notifyRatioAlert: true,
    dailyDigest: true,
    digestTime: "08:00"
  });

  const handleSave = () => {
    alert('Configurações globais do Dispute Manager salvas!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminIntDisputeManager')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações Globais - Dispute Manager</h1>
            <p className="text-slate-500">Parâmetros de disputas para toda a plataforma</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="automation">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="sla">SLA</TabsTrigger>
          <TabsTrigger value="ratio">Ratio</TabsTrigger>
          <TabsTrigger value="escalation">Escalonamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automação de Contestação</CardTitle>
              <CardDescription>Regras globais para contestação automática</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Agente Ativo Globalmente</Label>
                  <p className="text-sm text-slate-500">Habilita gestão automática de disputas</p>
                </div>
                <Switch 
                  checked={settings.agentEnabled}
                  onCheckedChange={(v) => setSettings({...settings, agentEnabled: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Contestar Automaticamente (Alta Probabilidade)</Label>
                  <p className="text-sm text-slate-500">Inicia contestação sem intervenção manual</p>
                </div>
                <Switch 
                  checked={settings.autoContestHighProbability}
                  onCheckedChange={(v) => setSettings({...settings, autoContestHighProbability: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Probabilidade Mínima para Auto-Contestar</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[settings.minWinProbabilityForAutoContest]}
                    onValueChange={([v]) => setSettings({...settings, minWinProbabilityForAutoContest: v})}
                    min={70}
                    max={95}
                    step={5}
                    className="flex-1"
                    disabled={!settings.autoContestHighProbability}
                  />
                  <span className="text-lg font-bold w-16 text-right">{settings.minWinProbabilityForAutoContest}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Habilitar Auto-Aceitar Globalmente</Label>
                  <p className="text-sm text-slate-500">Permite aceitar disputas de baixo valor</p>
                </div>
                <Switch 
                  checked={settings.enableAutoAcceptGlobal}
                  onCheckedChange={(v) => setSettings({...settings, enableAutoAcceptGlobal: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Valor Máximo Global para Auto-Aceitar</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.globalAutoAcceptMaxValue}
                    onChange={(e) => setSettings({...settings, globalAutoAcceptMaxValue: Number(e.target.value)})}
                    className="w-32"
                    disabled={!settings.enableAutoAcceptGlobal}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SLA Settings */}
        <TabsContent value="sla" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Acordos de Nível de Serviço (SLA)</CardTitle>
              <CardDescription>Defina tempos máximos de resposta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Tempo Máximo de Resposta Inicial</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={settings.slaResponseHours}
                    onChange={(e) => setSettings({...settings, slaResponseHours: Number(e.target.value)})}
                    className="w-24"
                  />
                  <span className="text-sm text-slate-500">horas</span>
                </div>
                <p className="text-xs text-slate-500">Tempo máximo para primeira ação em uma disputa</p>
              </div>

              <div className="space-y-3">
                <Label>Tempo para Escalonamento Automático</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={settings.slaEscalationHours}
                    onChange={(e) => setSettings({...settings, slaEscalationHours: Number(e.target.value)})}
                    className="w-24"
                  />
                  <span className="text-sm text-slate-500">horas</span>
                </div>
                <p className="text-xs text-slate-500">Se não houver ação, escala para supervisor</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Atribuição Automática de Analista</Label>
                  <p className="text-sm text-slate-500">Distribui disputas automaticamente</p>
                </div>
                <Switch 
                  checked={settings.autoAssignAnalyst}
                  onCheckedChange={(v) => setSettings({...settings, autoAssignAnalyst: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ratio Monitoring */}
        <TabsContent value="ratio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoramento de Chargeback Ratio</CardTitle>
              <CardDescription>Alertas e ações baseadas no ratio de chargebacks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Monitorar Ratio de Chargebacks</Label>
                  <p className="text-sm text-slate-500">Acompanha ratio de cada merchant</p>
                </div>
                <Switch 
                  checked={settings.monitorChargebackRatio}
                  onCheckedChange={(v) => setSettings({...settings, monitorChargebackRatio: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Threshold de Alerta</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={settings.ratioAlertThreshold}
                    onChange={(e) => setSettings({...settings, ratioAlertThreshold: Number(e.target.value)})}
                    className="w-24"
                    step="0.1"
                    disabled={!settings.monitorChargebackRatio}
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
                <p className="text-xs text-slate-500">Envia alerta quando merchant ultrapassar</p>
              </div>

              <div className="space-y-3">
                <Label>Threshold Crítico</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number"
                    value={settings.ratioCriticalThreshold}
                    onChange={(e) => setSettings({...settings, ratioCriticalThreshold: Number(e.target.value)})}
                    className="w-24"
                    step="0.1"
                    disabled={!settings.monitorChargebackRatio}
                  />
                  <span className="text-sm text-slate-500">%</span>
                </div>
                <p className="text-xs text-slate-500">Acima deste valor, merchant entra em análise de risco</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-red-50 dark:bg-red-900/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-base">Bloquear Acima do Crítico</Label>
                    <p className="text-sm text-slate-500">Suspende processamento automaticamente</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.autoBlockAboveCritical}
                  onCheckedChange={(v) => setSettings({...settings, autoBlockAboveCritical: v})}
                  disabled={!settings.monitorChargebackRatio}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escalation Settings */}
        <TabsContent value="escalation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Escalonamento</CardTitle>
              <CardDescription>Defina quando escalar para níveis superiores</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Escalar Valores Altos</Label>
                  <p className="text-sm text-slate-500">Requer aprovação para valores elevados</p>
                </div>
                <Switch 
                  checked={settings.escalateHighValue}
                  onCheckedChange={(v) => setSettings({...settings, escalateHighValue: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Threshold de Valor Alto (Supervisor)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.globalHighValueThreshold}
                    onChange={(e) => setSettings({...settings, globalHighValueThreshold: Number(e.target.value)})}
                    className="w-32"
                    disabled={!settings.escalateHighValue}
                  />
                </div>
                <p className="text-xs text-slate-500">Disputas acima escalam para supervisor</p>
              </div>

              <div className="space-y-3">
                <Label>Threshold para Compliance</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.escalateToComplianceAbove}
                    onChange={(e) => setSettings({...settings, escalateToComplianceAbove: Number(e.target.value)})}
                    className="w-32"
                  />
                </div>
                <p className="text-xs text-slate-500">Disputas acima requerem revisão de compliance</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações da Equipe</CardTitle>
              <CardDescription>Alertas para o time de disputas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Nova Disputa Recebida</Label>
                  <p className="text-sm text-slate-500">Notificar cada nova disputa</p>
                </div>
                <Switch 
                  checked={settings.notifyNewDispute}
                  onCheckedChange={(v) => setSettings({...settings, notifyNewDispute: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Disputa de Alto Valor</Label>
                  <p className="text-sm text-slate-500">Alerta especial para valores elevados</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.highValueNotificationThreshold}
                    onChange={(e) => setSettings({...settings, highValueNotificationThreshold: Number(e.target.value)})}
                    className="w-24"
                    disabled={!settings.notifyHighValue}
                  />
                  <Switch 
                    checked={settings.notifyHighValue}
                    onCheckedChange={(v) => setSettings({...settings, notifyHighValue: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Alerta de Ratio</Label>
                  <p className="text-sm text-slate-500">Quando merchant ultrapassar threshold</p>
                </div>
                <Switch 
                  checked={settings.notifyRatioAlert}
                  onCheckedChange={(v) => setSettings({...settings, notifyRatioAlert: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Digest Diário</Label>
                  <p className="text-sm text-slate-500">Resumo diário de disputas</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="time"
                    value={settings.digestTime}
                    onChange={(e) => setSettings({...settings, digestTime: e.target.value})}
                    className="w-28"
                    disabled={!settings.dailyDigest}
                  />
                  <Switch 
                    checked={settings.dailyDigest}
                    onCheckedChange={(v) => setSettings({...settings, dailyDigest: v})}
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