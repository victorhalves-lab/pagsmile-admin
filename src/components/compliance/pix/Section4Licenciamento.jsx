import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Scale } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section4Licenciamento({ formData, handleChange }) {
  return (
    <FormSection title="Licenciamento" subtitle="Licenças necessárias" icon={Scale}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Necessita de licença para operar? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.necessitaLicenca === 'sim'}
                onClick={() => handleChange('necessitaLicenca', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.necessitaLicenca === 'nao'}
                onClick={() => handleChange('necessitaLicenca', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>

        {formData.necessitaLicenca === 'sim' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Especifique (Qual e Órgão): *</Label>
            <Textarea 
              className="min-h-[80px] text-xs"
              placeholder="Ex: Licença IP, Banco Central..." 
              value={formData.especificacaoLicenca || ''} 
              onChange={(e) => handleChange('especificacaoLicenca', e.target.value)}
            />
          </div>
        )}
      </div>
    </FormSection>
  );
}