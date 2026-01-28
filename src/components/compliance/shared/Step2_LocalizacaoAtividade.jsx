import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { MapPin } from 'lucide-react';

export default function Step2_LocalizacaoAtividade({ formData, handleChange }) {
  return (
    <FormSection title="Localização e Atividade" subtitle="Endereço e CNAE" icon={MapPin}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Endereço Comercial Registrado *</Label>
          <Textarea 
            className="min-h-[50px] text-xs resize-none"
            placeholder="Rua, Número, Bairro, Cidade, Estado, CEP" 
            value={formData.enderecoComercial || ''} 
            onChange={(e) => handleChange('enderecoComercial', e.target.value)} 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Outros Escritórios / Filiais</Label>
          <Textarea 
            className="min-h-[40px] text-xs resize-none"
            placeholder="Se houver, liste os endereços" 
            value={formData.outrosEnderecos || ''} 
            onChange={(e) => handleChange('outrosEnderecos', e.target.value)} 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">CNAE Principal *</Label>
          <Input 
            className="h-9 text-xs"
            placeholder="Código e Descrição" 
            value={formData.cnaePrincipal || ''} 
            onChange={(e) => handleChange('cnaePrincipal', e.target.value)} 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Descrição da Atividade *</Label>
          <Textarea 
            className="min-h-[50px] text-xs resize-none"
            placeholder="Descreva detalhadamente a atividade principal" 
            value={formData.descricaoAtividade || ''} 
            onChange={(e) => handleChange('descricaoAtividade', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}