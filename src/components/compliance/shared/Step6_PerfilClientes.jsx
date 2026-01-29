import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Users } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step6_PerfilClientes({ formData, handleChange }) {
  return (
    <FormSection title="Perfil dos Clientes" subtitle="Público-alvo e localização" icon={Users}>
      <div className="space-y-8">
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-slate-700">Tipo de Clientes *</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { value: 'Pessoa Física (B2C)', label: 'Pessoa Física', desc: 'Vende para consumidores finais' },
              { value: 'Pessoa Jurídica (B2B)', label: 'Pessoa Jurídica', desc: 'Vende para outras empresas' },
              { value: 'Ambos', label: 'Ambos', desc: 'Atende PF e PJ' },
            ].map(opt => (
              <SelectionButton
                key={opt.value}
                selected={formData.tipoClientes === opt.value}
                onClick={() => handleChange('tipoClientes', opt.value)}
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
          <Label className="text-sm font-semibold text-slate-700">Proporção de Clientes Internacionais *</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['0%', '1-25%', '26-50%', '50%+'].map(opt => (
              <SelectionButton
                key={opt}
                selected={formData.proporcaoInternacional === opt}
                onClick={() => handleChange('proporcaoInternacional', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-slate-700">Principais Clientes</Label>
          <Textarea 
            className="min-h-[100px] text-base resize-none"
            placeholder="Liste os principais clientes ou segmentos que atende (opcional)" 
            value={formData.principaisClientes || ''} 
            onChange={(e) => handleChange('principaisClientes', e.target.value)} 
          />
        </div>
      </div>
    </FormSection>
  );
}