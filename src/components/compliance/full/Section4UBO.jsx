import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Users, Plus, Trash2 } from 'lucide-react';

const nacionalidades = ['Brasil', 'Estados Unidos', 'Portugal', 'Espanha', 'Argentina', 'Chile', 'Colômbia', 'México', 'Alemanha', 'França', 'Itália', 'Reino Unido', 'China', 'Japão', 'Outro'];

export default function Section4UBO({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const uboList = formData.uboList || [];

  return (
    <FormSection title="4. Beneficiários Finais (UBO)" subtitle="Identifique TODOS os indivíduos com mais de 25% de participação" icon={Users}>
      <div className="space-y-6">
        <div className="space-y-3">
          <Label>A empresa é de capital aberto? *</Label>
          <RadioGroup value={formData.empresaCapitalAberto || ''} onValueChange={(v) => handleChange('empresaCapitalAberto', v)} className="flex gap-6">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="cap-sim" /><Label htmlFor="cap-sim" className="font-normal">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="cap-nao" /><Label htmlFor="cap-nao" className="font-normal">Não</Label></div>
          </RadioGroup>
        </div>

        {formData.empresaCapitalAberto === 'nao' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Beneficiários Finais (participação &gt; 25%)</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem('uboList', { nome: '', nacionalidade: '', endereco: '', participacao: '', documento: '', isPEP: '', detalhePEP: '' })}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar
              </Button>
            </div>

            {uboList.map((ubo, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-lg space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Beneficiário {idx + 1}</span>
                  <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveArrayItem('uboList', idx)}><Trash2 className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo *</Label>
                    <Input placeholder="Nome completo do beneficiário" value={ubo.nome} onChange={(e) => handleArrayChange('uboList', idx, 'nome', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nacionalidade *</Label>
                    <Select value={ubo.nacionalidade} onValueChange={(v) => handleArrayChange('uboList', idx, 'nacionalidade', v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {nacionalidades.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Endereço Residencial *</Label>
                    <Textarea placeholder="Endereço completo" value={ubo.endereco} onChange={(e) => handleArrayChange('uboList', idx, 'endereco', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>% de Participação *</Label>
                    <Input type="number" step="0.01" placeholder="Ex: 30" value={ubo.participacao} onChange={(e) => handleArrayChange('uboList', idx, 'participacao', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>CPF ou Passaporte *</Label>
                    <Input placeholder="Documento de identificação" value={ubo.documento} onChange={(e) => handleArrayChange('uboList', idx, 'documento', e.target.value)} />
                  </div>
                  <div className="space-y-3">
                    <Label>É PEP (Pessoa Politicamente Exposta)? *</Label>
                    <RadioGroup value={ubo.isPEP} onValueChange={(v) => handleArrayChange('uboList', idx, 'isPEP', v)} className="flex gap-6">
                      <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id={`pep-${idx}-sim`} /><Label htmlFor={`pep-${idx}-sim`} className="font-normal">Sim</Label></div>
                      <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id={`pep-${idx}-nao`} /><Label htmlFor={`pep-${idx}-nao`} className="font-normal">Não</Label></div>
                    </RadioGroup>
                  </div>
                  {ubo.isPEP === 'sim' && (
                    <div className="space-y-2">
                      <Label>Detalhes PEP *</Label>
                      <Textarea placeholder="Descreva o cargo/função política" value={ubo.detalhePEP} onChange={(e) => handleArrayChange('uboList', idx, 'detalhePEP', e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
}