import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const escoposKYC = ['RG/CNH', 'Endereço', 'Renda', 'CNPJ', 'Bureau', 'Outro'];

export default function Step15_PLD_KYC({ formData, handleChange }) {
  return (
    <FormSection title="PLD/FT - KYC" subtitle="Conheça seu Cliente" icon={FileCheck}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Realiza KYC/KYB dos clientes? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.realizaKYC === 'sim'}
                onClick={() => handleChange('realizaKYC', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.realizaKYC === 'nao'}
                onClick={() => handleChange('realizaKYC', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>

        {formData.realizaKYC === 'sim' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Escopo da verificação:</Label>
            <div className="grid grid-cols-2 gap-2">
              {escoposKYC.map(escopo => (
                <div key={escopo} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`kyc-${escopo}`} 
                    checked={(formData.escoposKYC || []).includes(escopo)} 
                    onCheckedChange={(checked) => {
                      const current = formData.escoposKYC || [];
                      if (checked) handleChange('escoposKYC', [...current, escopo]);
                      else handleChange('escoposKYC', current.filter(e => e !== escopo));
                    }} 
                  />
                  <Label htmlFor={`kyc-${escopo}`} className="text-xs font-normal cursor-pointer">{escopo}</Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Verifica Sanções? *</Label>
          <div className="flex gap-2">
            {['Sim', 'Não'].map(opt => (
               <SelectionButton
                 key={opt}
                 className="py-1 px-3 text-xs h-8"
                 selected={formData.verificaSancoes === opt.toLowerCase()}
                 onClick={() => handleChange('verificaSancoes', opt.toLowerCase())}
               >
                 {opt}
               </SelectionButton>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Verifica PEP? *</Label>
          <div className="flex gap-2">
            {['Sim', 'Não'].map(opt => (
               <SelectionButton
                 key={opt}
                 className="py-1 px-3 text-xs h-8"
                 selected={formData.verificaPEP === opt.toLowerCase()}
                 onClick={() => handleChange('verificaPEP', opt.toLowerCase())}
               >
                 {opt}
               </SelectionButton>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
}