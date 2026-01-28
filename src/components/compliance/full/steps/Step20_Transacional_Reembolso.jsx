import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import FormSection from '@/components/compliance/FormSection';
import { RefreshCcw } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Step20_Transacional_Reembolso({ formData, handleChange }) {
  return (
    <FormSection title="Reembolsos" subtitle="Políticas de cancelamento" icon={RefreshCcw}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Taxa de reembolso (3 meses) *</Label>
          <Select value={formData.taxaReembolso || ''} onValueChange={(v) => handleChange('taxaReembolso', v)}>
            <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="menos1">Menos de 1%</SelectItem>
              <SelectItem value="1-3">1% a 3%</SelectItem>
              <SelectItem value="mais3">Mais de 3%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Permite reembolso parcial? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.reembolsoParcial === 'sim'}
                onClick={() => handleChange('reembolsoParcial', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.reembolsoParcial === 'nao'}
                onClick={() => handleChange('reembolsoParcial', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold mb-2 block">Política pública? *</Label>
          <div className="flex gap-2">
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.politicaReembolsoPublica === 'sim'}
                onClick={() => handleChange('politicaReembolsoPublica', 'sim')}
              >
                Sim
              </SelectionButton>
              <SelectionButton
                className="flex-1 py-1 px-3 text-xs h-8"
                selected={formData.politicaReembolsoPublica === 'nao'}
                onClick={() => handleChange('politicaReembolsoPublica', 'nao')}
              >
                Não
              </SelectionButton>
          </div>
        </div>
        
        {formData.politicaReembolsoPublica === 'sim' && (
           <div className="space-y-1">
             <Label className="text-xs font-semibold">Link da Política</Label>
             <Input className="h-9 text-xs" placeholder="https://" value={formData.linkPoliticaReembolso || ''} onChange={(e) => handleChange('linkPoliticaReembolso', e.target.value)} />
           </div>
        )}
      </div>
    </FormSection>
  );
}