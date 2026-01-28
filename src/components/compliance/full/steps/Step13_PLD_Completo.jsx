import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FormSection from '@/components/compliance/FormSection';
import { ShieldCheck } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';
import { Checkbox } from '@/components/ui/checkbox';

const PLDSection = ({ title, children }) => (
  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
    <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider border-b pb-1">{title}</h4>
    {children}
  </div>
);

export default function Step13_PLD_Completo({ formData, handleChange }) {
  const toggleCheckbox = (field, value) => {
    const current = formData[field] || [];
    if (current.includes(value)) handleChange(field, current.filter(x => x !== value));
    else handleChange(field, [...current, value]);
  };

  return (
    <FormSection title="PLD/FT Integrado" subtitle="Políticas, KYC e Monitoramento" icon={ShieldCheck}>
      <div className="space-y-4">
        
        {/* Políticas */}
        <PLDSection title="1. Políticas e Treinamento">
           <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1">
               <Label className="text-[10px] font-semibold">Política PLD Documentada?</Label>
               <div className="flex gap-1">
                 <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldPolitica === 'sim'} onClick={() => handleChange('pldPolitica', 'sim')}>Sim</SelectionButton>
                 <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldPolitica === 'nao'} onClick={() => handleChange('pldPolitica', 'nao')}>Não</SelectionButton>
               </div>
             </div>
             <div className="space-y-1">
               <Label className="text-[10px] font-semibold">Treinamento Formal?</Label>
               <div className="flex gap-1">
                 <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldTreinamento === 'sim'} onClick={() => handleChange('pldTreinamento', 'sim')}>Sim</SelectionButton>
                 <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldTreinamento === 'nao'} onClick={() => handleChange('pldTreinamento', 'nao')}>Não</SelectionButton>
               </div>
             </div>
           </div>
        </PLDSection>

        {/* KYC */}
        <PLDSection title="2. Processos KYC/KYB">
          <div className="space-y-2">
             <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Realiza KYC/KYB dos clientes?</Label>
                <div className="flex gap-1 w-32">
                 <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldRealizaKYC === 'sim'} onClick={() => handleChange('pldRealizaKYC', 'sim')}>Sim</SelectionButton>
                 <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldRealizaKYC === 'nao'} onClick={() => handleChange('pldRealizaKYC', 'nao')}>Não</SelectionButton>
               </div>
             </div>
             {formData.pldRealizaKYC === 'sim' && (
                <div className="grid grid-cols-2 gap-2 pl-2 border-l-2 border-slate-200">
                   {['Documentos', 'Biometria', 'Receita Federal', 'Background Check'].map(item => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox id={`kyc-${item}`} checked={(formData.pldKYCScopo || []).includes(item)} onCheckedChange={() => toggleCheckbox('pldKYCScopo', item)} />
                        <label htmlFor={`kyc-${item}`} className="text-[10px] font-medium leading-none cursor-pointer">{item}</label>
                      </div>
                   ))}
                </div>
             )}
             <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="space-y-1">
                   <Label className="text-[10px] font-semibold">Verifica Sanções?</Label>
                   <div className="flex gap-1">
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldVerificaSancoes === 'sim'} onClick={() => handleChange('pldVerificaSancoes', 'sim')}>Sim</SelectionButton>
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldVerificaSancoes === 'nao'} onClick={() => handleChange('pldVerificaSancoes', 'nao')}>Não</SelectionButton>
                   </div>
                </div>
                <div className="space-y-1">
                   <Label className="text-[10px] font-semibold">Verifica PEP?</Label>
                   <div className="flex gap-1">
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldVerificaPEP === 'sim'} onClick={() => handleChange('pldVerificaPEP', 'sim')}>Sim</SelectionButton>
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldVerificaPEP === 'nao'} onClick={() => handleChange('pldVerificaPEP', 'nao')}>Não</SelectionButton>
                   </div>
                </div>
             </div>
          </div>
        </PLDSection>

        {/* Monitoramento & Governança */}
        <PLDSection title="3. Monitoramento e Governança">
           <div className="space-y-3">
              <div className="space-y-1">
                 <Label className="text-xs font-semibold">Possui sistema de monitoramento?</Label>
                 <div className="flex gap-1">
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldMonitoramento === 'sim'} onClick={() => handleChange('pldMonitoramento', 'sim')}>Sim</SelectionButton>
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldMonitoramento === 'nao'} onClick={() => handleChange('pldMonitoramento', 'nao')}>Não</SelectionButton>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold">Área dedicada Compliance?</Label>
                  <div className="flex gap-1">
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldAreaDedicada === 'sim'} onClick={() => handleChange('pldAreaDedicada', 'sim')}>Sim</SelectionButton>
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldAreaDedicada === 'nao'} onClick={() => handleChange('pldAreaDedicada', 'nao')}>Não</SelectionButton>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-semibold">Auditoria Interna?</Label>
                  <div className="flex gap-1">
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldAuditoria === 'sim'} onClick={() => handleChange('pldAuditoria', 'sim')}>Sim</SelectionButton>
                    <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.pldAuditoria === 'nao'} onClick={() => handleChange('pldAuditoria', 'nao')}>Não</SelectionButton>
                  </div>
                </div>
              </div>
           </div>
        </PLDSection>

      </div>
    </FormSection>
  );
}