import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { BarChart3 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step3_VolumetriaClientes({ formData, handleChange }) {
  return (
    <FormSection title="Volumetria e Clientes" subtitle="Perfil financeiro e público" icon={BarChart3}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Volume Estimado/Mês *</Label>
            <Input 
              className="h-9 text-xs"
              placeholder="R$ 0,00" 
              value={formData.volumeMensalEstimado || ''} 
              onChange={(e) => handleChange('volumeMensalEstimado', e.target.value)} 
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold">Ticket Médio *</Label>
            <Input 
              className="h-9 text-xs"
              placeholder="R$ 0,00" 
              value={formData.ticketMedio || ''} 
              onChange={(e) => handleChange('ticketMedio', e.target.value)} 
            />
          </div>
          <div className="col-span-2 space-y-1">
            <Label className="text-xs font-semibold">Qtd Transações/Mês *</Label>
            <Input 
              className="h-9 text-xs"
              type="number"
              placeholder="Ex: 1000" 
              value={formData.qtdTransacoesMensal || ''} 
              onChange={(e) => handleChange('qtdTransacoesMensal', e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Tipo de Clientes *</Label>
          <div className="flex gap-2">
            {['Pessoa Física (B2C)', 'Pessoa Jurídica (B2B)', 'Ambos'].map(opt => (
              <SelectionButton
                key={opt}
                className="flex-1 py-1.5 text-[10px] h-8 px-1"
                selected={formData.tipoClientes === opt}
                onClick={() => handleChange('tipoClientes', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Principais Clientes</Label>
          <Textarea 
            className="min-h-[40px] text-xs resize-none"
            placeholder="Liste os principais clientes (opcional)" 
            value={formData.principaisClientes || ''} 
            onChange={(e) => handleChange('principaisClientes', e.target.value)} 
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Proporção Clientes Internacionais *</Label>
          <div className="grid grid-cols-4 gap-2">
            {['0%', '1-25%', '26-50%', '50%+'].map(opt => (
              <SelectionButton
                key={opt}
                className="py-1.5 text-[10px] h-8 px-1"
                selected={formData.proporcaoInternacional === opt}
                onClick={() => handleChange('proporcaoInternacional', opt)}
              >
                {opt}
              </SelectionButton>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
}