import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';

export default function Step17_PLD_Governanca({ formData, handleChange }) {
  return (
    <FormSection title="PLD/FT - Governança" subtitle="Estrutura de controle" icon={FileCheck}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Área/Pessoa dedicada a Compliance? *</Label>
          <RadioGroup value={formData.areaDedicadaCompliance || ''} onValueChange={(v) => handleChange('areaDedicadaCompliance', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="area-sim" /><Label htmlFor="area-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="area-nao" /><Label htmlFor="area-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Realiza auditorias internas de PLD? *</Label>
          <RadioGroup value={formData.auditoriasInternas || ''} onValueChange={(v) => handleChange('auditoriasInternas', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="aud-sim" /><Label htmlFor="aud-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="aud-nao" /><Label htmlFor="aud-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>
      </div>
    </FormSection>
  );
}