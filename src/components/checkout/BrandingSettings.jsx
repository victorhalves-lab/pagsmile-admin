import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Image, Palette, Type, Square, Code } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const googleFonts = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
  'Raleway', 'Nunito', 'Source Sans Pro', 'Ubuntu', 'Playfair Display',
  'Merriweather', 'PT Sans', 'Oswald', 'Work Sans'
];

export default function BrandingSettings({ branding, onChange }) {
  const [activeTab, setActiveTab] = useState('logo');
  const [uploading, setUploading] = useState(false);

  const updateBranding = (path, value) => {
    const keys = path.split('.');
    const newBranding = { ...branding };
    let current = newBranding;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onChange(newBranding);
  };

  const handleFileUpload = async (file, field) => {
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      updateBranding(field, file_url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const colors = branding.colors || {};
  const typography = branding.typography || {};
  const buttons = branding.buttons || {};
  const inputs = branding.inputs || {};

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="logo" className="gap-1.5">
            <Image className="w-4 h-4" />
            Logo
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-1.5">
            <Palette className="w-4 h-4" />
            Cores
          </TabsTrigger>
          <TabsTrigger value="typography" className="gap-1.5">
            <Type className="w-4 h-4" />
            Tipografia
          </TabsTrigger>
          <TabsTrigger value="elements" className="gap-1.5">
            <Square className="w-4 h-4" />
            Elementos
          </TabsTrigger>
          <TabsTrigger value="css" className="gap-1.5">
            <Code className="w-4 h-4" />
            CSS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logo" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Logo Principal</CardTitle>
                <CardDescription>Exibido no topo do checkout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {branding.logo_url ? (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <img src={branding.logo_url} alt="Logo" className="max-h-16 mx-auto" />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Arraste ou clique para upload</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo_url')}
                    className="hidden"
                    id="logo-upload"
                  />
                  <Button variant="outline" className="flex-1" asChild disabled={uploading}>
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      {uploading ? 'Enviando...' : 'Upload'}
                    </label>
                  </Button>
                  <Input 
                    placeholder="ou cole a URL"
                    value={branding.logo_url || ''}
                    onChange={(e) => updateBranding('logo_url', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Favicon</CardTitle>
                <CardDescription>Ícone da aba do navegador</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {branding.favicon_url ? (
                  <div className="border rounded-lg p-4 bg-gray-50 flex justify-center">
                    <img src={branding.favicon_url} alt="Favicon" className="w-8 h-8" />
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">32x32px recomendado</p>
                  </div>
                )}
                <Input 
                  placeholder="URL do favicon"
                  value={branding.favicon_url || ''}
                  onChange={(e) => updateBranding('favicon_url', e.target.value)}
                />
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Imagem de Background</CardTitle>
                <CardDescription>Imagem de fundo do checkout (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="URL da imagem de background"
                  value={branding.background_image_url || ''}
                  onChange={(e) => updateBranding('background_image_url', e.target.value)}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cores Principais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Cor Primária</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.primary || '#00D26A'}
                      onChange={(e) => updateBranding('colors.primary', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.primary || '#00D26A'}
                      onChange={(e) => updateBranding('colors.primary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Cor Secundária</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.secondary || '#101F3E'}
                      onChange={(e) => updateBranding('colors.secondary', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.secondary || '#101F3E'}
                      onChange={(e) => updateBranding('colors.secondary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fundos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Fundo Geral</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.background || '#F8FAFC'}
                      onChange={(e) => updateBranding('colors.background', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.background || '#F8FAFC'}
                      onChange={(e) => updateBranding('colors.background', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Fundo de Cards</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.card_background || '#FFFFFF'}
                      onChange={(e) => updateBranding('colors.card_background', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.card_background || '#FFFFFF'}
                      onChange={(e) => updateBranding('colors.card_background', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Textos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Texto Principal</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.text_primary || '#1F2937'}
                      onChange={(e) => updateBranding('colors.text_primary', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.text_primary || '#1F2937'}
                      onChange={(e) => updateBranding('colors.text_primary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Texto Secundário</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.text_secondary || '#6B7280'}
                      onChange={(e) => updateBranding('colors.text_secondary', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.text_secondary || '#6B7280'}
                      onChange={(e) => updateBranding('colors.text_secondary', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Sucesso</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.success || '#28A745'}
                      onChange={(e) => updateBranding('colors.success', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.success || '#28A745'}
                      onChange={(e) => updateBranding('colors.success', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Erro</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.error || '#DC3545'}
                      onChange={(e) => updateBranding('colors.error', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.error || '#DC3545'}
                      onChange={(e) => updateBranding('colors.error', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Alerta</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={colors.warning || '#FFC107'}
                      onChange={(e) => updateBranding('colors.warning', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={colors.warning || '#FFC107'}
                      onChange={(e) => updateBranding('colors.warning', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="typography" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Fontes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Fonte Principal</Label>
                  <Select 
                    value={typography.font_family || 'Inter'} 
                    onValueChange={(v) => updateBranding('typography.font_family', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {googleFonts.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Fonte de Títulos</Label>
                  <Select 
                    value={typography.title_font || 'Inter'} 
                    onValueChange={(v) => updateBranding('typography.title_font', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same">Usar fonte principal</SelectItem>
                      {googleFonts.map(font => (
                        <SelectItem key={font} value={font}>{font}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Tamanhos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Tamanho Base: {typography.base_size || 16}px</Label>
                  <Slider 
                    value={[typography.base_size || 16]} 
                    onValueChange={([v]) => updateBranding('typography.base_size', v)}
                    min={12}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Espaçamento entre Linhas: {typography.line_height || 1.5}</Label>
                  <Slider 
                    value={[typography.line_height || 1.5]} 
                    onValueChange={([v]) => updateBranding('typography.line_height', v)}
                    min={1}
                    max={2}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Peso da Fonte</Label>
                  <Select 
                    value={typography.font_weight || 'normal'} 
                    onValueChange={(v) => updateBranding('typography.font_weight', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light (300)</SelectItem>
                      <SelectItem value="normal">Normal (400)</SelectItem>
                      <SelectItem value="medium">Medium (500)</SelectItem>
                      <SelectItem value="bold">Bold (700)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="elements" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Botões</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Cor de Fundo</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={buttons.bg_color || '#00D26A'}
                      onChange={(e) => updateBranding('buttons.bg_color', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={buttons.bg_color || '#00D26A'}
                      onChange={(e) => updateBranding('buttons.bg_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Cor do Texto</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={buttons.text_color || '#FFFFFF'}
                      onChange={(e) => updateBranding('buttons.text_color', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={buttons.text_color || '#FFFFFF'}
                      onChange={(e) => updateBranding('buttons.text_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Arredondamento: {buttons.border_radius || 8}px</Label>
                  <Slider 
                    value={[buttons.border_radius || 8]} 
                    onValueChange={([v]) => updateBranding('buttons.border_radius', v)}
                    min={0}
                    max={50}
                    step={2}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Tamanho</Label>
                  <Select 
                    value={buttons.size || 'medium'} 
                    onValueChange={(v) => updateBranding('buttons.size', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Pequeno</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="large">Grande</SelectItem>
                      <SelectItem value="xl">Extra Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Efeito Hover</Label>
                  <Select 
                    value={buttons.hover_style || 'darken'} 
                    onValueChange={(v) => updateBranding('buttons.hover_style', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="darken">Escurecer</SelectItem>
                      <SelectItem value="lighten">Clarear</SelectItem>
                      <SelectItem value="shadow">Sombra</SelectItem>
                      <SelectItem value="scale">Escala</SelectItem>
                      <SelectItem value="none">Nenhum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campos (Inputs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-500">Cor de Fundo</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={inputs.bg_color || '#FFFFFF'}
                      onChange={(e) => updateBranding('inputs.bg_color', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={inputs.bg_color || '#FFFFFF'}
                      onChange={(e) => updateBranding('inputs.bg_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Cor da Borda</Label>
                  <div className="flex gap-2 mt-1">
                    <Input 
                      type="color"
                      value={inputs.border_color || '#E5E7EB'}
                      onChange={(e) => updateBranding('inputs.border_color', e.target.value)}
                      className="w-12 h-9 p-1"
                    />
                    <Input 
                      value={inputs.border_color || '#E5E7EB'}
                      onChange={(e) => updateBranding('inputs.border_color', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Arredondamento: {inputs.border_radius || 4}px</Label>
                  <Slider 
                    value={[inputs.border_radius || 4]} 
                    onValueChange={([v]) => updateBranding('inputs.border_radius', v)}
                    min={0}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Estilo de Label</Label>
                  <Select 
                    value={inputs.label_style || 'above'} 
                    onValueChange={(v) => updateBranding('inputs.label_style', v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Acima do campo</SelectItem>
                      <SelectItem value="floating">Dentro (floating)</SelectItem>
                      <SelectItem value="inline">Inline à esquerda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="css" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">CSS Customizado</CardTitle>
              <CardDescription>
                Adicione CSS personalizado para customizações avançadas. 
                Use as variáveis CSS disponíveis para manter consistência.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea 
                value={branding.custom_css || ''}
                onChange={(e) => updateBranding('custom_css', e.target.value)}
                placeholder={`/* Exemplo de CSS customizado */
.checkout-container {
  /* seus estilos aqui */
}

/* Variáveis disponíveis:
   --primary-color
   --secondary-color
   --text-primary
   --text-secondary
*/`}
                className="font-mono text-sm h-64"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}