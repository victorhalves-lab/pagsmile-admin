import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from '@/components/compliance/FormSection';
import { Store } from 'lucide-react';

const gatilhos = ['Aumento abrupto de volume', 'Aumento de reembolso', 'Reclamações/reputação', 'Produto fora da categoria', 'Mudança de titularidade', 'Outro gatilho'];

export default function Section10Marketplace({ formData, handleChange }) {
  // Esta seção só aparece se possuiSubvendedores === 'sim'
  if (formData.possuiSubvendedores !== 'sim') return null;

  return (
    <FormSection title="10. Marketplace e Sub-vendedores" subtitle="Processo de onboarding e gestão dos sub-vendedores" icon={Store}>
      <div className="space-y-6">
        {/* MKT1. Onboarding do Sub-vendedor */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">MKT1. Onboarding do Sub-vendedor</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: 'mktKYCInterno', label: 'Realiza KYC/KYB do sub-vendedor internamente?' },
              { id: 'mktKYCTerceiro', label: 'Um terceiro realiza KYC/KYB?' },
              { id: 'mktColetaCNPJ', label: 'Coleta CNPJ/CPF do sub-vendedor?' },
              { id: 'mktColetaContrato', label: 'Coleta contrato social/alterações?' },
              { id: 'mktColetaEndereco', label: 'Coleta endereço?' },
              { id: 'mktValidaCNAE', label: 'Valida atividade/CNAE?' },
              { id: 'mktColetaRepresentante', label: 'Coleta representante legal?' },
              { id: 'mktColetaUBO', label: 'Coleta UBO?' },
              { id: 'mktValidaConta', label: 'Valida conta bancária de liquidação?' },
            ].map(item => (
              <div key={item.id} className="space-y-2">
                <Label className="text-sm">{item.label}</Label>
                <RadioGroup value={formData[item.id] || ''} onValueChange={(v) => handleChange(item.id, v)} className="flex gap-4">
                  <div className="flex items-center space-x-1"><RadioGroupItem value="sim" id={`${item.id}-sim`} /><Label htmlFor={`${item.id}-sim`} className="text-xs font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-1"><RadioGroupItem value="nao" id={`${item.id}-nao`} /><Label htmlFor={`${item.id}-nao`} className="text-xs font-normal">Não</Label></div>
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <Label>Existe controle por categoria (whitelist/blacklist)? *</Label>
            <RadioGroup value={formData.mktControleCategoria || ''} onValueChange={(v) => handleChange('mktControleCategoria', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="mkt-cat-sim" /><Label htmlFor="mkt-cat-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="mkt-cat-nao" /><Label htmlFor="mkt-cat-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.mktControleCategoria === 'sim' && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-300">
              <Label>Como define categorias permitidas?</Label>
              <Textarea placeholder="Descreva..." value={formData.mktComoDefineCategoria || ''} onChange={(e) => handleChange('mktComoDefineCategoria', e.target.value)} rows={2} />
            </div>
          )}
        </div>

        {/* MKT2. Contrato e Governança */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">MKT2. Contrato e Governança</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'mktContratoTermos', label: 'Existe contrato/termos com sub-vendedor?' },
              { id: 'mktExportaBase', label: 'Consegue exportar base mensal?' },
              { id: 'mktPoliticaSuspensao', label: 'Existe política de suspensão/encerramento?' },
            ].map(item => (
              <div key={item.id} className="space-y-2">
                <Label className="text-sm">{item.label}</Label>
                <RadioGroup value={formData[item.id] || ''} onValueChange={(v) => handleChange(item.id, v)} className="flex gap-4">
                  <div className="flex items-center space-x-1"><RadioGroupItem value="sim" id={`${item.id}-sim`} /><Label htmlFor={`${item.id}-sim`} className="text-xs font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-1"><RadioGroupItem value="nao" id={`${item.id}-nao`} /><Label htmlFor={`${item.id}-nao`} className="text-xs font-normal">Não</Label></div>
                </RadioGroup>
              </div>
            ))}
          </div>
        </div>

        {/* MKT3. Revisão e Gatilhos */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">MKT3. Revisão e Gatilhos</h4>
          <div className="space-y-3">
            <Label>Possui gatilhos para revisão/bloqueio? *</Label>
            <RadioGroup value={formData.mktGatilhos || ''} onValueChange={(v) => handleChange('mktGatilhos', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="mkt-gat-sim" /><Label htmlFor="mkt-gat-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="mkt-gat-nao" /><Label htmlFor="mkt-gat-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.mktGatilhos === 'sim' && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-300">
              <Label>Quais gatilhos são monitorados?</Label>
              <div className="grid grid-cols-2 gap-2">
                {gatilhos.map(g => (
                  <div key={g} className="flex items-center space-x-2">
                    <Checkbox id={`gat-${g}`} checked={(formData.gatilhosMonitorados || []).includes(g)} onCheckedChange={(checked) => {
                      const current = formData.gatilhosMonitorados || [];
                      if (checked) handleChange('gatilhosMonitorados', [...current, g]);
                      else handleChange('gatilhosMonitorados', current.filter(x => x !== g));
                    }} />
                    <Label htmlFor={`gat-${g}`} className="text-sm font-normal">{g}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            <Label>Limita quantidade de sub-vendedores/mês? *</Label>
            <RadioGroup value={formData.mktLimitaSubvendedores || ''} onValueChange={(v) => handleChange('mktLimitaSubvendedores', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="mkt-lim-sim" /><Label htmlFor="mkt-lim-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="mkt-lim-nao" /><Label htmlFor="mkt-lim-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.mktLimitaSubvendedores === 'sim' && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-300">
              <Label>Qual limite?</Label>
              <Input type="number" placeholder="Número máximo" value={formData.mktLimiteSubvendedores || ''} onChange={(e) => handleChange('mktLimiteSubvendedores', e.target.value)} />
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}