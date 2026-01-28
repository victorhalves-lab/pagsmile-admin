import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { UserCheck, Plus, Trash2 } from 'lucide-react';

export default function Section5Socios({ formData, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const socios = formData.sociosList || [];

  return (
    <FormSection title="5. Sócios, Administradores, Diretores e Procuradores" subtitle="Informe os dados de todas as pessoas com poder de gestão" icon={UserCheck}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Lista de Sócios/Administradores/Diretores</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => handleAddArrayItem('sociosList', { nome: '', cargo: '', cpf: '', email: '', isPEP: '' })}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar pessoa
          </Button>
        </div>

        {socios.map((socio, idx) => (
          <div key={idx} className="p-4 bg-slate-50 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Pessoa {idx + 1}</span>
              <Button type="button" variant="ghost" size="icon" className="text-red-500" onClick={() => handleRemoveArrayItem('sociosList', idx)}><Trash2 className="w-4 h-4" /></Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo *</Label>
                <Input placeholder="Nome completo" value={socio.nome} onChange={(e) => handleArrayChange('sociosList', idx, 'nome', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Cargo *</Label>
                <Select value={socio.cargo} onValueChange={(v) => handleArrayChange('sociosList', idx, 'cargo', v)}>
                  <SelectTrigger><SelectValue placeholder="Selecione o cargo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="socio">Sócio</SelectItem>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="diretor">Diretor Executivo</SelectItem>
                    <SelectItem value="procurador">Procurador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>CPF *</Label>
                <Input placeholder="000.000.000-00" value={socio.cpf} onChange={(e) => handleArrayChange('sociosList', idx, 'cpf', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>E-mail *</Label>
                <Input type="email" placeholder="email@empresa.com" value={socio.email} onChange={(e) => handleArrayChange('sociosList', idx, 'email', e.target.value)} />
              </div>
              <div className="space-y-3 md:col-span-2">
                <Label>É PEP (Pessoa Politicamente Exposta)? *</Label>
                <RadioGroup value={socio.isPEP} onValueChange={(v) => handleArrayChange('sociosList', idx, 'isPEP', v)} className="flex gap-6">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id={`socio-pep-${idx}-sim`} /><Label htmlFor={`socio-pep-${idx}-sim`} className="font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id={`socio-pep-${idx}-nao`} /><Label htmlFor={`socio-pep-${idx}-nao`} className="font-normal">Não</Label></div>
                </RadioGroup>
              </div>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}