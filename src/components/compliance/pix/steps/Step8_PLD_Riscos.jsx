import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { AlertTriangle } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const PLDQuestion = ({ id, label, detailLabel, formData, handleChange, inverse = false }) => (
  <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
    <Label className="text-xs font-semibold">{label}</Label>
    <div className="flex gap-2">
      <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData[id] === 'sim'} onClick={() => handleChange(id, 'sim')}>Sim</SelectionButton>
      <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData[id] === 'nao'} onClick={() => handleChange(id, 'nao')}>Não</SelectionButton>
    </div>
    {((!inverse && formData[id] === 'sim') || (inverse && formData[id] === 'nao')) && (
      <Textarea className="min-h-[40px] text-xs resize-none mt-2" placeholder={detailLabel} value={formData[`${id}_detalhe`] || ''} onChange={(e) => handleChange(`${id}_detalhe`, e.target.value)} />
    )}
  </div>
);

export default function Step8_PLD_Riscos({ formData, handleChange }) {
  return (
    <FormSection title="Compliance: Riscos" subtitle="Histórico e prevenção" icon={AlertTriangle}>
      <div className="space-y-3">
        <PLDQuestion 
          id="riscos_fraude" 
          label="Transações com parceiros com histórico de fraude?" 
          detailLabel="Explique o ocorrido"
          formData={formData} handleChange={handleChange} 
        />
        <PLDQuestion 
          id="riscos_propina" 
          label="Histórico de pagamentos indevidos/propina?" 
          detailLabel="Explique o contexto"
          formData={formData} handleChange={handleChange} 
        />
        <PLDQuestion 
          id="riscos_programa" 
          label="Possui programa de PLD/FT implementado?" 
          detailLabel="Justifique a ausência"
          formData={formData} handleChange={handleChange}
          inverse={true}
        />
      </div>
    </FormSection>
  );
}