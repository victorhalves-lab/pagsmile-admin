import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormSection from '@/components/compliance/FormSection';
import { Lock, AlertTriangle } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section11SegurancaCartao({ formData, handleChange }) {
  return (
    <FormSection title="Segurança de Dados de Cartão" subtitle="Como a empresa trata dados de cartão" icon={Lock}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Armazena dados de cartão? *</Label>
          <div className="flex gap-2">
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.armazenaDadosCartao === 'sim'}
              onClick={() => handleChange('armazenaDadosCartao', 'sim')}
            >
              Sim
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.armazenaDadosCartao === 'nao'}
              onClick={() => handleChange('armazenaDadosCartao', 'nao')}
            >
              Não
            </SelectionButton>
          </div>
        </div>

        {formData.armazenaDadosCartao === 'sim' && (
          <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-600 font-semibold uppercase">Armazena PAN completo?</Label>
                <div className="flex gap-2">
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaPAN === 'sim'} onClick={() => handleChange('armazenaPAN', 'sim')}>Sim</SelectionButton>
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaPAN === 'nao'} onClick={() => handleChange('armazenaPAN', 'nao')}>Não</SelectionButton>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-600 font-semibold uppercase">Apenas últimos 4 dígitos?</Label>
                <div className="flex gap-2">
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaUltimos4 === 'sim'} onClick={() => handleChange('armazenaUltimos4', 'sim')}>Sim</SelectionButton>
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaUltimos4 === 'nao'} onClick={() => handleChange('armazenaUltimos4', 'nao')}>Não</SelectionButton>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-600 font-semibold uppercase">Armazena token?</Label>
                <div className="flex gap-2">
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaToken === 'sim'} onClick={() => handleChange('armazenaToken', 'sim')}>Sim</SelectionButton>
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaToken === 'nao'} onClick={() => handleChange('armazenaToken', 'nao')}>Não</SelectionButton>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-gray-600 font-semibold uppercase">Armazena CVV?</Label>
                <div className="flex gap-2">
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaCVV === 'sim'} onClick={() => handleChange('armazenaCVV', 'sim')}>Sim</SelectionButton>
                  <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData.armazenaCVV === 'nao'} onClick={() => handleChange('armazenaCVV', 'nao')}>Não</SelectionButton>
                </div>
              </div>
            </div>
            {formData.armazenaCVV === 'sim' && (
              <Alert className="bg-red-50 border-red-200 p-2">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 font-medium text-xs leading-tight">
                    ALERTA CRÍTICO: Armazenar CVV é uma violação grave PCI DSS.
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Utiliza checkout hospedado/tokenização via PSP? *</Label>
          <div className="flex gap-2">
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.usaCheckoutHospedado === 'sim'}
              onClick={() => handleChange('usaCheckoutHospedado', 'sim')}
            >
              Sim
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.usaCheckoutHospedado === 'nao'}
              onClick={() => handleChange('usaCheckoutHospedado', 'nao')}
            >
              Não
            </SelectionButton>
          </div>
        </div>
        {formData.usaCheckoutHospedado === 'sim' && (
          <div className="space-y-1 pl-3 border-l-2 border-slate-200">
            <Label className="text-xs font-semibold">Qual PSP/provedor?</Label>
            <Input className="h-8 text-xs" placeholder="Ex: Stripe, Adyen, Pagsmile..." value={formData.qualPSP || ''} onChange={(e) => handleChange('qualPSP', e.target.value)} />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Possui evidência de PCI DSS? *</Label>
          <div className="flex gap-2">
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.possuiPCIDSS === 'sim'}
              onClick={() => handleChange('possuiPCIDSS', 'sim')}
            >
              Sim
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.possuiPCIDSS === 'nao'}
              onClick={() => handleChange('possuiPCIDSS', 'nao')}
            >
              Não
            </SelectionButton>
          </div>
        </div>
      </div>
    </FormSection>
  );
}