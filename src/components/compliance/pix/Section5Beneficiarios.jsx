import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Users, Plus, Trash2 } from 'lucide-react';

export default function Section5Beneficiarios({ formData, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const beneficiarios = formData.beneficiariosFinais || [];

  return (
    <FormSection title="5. Beneficiários Finais" subtitle="Indivíduos com participação relevante" icon={Users}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Adicionar Beneficiário Final</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleAddArrayItem('beneficiariosFinais', { nome: '', nacionalidade: '', endereco: '', participacao: '' })}
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">Pelo menos um beneficiário é obrigatório.</p>

        {beneficiarios.map((beneficiario, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Beneficiário {index + 1}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveArrayItem('beneficiariosFinais', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input 
                  placeholder="Nome completo" 
                  value={beneficiario.nome}
                  onChange={(e) => handleArrayChange('beneficiariosFinais', index, 'nome', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nacionalidade</Label>
                <Input 
                  placeholder="Brasileira" 
                  value={beneficiario.nacionalidade}
                  onChange={(e) => handleArrayChange('beneficiariosFinais', index, 'nacionalidade', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Endereço Completo</Label>
                <Input 
                  placeholder="Endereço completo" 
                  value={beneficiario.endereco}
                  onChange={(e) => handleArrayChange('beneficiariosFinais', index, 'endereco', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Participação %</Label>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="0.00" 
                  value={beneficiario.participacao}
                  onChange={(e) => handleArrayChange('beneficiariosFinais', index, 'participacao', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}