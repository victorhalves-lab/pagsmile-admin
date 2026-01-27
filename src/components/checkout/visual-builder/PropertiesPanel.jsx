import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Settings, Palette, Code } from 'lucide-react';

export default function PropertiesPanel({ element, config, onUpdateElement, onDeleteElement }) {
  const [activeTab, setActiveTab] = useState('content');

  if (!element) {
    return (
      <div className="w-80 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-gray-900">Propriedades</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Selecione um elemento para editar suas propriedades</p>
          </div>
        </div>
      </div>
    );
  }

  const updateProps = (key, value) => {
    onUpdateElement(element.id, {
      props: { ...element.props, [key]: value }
    });
  };

  const renderContentTab = () => {
    const { type, props = {} } = element;

    // Fields with label and placeholder
    const fieldsWithLabel = [
      'full_name', 'email', 'cpf', 'cnpj', 'cpf_cnpj', 'phone', 'birthdate',
      'cep', 'street', 'number', 'complement', 'neighborhood', 'city', 'state',
      'card_number', 'card_expiry', 'card_cvv', 'card_name',
      'custom_text'
    ];

    if (fieldsWithLabel.includes(type)) {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Label</Label>
            <Input 
              value={props.label || ''} 
              onChange={(e) => updateProps('label', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Placeholder</Label>
            <Input 
              value={props.placeholder || ''} 
              onChange={(e) => updateProps('placeholder', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Obrigatório</Label>
            <Switch 
              checked={props.required || false}
              onCheckedChange={(checked) => updateProps('required', checked)}
            />
          </div>
        </div>
      );
    }

    // Heading
    if (type === 'heading') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Texto</Label>
            <Input 
              value={props.text || ''} 
              onChange={(e) => updateProps('text', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Nível</Label>
            <Select value={props.level || 'h2'} onValueChange={(v) => updateProps('level', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">H1 - Título Principal</SelectItem>
                <SelectItem value="h2">H2 - Subtítulo</SelectItem>
                <SelectItem value="h3">H3 - Seção</SelectItem>
                <SelectItem value="h4">H4 - Subseção</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Alinhamento</Label>
            <Select value={props.align || 'left'} onValueChange={(v) => updateProps('align', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    // Paragraph
    if (type === 'paragraph') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Texto</Label>
            <textarea 
              value={props.text || ''} 
              onChange={(e) => updateProps('text', e.target.value)}
              className="mt-1 w-full h-24 rounded-md border p-2 text-sm resize-none"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Alinhamento</Label>
            <Select value={props.align || 'left'} onValueChange={(v) => updateProps('align', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Esquerda</SelectItem>
                <SelectItem value="center">Centro</SelectItem>
                <SelectItem value="right">Direita</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    // Pay Button
    if (type === 'pay_button') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Texto do Botão</Label>
            <Input 
              value={props.text || 'Pagar'} 
              onChange={(e) => updateProps('text', e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Mostrar Valor</Label>
            <Switch 
              checked={props.showValue !== false}
              onCheckedChange={(checked) => updateProps('showValue', checked)}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Ícone</Label>
            <Select value={props.icon || 'lock'} onValueChange={(v) => updateProps('icon', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lock">Cadeado</SelectItem>
                <SelectItem value="arrow">Seta</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="none">Nenhum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }

    // Spacer
    if (type === 'spacer') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Altura (px)</Label>
            <div className="flex items-center gap-3 mt-2">
              <Slider 
                value={[props.height || 24]} 
                onValueChange={([v]) => updateProps('height', v)}
                min={8}
                max={100}
                step={4}
                className="flex-1"
              />
              <span className="text-sm w-12 text-right">{props.height || 24}px</span>
            </div>
          </div>
        </div>
      );
    }

    // Divider
    if (type === 'divider') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Estilo</Label>
            <Select value={props.style || 'solid'} onValueChange={(v) => updateProps('style', v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Sólido</SelectItem>
                <SelectItem value="dashed">Tracejado</SelectItem>
                <SelectItem value="dotted">Pontilhado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Cor</Label>
            <Input 
              type="color"
              value={props.color || '#E5E7EB'} 
              onChange={(e) => updateProps('color', e.target.value)}
              className="mt-1 h-10"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Espessura (px)</Label>
            <Slider 
              value={[props.thickness || 1]} 
              onValueChange={([v]) => updateProps('thickness', v)}
              min={1}
              max={5}
              step={1}
              className="mt-2"
            />
          </div>
        </div>
      );
    }

    // Columns
    if (type === 'columns') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Número de Colunas</Label>
            <Select value={String(props.count || 2)} onValueChange={(v) => updateProps('count', Number(v))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Colunas</SelectItem>
                <SelectItem value="3">3 Colunas</SelectItem>
                <SelectItem value="4">4 Colunas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Espaçamento (px)</Label>
            <Slider 
              value={[props.gap || 16]} 
              onValueChange={([v]) => updateProps('gap', v)}
              min={8}
              max={48}
              step={4}
              className="mt-2"
            />
          </div>
        </div>
      );
    }

    // Pix Block
    if (type === 'pix_block') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Mostrar Copia e Cola</Label>
            <Switch 
              checked={props.showCopyPaste !== false}
              onCheckedChange={(checked) => updateProps('showCopyPaste', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm">Mostrar Timer</Label>
            <Switch 
              checked={props.showTimer !== false}
              onCheckedChange={(checked) => updateProps('showTimer', checked)}
            />
          </div>
        </div>
      );
    }

    // Custom Select
    if (type === 'custom_select' || type === 'custom_radio') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Label</Label>
            <Input 
              value={props.label || ''} 
              onChange={(e) => updateProps('label', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Opções (uma por linha)</Label>
            <textarea 
              value={(props.options || []).join('\n')} 
              onChange={(e) => updateProps('options', e.target.value.split('\n').filter(Boolean))}
              className="mt-1 w-full h-24 rounded-md border p-2 text-sm resize-none"
            />
          </div>
          {type === 'custom_radio' && (
            <div>
              <Label className="text-xs text-gray-500">Layout</Label>
              <Select value={props.layout || 'vertical'} onValueChange={(v) => updateProps('layout', v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vertical">Vertical</SelectItem>
                  <SelectItem value="horizontal">Horizontal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Obrigatório</Label>
            <Switch 
              checked={props.required || false}
              onCheckedChange={(checked) => updateProps('required', checked)}
            />
          </div>
        </div>
      );
    }

    // Custom Checkbox
    if (type === 'custom_checkbox' || type === 'save_card_checkbox') {
      return (
        <div className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Texto</Label>
            <Input 
              value={props.label || ''} 
              onChange={(e) => updateProps('label', e.target.value)}
              className="mt-1"
            />
          </div>
          {type === 'custom_checkbox' && (
            <div>
              <Label className="text-xs text-gray-500">Link (opcional)</Label>
              <Input 
                value={props.link || ''} 
                onChange={(e) => updateProps('link', e.target.value)}
                placeholder="URL do link"
                className="mt-1"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <Label className="text-sm">Obrigatório</Label>
            <Switch 
              checked={props.required || false}
              onCheckedChange={(checked) => updateProps('required', checked)}
            />
          </div>
        </div>
      );
    }

    // Default
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">Configurações não disponíveis para este elemento</p>
      </div>
    );
  };

  const renderStyleTab = () => {
    return (
      <div className="space-y-4">
        <p className="text-xs text-gray-500">
          Os estilos são herdados da configuração de Identidade Visual. 
          Para estilos específicos, use a aba Avançado.
        </p>
      </div>
    );
  };

  const renderAdvancedTab = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-xs text-gray-500">Classes CSS Customizadas</Label>
          <Input 
            value={element.props?.customClasses || ''} 
            onChange={(e) => updateProps('customClasses', e.target.value)}
            placeholder="classe1 classe2"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-gray-500">ID do Elemento</Label>
          <Input 
            value={element.props?.customId || ''} 
            onChange={(e) => updateProps('customId', e.target.value)}
            placeholder="meu-elemento"
            className="mt-1"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="w-80 bg-white border-l flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Propriedades</h3>
          <p className="text-xs text-gray-500 mt-0.5">{element.type}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => onDeleteElement(element.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="content" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            <Palette className="w-3 h-3 mr-1" />
            Estilo
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs">
            <Code className="w-3 h-3 mr-1" />
            Avançado
          </TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          <TabsContent value="content" className="p-4 mt-0">
            {renderContentTab()}
          </TabsContent>
          <TabsContent value="style" className="p-4 mt-0">
            {renderStyleTab()}
          </TabsContent>
          <TabsContent value="advanced" className="p-4 mt-0">
            {renderAdvancedTab()}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}