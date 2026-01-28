import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { Activity } from 'lucide-react';

export default function Step18_Transacional_Perfil({ formData, handleChange }) {
  return (
    <FormSection title="Perfil Transacional" subtitle="Modelo de negócio" icon={Activity}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Modelo de Negócio *</Label>
          <Select value={formData.modeloNegocio || ''} onValueChange={(v) => handleChange('modeloNegocio', v)}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="marketplace">Marketplace</SelectItem>
              <SelectItem value="infoprodutos">Infoprodutos</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Possui sub-vendedores? *</Label>
          <RadioGroup value={formData.possuiSubvendedores || ''} onValueChange={(v) => handleChange('possuiSubvendedores', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="sub-sim" /><Label htmlFor="sub-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="sub-nao" /><Label htmlFor="sub-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
             <Label className="text-xs font-semibold">Vende Físico? *</Label>
             <RadioGroup value={formData.vendeProdutoFisico || ''} onValueChange={(v) => handleChange('vendeProdutoFisico', v)} className="flex gap-2">
              <div className="flex items-center space-x-1"><RadioGroupItem value="sim" id="fis-sim" /><Label htmlFor="fis-sim" className="font-normal text-xs">Sim</Label></div>
              <div className="flex items-center space-x-1"><RadioGroupItem value="nao" id="fis-nao" /><Label htmlFor="fis-nao" className="font-normal text-xs">Não</Label></div>
             </RadioGroup>
          </div>
          <div className="space-y-2">
             <Label className="text-xs font-semibold">Vende Digital? *</Label>
             <RadioGroup value={formData.vendeProdutoDigital || ''} onValueChange={(v) => handleChange('vendeProdutoDigital', v)} className="flex gap-2">
              <div className="flex items-center space-x-1"><RadioGroupItem value="sim" id="dig-sim" /><Label htmlFor="dig-sim" className="font-normal text-xs">Sim</Label></div>
              <div className="flex items-center space-x-1"><RadioGroupItem value="nao" id="dig-nao" /><Label htmlFor="dig-nao" className="font-normal text-xs">Não</Label></div>
             </RadioGroup>
          </div>
        </div>
      </div>
    </FormSection>
  );
}