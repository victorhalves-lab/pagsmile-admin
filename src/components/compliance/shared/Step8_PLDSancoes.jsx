import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { ShieldAlert } from 'lucide-react';
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

export default function Step8_PLDSancoes({ formData, handleChange }) {
  return (
    <FormSection title="PLD - Sanções e Restrições" subtitle="Verificação de vínculos com listas restritivas" icon={ShieldAlert}>
      <div className="space-y-6">
        <PLDQuestion 
          id="sancoes_listas" 
          label="Algum sócio, diretor ou administrador está em listas de sanções internacionais?" 
          detailLabel="Descreva detalhadamente quais listas e as circunstâncias"
          formData={formData} 
          handleChange={handleChange} 
        />
        <PLDQuestion 
          id="sancoes_paises" 
          label="A empresa possui vínculos comerciais com países sancionados?" 
          detailLabel="Quais países e qual o tipo de vínculo (exportação, importação, parceria, etc.)"
          formData={formData} 
          handleChange={handleChange} 
        />
        <PLDQuestion 
          id="sancoes_controle" 
          label="A empresa é controlada por pessoa ou entidade que está em lista de sanções?" 
          detailLabel="Detalhe o tipo de controle e a relação"
          formData={formData} 
          handleChange={handleChange} 
        />
      </div>
    </FormSection>
  );
}