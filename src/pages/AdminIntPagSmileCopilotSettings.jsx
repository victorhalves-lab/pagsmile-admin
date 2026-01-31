import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Settings, 
  Bell,
  Mail,
  Clock,
  Target,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Users,
  BarChart3,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntPagSmileCopilotSettings() {
  const [settings, setSettings] = useState({
    dailySummary: true,
    summaryTime: '09:00',
    alertsEnabled: true,
    chargebackThreshold: [1.5],
    volumeAnomalyThreshold: [200],
    kycQueueAlert: true,
    kycQueueThreshold: [20],
    rateOptimizationSuggestions: true,
    portfolioHealthMonitoring: true,
    emailNotifications: true,
    slackIntegration: false,
    autoApplyRecommendations: false
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Configurações - PagSmile Copilot</h1>
              <p className="text-sm text-slate-500">Personalize o comportamento do seu copiloto interno</p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>

      <Tabs defaultValue="alerts">
        <TabsList>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Configuração de Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de Chargeback Ratio</Label>
                  <p className="text-xs text-slate-500">Alertar quando merchant ultrapassar threshold</p>
                </div>
                <Switch 
                  checked={settings.alertsEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, alertsEnabled: v})} 
                />
              </div>
              
              {settings.alertsEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-purple-200">
                  <Label>Threshold de Chargeback: {settings.chargebackThreshold}%</Label>
                  <Slider 
                    value={settings.chargebackThreshold} 
                    onValueChange={(v) => setSettings({...settings, chargebackThreshold: v})}
                    min={0.5}
                    max={3}
                    step={0.1}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>Alerta de Anomalia de Volume</Label>
                  <p className="text-xs text-slate-500">Alertar quando volume variar significativamente</p>
                </div>
                <Switch checked={true} />
              </div>

              <div className="space-y-2">
                <Label>Threshold de Variação: {settings.volumeAnomalyThreshold}%</Label>
                <Slider 
                  value={settings.volumeAnomalyThreshold} 
                  onValueChange={(v) => setSettings({...settings, volumeAnomalyThreshold: v})}
                  min={50}
                  max={500}
                  step={10}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Alerta de Fila KYC</Label>
                  <p className="text-xs text-slate-500">Alertar quando fila ultrapassar limite</p>
                </div>
                <Switch 
                  checked={settings.kycQueueAlert} 
                  onCheckedChange={(v) => setSettings({...settings, kycQueueAlert: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                Geração de Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Resumo Diário Automático</Label>
                  <p className="text-xs text-slate-500">Receber resumo executivo todos os dias</p>
                </div>
                <Switch 
                  checked={settings.dailySummary} 
                  onCheckedChange={(v) => setSettings({...settings, dailySummary: v})} 
                />
              </div>

              {settings.dailySummary && (
                <div className="space-y-2 pl-4 border-l-2 border-purple-200">
                  <Label>Horário do Resumo</Label>
                  <Input 
                    type="time" 
                    value={settings.summaryTime}
                    onChange={(e) => setSettings({...settings, summaryTime: e.target.value})}
                    className="w-32"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>Sugestões de Otimização de Taxa</Label>
                  <p className="text-xs text-slate-500">Análise automática de clusters para ajuste de taxas</p>
                </div>
                <Switch 
                  checked={settings.rateOptimizationSuggestions} 
                  onCheckedChange={(v) => setSettings({...settings, rateOptimizationSuggestions: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Monitoramento de Saúde do Portfólio</Label>
                  <p className="text-xs text-slate-500">Classificação automática de merchants</p>
                </div>
                <Switch 
                  checked={settings.portfolioHealthMonitoring} 
                  onCheckedChange={(v) => setSettings({...settings, portfolioHealthMonitoring: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-500" />
                Canais de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email</Label>
                  <p className="text-xs text-slate-500">Receber alertas por email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications} 
                  onCheckedChange={(v) => setSettings({...settings, emailNotifications: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Integração Slack</Label>
                  <p className="text-xs text-slate-500">Enviar alertas para canal do Slack</p>
                </div>
                <Switch 
                  checked={settings.slackIntegration} 
                  onCheckedChange={(v) => setSettings({...settings, slackIntegration: v})} 
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                <div>
                  <Label className="text-amber-700">Aplicar Recomendações Automaticamente</Label>
                  <p className="text-xs text-amber-600">⚠️ Ações serão executadas sem confirmação</p>
                </div>
                <Switch 
                  checked={settings.autoApplyRecommendations} 
                  onCheckedChange={(v) => setSettings({...settings, autoApplyRecommendations: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}