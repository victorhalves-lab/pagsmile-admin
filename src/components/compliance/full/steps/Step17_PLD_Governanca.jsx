import React from 'react';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step17_PLD_Governanca({ formData, handleChange }) {
  return (
    <FormSection title="PLD/FT - Governança" subtitle="Estrutura de controle" icon={FileCheck}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Área/Pessoa dedicada a Compliance? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.areaDedicadaCompliance === 'sim'}
                onClick={() => handleChange('areaDedicadaCompliance', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.areaDedicadaCompliance === 'nao'}
                onClick={() => handleChange('areaDedicadaCompliance', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Realiza auditorias internas de PLD? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.auditoriasInternas === 'sim'}
                onClick={() => handleChange('auditoriasInternas', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.auditoriasInternas === 'nao'}
                onClick={() => handleChange('auditoriasInternas', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>
      </div>
    </FormSection>
  );
}