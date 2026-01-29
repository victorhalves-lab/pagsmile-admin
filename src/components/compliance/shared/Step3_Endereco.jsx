import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { MapPin } from 'lucide-react';

export default function Step3_Endereco({ formData, handleChange }) {
  return (
    <FormSection title="Endereço Comercial" subtitle="Localização da sede e filiais" icon={MapPin}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Endereço Comercial Registrado *</Label>
          <Textarea 
            className="min-h-[100px] text-base resize-none"
            placeholder="Rua, Número, Complemento, Bairro, Cidade, Estado, CEP" 
            value={formData.enderecoComercial || ''} 
            onChange={(e) => handleChange('enderecoComercial', e.target.value)} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">CEP</Label>
            <Input 
              className="h-12 text-base"
              placeholder="00000-000" 
              value={formData.cep || ''} 
              onChange={(e) => handleChange('cep', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Estado</Label>
            <Input 
              className="h-12 text-base"
              placeholder="UF" 
              value={formData.estado || ''} 
              onChange={(e) => handleChange('estado', e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Outros Escritórios / Filiais</Label>
          <Textarea 
            className="min-h-[80px] text-base resize-none"
            placeholder="Se houver, liste os endereços das filiais (opcional)" 
            value={formData.outrosEnderecos || ''} 
            onChange={(e) => handleChange('outrosEnderecos', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}