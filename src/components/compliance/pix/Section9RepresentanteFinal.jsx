import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from '@/components/compliance/FormSection';
import { FileText } from 'lucide-react';

export default function Section9RepresentanteFinal({ formData, handleChange }) {
  return (
    <FormSection title="9. Representante Legal e Informações Financeiras" subtitle="Dados finais" icon={FileText}>
      <div className="space-y-6">
        {/* Representante Legal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Nome Completo do Representante Legal *</Label>
            <Input 
              placeholder="Nome completo" 
              value={formData.representanteLegalNome || ''} 
              onChange={(e) => handleChange('representanteLegalNome', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Cargo do Representante Legal *</Label>
            <Input 
              placeholder="Ex: Diretor" 
              value={formData.representanteLegalCargo || ''} 
              onChange={(e) => handleChange('representanteLegalCargo', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Email do Representante Legal *</Label>
            <Input 
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
            <Label>Custo Atual do PIX (valor fixo ou percentual) *</Label>
            <Input 
              placeholder="Ex: 0.99 ou 1.50" 
              value={formData.custoAtualPix || ''} 
              onChange={(e) => handleChange('custoAtualPix', e.target.value)} 
            />
          </div>
          <div className="space-y-3">
            <Label>Tipo de Custo Atual *</Label>
            <RadioGroup 
              value={formData.tipoCustoAtual || ''} 
              onValueChange={(v) => handleChange('tipoCustoAtual', v)} 
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixo" id="custo-fixo" />
                <Label htmlFor="custo-fixo" className="font-normal">Valor Fixo</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentual" id="custo-percentual" />
                <Label htmlFor="custo-percentual" className="font-normal">Percentual</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* De qual empresa gostaria de receber proposta */}
        <div className="space-y-3">
          <Label>De qual(is) empresa(s) você gostaria de receber uma proposta? *</Label>
          <RadioGroup 
            value={formData.empresaProposta || ''} 
            onValueChange={(v) => handleChange('empresaProposta', v)} 
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="microcash" id="emp-microcash" />
              <Label htmlFor="emp-microcash" className="font-normal">Microcash</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="a55" id="emp-a55" />
              <Label htmlFor="emp-a55" className="font-normal">A55</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ambas" id="emp-ambas" />
              <Label htmlFor="emp-ambas" className="font-normal">Ambas</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Declaração */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-start space-x-3">
            <Checkbox 
              id="declaracaoFinal" 
              checked={formData.declaracaoFinal || false} 
              onCheckedChange={(c) => handleChange('declaracaoFinal', c)} 
            />
            <label htmlFor="declaracaoFinal" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
              <strong>Declaro que as informações fornecidas neste questionário são verdadeiras e precisas</strong>, 
              e me comprometo a atualizá-las sempre que houver alteração. *
            </label>
          </div>
        </div>
      </div>
    </FormSection>
  );
}