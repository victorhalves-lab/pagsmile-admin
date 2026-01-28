import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { Activity } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step18_Transacional_Perfil({ formData, handleChange }) {
  return (
    <FormSection title="Perfil Transacional" subtitle="Modelo de negócio" icon={Activity}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Modelo de Negócio *</Label>
          <Select value={formData.modeloNegocio || ''} onValueChange={(v) => handleChange('modeloNegocio', v)}>
            <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
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
          <Label className="text-xs font-semibold mb-2 block">Possui sub-vendedores? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.possuiSubvendedores === 'sim'}
                onClick={() => handleChange('possuiSubvendedores', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.possuiSubvendedores === 'nao'}
                onClick={() => handleChange('possuiSubvendedores', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
             <Label className="text-xs font-semibold mb-2 block">Vende Físico? *</Label>
             <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.vendeProdutoFisico === 'sim'}
                onClick={() => handleChange('vendeProdutoFisico', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.vendeProdutoFisico === 'nao'}
                onClick={() => handleChange('vendeProdutoFisico', 'nao')}
              >
                Não
              </SelectionButton>
             </div>
          </div>
          <div className="space-y-2">
             <Label className="text-xs font-semibold mb-2 block">Vende Digital? *</Label>
             <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.vendeProdutoDigital === 'sim'}
                onClick={() => handleChange('vendeProdutoDigital', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.vendeProdutoDigital === 'nao'}
                onClick={() => handleChange('vendeProdutoDigital', 'nao')}
              >
                Não
              </SelectionButton>
             </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
}