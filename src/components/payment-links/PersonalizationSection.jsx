import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Palette, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PersonalizationSection({ formData, setFormData }) {
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, logo_url: file_url });
    } catch (err) {
      toast.error('Erro ao fazer upload do logo');
    }
  };

  return (
    <div className="space-y-6">
      {/* URL Customization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            URL do Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Slug Customizado</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm text-gray-500">pagsmile.link/loja/</span>
              <Input
                placeholder="meu-produto"
                value={formData.slug || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') 
                })}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">URL amigável e memorável</p>
          </div>
          
          <div>
            <Label className="text-sm">Domínio Customizado</Label>
            <Input
              placeholder="pagar.suaempresa.com.br"
              value={formData.custom_domain || ''}
              onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
              className="mt-1.5"
            />
            <p className="text-xs text-gray-500 mt-1">Configure seu domínio nas configurações da conta</p>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Branding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Logo</Label>
            <div className="mt-1.5 flex items-center gap-3">
              {formData.logo_url ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                  <img src={formData.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-0 right-0 h-5 w-5"
                    onClick={() => setFormData({ ...formData, logo_url: '' })}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </label>
              )}
              <p className="text-xs text-gray-500">Ou herdar do checkout padrão</p>
            </div>
          </div>

          <div>
            <Label className="text-sm">Cor Principal</Label>
            <div className="flex items-center gap-2 mt-1.5">
              <Input
                type="color"
                value={formData.brand_color || '#00D26A'}
                onChange={(e) => setFormData({ ...formData, brand_color: e.target.value })}
                className="w-12 h-10 p-1"
              />
              <Input
                value={formData.brand_color || '#00D26A'}
                onChange={(e) => setFormData({ ...formData, brand_color: e.target.value })}
                className="w-28"
                placeholder="#00D26A"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Config */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Usar Checkout Padrão</CardTitle>
            <Switch
              checked={formData.use_default_checkout !== false}
              onCheckedChange={(v) => setFormData({ ...formData, use_default_checkout: v })}
            />
          </div>
        </CardHeader>
        {formData.use_default_checkout === false && (
          <CardContent className="pt-0 space-y-4">
            <div>
              <Label className="text-sm">Layout do Checkout</Label>
              <Select
                value={formData.checkout_layout_type || 'default'}
                onValueChange={(v) => setFormData({ ...formData, checkout_layout_type: v })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="simplified">Simplificado</SelectItem>
                  <SelectItem value="detailed">Detalhado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Result Pages */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Páginas de Resultado</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm">Mensagem de Sucesso</Label>
            <Textarea
              placeholder="Obrigado pela sua compra, {nome}! Seu pedido de {produto} foi confirmado."
              value={formData.success_message || ''}
              onChange={(e) => setFormData({ ...formData, success_message: e.target.value })}
              className="mt-1.5 h-20"
            />
            <p className="text-xs text-gray-500 mt-1">Use {`{nome}`}, {`{produto}`}, {`{valor}`} como variáveis</p>
          </div>

          <div>
            <Label className="text-sm">Redirect após Sucesso</Label>
            <Input
              placeholder="https://seusite.com.br/obrigado"
              value={formData.success_redirect_url || ''}
              onChange={(e) => setFormData({ ...formData, success_redirect_url: e.target.value })}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label className="text-sm">Mensagem de Erro</Label>
            <Textarea
              placeholder="Ops! Não foi possível processar seu pagamento. Tente novamente ou use outro método."
              value={formData.error_message || ''}
              onChange={(e) => setFormData({ ...formData, error_message: e.target.value })}
              className="mt-1.5 h-20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}