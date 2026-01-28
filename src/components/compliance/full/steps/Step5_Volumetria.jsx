import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormSection from '@/components/compliance/FormSection';
import { BarChart3 } from 'lucide-react';

export default function Step5_Volumetria({ formData, handleChange }) {
  const volumeMovimentado = parseFloat(formData.valorMovimentadoMes) || 0;
  const ticketMedio = parseFloat(formData.ticketMedio) || 0;
  const volumeTransacoes = ticketMedio > 0 ? Math.round(volumeMovimentado / ticketMedio) : 0;

  return (
    <FormSection title="Volumetria" subtitle="Estimativas financeiras" icon={BarChart3}>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Estimativa de Valor Movimentado/Mês (R$) *</Label>
          <Input 
            className="h-9"
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={formData.valorMovimentadoMes || ''} 
            onChange={(e) => handleChange('valorMovimentadoMes', e.target.value)} 
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Ticket Médio das Transações (R$) *</Label>
          <Input 
            className="h-9"
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={formData.ticketMedio || ''} 
            onChange={(e) => handleChange('ticketMedio', e.target.value)} 
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-slate-500">Volume de Transações/Mês (calculado)</Label>
          <Input 
            className="h-9 bg-slate-50"
            type="number" 
            value={volumeTransacoes} 
            disabled 
            readOnly
          />
          <p className="text-[10px] text-gray-400 mt-1">Calculado: Valor Movimentado ÷ Ticket Médio</p>
        </div>
      </div>
    </FormSection>
  );
}