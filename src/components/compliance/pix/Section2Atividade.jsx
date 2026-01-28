import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Briefcase } from 'lucide-react';

export default function Section2Atividade({ formData, handleChange }) {
  const volumeMovimentado = parseFloat(formData.valorMovimentadoMes) || 0;
  const ticketMedio = parseFloat(formData.ticketMedio) || 0;
  const volumeTransacoes = ticketMedio > 0 ? Math.round(volumeMovimentado / ticketMedio) : 0;

  return (
    <FormSection title="2. Atividade e Negócios" subtitle="Detalhes da operação" icon={Briefcase}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label>Escopo do Negócio *</Label>
          <Textarea 
            placeholder="Descreva a atividade principal da empresa..." 
            value={formData.escopoNegocio || ''} 
            onChange={(e) => handleChange('escopoNegocio', e.target.value)}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label>Estimativa de Valor Movimentado/Mês (R$) *</Label>
          <Input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={formData.valorMovimentadoMes || ''} 
            onChange={(e) => handleChange('valorMovimentadoMes', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Ticket Médio das Transações (R$) *</Label>
          <Input 
            type="number" 
            step="0.01"
            placeholder="0.00" 
            value={formData.ticketMedio || ''} 
            onChange={(e) => handleChange('ticketMedio', e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label>Volume de Transações/Mês (calculado) *</Label>
          <Input 
            type="number" 
            value={volumeTransacoes} 
            disabled 
            readOnly
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">Calculado: Valor Movimentado ÷ Ticket Médio</p>
        </div>
        <div className="space-y-2">
          <Label>Site Corporativo *</Label>
          <Input 
            type="url" 
            placeholder="https://" 
            value={formData.siteCorporativo || ''} 
            onChange={(e) => handleChange('siteCorporativo', e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>URL do Produto/Aplicativo de Integração</Label>
          <Input 
            type="url" 
            placeholder="https://" 
            value={formData.urlProdutoApp || ''} 
            onChange={(e) => handleChange('urlProdutoApp', e.target.value)} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Quais são seus 5 principais clientes (Empresas e Segmentos)? *</Label>
          <Textarea 
            placeholder="Ex: Cliente A (Varejo), Cliente B (Tecnologia), Cliente C (Financeiro)..." 
            value={formData.principaisClientes || ''} 
            onChange={(e) => handleChange('principaisClientes', e.target.value)}
            rows={3}
          />
        </div>
      </div>
    </FormSection>
  );
}