import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import FormSection from '@/components/compliance/FormSection';
import { Phone, Plus, Trash2 } from 'lucide-react';
import SelectionButton from '@/components/ui/selection-button';

export default function Section3Canais({ formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem }) {
  const canais = formData.canaisAtendimento || [];

  return (
    <FormSection title="Canais de Atendimento" subtitle="Contatos e reputação" icon={Phone}>
      <div className="space-y-4">
        {/* Canais de Atendimento */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Canais de Atendimento</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              className="h-7 text-xs px-2"
              onClick={() => handleAddArrayItem('canaisAtendimento', { tipo: '', contato: '' })}
            >
              <Plus className="w-3 h-3 mr-1" /> Adicionar
            </Button>
          </div>
          
          {canais.length === 0 && (
            <p className="text-[10px] text-gray-500 italic">Adicione pelo menos um canal obrigatório.</p>
          )}
          
          <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
          {canais.map((canal, index) => (
            <div key={index} className="flex gap-2 items-center p-2 bg-slate-50 rounded-lg border border-slate-100">
              <div className="w-1/3">
                <Select 
                  value={canal.tipo} 
                  onValueChange={(v) => handleArrayChange('canaisAtendimento', index, 'tipo', v)}
                >
                  <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="chat">Chat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input 
                  className="h-8 text-xs"
                  placeholder="Contato" 
                  value={canal.contato}
                  onChange={(e) => handleArrayChange('canaisAtendimento', index, 'contato', e.target.value)}
                />
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveArrayItem('canaisAtendimento', index)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
          </div>
        </div>

        {/* Reclame Aqui */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <Label className="text-xs font-semibold mb-2 block">Tem canal no Reclame Aqui? *</Label>
          <div className="flex gap-2">
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.temReclameAqui === 'sim'}
              onClick={() => handleChange('temReclameAqui', 'sim')}
            >
              Sim
            </SelectionButton>
            <SelectionButton
              className="flex-1 py-1 px-3 text-xs h-8"
              selected={formData.temReclameAqui === 'nao'}
              onClick={() => handleChange('temReclameAqui', 'nao')}
            >
              Não
            </SelectionButton>
          </div>

          {formData.temReclameAqui === 'sim' && (
            <div className="mt-2">
              <Label className="text-xs font-semibold mb-1 block">Link do Reclame Aqui</Label>
              <Input 
                className="h-8 text-xs"
                type="url" 
                placeholder="https://" 
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