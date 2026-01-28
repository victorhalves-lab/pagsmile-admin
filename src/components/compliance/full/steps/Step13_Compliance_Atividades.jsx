import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import FormSection from '@/components/compliance/FormSection';
import { Shield } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step13_Compliance_Atividades({ formData, handleChange }) {
  return (
    <FormSection title="Compliance - Parte 3" subtitle="Atividades Sensíveis" icon={Shield}>
      <div className="space-y-4">
        {[
          { id: 'comp6', label: 'Opera com criptomoedas/tokens? *' },
          { id: 'comp7', label: 'Jogos, apostas ou cassino? *', inputLabel: 'Nº Licença' },
          { id: 'comp9', label: 'Atividade de alto risco (nutra, viagens, etc)? *', inputLabel: 'Qual atividade?' },
          { id: 'comp11', label: 'Relacionamento com offshore/paraísos fiscais? *' }
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
              p.inputLabel ? (
                <Input 
                   placeholder={p.inputLabel}
                   value={formData[`${p.id}Detalhe`] || ''}
                   onChange={(e) => handleChange(`${p.id}Detalhe`, e.target.value)}
                   className="h-9 text-xs mt-1"
                />
              ) : (
                <Textarea 
                  placeholder="Especifique..." 
                  value={formData[`${p.id}Detalhe`] || ''} 
                  onChange={(e) => handleChange(`${p.id}Detalhe`, e.target.value)} 
                  className="h-16 text-xs mt-1"
                />
              )
            )}
          </div>
        ))}
      </div>
    </FormSection>
  );
}