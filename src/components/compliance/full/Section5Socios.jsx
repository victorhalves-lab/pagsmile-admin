import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { UserCheck, Plus, Trash2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section5Socios({ formData, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const socios = formData.sociosList || [];

  return (
    <FormSection title="Sócios e Administradores" subtitle="Informe os dados dos gestores" icon={UserCheck}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Lista de Pessoas Chave</Label>
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => handleAddArrayItem('sociosList', { nome: '', cargo: '', cpf: '', email: '', isPEP: '' })}>
            <Plus className="w-3 h-3 mr-1" /> Adicionar
          </Button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {socios.map((socio, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-700">Pessoa {idx + 1}</span>
              <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => handleRemoveArrayItem('sociosList', idx)}><Trash2 className="w-3 h-3" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Nome Completo *</Label>
                <Input className="h-8 text-xs" placeholder="Nome" value={socio.nome} onChange={(e) => handleArrayChange('sociosList', idx, 'nome', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Cargo *</Label>
                <Select value={socio.cargo} onValueChange={(v) => handleArrayChange('sociosList', idx, 'cargo', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="socio">Sócio</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="diretor">Diretor Executivo</SelectItem>
                    <SelectItem value="procurador">Procurador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">CPF *</Label>
                <Input className="h-8 text-xs" placeholder="000.000.000-00" value={socio.cpf} onChange={(e) => handleArrayChange('sociosList', idx, 'cpf', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">E-mail *</Label>
                <Input className="h-8 text-xs" type="email" placeholder="email@empresa.com" value={socio.email} onChange={(e) => handleArrayChange('sociosList', idx, 'email', e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs font-semibold mb-1 block">É PEP (Pessoa Politicamente Exposta)? *</Label>
                <div className="flex gap-2">
                  <SelectionButton
                    className="flex-1 py-1 px-3 text-xs h-7"
                    selected={socio.isPEP === 'sim'}
                    onClick={() => handleArrayChange('sociosList', idx, 'isPEP', 'sim')}
                  >
                    Sim
                  </SelectionButton>
                  <SelectionButton
                    className="flex-1 py-1 px-3 text-xs h-7"
                    selected={socio.isPEP === 'nao'}
                    onClick={() => handleArrayChange('sociosList', idx, 'isPEP', 'nao')}
                  >
                    Não
                  </SelectionButton>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </FormSection>
  );
}