import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';

export default function Step1_Identificacao({ formData, handleChange }) {
  return (
    <FormSection title="Identificação da Empresa" subtitle="Dados básicos de cadastro" icon={Building2}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">CNPJ *</Label>
            <Input 
              className="h-12 text-base"
              placeholder="00.000.000/0000-00" 
              value={formData.cnpj || ''} 
              onChange={(e) => handleChange('cnpj', e.target.value)} 
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Início das Atividades *</Label>
            <Input 
              className="h-12 text-base"
              type="date" 
              value={formData.dataInicioAtividade || ''} 
              onChange={(e) => handleChange('dataInicioAtividade', e.target.value)} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Razão Social *</Label>
          <Input 
            className="h-12 text-base"
            placeholder="Digite a razão social completa" 
            value={formData.razaoSocial || ''} 
            onChange={(e) => handleChange('razaoSocial', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Nome Fantasia</Label>
          <Input 
            className="h-12 text-base"
            placeholder="Nome comercial da empresa (opcional)" 
            value={formData.nomeFantasia || ''} 
            onChange={(e) => handleChange('nomeFantasia', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}