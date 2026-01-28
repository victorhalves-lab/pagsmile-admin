import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import FormSection from '@/components/compliance/FormSection';
import { FileCheck } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

const alertas = ['Volume alto', 'Frequência', 'Horários', 'Geografia', 'Fracionamento', 'Outro'];

export default function Step16_PLD_Monitoramento({ formData, handleChange }) {
  return (
    <FormSection title="PLD/FT - Monitoramento" subtitle="Análise de transações" icon={FileCheck}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Possui sistema de monitoramento? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.sistemaMonitoramento === 'sim'}
                onClick={() => handleChange('sistemaMonitoramento', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.sistemaMonitoramento === 'nao'}
                onClick={() => handleChange('sistemaMonitoramento', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>

        {formData.sistemaMonitoramento === 'sim' && (
          <>
            <div className="space-y-2">
              <Label className="text-xs font-semibold mb-2 block">É automatizado?</Label>
              <div className="flex gap-2">
                  <SelectionButton
                    className="flex-1 py-1 px-3 text-xs h-8"
                    selected={formData.monitoramentoAutomatizado === 'sim'}
                    onClick={() => handleChange('monitoramentoAutomatizado', 'sim')}
                  >
                    Sim
                  </SelectionButton>
                  <SelectionButton
                    className="flex-1 py-1 px-3 text-xs h-8"
                    selected={formData.monitoramentoAutomatizado === 'nao'}
                    onClick={() => handleChange('monitoramentoAutomatizado', 'nao')}
                  >
                    Não
                  </SelectionButton>
              </div>
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