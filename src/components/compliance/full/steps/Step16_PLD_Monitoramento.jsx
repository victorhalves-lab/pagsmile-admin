import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';

const alertas = ['Volume alto', 'Frequência', 'Horários', 'Geografia', 'Fracionamento', 'Outro'];

export default function Step16_PLD_Monitoramento({ formData, handleChange }) {
  return (
    <FormSection title="PLD/FT - Monitoramento" subtitle="Análise de transações" icon={FileCheck}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Possui sistema de monitoramento? *</Label>
          <RadioGroup value={formData.sistemaMonitoramento || ''} onValueChange={(v) => handleChange('sistemaMonitoramento', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="mon-sim" /><Label htmlFor="mon-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="mon-nao" /><Label htmlFor="mon-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>

        {formData.sistemaMonitoramento === 'sim' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">É automatizado?</Label>
              <RadioGroup value={formData.monitoramentoAutomatizado || ''} onValueChange={(v) => handleChange('monitoramentoAutomatizado', v)} className="flex gap-4">
                <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="auto-sim" /><Label htmlFor="auto-sim" className="font-normal text-xs">Sim</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="auto-nao" /><Label htmlFor="auto-nao" className="font-normal text-xs">Não</Label></div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Alertas monitorados:</Label>
              <div className="grid grid-cols-2 gap-2">
                {alertas.map(alerta => (
                  <div key={alerta} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`alerta-${alerta}`} 
                      checked={(formData.alertasMonitorados || []).includes(alerta)} 
                      onCheckedChange={(checked) => {
                        const current = formData.alertasMonitorados || [];
                        if (checked) handleChange('alertasMonitorados', [...current, alerta]);
                        else handleChange('alertasMonitorados', current.filter(a => a !== alerta));
                      }} 
                    />
                    <Label htmlFor={`alerta-${alerta}`} className="text-xs font-normal cursor-pointer">{alerta}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </FormSection>
  );
}