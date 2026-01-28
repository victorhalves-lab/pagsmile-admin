import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { Contact } from 'lucide-react';

export default function Section7Responsaveis({ formData, handleChange }) {
  return (
    <FormSection title="7. Responsáveis" subtitle="Contatos por área" icon={Contact}>
      <div className="space-y-6">
        {/* Responsável pela Contabilidade */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">Responsável pela Contabilidade</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                placeholder="Nome" 
                value={formData.respContabilidadeNome || ''} 
                onChange={(e) => handleChange('respContabilidadeNome', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input 
                type="email"
                placeholder="email@empresa.com" 
                value={formData.respContabilidadeEmail || ''} 
                onChange={(e) => handleChange('respContabilidadeEmail', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>CRC (Conselho Regional de Contabilidade)</Label>
              <Input 
                placeholder="Número do CRC" 
                value={formData.respContabilidadeCRC || ''} 
                onChange={(e) => handleChange('respContabilidadeCRC', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Responsável pelo Atendimento */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">Responsável pelo Atendimento</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                placeholder="Nome" 
                value={formData.respAtendimentoNome || ''} 
                onChange={(e) => handleChange('respAtendimentoNome', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input 
                type="email"
                placeholder="email@empresa.com" 
                value={formData.respAtendimentoEmail || ''} 
                onChange={(e) => handleChange('respAtendimentoEmail', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input 
                placeholder="(11) 99999-9999" 
                value={formData.respAtendimentoTelefone || ''} 
                onChange={(e) => handleChange('respAtendimentoTelefone', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Responsável pelo Compliance */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">Responsável pelo Compliance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                placeholder="Nome" 
                value={formData.respComplianceNome || ''} 
                onChange={(e) => handleChange('respComplianceNome', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>CPF</Label>
              <Input 
                placeholder="000.000.000-00" 
                value={formData.respComplianceCPF || ''} 
                onChange={(e) => handleChange('respComplianceCPF', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input 
                type="email"
                placeholder="email@empresa.com" 
                value={formData.respComplianceEmail || ''} 
                onChange={(e) => handleChange('respComplianceEmail', e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input 
                placeholder="(11) 99999-9999" 
                value={formData.respComplianceTelefone || ''} 
                onChange={(e) => handleChange('respComplianceTelefone', e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}