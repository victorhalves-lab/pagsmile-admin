import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { CreditCard, QrCode, GripVertical } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const cardBrands = [
  { id: 'visa', name: 'Visa' },
  { id: 'mastercard', name: 'Mastercard' },
  { id: 'elo', name: 'Elo' },
  { id: 'amex', name: 'American Express' },
  { id: 'hipercard', name: 'Hipercard' },
  { id: 'diners', name: 'Diners Club' },
  { id: 'jcb', name: 'JCB' },
  { id: 'discover', name: 'Discover' },
];

export default function PaymentMethodSettings({ paymentMethods, onChange }) {
  const updatePayment = (path, value) => {
    const keys = path.split('.');
    const newPayment = { ...paymentMethods };
    let current = newPayment;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onChange(newPayment);
  };

  const card = paymentMethods.card || {};
  const pix = paymentMethods.pix || {};
  const display = paymentMethods.display || {};

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(display.order || ['card', 'pix']);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updatePayment('display.order', items);
  };

  return (
    <div className="space-y-6">
      {/* Card Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Cartão de Crédito</CardTitle>
                <CardDescription>Configure as opções de pagamento com cartão</CardDescription>
              </div>
            </div>
            <Switch 
              checked={card.enabled !== false}
              onCheckedChange={(checked) => updatePayment('card.enabled', checked)}
            />
          </div>
        </CardHeader>
        {card.enabled !== false && (
          <CardContent className="space-y-6">
            {/* Brands */}
            <div>
              <Label className="text-xs text-gray-500 mb-3 block">Bandeiras Aceitas</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {cardBrands.map(brand => {
                  const isSelected = (card.brands || ['visa', 'mastercard', 'elo', 'amex', 'hipercard']).includes(brand.id);
                  return (
                    <SelectionButton
                      key={brand.id}
                      selected={isSelected}
                      onClick={() => {
                        const brands = card.brands || ['visa', 'mastercard', 'elo', 'amex', 'hipercard'];
                        if (!isSelected) {
                          updatePayment('card.brands', [...brands, brand.id]);
                        } else {
                          updatePayment('card.brands', brands.filter(b => b !== brand.id));
                        }
                      }}
                      className="h-12"
                    >
                      {brand.name}
                    </SelectionButton>
                  );
                })}
              </div>
            </div>

            {/* Installments */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Parcelamento Máximo</Label>
                <Select 
                  value={String(card.max_installments || 12)} 
                  onValueChange={(v) => updatePayment('card.max_installments', Number(v))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 18].map(n => (
                      <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Sem Juros Até</Label>
                <Select 
                  value={String(card.interest_free_installments || 3)} 
                  onValueChange={(v) => updatePayment('card.interest_free_installments', Number(v))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Nenhum (todo parcelamento com juros)</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                      <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Taxa de Juros (% a.m.)</Label>
                <Input 
                  type="number"
                  step="0.01"
                  value={card.interest_rate || 2.99}
                  onChange={(e) => updatePayment('card.interest_rate', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Valor Mín. para Parcelar</Label>
                <Input 
                  type="number"
                  value={card.min_value_to_installment || 50}
                  onChange={(e) => updatePayment('card.min_value_to_installment', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Valor Mín. da Parcela</Label>
                <Input 
                  type="number"
                  value={card.min_installment_value || 10}
                  onChange={(e) => updatePayment('card.min_installment_value', Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Soft Descriptor (fatura do cliente)</Label>
              <Input 
                value={card.soft_descriptor || ''}
                onChange={(e) => updatePayment('card.soft_descriptor', e.target.value)}
                placeholder="LOJA*NOMESITE"
                maxLength={13}
                className="mt-1"
              />
              <p className="text-xs text-gray-400 mt-1">Máximo 13 caracteres</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label className="text-sm">Exigir CVV</Label>
                <Switch 
                  checked={card.require_cvv !== false}
                  onCheckedChange={(checked) => updatePayment('card.require_cvv', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label className="text-sm">Exigir Nome no Cartão</Label>
                <Switch 
                  checked={card.require_name !== false}
                  onCheckedChange={(checked) => updatePayment('card.require_name', checked)}
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">3D Secure</Label>
              <Select 
                value={card.three_ds || 'risk'} 
                onValueChange={(v) => updatePayment('card.three_ds', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">Sempre exigir</SelectItem>
                  <SelectItem value="never">Nunca exigir</SelectItem>
                  <SelectItem value="above_value">Acima de determinado valor</SelectItem>
                  <SelectItem value="risk">Para transações de risco</SelectItem>
                  <SelectItem value="ai">Decisão da IA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Label className="text-sm">Permitir Salvar Cartão</Label>
                <p className="text-xs text-gray-500">Cliente pode salvar para compras futuras</p>
              </div>
              <Switch 
                checked={card.allow_save_card !== false}
                onCheckedChange={(checked) => updatePayment('card.allow_save_card', checked)}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Pix Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-base">Pix</CardTitle>
                <CardDescription>Configure as opções de pagamento com Pix</CardDescription>
              </div>
            </div>
            <Switch 
              checked={pix.enabled !== false}
              onCheckedChange={(checked) => updatePayment('pix.enabled', checked)}
            />
          </div>
        </CardHeader>
        {pix.enabled !== false && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Validade do QR Code</Label>
                <Select 
                  value={String(pix.expiration_minutes || 30)} 
                  onValueChange={(v) => updatePayment('pix.expiration_minutes', Number(v))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                    <SelectItem value="1440">24 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Desconto para Pix (%)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Slider 
                    value={[pix.discount_percentage || 0]} 
                    onValueChange={([v]) => updatePayment('pix.discount_percentage', v)}
                    min={0}
                    max={15}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-10 text-right">{pix.discount_percentage || 0}%</span>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs text-gray-500">Mensagem Personalizada</Label>
              <Input 
                value={pix.custom_message || ''}
                onChange={(e) => updatePayment('pix.custom_message', e.target.value)}
                placeholder="Aponte a câmera do seu app de banco para o QR Code"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-500">Instruções de Pagamento</Label>
              <textarea 
                value={pix.instructions || 'Abra o app do seu banco, escaneie o QR Code ou copie e cole o código Pix.'}
                onChange={(e) => updatePayment('pix.instructions', e.target.value)}
                className="mt-1 w-full h-20 rounded-md border p-2 text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label className="text-sm">Mostrar Copia e Cola</Label>
                <Switch 
                  checked={pix.show_copy_paste !== false}
                  onCheckedChange={(checked) => updatePayment('pix.show_copy_paste', checked)}
                />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <Label className="text-sm">Timer Visual</Label>
                <Switch 
                  checked={pix.show_timer !== false}
                  onCheckedChange={(checked) => updatePayment('pix.show_timer', checked)}
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ordem e Exibição dos Métodos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-xs text-gray-500 mb-3 block">Ordem dos Métodos (arraste para reordenar)</Label>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="payment-methods">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {(display.order || ['card', 'pix']).map((method, index) => (
                      <Draggable key={method} draggableId={method} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                          >
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-4 h-4 text-gray-400" />
                            </div>
                            {method === 'card' ? (
                              <>
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <span>Cartão de Crédito</span>
                              </>
                            ) : (
                              <>
                                <QrCode className="w-5 h-5 text-green-600" />
                                <span>Pix</span>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-gray-500">Método Pré-Selecionado</Label>
              <Select 
                value={display.default_method || 'first'} 
                onValueChange={(v) => updatePayment('display.default_method', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first">Primeiro da lista</SelectItem>
                  <SelectItem value="card">Cartão</SelectItem>
                  <SelectItem value="pix">Pix</SelectItem>
                  <SelectItem value="last_used">Último usado pelo cliente</SelectItem>
                  <SelectItem value="ai">IA decide</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500">Estilo de Exibição</Label>
              <Select 
                value={display.style || 'tabs'} 
                onValueChange={(v) => updatePayment('display.style', v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tabs">Tabs horizontais</SelectItem>
                  <SelectItem value="accordion">Accordion vertical</SelectItem>
                  <SelectItem value="cards">Cards lado a lado</SelectItem>
                  <SelectItem value="radio">Radio buttons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm">Mostrar Ícones</Label>
              <Switch 
                checked={display.show_icons !== false}
                onCheckedChange={(checked) => updatePayment('display.show_icons', checked)}
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label className="text-sm">Mostrar Descrições</Label>
              <Switch 
                checked={display.show_descriptions !== false}
                onCheckedChange={(checked) => updatePayment('display.show_descriptions', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}