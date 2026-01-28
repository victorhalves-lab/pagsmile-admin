import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from '@/components/compliance/FormSection';
import { FileText } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section9RepresentanteFinal({ formData, handleChange }) {
  return (
    <FormSection title="Representante Legal e Informações Financeiras" subtitle="Dados finais" icon={FileText}>
      <div className="space-y-6">
        {/* Representante Legal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Nome Completo (Representante) *</Label>
            <Input 
              className="h-9 text-xs"
              placeholder="Nome completo" 
              value={formData.representanteLegalNome || ''} 
              onChange={(e) => handleChange('representanteLegalNome', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Cargo *</Label>
            <Input 
              className="h-9 text-xs"
              placeholder="Ex: Diretor" 
              value={formData.representanteLegalCargo || ''} 
              onChange={(e) => handleChange('representanteLegalCargo', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Email *</Label>
            <Input 
              className="h-9 text-xs"
              type="email"
              placeholder="email@empresa.com" 
              value={formData.representanteLegalEmail || ''} 
              onChange={(e) => handleChange('representanteLegalEmail', e.target.value)} 
            />
          </div>
        </div>

        {/* Custo Atual do PIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Custo Atual do PIX (valor fixo ou percentual) *</Label>
            <Input 
              className="h-9 text-xs"
              placeholder="Ex: 0.99 ou 1.50" 
              value={formData.custoAtualPix || ''} 
              onChange={(e) => handleChange('custoAtualPix', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-semibold mb-2 block">Tipo de Custo Atual *</Label>
            <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.tipoCustoAtual === 'fixo'}
                onClick={() => handleChange('tipoCustoAtual', 'fixo')}
              >
                Valor Fixo
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.tipoCustoAtual === 'percentual'}
                onClick={() => handleChange('tipoCustoAtual', 'percentual')}
              >
                Percentual
              </SelectionButton>
            </div>
          </div>
        </div>

        {/* De qual empresa gostaria de receber proposta */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Receber proposta de: *</Label>
          <div className="flex gap-2">
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.empresaProposta === 'microcash'}
              onClick={() => handleChange('empresaProposta', 'microcash')}
            >
              Microcash
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.empresaProposta === 'a55'}
              onClick={() => handleChange('empresaProposta', 'a55')}
            >
              A55
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.empresaProposta === 'ambas'}
              onClick={() => handleChange('empresaProposta', 'ambas')}
            >
              Ambas
            </SelectionButton>
          </div>
        </div>

        {/* Declaração */}
        <div className="border border-gray-200 rounded-lg p-3 bg-white">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="declaracaoFinal" 
              checked={formData.declaracaoFinal || false} 
              onCheckedChange={(c) => handleChange('declaracaoFinal', c)} 
            />
            <label htmlFor="declaracaoFinal" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
              <strong>Declaro que as informações fornecidas neste questionário são verdadeiras e precisas</strong>, 
              e me comprometo a atualizá-las sempre que houver alteração. *
            </label>
          </div>
        </div>
      </div>
    </FormSection>
  );
}