import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import FormSection from '@/components/compliance/FormSection';
import { Store } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const gatilhos = ['Aumento volume', 'Aumento reembolso', 'Reclamações', 'Prod. fora categoria', 'Mudança titularidade', 'Outro'];

export default function Section10Marketplace({ formData, handleChange }) {
  return (
    <FormSection title="Marketplace e Sub-vendedores" subtitle="Processo de onboarding e gestão" icon={Store}>
      <div className="space-y-4">
        
        {/* Visibility Toggle */}
        <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 space-y-2">
             <Label className="text-xs text-blue-900 font-semibold mb-1 block">Sua empresa possui sub-vendedores ou opera como Marketplace?</Label>
             <div className="flex gap-2">
                <SelectionButton 
                    className="flex-1 py-1.5 text-xs h-8" 
                    selected={formData.possuiSubvendedores === 'sim'} 
                    onClick={() => handleChange('possuiSubvendedores', 'sim')}
                >
                    Sim
                </SelectionButton>
                <SelectionButton 
                    className="flex-1 py-1.5 text-xs h-8" 
                    selected={formData.possuiSubvendedores === 'nao'} 
                    onClick={() => handleChange('possuiSubvendedores', 'nao')}
                >
                    Não
                </SelectionButton>
             </div>
        </div>

        {formData.possuiSubvendedores === 'sim' && (
            <>
                {/* MKT1. Onboarding do Sub-vendedor */}
                <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
                <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">MKT1. Onboarding</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                    { id: 'mktKYCInterno', label: 'Realiza KYC/KYB interno?' },
                    { id: 'mktKYCTerceiro', label: 'Terceiro realiza KYC/KYB?' },
                    { id: 'mktColetaCNPJ', label: 'Coleta CNPJ/CPF?' },
                    { id: 'mktColetaContrato', label: 'Coleta contrato social?' },
                    { id: 'mktColetaEndereco', label: 'Coleta endereço?' },
                    { id: 'mktValidaCNAE', label: 'Valida CNAE?' },
                    { id: 'mktColetaRepresentante', label: 'Coleta representante?' },
                    { id: 'mktColetaUBO', label: 'Coleta UBO?' },
                    { id: 'mktValidaConta', label: 'Valida conta bancária?' },
                    ].map(item => (
                    <div key={item.id} className="space-y-1">
                        <Label className="text-[10px] text-gray-600 font-semibold uppercase">{item.label}</Label>
                        <div className="flex gap-2">
                            <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData[item.id] === 'sim'} onClick={() => handleChange(item.id, 'sim')}>Sim</SelectionButton>
                            <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData[item.id] === 'nao'} onClick={() => handleChange(item.id, 'nao')}>Não</SelectionButton>
                        </div>
                    </div>
                    ))}
                </div>
                
                <div className="space-y-2 pt-2 border-t border-slate-200">
                    <Label className="text-xs font-semibold">Controle por categoria (whitelist/blacklist)? *</Label>
                    <div className="flex gap-2 max-w-xs">
                        <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData.mktControleCategoria === 'sim'} onClick={() => handleChange('mktControleCategoria', 'sim')}>Sim</SelectionButton>
                        <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData.mktControleCategoria === 'nao'} onClick={() => handleChange('mktControleCategoria', 'nao')}>Não</SelectionButton>
                    </div>
                    {formData.mktControleCategoria === 'sim' && (
                        <Textarea className="min-h-[40px] text-xs mt-2" placeholder="Como define categorias?" value={formData.mktComoDefineCategoria || ''} onChange={(e) => handleChange('mktComoDefineCategoria', e.target.value)} />
                    )}
                </div>
                </div>

                {/* MKT2. Contrato e Governança */}
                <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
                <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">MKT2. Contrato/Gov</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                    { id: 'mktContratoTermos', label: 'Contrato com sub-vendedor?' },
                    { id: 'mktExportaBase', label: 'Exporta base mensal?' },
                    { id: 'mktPoliticaSuspensao', label: 'Política de suspensão?' },
                    ].map(item => (
                    <div key={item.id} className="space-y-1">
                        <Label className="text-[10px] text-gray-600 font-semibold uppercase">{item.label}</Label>
                        <div className="flex gap-2">
                            <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData[item.id] === 'sim'} onClick={() => handleChange(item.id, 'sim')}>Sim</SelectionButton>
                            <SelectionButton className="flex-1 py-1 text-[10px] h-6 px-1" selected={formData[item.id] === 'nao'} onClick={() => handleChange(item.id, 'nao')}>Não</SelectionButton>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* MKT3. Revisão e Gatilhos */}
                <div className="p-3 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
                <h4 className="font-medium text-gray-800 text-xs uppercase tracking-wider">MKT3. Monitoramento</h4>
                <div className="space-y-2">
                    <Label className="text-xs font-semibold">Gatilhos para revisão/bloqueio? *</Label>
                    <div className="flex gap-2 max-w-xs">
                        <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData.mktGatilhos === 'sim'} onClick={() => handleChange('mktGatilhos', 'sim')}>Sim</SelectionButton>
                        <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData.mktGatilhos === 'nao'} onClick={() => handleChange('mktGatilhos', 'nao')}>Não</SelectionButton>
                    </div>
                    {formData.mktGatilhos === 'sim' && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                            {gatilhos.map(g => {
                                const isSelected = (formData.gatilhosMonitorados || []).includes(g);
                                return (
                                    <SelectionButton 
                                        key={g}
                                        className="py-1 text-[10px] h-auto min-h-[28px] px-1"
                                        selected={isSelected}
                                        onClick={() => {
                                            const current = formData.gatilhosMonitorados || [];
                                            if (isSelected) handleChange('gatilhosMonitorados', current.filter(x => x !== g));
                                            else handleChange('gatilhosMonitorados', [...current, g]);
                                        }}
                                    >
                                        {g}
                                    </SelectionButton>
                                );
                            })}
                        </div>
                    )}
                </div>
                
                <div className="space-y-2 pt-2 border-t border-slate-200">
                    <Label className="text-xs font-semibold">Limita qtd de sub-vendedores/mês? *</Label>
                    <div className="flex gap-2 items-center">
                        <div className="flex gap-2 flex-1 max-w-xs">
                            <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData.mktLimitaSubvendedores === 'sim'} onClick={() => handleChange('mktLimitaSubvendedores', 'sim')}>Sim</SelectionButton>
                            <SelectionButton className="flex-1 py-1 h-7 text-xs" selected={formData.mktLimitaSubvendedores === 'nao'} onClick={() => handleChange('mktLimitaSubvendedores', 'nao')}>Não</SelectionButton>
                        </div>
                        {formData.mktLimitaSubvendedores === 'sim' && (
                            <Input className="w-24 h-7 text-xs" type="number" placeholder="Qtd Máx" value={formData.mktLimiteSubvendedores || ''} onChange={(e) => handleChange('mktLimiteSubvendedores', e.target.value)} />
                        )}
                    </div>
                </div>
                </div>
            </>
        )}
      </div>
    </FormSection>
  );
}