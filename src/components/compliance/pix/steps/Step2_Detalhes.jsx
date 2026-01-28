import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step2_Detalhes({ formData, handleChange }) {
  return (
    <FormSection title="Detalhes da Empresa" subtitle="Estrutura e porte" icon={Building2}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Tipo de Empresa *</Label>
          <div className="grid grid-cols-2 gap-2">
            {['LTDA', 'SA', 'EIRELI', 'MEI', 'Outro'].map(opt => (
              <SelectionButton
                key={opt}
                className="py-2 text-xs h-9"
                selected={formData.tipoEmpresa === opt}
                onClick={() => handleChange('tipoEmpresa', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Início das Atividades *</Label>
          <Input 
            className="h-9"
            type="date" 
            value={formData.dataInicioAtividade || ''} 
            onChange={(e) => handleChange('dataInicioAtividade', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Quantidade de Colaboradores *</Label>
          <div className="grid grid-cols-3 gap-2">
            {['1-5', '6-10', '11-50', '51-100', '101-500', '500+'].map(opt => (
              <SelectionButton
                key={opt}
                className="py-2 text-xs px-1 h-9"
                selected={formData.qtdColaboradores === opt}
                onClick={() => handleChange('qtdColaboradores', opt)}
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