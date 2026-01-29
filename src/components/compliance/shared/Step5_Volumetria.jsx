import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { TrendingUp } from 'lucide-react';

export default function Step5_Volumetria({ formData, handleChange }) {
  return (
    <FormSection title="Volumetria Financeira" subtitle="Estimativas de volume transacionado" icon={TrendingUp}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Volume Estimado por Mês *</Label>
            <Input 
              className="h-12 text-base"
              placeholder="R$ 0,00" 
              value={formData.volumeMensalEstimado || ''} 
              onChange={(e) => handleChange('volumeMensalEstimado', e.target.value)} 
            />
            <p className="text-xs text-slate-500">Valor total esperado de transações mensais</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Ticket Médio *</Label>
            <Input 
              className="h-12 text-base"
              placeholder="R$ 0,00" 
              value={formData.ticketMedio || ''} 
              onChange={(e) => handleChange('ticketMedio', e.target.value)} 
            />
            <p className="text-xs text-slate-500">Valor médio por transação</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Quantidade de Transações/Mês *</Label>
            <Input 
              className="h-12 text-base"
              type="number"
              placeholder="Ex: 1000" 
              value={formData.qtdTransacoesMensal || ''} 
              onChange={(e) => handleChange('qtdTransacoesMensal', e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">Faturamento Anual</Label>
            <Input 
              className="h-12 text-base"
              placeholder="R$ 0,00" 
              value={formData.faturamentoAnual || ''} 
              onChange={(e) => handleChange('faturamentoAnual', e.target.value)} 
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
}