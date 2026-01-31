import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Settings, Save, ArrowLeft, MessageSquare, Mail, Bell, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntRecoveryAgentSettings() {
  const [settings, setSettings] = useState({
    globalPixDiscount: [5],
    autoRetryEnabled: true,
    retryDelaySeconds: [3],
    whatsappEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    communicationDelay: [5],
    maxCommunicationsPerDay: [3],
    enableForAllMerchants: true
  });

  const handleSave = () => {
    toast.success('Configurações do Recovery Agent salvas!');
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Configurações - Recovery Agent</h1>
              <p className="text-sm text-slate-500">Configurações globais de recuperação de pagamentos</p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>

      <Tabs defaultValue="strategies">
        <TabsList>
          <TabsTrigger value="strategies">Estratégias</TabsTrigger>
          <TabsTrigger value="communications">Comunicações</TabsTrigger>
          <TabsTrigger value="limits">Limites</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-500" />
                Estratégias de Recuperação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Desconto PIX Global: {settings.globalPixDiscount}%</Label>
                <Slider 
                  value={settings.globalPixDiscount} 
                  onValueChange={(v) => setSettings({...settings, globalPixDiscount: v})}
                  min={0}
                  max={15}
                  step={1}
                />
                <p className="text-xs text-slate-500">Desconto oferecido ao migrar para PIX após recusa de cartão</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Retry Automático</Label>
                  <p className="text-xs text-slate-500">Tentar novamente em caso de erro técnico</p>
                </div>
                <Switch 
                  checked={settings.autoRetryEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, autoRetryEnabled: v})} 
                />
              </div>

              {settings.autoRetryEnabled && (
                <div className="space-y-2 pl-4 border-l-2 border-orange-200">
                  <Label>Delay do Retry: {settings.retryDelaySeconds}s</Label>
                  <Slider 
                    value={settings.retryDelaySeconds} 
                    onValueChange={(v) => setSettings({...settings, retryDelaySeconds: v})}
                    min={1}
                    max={10}
                    step={1}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>Ativar para Todos os Merchants</Label>
                  <p className="text-xs text-slate-500">Aplicar configurações globalmente</p>
                </div>
                <Switch 
                  checked={settings.enableForAllMerchants} 
                  onCheckedChange={(v) => setSettings({...settings, enableForAllMerchants: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-orange-500" />
                Canais de Comunicação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>WhatsApp</Label>
                <Switch 
                  checked={settings.whatsappEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, whatsappEnabled: v})} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email</Label>
                <Switch 
                  checked={settings.emailEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, emailEnabled: v})} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS</Label>
                <Switch 
                  checked={settings.smsEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, smsEnabled: v})} 
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Push Notification</Label>
                <Switch 
                  checked={settings.pushEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, pushEnabled: v})} 
                />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Delay antes de comunicar: {settings.communicationDelay} minutos</Label>
                <Slider 
                  value={settings.communicationDelay} 
                  onValueChange={(v) => setSettings({...settings, communicationDelay: v})}
                  min={1}
                  max={60}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Limites e Frequência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Máximo de comunicações por cliente/dia: {settings.maxCommunicationsPerDay}</Label>
                <Slider 
                  value={settings.maxCommunicationsPerDay} 
                  onValueChange={(v) => setSettings({...settings, maxCommunicationsPerDay: v})}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}