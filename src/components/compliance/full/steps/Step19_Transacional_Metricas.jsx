import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { BarChart3 } from 'lucide-react';

export default function Step19_Transacional_Metricas({ formData, handleChange }) {
  return (
    <FormSection title="Métricas Transacionais" subtitle="Volumetria esperada" icon={BarChart3}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Volume mensal estimado (R$) *</Label>
          <Select value={formData.volumeMensalFaixa || ''} onValueChange={(v) => handleChange('volumeMensalFaixa', v)}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ate10k">Até 10k</SelectItem>
              <SelectItem value="10k-50k">10k - 50k</SelectItem>
              <SelectItem value="50k-100k">50k - 100k</SelectItem>
              <SelectItem value="mais100k">+100k</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Qtd transações/mês *</Label>
          <Select value={formData.qtdTransacoesMes || ''} onValueChange={(v) => handleChange('qtdTransacoesMes', v)}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ate100">Até 100</SelectItem>
              <SelectItem value="101-500">101 - 500</SelectItem>
              <SelectItem value="mais500">+500</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Ticket médio (R$) *</Label>
          <Select value={formData.ticketMedioFaixa || ''} onValueChange={(v) => handleChange('ticketMedioFaixa', v)}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ate50">Até 50</SelectItem>
              <SelectItem value="51-100">51 - 100</SelectItem>
              <SelectItem value="mais100">+100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FormSection>
  );
}