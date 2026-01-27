import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Columns, Smartphone, Shield, Plus, Trash2 } from 'lucide-react';

export default function LayoutSettings({ layout, onChange }) {
  const updateLayout = (path, value) => {
    const keys = path.split('.');
    const newLayout = { ...layout };
    let current = newLayout;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onChange(newLayout);
  };

  const footer = layout.footer || {};

  return (
    <div className="space-y-6">
      {/* Flow Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutGrid className="w-5 h-5" />
            Modelo de Fluxo
          </CardTitle>
          <CardDescription>Define como o checkout será estruturado</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={layout.flow_type || 'one-step'} 
            onValueChange={(v) => updateLayout('flow_type', v)}
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="one-step" id="one-step" className="peer sr-only" />
              <Label
                htmlFor="one-step"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#00D26A] cursor-pointer"
              >
                <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <div className="w-4/5 space-y-2">
                    <div className="h-2 bg-gray-300 rounded" />
                    <div className="h-2 bg-gray-300 rounded" />
                    <div className="h-2 bg-gray-300 rounded" />
                  </div>
                </div>
                <span className="font-medium">One-Step</span>
                <span className="text-xs text-gray-500 text-center mt-1">Tudo em uma página</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="multi-step" id="multi-step" className="peer sr-only" />
              <Label
                htmlFor="multi-step"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#00D26A] cursor-pointer"
              >
                <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#00D26A] text-white text-xs flex items-center justify-center">1</div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center">2</div>
                    <div className="w-6 h-6 rounded-full bg-gray-300 text-xs flex items-center justify-center">3</div>
                  </div>
                </div>
                <span className="font-medium">Multi-Step</span>
                <span className="text-xs text-gray-500 text-center mt-1">Dividido em etapas</span>
              </Label>
            </div>
            
            <div>
              <RadioGroupItem value="accordion" id="accordion" className="peer sr-only" />
              <Label
                htmlFor="accordion"
                className="flex flex-col items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-[#00D26A] cursor-pointer"
              >
                <div className="w-full h-24 bg-gray-100 rounded mb-3 flex items-center justify-center">
                  <div className="w-4/5 space-y-1">
                    <div className="h-4 bg-[#00D26A]/30 rounded" />
                    <div className="h-6 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-300 rounded" />
                  </div>
                </div>
                <span className="font-medium">Accordion</span>
                <span className="text-xs text-gray-500 text-center mt-1">Seções colapsáveis</span>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Multi-Step Configuration */}
      {layout.flow_type === 'multi-step' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Configuração de Etapas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">Número de Etapas</Label>
                <Select 
                  value={String(layout.steps?.length || 3)} 
                  onValueChange={(v) => {
                    const count = Number(v);
                    const steps = Array.from({ length: count }, (_, i) => ({
                      name: layout.steps?.[i]?.name || `Etapa ${i + 1}`,
                      fields: layout.steps?.[i]?.fields || []
                    }));
                    updateLayout('steps', steps);
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Etapas</SelectItem>
                    <SelectItem value="3">3 Etapas</SelectItem>
                    <SelectItem value="4">4 Etapas</SelectItem>
                    <SelectItem value="5">5 Etapas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Indicador de Progresso</Label>
                <Select 
                  value={layout.progress_indicator || 'bar'} 
                  onValueChange={(v) => updateLayout('progress_indicator', v)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Barra de Progresso</SelectItem>
                    <SelectItem value="numbers">Números</SelectItem>
                    <SelectItem value="icons">Ícones</SelectItem>
                    <SelectItem value="breadcrumb">Breadcrumb</SelectItem>
                    <SelectItem value="none">Nenhum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3 mt-4">
              <Label className="text-xs text-gray-500">Nomes das Etapas</Label>
              {(layout.steps || [{ name: 'Dados' }, { name: 'Pagamento' }, { name: 'Confirmação' }]).map((step, i) => (
                <Input 
                  key={i}
                  value={step.name}
                  onChange={(e) => {
                    const steps = [...(layout.steps || [])];
                    steps[i] = { ...steps[i], name: e.target.value };
                    updateLayout('steps', steps);
                  }}
                  placeholder={`Nome da etapa ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Label className="text-sm">Validar ao avançar etapa</Label>
              <Switch 
                checked={layout.validate_on_step !== false}
                onCheckedChange={(checked) => updateLayout('validate_on_step', checked)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Columns className="w-5 h-5" />
            Layout do Resumo do Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Posição do Resumo</Label>
            <Select 
              value={layout.summary_position || 'right'} 
              onValueChange={(v) => updateLayout('summary_position', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="right">Lateral Direita</SelectItem>
                <SelectItem value="top">Topo</SelectItem>
                <SelectItem value="bottom">Rodapé</SelectItem>
                <SelectItem value="collapsible">Colapsável</SelectItem>
                <SelectItem value="floating">Flutuante (mobile)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Resumo Fixo (Sticky)</Label>
            <Switch 
              checked={layout.summary_sticky !== false}
              onCheckedChange={(checked) => updateLayout('summary_sticky', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Resumo Editável</Label>
            <Switch 
              checked={layout.summary_editable || false}
              onCheckedChange={(checked) => updateLayout('summary_editable', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Colapsável em Mobile</Label>
            <Switch 
              checked={layout.summary_collapsible_mobile !== false}
              onCheckedChange={(checked) => updateLayout('summary_collapsible_mobile', checked)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Itens no Resumo</Label>
            <div className="space-y-2">
              {[
                { id: 'name', label: 'Nome do produto' },
                { id: 'image', label: 'Imagem' },
                { id: 'quantity', label: 'Quantidade' },
                { id: 'price', label: 'Preço unitário' },
                { id: 'subtotal', label: 'Subtotal' }
              ].map(item => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`summary-${item.id}`}
                    checked={(layout.summary_items || ['name', 'quantity', 'price']).includes(item.id)}
                    onCheckedChange={(checked) => {
                      const items = layout.summary_items || ['name', 'quantity', 'price'];
                      if (checked) {
                        updateLayout('summary_items', [...items, item.id]);
                      } else {
                        updateLayout('summary_items', items.filter(i => i !== item.id));
                      }
                    }}
                  />
                  <Label htmlFor={`summary-${item.id}`} className="text-sm">{item.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsiveness */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Responsividade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-xs text-gray-500">Desktop (px)</Label>
              <Input 
                type="number"
                value={layout.breakpoints?.desktop || 1200}
                onChange={(e) => updateLayout('breakpoints.desktop', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Tablet (px)</Label>
              <Input 
                type="number"
                value={layout.breakpoints?.tablet || 768}
                onChange={(e) => updateLayout('breakpoints.tablet', Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Mobile (px)</Label>
              <Input 
                type="number"
                value={layout.breakpoints?.mobile || 375}
                onChange={(e) => updateLayout('breakpoints.mobile', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Botões Full-Width em Mobile</Label>
            <Switch 
              checked={layout.mobile_full_width_buttons !== false}
              onCheckedChange={(checked) => updateLayout('mobile_full_width_buttons', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Rodapé do Checkout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Selos de Segurança</Label>
            <Switch 
              checked={footer.security_badges !== false}
              onCheckedChange={(checked) => updateLayout('footer.security_badges', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Logos das Bandeiras</Label>
            <Switch 
              checked={footer.card_brands !== false}
              onCheckedChange={(checked) => updateLayout('footer.card_brands', checked)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500">Texto de Segurança</Label>
            <Input 
              value={footer.security_text || 'Seus dados estão protegidos com criptografia SSL'}
              onChange={(e) => updateLayout('footer.security_text', e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Powered by PagSmile</Label>
            <Switch 
              checked={footer.powered_by !== false}
              onCheckedChange={(checked) => updateLayout('footer.powered_by', checked)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Links do Rodapé</Label>
            {(footer.links || []).map((link, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input 
                  placeholder="Texto"
                  value={link.text || ''}
                  onChange={(e) => {
                    const links = [...(footer.links || [])];
                    links[i] = { ...links[i], text: e.target.value };
                    updateLayout('footer.links', links);
                  }}
                  className="flex-1"
                />
                <Input 
                  placeholder="URL"
                  value={link.url || ''}
                  onChange={(e) => {
                    const links = [...(footer.links || [])];
                    links[i] = { ...links[i], url: e.target.value };
                    updateLayout('footer.links', links);
                  }}
                  className="flex-1"
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    const links = (footer.links || []).filter((_, idx) => idx !== i);
                    updateLayout('footer.links', links);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const links = [...(footer.links || []), { text: '', url: '' }];
                updateLayout('footer.links', links);
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Adicionar Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}