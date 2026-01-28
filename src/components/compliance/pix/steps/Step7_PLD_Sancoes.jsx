import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { ShieldAlert, Globe, UserX } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

// Generic Component for PLD steps (Yes/No + Detail)
const PLDQuestion = ({ id, label, detailLabel, formData, handleChange }) => (
  <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
    <Label className="text-xs font-semibold">{label}</Label>
    <div className="flex gap-2">
      <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData[id] === 'sim'} onClick={() => handleChange(id, 'sim')}>Sim</SelectionButton>
      <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData[id] === 'nao'} onClick={() => handleChange(id, 'nao')}>Não</SelectionButton>
    </div>
    {formData[id] === 'sim' && (
      <Textarea className="min-h-[40px] text-xs resize-none mt-2" placeholder={detailLabel} value={formData[`${id}_detalhe`] || ''} onChange={(e) => handleChange(`${id}_detalhe`, e.target.value)} />
    )}
  </div>
);

export default function Step7_PLD_Sancoes({ formData, handleChange }) {
  return (
    <FormSection title="Compliance: Sanções" subtitle="Vínculos e restrições" icon={Globe}>
      <div className="space-y-3">
        <PLDQuestion 
          id="sancoes_listas" 
          label="Sócios/Diretores em listas de sanções?" 
          detailLabel="Detalhe as sanções"
          formData={formData} handleChange={handleChange} 
        />
        <PLDQuestion 
          id="sancoes_paises" 
          label="Vínculos com países sancionados?" 
          detailLabel="Quais países e tipo de vínculo"
          formData={formData} handleChange={handleChange} 
        />
        <PLDQuestion 
          id="sancoes_controle" 
          label="Controle por pessoa/entidade sancionada?" 
          detailLabel="Detalhe o controle"
          formData={formData} handleChange={handleChange} 
        />
      </div>
    </FormSection>
  );
}