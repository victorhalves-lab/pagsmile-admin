import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { AlertTriangle } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const PLDQuestion = ({ id, label, detailLabel, formData, handleChange }) => (
  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
    <Label className="text-sm font-semibold text-slate-700">{label}</Label>
    <div className="flex gap-4">
      <SelectionButton 
        className="flex-1" 
        selected={formData[id] === 'sim'} 
        onClick={() => handleChange(id, 'sim')}
      >
        Sim
      </SelectionButton>
      <SelectionButton 
        className="flex-1" 
        selected={formData[id] === 'nao'} 
        onClick={() => handleChange(id, 'nao')}
      >
        Não
      </SelectionButton>
    </div>
    {formData[id] === 'sim' && (
      <Textarea 
        className="min-h-[80px] text-base resize-none mt-4" 
        placeholder={detailLabel} 
        value={formData[`${id}_detalhe`] || ''} 
        onChange={(e) => handleChange(`${id}_detalhe`, e.target.value)} 
      />
    )}
  </div>
);

export default function Step9_PLDRiscos({ formData, handleChange }) {
  return (
    <FormSection title="PLD - Análise de Riscos" subtitle="Avaliação de riscos de lavagem de dinheiro" icon={AlertTriangle}>
      <div className="space-y-6">
        <PLDQuestion 
          id="riscos_pep" 
          label="Algum sócio ou administrador é Pessoa Politicamente Exposta (PEP)?" 
          detailLabel="Informe o nome, cargo político ou função pública exercida"
          formData={formData} 
          handleChange={handleChange} 
        />
        <PLDQuestion 
          id="riscos_lavagem" 
          label="A empresa já foi investigada ou condenada por lavagem de dinheiro?" 
          detailLabel="Descreva o histórico e situação atual"
          formData={formData} 
          handleChange={handleChange} 
        />
        <PLDQuestion 
          id="riscos_operacoes" 
          label="A empresa realiza operações com valores atípicos ou em espécie?" 
          detailLabel="Descreva a natureza dessas operações"
          formData={formData} 
          handleChange={handleChange} 
        />
      </div>
    </FormSection>
  );
}