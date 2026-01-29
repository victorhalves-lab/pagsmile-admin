import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { UserCircle } from 'lucide-react';

export default function Step7_Responsaveis({ formData, handleChange }) {
  return (
    <FormSection title="Responsáveis pela Empresa" subtitle="Contatos principais" icon={UserCircle}>
      <div className="space-y-8">
        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Representante Legal / Responsável Principal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Nome Completo *</Label>
              <Input 
                className="h-12 text-base"
                placeholder="Nome do responsável" 
                value={formData.responsavelNome || ''} 
                onChange={(e) => handleChange('responsavelNome', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">CPF *</Label>
              <Input 
                className="h-12 text-base"
                placeholder="000.000.000-00" 
                value={formData.responsavelCPF || ''} 
                onChange={(e) => handleChange('responsavelCPF', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">E-mail *</Label>
              <Input 
                className="h-12 text-base"
                type="email"
                placeholder="email@empresa.com" 
                value={formData.responsavelEmail || ''} 
                onChange={(e) => handleChange('responsavelEmail', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Telefone *</Label>
              <Input 
                className="h-12 text-base"
                placeholder="(00) 00000-0000" 
                value={formData.responsavelTelefone || ''} 
                onChange={(e) => handleChange('responsavelTelefone', e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-700 mb-4">Contato Financeiro (se diferente)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Nome</Label>
              <Input 
                className="h-12 text-base"
                placeholder="Nome do contato financeiro" 
                value={formData.financeiroNome || ''} 
                onChange={(e) => handleChange('financeiroNome', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">E-mail</Label>
              <Input 
                className="h-12 text-base"
                type="email"
                placeholder="financeiro@empresa.com" 
                value={formData.financeiroEmail || ''} 
                onChange={(e) => handleChange('financeiroEmail', e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}