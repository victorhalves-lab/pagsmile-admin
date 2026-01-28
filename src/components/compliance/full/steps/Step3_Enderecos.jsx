import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { MapPin } from 'lucide-react';

export default function Step3_Enderecos({ formData, handleChange }) {
  return (
    <FormSection title="Localização" subtitle="Endereços da empresa" icon={MapPin}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Endereço Comercial Registrado (CNPJ) *</Label>
          <Textarea 
            className="min-h-[80px] text-sm"
            placeholder="Rua, Número, Bairro, Cidade - UF, CEP" 
            value={formData.enderecoComercial || ''} 
            onChange={(e) => handleChange('enderecoComercial', e.target.value)} 
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Outros Escritórios / Filiais</Label>
          <Textarea 
            className="min-h-[60px] text-sm"
            placeholder="'Não aplicável' se não houver" 
            value={formData.enderecoDemaisEscritorios || ''} 
            onChange={(e) => handleChange('enderecoDemaisEscritorios', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}