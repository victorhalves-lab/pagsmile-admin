import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import FormSection from '@/components/compliance/FormSection';
import { RefreshCcw } from 'lucide-react';

export default function Step20_Transacional_Reembolso({ formData, handleChange }) {
  return (
    <FormSection title="Reembolsos" subtitle="Políticas de cancelamento" icon={RefreshCcw}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Taxa de reembolso (últimos 3 meses) *</Label>
          <Select value={formData.taxaReembolso || ''} onValueChange={(v) => handleChange('taxaReembolso', v)}>
            <SelectTrigger className="h-9"><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="menos1">Menos de 1%</SelectItem>
              <SelectItem value="1-3">1% a 3%</SelectItem>
              <SelectItem value="mais3">Mais de 3%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Permite reembolso parcial? *</Label>
          <RadioGroup value={formData.reembolsoParcial || ''} onValueChange={(v) => handleChange('reembolsoParcial', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="parcial-sim" /><Label htmlFor="parcial-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="parcial-nao" /><Label htmlFor="parcial-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold">Política pública? *</Label>
          <RadioGroup value={formData.politicaReembolsoPublica || ''} onValueChange={(v) => handleChange('politicaReembolsoPublica', v)} className="flex gap-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="sim" id="pol-sim" /><Label htmlFor="pol-sim" className="font-normal text-xs">Sim</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="nao" id="pol-nao" /><Label htmlFor="pol-nao" className="font-normal text-xs">Não</Label></div>
          </RadioGroup>
        </div>
        
        {formData.politicaReembolsoPublica === 'sim' && (
           <div className="space-y-1">
             <Label className="text-xs font-semibold">Link da Política</Label>
             <Input className="h-9" placeholder="https://" value={formData.linkPoliticaReembolso || ''} onChange={(e) => handleChange('linkPoliticaReembolso', e.target.value)} />
           </div>
        )}
      </div>
    </FormSection>
  );
}