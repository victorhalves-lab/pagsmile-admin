import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Phone, Plus, Trash2 } from 'lucide-react';

export default function Section3Canais({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const canais = formData.canaisAtendimento || [];

  return (
    <FormSection title="3. Canais de Atendimento e Reclame Aqui" subtitle="Contatos e reputação" icon={Phone}>
      <div className="space-y-6">
        {/* Canais de Atendimento */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Canais de Atendimento</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleAddArrayItem('canaisAtendimento', { tipo: '', contato: '' })}
            >
              <Plus className="w-4 h-4 mr-1" /> Adicionar Canal
            </Button>
          </div>
          
          {canais.length === 0 && (
            <p className="text-sm text-gray-500 italic">Nenhum canal adicionado. Adicione pelo menos um canal obrigatório.</p>
          )}
          
          {canais.map((canal, index) => (
            <div key={index} className="flex gap-3 items-end p-4 bg-slate-50 rounded-lg">
              <div className="flex-1 space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={canal.tipo} 
                  onValueChange={(v) => handleArrayChange('canaisAtendimento', index, 'tipo', v)}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <Label>Contato</Label>
                <Input 
                  placeholder="Endereço/Número" 
                  value={canal.contato}
                  onChange={(e) => handleArrayChange('canaisAtendimento', index, 'contato', e.target.value)}
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="text-red-500 hover:text-red-700"
                onClick={() => handleRemoveArrayItem('canaisAtendimento', index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Reclame Aqui */}
        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-3">
            <Label>Tem canal no Reclame Aqui? *</Label>
            <RadioGroup 
              value={formData.temReclameAqui || ''} 
              onValueChange={(v) => handleChange('temReclameAqui', v)} 
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sim" id="ra-sim" />
                <Label htmlFor="ra-sim" className="font-normal">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nao" id="ra-nao" />
                <Label htmlFor="ra-nao" className="font-normal">Não</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.temReclameAqui === 'sim' && (
            <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
              <Label>Link do Reclame Aqui</Label>
              <Input 
                type="url" 
                placeholder="https://www.reclameaqui.com.br/empresa/sua-empresa/" 
                value={formData.linkReclameAqui || ''} 
                onChange={(e) => handleChange('linkReclameAqui', e.target.value)} 
              />
            </div>
          )}
        </div>
      </div>
    </FormSection>
  );
}