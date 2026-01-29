import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Briefcase } from 'lucide-react';

export default function Step4_Atividade({ formData, handleChange }) {
  return (
    <FormSection title="Atividade Econômica" subtitle="CNAE e descrição do negócio" icon={Briefcase}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">CNAE Principal *</Label>
          <Input 
            className="h-12 text-base"
            placeholder="Código e Descrição do CNAE Principal" 
            value={formData.cnaePrincipal || ''} 
            onChange={(e) => handleChange('cnaePrincipal', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">CNAEs Secundários</Label>
          <Textarea 
            className="min-h-[80px] text-base resize-none"
            placeholder="Liste os CNAEs secundários, se houver (opcional)" 
            value={formData.cnaesSecundarios || ''} 
            onChange={(e) => handleChange('cnaesSecundarios', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Descrição Detalhada da Atividade *</Label>
          <Textarea 
            className="min-h-[120px] text-base resize-none"
            placeholder="Descreva detalhadamente o que sua empresa faz, quais produtos ou serviços oferece, e como opera no mercado..." 
            value={formData.descricaoAtividade || ''} 
            onChange={(e) => handleChange('descricaoAtividade', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}