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
  UserCheck,
  Brain,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Bell,
  Settings,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';

export default function AdminIntIdentityOnboarderSettings() {
  const [settings, setSettings] = useState({
    // Helena AI
    helenaEnabled: true,
    autoApproveThreshold: 80,
    autoRejectThreshold: 30,
    manualReviewRange: { min: 30, max: 80 },
    
    // Risk Weights
    mccWeight: 25,
    addressWeight: 20,
    documentWeight: 25,
    pepWeight: 15,
    financialWeight: 15,
    
    // Validations
    pepCheckRequired: true,
    sanctionsCheckRequired: true,
    addressVerificationRequired: true,
    livenessRequired: true,
    
    // High Risk MCCs
    highRiskMCCAutoApproveLimit: 70,
    requireManualForHighRiskMCC: true,
    
    // Notifications
    notifyAutoApproved: false,
    notifyAutoRejected: true,
    notifyManualReview: true,
    notifyDocumentExpiring: true,
    documentExpiryDays: 30
  });

  const handleSave = () => {
    alert('Configurações da Helena AI salvas com sucesso!');
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Configurações do Identity Onboarder</h1>
            <p className="text-slate-500">Parâmetros da Helena AI e validações KYC/KYB</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar
          </Button>
          <Button onClick={handleSave} className="bg-violet-600 hover:bg-violet-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="helena">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="helena">Helena AI</TabsTrigger>
          <TabsTrigger value="weights">Pesos de Risco</TabsTrigger>
          <TabsTrigger value="validations">Validações</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        {/* Helena AI Settings */}
        <TabsContent value="helena" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-violet-600" />
                Configurações da Helena AI
              </CardTitle>
              <CardDescription>Defina thresholds para decisões automáticas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Helena AI Ativa</Label>
                  <p className="text-sm text-slate-500">Habilita análise automática de KYC/KYB</p>
                </div>
                <Switch 
                  checked={settings.helenaEnabled}
                  onCheckedChange={(v) => setSettings({...settings, helenaEnabled: v})}
                />
              </div>

              <div className="space-y-3">
                <Label>Threshold de Auto-Aprovação</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[settings.autoApproveThreshold]}
                    onValueChange={([v]) => setSettings({...settings, autoApproveThreshold: v})}
                    min={60}
                    max={95}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-16 text-right text-green-600">{settings.autoApproveThreshold}</span>
                </div>
                <p className="text-xs text-slate-500">Score Helena acima deste valor = aprovação automática</p>
              </div>

              <div className="space-y-3">
                <Label>Threshold de Auto-Rejeição</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[settings.autoRejectThreshold]}
                    onValueChange={([v]) => setSettings({...settings, autoRejectThreshold: v})}
                    min={10}
                    max={50}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-16 text-right text-red-600">{settings.autoRejectThreshold}</span>
                </div>
                <p className="text-xs text-slate-500">Score Helena abaixo deste valor = rejeição automática</p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <Label className="text-amber-800 dark:text-amber-200">Zona de Revisão Manual</Label>
                </div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Scores entre {settings.autoRejectThreshold} e {settings.autoApproveThreshold} serão encaminhados para análise manual.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>MCCs de Alto Risco</CardTitle>
              <CardDescription>Regras específicas para categorias de alto risco</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Limite de Auto-Aprovação para MCCs de Alto Risco</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    value={[settings.highRiskMCCAutoApproveLimit]}
                    onValueChange={([v]) => setSettings({...settings, highRiskMCCAutoApproveLimit: v})}
                    min={50}
                    max={90}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-16 text-right">{settings.highRiskMCCAutoApproveLimit}</span>
                </div>
                <p className="text-xs text-slate-500">MCCs de alto risco têm threshold mais rigoroso</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <Label className="text-base">Exigir Revisão Manual para Alto Risco</Label>
                  <p className="text-sm text-slate-500">Mesmo com score alto, requer aprovação humana</p>
                </div>
                <Switch 
                  checked={settings.requireManualForHighRiskMCC}
                  onCheckedChange={(v) => setSettings({...settings, requireManualForHighRiskMCC: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Weights Settings */}
        <TabsContent value="weights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pesos de Risco no Score Helena</CardTitle>
              <CardDescription>Ajuste a importância de cada fator na pontuação (total deve ser 100%)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: 'mccWeight', label: 'MCC / Atividade', icon: Target },
                { key: 'addressWeight', label: 'Validação de Endereço', icon: FileText },
                { key: 'documentWeight', label: 'Documentos', icon: FileText },
                { key: 'pepWeight', label: 'PEP / Sanções', icon: ShieldCheck },
                { key: 'financialWeight', label: 'Perfil Financeiro', icon: Settings },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <Label>{label}</Label>
                    </div>
                    <span className="font-bold">{settings[key]}%</span>
                  </div>
                  <Slider 
                    value={[settings[key]]}
                    onValueChange={([v]) => setSettings({...settings, [key]: v})}
                    min={5}
                    max={40}
                    step={5}
                  />
                </div>
              ))}

              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <p className="text-sm font-medium">
                  Total dos Pesos: {settings.mccWeight + settings.addressWeight + settings.documentWeight + settings.pepWeight + settings.financialWeight}%
                </p>
                {(settings.mccWeight + settings.addressWeight + settings.documentWeight + settings.pepWeight + settings.financialWeight) !== 100 && (
                  <p className="text-xs text-amber-600 mt-1">⚠️ O total deve ser 100% para cálculo correto</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Validations Settings */}
        <TabsContent value="validations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validações Obrigatórias</CardTitle>
              <CardDescription>Defina quais verificações são requeridas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-base">Verificação PEP</Label>
                    <p className="text-sm text-slate-500">Pessoa Politicamente Exposta</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-700">Crítico</Badge>
                  <Switch 
                    checked={settings.pepCheckRequired}
                    onCheckedChange={(v) => setSettings({...settings, pepCheckRequired: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-base">Verificação de Sanções</Label>
                    <p className="text-sm text-slate-500">Listas OFAC, ONU, UE</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-700">Crítico</Badge>
                  <Switch 
                    checked={settings.sanctionsCheckRequired}
                    onCheckedChange={(v) => setSettings({...settings, sanctionsCheckRequired: v})}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">Validação de Endereço</Label>
                    <p className="text-sm text-slate-500">Comprovante de endereço válido</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.addressVerificationRequired}
                  onCheckedChange={(v) => setSettings({...settings, addressVerificationRequired: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-violet-600" />
                  <div>
                    <Label className="text-base">Liveness + Facematch</Label>
                    <p className="text-sm text-slate-500">Prova de vida com foto do documento</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.livenessRequired}
                  onCheckedChange={(v) => setSettings({...settings, livenessRequired: v})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notificações da Equipe</CardTitle>
              <CardDescription>Configure alertas para analistas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-green-600" />
                  <div>
                    <Label className="text-base">Auto-Aprovações</Label>
                    <p className="text-sm text-slate-500">Notificar quando Helena aprovar automaticamente</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyAutoApproved}
                  onCheckedChange={(v) => setSettings({...settings, notifyAutoApproved: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <Label className="text-base">Auto-Rejeições</Label>
                    <p className="text-sm text-slate-500">Notificar quando Helena rejeitar automaticamente</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyAutoRejected}
                  onCheckedChange={(v) => setSettings({...settings, notifyAutoRejected: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-amber-600" />
                  <div>
                    <Label className="text-base">Novos Casos para Revisão Manual</Label>
                    <p className="text-sm text-slate-500">Alertar quando novo caso entrar na fila</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.notifyManualReview}
                  onCheckedChange={(v) => setSettings({...settings, notifyManualReview: v})}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <Label className="text-base">Documentos Expirando</Label>
                    <p className="text-sm text-slate-500">Alertar X dias antes do vencimento</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input 
                    type="number"
                    value={settings.documentExpiryDays}
                    onChange={(e) => setSettings({...settings, documentExpiryDays: Number(e.target.value)})}
                    className="w-20"
                    disabled={!settings.notifyDocumentExpiring}
                  />
                  <span className="text-sm text-slate-500">dias</span>
                  <Switch 
                    checked={settings.notifyDocumentExpiring}
                    onCheckedChange={(v) => setSettings({...settings, notifyDocumentExpiring: v})}
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