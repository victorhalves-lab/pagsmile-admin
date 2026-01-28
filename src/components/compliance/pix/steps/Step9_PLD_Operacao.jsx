import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Activity } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

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

export default function Step9_PLD_Operacao({ formData, handleChange }) {
  return (
    <FormSection title="Compliance: Operação" subtitle="Natureza da atividade" icon={Activity}>
      <div className="space-y-3">
        <PLDQuestion 
          id="op_apostas" 
          label="Atua como plataforma de apostas?" 
          detailLabel="Detalhe a operação e licenças"
          formData={formData} handleChange={handleChange} 
        />
        <PLDQuestion 
          id="op_crypto" 
          label="Atua com criptomoedas/tokens?" 
          detailLabel="Detalhe os ativos e operação"
          formData={formData} handleChange={handleChange} 
        />
        <PLDQuestion 
          id="op_restrito" 
          label="Oferece produtos restritos (tabaco, adulto, armas)?" 
          detailLabel="Quais produtos?"
          formData={formData} handleChange={handleChange} 
        />
      </div>
    </FormSection>
  );
}