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
  Sparkles,
  Bell,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Clock,
  Mail,
  MessageSquare,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntPagSmileCopilotSettings() {
  const [settings, setSettings] = useState({
    // General
    copilotEnabled: true,
    proactiveSuggestions: true,
    
    // Data Sources
    tpvAnalysisEnabled: true,
    merchantHealthEnabled: true,
    revenueAnalysisEnabled: true,
    riskMonitoringEnabled: true,
    
    // Alerts
    volumeAnomalyAlert: true,
    volumeAnomalyThreshold: 20,
    churnRiskAlert: true,
    churnRiskThreshold: 70,
    revenueDropAlert: true,
    revenueDropThreshold: 15,
    
    // Reports
    weeklyReportEnabled: true,
    weeklyReportDay: "monday",
    monthlyReportEnabled: true,
    
    // Notifications
    notifyByEmail: true,
    notifyBySlack: false,
    slackWebhook: "",
    notifyEmails: "equipe@pagsmile.com"
  });

  const handleSave = () => {
    alert('Configurações do PagSmile Copilot salvas com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminIntPagSmileCopilot')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações do PagSmile Copilot</h1>
            <p className="text-slate-500">Análises operacionais, alertas e relatórios</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Controle as funcionalidades do copilot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Copilot Ativo</Label>
                  <p className="text-sm text-slate-500">Habilita análises e insights automáticos</p>
                </div>
                <Switch 
                  checked={settings.copilotEnabled}
                  onCheckedChange={(v) => setSettings({...settings, copilotEnabled: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Sugestões Proativas</Label>
                  <p className="text-sm text-slate-500">Copilot sugere ações automaticamente</p>
                </div>
                <Switch 
                  checked={settings.proactiveSuggestions}
                  onCheckedChange={(v) => setSettings({...settings, proactiveSuggestions: v})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fontes de Dados</CardTitle>
              <CardDescription>Selecione quais análises o copilot deve realizar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'tpvAnalysisEnabled', label: 'Análise de TPV', description: 'Volume de transações e tendências', icon: BarChart3, color: 'text-blue-600' },
                { key: 'merchantHealthEnabled', label: 'Saúde dos Merchants', description: 'Churn, satisfação, performance', icon: TrendingUp, color: 'text-green-600' },
                { key: 'revenueAnalysisEnabled', label: 'Análise de Receita', description: 'MDR, taxas, rentabilidade', icon: TrendingUp, color: 'text-emerald-600' },
                { key: 'riskMonitoringEnabled', label: 'Monitoramento de Risco', description: 'Fraude, chargebacks, PLD', icon: AlertTriangle, color: 'text-red-600' },
              ].map(({ key, label, description, icon: Icon, color }) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${color}`} />
                    <div>
                      <Label className="text-base">{label}</Label>
                      <p className="text-sm text-slate-500">{description}</p>
                    </div>
                  </div>
                  <Switch 
                    checked={settings[key]}
                    onCheckedChange={(v) => setSettings({...settings, [key]: v})}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Settings */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Automáticos</CardTitle>
              <CardDescription>Configure quando o copilot deve alertar a equipe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Anomalia de Volume</Label>
                  <p className="text-sm text-slate-500">Alertar quando TPV variar significativamente</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.volumeAnomalyThreshold}
                    onChange={(e) => setSettings({...settings, volumeAnomalyThreshold: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.volumeAnomalyAlert}
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <Switch 
                    checked={settings.volumeAnomalyAlert}
                    onCheckedChange={(v) => setSettings({...settings, volumeAnomalyAlert: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Risco de Churn</Label>
                  <p className="text-sm text-slate-500">Alertar merchants com alto risco de churn</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.churnRiskThreshold}
                    onChange={(e) => setSettings({...settings, churnRiskThreshold: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.churnRiskAlert}
                  />
                  <span className="text-sm text-slate-500">score</span>
                  <Switch 
                    checked={settings.churnRiskAlert}
                    onCheckedChange={(v) => setSettings({...settings, churnRiskAlert: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Queda de Receita</Label>
                  <p className="text-sm text-slate-500">Alertar quando receita cair vs período anterior</p>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.revenueDropThreshold}
                    onChange={(e) => setSettings({...settings, revenueDropThreshold: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.revenueDropAlert}
                  />
                  <span className="text-sm text-slate-500">%</span>
                  <Switch 
                    checked={settings.revenueDropAlert}
                    onCheckedChange={(v) => setSettings({...settings, revenueDropAlert: v})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Settings */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Automáticos</CardTitle>
              <CardDescription>Configure a geração automática de relatórios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">Relatório Semanal</Label>
                    <p className="text-sm text-slate-500">Resumo de performance da semana</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select 
                    value={settings.weeklyReportDay}
                    onValueChange={(v) => setSettings({...settings, weeklyReportDay: v})}
                    disabled={!settings.weeklyReportEnabled}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Segunda</SelectItem>
                      <SelectItem value="tuesday">Terça</SelectItem>
                      <SelectItem value="wednesday">Quarta</SelectItem>
                      <SelectItem value="thursday">Quinta</SelectItem>
                      <SelectItem value="friday">Sexta</SelectItem>
                    </SelectContent>
                  </Select>
                  <Switch 
                    checked={settings.weeklyReportEnabled}
                    onCheckedChange={(v) => setSettings({...settings, weeklyReportEnabled: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label className="text-base">Relatório Mensal</Label>
                    <p className="text-sm text-slate-500">Análise completa do mês</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.monthlyReportEnabled}
                  onCheckedChange={(v) => setSettings({...settings, monthlyReportEnabled: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Canais de Notificação</CardTitle>
              <CardDescription>Defina como receber alertas e relatórios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">E-mail</Label>
                    <p className="text-sm text-slate-500">Receber notificações por e-mail</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyByEmail}
                  onCheckedChange={(v) => setSettings({...settings, notifyByEmail: v})}
                />
              </div>

              {settings.notifyByEmail && (
                <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                  <Label>E-mails de destino</Label>
                  <Input 
                    value={settings.notifyEmails}
                    onChange={(e) => setSettings({...settings, notifyEmails: e.target.value})}
                    placeholder="email1@pagsmile.com, email2@pagsmile.com"
                  />
                  <p className="text-xs text-slate-500">Separe múltiplos e-mails por vírgula</p>
                </div>
              )}

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  <div>
                    <Label className="text-base">Slack</Label>
                    <p className="text-sm text-slate-500">Integração com canal Slack</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyBySlack}
                  onCheckedChange={(v) => setSettings({...settings, notifyBySlack: v})}
                />
              </div>

              {settings.notifyBySlack && (
                <div className="space-y-2 pl-4 border-l-2 border-purple-200">
                  <Label>Webhook URL do Slack</Label>
                  <Input 
                    value={settings.slackWebhook}
                    onChange={(e) => setSettings({...settings, slackWebhook: e.target.value})}
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}