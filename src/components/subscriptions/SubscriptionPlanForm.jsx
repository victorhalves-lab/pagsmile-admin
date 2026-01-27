import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, CreditCard, QrCode, Check, Gift, Clock, Users, Eye, EyeOff } from 'lucide-react';

const frequencyOptions = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quinzenal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'bimonthly', label: 'Bimestral' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'semiannual', label: 'Semestral' },
  { value: 'annual', label: 'Anual' },
];

export default function SubscriptionPlanForm({ formData, setFormData }) {
  const addBenefit = () => {
    const benefits = formData.benefits || [];
    setFormData({ ...formData, benefits: [...benefits, ''] });
  };

  const updateBenefit = (index, value) => {
    const benefits = [...(formData.benefits || [])];
    benefits[index] = value;
    setFormData({ ...formData, benefits });
  };

  const removeBenefit = (index) => {
    const benefits = [...(formData.benefits || [])];
    benefits.splice(index, 1);
    setFormData({ ...formData, benefits });
  };

  const togglePaymentMethod = (method) => {
    const methods = formData.payment_methods || ['card'];
    if (methods.includes(method)) {
      if (methods.length > 1) {
        setFormData({ ...formData, payment_methods: methods.filter(m => m !== method) });
      }
    } else {
      setFormData({ ...formData, payment_methods: [...methods, method] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informações do Plano</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nome do Plano *</Label>
            <Input
              placeholder="Ex: Plano Premium Mensal"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={50}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              placeholder="O que o plano oferece..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={500}
              className="mt-1.5 h-20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Benefícios</Label>
              <Button type="button" variant="outline" size="sm" onClick={addBenefit}>
                <Plus className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {(formData.benefits || []).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <Input
                    placeholder="Ex: Acesso ilimitado"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBenefit(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(formData.benefits || []).length === 0 && (
                <p className="text-sm text-gray-500">Adicione benefícios para exibir aos clientes</p>
              )}
            </div>
          </div>

          <div>
            <Label>Identificador Externo</Label>
            <Input
              placeholder="Ex: plan_premium_monthly"
              value={formData.external_id || ''}
              onChange={(e) => setFormData({ ...formData, external_id: e.target.value })}
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">ID para integração com seu sistema</p>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preço e Frequência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Valor (R$) *</Label>
              <Input
                type="number"
                placeholder="99,90"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                min="1"
                step="0.01"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Frequência *</Label>
              <Select
                value={formData.frequency || 'monthly'}
                onValueChange={(v) => setFormData({ ...formData, frequency: v })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Dia de Cobrança</Label>
            <Select
              value={formData.billing_day || 'signup_day'}
              onValueChange={(v) => setFormData({ ...formData, billing_day: v })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="signup_day">Dia do cadastro</SelectItem>
                {[...Array(28)].map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>Dia {i + 1}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trial & Promotions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="w-5 h-5" />
            Trial e Promoções
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Período de Trial (dias)</Label>
              <Input
                type="number"
                value={formData.trial_days || 0}
                onChange={(e) => setFormData({ ...formData, trial_days: parseInt(e.target.value) || 0 })}
                min="0"
                max="90"
                className="mt-1.5"
              />
            </div>
            <div className="flex items-end pb-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.require_card_on_trial !== false}
                  onCheckedChange={(v) => setFormData({ ...formData, require_card_on_trial: v })}
                />
                <Label className="cursor-pointer">Exigir cartão no trial</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>Taxa de Adesão (Setup Fee) - R$</Label>
            <Input
              type="number"
              placeholder="0,00"
              value={formData.setup_fee || ''}
              onChange={(e) => setFormData({ ...formData, setup_fee: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">Valor único cobrado na primeira cobrança</p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
            <p className="font-medium text-yellow-900">Desconto Inicial</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Desconto (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.initial_discount_percentage || ''}
                  onChange={(e) => setFormData({ ...formData, initial_discount_percentage: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">Por quantos ciclos</Label>
                <Input
                  type="number"
                  placeholder="1"
                  value={formData.initial_discount_cycles || ''}
                  onChange={(e) => setFormData({ ...formData, initial_discount_cycles: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div 
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${(formData.payment_methods || ['card']).includes('card') ? 'border-blue-500 bg-blue-50' : ''}`}
            onClick={() => togglePaymentMethod('card')}
          >
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${(formData.payment_methods || ['card']).includes('card') ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">Cartão de Crédito</p>
                <p className="text-xs text-gray-500">Cobrança automática recorrente</p>
              </div>
            </div>
            <Checkbox checked={(formData.payment_methods || ['card']).includes('card')} />
          </div>

          <div 
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${(formData.payment_methods || []).includes('pix') ? 'border-green-500 bg-green-50' : ''}`}
            onClick={() => togglePaymentMethod('pix')}
          >
            <div className="flex items-center gap-3">
              <QrCode className={`w-5 h-5 ${(formData.payment_methods || []).includes('pix') ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">Pix</p>
                <p className="text-xs text-gray-500">Cobrança manual a cada ciclo</p>
              </div>
            </div>
            <Checkbox checked={(formData.payment_methods || []).includes('pix')} />
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Configurações Avançadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Limite de Assinantes</Label>
            <div className="flex items-center gap-3 mt-1.5">
              <Select
                value={formData.subscriber_limit_type || 'unlimited'}
                onValueChange={(v) => setFormData({ ...formData, subscriber_limit_type: v })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">Ilimitado</SelectItem>
                  <SelectItem value="limited">Limitado</SelectItem>
                </SelectContent>
              </Select>
              {formData.subscriber_limit_type === 'limited' && (
                <Input
                  type="number"
                  placeholder="100"
                  value={formData.subscriber_limit_count || ''}
                  onChange={(e) => setFormData({ ...formData, subscriber_limit_count: parseInt(e.target.value) || 0 })}
                  min="1"
                  className="w-24"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {formData.visibility === 'private' ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-blue-600" />}
              <div>
                <p className="font-medium">Visibilidade</p>
                <p className="text-xs text-gray-500">
                  {formData.visibility === 'private' ? 'Apenas via link direto' : 'Visível na página de assinatura'}
                </p>
              </div>
            </div>
            <Select
              value={formData.visibility || 'public'}
              onValueChange={(v) => setFormData({ ...formData, visibility: v })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Público</SelectItem>
                <SelectItem value="private">Privado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">Plano Ativo</p>
              <p className="text-xs text-gray-500">Disponível para novas assinaturas</p>
            </div>
            <Switch
              checked={formData.status !== 'inactive'}
              onCheckedChange={(v) => setFormData({ ...formData, status: v ? 'active' : 'inactive' })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}