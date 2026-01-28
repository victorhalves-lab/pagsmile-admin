import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FormSection from '@/components/compliance/FormSection';
import { Shield } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step12_Compliance_Riscos({ formData, handleChange }) {
  return (
    <FormSection title="Compliance - Parte 2" subtitle="Histórico e Riscos" icon={Shield}>
      <div className="space-y-4">
        {[
          { id: 'comp4', label: 'Investigação criminal nos últimos 12 meses? *' },
          { id: 'comp5', label: 'Contas encerradas por compliance (12 meses)? *' },
          { id: 'comp10', label: 'Algum UBO/Diretor é PEP? *' }
        ].map((p) => (
          <div key={p.id} className="space-y-2 pb-2 border-b border-slate-100 last:border-0">
            <Label className="text-xs font-medium leading-tight block mb-2">{p.label}</Label>
            <div className="flex gap-2 mb-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData[p.id] === 'sim'}
                onClick={() => handleChange(p.id, 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData[p.id] === 'nao'}
                onClick={() => handleChange(p.id, 'nao')}
              >
                Não
              </SelectionButton>
            </div>
            {formData[p.id] === 'sim' && (
              <Textarea 
                placeholder="Especifique..." 
                value={formData[`${p.id}Detalhe`] || ''} 
                onChange={(e) => handleChange(`${p.id}Detalhe`, e.target.value)} 
                className="h-16 text-xs mt-1"
              />
            )}
          </div>
        ))}
      </div>
    </FormSection>
  );
}