import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormSection from '@/components/compliance/FormSection';
import { Lock, AlertTriangle } from 'lucide-react';

export default function Section11SegurancaCartao({ formData, handleChange }) {
  return (
    <FormSection title="11. Segurança de Dados de Cartão" subtitle="Como a empresa trata dados de cartão de crédito" icon={Lock}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Armazena dados de cartão? *</Label>
          <RadioGroup value={formData.armazenaDadosCartao || ''} onValueChange={(v) => handleChange('armazenaDadosCartao', v)} className="flex gap-6">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="arm-cart-sim" /><Label htmlFor="arm-cart-sim" className="font-normal">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="arm-cart-nao" /><Label htmlFor="arm-cart-nao" className="font-normal">Não</Label></div>
          </RadioGroup>
        </div>

        {formData.armazenaDadosCartao === 'sim' && (
          <div className="p-4 bg-slate-50 rounded-lg space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label>Armazena PAN completo?</Label>
                <RadioGroup value={formData.armazenaPAN || ''} onValueChange={(v) => handleChange('armazenaPAN', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pan-sim" /><Label htmlFor="pan-sim" className="font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pan-nao" /><Label htmlFor="pan-nao" className="font-normal">Não</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Armazena apenas últimos 4 dígitos?</Label>
                <RadioGroup value={formData.armazenaUltimos4 || ''} onValueChange={(v) => handleChange('armazenaUltimos4', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="ult4-sim" /><Label htmlFor="ult4-sim" className="font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="ult4-nao" /><Label htmlFor="ult4-nao" className="font-normal">Não</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Armazena token?</Label>
                <RadioGroup value={formData.armazenaToken || ''} onValueChange={(v) => handleChange('armazenaToken', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="token-sim" /><Label htmlFor="token-sim" className="font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="token-nao" /><Label htmlFor="token-nao" className="font-normal">Não</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Armazena CVV?</Label>
                <RadioGroup value={formData.armazenaCVV || ''} onValueChange={(v) => handleChange('armazenaCVV', v)} className="flex gap-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="cvv-sim" /><Label htmlFor="cvv-sim" className="font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="cvv-nao" /><Label htmlFor="cvv-nao" className="font-normal">Não</Label></div>
                </RadioGroup>
              </div>
            </div>
            {formData.armazenaCVV === 'sim' && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 font-medium">
                  ALERTA CRÍTICO: Armazenar CVV é uma violação grave dos padrões PCI DSS e pode resultar em multas severas e perda da capacidade de processar cartões.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Label>Utiliza checkout hospedado/tokenização via PSP? *</Label>
          <RadioGroup value={formData.usaCheckoutHospedado || ''} onValueChange={(v) => handleChange('usaCheckoutHospedado', v)} className="flex gap-6">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="checkout-hosp-sim" /><Label htmlFor="checkout-hosp-sim" className="font-normal">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="checkout-hosp-nao" /><Label htmlFor="checkout-hosp-nao" className="font-normal">Não</Label></div>
          </RadioGroup>
        </div>
        {formData.usaCheckoutHospedado === 'sim' && (
          <div className="space-y-2 pl-4 border-l-2 border-gray-300">
            <Label>Qual PSP/provedor?</Label>
            <Input placeholder="Ex: Stripe, Adyen, Pagsmile, etc." value={formData.qualPSP || ''} onChange={(e) => handleChange('qualPSP', e.target.value)} />
          </div>
        )}

        <div className="space-y-3">
          <Label>Possui evidência de PCI DSS? *</Label>
          <RadioGroup value={formData.possuiPCIDSS || ''} onValueChange={(v) => handleChange('possuiPCIDSS', v)} className="flex gap-6">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pci-sim" /><Label htmlFor="pci-sim" className="font-normal">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pci-nao" /><Label htmlFor="pci-nao" className="font-normal">Não</Label></div>
          </RadioGroup>
        </div>
      </div>
    </FormSection>
  );
}