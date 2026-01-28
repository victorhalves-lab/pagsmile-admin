import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section1Cadastrais({ formData, handleChange }) {
  return (
    <FormSection title="1. Dados Cadastrais da Empresa" subtitle="Informações básicas" icon={Building2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">CNPJ *</Label>
          <Input className="h-9 text-sm" placeholder="00.000.000/0000-00" value={formData.cnpj || ''} onChange={(e) => handleChange('cnpj', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Razão Social *</Label>
          <Input className="h-9 text-sm" placeholder="Nome da empresa" value={formData.razaoSocial || ''} onChange={(e) => handleChange('razaoSocial', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Nome Fantasia</Label>
          <Input className="h-9 text-sm" placeholder="Nome fantasia (opcional)" value={formData.nomeFantasia || ''} onChange={(e) => handleChange('nomeFantasia', e.target.value)} />
        </div>
        
        <div className="space-y-1">
          <Label className="text-xs">Tipo de Empresa *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['LTDA', 'SA', 'EIRELI', 'MEI', 'Outro'].map(opt => (
              <SelectionButton
                key={opt}
                className="py-1.5 text-xs h-9"
                selected={formData.tipoEmpresa === opt.toLowerCase()}
                onClick={() => handleChange('tipoEmpresa', opt.toLowerCase())}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Data Início da Atividade *</Label>
          <Input className="h-9 text-sm" type="date" value={formData.dataInicioAtividade || ''} onChange={(e) => handleChange('dataInicioAtividade', e.target.value)} />
        </div>
        
        <div className="space-y-1">
          <Label className="text-xs">Quantidade de Colaboradores *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['1-10', '11-50', '51-200', '201-500', '500+'].map(opt => (
              <SelectionButton
                key={opt}
                className="py-1.5 text-xs h-9"
                selected={formData.qtdColaboradores === opt}
                onClick={() => handleChange('qtdColaboradores', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">Endereço Comercial (registrado no CNPJ) *</Label>
          <Textarea className="min-h-[50px] text-sm" placeholder="Endereço completo conforme consta no CNPJ" value={formData.enderecoComercial || ''} onChange={(e) => handleChange('enderecoComercial', e.target.value)} />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">Endereço de Demais Escritórios (opcional)</Label>
          <Textarea className="min-h-[40px] text-sm" placeholder="Caso possua outros escritórios, informe os endereços" value={formData.enderecoDemaisEscritorios || ''} onChange={(e) => handleChange('enderecoDemaisEscritorios', e.target.value)} />
        </div>
      </div>
    </FormSection>
  );
}