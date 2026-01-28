import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { Building2 } from 'lucide-react';

export default function Section1Cadastrais({ formData, handleChange }) {
  return (
    <FormSection title="1. Dados Cadastrais da Empresa" subtitle="Informações básicas" icon={Building2}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>CNPJ *</Label>
          <Input placeholder="00.000.000/0000-00" value={formData.cnpj || ''} onChange={(e) => handleChange('cnpj', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Razão Social *</Label>
          <Input placeholder="Nome da empresa" value={formData.razaoSocial || ''} onChange={(e) => handleChange('razaoSocial', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Nome Fantasia</Label>
          <Input placeholder="Nome fantasia (opcional)" value={formData.nomeFantasia || ''} onChange={(e) => handleChange('nomeFantasia', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Tipo de Empresa *</Label>
          <Select value={formData.tipoEmpresa || ''} onValueChange={(v) => handleChange('tipoEmpresa', v)}>
            <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ltda">Sociedade Limitada</SelectItem>
              <SelectItem value="sa">S.A. (Sociedade Anônima)</SelectItem>
              <SelectItem value="eireli">EIRELI</SelectItem>
              <SelectItem value="mei">MEI</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Data Início da Atividade *</Label>
          <Input type="date" value={formData.dataInicioAtividade || ''} onChange={(e) => handleChange('dataInicioAtividade', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Quantidade de Colaboradores *</Label>
          <Select value={formData.qtdColaboradores || ''} onValueChange={(v) => handleChange('qtdColaboradores', v)}>
            <SelectTrigger><SelectValue placeholder="Selecione a faixa" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1 a 10</SelectItem>
              <SelectItem value="11-50">11 a 50</SelectItem>
              <SelectItem value="51-200">51 a 200</SelectItem>
              <SelectItem value="201-500">201 a 500</SelectItem>
              <SelectItem value="500+">Mais de 500</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Endereço Comercial (registrado no CNPJ) *</Label>
          <Textarea placeholder="Endereço completo conforme consta no CNPJ" value={formData.enderecoComercial || ''} onChange={(e) => handleChange('enderecoComercial', e.target.value)} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Endereço de Demais Escritórios (opcional)</Label>
          <Textarea placeholder="Caso possua outros escritórios, informe os endereços" value={formData.enderecoDemaisEscritorios || ''} onChange={(e) => handleChange('enderecoDemaisEscritorios', e.target.value)} />
        </div>
      </div>
    </FormSection>
  );
}