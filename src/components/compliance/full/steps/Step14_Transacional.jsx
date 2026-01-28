import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FormSection from '@/components/compliance/FormSection';
import { TrendingUp } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Step14_Transacional({ formData, handleChange }) {
  return (
    <FormSection title="Perfil Transacional" subtitle="Métricas e reembolso" icon={TrendingUp}>
      <div className="space-y-4">
        
        {/* Perfil */}
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
           <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">Perfil da Operação</h4>
           <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold">Modelo de Negócio</Label>
                <Select value={formData.transModeloNegocio} onValueChange={(v) => handleChange('transModeloNegocio', v)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketplace">Marketplace</SelectItem>
                    <SelectItem value="ecommerce">E-commerce Próprio</SelectItem>
                    <SelectItem value="saas">SaaS / Assinatura</SelectItem>
                    <SelectItem value="servicos">Serviços</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] font-semibold">Tipo de Produto</Label>
                <div className="flex gap-1">
                   <SelectionButton className="flex-1 py-1 h-8 text-[10px]" selected={formData.transTipoProduto === 'fisico'} onClick={() => handleChange('transTipoProduto', 'fisico')}>Físico</SelectionButton>
                   <SelectionButton className="flex-1 py-1 h-8 text-[10px]" selected={formData.transTipoProduto === 'digital'} onClick={() => handleChange('transTipoProduto', 'digital')}>Digital</SelectionButton>
                </div>
              </div>
           </div>
        </div>

        {/* Métricas */}
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
           <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">Métricas Estimadas</h4>
           <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label className="text-[10px] font-semibold">Média Transações/Mês</Label><Input className="h-8 text-xs" type="number" value={formData.transMediaMensal || ''} onChange={(e) => handleChange('transMediaMensal', e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-semibold">% Recorrência</Label><Input className="h-8 text-xs" type="number" placeholder="%" value={formData.transRecorrencia || ''} onChange={(e) => handleChange('transRecorrencia', e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-semibold">% Fraude Histórica</Label><Input className="h-8 text-xs" type="number" placeholder="%" value={formData.transFraudeHistorica || ''} onChange={(e) => handleChange('transFraudeHistorica', e.target.value)} /></div>
              <div className="space-y-1"><Label className="text-[10px] font-semibold">% Chargeback</Label><Input className="h-8 text-xs" type="number" placeholder="%" value={formData.transChargeback || ''} onChange={(e) => handleChange('transChargeback', e.target.value)} /></div>
           </div>
        </div>

        {/* Reembolso */}
        <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
           <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">Política de Reembolso</h4>
           <div className="space-y-2">
              <div className="flex items-center justify-between">
                 <Label className="text-[10px] font-semibold">Possui política pública?</Label>
                 <div className="flex gap-1 w-24">
                   <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.transPoliticaReembolso === 'sim'} onClick={() => handleChange('transPoliticaReembolso', 'sim')}>Sim</SelectionButton>
                   <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.transPoliticaReembolso === 'nao'} onClick={() => handleChange('transPoliticaReembolso', 'nao')}>Não</SelectionButton>
                 </div>
              </div>
              {formData.transPoliticaReembolso === 'sim' && (
                 <Input className="h-8 text-xs" placeholder="Link da política" value={formData.transLinkReembolso || ''} onChange={(e) => handleChange('transLinkReembolso', e.target.value)} />
              )}
              <div className="flex items-center justify-between">
                 <Label className="text-[10px] font-semibold">Aceita reembolso parcial?</Label>
                 <div className="flex gap-1 w-24">
                   <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.transReembolsoParcial === 'sim'} onClick={() => handleChange('transReembolsoParcial', 'sim')}>Sim</SelectionButton>
                   <SelectionButton className="flex-1 py-1 h-6 text-[10px]" selected={formData.transReembolsoParcial === 'nao'} onClick={() => handleChange('transReembolsoParcial', 'nao')}>Não</SelectionButton>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </FormSection>
  );
}