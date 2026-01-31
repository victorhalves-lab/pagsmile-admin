import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fingerprint, Save, ArrowLeft, Brain, Shield, Clock, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntIdentityOnboarderSettings() {
  const [settings, setSettings] = useState({
    helenaAutoApprove: true,
    autoApproveThreshold: [80],
    autoRejectThreshold: [30],
    manualReviewRange: { min: 30, max: 80 },
    pepCheckEnabled: true,
    sanctionsCheckEnabled: true,
    addressValidation: true,
    partnerValidation: true,
    queueAlerts: true,
    queueThreshold: [20],
    slaHours: [8],
    notifyOnAutoApprove: false,
    notifyOnManualReview: true
  });

  const handleSave = () => {
    toast.success('Configurações do Identity Onboarder salvas!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={createPageUrl('AdminIntIdentityOnboarder')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Configurações - Identity Onboarder</h1>
              <p className="text-sm text-slate-500">Configurações da Helena AI e validações KYC/KYB</p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>

      <Tabs defaultValue="helena">
        <TabsList>
          <TabsTrigger value="helena">Helena AI</TabsTrigger>
          <TabsTrigger value="validations">Validações</TabsTrigger>
          <TabsTrigger value="sla">SLA e Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="helena" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-500" />
                Configuração da Helena AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-Aprovação Habilitada</Label>
                  <p className="text-xs text-slate-500">Helena pode aprovar automaticamente scores altos</p>
                </div>
                <Switch 
                  checked={settings.helenaAutoApprove} 
                  onCheckedChange={(v) => setSettings({...settings, helenaAutoApprove: v})} 
                />
              </div>

              {settings.helenaAutoApprove && (
                <div className="space-y-4 pl-4 border-l-2 border-indigo-200">
                  <div className="space-y-2">
                    <Label>Threshold para Auto-Aprovação: {settings.autoApproveThreshold}</Label>
                    <Slider 
                      value={settings.autoApproveThreshold} 
                      onValueChange={(v) => setSettings({...settings, autoApproveThreshold: v})}
                      min={60}
                      max={95}
                      step={5}
                    />
                    <p className="text-xs text-slate-500">Scores acima deste valor serão aprovados automaticamente</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Threshold para Auto-Rejeição: {settings.autoRejectThreshold}</Label>
                    <Slider 
                      value={settings.autoRejectThreshold} 
                      onValueChange={(v) => setSettings({...settings, autoRejectThreshold: v})}
                      min={10}
                      max={50}
                      step={5}
                    />
                    <p className="text-xs text-slate-500">Scores abaixo deste valor serão rejeitados automaticamente</p>
                  </div>
                </div>
              )}

              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200">
                <p className="text-sm text-indigo-700">
                  <strong>Faixa de Revisão Manual:</strong> Scores entre {settings.autoRejectThreshold} e {settings.autoApproveThreshold} serão encaminhados para análise humana.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                Validações Obrigatórias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Verificação de PEP</Label>
                  <p className="text-xs text-slate-500">Verificar Pessoa Politicamente Exposta</p>
                </div>
                <Switch 
                  checked={settings.pepCheckEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, pepCheckEnabled: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Verificação em Listas de Sanções</Label>
                  <p className="text-xs text-slate-500">Checar listas OFAC, ONU, etc.</p>
                </div>
                <Switch 
                  checked={settings.sanctionsCheckEnabled} 
                  onCheckedChange={(v) => setSettings({...settings, sanctionsCheckEnabled: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Validação de Endereço</Label>
                  <p className="text-xs text-slate-500">Verificar endereço via Correios</p>
                </div>
                <Switch 
                  checked={settings.addressValidation} 
                  onCheckedChange={(v) => setSettings({...settings, addressValidation: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Validação de Sócios</Label>
                  <p className="text-xs text-slate-500">Verificar CPF e restrições dos sócios</p>
                </div>
                <Switch 
                  checked={settings.partnerValidation} 
                  onCheckedChange={(v) => setSettings({...settings, partnerValidation: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                SLA e Alertas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>SLA de Processamento: {settings.slaHours} horas</Label>
                <Slider 
                  value={settings.slaHours} 
                  onValueChange={(v) => setSettings({...settings, slaHours: v})}
                  min={1}
                  max={48}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de Fila</Label>
                  <p className="text-xs text-slate-500">Alertar quando fila ultrapassar limite</p>
                </div>
                <Switch 
                  checked={settings.queueAlerts} 
                  onCheckedChange={(v) => setSettings({...settings, queueAlerts: v})} 
                />
              </div>

              {settings.queueAlerts && (
                <div className="space-y-2 pl-4 border-l-2 border-indigo-200">
                  <Label>Threshold da Fila: {settings.queueThreshold} submissões</Label>
                  <Slider 
                    value={settings.queueThreshold} 
                    onValueChange={(v) => setSettings({...settings, queueThreshold: v})}
                    min={5}
                    max={100}
                    step={5}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificar em Auto-Aprovações</Label>
                  <p className="text-xs text-slate-500">Enviar email quando Helena aprovar</p>
                </div>
                <Switch 
                  checked={settings.notifyOnAutoApprove} 
                  onCheckedChange={(v) => setSettings({...settings, notifyOnAutoApprove: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificar em Revisão Manual</Label>
                  <p className="text-xs text-slate-500">Alertar quando encaminhado para análise</p>
                </div>
                <Switch 
                  checked={settings.notifyOnManualReview} 
                  onCheckedChange={(v) => setSettings({...settings, notifyOnManualReview: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}