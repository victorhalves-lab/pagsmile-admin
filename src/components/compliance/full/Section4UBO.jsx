import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Users, Plus, Trash2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const nacionalidades = ['Brasil', 'Estados Unidos', 'Portugal', 'Espanha', 'Argentina', 'Chile', 'Colômbia', 'México', 'Alemanha', 'França', 'Itália', 'Reino Unido', 'China', 'Japão', 'Outro'];

export default function Section4UBO({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const uboList = formData.uboList || [];

  return (
    <FormSection title="Beneficiários Finais (UBO)" subtitle="Indivíduos com > 25% de participação" icon={Users}>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Empresa de capital aberto? *</Label>
          <div className="flex gap-2">
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.empresaCapitalAberto === 'sim'}
              onClick={() => handleChange('empresaCapitalAberto', 'sim')}
            >
              Sim
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.empresaCapitalAberto === 'nao'}
              onClick={() => handleChange('empresaCapitalAberto', 'nao')}
            >
              Não
            </SelectionButton>
          </div>
        </div>

        {formData.empresaCapitalAberto === 'nao' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Beneficiários Finais</Label>
              <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => handleAddArrayItem('uboList', { nome: '', nacionalidade: '', endereco: '', participacao: '', documento: '', isPEP: '', detalhePEP: '' })}>
                <Plus className="w-3 h-3 mr-1" /> Adicionar
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {uboList.map((ubo, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-700">Beneficiário {idx + 1}</span>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => handleRemoveArrayItem('uboList', idx)}><Trash2 className="w-3 h-3" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Nome Completo *</Label>
                    <Input className="h-8 text-xs" placeholder="Nome completo" value={ubo.nome} onChange={(e) => handleArrayChange('uboList', idx, 'nome', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Nacionalidade *</Label>
                    <Select value={ubo.nacionalidade} onValueChange={(v) => handleArrayChange('uboList', idx, 'nacionalidade', v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {nacionalidades.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs font-semibold">Endereço Residencial *</Label>
                    <Textarea className="min-h-[40px] text-xs" placeholder="Endereço completo" value={ubo.endereco} onChange={(e) => handleArrayChange('uboList', idx, 'endereco', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">% Participação *</Label>
                    <Input className="h-8 text-xs" type="number" step="0.01" placeholder="Ex: 30" value={ubo.participacao} onChange={(e) => handleArrayChange('uboList', idx, 'participacao', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">CPF/Passaporte *</Label>
                    <Input className="h-8 text-xs" placeholder="Documento" value={ubo.documento} onChange={(e) => handleArrayChange('uboList', idx, 'documento', e.target.value)} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-semibold mb-1 block">É PEP? *</Label>
                    <div className="flex gap-2">
                      <SelectionButton
                        className="flex-1 py-1 px-3 text-xs h-7"
                        selected={ubo.isPEP === 'sim'}
                        onClick={() => handleArrayChange('uboList', idx, 'isPEP', 'sim')}
                      >
                        Sim
                      </SelectionButton>
                      <SelectionButton
                        className="flex-1 py-1 px-3 text-xs h-7"
                        selected={ubo.isPEP === 'nao'}
                        onClick={() => handleArrayChange('uboList', idx, 'isPEP', 'nao')}
                      >
                        Não
                      </SelectionButton>
                    </div>
                  </div>
                  {ubo.isPEP === 'sim' && (
                    <div className="space-y-1 md:col-span-2">
                      <Label className="text-xs font-semibold">Detalhes PEP *</Label>
                      <Textarea className="min-h-[40px] text-xs" placeholder="Descreva cargo/função" value={ubo.detalhePEP} onChange={(e) => handleArrayChange('uboList', idx, 'detalhePEP', e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>
    </FormSection>
  );
}