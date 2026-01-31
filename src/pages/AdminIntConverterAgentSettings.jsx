import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shuffle, Save, ArrowLeft, Target, Zap, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/components/utils';
import { toast } from 'sonner';

export default function AdminIntConverterAgentSettings() {
  const [settings, setSettings] = useState({
    experimentModel: 'bandit',
    minSessionsForConclusion: [1000],
    autoApplyWinners: false,
    pixFirstGlobal: true,
    oneStepDefault: true,
    hideOptionalFieldsDefault: false,
    globalPixDiscount: [5],
    mobileOptimization: true,
    slowNetworkOptimization: true
  });

  const handleSave = () => {
    toast.success('Configurações do Converter Agent salvas!');
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
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Shuffle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Configurações - Converter Agent</h1>
              <p className="text-sm text-slate-500">Configurações globais de otimização de checkout</p>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Salvar
        </Button>
      </div>

      <Tabs defaultValue="experiments">
        <TabsList>
          <TabsTrigger value="experiments">Experimentos</TabsTrigger>
          <TabsTrigger value="defaults">Padrões Globais</TabsTrigger>
          <TabsTrigger value="personalization">Personalização</TabsTrigger>
        </TabsList>

        <TabsContent value="experiments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                Configuração de Experimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Modelo de Experimentação</Label>
                <RadioGroup 
                  value={settings.experimentModel} 
                  onValueChange={(v) => setSettings({...settings, experimentModel: v})}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ab" id="ab" />
                    <Label htmlFor="ab">A/B Testing Clássico</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="abn" id="abn" />
                    <Label htmlFor="abn">A/B/n Testing (múltiplas variantes)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bandit" id="bandit" />
                    <Label htmlFor="bandit">Multi-Armed Bandit (recomendado)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Sessões mínimas para conclusão: {settings.minSessionsForConclusion}</Label>
                <Slider 
                  value={settings.minSessionsForConclusion} 
                  onValueChange={(v) => setSettings({...settings, minSessionsForConclusion: v})}
                  min={100}
                  max={10000}
                  step={100}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
                <div>
                  <Label className="text-amber-700">Aplicar Vencedores Automaticamente</Label>
                  <p className="text-xs text-amber-600">⚠️ Variantes vencedoras serão aplicadas sem confirmação</p>
                </div>
                <Switch 
                  checked={settings.autoApplyWinners} 
                  onCheckedChange={(v) => setSettings({...settings, autoApplyWinners: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="defaults" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-500" />
                Configurações Padrão Globais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>PIX como Primeiro Método</Label>
                  <p className="text-xs text-slate-500">Aplicar globalmente para todos os merchants</p>
                </div>
                <Switch 
                  checked={settings.pixFirstGlobal} 
                  onCheckedChange={(v) => setSettings({...settings, pixFirstGlobal: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Layout 1-Step como Padrão</Label>
                  <p className="text-xs text-slate-500">Checkout em uma única tela</p>
                </div>
                <Switch 
                  checked={settings.oneStepDefault} 
                  onCheckedChange={(v) => setSettings({...settings, oneStepDefault: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Ocultar Campos Opcionais</Label>
                  <p className="text-xs text-slate-500">Reduzir fricção no checkout</p>
                </div>
                <Switch 
                  checked={settings.hideOptionalFieldsDefault} 
                  onCheckedChange={(v) => setSettings({...settings, hideOptionalFieldsDefault: v})} 
                />
              </div>

              <div className="space-y-2">
                <Label>Desconto PIX Global: {settings.globalPixDiscount}%</Label>
                <Slider 
                  value={settings.globalPixDiscount} 
                  onValueChange={(v) => setSettings({...settings, globalPixDiscount: v})}
                  min={0}
                  max={15}
                  step={1}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personalization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-500" />
                Regras de Personalização Dinâmica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Otimização Mobile Automática</Label>
                  <p className="text-xs text-slate-500">PIX primeiro em dispositivos móveis BR</p>
                </div>
                <Switch 
                  checked={settings.mobileOptimization} 
                  onCheckedChange={(v) => setSettings({...settings, mobileOptimization: v})} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Otimização para Rede Lenta</Label>
                  <p className="text-xs text-slate-500">Layout simplificado quando conexão é lenta</p>
                </div>
                <Switch 
                  checked={settings.slowNetworkOptimization} 
                  onCheckedChange={(v) => setSettings({...settings, slowNetworkOptimization: v})} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}