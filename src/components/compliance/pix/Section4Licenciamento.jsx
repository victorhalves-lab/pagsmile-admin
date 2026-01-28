import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from '@/components/compliance/FormSection';
import { Scale } from 'lucide-react';

export default function Section4Licenciamento({ formData, handleChange }) {
  return (
    <FormSection title="4. Licenciamento e Regulação" subtitle="Licenças necessárias para operar" icon={Scale}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Sua empresa necessita de licença para operar? (Ex: Banco Central, CVM, ANVISA, etc.) *</Label>
          <RadioGroup 
            value={formData.necessitaLicenca || ''} 
            onValueChange={(v) => handleChange('necessitaLicenca', v)} 
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sim" id="lic-sim" />
              <Label htmlFor="lic-sim" className="font-normal">Sim</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nao" id="lic-nao" />
              <Label htmlFor="lic-nao" className="font-normal">Não</Label>
            </div>
          </RadioGroup>
        </div>

        {formData.necessitaLicenca === 'sim' && (
          <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
            <Label>Se sim, especifique qual e qual órgão regulador: *</Label>
            <Textarea 
              placeholder="Ex: Licença para operar como Instituição de Pagamento, Banco Central do Brasil." 
              value={formData.especificacaoLicenca || ''} 
              onChange={(e) => handleChange('especificacaoLicenca', e.target.value)}
              rows={3}
            />
          </div>
        )}
      </div>
    </FormSection>
  );
}