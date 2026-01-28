import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';

export default function Step1_Identificacao({ formData, handleChange }) {
  return (
    <FormSection title="Identificação" subtitle="Dados principais" icon={Building2}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">CNPJ *</Label>
          <Input 
            className="h-9"
            placeholder="00.000.000/0000-00" 
            value={formData.cnpj || ''} 
            onChange={(e) => handleChange('cnpj', e.target.value)} 
            autoFocus
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Razão Social *</Label>
          <Input 
            className="h-9"
            placeholder="Nome da empresa" 
            value={formData.razaoSocial || ''} 
            onChange={(e) => handleChange('razaoSocial', e.target.value)} 
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Nome Fantasia</Label>
          <Input 
            className="h-9"
            placeholder="Nome comercial" 
            value={formData.nomeFantasia || ''} 
            onChange={(e) => handleChange('nomeFantasia', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}