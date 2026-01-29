import React from 'react';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { FileText, Users } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step2_TipoEmpresa({ formData, handleChange }) {
  return (
    <FormSection title="Tipo de Empresa" subtitle="Natureza jurídica e estrutura" icon={FileText}>
      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700">Tipo de Empresa *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { value: 'LTDA', label: 'LTDA', desc: 'Sociedade Limitada' },
              { value: 'SA', label: 'S.A.', desc: 'Sociedade Anônima' },
              { value: 'EIRELI', label: 'EIRELI', desc: 'Empresa Individual' },
              { value: 'MEI', label: 'MEI', desc: 'Microempreendedor' },
              { value: 'SLU', label: 'SLU', desc: 'Sociedade Limitada Unipessoal' },
              { value: 'Outro', label: 'Outro', desc: 'Outra natureza jurídica' },
            ].map(opt => (
              <SelectionButton
                key={opt.value}
                selected={formData.tipoEmpresa === opt.value}
                onClick={() => handleChange('tipoEmpresa', opt.value)}
              >
                <div className="text-center">
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-xs opacity-70 mt-1">{opt.desc}</div>
                </div>
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700">Quantidade de Colaboradores *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '1-5', label: '1 a 5' },
              { value: '6-10', label: '6 a 10' },
              { value: '11-50', label: '11 a 50' },
              { value: '50+', label: '50+' },
            ].map(opt => (
              <SelectionButton
                key={opt.value}
                selected={formData.qtdColaboradores === opt.value}
                onClick={() => handleChange('qtdColaboradores', opt.value)}
              >
                {opt.label}
              </SelectionButton>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
}