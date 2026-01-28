import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Users } from 'lucide-react';

export default function Step6_Clientes({ formData, handleChange }) {
  return (
    <FormSection title="Clientes" subtitle="Perfil da carteira" icon={Users}>
      <div className="space-y-2">
        <Label className="text-xs font-semibold">Quais são seus 5 principais clientes (Empresas e Segmentos)? *</Label>
        <p className="text-xs text-slate-500 mb-2">Liste abaixo os principais clientes ou perfis de clientes que sua empresa atende.</p>
        <Textarea 
          className="min-h-[150px] text-sm"
          placeholder="Ex: Cliente A (Varejo), Cliente B (Tecnologia), Cliente C (Financeiro)..." 
          value={formData.principaisClientes || ''} 
          onChange={(e) => handleChange('principaisClientes', e.target.value)}
        />
      </div>
    </FormSection>
  );
}