import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle, XCircle, Zap, Clock, Users, Package } from 'lucide-react';

export default function ExperienceSettings({ experience, onChange }) {
  const updateExperience = (path, value) => {
    const keys = path.split('.');
    const newExperience = { ...experience };
    let current = newExperience;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onChange(newExperience);
  };

  const validation = experience.validation || {};
  const autofill = experience.autofill || {};
  const animations = experience.animations || {};
  const success_page = experience.success_page || {};
  const error_page = experience.error_page || {};
  const urgency = experience.urgency || {};

  return (
    <div className="space-y-6">
      {/* Validation & Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Validações e Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Validação em Tempo Real</Label>
              <p className="text-xs text-gray-500">Validar campos enquanto o cliente digita</p>
            </div>
            <Switch 
              checked={validation.realtime !== false}
              onCheckedChange={(checked) => updateExperience('validation.realtime', checked)}
            />
          </div>

          {validation.realtime !== false && (
            <div>
              <Label className="text-xs text-gray-500">Delay da Validação (ms): {validation.delay_ms || 300}</Label>
              <Slider 
                value={[validation.delay_ms || 300]} 
                onValueChange={([v]) => updateExperience('validation.delay_ms', v)}
                min={100}
                max={1000}
                step={100}
                className="mt-2"
              />
            </div>
          )}

          <div>
            <Label className="text-xs text-gray-500">Posição das Mensagens de Erro</Label>
            <Select 
              value={validation.error_position || 'below'} 
              onValueChange={(v) => updateExperience('validation.error_position', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below">Abaixo do campo</SelectItem>
                <SelectItem value="above">Acima do campo</SelectItem>
                <SelectItem value="tooltip">Tooltip</SelectItem>
                <SelectItem value="top">Lista no topo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Auto-fill */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auto-Preenchimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">CEP → Endereço</Label>
              <p className="text-xs text-gray-500">Buscar endereço automaticamente pelo CEP</p>
            </div>
            <Switch 
              checked={autofill.cep_lookup !== false}
              onCheckedChange={(checked) => updateExperience('autofill.cep_lookup', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Autocomplete do Browser</Label>
              <p className="text-xs text-gray-500">Permitir sugestões de dados salvos</p>
            </div>
            <Switch 
              checked={autofill.browser_autocomplete !== false}
              onCheckedChange={(checked) => updateExperience('autofill.browser_autocomplete', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">Lembrar Dados do Cliente</Label>
              <p className="text-xs text-gray-500">Salvar dados para próxima visita</p>
            </div>
            <Switch 
              checked={autofill.remember_customer || false}
              onCheckedChange={(checked) => updateExperience('autofill.remember_customer', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Animações e Feedback Visual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Loading do Botão</Label>
            <Select 
              value={animations.button_loading || 'spinner'} 
              onValueChange={(v) => updateExperience('animations.button_loading', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spinner">Spinner</SelectItem>
                <SelectItem value="text">Texto "Processando..."</SelectItem>
                <SelectItem value="progress">Barra de progresso</SelectItem>
                <SelectItem value="disable">Apenas desabilitar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-500">Animação de Sucesso</Label>
            <Select 
              value={animations.success_animation || 'confetti'} 
              onValueChange={(v) => updateExperience('animations.success_animation', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="confetti">Confetti</SelectItem>
                <SelectItem value="check">Check animado</SelectItem>
                <SelectItem value="fade">Fade in</SelectItem>
                <SelectItem value="none">Nenhum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">Shake no Erro</Label>
            <Switch 
              checked={animations.error_shake !== false}
              onCheckedChange={(checked) => updateExperience('animations.error_shake', checked)}
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500">Transições entre Etapas</Label>
            <Select 
              value={animations.step_transition || 'slide'} 
              onValueChange={(v) => updateExperience('animations.step_transition', v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slide">Slide</SelectItem>
                <SelectItem value="fade">Fade</SelectItem>
                <SelectItem value="none">Nenhum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Success Page */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Página de Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Mensagem de Sucesso</Label>
            <textarea 
              value={success_page.message || 'Obrigado, {nome}! Seu pedido #{pedido} foi confirmado.'}
              onChange={(e) => updateExperience('success_page.message', e.target.value)}
              className="mt-1 w-full h-20 rounded-md border p-2 text-sm resize-none"
              placeholder="Use {nome}, {pedido}, {valor} como variáveis"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Botões Disponíveis</Label>
            <div className="space-y-2">
              {[
                { id: 'back_to_store', label: 'Voltar à loja' },
                { id: 'view_order', label: 'Ver pedido' },
                { id: 'share', label: 'Compartilhar' },
                { id: 'download_receipt', label: 'Baixar comprovante' }
              ].map(btn => (
                <div key={btn.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`success-${btn.id}`}
                    checked={(success_page.buttons || ['back_to_store', 'view_order']).includes(btn.id)}
                    onCheckedChange={(checked) => {
                      const buttons = success_page.buttons || ['back_to_store', 'view_order'];
                      if (checked) {
                        updateExperience('success_page.buttons', [...buttons, btn.id]);
                      } else {
                        updateExperience('success_page.buttons', buttons.filter(b => b !== btn.id));
                      }
                    }}
                  />
                  <Label htmlFor={`success-${btn.id}`} className="text-sm">{btn.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs text-gray-500">URL de Redirect (opcional)</Label>
            <Input 
              value={success_page.redirect_url || ''}
              onChange={(e) => updateExperience('success_page.redirect_url', e.target.value)}
              placeholder="https://suaoja.com/obrigado"
              className="mt-1"
            />
          </div>

          {success_page.redirect_url && (
            <div>
              <Label className="text-xs text-gray-500">Delay do Redirect (segundos): {success_page.redirect_delay || 0}</Label>
              <Slider 
                value={[success_page.redirect_delay || 0]} 
                onValueChange={([v]) => updateExperience('success_page.redirect_delay', v)}
                min={0}
                max={10}
                step={1}
                className="mt-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Page */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            Página de Erro/Recusa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-gray-500">Mensagem de Erro</Label>
            <textarea 
              value={error_page.message || 'Não foi possível completar o pagamento.'}
              onChange={(e) => updateExperience('error_page.message', e.target.value)}
              className="mt-1 w-full h-20 rounded-md border p-2 text-sm resize-none"
            />
          </div>

          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Opções para o Cliente</Label>
            <div className="space-y-2">
              {[
                { id: 'retry', label: 'Tentar novamente' },
                { id: 'other_card', label: 'Usar outro cartão' },
                { id: 'pix', label: 'Pagar com Pix' },
                { id: 'support', label: 'Falar com suporte' }
              ].map(opt => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`error-${opt.id}`}
                    checked={(error_page.options || ['retry', 'other_card', 'pix', 'support']).includes(opt.id)}
                    onCheckedChange={(checked) => {
                      const options = error_page.options || ['retry', 'other_card', 'pix', 'support'];
                      if (checked) {
                        updateExperience('error_page.options', [...options, opt.id]);
                      } else {
                        updateExperience('error_page.options', options.filter(o => o !== opt.id));
                      }
                    }}
                  />
                  <Label htmlFor={`error-${opt.id}`} className="text-sm">{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Urgency Triggers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Gatilhos de Urgência
          </CardTitle>
          <CardDescription>Elementos para incentivar a conversão</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <Label className="text-sm">Timer de Oferta</Label>
              <p className="text-xs text-gray-500">Countdown mostrando tempo restante</p>
            </div>
            <Switch 
              checked={urgency.offer_timer || false}
              onCheckedChange={(checked) => updateExperience('urgency.offer_timer', checked)}
            />
          </div>

          {urgency.offer_timer && (
            <div>
              <Label className="text-xs text-gray-500">Tempo do Timer (minutos)</Label>
              <Input 
                type="number"
                value={urgency.offer_timer_minutes || 30}
                onChange={(e) => updateExperience('urgency.offer_timer_minutes', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-gray-500" />
              <div>
                <Label className="text-sm">Estoque Limitado</Label>
                <p className="text-xs text-gray-500">Mostrar "Restam X unidades"</p>
              </div>
            </div>
            <Switch 
              checked={urgency.stock_limited || false}
              onCheckedChange={(checked) => updateExperience('urgency.stock_limited', checked)}
            />
          </div>

          {urgency.stock_limited && (
            <div>
              <Label className="text-xs text-gray-500">Quantidade a Mostrar</Label>
              <Input 
                type="number"
                value={urgency.stock_count || 10}
                onChange={(e) => updateExperience('urgency.stock_count', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          )}

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <Label className="text-sm">Prova Social</Label>
                <p className="text-xs text-gray-500">Mostrar "X pessoas compraram hoje"</p>
              </div>
            </div>
            <Switch 
              checked={urgency.social_proof || false}
              onCheckedChange={(checked) => updateExperience('urgency.social_proof', checked)}
            />
          </div>

          {urgency.social_proof && (
            <div>
              <Label className="text-xs text-gray-500">Número a Mostrar</Label>
              <Input 
                type="number"
                value={urgency.social_proof_count || 50}
                onChange={(e) => updateExperience('urgency.social_proof_count', Number(e.target.value))}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}