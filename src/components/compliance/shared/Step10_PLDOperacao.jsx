import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { ShieldCheck } from 'lucide-react';
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

export default function Step10_PLDOperacao({ formData, handleChange }) {
  return (
    <FormSection title="PLD - Controles Operacionais" subtitle="Procedimentos internos de compliance" icon={ShieldCheck}>
      <div className="space-y-6">
        <PLDQuestion 
          id="pld_politica" 
          label="A empresa possui política interna de PLD/FT documentada?" 
          detailLabel="Descreva resumidamente a política e quando foi atualizada pela última vez"
          formData={formData} 
          handleChange={handleChange} 
        />
        <PLDQuestion 
          id="pld_treinamento" 
          label="A empresa realiza treinamentos periódicos sobre PLD/FT com os colaboradores?" 
          detailLabel="Informe a frequência e abrangência dos treinamentos"
          formData={formData} 
          handleChange={handleChange} 
        />
        <PLDQuestion 
          id="pld_kyc" 
          label="A empresa possui procedimentos de KYC (Conheça seu Cliente)?" 
          detailLabel="Descreva os procedimentos adotados para conhecer e validar clientes"
          formData={formData} 
          handleChange={handleChange} 
        />
      </div>
    </FormSection>
  );
}