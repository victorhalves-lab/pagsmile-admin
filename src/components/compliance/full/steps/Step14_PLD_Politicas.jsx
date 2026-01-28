import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';

export default function Step14_PLD_Politicas({ formData, handleChange }) {
  return (
    <FormSection title="PLD/FT - Políticas" subtitle="Documentação interna" icon={FileCheck}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Possui Política de PLD/FT documentada? *</Label>
          <RadioGroup value={formData.possuiPoliticaPLD || ''} onValueChange={(v) => handleChange('possuiPoliticaPLD', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pol-sim" /><Label htmlFor="pol-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pol-nao" /><Label htmlFor="pol-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>
        
        {formData.possuiPoliticaPLD === 'sim' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Política revisada nos últimos 12 meses?</Label>
            <RadioGroup value={formData.politicaRevisada || ''} onValueChange={(v) => handleChange('politicaRevisada', v)} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="rev-sim" /><Label htmlFor="rev-sim" className="font-normal text-xs">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="rev-nao" /><Label htmlFor="rev-nao" className="font-normal text-xs">Não</Label></div>
            </RadioGroup>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Treinamento formal em PLD/FT? *</Label>
          <RadioGroup value={formData.treinamentoPLD || ''} onValueChange={(v) => handleChange('treinamentoPLD', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="tre-sim" /><Label htmlFor="tre-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="tre-nao" /><Label htmlFor="tre-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>

        {formData.treinamentoPLD === 'sim' && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Frequência</Label>
            <Select value={formData.frequenciaTreinamento || ''} onValueChange={(v) => handleChange('frequenciaTreinamento', v)}>
              <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="anual">Anual</SelectItem>
                <SelectItem value="semestral">Semestral</SelectItem>
                <SelectItem value="admissao">Na admissão</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </FormSection>
  );
}