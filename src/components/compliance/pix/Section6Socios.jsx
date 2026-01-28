import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { UserCheck, Plus, Trash2 } from 'lucide-react';

export default function Section6Socios({ formData, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const socios = formData.sociosAdministradores || [];

  return (
    <FormSection title="6. Sócios e Administradores" subtitle="Dados dos gestores da empresa" icon={UserCheck}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">Adicionar Sócio/Administrador</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => handleAddArrayItem('sociosAdministradores', { nome: '', cargo: '', cpf: '', email: '' })}
          >
            <Plus className="w-4 h-4 mr-1" /> Adicionar
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">Pelo menos um sócio/administrador é obrigatório.</p>

        {socios.map((socio, index) => (
          <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Pessoa {index + 1}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveArrayItem('sociosAdministradores', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input 
                  placeholder="Nome completo" 
                  value={socio.nome}
                  onChange={(e) => handleArrayChange('sociosAdministradores', index, 'nome', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input 
                  placeholder="Sócio, Administrador, etc." 
                  value={socio.cargo}
                  onChange={(e) => handleArrayChange('sociosAdministradores', index, 'cargo', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input 
                  placeholder="000.000.000-00" 
                  value={socio.cpf}
                  onChange={(e) => handleArrayChange('sociosAdministradores', index, 'cpf', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input 
                  type="email"
                  placeholder="email@empresa.com" 
                  value={socio.email}
                  onChange={(e) => handleArrayChange('sociosAdministradores', index, 'email', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </FormSection>
  );
}