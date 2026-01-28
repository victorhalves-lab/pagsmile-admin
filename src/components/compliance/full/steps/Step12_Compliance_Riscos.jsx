import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FormSection from '@/components/compliance/FormSection';
import { Shield } from 'lucide-react';

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
            <Label className="text-xs font-medium leading-tight block">{p.label}</Label>
            <RadioGroup value={formData[p.id] || ''} onValueChange={(v) => handleChange(p.id, v)} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id={`${p.id}-sim`} /><Label htmlFor={`${p.id}-sim`} className="font-normal text-xs">Sim</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id={`${p.id}-nao`} /><Label htmlFor={`${p.id}-nao`} className="font-normal text-xs">Não</Label></div>
            </RadioGroup>
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