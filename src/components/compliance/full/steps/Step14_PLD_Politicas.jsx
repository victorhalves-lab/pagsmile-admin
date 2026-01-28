import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step14_PLD_Politicas({ formData, handleChange }) {
  return (
    <FormSection title="PLD/FT - Políticas" subtitle="Documentação interna" icon={FileCheck}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Possui Política de PLD/FT documentada? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.possuiPoliticaPLD === 'sim'}
                onClick={() => handleChange('possuiPoliticaPLD', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.possuiPoliticaPLD === 'nao'}
                onClick={() => handleChange('possuiPoliticaPLD', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>
        
        {formData.possuiPoliticaPLD === 'sim' && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold mb-2 block">Política revisada nos últimos 12 meses?</Label>
            <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.politicaRevisada === 'sim'}
                onClick={() => handleChange('politicaRevisada', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.politicaRevisada === 'nao'}
                onClick={() => handleChange('politicaRevisada', 'nao')}
              >
                Não
              </SelectionButton>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Treinamento formal em PLD/FT? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.treinamentoPLD === 'sim'}
                onClick={() => handleChange('treinamentoPLD', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.treinamentoPLD === 'nao'}
                onClick={() => handleChange('treinamentoPLD', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>

        {formData.treinamentoPLD === 'sim' && (
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Frequência</Label>
            <Select value={formData.frequenciaTreinamento || ''} onValueChange={(v) => handleChange('frequenciaTreinamento', v)}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
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