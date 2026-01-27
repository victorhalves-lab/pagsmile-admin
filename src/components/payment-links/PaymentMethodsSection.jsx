import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, QrCode, ArrowUpDown } from 'lucide-react';

export default function PaymentMethodsSection({ formData, setFormData }) {
  const togglePaymentMethod = (method) => {
    const methods = formData.payment_methods || ['card', 'pix'];
    if (methods.includes(method)) {
      if (methods.length > 1) {
        setFormData({ ...formData, payment_methods: methods.filter(m => m !== method) });
      }
    } else {
      setFormData({ ...formData, payment_methods: [...methods, method] });
    }
  };

  const hasMethod = (method) => (formData.payment_methods || ['card', 'pix']).includes(method);

  return (
    <div className="space-y-6">
      {/* Payment Methods Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Métodos Aceitos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div 
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${hasMethod('card') ? 'border-blue-500 bg-blue-50' : ''}`}
            onClick={() => togglePaymentMethod('card')}
          >
            <div className="flex items-center gap-3">
              <CreditCard className={`w-5 h-5 ${hasMethod('card') ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">Cartão de Crédito</p>
                <p className="text-xs text-gray-500">Visa, Master, Elo, Amex</p>
              </div>
            </div>
            <Checkbox checked={hasMethod('card')} />
          </div>

          <div 
            className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${hasMethod('pix') ? 'border-green-500 bg-green-50' : ''}`}
            onClick={() => togglePaymentMethod('pix')}
          >
            <div className="flex items-center gap-3">
              <QrCode className={`w-5 h-5 ${hasMethod('pix') ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <p className="font-medium">Pix</p>
                <p className="text-xs text-gray-500">Pagamento instantâneo</p>
              </div>
            </div>
            <Checkbox checked={hasMethod('pix')} />
          </div>
        </CardContent>
      </Card>

      {/* Method Order */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" />
            Ordem dos Métodos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={(formData.method_order || ['card', 'pix'])[0]}
            onValueChange={(v) => {
              const other = v === 'card' ? 'pix' : 'card';
              setFormData({ ...formData, method_order: [v, other] });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o método principal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Cartão primeiro</SelectItem>
              <SelectItem value="pix">Pix primeiro</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">Método que aparece primeiro para o cliente</p>
        </CardContent>
      </Card>

      {/* Card Settings */}
      {hasMethod('card') && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Configuração do Cartão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Máx. Parcelas</Label>
                <Select
                  value={String(formData.max_installments || 12)}
                  onValueChange={(v) => setFormData({ ...formData, max_installments: parseInt(v) })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                      <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Sem Juros até</Label>
                <Select
                  value={String(formData.interest_free_installments || 1)}
                  onValueChange={(v) => setFormData({ ...formData, interest_free_installments: parseInt(v) })}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                      <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div>
                <p className="font-medium text-yellow-900">Parcelamento Promocional</p>
                <p className="text-xs text-yellow-700">Absorver custo do parcelamento neste link</p>
              </div>
              <Switch
                checked={formData.promotional_installments || false}
                onCheckedChange={(v) => setFormData({ ...formData, promotional_installments: v })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pix Settings */}
      {hasMethod('pix') && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Configuração do Pix
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm">Desconto para Pix (%)</Label>
              <div className="flex items-center gap-2 mt-1.5">
                <Input
                  type="number"
                  value={formData.pix_discount_percentage || ''}
                  onChange={(e) => setFormData({ ...formData, pix_discount_percentage: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="20"
                  step="0.5"
                  className="w-24"
                  placeholder="0"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Incentive pagamento com Pix (máx. 20%)</p>
            </div>

            <div>
              <Label className="text-sm">Validade do QR Code</Label>
              <Select
                value={String(formData.pix_expiration_minutes || 30)}
                onValueChange={(v) => setFormData({ ...formData, pix_expiration_minutes: parseInt(v) })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="1440">24 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}