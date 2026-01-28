import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { Scale } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section3Licenciamento({ formData, handleChange }) {
  return (
    <FormSection title="Licenciamento" subtitle="Licenças e regulamentações" icon={Scale}>
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
          <div className="grid grid-cols-1 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Órgão Regulador *</Label>
              <Input className="h-8 text-xs" placeholder="Ex: CVM, BACEN" value={formData.orgaoRegulador || ''} onChange={(e) => handleChange('orgaoRegulador', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Número de Registro *</Label>
              <Input className="h-8 text-xs" placeholder="Número" value={formData.numeroRegistro || ''} onChange={(e) => handleChange('numeroRegistro', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Data de Concessão *</Label>
              <Input className="h-8 text-xs" type="date" value={formData.dataConcessao || ''} onChange={(e) => handleChange('dataConcessao', e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}