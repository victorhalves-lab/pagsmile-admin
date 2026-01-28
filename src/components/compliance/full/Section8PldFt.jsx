import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';

const escoposKYC = ['Documento de identidade', 'Comprovante de endereço', 'Comprovante de renda', 'CNPJ/Contrato Social', 'Referências comerciais', 'Consulta a bureau', 'Outro'];
const alertasMonitoramento = ['Volume alto', 'Frequência anormal', 'Horários atípicos', 'Padrões geográficos', 'Fracionamento', 'Comportamento cliente novo', 'Outro'];

export default function Section8PldFt({ formData, handleChange }) {
  return (
    <FormSection title="8. Prevenção à Lavagem de Dinheiro (PLD/FT)" subtitle="Políticas e controles internos" icon={FileCheck}>
      <div className="space-y-6">
        {/* 8A. Políticas e Procedimentos */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">8A. Políticas e Procedimentos</h4>
          <div className="space-y-3">
            <Label>A empresa possui Política de PLD/FT documentada? *</Label>
            <RadioGroup value={formData.possuiPoliticaPLD || ''} onValueChange={(v) => handleChange('possuiPoliticaPLD', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pld-pol-sim" /><Label htmlFor="pld-pol-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pld-pol-nao" /><Label htmlFor="pld-pol-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.possuiPoliticaPLD === 'sim' && (
            <div className="space-y-3 pl-4 border-l-2 border-gray-300">
              <Label>A política foi revisada/atualizada nos últimos 12 meses?</Label>
              <RadioGroup value={formData.politicaRevisada || ''} onValueChange={(v) => handleChange('politicaRevisada', v)} className="flex gap-6">
                <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pld-rev-sim" /><Label htmlFor="pld-rev-sim" className="font-normal">Sim</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pld-rev-nao" /><Label htmlFor="pld-rev-nao" className="font-normal">Não</Label></div>
              </RadioGroup>
            </div>
          )}
          <div className="space-y-3">
            <Label>Existe programa formal de treinamento em PLD/FT? *</Label>
            <RadioGroup value={formData.treinamentoPLD || ''} onValueChange={(v) => handleChange('treinamentoPLD', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pld-tre-sim" /><Label htmlFor="pld-tre-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pld-tre-nao" /><Label htmlFor="pld-tre-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.treinamentoPLD === 'sim' && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-300">
              <Label>Frequência do treinamento</Label>
              <Select value={formData.frequenciaTreinamento || ''} onValueChange={(v) => handleChange('frequenciaTreinamento', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="anual">Anual</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                  <SelectItem value="trimestral">Trimestral</SelectItem>
                  <SelectItem value="admissao">Apenas na admissão</SelectItem>
                  <SelectItem value="demanda">Sob demanda</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* 8B. Controles KYC */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">8B. Controles KYC</h4>
          <div className="space-y-3">
            <Label>A empresa realiza KYC/KYB de seus próprios clientes? *</Label>
            <RadioGroup value={formData.realizaKYC || ''} onValueChange={(v) => handleChange('realizaKYC', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="kyc-sim" /><Label htmlFor="kyc-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="kyc-nao" /><Label htmlFor="kyc-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.realizaKYC === 'sim' && (
            <div className="space-y-2 pl-4 border-l-2 border-gray-300">
              <Label>Qual o escopo da verificação?</Label>
              <div className="grid grid-cols-2 gap-2">
                {escoposKYC.map(escopo => (
                  <div key={escopo} className="flex items-center space-x-2">
                    <Checkbox id={`kyc-${escopo}`} checked={(formData.escoposKYC || []).includes(escopo)} onCheckedChange={(checked) => {
                      const current = formData.escoposKYC || [];
                      if (checked) handleChange('escoposKYC', [...current, escopo]);
                      else handleChange('escoposKYC', current.filter(e => e !== escopo));
                    }} />
                    <Label htmlFor={`kyc-${escopo}`} className="text-sm font-normal">{escopo}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-3">
            <Label>Realiza verificação de listas de sanções? *</Label>
            <RadioGroup value={formData.verificaSancoes || ''} onValueChange={(v) => handleChange('verificaSancoes', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="san-sim" /><Label htmlFor="san-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="san-nao" /><Label htmlFor="san-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label>Realiza verificação de PEP? *</Label>
            <RadioGroup value={formData.verificaPEP || ''} onValueChange={(v) => handleChange('verificaPEP', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pep-v-sim" /><Label htmlFor="pep-v-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pep-v-nao" /><Label htmlFor="pep-v-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
        </div>

        {/* 8C. Monitoramento de Transações */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">8C. Monitoramento de Transações</h4>
          <div className="space-y-3">
            <Label>Possui sistema de monitoramento de transações? *</Label>
            <RadioGroup value={formData.sistemaMonitoramento || ''} onValueChange={(v) => handleChange('sistemaMonitoramento', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="mon-sim" /><Label htmlFor="mon-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="mon-nao" /><Label htmlFor="mon-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          {formData.sistemaMonitoramento === 'sim' && (
            <>
              <div className="space-y-3 pl-4 border-l-2 border-gray-300">
                <Label>O monitoramento é automatizado?</Label>
                <RadioGroup value={formData.monitoramentoAutomatizado || ''} onValueChange={(v) => handleChange('monitoramentoAutomatizado', v)} className="flex gap-6">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="mon-auto-sim" /><Label htmlFor="mon-auto-sim" className="font-normal">Sim</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="mon-auto-nao" /><Label htmlFor="mon-auto-nao" className="font-normal">Não</Label></div>
                </RadioGroup>
              </div>
              <div className="space-y-2 pl-4 border-l-2 border-gray-300">
                <Label>Quais alertas são monitorados?</Label>
                <div className="grid grid-cols-2 gap-2">
                  {alertasMonitoramento.map(alerta => (
                    <div key={alerta} className="flex items-center space-x-2">
                      <Checkbox id={`alerta-${alerta}`} checked={(formData.alertasMonitorados || []).includes(alerta)} onCheckedChange={(checked) => {
                        const current = formData.alertasMonitorados || [];
                        if (checked) handleChange('alertasMonitorados', [...current, alerta]);
                        else handleChange('alertasMonitorados', current.filter(a => a !== alerta));
                      }} />
                      <Label htmlFor={`alerta-${alerta}`} className="text-sm font-normal">{alerta}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* 8D. Governança */}
        <div className="p-4 bg-slate-50 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-800">8D. Governança</h4>
          <div className="space-y-3">
            <Label>Existe área/pessoa dedicada a Compliance? *</Label>
            <RadioGroup value={formData.areaDedicadaCompliance || ''} onValueChange={(v) => handleChange('areaDedicadaCompliance', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="area-sim" /><Label htmlFor="area-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="area-nao" /><Label htmlFor="area-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-3">
            <Label>Realiza auditorias internas de PLD? *</Label>
            <RadioGroup value={formData.auditoriasInternas || ''} onValueChange={(v) => handleChange('auditoriasInternas', v)} className="flex gap-6">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="aud-sim" /><Label htmlFor="aud-sim" className="font-normal">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="aud-nao" /><Label htmlFor="aud-nao" className="font-normal">Não</Label></div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </FormSection>
  );
}