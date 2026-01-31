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
  Gavel,
  Zap,
  Target,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Bell,
  DollarSign,
  Clock,
  FileText,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function DisputeManagerSettings() {
  const [settings, setSettings] = useState({
    // General
    agentEnabled: true,
    autoContestHighProbability: true,
    minWinProbabilityForAutoContest: 85,
    
    // Auto-accept rules
    enableAutoAccept: true,
    autoAcceptMaxValue: 50,
    autoAcceptIfNoEvidence: false,
    
    // Escalation
    escalateHighValue: true,
    highValueThreshold: 5000,
    escalateRecurringCustomer: true,
    
    // Notifications
    notifyNewDispute: true,
    notifyDeadlineApproaching: true,
    deadlineWarningDays: 3,
    notifyWinLoss: true,
    notifyRatioAlert: true,
    ratioAlertThreshold: 1.5
  });

  const handleSave = () => {
    alert('Configurações salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('DisputeManager')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações do Dispute Manager</h1>
            <p className="text-slate-500">Regras de automação, thresholds e notificações</p>
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="automation">Automação</TabsTrigger>
          <TabsTrigger value="autoaccept">Auto-Aceitar</TabsTrigger>
          <TabsTrigger value="escalation">Escalonamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automação de Contestação</CardTitle>
              <CardDescription>Configure regras para contestação automática</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Agente Ativo</Label>
                  <p className="text-sm text-slate-500">Habilita análises e recomendações automáticas</p>
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
                <p className="text-xs text-slate-500">Disputas com probabilidade acima serão contestadas automaticamente</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auto-Accept Settings */}
        <TabsContent value="autoaccept" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Regras de Auto-Aceitar Perda</CardTitle>
              <CardDescription>Defina quando aceitar disputas automaticamente para economizar tempo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">Habilitar Auto-Aceitar</Label>
                    <p className="text-sm text-slate-500">Aceita disputas de baixo valor automaticamente</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.enableAutoAccept}
                  onCheckedChange={(v) => setSettings({...settings, enableAutoAccept: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Valor Máximo para Auto-Aceitar</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.autoAcceptMaxValue}
                    onChange={(e) => setSettings({...settings, autoAcceptMaxValue: Number(e.target.value)})}
                    className="w-32"
                    disabled={!settings.enableAutoAccept}
                  />
                </div>
                <p className="text-xs text-slate-500">Disputas abaixo deste valor serão aceitas automaticamente</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border bg-amber-50 dark:bg-amber-900/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div>
                    <Label className="text-base">Auto-Aceitar Sem Evidências</Label>
                    <p className="text-sm text-slate-500">Aceita se não houver evidências suficientes</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.autoAcceptIfNoEvidence}
                  onCheckedChange={(v) => setSettings({...settings, autoAcceptIfNoEvidence: v})}
                  disabled={!settings.enableAutoAccept}
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
              <CardDescription>Defina quando escalar disputas para revisão manual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">Escalar Valores Altos</Label>
                    <p className="text-sm text-slate-500">Requer aprovação manual para valores acima do threshold</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.escalateHighValue}
                  onCheckedChange={(v) => setSettings({...settings, escalateHighValue: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Threshold de Valor Alto</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">R$</span>
                  <Input 
                    type="number"
                    value={settings.highValueThreshold}
                    onChange={(e) => setSettings({...settings, highValueThreshold: Number(e.target.value)})}
                    className="w-32"
                    disabled={!settings.escalateHighValue}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-500" />
                  <div>
                    <Label className="text-base">Escalar Cliente Recorrente</Label>
                    <p className="text-sm text-slate-500">Requer revisão para clientes com histórico de compras</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.escalateRecurringCustomer}
                  onCheckedChange={(v) => setSettings({...settings, escalateRecurringCustomer: v})}
                />
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
                  <Bell className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">Nova Disputa Recebida</Label>
                    <p className="text-sm text-slate-500">Notificar quando uma nova disputa for aberta</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyNewDispute}
                  onCheckedChange={(v) => setSettings({...settings, notifyNewDispute: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <div>
                    <Label className="text-base">Prazo se Aproximando</Label>
                    <p className="text-sm text-slate-500">Alertar quando prazo estiver próximo</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.deadlineWarningDays}
                    onChange={(e) => setSettings({...settings, deadlineWarningDays: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.notifyDeadlineApproaching}
                  />
                  <span className="text-sm text-slate-500">dias</span>
                  <Switch 
                    checked={settings.notifyDeadlineApproaching}
                    onCheckedChange={(v) => setSettings({...settings, notifyDeadlineApproaching: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <div>
                    <Label className="text-base">Resultado de Disputa</Label>
                    <p className="text-sm text-slate-500">Notificar quando uma disputa for resolvida</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyWinLoss}
                  onCheckedChange={(v) => setSettings({...settings, notifyWinLoss: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-base">Alerta de Chargeback Ratio</Label>
                    <p className="text-sm text-slate-500">Alertar quando ratio ultrapassar limite</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.ratioAlertThreshold}
                    onChange={(e) => setSettings({...settings, ratioAlertThreshold: Number(e.target.value)})}
                    className="w-20"
                    step="0.1"
                    disabled={!settings.notifyRatioAlert}
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <Switch 
                    checked={settings.notifyRatioAlert}
                    onCheckedChange={(v) => setSettings({...settings, notifyRatioAlert: v})}
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