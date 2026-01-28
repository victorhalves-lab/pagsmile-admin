import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step1_DadosCadastrais({ formData, handleChange }) {
  return (
    <FormSection title="Dados Cadastrais" subtitle="Informações principais" icon={Building2}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">CNPJ *</Label>
            <Input 
              className="h-9 text-xs"
              placeholder="00.000.000/0000-00" 
              value={formData.cnpj || ''} 
              onChange={(e) => handleChange('cnpj', e.target.value)} 
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Início Atividades *</Label>
            <Input 
              className="h-9 text-xs"
              type="date" 
              value={formData.dataInicioAtividade || ''} 
              onChange={(e) => handleChange('dataInicioAtividade', e.target.value)} 
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Razão Social *</Label>
          <Input 
            className="h-9 text-xs"
            placeholder="Razão Social" 
            value={formData.razaoSocial || ''} 
            onChange={(e) => handleChange('razaoSocial', e.target.value)} 
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Nome Fantasia</Label>
          <Input 
            className="h-9 text-xs"
            placeholder="Nome Fantasia" 
            value={formData.nomeFantasia || ''} 
            onChange={(e) => handleChange('nomeFantasia', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Tipo de Empresa *</Label>
          <div className="grid grid-cols-3 gap-2">
            {['LTDA', 'SA', 'EIRELI', 'MEI', 'Outro'].map(opt => (
              <SelectionButton
                key={opt}
                className="py-1.5 text-[10px] h-8 px-1"
                selected={formData.tipoEmpresa === opt}
                onClick={() => handleChange('tipoEmpresa', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Colaboradores *</Label>
          <div className="grid grid-cols-4 gap-2">
            {['1-5', '6-10', '11-50', '50+'].map(opt => (
              <SelectionButton
                key={opt}
                className="py-1.5 text-[10px] h-8 px-1"
                selected={formData.qtdColaboradores === opt}
                onClick={() => handleChange('qtdColaboradores', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
}