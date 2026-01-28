import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Briefcase } from 'lucide-react';

export default function Step4_Atividade({ formData, handleChange }) {
  return (
    <FormSection title="Atividade" subtitle="O que a empresa faz" icon={Briefcase}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Escopo do Negócio *</Label>
          <Textarea 
            className="min-h-[80px] text-sm"
            placeholder="Descreva a atividade principal da empresa..." 
            value={formData.escopoNegocio || ''} 
            onChange={(e) => handleChange('escopoNegocio', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Site Corporativo *</Label>
          <Input 
            className="h-9"
            type="url" 
            placeholder="https://..." 
            value={formData.siteCorporativo || ''} 
            onChange={(e) => handleChange('siteCorporativo', e.target.value)} 
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">URL do Produto/App (se houver)</Label>
          <Input 
            className="h-9"
            type="url" 
            placeholder="https://..." 
            value={formData.urlProdutoApp || ''} 
            onChange={(e) => handleChange('urlProdutoApp', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}