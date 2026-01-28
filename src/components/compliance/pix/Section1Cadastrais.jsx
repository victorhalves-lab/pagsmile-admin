import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';

export default function Section1Cadastrais({ formData, handleChange }) {
  return (
    <FormSection title="1. Informações Cadastrais" subtitle="Dados básicos da empresa" icon={Building2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Razão Social *</Label>
          <Input 
            placeholder="Nome da empresa" 
            value={formData.razaoSocial || ''} 
            onChange={(e) => handleChange('razaoSocial', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Nome Comercial / Nome Fantasia</Label>
          <Input 
            placeholder="Nome comercial" 
            value={formData.nomeFantasia || ''} 
            onChange={(e) => handleChange('nomeFantasia', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Tipo de Empresa</Label>
          <Input 
            placeholder="Sociedade, Privada, Pública, Limitada..." 
            value={formData.tipoEmpresa || ''} 
            onChange={(e) => handleChange('tipoEmpresa', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>CNPJ *</Label>
          <Input 
            placeholder="00.000.000/0000-00" 
            value={formData.cnpj || ''} 
            onChange={(e) => handleChange('cnpj', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Data Início da Atividade</Label>
          <Input 
            type="date" 
            value={formData.dataInicioAtividade || ''} 
            onChange={(e) => handleChange('dataInicioAtividade', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Quantidade de Colaboradores</Label>
          <Input 
            type="number" 
            placeholder="0" 
            value={formData.qtdColaboradores || ''} 
            onChange={(e) => handleChange('qtdColaboradores', e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Endereço Comercial Registrado (CNPJ) *</Label>
          <Textarea 
            placeholder="Endereço completo conforme CNPJ" 
            value={formData.enderecoComercial || ''} 
            onChange={(e) => handleChange('enderecoComercial', e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Endereço de Demais Escritórios Físicos *</Label>
          <Textarea 
            placeholder="Caso não possua outros escritórios, escreva 'Não aplicável'" 
            value={formData.enderecoDemaisEscritorios || ''} 
            onChange={(e) => handleChange('enderecoDemaisEscritorios', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}