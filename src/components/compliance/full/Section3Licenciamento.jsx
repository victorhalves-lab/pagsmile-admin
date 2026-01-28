import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from '@/components/compliance/FormSection';
import { Scale } from 'lucide-react';

export default function Section3Licenciamento({ formData, handleChange }) {
  return (
    <FormSection title="3. Licenciamento e Regulação" subtitle="Informe sobre licenças e regulamentações aplicáveis" icon={Scale}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>A empresa necessita de licença para operar no Brasil em razão do seu ramo de atividade? *</Label>
          <RadioGroup value={formData.necessitaLicenca || ''} onValueChange={(v) => handleChange('necessitaLicenca', v)} className="flex gap-6">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="lic-sim" /><Label htmlFor="lic-sim" className="font-normal">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="lic-nao" /><Label htmlFor="lic-nao" className="font-normal">Não</Label></div>
          </RadioGroup>
        </div>

        {formData.necessitaLicenca === 'sim' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="space-y-2">
              <Label>Nome do Órgão Regulador/Supervisor *</Label>
              <Input placeholder="Ex: ANVISA, CVM, BACEN, etc." value={formData.orgaoRegulador || ''} onChange={(e) => handleChange('orgaoRegulador', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Número de Registro/Licença *</Label>
              <Input placeholder="Número do registro ou licença" value={formData.numeroRegistro || ''} onChange={(e) => handleChange('numeroRegistro', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Data de Concessão *</Label>
              <Input type="date" value={formData.dataConcessao || ''} onChange={(e) => handleChange('dataConcessao', e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}